#!/usr/bin/env python3
"""Erzeugt das Standard-OG-Bild (public/og-default.png, 1200x630).

Reproduzierbar: `python3 scripts/og-bild.py`. Benoetigt Pillow.
Farben und Typografie folgen dem Design-System der Seite
(tailwind.config.mjs: surface #faf8f2, accent/teal/violet, Serif-Headline).
"""
from __future__ import annotations

import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

BREITE, HOEHE = 1200, 630
GRUND = (250, 248, 242)          # surface
TINTE = (42, 36, 29)             # ink-900
TINTE_WEICH = (86, 73, 56)       # ink-700
AKZENT = (37, 99, 235)           # accent-600
TEAL = (13, 148, 136)            # teal-600
VIOLETT = (124, 58, 237)         # violet-600

FONT_DIR = "/mnt/skills/examples/canvas-design/canvas-fonts"
SERIF_FETT = os.path.join(FONT_DIR, "IBMPlexSerif-Bold.ttf")
SANS = os.path.join(FONT_DIR, "InstrumentSans-Regular.ttf")
SANS_FETT = os.path.join(FONT_DIR, "InstrumentSans-Bold.ttf")


def blob(bild: Image.Image, mx: int, my: int, rx: int, ry: int, farbe, staerke: float) -> None:
    """Weicher Farbschleier wie die radialen Verlaeufe der Seite."""
    schicht = Image.new("RGB", bild.size, GRUND)
    maske = Image.new("L", bild.size, 0)
    ImageDraw.Draw(maske).ellipse([mx - rx, my - ry, mx + rx, my + ry], fill=int(255 * staerke))
    maske = maske.filter(ImageFilter.GaussianBlur(radius=max(rx, ry) * 0.42))
    ImageDraw.Draw(schicht).rectangle([0, 0, bild.size[0], bild.size[1]], fill=farbe)
    bild.paste(Image.composite(schicht, bild, maske), (0, 0))


def verlaufstext(bild: Image.Image, xy, text: str, font, von, bis) -> None:
    """Text mit horizontalem Farbverlauf (wie die Gradient-Headline der Seite)."""
    maske = Image.new("L", bild.size, 0)
    ImageDraw.Draw(maske).text(xy, text, font=font, fill=255)
    verlauf = Image.new("RGB", bild.size)
    zeichner = ImageDraw.Draw(verlauf)
    for x in range(bild.size[0]):
        t = x / (bild.size[0] - 1)
        zeichner.line(
            [(x, 0), (x, bild.size[1])],
            fill=tuple(round(von[i] + (bis[i] - von[i]) * t) for i in range(3)),
        )
    bild.paste(Image.composite(verlauf, bild, maske), (0, 0))


def karo(bild: Image.Image, kasten, schritt: int, farbe) -> None:
    """Karopapier, das nach links und oben weich ausblendet (keine harte Kante)."""
    x0, y0, x1, y1 = kasten
    gitter = Image.new("RGB", bild.size, GRUND)
    zeichner = ImageDraw.Draw(gitter)
    for x in range(x0, x1 + 1, schritt):
        zeichner.line([(x, y0), (x, y1)], fill=farbe, width=1)
    for y in range(y0, y1 + 1, schritt):
        zeichner.line([(x0, y), (x1, y)], fill=farbe, width=1)

    maske = Image.new("L", bild.size, 0)
    mz = ImageDraw.Draw(maske)
    weiche = 220
    for x in range(x0, x1 + 1):
        fx = min(1.0, (x - x0) / weiche)
        for_spalte = round(255 * fx)
        mz.line([(x, y0), (x, y1)], fill=for_spalte)
    # zusaetzlich nach oben ausblenden
    oben = Image.new("L", bild.size, 255)
    oz = ImageDraw.Draw(oben)
    for y in range(y0, y1 + 1):
        oz.line([(x0, y), (x1, y)], fill=round(255 * min(1.0, (y - y0) / weiche)))
    maske = Image.composite(maske, Image.new("L", bild.size, 0), oben)
    maske = Image.eval(maske, lambda v: v)
    from PIL import ImageChops

    maske = ImageChops.multiply(maske, oben)
    bild.paste(Image.composite(gitter, bild, maske), (0, 0))


