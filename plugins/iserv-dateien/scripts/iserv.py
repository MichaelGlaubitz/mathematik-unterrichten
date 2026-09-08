#!/usr/bin/env python3
"""iserv.py - Die IServ-Dateiablage ueber WebDAV bedienen.

Nur Standardbibliothek. Zugangsdaten aus der Umgebung oder aus
~/.config/schul-plugins/iserv.env:

    ISERV_URL=https://meine-schule.de
    ISERV_USER=vorname.nachname
    ISERV_PASSWORT=geheim

WebDAV liegt bei IServ unter <ISERV_URL>/webdav/ und zeigt die eigenen Dateien
sowie die Gruppenordner. Ein eigenes Passwort genuegt; eine Freischaltung durch
den Administrator ist nur noetig, wenn das WebDAV-Modul abgeschaltet ist.

Aufruf:  python3 iserv.py <befehl> [optionen]
"""

import argparse
import base64
import os
import pathlib
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

KONFIG_DATEI = pathlib.Path.home() / ".config" / "schul-plugins" / "iserv.env"

EINRICHTUNG = (
    "Es fehlen Zugangsdaten fuer IServ.\n"
    "Lege sie an mit:\n"
    "  mkdir -p ~/.config/schul-plugins\n"
    "  cat > ~/.config/schul-plugins/iserv.env <<'EOF'\n"
    "  ISERV_URL=https://meine-schule.de\n"
    "  ISERV_USER=vorname.nachname\n"
    "  ISERV_PASSWORT=geheim\n"
    "  EOF\n"
    "  chmod 600 ~/.config/schul-plugins/iserv.env"
)

DAV = "{DAV:}"


def konfig_lesen():
    werte = {}
    if KONFIG_DATEI.exists():
        for zeile in KONFIG_DATEI.read_text(encoding="utf-8").splitlines():
            zeile = zeile.strip()
            if zeile and not zeile.startswith("#") and "=" in zeile:
                schluessel, _, wert = zeile.partition("=")
                werte[schluessel.strip()] = wert.strip().strip('"').strip("'")

    for name in ("ISERV_URL", "ISERV_USER", "ISERV_PASSWORT"):
        aus_umgebung = os.environ.get(name) or os.environ.get("CLAUDE_PLUGIN_OPTION_" + name)
        if aus_umgebung:
            werte[name] = aus_umgebung

    if not all(werte.get(n) for n in ("ISERV_URL", "ISERV_USER", "ISERV_PASSWORT")):
        raise SystemExit(EINRICHTUNG)

    adresse = werte["ISERV_URL"].rstrip("/")
    if not adresse.startswith("http"):
        adresse = "https://" + adresse
    if not adresse.endswith("/webdav"):
        adresse += "/webdav"
    werte["ISERV_URL"] = adresse
    return werte


class IServ:
    def __init__(self, konfig):
        self.basis = konfig["ISERV_URL"]
        anmeldung = f"{konfig['ISERV_USER']}:{konfig['ISERV_PASSWORT']}".encode("utf-8")
        self.kopf_auth = "Basic " + base64.b64encode(anmeldung).decode("ascii")

    def adresse(self, pfad=""):
        pfad = (pfad or "").strip().strip("/")
        if not pfad:
            return self.basis + "/"
        teile = [urllib.parse.quote(t) for t in pfad.split("/") if t]
        return self.basis + "/" + "/".join(teile)

    def anfragen(self, methode, pfad="", daten=None, zusatz=None):
        kopf = {"Authorization": self.kopf_auth, "User-Agent": "claude-schul-plugin"}
        kopf.update(zusatz or {})
        anfrage = urllib.request.Request(self.adresse(pfad), data=daten,
                                         headers=kopf, method=methode)
        try:
            return urllib.request.urlopen(anfrage, timeout=60)
        except urllib.error.HTTPError as fehler:
            texte = {
                401: "Benutzername oder Passwort wurde von IServ abgelehnt.",
                403: "Der Zugang darf hier nicht schreiben oder lesen.",
                404: f"'{pfad}' gibt es nicht. Pruefe den Pfad mit 'ls'.",
                405: "Der Ordner existiert bereits oder die Aktion ist hier nicht erlaubt.",
                409: "Der uebergeordnete Ordner fehlt - lege ihn zuerst mit 'mkdir' an.",
                507: "Auf dem IServ ist kein Speicherplatz mehr frei.",
            }
            raise SystemExit(f"IServ antwortete mit HTTP {fehler.code}: "
                             f"{texte.get(fehler.code, fehler.reason)}")
        except urllib.error.URLError as fehler:
            raise SystemExit(f"IServ ist nicht erreichbar: {fehler.reason}")

    def auflisten(self, pfad=""):
        rumpf = ('<?xml version="1.0" encoding="utf-8"?>'
                 '<d:propfind xmlns:d="DAV:"><d:prop>'
                 '<d:displayname/><d:getcontentlength/><d:getlastmodified/><d:resourcetype/>'
                 '</d:prop></d:propfind>').encode("utf-8")
        antwort = self.anfragen("PROPFIND", pfad, daten=rumpf,
                                zusatz={"Depth": "1", "Content-Type": "application/xml"})
        baum = ET.fromstring(antwort.read())

        eigener_pfad = urllib.parse.urlparse(self.adresse(pfad)).path.rstrip("/")
        eintraege = []
        for knoten in baum.findall(DAV + "response"):
            href = knoten.findtext(DAV + "href") or ""
            href_pfad = urllib.parse.unquote(urllib.parse.urlparse(href).path).rstrip("/")
            if href_pfad == urllib.parse.unquote(eigener_pfad):
                continue  # der Ordner selbst
            prop = knoten.find(f"{DAV}propstat/{DAV}prop")
            if prop is None:
                continue
            ist_ordner = prop.find(f"{DAV}resourcetype/{DAV}collection") is not None
            name = prop.findtext(DAV + "displayname") or href_pfad.rsplit("/", 1)[-1]
            eintraege.append({
                "name": urllib.parse.unquote(name),
                "ordner": ist_ordner,
                "groesse": int(prop.findtext(DAV + "getcontentlength") or 0),
                "geaendert": prop.findtext(DAV + "getlastmodified") or "",
            })
        return sorted(eintraege, key=lambda e: (not e["ordner"], e["name"].lower()))

    def existiert(self, pfad):
        try:
            self.anfragen("HEAD", pfad)
            return True
        except SystemExit:
            return False

    def holen(self, pfad, ziel):
        antwort = self.anfragen("GET", pfad)
        ziel = pathlib.Path(ziel)
        ziel.parent.mkdir(parents=True, exist_ok=True)
        ziel.write_bytes(antwort.read())
        return ziel

    def legen(self, quelle, pfad):
        inhalt = pathlib.Path(quelle).read_bytes()
        self.anfragen("PUT", pfad, daten=inhalt,
                      zusatz={"Content-Type": "application/octet-stream",
                              "Content-Length": str(len(inhalt))})
        return len(inhalt)

    def ordner_anlegen(self, pfad):
        self.anfragen("MKCOL", pfad)


