#!/usr/bin/env python3
"""untis.py - WebUntis ueber die JSON-RPC-Schnittstelle abfragen.

Nur Standardbibliothek, keine Installation noetig.
Zugangsdaten kommen aus Umgebungsvariablen oder aus ~/.config/schul-plugins/webuntis.env:

    WEBUNTIS_SERVER=https://ajax.webuntis.com
    WEBUNTIS_SCHULE=kurzname-der-schule
    WEBUNTIS_USER=vorname.nachname
    WEBUNTIS_PASSWORT=geheim

Aufruf:  python3 untis.py <befehl> [optionen]
"""

import argparse
import base64
import datetime as dt
import json
import os
import pathlib
import sys
import urllib.error
import urllib.parse
import urllib.request

KONFIG_DATEI = pathlib.Path.home() / ".config" / "schul-plugins" / "webuntis.env"
CLIENT = "claude-schul-plugin"

# WebUntis-Elementtypen
TYP_KLASSE, TYP_LEHRER, TYP_FACH, TYP_RAUM, TYP_SCHUELER = 1, 2, 3, 4, 5

FEHLERTEXTE = {
    -8504: "Benutzername oder Passwort wurde von WebUntis abgelehnt.",
    -8998: "Die Schule ist WebUntis unbekannt - stimmt WEBUNTIS_SCHULE?",
    -8520: "Die Sitzung ist abgelaufen oder es wurde kein Login durchgefuehrt.",
    -8509: "Fuer diese Abfrage fehlt dem Konto das Recht in WebUntis.",
    -7004: "Das angefragte Element gibt es in diesem Zeitraum nicht.",
}


# ---------------------------------------------------------------- Konfiguration

def konfig_lesen():
    """Liest die Zugangsdaten. Reihenfolge: Umgebung, Plugin-Optionen, Datei."""
    werte = {}
    if KONFIG_DATEI.exists():
        for zeile in KONFIG_DATEI.read_text(encoding="utf-8").splitlines():
            zeile = zeile.strip()
            if not zeile or zeile.startswith("#") or "=" not in zeile:
                continue
            schluessel, _, wert = zeile.partition("=")
            werte[schluessel.strip()] = wert.strip().strip('"').strip("'")

    for name in ("WEBUNTIS_SERVER", "WEBUNTIS_SCHULE", "WEBUNTIS_USER", "WEBUNTIS_PASSWORT"):
        aus_umgebung = os.environ.get(name) or os.environ.get("CLAUDE_PLUGIN_OPTION_" + name)
        if aus_umgebung:
            werte[name] = aus_umgebung

    fehlend = [n for n in ("WEBUNTIS_SERVER", "WEBUNTIS_SCHULE", "WEBUNTIS_USER", "WEBUNTIS_PASSWORT")
               if not werte.get(n)]
    if fehlend:
        raise SystemExit(
            "Es fehlen Zugangsdaten: " + ", ".join(fehlend) + "\n"
            "Lege sie an mit:\n"
            "  mkdir -p ~/.config/schul-plugins\n"
            "  cat > ~/.config/schul-plugins/webuntis.env <<'EOF'\n"
            "  WEBUNTIS_SERVER=https://ajax.webuntis.com\n"
            "  WEBUNTIS_SCHULE=kurzname\n"
            "  WEBUNTIS_USER=benutzer\n"
            "  WEBUNTIS_PASSWORT=geheim\n"
            "  EOF\n"
            "  chmod 600 ~/.config/schul-plugins/webuntis.env"
        )

    werte["WEBUNTIS_SERVER"] = werte["WEBUNTIS_SERVER"].rstrip("/")
    if not werte["WEBUNTIS_SERVER"].startswith("http"):
        werte["WEBUNTIS_SERVER"] = "https://" + werte["WEBUNTIS_SERVER"]
    return werte


# ---------------------------------------------------------------- Ohne Anmeldung

SCHULSUCHE = "https://mobile.webuntis.com/ms/schoolquery2"


