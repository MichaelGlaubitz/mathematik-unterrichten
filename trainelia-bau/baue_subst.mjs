/* Baut public/trainelia/substitution.html aus dem Gerüst von
   wahrscheinlichkeit.html (Helfer, Anzeige, KI, Sokrates) und den
   Stationen in stationen_s.js. Aufruf: node trainelia-bau/baue_subst.mjs
   Kapitel 3 nie direkt in der HTML ändern: Stationen hier in
   stationen_s.js, Gemeinsames in wahrscheinlichkeit.html, dann neu bauen.

   Was Kapitel 3 zusätzlich zum Gerüst bekommt (nur hier eingebaut):
   - KaTeX für Formeln; der Wort-für-Wort-Text behandelt Formeln als Ganzes
   - Sokrates fragt beim Zuschauen: Schritt mit  f  → Weiter erst nach der
     richtigen Antwort (oder „Antwort zeigen“)
   - Auswahl als Knöpfe mit Formeln statt Ausklappliste
   - Feldart "z": Zahl mit Toleranz, nie als Prozent gelesen; Brüche und
     Minus über die volle Tastatur (kein inputmode="decimal") */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
const ORDNER = join(hier, "..", "public", "trainelia") + "/";
let s = readFileSync(ORDNER + "wahrscheinlichkeit.html", "utf8");
const stationen = readFileSync(join(hier, "stationen_s.js"), "utf8");
const VERSION = "202611251800";

function ersetze(alt, neu, anzahl = 1) {
  const n = typeof alt === "string" ? s.split(alt).length - 1 : (s.match(new RegExp(alt.source, alt.flags.includes("g") ? alt.flags : alt.flags + "g")) || []).length;
  if (n !== anzahl) throw new Error(`Erwartet ${anzahl} Treffer, gefunden ${n}: ${String(alt).slice(0, 70)}`);
  if (typeof alt === "string") s = s.split(alt).join(neu);
  else s = s.replace(new RegExp(alt.source, alt.flags.includes("g") ? alt.flags : alt.flags + "g"), neu);
}

ersetze(/<title>[^<]*<\/title>/, "<title>Integration durch Substitution Schritt für Schritt</title>");
ersetze(/<meta name="description" content="[^"]*">/, `<meta name="description" content="Lernweg zur Integration durch Substitution für die Oberstufe: Kettenregel rückwärts, das Innere erkennen, das Verfahren in fünf Schritten, lineare Substitution, Grenzen mitnehmen, Fehler finden, erklären können. Vormachen mit Fragen, Üben mit immer neuen Aufgaben, Gespräch mit Sokrates, Rückmeldung zum eigenen Rechenweg.">`);
ersetze(/<!--[\s\S]*?-->/, `<!--
  ===========================================================================
  Integration durch Substitution Schritt für Schritt (Trainelia, Kapitel 3)
  ---------------------------------------------------------------------------
  Gebaut aus dem Gerüst von wahrscheinlichkeit.html mit
  trainelia-bau/baue_subst.mjs: Helfer, Anzeige, KI-Rückmeldung und
  Sokrates-Anbindung sind dieselben, die Stationen (Abschnitt 4) sind neu.
  Nicht hier ändern, sondern in trainelia-bau/stationen_s.js und neu bauen.

  BUCHFREI, OHNE LERNGRUPPE: keine Schulbuchaufgabe, kein Seitenverweis,
  kein Bezug auf eine Klasse oder Person.

  WAS DAS GERÄT VERLÄSST: Der Lernstand nie (localStorage). Nur wer die
  KI-Rückmeldung anfordert, schickt Aufgabe, Referenzlösung und den eigenen
  Rechenweg an den Dienst ki-rueckmeldung/ (Stationen s-…).
  ===========================================================================
-->`);
ersetze("</head>", `<link rel="stylesheet" href="/katex/katex.min.css">
<script src="/katex/katex.min.js"></script>
</head>`);
ersetze("<h1>Bedingte Wahrscheinlichkeit</h1>", "<h1>Integration durch Substitution</h1>");
ersetze(/<p class="leise wegweiser">/, `<p class="klein leise"><a href="./">Trainelia</a> ▸ Kapitel 3 · Analysis</p>\n    <p class="leise wegweiser">`);
ersetze(/(<details class="karte bereich zettel-b zettel" id="zettel">\s*<summary>Spickzettel<\/summary>\s*)<table>[\s\S]*?<\/table>/, `$1<table>
    <tr><td>Idee</td><td>Kettenregel rückwärts: <span data-tex="\\int f(g(x))\\cdot g'(x)\\,dx = F(g(x)) + C"></span></td></tr>
    <tr><td>Erkennen</td><td>eine Verkettung, und die Ableitung ihres Inneren steht bis auf eine Zahl als Faktor daneben.</td></tr>
    <tr><td>Fünf Schritte</td><td>① <span data-tex="u = g(x)"></span> ② <span data-tex="dx = \\frac{du}{g'(x)}"></span> ③ ersetzen, bis kein x mehr dasteht ④ integrieren ⑤ zurücksubstituieren, <span data-tex="+\\,C"></span></td></tr>
    <tr><td>linear</td><td><span data-tex="\\int f(ax+b)\\,dx = \\frac{1}{a}\\,F(ax+b) + C"></span></td></tr>
    <tr><td>bestimmt</td><td><span data-tex="\\int_a^b f(g(x))\\,g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du"></span>: Grenzen umrechnen, in u zu Ende rechnen.</td></tr>
    <tr><td>Grundintegrale</td><td><span data-tex="u^m \\to \\tfrac{u^{m+1}}{m+1}"></span> · <span data-tex="e^u \\to e^u"></span> · <span data-tex="\\sin u \\to -\\cos u"></span> · <span data-tex="\\cos u \\to \\sin u"></span> · <span data-tex="\\tfrac{1}{u} \\to \\ln|u|"></span> · <span data-tex="\\sqrt{u} \\to \\tfrac{2}{3}u^{3/2}"></span></td></tr>
    <tr><td>Probe</td><td>Ableiten: Es muss der Integrand herauskommen.</td></tr>
    <tr><td>Vorsicht</td><td>Bleibt nach dem Ersetzen ein x stehen, klappt diese Substitution nicht. Durch x „ausgleichen“ ist verboten.</td></tr>
  </table>`);
