---
title: "Eine Datei, kein Konto, offline"
untertitel: "Warum diese Seite eigene Software hat – und warum sie so schlicht gebaut ist"
autor: "Dr. Michael Glaubitz"
datum: 2026-08-28
tags: ["werkzeuge", "digitalisierung", "datenschutz", "unterrichtspraxis", "beamer"]
kategorie: "Werkzeug"
teaser: "Es gibt für alles eine App. Nur funktioniert sie im entscheidenden Moment nicht: kein Login, kein WLAN, keine Installationsrechte, keine Zeit. Deshalb gibt es hier jetzt einen Werkzeugkasten, in dem jedes Werkzeug aus genau einer HTML-Datei besteht."
entwurf: false
---

Die Szene kennt jede Lehrkraft. Man hat sich abends etwas Gutes überlegt, öffnet morgens am Schulrechner die Seite – und dann kommt der Login. Oder das Update. Oder die Meldung, dass die Testphase abgelaufen ist. Oder das WLAN ist weg. Es sind noch vier Minuten bis zum Gong, und man greift zu dem, was sicher funktioniert: dem Buch.

Aus dieser Beobachtung ist der [Werkzeugkasten](/werkzeuge) entstanden: die Dinge, die ich im Unterricht regelmäßig brauche, jeweils als **eine einzelne HTML-Datei**. Ein Phasen-Timer, Zufallsgruppen, eine Whiteboard-Auswertung, ein Funktionenplotter, Bruchstreifen, ein zoombarer Zahlenstrahl, eine Gleichungswaage, ein Prozentstreifen, ein Kopfrechen-Sprint, WODB-Bilder, Open-Middle-Aufgaben, Zufallsexperimente, druckbares Papier und ein Exit-Ticket.

## Die vier Entscheidungen dahinter

**Kein Login.** Niemand legt vier Minuten vor dem Gong ein Konto an. Es gibt keine Anmeldung, weil es nichts gibt, wofür man sich anmelden müsste.

**Kein CDN, kein Framework.** Jede Datei bringt alles mit, was sie braucht. Das bedeutet: Wenn die Seite einmal geladen ist, läuft sie weiter – auch wenn das Schulnetz mitten in der Stunde aussteigt. Und sie lässt sich mit `Strg`+`S` speichern und vom Stick starten.

**Keine Datenübertragung.** Klassenlisten und Whiteboard-Auswertungen bleiben im Speicher des Browsers. Es gibt keinen Server, der sie entgegennehmen könnte. Das ist keine Datenschutzerklärung, sondern eine Architekturentscheidung: Was nirgendwohin gesendet wird, kann auch nirgendwo landen.

**Beamer zuerst.** Jedes Werkzeug hat einen Modus, in dem alles größer wird – eine Taste, `B`. Software, die für den Schreibtisch entworfen wurde, ist aus der dritten Reihe nicht lesbar. Das merkt man immer erst in der Stunde.

## Warum nicht einfach GeoGebra?

Weil GeoGebra hervorragend ist – und für die Fragen, um die es hier geht, zu groß. Ich brauche keinen Werkzeugkasten mit dreihundert Funktionen, wenn ich in zwanzig Sekunden zeigen will, was passiert, wenn sich in $f(x) = a(x-b)^2 + c$ das $b$ ändert. Ich brauche einen Schieberegler und eine beschriftete Achse.

Diese Spezialisierung ist der Punkt. Der [Funktionenplotter](/werkzeuge/funktionenplotter.html) kann bewusst wenig: drei Funktionen, drei Parameter, eine Spur, eine Wertetabelle. Dafür braucht er keine Einarbeitung, und die Klasse schaut auf den Graphen statt auf die Menüleiste.

## Was mathematisch nicht verhandelbar war

Ein Detail, das mir wichtig ist: Alle Koordinatensysteme in diesen Werkzeugen folgen derselben Konvention – **beide Achsen mit Variablennamen beschriftet, Skalenstriche auf beiden Achsen, Pfeilspitzen in positiver Richtung, und die positiven Achsen reichen immer mindestens bis +2**, damit Pfeilspitze und Beschriftung nicht im Ursprung übereinanderliegen.

Das klingt nach Kleinigkeit. Es ist aber der Unterschied zwischen einem Bild, aus dem man ablesen kann, und einer Illustration. Und Lernende übernehmen, was sie sehen: Wer ein Jahr lang unbeschriftete Achsen an der Wand hat, beschriftet seine eigenen auch nicht.

Dasselbe gilt für die Maßstäblichkeit. In den [Bruchstreifen](/werkzeuge/bruchstreifen.html) entspricht die gefüllte Fläche exakt dem Zahlenwert – auch dann, wenn ein ungünstiger Nenner ein hässliches Bild ergibt. Ein Bild, das schöner ist als die Zahl, erzeugt genau die Fehlvorstellungen, die es beheben sollte.

## Was fehlt

Vieles. Es gibt keine Geometrie-Konstruktion, keine Tabellenkalkulation, keine Möglichkeit, Schülerantworten von deren Geräten einzusammeln – Letzteres bewusst nicht, weil es ohne Server nicht geht und ein Server die Datenschutzfrage sofort wieder aufmacht.

Wenn Ihnen etwas fehlt, das in diese Bauweise passt – eine Datei, kein Konto, offline lauffähig –, [schreiben Sie mir](/kontakt). Die Liste ist aus meinem eigenen Unterricht entstanden und deshalb zwangsläufig nach meinem Fachbedarf verzerrt.

**Zum Werkzeugkasten:** [alle Werkzeuge in der Übersicht](/werkzeuge)