def main() -> None:
    bild = Image.new("RGB", (BREITE, HOEHE), GRUND)

    # Hintergrund: dieselben drei Farbschleier wie .mu-page-bg
    blob(bild, 96, -30, 620, 330, (191, 219, 254), 0.55)      # accent-200
    blob(bild, 1150, 24, 470, 300, (221, 214, 254), 0.5)      # violet-200
    blob(bild, 500, 690, 430, 280, (153, 246, 228), 0.45)     # teal-200

    zeichner = ImageDraw.Draw(bild)

    # Dezentes Karopapier rechts unten - Mathematikheft als Motiv
    karo(bild, (700, 300, 1200, 630), 30, (214, 203, 183))
    zeichner = ImageDraw.Draw(bild)

    # Kopfleiste im Markenverlauf (wie der 4px-Streifen unter dem Header)
    for x in range(BREITE):
        t = x / (BREITE - 1)
        if t < 0.5:
            u = t / 0.5
            farbe = tuple(round(AKZENT[i] + (TEAL[i] - AKZENT[i]) * u) for i in range(3))
        else:
            u = (t - 0.5) / 0.5
            farbe = tuple(round(TEAL[i] + (VIOLETT[i] - TEAL[i]) * u) for i in range(3))
        zeichner.line([(x, 0), (x, 9)], fill=farbe)

    serif_gross = ImageFont.truetype(SERIF_FETT, 76)
    sans_mittel = ImageFont.truetype(SANS, 30)
    sans_klein = ImageFont.truetype(SANS_FETT, 22)
    sans_fuss = ImageFont.truetype(SANS, 24)

    rand = 82

    # Eyebrow
    zeichner.text((rand, 92), "DIDAKTIK · DIAGNOSE · WERKZEUGE", font=sans_klein, fill=AKZENT)

    # Headline, zweite Zeile im Markenverlauf
    zeichner.text((rand, 140), "So geht", font=serif_gross, fill=TINTE)
    verlaufstext(bild, (rand, 232), "Mathematikunterricht.", serif_gross, AKZENT, VIOLETT)

    # Lead
    zeichner = ImageDraw.Draw(bild)
    zeichner.text(
        (rand, 352),
        "Was die Forschung über das Lernen von Mathematik weiß –",
        font=sans_mittel,
        fill=TINTE_WEICH,
    )
    zeichner.text(
        (rand, 394),
        "und was Sie am Montag damit anfangen können.",
        font=sans_mittel,
        fill=TINTE_WEICH,
    )

    # Trennlinie + Wortmarke
    zeichner.line([(rand, 470), (BREITE - rand, 470)], fill=(220, 213, 197), width=2)
    zeichner.text((rand, 500), "mathematik-unterrichten.de", font=sans_fuss, fill=TINTE)
    marke = "Dr. Michael Glaubitz"
    breite_marke = zeichner.textlength(marke, font=sans_fuss)
    zeichner.text((BREITE - rand - breite_marke, 500), marke, font=sans_fuss, fill=TINTE_WEICH)

    # Kleines rechtwinkliges Dreieck als Signet (a²+b²=c², masstabsgetreu 3-4-5)
    ox, oy, e = 980, 250, 34
    a, b = 3 * e, 4 * e
    zeichner.polygon([(ox, oy), (ox + b, oy), (ox, oy - a)], outline=AKZENT, width=4)
    zeichner.rectangle([ox, oy - 16, ox + 16, oy], outline=AKZENT, width=3)

    ziel = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "og-default.png")
    bild.save(ziel, "PNG", optimize=True)
    print(f"geschrieben: {ziel} ({os.path.getsize(ziel) // 1024} KB)")


if __name__ == "__main__":
    main()