ersetze('const STAND_KEY = "mu-wahrscheinlichkeit-stand";', 'const STAND_KEY = "mu-substitution-stand";');
ersetze('"mu-wahrscheinlichkeit-zuletzt"', '"mu-substitution-zuletzt"', 2);

/* Sokrates: Kapitel-3-Baukästen statt Kapitel 2 */
ersetze(/<script src="sokrates-trainer\.js\?v=\d+"><\/script>\s*<script src="sokrates-trainer-u\.js\?v=\d+"><\/script>/,
  `<script src="sokrates-trainer.js?v=${VERSION}"></script>\n<script src="sokrates-trainer-s.js?v=${VERSION}"></script>`);

/* Abschnitt 4 austauschen */
const A4 = s.indexOf("/* ============================================================\n   4. Die Stationen");
const A5 = s.indexOf("/* ============================================================\n   5. Anzeige einer Station");
if (A4 < 0 || A5 < A4) throw new Error("Abschnittsmarken nicht gefunden");
s = s.slice(0, A4) + stationen + "\n" + s.slice(A5);

ersetze(/const KURZ = \{[\s\S]*?\};/, `const KURZ = { "s-idee": "Idee", "s-erkennen": "Erkennen", "s-verfahren": "Verfahren", "s-linear": "ax + b",
  "s-grenzen": "Grenzen", "s-fehler": "Fehler finden", "s-erklaeren": "Erklären", "s-mix": "Mix" };`);

/* Formeln als Ganzes aufschreiben; für Meldungen und KI das TeX lesen */
ersetze(".bruch, .q, svg, table", ".bruch, .q, svg, table, .katex", 2);
ersetze('  d.querySelectorAll("svg").forEach((e) => e.remove());', `  d.querySelectorAll(".katex").forEach((e) => { const a = e.querySelector("annotation"); e.textContent = a ? " " + a.textContent.replace(/\\\\htmlClass\\{[^}]*\\}/g, "") + " " : e.textContent; });
  d.querySelectorAll("svg").forEach((e) => e.remove());`);
ersetze('.replace(/\\s+/g, "").replace(/,/g, ".");', '.replace(/\\s+/g, "").replace(/[−–]/g, "-").replace(/,/g, ".");');