def _rpc_roh(ziel, methode, params):
    """Ein JSON-RPC-Aufruf ohne Sitzung. Gibt die geparste Antwort zurueck."""
    rumpf = json.dumps({"id": CLIENT, "method": methode, "params": params,
                        "jsonrpc": "2.0"}).encode("utf-8")
    anfrage = urllib.request.Request(
        ziel, data=rumpf, method="POST",
        headers={"Content-Type": "application/json", "User-Agent": CLIENT})
    with urllib.request.urlopen(anfrage, timeout=30) as antwort:
        return json.loads(antwort.read().decode("utf-8"))


def schule_suchen(suchwort):
    """Oeffentliche Schulsuche von WebUntis - liefert Server und Schulkuerzel."""
    try:
        antwort = _rpc_roh(SCHULSUCHE, "searchSchool", [{"search": suchwort}])
    except urllib.error.URLError as fehler:
        raise SystemExit(f"Die Schulsuche ist nicht erreichbar: {fehler.reason}")
    ergebnis = antwort.get("result") or {}
    if antwort.get("error"):
        hinweis = antwort["error"].get("message", "")
        if "too many" in hinweis.lower():
            raise SystemExit("Die Suche liefert zu viele Treffer - gib den Schulnamen genauer an.")
        raise SystemExit(f"Die Schulsuche meldet: {hinweis}")
    return ergebnis.get("schools", [])


def erreichbarkeit_pruefen(server, schule):
    """Prueft ohne Zugangsdaten, ob die JSON-RPC-Schnittstelle antwortet.

    Ein Aufruf ohne Sitzung muss mit 'nicht angemeldet' (-8520) beantwortet
    werden - genau das zeigt, dass Server und Schulkuerzel stimmen und die
    Schnittstelle offen ist. Es wird kein Anmeldeversuch unternommen.
    """
    server = server.rstrip("/")
    if not server.startswith("http"):
        server = "https://" + server
    ziel = f"{server}/WebUntis/jsonrpc.do?school={urllib.parse.quote(schule)}"
    try:
        antwort = _rpc_roh(ziel, "getTeachers", {})
    except urllib.error.HTTPError as fehler:
        if fehler.code == 404:
            return False, (f"Der Server antwortet mit 404. Meist stimmt das Schulkuerzel "
                           f"'{schule}' nicht, seltener der Server '{server}'. "
                           f"Finde beides mit: suche-schule \"<Name der Schule>\"")
        return False, f"HTTP {fehler.code} ({fehler.reason}) - stimmt der Server '{server}'?"
    except urllib.error.URLError as fehler:
        return False, f"Server nicht erreichbar: {fehler.reason}"

    code = (antwort.get("error") or {}).get("code")
    if code == -8520:
        return True, "Die Schnittstelle antwortet, Server und Schulkuerzel stimmen."
    if code == -8998:
        return False, "Diese Schule kennt der Server nicht - pruefe das Schulkuerzel."
    if code is None:
        return True, "Die Schnittstelle antwortet sogar ohne Anmeldung."
    return False, (f"Unerwartete Antwort ({code}): "
                   + FEHLERTEXTE.get(code, (antwort.get("error") or {}).get("message", "")))


# ---------------------------------------------------------------- JSON-RPC

