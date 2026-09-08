package de.glaubitz.glukose

import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder

/**
 * Hält die dauerhafte Anzeige in der Statusleiste und hält den Prozess am
 * Leben. Der eigentliche Abruf läuft über den Alarm im PollReceiver.
 */
class GlucoseService : Service() {

    companion object {
        const val ACTION_STOP = "de.glaubitz.glukose.STOP"

        fun start(c: Context) {
            Store.setRunning(c, true)
            val intent = Intent(c, GlucoseService::class.java)
            try {
                c.startForegroundService(intent)
            } catch (e: Exception) {
                // Darf der Dienst gerade nicht starten, traegt wenigstens der
                // Alarm den Fuenf-Minuten-Takt weiter.
                Scheduler.scheduleNext(c, delayMs = 1_000L)
            }
        }

        fun stop(c: Context) {
            Store.setRunning(c, false)
            Scheduler.cancel(c)
            c.stopService(Intent(c, GlucoseService::class.java))
            c.getSystemService(android.app.NotificationManager::class.java)
                .cancel(Notifications.ID_STATUS)
            GlucoseWidget.updateAll(c)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stop(this)
            return START_NOT_STICKY
        }

        Notifications.ensureChannels(this)
        val notification = Notifications.buildStatus(this)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                Notifications.ID_STATUS, notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            )
        } else {
            startForeground(Notifications.ID_STATUS, notification)
        }

        Store.setRunning(this, true)
        Scheduler.scheduleNext(this, delayMs = 1_000L)
        return START_STICKY
    }
}
