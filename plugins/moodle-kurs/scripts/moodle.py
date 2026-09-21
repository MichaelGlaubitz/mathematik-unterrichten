#!/usr/bin/env python3
"""moodle.py - Moodle-Kurse ueber die Webservice-Schnittstelle abfragen.

Nur Standardbibliothek. Zugangsdaten aus der Umgebung oder aus
~/.config/schul-plugins/moodle.env:

    MOODLE_URL=https://moodle.meine-schule.de
    MOODLE_TOKEN=abcdef0123456789

Der Token entsteht in Moodle unter: Einstellungen -> Sicherheitsschluessel
(engl. Security keys). Er gilt genau fuer den eigenen Zugang und die vom
Administrator freigegebenen Funktionen.

Aufruf:  python3 moodle.py <befehl> [optionen]
"""

import argparse
import json
import os
import pathlib
import urllib.error
import urllib.parse
import urllib.request

KONFIG_DATEI = pathlib.Path.home() / ".config" / "schul-plugins" / "moodle.env"

EINRICHTUNG = (
    "Es fehlen Zugangsdaten fuer Moodle.\n"
    "Lege sie an mit:\n"
    "  mkdir -p ~/.config/schul-plugins\n"
    "  cat > ~/.config/schul-plugins/moodle.env <<'EOF'\n"
    "  MOODLE_URL=https://moodle.meine-schule.de\n"
    "  MOODLE_TOKEN=dein-token\n"
    "  EOF\n"
    "  chmod 600 ~/.config/schul-plugins/moodle.env\n"
    "Den Token erzeugst du in Moodle unter 'Einstellungen -> Sicherheitsschluessel'."
)


# ---------------------------------------------------------------- Konfiguration

def konfig_lesen():
    werte = {}
    if KONFIG_DATEI.exists():
        for zeile in KONFIG_DATEI.read_text(encoding="utf-8").splitlines():
            zeile = zeile.strip()
            if zeile and not zeile.startswith("#") and "=" in zeile:
                schluessel, _, wert = zeile.partition("=")
                werte[schluessel.strip()] = wert.strip().strip('"').strip("'")

    for name in ("MOODLE_URL", "MOODLE_TOKEN"):
        aus_umgebung = os.environ.get(name) or os.environ.get("CLAUDE_PLUGIN_OPTION_" + name)
        if aus_umgebung:
            werte[name] = aus_umgebung

    if not werte.get("MOODLE_URL") or not werte.get("MOODLE_TOKEN"):
        raise SystemExit(EINRICHTUNG)

    adresse = werte["MOODLE_URL"].rstrip("/")
    if not adresse.startswith("http"):
        adresse = "https://" + adresse
    werte["MOODLE_URL"] = adresse
    return werte


# ---------------------------------------------------------------- Webservice

def flach_machen(daten, praefix=""):
    """{'courseids': [5, 7]} -> {'courseids[0]': '5', 'courseids[1]': '7'}"""
    felder = {}
    if isinstance(daten, dict):
        for schluessel, wert in daten.items():
            name = f"{praefix}[{schluessel}]" if praefix else str(schluessel)
            felder.update(flach_machen(wert, name))
    elif isinstance(daten, (list, tuple)):
        for nummer, wert in enumerate(daten):
            felder.update(flach_machen(wert, f"{praefix}[{nummer}]"))
    elif isinstance(daten, bool):
        felder[praefix] = "1" if daten else "0"
    elif daten is not None:
        felder[praefix] = str(daten)
    return felder


