package de.glaubitz.glukose

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.provider.Settings
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.TextView
import android.widget.Toast

class MainActivity : Activity() {

    private lateinit var valueView: TextView
    private lateinit var arrowView: TextView
    private lateinit var unitView: TextView
    private lateinit var sublineView: TextView
    private lateinit var statusView: TextView
    private lateinit var graph: GraphView
    private lateinit var emailField: EditText
    private lateinit var passwordField: EditText
    private lateinit var lowField: EditText
    private lateinit var highField: EditText
    private lateinit var mmolSwitch: Switch
    private lateinit var alarmSwitch: Switch
    private lateinit var batteryHint: TextView

    private val handler = Handler(Looper.getMainLooper())
    private val tick = object : Runnable {
        override fun run() {
            render()
            handler.postDelayed(this, 30_000L)
        }
    }

    /** Merkt sich, in welcher Einheit die Grenzfelder gerade stehen. */
    private var fieldsInMmol = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        valueView = findViewById(R.id.value)
        arrowView = findViewById(R.id.arrow)
        unitView = findViewById(R.id.unit)
        sublineView = findViewById(R.id.subline)
        statusView = findViewById(R.id.status)
        graph = findViewById(R.id.graph)
        emailField = findViewById(R.id.email)
        passwordField = findViewById(R.id.password)
        lowField = findViewById(R.id.low)
        highField = findViewById(R.id.high)
        mmolSwitch = findViewById(R.id.mmol)
        alarmSwitch = findViewById(R.id.alarms)
        batteryHint = findViewById(R.id.battery_hint)

        Notifications.ensureChannels(this)
        loadSettingsIntoFields()

        mmolSwitch.setOnCheckedChangeListener { _, checked ->
            if (checked != fieldsInMmol) convertFields(toMmol = checked)
        }

        findViewById<Button>(R.id.connect).setOnClickListener { connect() }
        findViewById<Button>(R.id.refresh).setOnClickListener { refreshNow() }
        findViewById<Button>(R.id.save).setOnClickListener { saveSettings(toast = true) }
        findViewById<Button>(R.id.battery).setOnClickListener { askBatteryExemption() }
        findViewById<Button>(R.id.stop).setOnClickListener {
            GlucoseService.stop(this)
            Toast.makeText(this, "Überwachung angehalten", Toast.LENGTH_SHORT).show()
            render()
        }

