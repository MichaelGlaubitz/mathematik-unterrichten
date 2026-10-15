# Schul-Plugins für Claude Code

Drei Plugins, die Claude an die Programme anschließen, die an Schulen ohnehin
laufen: **WebUntis**, **Moodle** und **IServ**. Damit lassen sich Fragen wie
„fällt morgen etwas aus?", „wer hat noch nicht abgegeben?" oder „leg das
Arbeitsblatt in den Kursordner" im Gespräch beantworten, statt sich durch drei
Weboberflächen zu klicken.

| Plugin | Was es kann | Was es braucht |
|---|---|---|
| `webuntis-stundenplan` | Stundenplan, Vertretungen, Ausfälle, Klassen-, Lehrer-, Raum- und Fachlisten, Ferien, Stundenraster | WebUntis-Zugang der Schule |
| `moodle-kurs` | Kursliste, Aufgaben mit Fristen, Abgabestände samt offener Namen, Teilnehmerlisten, Bewertungen | Moodle-Token (selbst erzeugbar) |
| `iserv-dateien` | Ordner durchsehen, Material hochladen, Abgaben herunterladen | IServ-Zugang, WebDAV aktiviert |

Alle drei Skripte kommen mit der Python-Standardbibliothek aus — keine
Installation, keine zusätzlichen Pakete.

## Installieren

```
/plugin marketplace add MichaelGlaubitz/mathematik-unterrichten
/plugin install webuntis-stundenplan@schul-plugins
/plugin install moodle-kurs@schul-plugins
/plugin install iserv-dateien@schul-plugins
```

## Zugangsdaten

Jedes Plugin liest seine Zugangsdaten aus einer Datei in `~/.config/schul-plugins/`.
Am einfachsten legt man sie über den jeweiligen Einrichtungsbefehl an:

```
/untis-einrichten
/moodle-einrichten
/iserv-einrichten
```

Die Dateien sehen so aus (jeweils `chmod 600`):

```
~/.config/schul-plugins/webuntis.env
    WEBUNTIS_SERVER=https://ajax.webuntis.com
    WEBUNTIS_SCHULE=kurzname-aus-der-adresse
    WEBUNTIS_USER=vorname.nachname
    WEBUNTIS_PASSWORT=…

~/.config/schul-plugins/moodle.env
    MOODLE_URL=https://moodle.meine-schule.de
    MOODLE_TOKEN=…            # Moodle → Einstellungen → Sicherheitsschlüssel

~/.config/schul-plugins/iserv.env
    ISERV_URL=https://meine-schule.de
    ISERV_USER=vorname.nachname
    ISERV_PASSWORT=…
```

Statt der Datei gehen auch gleichnamige Umgebungsvariablen; sie haben Vorrang.
Die Zugangsdaten liegen ausschließlich lokal — nichts davon steht in diesem
Repository, und keines der Skripte schickt sie irgendwo anders hin als an den
eigenen Schulserver.

## Was die Plugins bewusst nicht tun

- **WebUntis**: nur lesen. Kein Eintragen von Vertretungen oder Abwesenheiten.
- **Moodle**: nur lesen. Keine Notenvergabe, keine Kursänderungen.
- **IServ**: lesen, Ordner anlegen, hochladen — aber nicht löschen.

Das ist Absicht: Schreibende Eingriffe in Schulsysteme sollen über deren eigene
Oberfläche laufen, wo sie protokolliert und rückgängig zu machen sind.

## Datenschutz

Teilnehmerlisten, Abgabestände, Noten und Abgabedateien sind personenbezogene
Daten von Minderjährigen. Die Skripte holen sie nur auf Anforderung und legen
von sich aus nichts ab. Für Übersichten, die jemand anders zu sehen bekommt,
hat `moodle.py` die Option `--anonym` (Namen werden zu Initialen). Heruntergeladene
Abgaben gehören in einen lokalen Ordner, nicht in ein Repository.

Ob der Einsatz an der eigenen Schule zulässig ist, richtet sich nach dem
Landesrecht und der Dienstvereinbarung — das klärt jede Lehrkraft für sich.

## Selbsttests

Die Logik, die ohne Server prüfbar ist (Datumsangaben, Tabellen, WebDAV-Auswertung),
hat kleine Selbsttests:

```bash
cd plugins/webuntis-stundenplan/scripts && python3 test_untis.py
cd plugins/iserv-dateien/scripts       && python3 test_iserv.py
```

## Technische Grundlagen

- WebUntis: JSON-RPC unter `/WebUntis/jsonrpc.do?school=…`, Sitzung über `JSESSIONID`
- Moodle: Webservices unter `/webservice/rest/server.php` mit `wstoken`
- IServ: WebDAV unter `/webdav/`, Basic Auth