class Moodle:
    def __init__(self, konfig):
        self.adresse = konfig["MOODLE_URL"]
        self.token = konfig["MOODLE_TOKEN"]
        self._eigene_id = None

    def aufrufen(self, funktion, params=None):
        felder = {"wstoken": self.token, "wsfunction": funktion, "moodlewsrestformat": "json"}
        felder.update(flach_machen(params or {}))
        rumpf = urllib.parse.urlencode(felder).encode("utf-8")
        ziel = f"{self.adresse}/webservice/rest/server.php"

        anfrage = urllib.request.Request(
            ziel, data=rumpf, method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded",
                     "User-Agent": "claude-schul-plugin"})
        try:
            with urllib.request.urlopen(anfrage, timeout=45) as antwort:
                roh = antwort.read().decode("utf-8")
        except urllib.error.HTTPError as fehler:
            raise SystemExit(f"Moodle antwortete mit HTTP {fehler.code} ({fehler.reason}). "
                             f"Stimmt MOODLE_URL ({self.adresse})?")
        except urllib.error.URLError as fehler:
            raise SystemExit(f"Moodle ist nicht erreichbar: {fehler.reason}")

        try:
            daten = json.loads(roh) if roh.strip() else None
        except json.JSONDecodeError:
            raise SystemExit("Moodle hat keine gueltige JSON-Antwort geliefert. "
                             "Sind die Webservices aktiviert und ist das REST-Protokoll erlaubt?")

        if isinstance(daten, dict) and daten.get("exception"):
            hinweise = {
                "invalidtoken": "Der Token ist ungueltig oder abgelaufen - erzeuge ihn in Moodle neu.",
                "accessexception": "Der Zugang darf diese Funktion nicht aufrufen - "
                                   "der Administrator muss sie im Webservice freigeben.",
                "webservicesnotenabled": "Die Webservices sind in dieser Moodle-Instanz abgeschaltet.",
                "invalidrecord": "Der angefragte Datensatz (Kurs, Aufgabe, Person) existiert nicht.",
            }
            code = daten.get("errorcode", "")
            raise SystemExit(f"Moodle meldet '{code}': "
                             f"{hinweise.get(code, daten.get('message', 'unbekannter Fehler'))}")
        return daten

    def eigene_id(self):
        if self._eigene_id is None:
            self._eigene_id = self.aufrufen("core_webservice_get_site_info")["userid"]
        return self._eigene_id

    def kurse(self):
        return self.aufrufen("core_enrol_get_users_courses", {"userid": self.eigene_id()}) or []

    def teilnehmer(self, kurs_id):
        return self.aufrufen("core_enrol_get_enrolled_users", {"courseid": kurs_id}) or []

    def aufgaben(self, kurs_id):
        antwort = self.aufrufen("mod_assign_get_assignments", {"courseids": [kurs_id]}) or {}
        kurse = antwort.get("courses", [])
        return kurse[0].get("assignments", []) if kurse else []

    def abgaben(self, aufgabe_id):
        antwort = self.aufrufen("mod_assign_get_submissions", {"assignmentids": [aufgabe_id]}) or {}
        aufgaben = antwort.get("assignments", [])
        return aufgaben[0].get("submissions", []) if aufgaben else []

    def noten(self, kurs_id, nutzer_id=None):
        params = {"courseid": kurs_id}
        if nutzer_id:
            params["userid"] = nutzer_id
        return self.aufrufen("gradereport_user_get_grade_items", params) or {}


# ---------------------------------------------------------------- Darstellung

def name_zeigen(voller_name, anonym):
    if not anonym:
        return voller_name
    teile = [t for t in str(voller_name).split() if t]
    return " ".join(t[0] + "." for t in teile) if teile else "?"


def zeitstempel(wert):
    if not wert:
        return "-"
    import datetime as dt
    return dt.datetime.fromtimestamp(int(wert)).strftime("%d.%m.%Y %H:%M")


def html_entfernen(text):
    import re
    ohne = re.sub(r"<[^>]+>", " ", str(text or ""))
    ohne = ohne.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    return " ".join(ohne.split())


# ---------------------------------------------------------------- Befehle

