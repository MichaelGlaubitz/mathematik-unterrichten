package de.glaubitz.glukose

import android.content.Context
import java.util.concurrent.Executors

/** Ein Abruf, eine Stelle: holen, ablegen, Anzeige überall nachziehen. */
object Repo {

    private val executor = Executors.newSingleThreadExecutor()

    /** Läuft im Hintergrund-Thread. Gibt null bei Erfolg zurück, sonst den Fehlertext. */
    fun refreshBlocking(c: Context): String? {
        val app = c.applicationContext
        return try {
            val readings = LibreLink.fetch(app)
            Store.mergeHistory(app, readings)
            Store.setLastError(app, "")
            Store.latest(app)?.let { Notifications.maybeAlarm(app, it) }
            null
        } catch (e: LibreError) {
            Store.setLastError(app, e.message ?: "Unbekannter Fehler")
            e.message
        } catch (e: Exception) {
            val msg = "Unerwarteter Fehler: ${e.javaClass.simpleName}"
            Store.setLastError(app, msg)
            msg
        } finally {
            if (Store.running(app)) Notifications.showStatus(app)
            GlucoseWidget.updateAll(app)
        }
    }

    fun refreshAsync(c: Context, onDone: ((String?) -> Unit)? = null) {
        val app = c.applicationContext
        executor.execute {
            val error = refreshBlocking(app)
            onDone?.invoke(error)
        }
    }
}