class Untis:
    def __init__(self, konfig):
        self.server = konfig["WEBUNTIS_SERVER"]
        self.schule = konfig["WEBUNTIS_SCHULE"]
        self.user = konfig["WEBUNTIS_USER"]
        self.passwort = konfig["WEBUNTIS_PASSWORT"]
        self.session_id = None
        self.person_typ = None
        self.person_id = None
        self._stammdaten = {}

    @property
    def url(self):
        return f"{self.server}/WebUntis/jsonrpc.do?school={urllib.parse.quote(self.schule)}"

    def rpc(self, methode, params=None):
        rumpf = json.dumps({
            "id": CLIENT,
            "method": methode,
            "params": params if params is not None else {},
            "jsonrpc": "2.0",
        }).encode("utf-8")

        kopf = {"Content-Type": "application/json", "User-Agent": CLIENT}
        if self.session_id:
            schulname = base64.b64encode(self.schule.encode("utf-8")).decode("ascii")
            kopf["Cookie"] = f"JSESSIONID={self.session_id}; schoolname=\"_{schulname}\""

        anfrage = urllib.request.Request(self.url, data=rumpf, headers=kopf, method="POST")
        try:
            with urllib.request.urlopen(anfrage, timeout=30) as antwort:
                daten = json.loads(antwort.read().decode("utf-8"))
        except urllib.error.HTTPError as fehler:
            raise SystemExit(f"WebUntis antwortete mit HTTP {fehler.code} ({fehler.reason}). "
                             f"Stimmt WEBUNTIS_SERVER ({self.server})?")
        except urllib.error.URLError as fehler:
            raise SystemExit(f"WebUntis ist nicht erreichbar: {fehler.reason}")

        if "error" in daten:
            code = daten["error"].get("code")
            text = FEHLERTEXTE.get(code, daten["error"].get("message", "unbekannter Fehler"))
            raise SystemExit(f"WebUntis meldet einen Fehler ({code}): {text}")
        return daten.get("result")

    def anmelden(self):
        ergebnis = self.rpc("authenticate", {
            "user": self.user, "password": self.passwort, "client": CLIENT,
        })
        if not ergebnis or not ergebnis.get("sessionId"):
            raise SystemExit("Anmeldung fehlgeschlagen: WebUntis hat keine Sitzung zurueckgegeben.")
        self.session_id = ergebnis["sessionId"]
        self.person_typ = ergebnis.get("personType")
        self.person_id = ergebnis.get("personId")
        return ergebnis

    def abmelden(self):
        if self.session_id:
            try:
                self.rpc("logout")
            except SystemExit:
                pass
            self.session_id = None

    # --------------------------------------------------------- Stammdaten

    def stammdaten(self, art):
        """art: klassen | lehrer | faecher | raeume"""
        if art in self._stammdaten:
            return self._stammdaten[art]
        methode = {"klassen": "getKlassen", "lehrer": "getTeachers",
                   "faecher": "getSubjects", "raeume": "getRooms"}[art]
        self._stammdaten[art] = self.rpc(methode) or []
        return self._stammdaten[art]

    def namen_tabelle(self, art):
        return {eintrag["id"]: eintrag for eintrag in self.stammdaten(art)}

    def element_finden(self, angabe):
        """'10b', 'klasse:10b', 'lehrer:GLA', 'raum:A102', 'ich' -> (id, typ)"""
        if not angabe or angabe.lower() in ("ich", "me", "eigen", "selbst"):
            if not self.person_id:
                raise SystemExit("Das eigene Element ist unbekannt - bitte --wer angeben.")
            return self.person_id, self.person_typ

        praefix, _, rest = angabe.partition(":")
        if not rest:
            praefix, rest = "klasse", angabe

        art_zu_typ = {
            "klasse": ("klassen", TYP_KLASSE), "kl": ("klassen", TYP_KLASSE),
            "lehrer": ("lehrer", TYP_LEHRER), "le": ("lehrer", TYP_LEHRER),
            "fach": ("faecher", TYP_FACH), "raum": ("raeume", TYP_RAUM),
        }
        if praefix.lower() not in art_zu_typ:
            raise SystemExit(f"Unbekannte Angabe '{angabe}'. Erlaubt: ich, klasse:10b, lehrer:GLA, raum:A102, fach:MA")
        art, typ = art_zu_typ[praefix.lower()]

        gesucht = rest.strip().lower()
        for eintrag in self.stammdaten(art):
            if gesucht in (str(eintrag.get("name", "")).lower(),
                           str(eintrag.get("longName", "")).lower()):
                return eintrag["id"], typ
        vorhanden = ", ".join(sorted(str(e.get("name")) for e in self.stammdaten(art))[:25])
        raise SystemExit(f"'{rest}' wurde unter {art} nicht gefunden. Vorhanden u. a.: {vorhanden}")

    def stundenplan(self, element_id, typ, von, bis):
        stunden = self.rpc("getTimetable", {"options": {
            "element": {"id": element_id, "type": typ},
            "startDate": int(von.strftime("%Y%m%d")),
            "endDate": int(bis.strftime("%Y%m%d")),
            "showInfo": True,
            "showSubstText": True,
            "showLsText": True,
            "showStudentgroup": True,
            "klasseFields": ["id", "name", "longname"],
            "roomFields": ["id", "name", "longname"],
            "subjectFields": ["id", "name", "longname"],
            "teacherFields": ["id", "name", "longname"],
        }}) or []
        return sorted(stunden, key=lambda s: (s.get("date", 0), s.get("startTime", 0)))


