/* Baut public/trainelia/unabhaengigkeit.html aus dem Gerüst von
   wahrscheinlichkeit.html (Helfer, Bilder, Anzeige, KI) und den
   Stationen in stationen_u.js. Aufruf: node trainelia-bau/baue_unab.mjs
   Kapitel 2 nie direkt in der HTML ändern: Stationen hier in
   stationen_u.js, Gemeinsames in wahrscheinlichkeit.html, dann neu bauen. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
const ORDNER = join(hier, "..", "public", "trainelia") + "/";
let s = readFileSync(ORDNER + "wahrscheinlichkeit.html", "utf8");
const stationen = readFileSync(join(hier, "stationen_u.js"), "utf8");

function ersetze(alt, neu) {
  const n = typeof alt === "string" ? s.split(alt).length - 1 : (s.match(new RegExp(alt.source, alt.flags.includes("g") ? alt.flags : alt.flags + "g")) || []).length;
  if (n !== 1) throw new Error(`Erwartet genau 1 Treffer, gefunden ${n}: ${String(alt).slice(0, 70)}`);
  s = s.replace(alt, neu);
}

ersetze(/<title>[^<]*<\/title>/, "<title>Stochastische Unabhängigkeit Schritt für Schritt</title>");
ersetze(/<meta name="description" content="[^"]*">/, `<meta name="description" content="Lernweg zur stochastischen Unabhängigkeit für die Oberstufe: Ziehen mit und ohne Zurücklegen, Prüfen an der Vierfeldertafel, Flächenbild, Würfel und Karten, Produktregel und ihre Grenzen. Vormachen, Üben mit immer neuen Aufgaben, Rückmeldung zum eigenen Rechenweg.">`);
ersetze(/<!--[\s\S]*?-->/, `<!--
  ===========================================================================
  Stochastische Unabhängigkeit Schritt für Schritt (Trainelia, Kapitel 2)
  ---------------------------------------------------------------------------
  Gebaut aus dem Gerüst von wahrscheinlichkeit.html: Helfer, Bilder, Anzeige
  und KI-Rückmeldung sind dieselben, die Stationen (Abschnitt 4) sind neu.

  BUCHFREI, OHNE LERNGRUPPE: keine Schulbuchaufgabe, kein Seitenverweis,
  kein Bezug auf eine Klasse oder Person.

  WAS DAS GERÄT VERLÄSST: Der Lernstand nie (localStorage). Nur wer die
  KI-Rückmeldung anfordert, schickt Aufgabe, Referenzlösung und den eigenen
  Rechenweg an den Dienst ki-rueckmeldung/ (Stationen u-…).
  ===========================================================================
-->`);
ersetze("<h1>Bedingte Wahrscheinlichkeit</h1>", `<h1>Stochastische Unabhängigkeit</h1>`);
ersetze(/(<details class="karte bereich zettel-b zettel" id="zettel">\s*<summary>Spickzettel<\/summary>\s*)<table>[\s\S]*?<\/table>/, `$1<table>
    <tr><td>unabhängig</td><td><span class="m">P(B | A) = P(B)</span>: Das Wissen, dass A eingetreten ist, ändert die Wahrscheinlichkeit von B nicht.</td></tr>
    <tr><td>Produktform</td><td>gleichwertig: <span class="m">P(A ∩ B) = P(A) · P(B)</span>. Gilt sie nicht, sind A und B <b>abhängig</b>.</td></tr>
    <tr><td>Tafel prüfen</td><td>P(A) mit P(A | B) vergleichen oder Innenfeld mit dem Produkt seiner Randwerte.</td></tr>
    <tr><td>Zurücklegen</td><td>mit Zurücklegen unabhängig, ohne Zurücklegen abhängig.</td></tr>
    <tr><td>Flächenbild</td><td>Breite P(B), Höhe in der Spalte P(A | B). Gerade Trennlinie heißt unabhängig.</td></tr>
    <tr><td>immer richtig</td><td><span class="m">P(A ∩ B) = P(B) · P(A | B)</span> (Pfadregel). Die Produktregel nur bei Unabhängigkeit.</td></tr>
    <tr><td>Vorsicht</td><td>Unvereinbar ist nicht unabhängig. Abhängig heißt nicht verursacht.</td></tr>
  </table>`);
ersetze(/<p class="leise wegweiser">/, `<p class="klein leise"><a href="./">Trainelia</a> ▸ Kapitel 2 · zuerst: <a href="wahrscheinlichkeit.html">Bedingte Wahrscheinlichkeit</a></p>\n    <p class="leise wegweiser">`);
ersetze('const STAND_KEY = "mu-wahrscheinlichkeit-stand";', 'const STAND_KEY = "mu-unabhaengigkeit-stand";');
s = s.split('"mu-wahrscheinlichkeit-zuletzt"').join('"mu-unabhaengigkeit-zuletzt"');

/* Abschnitt 4 austauschen */
const A4 = s.indexOf("/* ============================================================\n   4. Die Stationen");
const A5 = s.indexOf("/* ============================================================\n   5. Anzeige einer Station");
if (A4 < 0 || A5 < A4) throw new Error("Abschnittsmarken nicht gefunden");
s = s.slice(0, A4) + stationen + "\n" + s.slice(A5);

ersetze(/const KURZ = \{[\s\S]*?\};/, `const KURZ = { "u-idee": "Idee", "u-tafel": "Tafel prüfen", "u-ergaenzen": "Ergänzen", "u-flaeche": "Flächenbild",
  "u-abzaehlen": "Würfel & Karten", "u-falle": "Produktfalle", "u-mix": "Mix" };`);

/* Zusätzliche Gestaltung für Raster und Ursachenbild */
ersetze("</style>", `/* Gemeinsame Ursache */
svg.ursache{width:100%;max-width:340px;height:auto}
svg.ursache .uk{fill:var(--flaeche);stroke:var(--linie-stark);stroke-width:1.5} svg.ursache .uk.w{fill:var(--gold-hell);stroke:var(--gold)}
svg.ursache .ut{font-family:var(--schrift);font-size:15px;text-anchor:middle;fill:var(--text);font-weight:600}
svg.ursache .ut.klein2{font-size:12px;font-weight:400;fill:var(--text-leise)}
svg.ursache .ul{stroke:var(--text-leise);stroke-width:2} svg.ursache .up{fill:var(--text-leise)}
svg.ursache .ud{stroke:var(--violett);stroke-width:2;stroke-dasharray:5 4}
</style>`);

writeFileSync(ORDNER + "unabhaengigkeit.html", s, "utf8");
console.log("geschrieben:", s.length, "Zeichen");
