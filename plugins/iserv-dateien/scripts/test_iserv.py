#!/usr/bin/env python3
"""Selbsttest der WebDAV-Auswertung (ohne Netzzugriff). Aufruf: python3 test_iserv.py"""
import io
import iserv

ANTWORT = b"""<?xml version="1.0" encoding="utf-8"?>
<d:multistatus xmlns:d="DAV:">
  <d:response>
    <d:href>/webdav/Files/Groups/Mathe%2010b/</d:href>
    <d:propstat><d:prop>
      <d:displayname>Mathe 10b</d:displayname>
      <d:resourcetype><d:collection/></d:resourcetype>
    </d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat>
  </d:response>
  <d:response>
    <d:href>/webdav/Files/Groups/Mathe%2010b/Abgaben/</d:href>
    <d:propstat><d:prop>
      <d:displayname>Abgaben</d:displayname>
      <d:resourcetype><d:collection/></d:resourcetype>
    </d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat>
  </d:response>
  <d:response>
    <d:href>/webdav/Files/Groups/Mathe%2010b/Arbeitsblatt%201.pdf</d:href>
    <d:propstat><d:prop>
      <d:displayname>Arbeitsblatt 1.pdf</d:displayname>
      <d:getcontentlength>204800</d:getcontentlength>
      <d:getlastmodified>Mon, 07 Sep 2026 09:12:00 GMT</d:getlastmodified>
      <d:resourcetype/>
    </d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat>
  </d:response>
</d:multistatus>"""


def pruefe(bedingung, text):
    print(("ok   " if bedingung else "FEHL ") + text)
    return bool(bedingung)


def main():
    verbindung = iserv.IServ({"ISERV_URL": "https://schule.de/webdav",
                              "ISERV_USER": "a", "ISERV_PASSWORT": "b"})
    verbindung.anfragen = lambda *a, **k: io.BytesIO(ANTWORT)

    gut = True
    gut &= pruefe(verbindung.adresse("") == "https://schule.de/webdav/", "adresse Wurzel")
    gut &= pruefe(verbindung.adresse("Files/Groups/Mathe 10b") ==
                  "https://schule.de/webdav/Files/Groups/Mathe%2010b", "adresse kodiert Leerzeichen")

    eintraege = verbindung.auflisten("Files/Groups/Mathe 10b")
    gut &= pruefe(len(eintraege) == 2, "der Ordner selbst wird uebersprungen")
    gut &= pruefe(eintraege[0]["name"] == "Abgaben" and eintraege[0]["ordner"], "Ordner zuerst")
    gut &= pruefe(eintraege[1]["name"] == "Arbeitsblatt 1.pdf" and eintraege[1]["groesse"] == 204800,
                  "Datei mit Groesse")
    gut &= pruefe(iserv.groesse_lesbar(204800) == "200.0 KB", "groesse_lesbar")

    print("\nAlle Pruefungen bestanden." if gut else "\nEs gab Fehler.")
    return 0 if gut else 1


if __name__ == "__main__":
    raise SystemExit(main())