# ---------------------------------------------------------------- Darstellung

WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]


def datum_lesen(text, vorgabe=None):
    """Akzeptiert 2026-09-08, 20260908, heute, morgen, gestern, montag ..."""
    if not text:
        return vorgabe
    text = text.strip().lower()
    heute = dt.date.today()
    if text in ("heute", "today"):
        return heute
    if text == "morgen":
        return heute + dt.timedelta(days=1)
    if text == "uebermorgen":
        return heute + dt.timedelta(days=2)
    if text == "gestern":
        return heute - dt.timedelta(days=1)
    if text in [tag.lower() for tag in WOCHENTAGE]:
        ziel = [tag.lower() for tag in WOCHENTAGE].index(text)
        return heute + dt.timedelta(days=(ziel - heute.weekday()) % 7)
    for muster in ("%Y-%m-%d", "%Y%m%d", "%d.%m.%Y", "%d.%m."):
        try:
            gelesen = dt.datetime.strptime(text, muster).date()
            if muster == "%d.%m.":
                gelesen = gelesen.replace(year=heute.year)
            return gelesen
        except ValueError:
            continue
    raise SystemExit(f"Datum '{text}' nicht verstanden. Erlaubt: 2026-09-08, 08.09.2026, heute, morgen, montag")


def zeitraum_bestimmen(args):
    heute = dt.date.today()
    if getattr(args, "woche", False):
        montag = heute - dt.timedelta(days=heute.weekday())
        return montag, montag + dt.timedelta(days=4)
    if getattr(args, "naechste_woche", False):
        montag = heute - dt.timedelta(days=heute.weekday()) + dt.timedelta(days=7)
        return montag, montag + dt.timedelta(days=4)
    von = datum_lesen(getattr(args, "von", None), heute)
    bis = datum_lesen(getattr(args, "bis", None), von)
    if bis < von:
        von, bis = bis, von
    return von, bis


def uhrzeit(wert):
    text = str(wert).zfill(4)
    return f"{text[:-2]}:{text[-2:]}"


def kuerzel(eintraege, tabelle, feld="name"):
    namen = []
    for eintrag in eintraege or []:
        stamm = tabelle.get(eintrag.get("id"), {})
        namen.append(str(eintrag.get(feld) or stamm.get(feld) or eintrag.get("id")))
        if eintrag.get("orgid"):
            vorher = tabelle.get(eintrag["orgid"], {})
            namen[-1] = f"{vorher.get(feld, eintrag['orgid'])}->{namen[-1]}"
    return ", ".join(namen) if namen else "-"