def groesse_lesbar(bytes_):
    for einheit in ("B", "KB", "MB", "GB"):
        if bytes_ < 1024 or einheit == "GB":
            return f"{bytes_:.0f} {einheit}" if einheit == "B" else f"{bytes_:.1f} {einheit}"
        bytes_ /= 1024


def main():
    zerleger = argparse.ArgumentParser(description="IServ-Dateien per WebDAV bedienen.")
    unter = zerleger.add_subparsers(dest="befehl", required=True)

    unter.add_parser("test", help="Zugang pruefen und Wurzelordner zeigen")
    p = unter.add_parser("ls", help="Ordner auflisten")
    p.add_argument("pfad", nargs="?", default="", help="z. B. 'Files/Groups/Mathe-10b'")
    p = unter.add_parser("get", help="Datei oder Ordner herunterladen")
    p.add_argument("pfad")
    p.add_argument("--ziel", default=".", help="Zielordner oder Zieldatei (Vorgabe: hier)")
    p.add_argument("--rekursiv", action="store_true", help="ganzen Ordner holen")
    p = unter.add_parser("put", help="Datei hochladen")
    p.add_argument("datei")
    p.add_argument("pfad", help="Zielpfad auf dem IServ, inkl. Dateiname")
    p.add_argument("--ueberschreiben", action="store_true",
                   help="vorhandene Datei ersetzen (sonst Abbruch)")
    p = unter.add_parser("mkdir", help="Ordner anlegen")
    p.add_argument("pfad")

    args = zerleger.parse_args()
    iserv = IServ(konfig_lesen())

    if args.befehl in ("test", "ls"):
        pfad = "" if args.befehl == "test" else args.pfad
        eintraege = iserv.auflisten(pfad)
        if args.befehl == "test":
            print(f"Zugang steht: {iserv.basis}")
        print(f"\n{'/' + pfad.strip('/') if pfad else '/'}")
        print("-" * 60)
        for eintrag in eintraege:
            if eintrag["ordner"]:
                print(f"[Ordner] {eintrag['name']}")
            else:
                print(f"         {eintrag['name']:<40} {groesse_lesbar(eintrag['groesse']):>9}"
                      f"  {eintrag['geaendert'][:16]}")
        print(f"\n{len(eintraege)} Eintrag/Eintraege.")
        if args.befehl == "test" and eintraege:
            print("Von hier aus weiter mit: ls '<Ordnername>'")
        return

    if args.befehl == "get":
        ziel = pathlib.Path(args.ziel)
        if args.rekursiv:
            geholt = 0
            def rekursiv(pfad, ordner):
                nonlocal geholt
                for eintrag in iserv.auflisten(pfad):
                    unterpfad = f"{pfad.strip('/')}/{eintrag['name']}"
                    if eintrag["ordner"]:
                        rekursiv(unterpfad, ordner / eintrag["name"])
                    else:
                        gespeichert = iserv.holen(unterpfad, ordner / eintrag["name"])
                        geholt += 1
                        print(f"geholt: {gespeichert}")
            rekursiv(args.pfad, ziel / pathlib.Path(args.pfad).name)
            print(f"\n{geholt} Datei(en) nach {ziel / pathlib.Path(args.pfad).name} geladen.")
            return
        dateiname = pathlib.Path(args.pfad).name
        zieldatei = ziel / dateiname if ziel.is_dir() or args.ziel.endswith("/") else ziel
        gespeichert = iserv.holen(args.pfad, zieldatei)
        print(f"Gespeichert: {gespeichert} ({groesse_lesbar(gespeichert.stat().st_size)})")
        return

    if args.befehl == "put":
        quelle = pathlib.Path(args.datei)
        if not quelle.is_file():
            raise SystemExit(f"Die Datei '{quelle}' gibt es nicht.")
        if iserv.existiert(args.pfad) and not args.ueberschreiben:
            raise SystemExit(f"Auf dem IServ liegt unter '{args.pfad}' bereits eine Datei. "
                             f"Mit --ueberschreiben ersetzen.")
        anzahl = iserv.legen(quelle, args.pfad)
        print(f"Hochgeladen: {args.pfad} ({groesse_lesbar(anzahl)})")
        return

    if args.befehl == "mkdir":
        iserv.ordner_anlegen(args.pfad)
        print(f"Ordner angelegt: {args.pfad}")
        return


if __name__ == "__main__":
    main()
