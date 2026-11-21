# Glukose — LibreLinkUp-Anzeige für Android

Kleine Android-App, die den Sensorwert alle fünf Minuten aus der
LibreLinkUp-Cloud holt und ihn dauerhaft einblendet:

* **in der Statusleiste** — die Zahl selbst wird als Symbol gezeichnet, sie
  steht also immer oben am Bildschirmrand, ohne dass man etwas aufziehen muss;
* **in der Benachrichtigung** — Wert, Trendpfeil, Alter der Messung,
  eingefärbt nach den eigenen Grenzwerten;
* **als Kachel auf dem Startbildschirm** — großer Wert, Pfeil und eine
  Verlaufskurve der letzten drei Stunden;
* **in der App** — Verlaufskurve der letzten sechs Stunden mit Zielbereich.

Bei Über- oder Unterschreitung der eingestellten Grenzen kommt ein hörbarer
Alarm, höchstens alle 20 Minuten und nur, wenn der Wert nicht älter als
20 Minuten ist.

> Kein Medizinprodukt. Die Werte kommen zeitversetzt aus einer Cloud und
> können ausfallen. Für Therapieentscheidungen die offizielle App oder eine
> Blutzuckermessung verwenden.

## Voraussetzung: LibreLinkUp-Freigabe

Die App liest nicht den Sensor, sondern das, was die FreeStyle-LibreLink-App
in die Cloud schreibt. Nötig ist deshalb:

1. Ein **LibreLinkUp-Konto** (kostenlos, in der LibreLinkUp-App anlegen).
2. In der **FreeStyle-LibreLink-App** unter *Verbundene Apps* → *LibreLinkUp*
   die Freigabe an dieses Konto einschalten.
3. Einmal in der LibreLinkUp-App anmelden und die Nutzungsbedingungen
   bestätigen — sonst verweigert die Schnittstelle das Token.

Die FreeStyle-LibreLink-App muss weiterhin auf dem Handy laufen; sie ist es,
die den Sensor ausliest und die Werte hochlädt.

## Installieren

Die APK ist mit dem Android-Debug-Schlüssel signiert und wird per Sideload
installiert:

1. APK auf das Handy laden und antippen.
2. Wenn Android fragt: der installierenden App (Dateien, Chrome) einmalig
   erlauben, Apps aus dieser Quelle zu installieren.
3. App öffnen, E-Mail und Passwort des **LibreLinkUp**-Kontos eintragen,
   *Verbinden* drücken.
4. Benachrichtigungen erlauben.
5. **Akku-Optimierung ausschalten** — der Knopf dafür steht unten in der App.
   Ohne diese Ausnahme streckt Android den Takt im Ruhezustand auf 15 Minuten
   und mehr.

Für die Kachel: Startbildschirm lange drücken → *Widgets* → *Glukose*.

## Selbst bauen

```bash
export ANDROID_HOME=/pfad/zum/android-sdk
echo "sdk.dir=$ANDROID_HOME" > local.properties
gradle :app:assembleRelease
# app/build/outputs/apk/release/app-release.apk
```

Gebraucht werden JDK 17+, Gradle 8.14+ und die SDK-Pakete
`platforms;android-35` sowie `build-tools;35.0.0`. Die App kommt ohne jede
externe Bibliothek aus — `HttpURLConnection`, `org.json` und
`android.graphics` reichen.

## Wie es zusammenhängt

| Datei | Aufgabe |
| --- | --- |
| `LibreLink.kt` | Anmeldung, Regionsumleitung, Abruf von `/llu/connections/{id}/graph` |
| `Store.kt` | Einstellungen, Verlauf, Passwort AES-GCM im Android-Keystore |
| `Scheduler.kt` | exakter Alarm alle fünf Minuten, auch im Doze-Modus |
| `PollReceiver.kt` | wird geweckt, ruft ab, plant den nächsten Takt |
| `GlucoseService.kt` | hält die dauerhafte Anzeige und den Prozess |
| `Notifications.kt` | Statusleisten-Symbol aus dem Zahlenwert, Alarme |
| `GlucoseWidget.kt` | Kachel für den Startbildschirm |
| `GraphView.kt` | Verlaufskurve in der App |

Der Takt hängt an einem `setExactAndAllowWhileIdle`-Alarm statt am
`WorkManager`, weil dessen kürzestes Intervall 15 Minuten beträgt. Der
Vordergrunddienst hält zusätzlich den Prozess am Leben; startet er einmal
nicht, trägt der Alarm den Takt allein weiter.

## Grenzen

* Fällt die LibreLinkUp-Cloud oder die Internetverbindung aus, wird der
  letzte Wert grau und mit seinem Alter angezeigt — es gibt keinen lauten
  Alarm bei Datenausfall.
* Der Alarmkanal umgeht „Nicht stören“ nicht. Wer nachts geweckt werden will,
  muss die App in den Ausnahmen von „Nicht stören“ eintragen.
* Zwischen Sensormessung und Cloud liegt je nach Verbindung eine Verzögerung
  von einigen Minuten.