def stunden_ausgeben(stunden, untis, nur_aenderungen=False):
    if not stunden:
        print("Keine Stunden im gewaehlten Zeitraum.")
        return

    klassen = untis.namen_tabelle("klassen")
    lehrer = untis.namen_tabelle("lehrer")
    faecher = untis.namen_tabelle("faecher")
    raeume = untis.namen_tabelle("raeume")

    aktueller_tag = None
    gezeigt = 0
    for stunde in stunden:
        code = stunde.get("code")
        vertretungstext = stunde.get("substText") or ""
        ist_aenderung = code in ("cancelled", "irregular") or bool(vertretungstext)
        if nur_aenderungen and not ist_aenderung:
            continue

        tag = dt.datetime.strptime(str(stunde["date"]), "%Y%m%d").date()
        if tag != aktueller_tag:
            aktueller_tag = tag
            print(f"\n{WOCHENTAGE[tag.weekday()]}, {tag.strftime('%d.%m.%Y')}")
            print("-" * 58)

        markierung = {"cancelled": "[FAELLT AUS]", "irregular": "[VERTRETUNG]"}.get(code, "")
        zeile = (f"{uhrzeit(stunde.get('startTime')):>5}-{uhrzeit(stunde.get('endTime')):<5} "
                 f"{kuerzel(stunde.get('su'), faecher):<10} "
                 f"{kuerzel(stunde.get('kl'), klassen):<12} "
                 f"{kuerzel(stunde.get('te'), lehrer):<12} "
                 f"{kuerzel(stunde.get('ro'), raeume):<10} {markierung}")
        print(zeile.rstrip())
        for zusatz in (vertretungstext, stunde.get("info"), stunde.get("lstext")):
            if zusatz:
                print(f"        -> {zusatz}")
        gezeigt += 1

    if gezeigt == 0:
        print("Keine Aenderungen im gewaehlten Zeitraum - alles laeuft nach Plan.")
    else:
        print(f"\n{gezeigt} Stunde(n).")


def liste_ausgeben(eintraege, ueberschrift):
    print(ueberschrift)
    print("-" * len(ueberschrift))
    for eintrag in sorted(eintraege, key=lambda e: str(e.get("name", ""))):
        lang = eintrag.get("longName") or eintrag.get("longname") or ""
        aktiv = "" if eintrag.get("active", True) else "  (inaktiv)"
        print(f"{str(eintrag.get('name','')):<12} {lang}{aktiv}")
    print(f"\n{len(eintraege)} Eintraege.")


# ---------------------------------------------------------------- Befehle

