package de.glaubitz.glukose

import android.content.Context
import org.json.JSONObject
import java.io.BufferedReader
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class LibreError(message: String, val needsLogin: Boolean = false) : Exception(message)

/**
 * Zugriff auf LibreLinkUp — dieselbe Schnittstelle, die die LibreLinkUp-App
 * benutzt. Voraussetzung: In der FreeStyle-LibreLink-App ist die Freigabe an
 * dieses LibreLinkUp-Konto eingeschaltet.
 */
object LibreLink {

    private const val PRODUCT = "llu.android"
    private const val VERSION = "4.12.0"
    private const val UA = "Mozilla/5.0 (Linux; Android 14; Pixel) LibreLinkUp/4.12.0"

    private fun baseUrl(region: String): String =
        if (region.isEmpty()) "https://api.libreview.io" else "https://api-$region.libreview.io"

    // ---------------------------------------------------------------- HTTP

    private fun request(
        url: String,
        method: String,
        body: String?,
        token: String,
        accountId: String
    ): JSONObject {
        val conn = (URL(url).openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 20_000
            readTimeout = 20_000
            instanceFollowRedirects = false
            setRequestProperty("product", PRODUCT)
            setRequestProperty("version", VERSION)
            setRequestProperty("User-Agent", UA)
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("Cache-Control", "no-cache")
            if (token.isNotEmpty()) setRequestProperty("Authorization", "Bearer $token")
            if (accountId.isNotEmpty()) setRequestProperty("Account-Id", accountId)
            if (body != null) doOutput = true
        }
        try {
            if (body != null) {
                conn.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            }
            val code = conn.responseCode
            val stream = if (code in 200..299) conn.inputStream else conn.errorStream
            val text = stream?.bufferedReader()?.use(BufferedReader::readText) ?: ""

            if (code == 401 || code == 403) {
                throw LibreError("Anmeldung abgelaufen.", needsLogin = true)
            }
            if (code == 429) {
                throw LibreError("Zu viele Anfragen — LibreLinkUp bremst gerade. Später erneut versuchen.")
            }
            if (code !in 200..299) {
                throw LibreError("LibreLinkUp antwortet mit Fehler $code.")
            }
            if (text.isBlank()) throw LibreError("Leere Antwort von LibreLinkUp.")
            return JSONObject(text)
        } catch (e: LibreError) {
            throw e
        } catch (e: Exception) {
            throw LibreError("Keine Verbindung zu LibreLinkUp (${e.javaClass.simpleName}).")
        } finally {
            conn.disconnect()
        }
    }

    private fun sha256Hex(input: String): String =
        MessageDigest.getInstance("SHA-256")
            .digest(input.toByteArray(Charsets.UTF_8))
            .joinToString("") { "%02x".format(it) }

    // --------------------------------------------------------------- Login

    /** Meldet an und legt Token, Account-Id und Region ab. */
    fun login(c: Context) {
        val email = Store.email(c)
        val password = Store.password(c)
        if (email.isEmpty() || password.isEmpty()) {
            throw LibreError("Es sind noch keine Zugangsdaten hinterlegt.")
        }
        val body = JSONObject().put("email", email).put("password", password).toString()

        var region = Store.region(c)
        var json = request("${baseUrl(region)}/llu/auth/login", "POST", body, "", "")

        // Konten ausserhalb der Standardregion werden einmal umgeleitet.
        var data = json.optJSONObject("data")
        if (data != null && data.optBoolean("redirect", false)) {
            region = data.optString("region", "")
            if (region.isEmpty()) throw LibreError("LibreLinkUp nennt keine Region.")
            Store.saveRegion(c, region)
            json = request("${baseUrl(region)}/llu/auth/login", "POST", body, "", "")
            data = json.optJSONObject("data")
        }

        when (json.optInt("status", -1)) {
            0 -> Unit
            2 -> throw LibreError("E-Mail oder Passwort stimmt nicht.")
            4 -> throw LibreError(
                "LibreLinkUp verlangt eine Zustimmung. Einmal in der LibreLinkUp-App anmelden " +
                    "und die Bedingungen bestätigen, danach hier erneut verbinden."
            )
            else -> throw LibreError("Anmeldung fehlgeschlagen (Status ${json.optInt("status", -1)}).")
        }

        val ticket = data?.optJSONObject("authTicket")
            ?: throw LibreError("Anmeldung ohne Token — vermutlich muss in der LibreLinkUp-App noch etwas bestätigt werden.")
        val token = ticket.optString("token", "")
        val userId = data.optJSONObject("user")?.optString("id", "") ?: ""
        if (token.isEmpty() || userId.isEmpty()) throw LibreError("Anmeldung unvollständig.")

        Store.saveSession(c, token, sha256Hex(userId))
    }

