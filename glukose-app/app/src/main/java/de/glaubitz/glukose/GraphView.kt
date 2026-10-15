package de.glaubitz.glukose

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.util.AttributeSet
import android.view.View
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** Verlaufskurve der letzten Stunden mit farbig hinterlegtem Zielbereich. */
class GraphView @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyle: Int = 0
) : View(context, attrs, defStyle) {

    private var readings: List<Reading> = emptyList()
    private var low = 70
    private var high = 180
    private var mmol = false
    private var hours = 6

    private val bandPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0x1A4CD964 }
    private val gridPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0x22FFFFFF; strokeWidth = 1f
    }
    private val linePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 4f
        strokeCap = Paint.Cap.ROUND
        strokeJoin = Paint.Join.ROUND
        color = Color.WHITE
    }
    private val dotPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0x99FFFFFF.toInt()
        textSize = 26f
    }

    fun setData(readings: List<Reading>, low: Int, high: Int, mmol: Boolean, hours: Int = 6) {
        this.readings = readings
        this.low = low
        this.high = high
        this.mmol = mmol
        this.hours = hours
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        val padLeft = 76f
        val padRight = 12f
        val padTop = 12f
        val padBottom = 34f
        val w = width.toFloat()
        val h = height.toFloat()
        val plotW = w - padLeft - padRight
        val plotH = h - padTop - padBottom
        if (plotW <= 0 || plotH <= 0) return

        val now = System.currentTimeMillis()
        val from = now - hours * 3600_000L
        val visible = readings.filter { it.timeMillis >= from }

        // Y-Bereich: Zielbereich immer sichtbar, Ausreißer dehnen die Skala.
        val values = visible.map { it.mgdl }
        val minY = minOf(values.minOrNull() ?: low, low) - 20
        val maxY = maxOf(values.maxOrNull() ?: high, high) + 20
        val spanY = (maxY - minY).coerceAtLeast(40)

        fun yFor(mgdl: Int): Float = padTop + plotH * (1f - (mgdl - minY).toFloat() / spanY)
        fun xFor(t: Long): Float = padLeft + plotW * ((t - from).toFloat() / (now - from).toFloat())

        // Zielbereich
        canvas.drawRect(padLeft, yFor(high), w - padRight, yFor(low), bandPaint)

        // Gitter und Beschriftung
        for (mgdl in intArrayOf(low, high)) {
            val y = yFor(mgdl)
            canvas.drawLine(padLeft, y, w - padRight, y, gridPaint)
            canvas.drawText(Units.format(mgdl, mmol), 6f, y + 9f, textPaint)
        }

        // Stundenmarken
        val fmt = SimpleDateFormat("HH", Locale.GERMANY)
        for (i in 0..hours) {
            val t = from + i * 3600_000L
            val x = xFor(t)
            canvas.drawLine(x, padTop, x, padTop + plotH, gridPaint)
            if (i % 2 == 0) {
                canvas.drawText(fmt.format(Date(t)), x - 12f, h - 8f, textPaint)
            }
        }

        if (visible.size < 2) {
            canvas.drawText("Noch kein Verlauf", padLeft + 12f, padTop + plotH / 2, textPaint)
            return
        }

        // Kurve; bei Lücken über fünf Minuten wird der Strich abgesetzt.
        val path = Path()
        var started = false
        var previousTime = 0L
        visible.forEach { r ->
            val x = xFor(r.timeMillis)
            val y = yFor(r.mgdl)
            val gap = started && r.timeMillis - previousTime > 20 * 60_000L
            if (!started || gap) path.moveTo(x, y) else path.lineTo(x, y)
            started = true
            previousTime = r.timeMillis
        }
        canvas.drawPath(path, linePaint)

        // Messpunkte in Ampelfarbe
        visible.forEach { r ->
            dotPaint.color = Palette.colorFor(r.mgdl, low, high)
            canvas.drawCircle(xFor(r.timeMillis), yFor(r.mgdl), 4f, dotPaint)
        }

        // Der jüngste Wert bekommt einen dicken Punkt.
        visible.lastOrNull()?.let { r ->
            dotPaint.color = Palette.colorFor(r.mgdl, low, high)
            canvas.drawCircle(xFor(r.timeMillis), yFor(r.mgdl), 9f, dotPaint)
        }
    }
}