def main():
    zerleger = argparse.ArgumentParser(description="WebUntis aus Claude heraus abfragen.")
    unter = zerleger.add_subparsers(dest="befehl", required=True)

    def zeitraum_argumente(p):
        p.add_argument("--von", help="Startdatum (2026-09-08, heute, morgen, montag)")
        p.add_argument("--bis", help="Enddatum")
        p.add_argument("--woche", action="store_true", help="Montag bis Freitag dieser Woche")
        p.add_argument("--naechste-woche", dest="naechste_woche", action="store_true")
        p.add_argument("--wer", default="ich", help="ich | klasse:10b | lehrer:GLA | raum:A102 | fach:MA")
        p.add_argument("--json", action="store_true", help="Rohdaten statt Tabelle")

    unter.add_parser("test", help="Anmeldung pruefen")
    p = unter.add_parser("suche-schule", help="Server und Schulkuerzel finden (ohne Zugangsdaten)")
    p.add_argument("suchwort", help="Name oder Ort der Schule")
    p.add_argument("--json", action="store_true")
    p = unter.add_parser("erreichbar", help="Schnittstelle pruefen (ohne Zugangsdaten)")
    p.add_argument("--server", help="z. B. https://ajax.webuntis.com")
    p.add_argument("--schule", help="Schulkuerzel aus der Adresse")
    zeitraum_argumente(unter.add_parser("plan", help="Stundenplan anzeigen"))
    zeitraum_argumente(unter.add_parser("vertretungen", help="Nur Ausfaelle und Vertretungen"))
    for name, hilfe in (("klassen", "Klassen auflisten"), ("lehrer", "Lehrkraefte auflisten"),
                        ("faecher", "Faecher auflisten"), ("raeume", "Raeume auflisten")):
        unter.add_parser(name, help=hilfe).add_argument("--json", action="store_true")
    unter.add_parser("ferien", help="Ferien und schulfreie Tage").add_argument("--json", action="store_true")
    unter.add_parser("raster", help="Stundenraster der Schule").add_argument("--json", action="store_true")

    args = zerleger.parse_args()

    if args.befehl == "suche-schule":
        treffer = schule_suchen(args.suchwort)
        if args.json:
            print(json.dumps(treffer, ensure_ascii=False, indent=2))
            return
        if not treffer:
            print(f"Keine Schule zu '{args.suchwort}' gefunden.")
            return
        print(f"Treffer zu '{args.suchwort}'")
        print("-" * 70)
        for schule in treffer:
            print(f"{schule.get('displayName', '')}")
            print(f"  Ort:            {schule.get('address', '')}")
            print(f"  Server:         https://{schule.get('server', '')}")
            print(f"  Schulkuerzel:   {schule.get('loginName', '')}")
        print(f"\n{len(treffer)} Treffer. Server und Schulkuerzel kommen so in die "
              f"Datei webuntis.env.")
        return

    if args.befehl == "erreichbar":
        server, schule = args.server, args.schule
        if not server or not schule:
            konfig = konfig_lesen()
            server = server or konfig["WEBUNTIS_SERVER"]
            schule = schule or konfig["WEBUNTIS_SCHULE"]
        offen, meldung = erreichbarkeit_pruefen(server, schule)
        print(("Alles bereit: " if offen else "Noch nicht nutzbar: ") + meldung)
        if offen:
            print("Als naechstes Benutzername und Passwort eintragen und 'test' aufrufen.")
        raise SystemExit(0 if offen else 1)

    untis = Untis(konfig_lesen())

    try:
        anmeldung = untis.anmelden()

        if args.befehl == "test":
            rollen = {2: "Lehrkraft", 5: "Schueler/in"}
            print("Anmeldung erfolgreich.")
            print(f"Server:   {untis.server}")
            print(f"Schule:   {untis.schule}")
            print(f"Konto:    {untis.user} ({rollen.get(anmeldung.get('personType'), 'Rolle ' + str(anmeldung.get('personType')))})")
            print(f"PersonId: {anmeldung.get('personId')}")
            return

        if args.befehl in ("klassen", "lehrer", "faecher", "raeume"):
            daten = untis.stammdaten(args.befehl)
            if args.json:
                print(json.dumps(daten, ensure_ascii=False, indent=2))
            else:
                liste_ausgeben(daten, args.befehl.capitalize())
            return

        if args.befehl == "ferien":
            daten = untis.rpc("getHolidays") or []
            if args.json:
                print(json.dumps(daten, ensure_ascii=False, indent=2))
                return
            print("Ferien und schulfreie Tage")
            print("-" * 26)
            for eintrag in sorted(daten, key=lambda e: e.get("startDate", 0)):
                von = dt.datetime.strptime(str(eintrag["startDate"]), "%Y%m%d").date()
                bis = dt.datetime.strptime(str(eintrag["endDate"]), "%Y%m%d").date()
                print(f"{von.strftime('%d.%m.%Y')} - {bis.strftime('%d.%m.%Y')}  "
                      f"{eintrag.get('longName') or eintrag.get('name')}")
            return

        if args.befehl == "raster":
            daten = untis.rpc("getTimegridUnits") or []
            if args.json:
                print(json.dumps(daten, ensure_ascii=False, indent=2))
                return
            namen = {1: "Sonntag", 2: "Montag", 3: "Dienstag", 4: "Mittwoch",
                     5: "Donnerstag", 6: "Freitag", 7: "Samstag"}
            for tag in daten:
                print(f"\n{namen.get(tag.get('day'), tag.get('day'))}")
                for einheit in tag.get("timeUnits", []):
                    print(f"  {einheit.get('name'):<4} {uhrzeit(einheit.get('startTime'))}-{uhrzeit(einheit.get('endTime'))}")
            return

        # plan / vertretungen
        von, bis = zeitraum_bestimmen(args)
        element_id, typ = untis.element_finden(args.wer)
        stunden = untis.stundenplan(element_id, typ, von, bis)

        if args.json:
            print(json.dumps(stunden, ensure_ascii=False, indent=2))
            return

        titel = f"{args.wer} · {von.strftime('%d.%m.%Y')} bis {bis.strftime('%d.%m.%Y')}"
        print(titel)
        print("=" * len(titel))
        stunden_ausgeben(stunden, untis, nur_aenderungen=(args.befehl == "vertretungen"))

    finally:
        untis.abmelden()


if __name__ == "__main__":
    main()