/* Feldart "z": nie als Prozent lesen */
ersetze('if (f.art !== "n" && !e.prozent && x > 1 && x <= 100) x = x / 100;', 'if (f.art !== "n" && f.art !== "z" && !e.prozent && x > 1 && x <= 100) x = x / 100;');
ersetze('const hinweis = f.art !== "n" && !e.prozent && e.wert > 1', 'const hinweis = f.art !== "n" && f.art !== "z" && !e.prozent && e.wert > 1');

/* Auswahl als Knöpfe; Eingabe mit voller Tastatur (Bruchstrich, Minus) */
ersetze(/<div class="feld" data-feld="auswahl"><label for="f-auswahl">[\s\S]*?<\/select><\/div>`;/,
  '<div class="feld wahlfeld" data-feld="auswahl"><span class="wahl-label">${aufgabe.auswahl.label}</span><input type="hidden" id="f-auswahl" value=""><div class="wahlen">${aufgabe.auswahl.optionen.map((o, i) => `<button type="button" class="wahl" data-i="${i}">${o}</button>`).join("")}</div></div>`;');
ersetze('<input id="f-${f.id}" inputmode="decimal" autocomplete="off">', '<input id="f-${f.id}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">');
ersetze('  if ($("#sokrates")) $("#sokrates").onclick = sokratesOeffnen;', `  if ($("#sokrates")) $("#sokrates").onclick = sokratesOeffnen;
  for (const b of $("#uebung").querySelectorAll(".wahl")) b.onclick = () => {
    $("#f-auswahl").value = b.dataset.i;
    for (const x of $("#uebung").querySelectorAll(".wahl")) x.classList.toggle("an", x === b);
    b.closest(".feld").classList.remove("richtig", "falsch");
  };`);
ersetze('placeholder="So wie im Heft: z. B. P(A|B) = 53/194 ≈ 0,27"', 'placeholder="So wie im Heft: z. B. u = x² + 1, du = 2x dx, also dx = du/(2x) …"');

/* Sokrates fragt beim Zuschauen */
ersetze('<div class="schritt" id="schritt" title="Klick: alles zeigen"></div>', '<div><div class="schritt" id="schritt" title="Klick: alles zeigen"></div><div id="vorFrage"></div></div>');
ersetze(/function vorZeichnen\(\) \{[\s\S]*?\n\}\n/, `const VF_OK = new Set();     // beantwortete Fragen (Stationsschritt), gilt bis zum Neuladen
function vorZeichnen() {
  const v = aktiv.vor, sch = v[vorSchritt], letzter = vorSchritt === v.length - 1, schl = aktiv.id + ":" + vorSchritt;
  $("#bild").innerHTML = sch.v();
  $("#bild").firstElementChild && $("#bild").firstElementChild.classList.add("einblenden");
  $("#vorFrage").innerHTML = "";
  const offen = !!sch.f && !VF_OK.has(schl);
  aufschreiben($("#schritt"), sch.t, () => {
    if (sch.f) vorFrage(sch.f, schl, letzter);
    else if (letzter) zeigeKaesten();
  });
  $("#punkte").innerHTML = v.map((_, k) => \`<i class="\${k <= vorSchritt ? "an" : ""}"></i>\`).join("");
  $("#weiter").disabled = offen;
  $("#weiter").textContent = offen ? "Erst antworten" : letzter ? "Jetzt üben ▸" : "Weiter ▸";
  $("#zurueck").disabled = vorSchritt === 0;
}
function vorFrage(f, schl, letzter) {
  const box = $("#vorFrage");
  box.innerHTML = \`<div class="vfrage einblenden"><div class="vf-kopf">🏛 Sokrates fragt</div><div class="vf-frage">\${f.q}</div>
    <div class="vf-optionen">\${f.o.map((o, i) => \`<button type="button" class="vf-opt" data-i="\${i}">\${o.t}</button>\`).join("")}</div>
    <div id="vfAntwort"></div>
    <div class="leiste"><button type="button" class="klein" id="vfZeigen">Antwort zeigen</button></div></div>\`;
  const knoepfe = [...box.querySelectorAll(".vf-opt")], ri = f.o.findIndex((o) => o.ok);
  const geloest = (sofort) => {
    VF_OK.add(schl);
    knoepfe.forEach((b, j) => { b.disabled = true; b.classList.toggle("richtig", j === ri); });
    $("#vfZeigen").hidden = true;
    const html = \`<div class="vf-gut">\${f.o[ri].w || "Recht so."}\${f.d ? " " + f.d : ""}</div>\`;
    if (sofort) $("#vfAntwort").innerHTML = html; else aufschreiben($("#vfAntwort"), html);
    $("#weiter").disabled = false;
    $("#weiter").textContent = letzter ? "Jetzt üben ▸" : "Weiter ▸";
    if (letzter) zeigeKaesten();
  };
  knoepfe.forEach((b, i) => (b.onclick = () => {
    if (i === ri) { geloest(false); return; }
    b.classList.add("falsch"); b.disabled = true;
    aufschreiben($("#vfAntwort"), \`<div class="vf-schlecht">\${f.o[i].w || "Noch nicht. Überlege noch einmal."}</div>\`);
  }));
  $("#vfZeigen").onclick = () => geloest(false);
  if (VF_OK.has(schl)) geloest(true);
}
`);

/* Zusätzliche Gestaltung */
ersetze("</style>", `/* Kapitel 3: Formeln, Fragen beim Zuschauen, Knopfauswahl, Graphen */
.katex{font-size:1.07em}
.aufgabe .katex-display,.tipp .katex-display,.fbild .katex-display{overflow-x:auto;overflow-y:hidden;padding:2px 0}
.t-in{color:var(--akzent)} .t-ab{color:var(--teal)}
.fbild{width:100%;text-align:center;overflow-x:auto}
.rweg{width:100%;display:flex;flex-direction:column;gap:4px}
.rz{display:flex;gap:10px;align-items:baseline;padding:5px 8px;border-radius:6px}
.rz>span:last-child{min-width:0;overflow-x:auto;overflow-y:hidden;padding:2px 0}
.rweg .katex{font-size:1em}
.rz.neu{background:var(--akzent-hell)}
.rnr{color:var(--text-schwach);min-width:1.4em;font-weight:700}
.aufgabe .rweg{margin:8px 0}
.vfrage{margin-top:14px;padding:12px 14px;background:var(--flaeche);border:1px solid var(--linie);border-left:4px solid var(--violett);border-radius:var(--radius-klein)}
.vf-kopf{font-size:.74rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--violett)}
.vf-frage{font-weight:600;margin:.25em 0 .6em}
.vf-optionen,.wahlen{display:flex;flex-direction:column;gap:6px}
.vf-opt,.wahl{text-align:left;line-height:1.5}
.vf-opt:disabled{opacity:1;cursor:default}
.vf-opt.richtig{border-color:var(--gruen);background:var(--gruen-hell)}
.vf-opt.falsch{border-color:var(--rot);background:var(--rot-hell);opacity:.65}
.vf-gut,.vf-schlecht{margin-top:8px;padding:8px 10px;border-radius:6px}
.vf-gut{background:var(--gruen-hell);border:1px solid var(--gruen)}
.vf-schlecht{background:var(--rot-hell);border:1px solid var(--rot)}
.wahlfeld{flex-direction:column;align-items:stretch}
.wahl.an{border-color:var(--akzent);background:var(--akzent-hell)}
.feld.richtig .wahl.an{border-color:var(--gruen);background:var(--gruen-hell)}
.feld.falsch .wahl.an{border-color:var(--rot);background:var(--rot-hell)}
svg.gr{width:100%;max-width:400px;height:auto}
svg.gr .git{stroke:var(--linie);stroke-width:1}
svg.gr .ach{stroke:var(--text-leise);stroke-width:1.3}
svg.gr text{font-family:var(--schrift);font-size:11px;fill:var(--text-leise)}
svg.gr text.an{font-style:italic;font-size:12px}
svg.gr .ku-a{fill:none;stroke:var(--akzent);stroke-width:2.5}
svg.gr .ku-b{fill:none;stroke:var(--teal);stroke-width:2.5}
svg.gr .fa-a{fill:var(--akzent);fill-opacity:.22}
svg.gr .fa-b{fill:var(--teal);fill-opacity:.28}
svg.gr .lt-a{fill:var(--akzent);font-weight:600;font-size:12px}
svg.gr .lt-b{fill:var(--teal);font-weight:600;font-size:12px}
svg.gr .ft{fill:var(--text);font-weight:700;font-size:12px}
</style>`);

writeFileSync(ORDNER + "substitution.html", s, "utf8");
console.log("geschrieben:", s.length, "Zeichen");