    private fun ensureSession(c: Context) {
        if (Store.token(c).isEmpty() || Store.accountId(c).isEmpty()) login(c)
    }

    // ---------------------------------------------------------- Verbindung

    /** Ermittelt die Patienten-Kennung des freigegebenen Sensors. */
    private fun fetchPatientId(c: Context): String {
        val json = request(
            "${baseUrl(Store.region(c))}/llu/connections",
            "GET", null, Store.token(c), Store.accountId(c)
        )
        val arr = json.optJSONArray("data")
        if (arr == null || arr.length() == 0) {
            throw LibreError(
                "LibreLinkUp zeigt keine Freigabe. In der FreeStyle-LibreLink-App unter " +
                    "„Verbundene Apps“ die Freigabe an LibreLinkUp einschalten."
            )
        }
        val id = arr.getJSONObject(0).optString("patientId", "")
        if (id.isEmpty()) throw LibreError("Freigabe ohne Kennung erhalten.")
        Store.savePatientId(c, id)
        return id
    }

    // ------------------------------------------------------------- Abfrage

    /**
     * Holt den aktuellen Wert samt Verlauf. Erneuert die Anmeldung selbst,
     * wenn das Token abgelaufen ist.
     */
    fun fetch(c: Context): List<Reading> = try {
        fetchOnce(c)
    } catch (e: LibreError) {
        if (e.needsLogin) {
            Store.clearSession(c)
            login(c)
            fetchOnce(c)
        } else throw e
    }

    private fun fetchOnce(c: Context): List<Reading> {
        ensureSession(c)
        val patientId = Store.patientId(c).ifEmpty { fetchPatientId(c) }

        val json = request(
            "${baseUrl(Store.region(c))}/llu/connections/$patientId/graph",
            "GET", null, Store.token(c), Store.accountId(c)
        )
        val data = json.optJSONObject("data") ?: throw LibreError("Keine Messdaten erhalten.")

        val out = ArrayList<Reading>()

        data.optJSONArray("graphData")?.let { arr ->
            for (i in 0 until arr.length()) {
                parseMeasurement(arr.optJSONObject(i))?.let(out::add)
            }
        }
        // Der aktuelle Wert steckt separat und ist der jüngste.
        parseMeasurement(data.optJSONObject("connection")?.optJSONObject("glucoseMeasurement"))
            ?.let(out::add)

        if (out.isEmpty()) {
            throw LibreError("LibreLinkUp liefert gerade keinen Wert. Läuft die LibreLink-App auf dem Handy mit dem Sensor?")
        }
        return out.sortedBy { it.timeMillis }
    }

    private fun parseMeasurement(o: JSONObject?): Reading? {
        if (o == null) return null
        val mgdl = when {
            o.has("ValueInMgPerDl") -> o.optInt("ValueInMgPerDl", -1)
            o.has("Value") -> o.optInt("Value", -1)
            else -> -1
        }
        if (mgdl <= 0) return null
        val time = parseTime(o.optString("FactoryTimestamp", ""), utc = true)
            ?: parseTime(o.optString("Timestamp", ""), utc = false)
            ?: return null
        return Reading(
            timeMillis = time,
            mgdl = mgdl,
            trend = o.optInt("TrendArrow", 0),
            isHigh = o.optBoolean("isHigh", false),
            isLow = o.optBoolean("isLow", false)
        )
    }

    /** LibreLinkUp liefert Zeiten als „9/7/2026 10:05:00 AM“. */
    private fun parseTime(value: String, utc: Boolean): Long? {
        if (value.isBlank()) return null
        for (pattern in arrayOf("M/d/yyyy h:mm:ss a", "M/d/yyyy H:mm:ss")) {
            val fmt = SimpleDateFormat(pattern, Locale.US)
            if (utc) fmt.timeZone = TimeZone.getTimeZone("UTC")
            val parsed = runCatching { fmt.parse(value) }.getOrNull()
            if (parsed != null) return parsed.time
        }
        return null
    }
}
