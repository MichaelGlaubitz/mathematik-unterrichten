package de.glaubitz.glukose

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.app.PendingIntent
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.graphics.RectF
import android.graphics.Typeface
import android.widget.RemoteViews

/**
 * Startbildschirm-Kachel: großer Wert, Trendpfeil, Alter und eine kleine
 * Verlaufskurve. Alles in ein Bitmap gezeichnet, damit es sauber skaliert.
 */
class GlucoseWidget : AppWidgetProvider() {

    override fun onUpdate(c: Context, manager: AppWidgetManager, ids: IntArray) {
        ids.forEach { id -> render(c, manager, id) }
    }

    companion object {

        fun updateAll(c: Context) {
            val manager = AppWidgetManager.getInstance(c) ?: return
            val ids = manager.getAppWidgetIds(ComponentName(c, GlucoseWidget::class.java))
            ids.forEach { id -> render(c, manager, id) }
        }

        private fun render(c: Context, manager: AppWidgetManager, id: Int) {
            val views = RemoteViews(c.packageName, R.layout.widget)
            views.setImageViewBitmap(R.id.widget_image, draw(c))
            views.setOnClickPendingIntent(
                R.id.widget_root,
                PendingIntent.getActivity(
                    c, 0,
                    Intent(c, MainActivity::class.java)
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            )
            manager.updateAppWidget(id, views)
        }

        private fun draw(c: Context): Bitmap {
            val w = 400
            val h = 400
            val bmp = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bmp)

            val bg = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0xE6101418.toInt() }
            canvas.drawRoundRect(RectF(0f, 0f, w.toFloat(), h.toFloat()), 56f, 56f, bg)

            val reading = Store.latest(c)
            val mmol = Store.mmol(c)
            val low = Store.lowMgdl(c)
            val high = Store.highMgdl(c)

            val text = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                color = Color.WHITE
                textAlign = Paint.Align.CENTER
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }

            if (reading == null) {
                text.textSize = 42f
                text.color = 0x99FFFFFF.toInt()
                canvas.drawText("kein Wert", w / 2f, h / 2f, text)
                return bmp
            }

            val ageMin = ((System.currentTimeMillis() - reading.timeMillis) / 60000L).toInt()
            val stale = ageMin > 20
            val color = if (stale) Palette.STALE else Palette.colorFor(reading.mgdl, low, high)

            // Wert
            val valueText = Units.format(reading.mgdl, mmol)
            text.color = color
            text.textSize = if (valueText.length >= 4) 128f else 152f
            canvas.drawText(valueText, w / 2f - 26f, 190f, text)

            // Trendpfeil daneben
            val arrow = Trend.arrow(reading.trend)
            if (arrow.isNotEmpty()) {
                text.textSize = 76f
                text.textAlign = Paint.Align.LEFT
                canvas.drawText(arrow, w / 2f + 62f, 178f, text)
                text.textAlign = Paint.Align.CENTER
            }

            // Einheit und Alter
            text.color = 0xB3FFFFFF.toInt()
            text.textSize = 34f
            text.typeface = Typeface.DEFAULT
            val ageText = if (ageMin <= 0) "gerade eben" else "vor $ageMin min"
            canvas.drawText("${Units.label(mmol)} · $ageText", w / 2f, 236f, text)

            drawSparkline(c, canvas, w, h, low, high)
            return bmp
        }

        /** Drei Stunden Verlauf als schmale Kurve am unteren Rand. */
        private fun drawSparkline(c: Context, canvas: Canvas, w: Int, h: Int, low: Int, high: Int) {
            val now = System.currentTimeMillis()
            val from = now - 3 * 3600_000L
            val points = Store.history(c).filter { it.timeMillis >= from }
            if (points.size < 2) return

            val top = 274f
            val bottom = (h - 34).toFloat()
            val left = 34f
            val right = (w - 34).toFloat()

            val minY = minOf(points.minOf { it.mgdl }, low) - 15
            val maxY = maxOf(points.maxOf { it.mgdl }, high) + 15
            val span = (maxY - minY).coerceAtLeast(40)

            fun y(mgdl: Int) = bottom - (bottom - top) * ((mgdl - minY).toFloat() / span)
            fun x(t: Long) = left + (right - left) * ((t - from).toFloat() / (now - from).toFloat())

            // Zielbereich andeuten
            val band = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0x1AFFFFFF }
            canvas.drawRect(left, y(high), right, y(low), band)

            val line = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                style = Paint.Style.STROKE
                strokeWidth = 5f
                strokeCap = Paint.Cap.ROUND
                strokeJoin = Paint.Join.ROUND
                color = 0xCCFFFFFF.toInt()
            }
            val path = Path()
            points.forEachIndexed { i, r ->
                if (i == 0) path.moveTo(x(r.timeMillis), y(r.mgdl))
                else path.lineTo(x(r.timeMillis), y(r.mgdl))
            }
            canvas.drawPath(path, line)
        }
    }
}
