package de.glaubitz.glukose

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.PowerManager

/** Wird alle fünf Minuten vom Alarm geweckt, holt den Wert und plant den nächsten Abruf. */
class PollReceiver : BroadcastReceiver() {

    companion object {
        const val ACTION_POLL = "de.glaubitz.glukose.POLL"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val app = context.applicationContext
        if (!Store.running(app)) return

        // Direkt den nächsten Takt setzen, damit die Kette auch bei einem
        // fehlgeschlagenen Abruf nicht abreißt.
        Scheduler.scheduleNext(app)

        val pending = goAsync()
        val pm = app.getSystemService(PowerManager::class.java)
        val wake = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "glukose:poll")
        wake.acquire(60_000L)

        Repo.refreshAsync(app) {
            runCatching { if (wake.isHeld) wake.release() }
            pending.finish()
        }
    }
}
