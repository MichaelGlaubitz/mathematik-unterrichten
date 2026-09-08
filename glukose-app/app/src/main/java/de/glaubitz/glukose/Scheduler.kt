package de.glaubitz.glukose

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build

/**
 * Der Fünf-Minuten-Takt. Ein exakter Alarm ist der einzige Weg, der auch im
 * Doze-Modus zuverlässig feuert; ohne Ausnahme von der Akku-Optimierung
 * streckt Android den Abstand.
 */
object Scheduler {

    const val INTERVAL_MS = 5 * 60_000L
    private const val REQUEST_CODE = 42

    private fun pendingIntent(c: Context): PendingIntent =
        PendingIntent.getBroadcast(
            c, REQUEST_CODE,
            Intent(c, PollReceiver::class.java).setAction(PollReceiver.ACTION_POLL),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

    fun scheduleNext(c: Context, delayMs: Long = INTERVAL_MS) {
        val am = c.getSystemService(AlarmManager::class.java)
        val triggerAt = System.currentTimeMillis() + delayMs
        val pi = pendingIntent(c)
        val exactAllowed = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms()
        try {
            if (exactAllowed) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi)
            } else {
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi)
            }
        } catch (e: SecurityException) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi)
        }
    }

    fun cancel(c: Context) {
        c.getSystemService(AlarmManager::class.java).cancel(pendingIntent(c))
    }
}