def main():
    zerleger = argparse.ArgumentParser(description="Moodle-Kurse aus Claude heraus abfragen.")
    zerleger.add_argument("--json", action="store_true", help="Rohdaten statt Tabelle")
    zerleger.add_argument("--anonym", action="store_true",
                          help="Namen nur als Initialen ausgeben (Datenschutz)")
    unter = zerleger.add_subparsers(dest="befehl", required=True)

    unter.add_parser("test", help="Zugang und Rechte pruefen")
    unter.add_parser("kurse", help="Eigene Kurse auflisten")
    p = unter.add_parser("teilnehmer", help="Eingeschriebene Personen eines Kurses")
    p.add_argument("--kurs", type=int, required=True)
    p = unter.add_parser("aufgaben", help="Aufgaben eines Kurses")
    p.add_argument("--kurs", type=int, required=True)
    p = unter.add_parser("abgaben", help="Abgabestand einer Aufgabe")
    p.add_argument("--aufgabe", type=int, required=True)
    p.add_argument("--kurs", type=int, help="Kurs-ID, um fehlende Abgaben zu benennen")
    p = unter.add_parser("noten", help="Bewertungen eines Kurses")
    p.add_argument("--kurs", type=int, required=True)
    p.add_argument("--nutzer", type=int, help="nur diese Person")
    p = unter.add_parser("funktion", help="Beliebige Webservice-Funktion aufrufen")
    p.add_argument("name", help="z. B. core_course_get_contents")
    p.add_argument("--param", action="append", default=[], metavar="SCHLUESSEL=WERT")

    args = zerleger.parse_args()
    moodle = Moodle(konfig_lesen())

    def ausgabe(daten):
        print(json.dumps(daten, ensure_ascii=False, indent=2))

    if args.befehl == "test":
        info = moodle.aufrufen("core_webservice_get_site_info")
        if args.json:
            return ausgabe(info)
        print("Zugang steht.")
        print(f"Seite:     {info.get('sitename')} ({moodle.adresse})")
        print(f"Konto:     {name_zeigen(info.get('fullname'), args.anonym)} (ID {info.get('userid')})")
        print(f"Version:   {info.get('release')}")
        funktionen = sorted(f.get("name") for f in info.get("functions", []))
        print(f"Freigegebene Funktionen: {len(funktionen)}")
        wichtig = ["core_enrol_get_users_courses", "core_enrol_get_enrolled_users",
                   "mod_assign_get_assignments", "mod_assign_get_submissions",
                   "gradereport_user_get_grade_items"]
        for name in wichtig:
            print(f"  [{'x' if name in funktionen else ' '}] {name}")
        fehlend = [n for n in wichtig if n not in funktionen]
        if fehlend:
            print("\nNicht freigegebene Funktionen muss der Moodle-Administrator "
                  "im Webservice ergaenzen.")
        return

    if args.befehl == "kurse":
        kurse = moodle.kurse()
        if args.json:
            return ausgabe(kurse)
        print("Eigene Kurse")
        print("-" * 60)
        for kurs in sorted(kurse, key=lambda k: str(k.get("fullname", ""))):
            print(f"[{kurs.get('id'):>5}] {kurs.get('shortname','')} - {kurs.get('fullname','')}")
        print(f"\n{len(kurse)} Kurs(e). Die Zahl in Klammern ist die Kurs-ID fuer weitere Befehle.")
        return

    if args.befehl == "teilnehmer":
        leute = moodle.teilnehmer(args.kurs)
        if args.json:
            return ausgabe(leute)
        print(f"Eingeschrieben in Kurs {args.kurs}")
        print("-" * 60)
        for person in sorted(leute, key=lambda p: str(p.get("fullname", ""))):
            rollen = ", ".join(r.get("shortname", "") for r in person.get("roles", [])) or "-"
            print(f"[{person.get('id'):>5}] {name_zeigen(person.get('fullname'), args.anonym):<28} {rollen}")
        print(f"\n{len(leute)} Person(en).")
        return

    if args.befehl == "aufgaben":
        aufgaben = moodle.aufgaben(args.kurs)
        if args.json:
            return ausgabe(aufgaben)
        print(f"Aufgaben in Kurs {args.kurs}")
        print("-" * 70)
        for aufgabe in sorted(aufgaben, key=lambda a: a.get("duedate") or 0):
            print(f"[{aufgabe.get('id'):>5}] {aufgabe.get('name','')}")
            print(f"        faellig: {zeitstempel(aufgabe.get('duedate'))}"
                  f"   sichtbar ab: {zeitstempel(aufgabe.get('allowsubmissionsfromdate'))}")
            text = html_entfernen(aufgabe.get("intro"))
            if text:
                print(f"        {text[:160]}")
        print(f"\n{len(aufgaben)} Aufgabe(n). Die Zahl in Klammern ist die Aufgaben-ID.")
        return

    if args.befehl == "abgaben":
        abgaben = moodle.abgaben(args.aufgabe)
        if args.json:
            return ausgabe(abgaben)
        namen = {}
        if args.kurs:
            namen = {p["id"]: p.get("fullname", "") for p in moodle.teilnehmer(args.kurs)}
        abgegeben = [a for a in abgaben if a.get("status") == "submitted"]
        print(f"Abgabestand zu Aufgabe {args.aufgabe}")
        print("-" * 60)
        for eintrag in sorted(abgaben, key=lambda a: str(namen.get(a.get("userid"), a.get("userid")))):
            wer = namen.get(eintrag.get("userid"), f"Nutzer {eintrag.get('userid')}")
            print(f"{name_zeigen(wer, args.anonym):<28} {eintrag.get('status','-'):<12} "
                  f"{zeitstempel(eintrag.get('timemodified'))}")
        print(f"\n{len(abgegeben)} von {len(abgaben)} eingetragenen Personen haben abgegeben.")
        if args.kurs:
            offen = [n for i, n in namen.items()
                     if i not in {a.get("userid") for a in abgegeben}]
            if offen:
                print("Ohne Abgabe: " + ", ".join(sorted(name_zeigen(n, args.anonym) for n in offen)))
        else:
            print("Tipp: mit --kurs <ID> werden auch die Namen ohne Abgabe genannt.")
        return

    if args.befehl == "noten":
        bericht = moodle.noten(args.kurs, args.nutzer)
        if args.json:
            return ausgabe(bericht)
        for nutzer in bericht.get("usergrades", []):
            print(f"\n{name_zeigen(nutzer.get('userfullname'), args.anonym)} (Kurs {args.kurs})")
            print("-" * 60)
            for posten in nutzer.get("gradeitems", []):
                note = posten.get("gradeformatted") or "-"
                print(f"{str(posten.get('itemname') or 'Gesamt'):<38} {note:>12}")
        return

    if args.befehl == "funktion":
        params = {}
        for paar in args.param:
            schluessel, _, wert = paar.partition("=")
            params[schluessel] = wert
        return ausgabe(moodle.aufrufen(args.name, params))


if __name__ == "__main__":
    main()
