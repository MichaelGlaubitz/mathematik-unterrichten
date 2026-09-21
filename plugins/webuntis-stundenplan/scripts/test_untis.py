#!/usr/bin/env python3
"""Kleiner Selbsttest der Datums- und Darstellungslogik (ohne Netzzugriff).

Aufruf: python3 test_untis.py
"""
import datetime as dt
import io
import contextlib
import untis


def pruefe(bedingung, text):
    print(("ok   " if bedingung else "FEHL ") + text)
    return bool(bedingung)


class UntisAttrappe(untis.Untis):
    def __init__(self):
        self._stammdaten = {
            "klassen": [{"id": 1, "name": "10b", "longName": "Klasse 10b"}],
            "lehrer": [{"id": 7, "name": "GLA", "longName": "Glaubitz"}],
            "faecher": [{"id": 3, "name": "MA", "longName": "Mathematik"}],
            "raeume": [{"id": 9, "name": "A102", "longName": "Mathe-Raum"}],
        }
        self.person_id, self.person_typ = 7, 2


def main():
    alles_gut = True
    heute = dt.date.today()

    alles_gut &= pruefe(untis.datum_lesen("heute") == heute, "datum_lesen('heute')")
    alles_gut &= pruefe(untis.datum_lesen("morgen") == heute + dt.timedelta(days=1), "datum_lesen('morgen')")
    alles_gut &= pruefe(untis.datum_lesen("2026-09-08") == dt.date(2026, 9, 8), "datum_lesen ISO")
    alles_gut &= pruefe(untis.datum_lesen("08.09.2026") == dt.date(2026, 9, 8), "datum_lesen deutsch")
    alles_gut &= pruefe(untis.datum_lesen("20260908") == dt.date(2026, 9, 8), "datum_lesen kompakt")
    alles_gut &= pruefe(untis.datum_lesen("montag").weekday() == 0, "datum_lesen Wochentag")
    alles_gut &= pruefe(untis.uhrzeit(800) == "08:00" and untis.uhrzeit(1345) == "13:45", "uhrzeit")

    attrappe = UntisAttrappe()
    alles_gut &= pruefe(attrappe.element_finden("klasse:10b") == (1, untis.TYP_KLASSE), "element_finden Klasse")
    alles_gut &= pruefe(attrappe.element_finden("10b") == (1, untis.TYP_KLASSE), "element_finden ohne Praefix")
    alles_gut &= pruefe(attrappe.element_finden("lehrer:gla") == (7, untis.TYP_LEHRER), "element_finden Lehrkraft")
    alles_gut &= pruefe(attrappe.element_finden("ich") == (7, 2), "element_finden eigenes Element")

    stunden = [
        {"date": 20260908, "startTime": 800, "endTime": 845, "su": [{"id": 3, "name": "MA"}],
         "kl": [{"id": 1, "name": "10b"}], "te": [{"id": 7, "name": "GLA"}], "ro": [{"id": 9, "name": "A102"}]},
        {"date": 20260908, "startTime": 900, "endTime": 945, "code": "cancelled",
         "su": [{"id": 3, "name": "MA"}], "kl": [{"id": 1, "name": "10b"}], "te": [], "ro": [],
         "substText": "Klassenfahrt"},
    ]
    puffer = io.StringIO()
    with contextlib.redirect_stdout(puffer):
        untis.stunden_ausgeben(stunden, attrappe)
    ausgabe = puffer.getvalue()
    alles_gut &= pruefe("08:00-08:45" in ausgabe and "FAELLT AUS" in ausgabe, "stunden_ausgeben Tabelle")
    alles_gut &= pruefe("Klassenfahrt" in ausgabe, "stunden_ausgeben Vertretungstext")

    puffer = io.StringIO()
    with contextlib.redirect_stdout(puffer):
        untis.stunden_ausgeben(stunden, attrappe, nur_aenderungen=True)
    alles_gut &= pruefe(puffer.getvalue().count("08:00") == 0, "stunden_ausgeben filtert Normalstunden")

    # Erreichbarkeitspruefung ohne Netz: die Antworten werden untergeschoben
    urspruenglich = untis._rpc_roh
    try:
        untis._rpc_roh = lambda *a, **k: {"error": {"code": -8520, "message": "not authenticated"}}
        offen, _ = untis.erreichbarkeit_pruefen("https://aeghm.webuntis.com", "aeghm")
        alles_gut &= pruefe(offen, "erreichbar: -8520 heisst offen")

        untis._rpc_roh = lambda *a, **k: {"error": {"code": -8998, "message": "unknown school"}}
        offen, meldung = untis.erreichbarkeit_pruefen("https://aeghm.webuntis.com", "falsch")
        alles_gut &= pruefe(not offen and "Schulkuerzel" in meldung, "erreichbar: -8998 heisst Kuerzel falsch")

        untis._rpc_roh = lambda *a, **k: {"result": []}
        offen, _ = untis.erreichbarkeit_pruefen("https://aeghm.webuntis.com", "aeghm")
        alles_gut &= pruefe(offen, "erreichbar: Antwort ohne Fehler heisst offen")

        def wirft_404(*a, **k):
            raise untis.urllib.error.HTTPError("u", 404, "Not Found", None, None)
        untis._rpc_roh = wirft_404
        offen, meldung = untis.erreichbarkeit_pruefen("https://aeghm.webuntis.com", "falsch")
        alles_gut &= pruefe(not offen and "suche-schule" in meldung, "erreichbar: 404 verweist auf die Schulsuche")
    finally:
        untis._rpc_roh = urspruenglich

    print("\nAlle Pruefungen bestanden." if alles_gut else "\nEs gab Fehler.")
    return 0 if alles_gut else 1


if __name__ == "__main__":
    raise SystemExit(main())
