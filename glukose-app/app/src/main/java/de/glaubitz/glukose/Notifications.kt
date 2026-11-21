package de.glaubitz.glukose

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.drawable.Icon
import android.os.Build

object Notifications {

    const val CHANNEL_STATUS = "glukose_status"
    const val CHANNEL_ALARM = "glukose_alarm"
    const val ID_STATUS = 1
    const val ID_ALARM = 2

    fun ensureChannels(c: Context) {
        val nm = c.getSystemService(NotificationManager::class.java)

        val status = NotificationChannel(
            CHANNEL_STATUS, "Aktueller Wert", NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "Dauerhafte Anzeige des zuletzt abgerufenen Glukosewerts"
            setShowBadge(false)
            enableVibration(false)
            setSound(null, null)
        }
        nm.createNotificationChannel(status)

        val alarm = NotificationChannel(
            CHANNEL_ALARM, "Grenzwert-Alarm", NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Meldung, wenn der Wert die eingestellten Grenzen verlässt"
            enableVibration(true)
            vibrationPattern = longArrayOf(0, 400, 200, 400)
        }
        nm.createNotificationChannel(alarm)
    }

    private fun openAppIntent(c: Context): PendingIntent =
        PendingIntent.getActivity(
            c, 0,
            Intent(c, MainActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

    /**
     * Der Zahlenwert wird selbst als Statusleisten-Symbol gezeichnet — so steht
     * er oben im Bildschirmrand, ohne dass man die Leiste aufziehen muss.
     */
    private fun valueIcon(text: String): Icon {
        val size = 96
        val bmp = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bmp)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            textAlign = Paint.Align.CENTER
        }
        // Schriftgröße so wählen, dass auch „12,3“ noch in das Symbol passt.
        paint.textSize = when {
            text.length <= 2 -> 78f
            text.length == 3 -> 62f
            text.length == 4 -> 48f
            else -> 40f
        }
        val metrics = paint.fontMetrics
        val baseline = size / 2f - (metrics.ascent + metrics.descent) / 2f
        canvas.drawText(text, size / 2f, baseline, paint)
        return Icon.createWithBitmap(bmp)
    }

    /** Die dauerhafte Anzeige: Wert, Pfeil, Alter und Ampelfarbe. */
    fun buildStatus(c: Context): Notification {
        val reading = Store.latest(c)
        val mmol = Store.mmol(c)
        val low = Store.lowMgdl(c)
        val high = Store.highMgdl(c)
        val error = Store.lastError(c)

        val builder = Notification.Builder(c, CHANNEL_STATUS)
            .setSmallIcon(android.R.drawable.stat_notify_sync)
            .setContentIntent(openAppIntent(c))
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setShowWhen(false)
            .setCategory(Notification.CATEGORY_STATUS)

        if (reading == null) {
            builder.setContentTitle("Noch kein Wert")
            builder.setContentText(error.ifEmpty { "Warte auf die erste Abfrage …" })
            return builder.build()
        }

        val ageMin = ((System.currentTimeMillis() - reading.timeMillis) / 60000L).toInt()
        val stale = ageMin > 20
        val valueText = Units.format(reading.mgdl, mmol)
        val arrow = Trend.arrow(reading.trend)

        builder.setSmallIcon(valueIcon(valueText))
        builder.setContentTitle("$valueText $arrow ${Units.label(mmol)}")

        val ageText = when {
            ageMin <= 0 -> "gerade eben"
            ageMin == 1 -> "vor 1 Minute"
            else -> "vor $ageMin Minuten"
        }
        val trendText = Trend.text(reading.trend)
        val parts = ArrayList<String>()
        parts.add(ageText)
        if (trendText.isNotEmpty()) parts.add(trendText)
        when {
            reading.mgdl < low -> parts.add("unter ${Units.format(low, mmol)}")
            reading.mgdl > high -> parts.add("über ${Units.format(high, mmol)}")
        }
        if (error.isNotEmpty()) parts.add(error)
        builder.setContentText(parts.joinToString(" · "))

        builder.setColor(
            if (stale) Palette.STALE else Palette.colorFor(reading.mgdl, low, high)
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) builder.setColorized(false)
        return builder.build()
    }

    fun showStatus(c: Context) {
        ensureChannels(c)
        c.getSystemService(NotificationManager::class.java)
            .notify(ID_STATUS, buildStatus(c))
    }

    /** Lauter Alarm bei Über- oder Unterschreitung, höchstens alle 20 Minuten. */
    fun maybeAlarm(c: Context, reading: Reading) {
        if (!Store.alarms(c)) return
        // Ein alter Wert sagt nichts ueber das Jetzt — dafuer gibt es keinen Alarm.
        if (System.currentTimeMillis() - reading.timeMillis > 20 * 60_000L) return
        val low = Store.lowMgdl(c)
        val high = Store.highMgdl(c)
        val kind = when {
            reading.mgdl < low -> "low"
            reading.mgdl > high -> "high"
            else -> ""
        }
        if (kind.isEmpty()) {
            Store.setLastAlarmKind(c, "")
            c.getSystemService(NotificationManager::class.java).cancel(ID_ALARM)
            return
        }

        val now = System.currentTimeMillis()
        val sameAsBefore = Store.lastAlarmKind(c) == kind
        val quietPeriod = now - Store.lastAlarmAt(c) < 20 * 60_000L
        if (sameAsBefore && quietPeriod) return

        Store.setLastAlarmKind(c, kind)
        Store.setLastAlarmAt(c, now)

        val mmol = Store.mmol(c)
        val valueText = "${Units.format(reading.mgdl, mmol)} ${Units.label(mmol)}"
        val title = if (kind == "low") "Unterzucker: $valueText" else "Hoher Wert: $valueText"
        val body = if (kind == "low")
            "Unter ${Units.format(low, mmol)} — ${Trend.text(reading.trend)}"
        else
            "Über ${Units.format(high, mmol)} — ${Trend.text(reading.trend)}"

        ensureChannels(c)
        val n = Notification.Builder(c, CHANNEL_ALARM)
            .setSmallIcon(android.R.drawable.stat_notify_error)
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(openAppIntent(c))
            .setAutoCancel(true)
            .setCategory(Notification.CATEGORY_ALARM)
            .setColor(if (kind == "low") Palette.LOW else Palette.HIGH)
            .build()
        c.getSystemService(NotificationManager::class.java).notify(ID_ALARM, n)
    }
}