        askNotificationPermission()
    }

    override fun onResume() {
        super.onResume()
        handler.post(tick)
        if (Store.running(this) && Store.hasCredentials(this)) refreshNow(silent = true)
    }

    override fun onPause() {
        super.onPause()
        handler.removeCallbacks(tick)
    }

    // ------------------------------------------------------------- Anzeige

    private fun render() {
        val mmol = Store.mmol(this)
        val low = Store.lowMgdl(this)
        val high = Store.highMgdl(this)
        val reading = Store.latest(this)

        unitView.text = Units.label(mmol)

        if (reading == null) {
            valueView.text = "--"
            arrowView.text = ""
            sublineView.text = if (Store.hasCredentials(this))
                "Warte auf den ersten Abruf …" else "Noch nicht verbunden"
        } else {
            val ageMin = ((System.currentTimeMillis() - reading.timeMillis) / 60000L).toInt()
            valueView.text = Units.format(reading.mgdl, mmol)
            valueView.setTextColor(
                if (ageMin > 20) Palette.STALE else Palette.colorFor(reading.mgdl, low, high)
            )
            arrowView.text = Trend.arrow(reading.trend)
            val ageText = when {
                ageMin <= 0 -> "gerade eben"
                ageMin == 1 -> "vor 1 Minute"
                else -> "vor $ageMin Minuten"
            }
            val trendText = Trend.text(reading.trend)
            sublineView.text = listOf(ageText, trendText).filter { it.isNotEmpty() }
                .joinToString(" · ") +
                if (Store.running(this)) "  ·  Abruf alle 5 Minuten" else "  ·  angehalten"
        }

        graph.setData(Store.history(this), low, high, mmol)

        val error = Store.lastError(this)
        statusView.visibility = if (error.isEmpty()) View.GONE else View.VISIBLE
        statusView.text = error

        val pm = getSystemService(PowerManager::class.java)
        val exempt = pm.isIgnoringBatteryOptimizations(packageName)
        batteryHint.text = if (exempt)
            "Akku-Optimierung ist ausgeschaltet — der Fünf-Minuten-Takt läuft durch."
        else
            "Solange die Akku-Optimierung aktiv ist, streckt Android den Takt im Ruhezustand auf 15 Minuten und mehr."
    }

    // ---------------------------------------------------------- Bedienung

    private fun connect() {
        val email = emailField.text.toString().trim()
        val password = passwordField.text.toString()
        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "E-Mail und Passwort eintragen", Toast.LENGTH_SHORT).show()
            return
        }
        saveSettings(toast = false)
        Store.setCredentials(this, email, password)
        passwordField.setText("")

        statusView.visibility = View.VISIBLE
        statusView.setTextColor(0xB3FFFFFF.toInt())
        statusView.text = "Melde an …"

        GlucoseService.start(this)
        Repo.refreshAsync(this) { error ->
            runOnUiThread {
                statusView.setTextColor(0xFFFFB4A9.toInt())
                if (error == null) {
                    Toast.makeText(this, "Verbunden", Toast.LENGTH_SHORT).show()
                }
                render()
            }
        }
    }

    private fun refreshNow(silent: Boolean = false) {
        if (!Store.hasCredentials(this)) {
            if (!silent) Toast.makeText(this, "Erst verbinden", Toast.LENGTH_SHORT).show()
            return
        }
        Repo.refreshAsync(this) { runOnUiThread { render() } }
    }

    private fun loadSettingsIntoFields() {
        val mmol = Store.mmol(this)
        fieldsInMmol = mmol
        emailField.setText(Store.email(this))
        mmolSwitch.isChecked = mmol
        alarmSwitch.isChecked = Store.alarms(this)
        lowField.setText(Units.fromMgdl(Store.lowMgdl(this), mmol))
        highField.setText(Units.fromMgdl(Store.highMgdl(this), mmol))
    }

    /** Grenzfelder beim Einheitenwechsel mitrechnen statt Zahlen stehen lassen. */
    private fun convertFields(toMmol: Boolean) {
        val low = readField(lowField, fieldsInMmol, fallback = 70)
        val high = readField(highField, fieldsInMmol, fallback = 180)
        fieldsInMmol = toMmol
        lowField.setText(Units.fromMgdl(low, toMmol))
        highField.setText(Units.fromMgdl(high, toMmol))
    }

    private fun readField(field: EditText, mmol: Boolean, fallback: Int): Int {
        val raw = field.text.toString().replace(',', '.').trim()
        val value = raw.toDoubleOrNull() ?: return fallback
        return Units.toMgdl(value, mmol)
    }

    private fun saveSettings(toast: Boolean) {
        val mmol = mmolSwitch.isChecked
        var low = readField(lowField, fieldsInMmol, fallback = 70)
        var high = readField(highField, fieldsInMmol, fallback = 180)
        if (low >= high) {
            Toast.makeText(this, "Untergrenze muss kleiner als Obergrenze sein", Toast.LENGTH_SHORT).show()
            return
        }
        low = low.coerceIn(40, 200)
        high = high.coerceIn(90, 400)

        Store.setSettings(this, low, high, mmol, alarmSwitch.isChecked)
        fieldsInMmol = mmol
        lowField.setText(Units.fromMgdl(low, mmol))
        highField.setText(Units.fromMgdl(high, mmol))

        Notifications.showStatus(this)
        GlucoseWidget.updateAll(this)
        render()
        if (toast) Toast.makeText(this, "Gespeichert", Toast.LENGTH_SHORT).show()
    }

    // ------------------------------------------------------------ Freigaben

    private fun askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) !=
            PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1)
        }
    }

    private fun askBatteryExemption() {
        val pm = getSystemService(PowerManager::class.java)
        if (pm.isIgnoringBatteryOptimizations(packageName)) {
            Toast.makeText(this, "Ist bereits ausgeschaltet", Toast.LENGTH_SHORT).show()
            return
        }
        val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
            .setData(Uri.parse("package:$packageName"))
        runCatching { startActivity(intent) }.onFailure {
            startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS))
        }
    }
}
