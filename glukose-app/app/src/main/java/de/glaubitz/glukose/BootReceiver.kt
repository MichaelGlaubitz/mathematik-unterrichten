package de.glaubitz.glukose

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Nach Neustart und nach einem App-Update die Überwachung wieder anwerfen. */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val app = context.applicationContext
        if (Store.running(app) && Store.hasCredentials(app)) {
            GlucoseService.start(app)
        }
    }
}
