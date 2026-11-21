package de.glaubitz.glukose

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * Einstellungen, Zugangsdaten und Messwert-Verlauf.
 * Das Passwort liegt AES-GCM-verschluesselt; der Schluessel steckt im
 * Android-Keystore und verlaesst das Geraet nicht.
 */
object Store {
    private const val PREFS = "glukose"
    private const val KEY_ALIAS = "glukose_secret_v1"

    private fun prefs(c: Context) = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    // ---- Zugangsdaten ----

    fun email(c: Context): String = prefs(c).getString("email", "") ?: ""

    fun setCredentials(c: Context, email: String, password: String) {
        prefs(c).edit()
            .putString("email", email.trim())
            .putString("password", encrypt(password))
            .remove("token")
            .remove("accountId")
            .remove("patientId")
            .apply()
    }

    fun password(c: Context): String = decrypt(prefs(c).getString("password", "") ?: "")

    fun hasCredentials(c: Context): Boolean =
        email(c).isNotEmpty() && password(c).isNotEmpty()

    // ---- Sitzung ----

    fun token(c: Context): String = prefs(c).getString("token", "") ?: ""
    fun accountId(c: Context): String = prefs(c).getString("accountId", "") ?: ""
    fun region(c: Context): String = prefs(c).getString("region", "") ?: ""
    fun patientId(c: Context): String = prefs(c).getString("patientId", "") ?: ""

    fun saveSession(c: Context, token: String, accountId: String) {
        prefs(c).edit().putString("token", token).putString("accountId", accountId).apply()
    }

    fun saveRegion(c: Context, region: String) {
        prefs(c).edit().putString("region", region).apply()
    }

    fun savePatientId(c: Context, id: String) {
        prefs(c).edit().putString("patientId", id).apply()
    }

    fun clearSession(c: Context) {
        prefs(c).edit().remove("token").remove("accountId").apply()
    }

    // ---- Einstellungen ----

    fun lowMgdl(c: Context): Int = prefs(c).getInt("low", 70)
    fun highMgdl(c: Context): Int = prefs(c).getInt("high", 180)
    fun mmol(c: Context): Boolean = prefs(c).getBoolean("mmol", false)
    fun alarms(c: Context): Boolean = prefs(c).getBoolean("alarms", true)
    fun running(c: Context): Boolean = prefs(c).getBoolean("running", false)

    fun setSettings(c: Context, low: Int, high: Int, mmol: Boolean, alarms: Boolean) {
        prefs(c).edit()
            .putInt("low", low).putInt("high", high)
            .putBoolean("mmol", mmol).putBoolean("alarms", alarms)
            .apply()
    }

    fun setRunning(c: Context, running: Boolean) {
        prefs(c).edit().putBoolean("running", running).apply()
    }

    // ---- Letzter Stand ----

    fun lastError(c: Context): String = prefs(c).getString("lastError", "") ?: ""
    fun setLastError(c: Context, msg: String) {
        prefs(c).edit().putString("lastError", msg).apply()
    }

    fun lastAlarmAt(c: Context): Long = prefs(c).getLong("lastAlarmAt", 0L)
    fun setLastAlarmAt(c: Context, t: Long) {
        prefs(c).edit().putLong("lastAlarmAt", t).apply()
    }

    fun lastAlarmKind(c: Context): String = prefs(c).getString("lastAlarmKind", "") ?: ""
    fun setLastAlarmKind(c: Context, kind: String) {
        prefs(c).edit().putString("lastAlarmKind", kind).apply()
    }

    // ---- Verlauf ----

    private fun historyFile(c: Context) = File(c.filesDir, "history.json")

    /** Fuegt Messwerte hinzu, entfernt Duplikate und alles aelter als 24 h. */
    @Synchronized
    fun mergeHistory(c: Context, readings: List<Reading>) {
        val byTime = LinkedHashMap<Long, Reading>()
        history(c).forEach { byTime[it.timeMillis / 60000] = it }
        readings.forEach { byTime[it.timeMillis / 60000] = it }
        val cutoff = System.currentTimeMillis() - 24L * 3600_000L
        val kept = byTime.values.filter { it.timeMillis >= cutoff }.sortedBy { it.timeMillis }
        val arr = JSONArray()
        kept.forEach { r ->
            arr.put(JSONObject().put("t", r.timeMillis).put("v", r.mgdl).put("d", r.trend))
        }
        runCatching { historyFile(c).writeText(arr.toString()) }
    }

    @Synchronized
    fun history(c: Context): List<Reading> {
        val f = historyFile(c)
        if (!f.exists()) return emptyList()
        return runCatching {
            val arr = JSONArray(f.readText())
            (0 until arr.length()).map { i ->
                val o = arr.getJSONObject(i)
                Reading(o.getLong("t"), o.getInt("v"), o.optInt("d", 0))
            }
        }.getOrDefault(emptyList())
    }

    fun latest(c: Context): Reading? = history(c).lastOrNull()

    // ---- Keystore ----

    private fun secretKey(): SecretKey {
        val ks = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        (ks.getEntry(KEY_ALIAS, null) as? KeyStore.SecretKeyEntry)?.let { return it.secretKey }
        val gen = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
        gen.init(
            KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .build()
        )
        return gen.generateKey()
    }

    private fun encrypt(plain: String): String = runCatching {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, secretKey())
        val iv = cipher.iv
        val data = cipher.doFinal(plain.toByteArray(Charsets.UTF_8))
        Base64.encodeToString(iv, Base64.NO_WRAP) + ":" +
            Base64.encodeToString(data, Base64.NO_WRAP)
    }.getOrDefault("")

    private fun decrypt(stored: String): String = runCatching {
        if (stored.isEmpty()) return ""
        val parts = stored.split(":")
        if (parts.size != 2) return ""
        val iv = Base64.decode(parts[0], Base64.NO_WRAP)
        val data = Base64.decode(parts[1], Base64.NO_WRAP)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, secretKey(), GCMParameterSpec(128, iv))
        String(cipher.doFinal(data), Charsets.UTF_8)
    }.getOrDefault("")
}
