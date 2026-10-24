package de.glaubitz.glukose

/** Ein Messwert, immer in mg/dL gespeichert; umgerechnet wird erst beim Anzeigen. */
data class Reading(
    val timeMillis: Long,
    val mgdl: Int,
    val trend: Int = 0,
    val isHigh: Boolean = false,
    val isLow: Boolean = false
)

object Units {
    const val MMOL_PER_MGDL = 0.0555

    fun format(mgdl: Int, mmol: Boolean): String =
        if (mmol) String.format(java.util.Locale.GERMANY, "%.1f", mgdl * MMOL_PER_MGDL)
        else mgdl.toString()

    fun label(mmol: Boolean): String = if (mmol) "mmol/l" else "mg/dL"

    /** Eingaben in der angezeigten Einheit auf mg/dL zuruecksetzen. */
    fun toMgdl(value: Double, mmol: Boolean): Int =
        if (mmol) Math.round(value / MMOL_PER_MGDL).toInt() else Math.round(value).toInt()

    fun fromMgdl(mgdl: Int, mmol: Boolean): String =
        if (mmol) String.format(java.util.Locale.GERMANY, "%.1f", mgdl * MMOL_PER_MGDL)
        else mgdl.toString()
}

object Trend {
    /** LibreLinkUp: 1 fallend ... 5 steigend. 0 = unbekannt. */
    fun arrow(trend: Int): String = when (trend) {
        1 -> "↓"   // runter
        2 -> "↘"   // leicht runter
        3 -> "→"   // gleich
        4 -> "↗"   // leicht hoch
        5 -> "↑"   // hoch
        else -> ""
    }

    fun text(trend: Int): String = when (trend) {
        1 -> "faellt schnell"
        2 -> "faellt"
        3 -> "stabil"
        4 -> "steigt"
        5 -> "steigt schnell"
        else -> ""
    }
}

/** Ampelfarbe fuer einen Wert, gemessen an den eingestellten Grenzen. */
object Palette {
    const val LOW = 0xFFFF5252.toInt()
    const val HIGH = 0xFFFFB300.toInt()
    const val OK = 0xFF4CD964.toInt()
    const val STALE = 0xFF9E9E9E.toInt()

    fun colorFor(mgdl: Int, low: Int, high: Int): Int = when {
        mgdl < low -> LOW
        mgdl > high -> HIGH
        else -> OK
    }
}
