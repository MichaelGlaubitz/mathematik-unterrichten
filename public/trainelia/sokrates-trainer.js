/* =====================================================================
   SOKRATISCHER TRAINER FÜR TRAINELIA
   Baut zu der Aufgabe, die gerade auf dem Bildschirm steht, ein Gespräch
   mit Sokrates (DIALOG für /sokrates/engine.js) samt GeoGebra-Zeichnung.
   Jede Station liefert in ihrer Aufgabe ein Feld  sok  mit den gewürfelten
   Größen; hier steht je Station ein Baukasten  BAU[id](aufgabe) → DIALOG.
   Kapitel 2 trägt seine Baukästen in sokrates-trainer-u.js nach.

   Die Seite /trainelia/sokrates.html liest das Gespräch aus localStorage
   'trainelia-sokrates' (nur auf diesem Gerät, nichts geht ans Netz).
   ===================================================================== */
(function (g) {
"use strict";

/* ---------- Zahlen und Formeln (TeX) ---------- */
const ggt = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const rund = (x, st) => Math.round(x * 10 ** st) / 10 ** st;
/* Kommazahl für TeX: 0,375 → 0{,}375 */
function dz(x, st = 3) { return rund(x, st).toFixed(st).replace(/\.?0+$/, "").replace(".", "{,}"); }
/* gekürzter Bruch, ganze Zahl ohne Bruchstrich */
function fr(z, n) { const t = ggt(z, n); z /= t; n /= t; return n === 1 ? String(z) : `\\frac{${z}}{${n}}`; }
const frRoh = (z, n) => `\\frac{${z}}{${n}}`;
/* a/b ungekürzt, falls gekürzt anders: „\frac{6}{20} = \frac{3}{10}“ */
const frGleich = (z, n) => (ggt(z, n) > 1 ? `${frRoh(z, n)} = ${fr(z, n)}` : frRoh(z, n));
const ov = (s) => `\\overline{${s}}`;
const tx = (s) => `\\text{${s}}`;
const pzT = (x, st = 1) => `${dz(x * 100, st)}\\,\\%`;
const T2 = 0.011, T3 = 0.0011, T4 = 0.00011, GANZ = 0.4;
const LOB = ["Recht so.", "Genau.", "Vortrefflich.", "So ist es.", "Richtig."];
let lobNr = 0;
const lob = () => LOB[lobNr++ % LOB.length];
const gross = (s) => s[0].toUpperCase() + s.slice(1);

/* HTML aus den Stationen → Text mit $…$ für die Engine */
function zuTex(h) {
  return String(h == null ? "" : h)
    .replace(/<svg[\s\S]*?<\/svg>/g, "")
    .replace(/<span class="bruch"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g, (_, a, b) => `$\\frac{${a}}{${b}}$`)
    .replace(/<span class="q">([^<]*)<\/span>/g, (_, s) => `$\\overline{${s}}$`)
    .replace(/<br\s*\/?>/g, "\n").replace(/<\/p>\s*<p[^>]*>/g, "\n\n").replace(/<[^>]+>/g, "")
    .replace(/([A-Za-z])[̄̅]/g, (_, s) => `$\\overline{${s}}$`)
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim();
}
/* Aufgabentext: ohne Tafeln, Bilder und Eingabefelder; Legende als eine Zeile */
function aufgabeAus(html) {
  return zuTex(String(html)
    .replace(/<table[\s\S]*?<\/table>/g, "")
    .replace(/<\/span>\s*(?=<span class="chip)/g, "</span>; ")
    .replace(/<div class="legende">/g, "<p>").replace(/<\/div>/g, "</p>"))
    .replace(/\n{3,}/g, "\n\n");
}
/* Toleranz im Gespräch: etwa eine Einheit der letzten verlangten Stelle */
const tolFuer = (t) => (t >= 0.005 ? T2 : t >= 0.0005 ? T3 : t > 0 ? T4 : GANZ);
function fehlerAus(liste, loesung, tol, ab) {
  return (liste || []).filter((f) => isFinite(f.wert) && Math.abs(f.wert - loesung) > tol + 1e-12)
    .map((f) => ({ wert: f.wert, toleranz: tol, hinweis: zuTex(f.text || f.hinweis), ...(ab ? { ab } : {}) }));
}
/* Ein Feld der Trainelia-Aufgabe als Frage für „Ich rechne selbst“ */
function frage(f, ab, o = {}) {
  const tol = o.tol || (f.art === "n" ? GANZ : tolFuer(f.tol));
  const stellen = tol === T2 ? " (zwei Nachkommastellen)" : tol === T3 ? " (Bruch oder drei Nachkommastellen)" : tol === T4 ? " (vier Nachkommastellen)" : "";
  const kurz = o.kurz || zuTex(f.label);
  return { text: `${kurz}${stellen}:`, kurz, loesung: f.wert, toleranz: tol, ab, fehler: fehlerAus(f.fallen, f.wert, tol, ab) };
}
const feld = (a, id) => (a.felder || []).find((f) => f.id === id);

/* ---------- Zeichnungen ---------- */
const k3 = (x) => String(Math.round(x * 1000) / 1000);
const BREITE = 0.21;                                      // Breite eines Zeichens in Einheiten (\large)
function breite(tex) {
  const s = String(tex).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, a, b) => (a.length > b.length ? a : b))
    .replace(/\\(text|overline|large)\b/g, "").replace(/\\,|\\%|\{,\}/g, "x").replace(/[{}\\]/g, "");
  return s.length * BREITE + 0.1;
}
function Zeichnung() {
  const z = { befehle: [], stil: {}, sichtbar: [] };
  z.obj = (name, cmd, stil, an) => { z.befehle.push(`${name}=${cmd}`); z.stil[name] = stil; if (an) z.sichtbar.push(name); return name; };
  z.text = (name, tex, x, y, farbe, an, klein) => z.obj(name, `Text("${klein ? "" : "\\large "}${tex}",(${k3(x)},${k3(y)}),false,true)`, { farbe }, an);
  z.strecke = (name, x1, y1, x2, y2, stil, an) => z.obj(name, `Segment((${k3(x1)},${k3(y1)}),(${k3(x2)},${k3(y2)}))`, stil, an);
  z.seg = (x1, y1, x2, y2) => `Segment((${k3(x1)},${k3(y1)}),(${k3(x2)},${k3(y2)}))`;
  z.eck = (x0, y0, x1, y1) => `Polygon((${k3(x0)},${k3(y0)}),(${k3(x1)},${k3(y0)}),(${k3(x1)},${k3(y1)}),(${k3(x0)},${k3(y1)}))`;
  z.liste = (name, teile, stil, an) => z.obj(name, `{${teile.join(",")}}`, stil, an);
  z.fertig = (sicht) => ({ sicht, befehle: z.befehle, startwerte: {}, ziehbar: [], sichtbar: z.sichtbar, stil: z.stil });
  return z;
}

/* Baum mit zwei Stufen. b = {s1:[t,t], s2:[[t,t],[t,t]], p1:[t,t], p2:[[t,t],[t,t]], enden:[t,t,t,t], wurzel?}
   an = {p1:bool, p2:bool, enden:bool}: was von Anfang an zu sehen ist.
   Namen: a1 a2 · a11 a12 a21 a22 (Äste) · n… (Knoten) · q… (Wahrscheinlichkeiten) · e… (Pfadenden) */
function baumZ(z, b, an = {}, dx = 0, dy = 0) {
  const L1 = Math.max(...b.s1.map(breite)), L2 = Math.max(...b.s2.flat().map(breite));
  const x1 = 3 + dx, xs2 = x1 + 0.12 + L1 + 0.22, xl = xs2 + 3, xe = xl + 0.12 + L2 + 0.35;
  const Y1 = [2 + dy, -2 + dy], YL = [[3 + dy, 1 + dy], [-1 + dy, -3 + dy]];
  const ast = { farbe: "gold", dicke: 4 }, knoten = "creme", wk = "hellgold", ende = "leucht";
  /* Beschriftung dicht am Ast: oberer Ast darüber, unterer darunter */
  const q1pos = [[0.75 + dx, 1.25 + dy], [0.75 + dx, -1.8 + dy]];
  const q2pos = [[[xs2 + 1.05, 2.72 + dy], [xs2 + 1.05, 0.82 + dy]], [[xs2 + 1.05, -1.38 + dy], [xs2 + 1.05, -3.3 + dy]]];
  for (let i = 0; i < 2; i++) {
    z.strecke(`a${i + 1}`, 0.08 + dx, (i ? -0.08 : 0.08) + dy, x1, Y1[i] + (i ? 0.1 : -0.1), ast, true);
    z.text(`n${i + 1}`, b.s1[i], x1 + 0.12, Y1[i] - 0.17, knoten, true);
    if (b.p1 && b.p1[i] !== "" && b.p1[i] != null) z.text(`q${i + 1}`, b.p1[i], q1pos[i][0], q1pos[i][1], wk, !!an.p1, true);
    for (let j = 0; j < 2; j++) {
      const n = `${i + 1}${j + 1}`, y = YL[i][j];
      z.strecke(`a${n}`, xs2, Y1[i] + (j ? -0.05 : 0.05), xl, y + (j ? 0.05 : -0.05), ast, true);
      z.text(`n${n}`, b.s2[i][j], xl + 0.12, y - 0.17, knoten, true);
      if (b.p2 && b.p2[i][j] !== "" && b.p2[i][j] != null) z.text(`q${n}`, b.p2[i][j], q2pos[i][j][0], q2pos[i][j][1], wk, !!an.p2, true);
      if (b.enden && b.enden[2 * i + j] !== "" && b.enden[2 * i + j] != null) z.text(`e${n}`, b.enden[2 * i + j], xe, y - 0.22, ende, !!an.enden, true);
    }
  }
  if (b.wurzel) z.text("nw", b.wurzel, dx - 0.2, dy + 0.35, knoten, true);
  return [dx - 0.5, xe + 2.4, dy - 3.95, dy + 3.95];
}

/* Vierfeldertafel. o = {kopf:[t,t], seite:[t,t], w: 3×3 TeX|null, w2?: 3×3 TeX|null (zweite Zeile im Feld),
   an:Set("r,c") sichtbare Werte, an2:Set, legende:[zeile, zeile]}
   Namen: gitter rand · kb knb ksum sa sna ssum (Köpfe) · zRC (Wert) · wRC (zweiter Wert) · fRC (Feld zum Hervorheben) */
function tafelZ(z, o, dx = 0, dy = 0) {
  const cw = 2.3, ch = o.w2 ? 1.45 : 1.15, hw = 1.7, H = 4 * ch;
  const xs = [0, hw, hw + cw, hw + 2 * cw, hw + 3 * cw].map((x) => x + dx);
  const ys = [H, H - ch, H - 2 * ch, H - 3 * ch, 0].map((y) => y + dy);      // Oberkanten der Zeilen: Kopf, A, Ā, Summe
  const linien = [];
  [1, 2].forEach((r) => linien.push(z.seg(xs[0], ys[r], xs[4], ys[r])));
  [1, 2].forEach((c) => linien.push(z.seg(xs[c], ys[0], xs[c], ys[4])));
  z.liste("gitter", linien, { farbe: "matt", dicke: 2 }, true);
  z.liste("randlinie", [z.seg(xs[0], ys[3], xs[4], ys[3]), z.seg(xs[3], ys[0], xs[3], ys[4])], { farbe: "matt", dicke: 4 }, true);
  const kp = (x0, y0, t, name) => z.text(name, t, x0 + 0.25, y0 - ch / 2 - 0.15, "hellgold", true);
  kp(xs[1], ys[0], o.kopf[0], "kb"); kp(xs[2], ys[0], o.kopf[1], "knb"); kp(xs[3], ys[0], tx("Summe"), "ksum");
  kp(xs[0], ys[1], o.seite[0], "sa"); kp(xs[0], ys[2], o.seite[1], "sna"); kp(xs[0], ys[3], tx("Summe"), "ssum");
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const x0 = xs[c + 1], y1 = ys[r + 1], y0 = ys[r + 2], key = r + "," + c;
    z.liste(`f${r}${c}`, [z.eck(x0 + 0.04, y0 + 0.04, x0 + cw - 0.04, y1 - 0.04)], { farbe: "kupfer", dicke: 2, fuellung: 0.28 }, false);
    if (o.w && o.w[r][c] != null) z.text(`z${r}${c}`, o.w[r][c], x0 + 0.3, o.w2 ? y0 + 0.72 : y0 + 0.36, r === 2 || c === 2 ? "creme" : "leucht", !o.an || o.an.has(key));
    if (o.w2 && o.w2[r][c] != null) z.text(`w${r}${c}`, o.w2[r][c], x0 + 0.3, y0 + 0.14, "gruen", !!(o.an2 && o.an2.has(key)));
  }
  let unten = dy;
  (o.legende || []).forEach((t, i) => { unten = dy - 0.75 - 0.6 * i; z.text(`leg${i}`, t, xs[0], unten, "matt", true, true); });
  return [xs[0] - 0.3, xs[4] + 0.3, unten - 0.35, ys[0] + 0.3];
}
/* Legende einer Tafel aus dem Sachzusammenhang */
const legende = (k) => [`A: ${tx(k.A)}, \\;\\; ${ov("A")}: ${tx(k.nA)}`, `B: ${tx(k.B)}, \\;\\; ${ov("B")}: ${tx(k.nB)}`];
const zellen = (r, c) => (c === undefined ? [0, 1, 2].map((j) => `f${r}${j}`) : `f${r}${c}`);   // zellen(0) = Zeile A
const spalte = (c) => [0, 1, 2].map((i) => `f${i}${c}`).join(",");

/* Flächenbild (Mosaik): Spalten B | B̄ nach Breite, darin A unten (gold).
   Namen: rab rnab ranb rnanb (Rechtecke) · trenn (Trennlinien) · tb tnb ta… (Beschriftung) */
function flaecheZ(z, w) {
  const S = 6, wB = S * w[2][0] / w[2][2], hL = S * w[0][0] / w[2][0], hR = S * w[0][1] / w[2][1];
  z.liste("rab", [z.eck(0, 0, wB, hL)], { farbe: "gold", dicke: 2, fuellung: 0.5 }, true);
  z.liste("rnab", [z.eck(0, hL, wB, S)], { farbe: "matt", dicke: 2, fuellung: 0.12 }, true);
  z.liste("ranb", [z.eck(wB, 0, S, hR)], { farbe: "gold", dicke: 2, fuellung: 0.5 }, true);
  z.liste("rnanb", [z.eck(wB, hR, S, S)], { farbe: "matt", dicke: 2, fuellung: 0.12 }, true);
  z.liste("trenn", [z.seg(0, hL, wB, hL), z.seg(wB, hR, S, hR)], { farbe: "leucht", dicke: 6 }, true);
  z.liste("spaltenB", [z.eck(0, 0, wB, S)], { farbe: "wasser", dicke: 5, fuellung: 0 }, false);
  z.text("tb", "B", wB / 2 - 0.15, -0.65, "creme", true);
  z.text("tnb", ov("B"), wB + (S - wB) / 2 - 0.15, -0.65, "creme", true);
  z.text("tal", "A", -0.65, hL / 2 - 0.15, "hellgold", true);
  z.text("tar", "A", S + 0.2, hR / 2 - 0.15, "hellgold", true);
  const zahlIn = (name, n, x0, y0, x1, y1) => { if (x1 - x0 > 0.9 && y1 - y0 > 0.55) z.text(name, String(n), (x0 + x1) / 2 - 0.12 * String(n).length, (y0 + y1) / 2 - 0.15, "creme", true, true); };
  zahlIn("cab", w[0][0], 0, 0, wB, hL); zahlIn("cnab", w[1][0], 0, hL, wB, S);
  zahlIn("canb", w[0][1], wB, 0, S, hR); zahlIn("cnanb", w[1][1], wB, hR, S, S);
  return [-1.1, S + 1.1, -1.25, S + 0.35];
}

/* Raster gleich wahrscheinlicher Ergebnisse: Zeilen × Spalten, A links (gold), B rechts (blau), A ∩ B umrandet.
   Namen: gitter · hzI hsJ (Köpfe) · la lb lab (Markierungen) · titel */
function rasterZ(z, zeilen, spalten, mark, titel) {
  const Zn = zeilen.length, Sn = spalten.length, x0 = 1.15;
  const lin = [];
  for (let r = 0; r <= Zn; r++) lin.push(z.seg(x0, r, x0 + Sn, r));
  for (let c = 0; c <= Sn; c++) lin.push(z.seg(x0 + c, 0, x0 + c, Zn));
  z.liste("gitter", lin, { farbe: "matt", dicke: 2 }, true);
  zeilen.forEach((t, r) => z.text(`hz${r}`, t, 0.15, Zn - r - 0.68, "hellgold", true, true));
  spalten.forEach((t, c) => z.text(`hs${c}`, t, x0 + c + 0.22, Zn + 0.22, "hellgold", true, true));
  const la = [], lb = [], lab = [];
  for (let r = 0; r < Zn; r++) for (let c = 0; c < Sn; c++) {
    const m = mark(r, c), xa = x0 + c, ya = Zn - r - 1;
    if (m.a) la.push(z.eck(xa + 0.08, ya + 0.08, xa + 0.5, ya + 0.92));
    if (m.b) lb.push(z.eck(xa + 0.5, ya + 0.08, xa + 0.92, ya + 0.92));
    if (m.a && m.b) lab.push(z.eck(xa + 0.03, ya + 0.03, xa + 0.97, ya + 0.97));
  }
  /* Namen ohne Kürzel wie lg/ld: das sind in GeoGebra Funktionen */
  if (la.length) z.liste("rasterA", la, { farbe: "gold", dicke: 1, fuellung: 0.55 }, false);
  if (lb.length) z.liste("rasterB", lb, { farbe: "wasser", dicke: 1, fuellung: 0.55 }, false);
  if (lab.length) z.liste("rasterAB", lab, { farbe: "leucht", dicke: 5, fuellung: 0 }, false);
  if (titel) z.text("titel", titel, 0.15, -0.7, "matt", true, true);
  return [-0.3, x0 + Sn + 0.3, -1.1, Zn + 0.9];
}
/* Ergebnismenge als Kärtchen. Namen: rahmen · oI (Beschriftung) · eMenge (zu E) · gMenge (Gegenereignis) */
const KARTENZEICHEN = { "♣": "\\clubsuit ", "♠": "\\spadesuit ", "♥": "\\heartsuit ", "♦": "\\diamondsuit " };
const karteTex = (l) => String(l).replace(/[♣♠♥♦]/g, (c) => KARTENZEICHEN[c]);
function omegaZ(z, labels, inE) {
  const n = labels.length, sp = n <= 10 ? n : n % 8 === 0 ? 8 : n % 6 === 0 ? 6 : 10, zn = Math.ceil(n / sp), b = 1.25;
  const rahmen = [], le = [], lg = [];
  labels.forEach((l, i) => {
    const c = i % sp, r = Math.floor(i / sp), xa = c * b, ya = (zn - r - 1) * b;
    rahmen.push(z.eck(xa + 0.06, ya + 0.06, xa + b - 0.06, ya + b - 0.06));
    (inE[i] ? le : lg).push(z.eck(xa + 0.12, ya + 0.12, xa + b - 0.12, ya + b - 0.12));
    const t = karteTex(l);
    z.text(`o${i}`, /\\/.test(t) ? t : tx(t), xa + b / 2 - 0.11 * String(l).length - 0.05, ya + b / 2 - 0.17, "creme", true, true);
  });
  z.liste("rahmen", rahmen, { farbe: "matt", dicke: 2, fuellung: 0 }, true);
  z.liste("eMenge", le, { farbe: "gold", dicke: 2, fuellung: 0.45 }, false);
  z.liste("gMenge", lg, { farbe: "wasser", dicke: 2, fuellung: 0.35 }, false);
  return [-0.3, sp * b + 0.3, -0.4, zn * b + 0.4];
}

/* ---------- Gerüst eines Gesprächs ---------- */
function gespraech(a, o) {
  return {
    titel: `${o.titel} – ein Gespräch mit Sokrates`,
    lehrer: "Sokrates", schueler: "{name}",
    aufgabe: o.aufgabe || aufgabeAus(a.html), gegeben: o.gegeben,
    selbst: { fragen: o.selbst },
    vorwissen: o.vorwissen || [], merkzettel: o.merkzettel || [],
    hefteintrag: o.hefteintrag, rueckblick: o.rueckblick,
    geogebra: o.geogebra, werte: [],
    schritte: o.schritte,
  };
}
const MERK = {
  pfad: { begriff: "Pfadregeln", text: "Entlang eines Pfades multiplizieren, verschiedene Pfade zum selben Ergebnis addieren." },
  bedingt: { begriff: "bedingt", text: "$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$: Die Bedingung B steht hinter dem Strich und im Nenner." },
  unab: { begriff: "unabhängig", text: "$P(B \\mid A) = P(B)$, gleichwertig $P(A \\cap B) = P(A) \\cdot P(B)$." },
  tafel: { begriff: "Vierfeldertafel", text: "Innen zusammen ergibt den Rand, in jeder Zeile und jeder Spalte." },
};

const BAU = {};

/* ================= Kapitel 1 ================= */

/* ---------- Wörter: Ergebnis, Ereignis, Gegenereignis ---------- */
BAU["w-woerter"] = (a) => {
  const s = a.sok, n = s.labels.length, E = s.labels.filter((_, i) => s.inE[i]), k = E.length, p = k / n;
  const liste = s.menge ? `E = {${E.join("; ")}}` : `Zu E gehören ${E.join(", ")}`;
  const z = Zeichnung(), sicht = omegaZ(z, s.labels, s.inE);
  const beispiel = E.length > 2 ? `Dazu gehören zum Beispiel ${E[0]} und ${E[1]}.` : `Eines davon ist ${E[0]}.`;
  return gespraech(a, {
    titel: "Ergebnis und Ereignis",
    gegeben: `${n} gleich wahrscheinliche Ergebnisse`,
    vorwissen: ["Ergebnis: ein einzelner Ausgang", "Ereignis: eine Menge von Ergebnissen"],
    merkzettel: [{ begriff: "Gegenereignis", text: "$\\overline{E}$ enthält alle Ergebnisse, die nicht zu E gehören: $P(\\overline{E}) = 1 - P(E)$." }],
    selbst: [frage(feld(a, "k"), "zaehlen", { kurz: "Anzahl der Ergebnisse in E" }), frage(feld(a, "p"), "pe", { kurz: "$P(E)$" }), frage(feld(a, "q"), "pq", { kurz: "$P(\\overline{E})$" })],
    hefteintrag: `Ergebnisse: ${n}, alle gleich wahrscheinlich\n\n${liste}, also ${k} Ergebnisse\n\n$P(E) = ${frGleich(k, n)} \\approx ${dz(p)}$\n\n$P(\\overline{E}) = 1 - ${fr(k, n)} = ${fr(n - k, n)} \\approx ${dz(1 - p)}$`,
    rueckblick: {
      titel: "Zählen statt raten",
      frage: "Wie wahrscheinlich ist ein Ereignis, wenn alle Ergebnisse gleich wahrscheinlich sind?",
      schritte: [
        { kurz: "Überblicken", text: `Der Versuch hat ${n} gleich wahrscheinliche Ergebnisse.` },
        { kurz: "Auswählen", text: `Zu E gehören die ${k} Ergebnisse, für die die Aussage stimmt. E ist eine Menge, kein einzelnes Ergebnis.` },
        { kurz: "Teilen", text: `Die Wahrscheinlichkeit ist der Anteil: $P(E) = ${frRoh(k, n)} \\approx ${dz(p)}$.` },
        { kurz: "Ergänzen", text: `Die übrigen ${n - k} Ergebnisse bilden das Gegenereignis. Seine Wahrscheinlichkeit ist $1 - ${frRoh(k, n)} \\approx ${dz(1 - p)}$.` },
      ],
      einsicht: `Bei gleich wahrscheinlichen Ergebnissen entscheidet das Zählen: $$P(E) = \\frac{\\text{Anzahl der Ergebnisse in E}}{\\text{Anzahl aller Ergebnisse}}$$`,
      mitnehmen: "Ich zähle zuerst alle Ergebnisse und dann die, für die die Aussage stimmt. Gerundet schreibe ich ≈, nicht =.",
    },
    geogebra: z.fertig(sicht),
    schritte: [
      { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Vor dir liegen [[alle ${n} Ergebnisse|rahmen]]. Jedes ist gleich wahrscheinlich.\n\nDas Ereignis E stellt jedem Ergebnis eine Frage: Stimmt die Aussage, ja oder nein?` },
      { id: "zaehlen", typ: "zahl", text: "Geh die Ergebnisse durch. Für wie viele stimmt die Aussage von E?",
        loesung: k, toleranz: GANZ, falsch: "Zähle noch einmal sorgfältig, eines nach dem anderen.",
        fehler: fehlerAus([{ wert: n - k, text: "Das sind die Ergebnisse, bei denen die Aussage nicht stimmt. Gezählt werden die mit „ja“." }], k, GANZ),
        tipps: ["Schreib jedes Ergebnis auf, für das die Aussage stimmt.", beispiel],
        richtig: `${lob()} ${liste}. Das sind ${k} von ${n} Ergebnissen.`, zeigeNachRichtig: ["eMenge"] },
      { id: "begriff", typ: "wahl", text: "Ist E damit ein Ergebnis oder etwas anderes?",
        optionen: [
          { text: "Ein Ereignis: eine Menge von Ergebnissen", richtig: true },
          { text: "Ein Ergebnis, denn E ist ein Ausgang des Versuchs", hinweis: k > 1 ? `Ein Ergebnis ist ein einzelner Ausgang, etwa ${s.labels[0]}. E fasst ${k} Ausgänge zusammen.` : `E ist die Menge {${E[0]}}. Sie enthält ein Ergebnis, ist aber selbst eine Menge.` },
          { text: "Die Ergebnismenge Ω", hinweis: `Ω enthält alle ${n} Ergebnisse, E nur einen Teil davon.` },
        ],
        tipps: ["Wie viele Ausgänge stecken in E?"], richtig: "So ist es. Ein Ereignis ist eine Menge, darum schreibt man es in geschweiften Klammern." },
      { id: "pe", typ: "zahl", text: "Wie groß ist dann $P(E)$? Gib einen Bruch an oder runde auf drei Nachkommastellen.",
        loesung: p, toleranz: T3, falsch: "Teile die Anzahl in E durch die Anzahl aller Ergebnisse.",
        fehler: fehlerAus([{ wert: 1 - p, text: "Das ist die Wahrscheinlichkeit der übrigen Ergebnisse. Gefragt ist P(E)." }, { wert: k, text: "Das ist eine Anzahl. Eine Wahrscheinlichkeit liegt zwischen 0 und 1." }, { wert: n / k, text: "Zähler und Nenner sind vertauscht." }], p, T3),
        tipps: [`Es gibt ${n} Ergebnisse, ${k} davon gehören zu E.`, `$P(E) = ${frRoh(k, n)}$`],
        richtig: `${lob()} $P(E) = ${frGleich(k, n)} \\approx ${dz(p)}$. Weil gerundet ist, steht dort $\\approx$.` },
      { id: "gegen", typ: "wahl", text: "Nun das Gegenereignis $\\overline{E}$. Welche Ergebnisse gehören dazu?",
        optionen: [
          { text: `Alle ${n - k} Ergebnisse, die nicht zu E gehören`, richtig: true },
          { text: "Ein einziges Ergebnis, das nicht zu E gehört", hinweis: "$\\overline{E}$ tritt ein, sobald E nicht eintritt. Wie viele Ergebnisse führen dahin?" },
          { text: "Keines, denn E soll ja eintreten", hinweis: "Ob E eintritt, weiß man vorher nicht. $\\overline{E}$ fasst die Fälle zusammen, in denen es nicht eintritt." },
        ],
        tipps: ["Jedes Ergebnis gehört entweder zu E oder zu $\\overline{E}$."], richtig: `Genau. Das sind die [[übrigen Ergebnisse|gMenge]].`, zeigeNachRichtig: ["gMenge"] },
      { id: "pq", typ: "zahl", text: "Wie groß ist $P(\\overline{E})$? Bruch oder drei Nachkommastellen.",
        loesung: 1 - p, toleranz: T3, falsch: "Es gilt $P(\\overline{E}) = 1 - P(E)$.",
        fehler: fehlerAus([{ wert: p, text: "Das ist P(E). Gefragt ist das Gegenereignis." }], 1 - p, T3),
        tipps: [`$\\overline{E}$ hat ${n - k} Ergebnisse.`, `$1 - ${frRoh(k, n)}$`],
        richtig: `${lob()} $P(\\overline{E}) = 1 - ${fr(k, n)} = ${fr(n - k, n)} \\approx ${dz(1 - p)}$.` },
      { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: erst zählen, dann teilen. $$P(E) = \\frac{\\text{Anzahl in } E}{\\text{Anzahl aller}}, \\qquad P(\\overline{E}) = 1 - P(E)$$ Schreibe dir den Hefteintrag ab." },
    ],
  });
};

/* ---------- Baum und Pfadregeln ---------- */
BAU["w-baum"] = (a) => (a.sok.v === "ohne" ? baumOhne(a) : a.sok.v === "frei" ? baumFrei(a) : baumUrne(a));

function baumUrne(a) {
  const { geraet, kz6, m, f1, f2, r1, b1, r2, b2, welche } = a.sok;
  const nA = r1 + b1, nB = r2 + b2, pA = kz6 / m, pf1A = r1 / nA, pf1B = r2 / nB, pAr = pA * pf1A, pBr = (1 - pA) * pf1B, pr = pAr + pBr;
  const gesamtZ = kz6 * r1 * nB + (m - kz6) * r2 * nA, gesamtN = m * nA * nB;
  const F1 = tx(f1), F2 = tx(f2);
  const erst = { wuerfel: "erst der Würfel", rad: "erst das Glücksrad", muenze: "erst die Münze" }[geraet];
  const ende = [fr(kz6 * r1, m * nA), fr(kz6 * b1, m * nA), fr((m - kz6) * r2, m * nB), fr((m - kz6) * b2, m * nB)];
  const z = Zeichnung();
  const sicht = baumZ(z, { s1: ["A", "B"], s2: [[F1, F2], [F1, F2]], p1: [fr(kz6, m), fr(m - kz6, m)], p2: [[fr(r1, nA), fr(b1, nA)], [fr(r2, nB), fr(b2, nB)]], enden: ende });
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Hier geschehen zwei Zufallsschritte nacheinander: ${erst}, dann die Kugel.\n\nDarum zeichnen wir einen [[Baum mit zwei Stufen|a1,a2,a11,a12,a21,a22]].` },
    { id: "pa", typ: "zahl", text: `Die [[erste Stufe|a1,a2]] wählt nur die Urne. Wie groß ist $P(A)$?`,
      loesung: pA, toleranz: T3, falsch: "Zähle die gleich wahrscheinlichen Ausgänge der ersten Stufe, die zu Urne A führen.",
      fehler: fehlerAus([{ wert: pf1A, text: `Das ist schon die zweite Stufe, die Farbe in Urne A. Die erste Stufe fragt nur: Wie oft wird Urne A gewählt?` }, { wert: kz6, text: "Das ist eine Anzahl. Teile durch alle Ausgänge." }], pA, T3),
      tipps: [geraet === "muenze" ? "Wappen und Zahl sind gleich wahrscheinlich." : `Von ${m} gleich wahrscheinlichen Zahlen führen ${kz6} zu Urne A.`, `$P(A) = ${frRoh(kz6, m)}$`],
      richtig: `${lob()} $P(A) = ${fr(kz6, m)}$, also $P(B) = ${fr(m - kz6, m)}$.`, zeigeNachRichtig: ["q1", "q2"] },
    { id: "ast", typ: "wahl", text: `Was steht an den [[Ästen hinter A|a11,a12]]?`,
      optionen: [
        { text: `Die Anteile in Urne A: $${fr(r1, nA)}$ ${f1}, $${fr(b1, nA)}$ ${f2}`, richtig: true },
        { text: `Die Anteile in beiden Urnen zusammen: $${fr(r1 + r2, nA + nB)}$ ${f1}`, hinweis: "Hinter A wird nur aus Urne A gezogen. Urne B spielt auf diesem Ast keine Rolle." },
        { text: `Schon mit $P(A)$ multipliziert: $${fr(kz6 * r1, m * nA)}$ ${f1}`, hinweis: "Das wäre ein ganzer Pfad. Am Ast steht nur, was in dieser Stufe geschieht." },
      ],
      tipps: ["Steht man am Knoten A, ist die Urne schon gewählt. Was geschieht jetzt noch?"],
      richtig: `Genau. Hinter B stehen ebenso die Anteile in Urne B: $${fr(r2, nB)}$ und $${fr(b2, nB)}$.`, zeigeNachRichtig: ["q11", "q12", "q21", "q22"] },
    { id: "pfad", typ: "zahl", text: `Folge dem [[Pfad über A zu ${f1}|a1,a11]]. Wie groß ist $P(A \\cap ${F1})$? Bruch oder drei Nachkommastellen.`,
      loesung: pAr, toleranz: T3, falsch: "Entlang eines Pfades wird multipliziert.",
      fehler: fehlerAus([{ wert: pf1A, text: `Das ist nur die zweite Stufe. Erst muss Urne A gewählt werden: noch mal P(A).` }, { wert: pA + pf1A, text: "Entlang eines Pfades wird multipliziert, nicht addiert." }], pAr, T3),
      tipps: [`Erst muss A kommen, dann ${f1}. Beides muss geschehen.`, `$${fr(kz6, m)} \\cdot ${fr(r1, nA)}$`],
      richtig: `${lob()} $${fr(kz6, m)} \\cdot ${fr(r1, nA)} = ${ende[0]} \\approx ${dz(pAr)}$.`, zeigeNachRichtig: ["e11"] },
  ];
  if (welche !== 0) schritte.push(
    { id: "wege", typ: "wahl", text: `Auf wie vielen Pfaden kommt man zu einer ${f1}en Kugel?`,
      optionen: [
        { text: "Auf zwei: über A und über B", richtig: true },
        { text: "Auf einem, über A", hinweis: `Auch Urne B enthält ${r2} ${f1}e ${r2 === 1 ? "Kugel" : "Kugeln"}.` },
        { text: "Auf allen vier Pfaden", hinweis: `Zwei der vier Pfade enden bei ${f2}.` },
      ],
      tipps: [`Schau auf die [[Enden der Pfade|n11,n12,n21,n22]]. Wo steht ${f1}?`],
      richtig: `So ist es: [[über A|a1,a11]] und [[über B|a2,a21]]. Beide Pfade werden addiert.`, zeigeNachRichtig: ["e21"] },
    { id: "gesamt", typ: "zahl", text: `Wie groß ist $P(${F1})$? Bruch oder drei Nachkommastellen.`,
      loesung: pr, toleranz: T3, falsch: "Addiere die beiden Pfade, die bei " + f1 + " enden.",
      fehler: fehlerAus([
        { wert: pAr, text: `Das ist nur der Pfad über A. ${gross(f1)} kann auch aus Urne B kommen.` },
        { wert: pBr, text: "Das ist nur der Pfad über B. Der Pfad über A fehlt." },
        { wert: (r1 + r2) / (nA + nB), text: "Du hast die Kugeln beider Urnen zusammengeworfen. Die Urnen werden aber verschieden oft gewählt." },
        { wert: (pf1A + pf1B) / 2, text: "Du hast den Mittelwert genommen. Die Urnen werden nicht gleich oft gewählt: Gewichte mit P(A) und P(B)." },
      ], pr, T3),
      tipps: [`Der Pfad über B: $${fr(m - kz6, m)} \\cdot ${fr(r2, nB)} = ${ende[2]}$.`, `$${ende[0]} + ${ende[2]}$`],
      richtig: `${lob()} $P(${F1}) = ${ende[0]} + ${ende[2]} = ${fr(gesamtZ, gesamtN)} \\approx ${dz(pr)}$.` });
  schritte.push(
    { id: "probe", typ: "wahl", text: "Zur Probe: Was ergeben alle vier Pfadenden zusammen?",
      optionen: [
        { text: "Genau 1", richtig: true },
        { text: "2, für jede Urne 1", hinweis: "Jede Urne wird nur in einem Teil der Fälle gewählt. Die vier Pfade zusammen sind alle Fälle." },
        { text: "Das hängt von den Kugeln ab", hinweis: "Die vier Pfade decken alle Möglichkeiten ab. Wie wahrscheinlich ist es, dass irgendetwas geschieht?" },
      ],
      tipps: ["Jeder Durchgang endet auf genau einem der vier Pfade."],
      richtig: `So ist es: $${ende.join(" + ")} = 1$. Kommt nicht 1 heraus, steckt ein Fehler im Baum.`, zeigeNachRichtig: ["e12", "e21", "e22"] },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Entlang eines [[Pfades|a1,a11]] wird multipliziert. Führen mehrere Pfade zum selben Ergebnis, werden sie addiert. Schreibe dir den Hefteintrag ab." });
  const selbst = [];
  if (feld(a, "pfad")) selbst.push(frage(feld(a, "pfad"), "pfad"));
  if (feld(a, "ges")) selbst.push(frage(feld(a, "ges"), "wege"));
  return gespraech(a, {
    titel: "Baum und Pfadregeln",
    gegeben: `Urne A: ${r1} ${f1}, ${b1} ${f2}; Urne B: ${r2} ${f1}, ${b2} ${f2}; $P(A) = ${fr(kz6, m)}$`,
    vorwissen: ["Baumdiagramm mit zwei Stufen", "Bruchrechnen"], merkzettel: [MERK.pfad],
    selbst,
    hefteintrag: `Baum: 1. Stufe Urne, 2. Stufe Farbe\n\n$P(A \\cap ${F1}) = ${fr(kz6, m)} \\cdot ${fr(r1, nA)} = ${ende[0]} \\approx ${dz(pAr)}$\n\n$P(${F1}) = ${fr(kz6, m)} \\cdot ${fr(r1, nA)} + ${fr(m - kz6, m)} \\cdot ${fr(r2, nB)} = ${fr(gesamtZ, gesamtN)} \\approx ${dz(pr)}$`,
    rueckblick: {
      titel: "Zwei Stufen, zwei Regeln",
      frage: `Wie wahrscheinlich ist eine ${f1}e Kugel, wenn vorher die Urne ausgelost wird?`,
      schritte: [
        { kurz: "Ordnen", text: "Zwei Zufallsschritte nacheinander: erst die Urne, dann die Kugel. Jeder Schritt bekommt eine Stufe im Baum." },
        { kurz: "Die erste Stufe", text: `Urne A wird mit $${frRoh(kz6, m)}$ gewählt. Diese Stufe gehört in den Baum, auch wenn sie nur die Urne bestimmt.` },
        { kurz: "Am Ast", text: `Hinter A steht nur, was in Urne A geschieht: ${f1} mit $${frRoh(r1, nA)}$.` },
        { kurz: "Multiplizieren", text: `Ein Pfad verlangt beide Schritte: $${frRoh(kz6, m)} \\cdot ${frRoh(r1, nA)} \\approx ${dz(pAr)}$.` },
        { kurz: "Addieren", text: `${gross(f1)} gibt es auf zwei Pfaden. Zusammen: $P(\\text{${f1}}) \\approx ${dz(pr)}$.` },
      ],
      einsicht: `Entlang eines Pfades wird multipliziert, verschiedene Pfade zum selben Ziel werden addiert: $$P(\\text{${f1}}) = P(A) \\cdot P_A(\\text{${f1}}) + P(B) \\cdot P_B(\\text{${f1}})$$`,
      mitnehmen: "Ich zeichne jeden Zufallsschritt als eigene Stufe und prüfe am Ende, ob alle Pfadenden zusammen 1 ergeben.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
}

function baumOhne(a) {
  const { f1, f2, r, b, welche } = a.sok, n = r + b, N2 = n * (n - 1);
  const beide = (r * (r - 1)) / N2, genau = (2 * r * b) / N2, F1 = tx(f1), F2 = tx(f2);
  const z = Zeichnung();
  const ende = [fr(r * (r - 1), N2), fr(r * b, N2), fr(b * r, N2), fr(b * (b - 1), N2)];
  const sicht = baumZ(z, { s1: [F1, F2], s2: [[F1, F2], [F1, F2]], p1: [fr(r, n), fr(b, n)], p2: [[fr(r - 1, n - 1), fr(b, n - 1)], [fr(r, n - 1), fr(b - 1, n - 1)]], enden: ende });
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. In der Urne liegen ${r} ${f1}e und ${b} ${f2}e Kugeln. Zwei werden gezogen, die erste kommt nicht zurück.\n\nJeder Zug bekommt eine [[Stufe im Baum|a1,a2,a11,a12,a21,a22]].` },
    { id: "erste", typ: "zahl", text: `Wie groß ist die Wahrscheinlichkeit, dass die [[erste Kugel|a1]] ${f1} ist?`,
      loesung: r / n, toleranz: T3, falsch: `Wie viele Kugeln liegen anfangs in der Urne, wie viele davon sind ${f1}?`,
      fehler: fehlerAus([{ wert: r / b, text: `Du hast ${f1} durch ${f2} geteilt. Geteilt wird durch alle Kugeln.` }], r / n, T3),
      tipps: [`Anfangs liegen ${n} Kugeln in der Urne.`, `$${frRoh(r, n)}$`],
      richtig: `${lob()} $${fr(r, n)}$ für ${f1}, $${fr(b, n)}$ für ${f2}.`, zeigeNachRichtig: ["q1", "q2"] },
    { id: "zweite", typ: "wahl", text: `Die erste Kugel war ${f1}. Wie sieht die Urne vor dem [[zweiten Zug|a11,a12]] aus?`,
      optionen: [
        { text: `${n - 1} Kugeln, davon ${r - 1} ${f1}`, richtig: true },
        { text: `${n} Kugeln, davon ${r} ${f1}`, hinweis: "So wäre es mit Zurücklegen. Hier fehlt die erste Kugel." },
        { text: `${n - 1} Kugeln, davon ${r} ${f1}`, hinweis: `Die gezogene Kugel war ${f1}. Sie fehlt jetzt bei den ${f1}en.` },
      ],
      tipps: ["Welche Kugel fehlt nach dem ersten Zug?"],
      richtig: `Recht so. Also $${fr(r - 1, n - 1)}$ für ${f1}. Nach einer ${f2}en Kugel sind es $${fr(r, n - 1)}$.`, zeigeNachRichtig: ["q11", "q12", "q21", "q22"] },
  ];
  if (welche !== 1) schritte.push(
    { id: "beide", typ: "zahl", text: `Wie groß ist $P(\\text{beide ${f1}})$? Folge dem [[Pfad|a1,a11]]. Bruch oder drei Nachkommastellen.`,
      loesung: beide, toleranz: T3, falsch: "Entlang des Pfades wird multipliziert.",
      fehler: fehlerAus([{ wert: (r / n) ** 2, text: "So wäre es mit Zurücklegen. Am zweiten Ast steht der Anteil in der kleineren Urne." }, { wert: r / n + (r - 1) / (n - 1), text: "Entlang eines Pfades wird multipliziert, nicht addiert." }], beide, T3),
      tipps: ["Zwei Äste hintereinander: erst $" + fr(r, n) + "$, dann $" + fr(r - 1, n - 1) + "$."],
      richtig: `${lob()} $${fr(r, n)} \\cdot ${fr(r - 1, n - 1)} = ${ende[0]} \\approx ${dz(beide)}$.`, zeigeNachRichtig: ["e11"] });
  if (welche !== 0) schritte.push(
    { id: "wege", typ: "wahl", text: `Auf welchen Pfaden liegt genau eine ${f1}e Kugel?`,
      optionen: [
        { text: `${gross(f1)}, dann ${f2} und ${f2}, dann ${f1}`, richtig: true },
        { text: `Nur ${f1}, dann ${f2}`, hinweis: "Die Reihenfolge ist nicht vorgeschrieben. Kann die eine Kugel auch beim zweiten Zug kommen?" },
        { text: `${gross(f1)}, dann ${f1} und ${f2}, dann ${f2}`, hinweis: `Auf diesen Pfaden liegen zwei oder keine ${f1}en Kugeln.` },
      ],
      tipps: ["Lies an jedem [[Pfadende|n11,n12,n21,n22]] ab, wie viele Kugeln " + f1 + " sind."],
      richtig: `Genau: [[der eine Pfad|a1,a12]] und [[der andere|a2,a21]].`, zeigeNachRichtig: ["e12", "e21"] },
    { id: "genau", typ: "zahl", text: `Wie groß ist $P(\\text{genau eine ${f1}})$? Bruch oder drei Nachkommastellen.`,
      loesung: genau, toleranz: T3, falsch: "Multipliziere auf jedem Pfad, dann addiere die beiden Pfade.",
      fehler: fehlerAus([{ wert: genau / 2, text: "Das ist nur ein Pfad. Der andere Weg gehört auch dazu." }, { wert: 2 * (r / n) * (b / n), text: "So wäre es mit Zurücklegen. Nach dem ersten Zug liegt eine Kugel weniger in der Urne." }], genau, T3),
      tipps: [`Pfad 1: $${fr(r, n)} \\cdot ${fr(b, n - 1)}$. Pfad 2: $${fr(b, n)} \\cdot ${fr(r, n - 1)}$.`],
      richtig: `${lob()} $${ende[1]} + ${ende[2]} = ${fr(2 * r * b, N2)} \\approx ${dz(genau)}$. Beide Pfade sind gleich groß, nur die Reihenfolge ist anders.` });
  schritte.push(
    { id: "probe", typ: "wahl", text: "Warum steht in der zweiten Stufe ein anderer Nenner als in der ersten?",
      optionen: [
        { text: `Weil nur noch ${n - 1} Kugeln in der Urne liegen`, richtig: true },
        { text: "Weil der Baum es so verlangt", hinweis: "Der Baum bildet nur ab, was in der Urne geschieht. Was hat sich dort geändert?" },
        { text: "Weil der zweite Zug schwerer ist", hinweis: "Schwer oder leicht gibt es beim Zufall nicht. Zähle die Kugeln vor dem zweiten Zug." },
      ],
      tipps: ["Wie viele Kugeln liegen vor dem zweiten Zug in der Urne?"],
      richtig: "So ist es. Ohne Zurücklegen ändert der erste Zug die Urne für den zweiten." },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Ohne Zurücklegen hängt die zweite Stufe vom ersten Zug ab. Entlang eines Pfades wird multipliziert, mehrere Pfade werden addiert. Schreibe dir den Hefteintrag ab." });
  const selbst = [];
  if (feld(a, "beide")) selbst.push(frage(feld(a, "beide"), "beide"));
  if (feld(a, "genau")) selbst.push(frage(feld(a, "genau"), "wege"));
  return gespraech(a, {
    titel: "Ziehen ohne Zurücklegen",
    gegeben: `${r} ${f1}, ${b} ${f2}; zwei Kugeln ohne Zurücklegen`,
    vorwissen: ["Baumdiagramm mit zwei Stufen", "Pfadregeln"], merkzettel: [MERK.pfad],
    selbst,
    hefteintrag: `Urne: ${r} ${f1}, ${b} ${f2}; zwei Züge ohne Zurücklegen\n\n$P(\\text{beide ${f1}}) = ${fr(r, n)} \\cdot ${fr(r - 1, n - 1)} = ${ende[0]} \\approx ${dz(beide)}$\n\n$P(\\text{genau eine ${f1}}) = ${fr(r, n)} \\cdot ${fr(b, n - 1)} + ${fr(b, n)} \\cdot ${fr(r, n - 1)} = ${fr(2 * r * b, N2)} \\approx ${dz(genau)}$`,
    rueckblick: {
      titel: "Die Urne merkt sich den ersten Zug",
      frage: "Wie rechnet man, wenn die erste Kugel nicht zurückgelegt wird?",
      schritte: [
        { kurz: "Erste Stufe", text: `Anfangs liegen ${n} Kugeln in der Urne, ${r} davon ${f1}: $${frRoh(r, n)}$.` },
        { kurz: "Die Stolperstelle", text: `Vor dem zweiten Zug fehlt eine Kugel. Nach ${f1} sind es $${frRoh(r - 1, n - 1)}$ statt $${frRoh(r, n)}$.` },
        { kurz: "Ein Pfad", text: `Beide ${f1}: $${frRoh(r, n)} \\cdot ${frRoh(r - 1, n - 1)} \\approx ${dz(beide)}$.` },
        { kurz: "Zwei Pfade", text: `Genau eine ${f1}e Kugel gibt es in zwei Reihenfolgen. Zusammen $\\approx ${dz(genau)}$.` },
      ],
      einsicht: `Ohne Zurücklegen verkleinert der erste Zug die Urne: $$P(\\text{beide}) = \\frac{${r}}{${n}} \\cdot \\frac{${r - 1}}{${n - 1}}$$`,
      mitnehmen: "Vor jedem Ast frage ich: Was liegt jetzt noch in der Urne?",
    },
    geogebra: z.fertig(sicht), schritte,
  });
}

function baumFrei(a) {
  const { p, q1, q2, paare } = a.sok;
  const zwei = p * q1, genau = p * (1 - q1) + (1 - p) * q2, mind = 1 - (1 - p) * (1 - q2);
  const z = Zeichnung();
  const ende = [dz(zwei, 4), dz(p * (1 - q1), 4), dz((1 - p) * q2, 4), dz((1 - p) * (1 - q2), 4)];
  const sicht = baumZ(z, { s1: ["T", "D"], s2: [["T", "D"], ["T", "D"]], p1: [dz(p, 2), dz(1 - p, 2)], p2: [[dz(q1, 2), dz(1 - q1, 2)], [dz(q2, 2), dz(1 - q2, 2)]], enden: ende }, { p1: true });
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Zwei Freiwürfe, also zwei Stufen. T heißt Treffer, D daneben.\n\nDen [[ersten Wurf|a1,a2]] trifft sie mit $${dz(p, 2)}$.` },
    { id: "quote", typ: "wahl", text: "Warum stehen in der [[zweiten Stufe|a11,a12,a21,a22]] zwei verschiedene Trefferquoten?",
      optionen: [
        { text: "Die Quote hängt davon ab, wie der erste Wurf ausging", richtig: true },
        { text: "Weil sie beim zweiten Wurf müde ist", hinweis: "Davon steht nichts in der Aufgabe. Sie nennt eine Quote nach einem Treffer und eine nach einem Fehlwurf." },
        { text: "Das ist ein Versehen, beide Äste bekommen dieselbe Quote", hinweis: "Lies noch einmal: Nach einem Treffer ist sie sicherer, nach einem Fehlwurf unsicherer." },
      ],
      tipps: ["Was sagt die Aufgabe über den zweiten Wurf nach einem Treffer?"],
      richtig: `So ist es. Nach T trifft sie mit $${dz(q1, 2)}$, nach D nur mit $${dz(q2, 2)}$.`, zeigeNachRichtig: ["q11", "q12", "q21", "q22"] },
  ];
  const sel = [];
  if (paare.includes("zwei")) {
    schritte.push({ id: "zwei", typ: "zahl", text: "Wie groß ist $P(\\text{zwei Treffer})$? Folge dem [[Pfad|a1,a11]]. Runde auf drei Nachkommastellen.",
      loesung: zwei, toleranz: T3, falsch: "Entlang des Pfades wird multipliziert.",
      fehler: fehlerAus([{ wert: p * p, text: "Du hast zweimal die erste Quote genommen. Nach einem Treffer gilt eine andere." }, { wert: p + q1, text: "Entlang eines Pfades wird multipliziert, nicht addiert." }], zwei, T3),
      tipps: [`$${dz(p, 2)} \\cdot ${dz(q1, 2)}$`], richtig: `${lob()} $${dz(p, 2)} \\cdot ${dz(q1, 2)} = ${ende[0]}$.`, zeigeNachRichtig: ["e11"] });
    sel.push(frage(feld(a, "zwei"), "zwei"));
  }
  if (paare.includes("genau")) {
    schritte.push({ id: "wege", typ: "wahl", text: "Auf welchen Pfaden fällt genau ein Treffer?",
      optionen: [
        { text: "T, dann D und D, dann T", richtig: true },
        { text: "Nur T, dann D", hinweis: "Der Treffer darf auch beim zweiten Wurf kommen." },
        { text: "T, dann T und D, dann D", hinweis: "Das sind zwei Treffer und kein Treffer." },
      ],
      tipps: ["Zähle an jedem [[Pfadende|n11,n12,n21,n22]] die T."], richtig: "Genau: [[T, dann D|a1,a12]] und [[D, dann T|a2,a21]].", zeigeNachRichtig: ["e12", "e21"] },
    { id: "genau", typ: "zahl", text: "Wie groß ist $P(\\text{genau ein Treffer})$? Runde auf drei Nachkommastellen.",
      loesung: genau, toleranz: T3, falsch: "Multipliziere auf beiden Pfaden und addiere.",
      fehler: fehlerAus([{ wert: p * (1 - q1), text: "Das ist nur der Pfad „T, dann D“. Der Pfad „D, dann T“ fehlt." }, { wert: (1 - p) * q2, text: "Das ist nur der Pfad „D, dann T“. Der andere Pfad fehlt." }], genau, T3),
      tipps: [`$${dz(p, 2)} \\cdot ${dz(1 - q1, 2)} + ${dz(1 - p, 2)} \\cdot ${dz(q2, 2)}$`], richtig: `${lob()} $${ende[1]} + ${ende[2]} \\approx ${dz(genau)}$.` });
    sel.push(frage(feld(a, "genau"), "wege"));
  }
  if (paare.includes("mind")) {
    schritte.push({ id: "gegen", typ: "wahl", text: "„Mindestens ein Treffer“ hat drei Pfade. Was ist das Gegenereignis?",
      optionen: [
        { text: "Kein Treffer: D, dann D", richtig: true },
        { text: "Zwei Treffer", hinweis: "Zwei Treffer gehören zu „mindestens einer“ dazu." },
        { text: "Genau ein Treffer", hinweis: "Auch das ist „mindestens einer“. Welcher Pfad bleibt übrig?" },
      ],
      tipps: ["Welcher Pfad hat gar kein T?"], richtig: "Recht so. Nur der [[Pfad D, D|a2,a22]] gehört nicht dazu.", zeigeNachRichtig: ["e22"] },
    { id: "mind", typ: "zahl", text: "Wie groß ist $P(\\text{mindestens ein Treffer})$? Runde auf drei Nachkommastellen.",
      loesung: mind, toleranz: T3, falsch: "Rechne 1 minus den Pfad „D, dann D“.",
      fehler: fehlerAus([{ wert: 1 - zwei, text: "Das ist 1 − P(zwei Treffer), also „nicht beide“. Das Gegenereignis ist „kein Treffer“." }, { wert: genau, text: "Das ist „genau ein Treffer“. Auch zwei Treffer zählen mit." }, { wert: (1 - p) * (1 - q2), text: "Das ist der Pfad „kein Treffer“ selbst. Gesucht ist sein Gegenteil." }], mind, T3),
      tipps: [`$1 - ${dz(1 - p, 2)} \\cdot ${dz(1 - q2, 2)}$`], richtig: `${lob()} $1 - ${ende[3]} \\approx ${dz(mind)}$. Über das Gegenereignis braucht man nur einen Pfad.` });
    sel.push(frage(feld(a, "mind"), "gegen"));
  }
  schritte.push({ id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Hängt die zweite Stufe vom ersten Ausgang ab, stehen an den Ästen verschiedene Werte. Die Pfadregeln gelten trotzdem. Schreibe dir den Hefteintrag ab." });
  return gespraech(a, {
    titel: "Zwei Freiwürfe",
    gegeben: `1. Wurf: ${pzT(p, 0)}; nach Treffer ${pzT(q1, 0)}, nach Fehlwurf ${pzT(q2, 0)}`,
    vorwissen: ["Pfadregeln", "Gegenereignis: $P(\\overline{E}) = 1 - P(E)$"], merkzettel: [MERK.pfad],
    selbst: sel,
    hefteintrag: `Baum: 1. Wurf T/D, 2. Wurf T/D mit eigener Quote\n\n$P(TT) = ${dz(p, 2)} \\cdot ${dz(q1, 2)} \\approx ${dz(zwei)}$\n\n$P(\\text{genau ein T}) = ${dz(p, 2)} \\cdot ${dz(1 - q1, 2)} + ${dz(1 - p, 2)} \\cdot ${dz(q2, 2)} \\approx ${dz(genau)}$\n\n$P(\\text{mindestens ein T}) = 1 - ${dz(1 - p, 2)} \\cdot ${dz(1 - q2, 2)} \\approx ${dz(mind)}$`,
    rueckblick: {
      titel: "Der zweite Wurf erinnert sich",
      frage: "Wie rechnet man, wenn die Trefferquote vom ersten Wurf abhängt?",
      schritte: [
        { kurz: "Stufen", text: "Jeder Wurf ist eine Stufe. Die zweite Stufe hat je nach erstem Wurf eine eigene Quote." },
        { kurz: "Multiplizieren", text: `Zwei Treffer: $${dz(p, 2)} \\cdot ${dz(q1, 2)} \\approx ${dz(zwei)}$.` },
        { kurz: "Addieren", text: `Genau ein Treffer kommt auf zwei Pfaden zustande: zusammen $\\approx ${dz(genau)}$.` },
        { kurz: "Gegenereignis", text: `Mindestens ein Treffer ist alles außer „kein Treffer“: $1 - ${dz(1 - p, 2)} \\cdot ${dz(1 - q2, 2)} \\approx ${dz(mind)}$.` },
      ],
      einsicht: "Die Pfadregeln gelten auch, wenn die Äste verschiedene Werte tragen: $$P(\\text{mindestens einer}) = 1 - P(\\text{keiner})$$",
      mitnehmen: "Bei „mindestens“ prüfe ich zuerst, ob das Gegenereignis weniger Pfade hat.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
}

/* ---------- Vierfeldertafel ausfüllen ---------- */
BAU["w-tafel"] = (a) => {
  const { w, k, N, geg } = a.sok;
  const bekannt = new Set(geg), zt = w.map((zz) => zz.map(String));
  const z = Zeichnung();
  const sicht = tafelZ(z, { kopf: ["B", ov("B")], seite: ["A", ov("A")], w: zt, an: bekannt, legende: legende(k) });
  const NAME = [["A und B", `A und $\\overline{B}$`, "A"], [`$\\overline{A}$ und B`, `$\\overline{A}$ und $\\overline{B}$`, "$\\overline{A}$"], ["B", "$\\overline{B}$", "alle"]];
  const ZN = ["der [[Zeile A|f00,f01,f02]]", "der [[Zeile $\\overline{A}$|f10,f11,f12]]", "der [[Summenzeile|f20,f21,f22]]"];
  const SN = ["der [[Spalte B|f00,f10,f20]]", "der [[Spalte $\\overline{B}$|f01,f11,f21]]", "der [[Summenspalte|f02,f12,f22]]"];
  /* Reihenfolge: immer eine Zeile oder Spalte mit zwei bekannten Einträgen */
  const kenn = new Set(bekannt), weg = [];
  while (kenn.size < 9) {
    let ok = false;
    for (let r = 0; r < 3 && !ok; r++) {
      const fehlt = [0, 1, 2].filter((c) => !kenn.has(r + "," + c));
      if (fehlt.length === 1) { weg.push({ r, c: fehlt[0], linie: "zeile", i: r }); kenn.add(r + "," + fehlt[0]); ok = true; }
    }
    for (let c = 0; c < 3 && !ok; c++) {
      const fehlt = [0, 1, 2].filter((r) => !kenn.has(r + "," + c));
      if (fehlt.length === 1) { weg.push({ r: fehlt[0], c, linie: "spalte", i: c }); kenn.add(fehlt[0] + "," + c); ok = true; }
    }
    if (!ok) break;
  }
  const innen = geg.find((x) => x[0] !== "2" && x[2] !== "2") || "0,0";
  const [ir, ic] = innen.split(",").map(Number);
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. ${N} ${k.wer}, zwei Merkmale. Die [[Vierfeldertafel|gitter]] ordnet sie: Zeilen nach A, Spalten nach B.\n\nInnen stehen die Kombinationen, am [[Rand|f02,f12,f20,f21,f22]] die Summen.` },
    { id: "ort", typ: "wahl", text: `Die Angabe ${w[ir][ic]} zählt „${NAME[ir][ic]}“. Wohin gehört sie?`,
      optionen: [
        { text: "In ein Innenfeld, denn sie zählt eine Kombination", richtig: true },
        { text: "An den Rand, denn dort stehen die Angaben", hinweis: "Am Rand stehen Summen: alle mit A, egal ob B. Zählt die Zahl nur ein Merkmal oder beide zugleich?" },
        { text: "Rechts unten, zur Gesamtzahl", hinweis: `Rechts unten stehen alle ${N}.` },
      ],
      tipps: ["Gilt die Zahl für ein Merkmal oder für zwei zugleich?"],
      richtig: `${lob()} Sie steht im [[Innenfeld|f${ir}${ic}]], wo sich Zeile und Spalte kreuzen.`, zeigeNachRichtig: [`f${ir}${ic}`] },
  ];
  let vorher = `f${ir}${ic}`;
  weg.forEach((s, i) => {
    const { r, c } = s, key = `${r}${c}`, wert = w[r][c], weg0 = vorher;
    vorher = `f${key}`;
    const andere = s.linie === "zeile" ? [0, 1, 2].filter((j) => j !== c).map((j) => w[r][j]) : [0, 1, 2].filter((j) => j !== r).map((j) => w[j][c]);
    const istSumme = s.linie === "zeile" ? c === 2 : r === 2;
    const plus = istSumme ? `${andere[0]} + ${andere[1]}` : `${Math.max(...andere)} - ${Math.min(...andere)}`;
    const fehl = istSumme ? [] : [{ wert: andere[0] + andere[1], text: "Du hast addiert. Hier ist die Summe schon bekannt: Ziehe ab." }];
    schritte.push({ id: `f${key}`, typ: "zahl",
      text: `${i === 0 ? "Nun füllen wir auf. " : ""}In ${s.linie === "zeile" ? ZN[r] : SN[c]} fehlt nur noch [[ein Feld|f${key}]]. Was steht dort?`,
      loesung: wert, toleranz: GANZ, falsch: "Innen zusammen ergibt den Rand.",
      fehler: fehlerAus(fehl, wert, GANZ),
      tipps: [istSumme ? "Gesucht ist die Summe der beiden anderen." : "Die Summe steht schon da. Was fehlt noch bis dahin?", `$${plus}$`],
      richtig: `${lob()} $${plus} = ${wert}$.`, zeige: [`f${key}`], verberge: [weg0], zeigeNachRichtig: [`z${key}`] });
  });
  const letzte = weg.length ? `f${weg[weg.length - 1].r}${weg[weg.length - 1].c}` : null;
  schritte.push(
    { id: "probe", typ: "wahl", text: "Woran erkennst du, dass die ganze Tafel stimmt?",
      optionen: [
        { text: "Jede Zeile und jede Spalte geht auf", richtig: true },
        { text: `Alle neun Zahlen ergeben zusammen ${N}`, hinweis: `Rechne nach: Innen ergibt ${N}, jeder Rand noch einmal ${N}, dazu rechts unten. Zusammen sind es ${4 * N}.` },
        { text: `Jede Zahl ist kleiner als ${N}`, hinweis: "Das stimmt immer, beweist aber nichts. Wie prüfst du, ob die Zahlen zueinander passen?" },
      ],
      tipps: ["Was gilt für links + Mitte in jeder Zeile?"], richtig: "So ist es. Prüfe das in jeder Zeile und jeder Spalte." },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Was in einer Zeile oder Spalte zwei Einträge hat, liefert den dritten. Innen zusammen ergibt den Rand. Schreibe dir den Hefteintrag ab." });
  const tf = a.tafelFelder || [];
  const stelle = (key) => ({ "0,0": "A und B", "0,1": "A und B̄", "0,2": "Summe A", "1,0": "Ā und B", "1,1": "Ā und B̄", "1,2": "Summe Ā", "2,0": "Summe B", "2,1": "Summe B̄", "2,2": "alle" }[key]);
  return gespraech(a, {
    titel: "Vierfeldertafel ausfüllen",
    gegeben: `${N} ${k.wer}; A: ${k.A}, B: ${k.B}`,
    vorwissen: ["Vierfeldertafel: Zeilen A und $\\overline{A}$, Spalten B und $\\overline{B}$"], merkzettel: [MERK.tafel],
    selbst: tf.map((f) => ({ text: `${zuTex(stelle(f.key))}:`, kurz: zuTex(stelle(f.key)), loesung: f.wert, toleranz: GANZ, ab: `f${f.key.replace(",", "")}`, fehler: [] })),
    hefteintrag: `Vierfeldertafel, ${N} ${k.wer}\n\n` + [["", "B", "$\\overline{B}$", "Summe"], ["A", ...w[0]], ["$\\overline{A}$", ...w[1]], ["Summe", ...w[2]]].map((zz) => zz.join(" | ")).join("\n") + "\n\nProbe: jede Zeile und jede Spalte geht auf.",
    rueckblick: {
      titel: "Zwei bekannte Einträge liefern den dritten",
      frage: "Wie füllt man eine Vierfeldertafel aus wenigen Angaben?",
      schritte: [
        { kurz: "Einordnen", text: `Eine Angabe über beide Merkmale gehört nach innen, eine über ein Merkmal an den Rand. Rechts unten stehen alle ${N}.` },
        { kurz: "Der Hebel", text: "In jeder Zeile und Spalte gilt: links + Mitte = Summe. Kennt man zwei der drei Zahlen, folgt die dritte." },
        { kurz: "Auffüllen", text: `So entsteht Feld um Feld, bis keines mehr fehlt. Hier zuletzt ${letzte ? "das Feld „" + stelle(letzte.slice(1, 2) + "," + letzte.slice(2)) + "“" : "der Rest"}.` },
        { kurz: "Prüfen", text: "Am Ende geht jede Zeile und jede Spalte auf." },
      ],
      einsicht: "Jede Zeile und jede Spalte der Tafel ist eine Summe: $$\\text{links} + \\text{Mitte} = \\text{Rand}$$",
      mitnehmen: "Ich suche immer eine Zeile oder Spalte, in der nur noch ein Eintrag fehlt.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* ---------- Anteile ---------- */
BAU["w-relativ"] = (a) => {
  const { w, k, N } = a.sok, q = (r, c) => w[r][c] / N;
  const z = Zeichnung();
  const w2 = w.map((zz) => zz.map((x) => dz(x / N, 3)));
  const sicht = tafelZ(z, { kopf: ["B", ov("B")], seite: ["A", ov("A")], w: w.map((zz) => zz.map(String)), w2, an2: new Set(), legende: legende(k) });
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Die [[Tafel|gitter]] zählt ${N} ${k.wer}. Nun sollen Anteile hinein statt Anzahlen.\n\nDie Anteile stehen gleich in grün unter den Anzahlen.` },
    { id: "nenner", typ: "wahl", text: `Durch welche Zahl teilst du das [[Feld oben links|f00]]?`,
      optionen: [
        { text: `Durch ${N}, die Zahl aller`, richtig: true },
        { text: `Durch ${w[2][0]}, die Summe der Spalte B`, hinweis: "Das ergäbe den Anteil innerhalb der Spalte, eine bedingte Wahrscheinlichkeit. In die Anteilstafel gehört der Anteil an allen." },
        { text: `Durch ${w[0][2]}, die Summe der Zeile A`, hinweis: "Das ergäbe den Anteil innerhalb der Zeile. In die Anteilstafel gehört der Anteil an allen." },
      ],
      tipps: ["Die Anteilstafel soll wieder aufgehen, und rechts unten soll 1 stehen."],
      richtig: `${lob()} Jedes Feld wird durch ${N} geteilt, auch am Rand.`, zeige: ["f00"] },
    { id: "w00", typ: "zahl", text: "Welcher Anteil gehört ins [[Feld oben links|f00]]? Runde auf drei Nachkommastellen.",
      loesung: q(0, 0), toleranz: T3, falsch: `Teile die Anzahl im Feld durch ${N}.`,
      fehler: fehlerAus([{ wert: w[0][0] / w[2][0], text: "Das ist der Anteil innerhalb der Spalte B. Geteilt wird durch alle." }, { wert: w[0][0] / w[0][2], text: "Das ist der Anteil innerhalb der Zeile A. Geteilt wird durch alle." }], q(0, 0), T3),
      tipps: [`$${frRoh(w[0][0], N)}$`], richtig: `${lob()} $${frRoh(w[0][0], N)} = ${dz(q(0, 0))}$.`, zeigeNachRichtig: ["w00"] },
    { id: "w02", typ: "zahl", text: "Und am [[Rand der Zeile A|f02]]? Runde auf drei Nachkommastellen.",
      loesung: q(0, 2), toleranz: T3, falsch: `Auch am Rand: durch ${N}.`,
      fehler: fehlerAus([{ wert: w[0][2], text: "Das ist die Anzahl. Gesucht ist der Anteil." }], q(0, 2), T3),
      tipps: [`$${frRoh(w[0][2], N)}$`], richtig: `${lob()} $P(A) = ${dz(q(0, 2))}$.`, zeige: ["f02"], verberge: ["f00"], zeigeNachRichtig: ["w01", "w02"] },
    { id: "w11", typ: "zahl", text: `Und im [[Feld „$\\overline{A}$ und $\\overline{B}$“|f11]]? Runde auf drei Nachkommastellen.`,
      loesung: q(1, 1), toleranz: T3, falsch: `Teile durch ${N}.`,
      fehler: fehlerAus([{ wert: w[1][1] / w[2][1], text: "Das ist der Anteil innerhalb der Spalte. Geteilt wird durch alle." }, { wert: w[1][1] / w[1][2], text: "Das ist der Anteil innerhalb der Zeile. Geteilt wird durch alle." }], q(1, 1), T3),
      tipps: [`$${frRoh(w[1][1], N)}$`], richtig: `${lob()} $${dz(q(1, 1))}$.`, zeige: ["f11"], verberge: ["f02"], zeigeNachRichtig: ["w10", "w11", "w12", "w20", "w21", "w22"] },
    { id: "eins", typ: "wahl", text: "Was steht in der Anteilstafel [[rechts unten|f22]]?",
      optionen: [
        { text: "1", richtig: true },
        { text: String(N), hinweis: `${N} ist die Anzahl. Welchen Anteil haben alle an allen?` },
        { text: "Das hängt von der Umfrage ab", hinweis: `Rechts unten steht ${frRoh(N, N)}.` },
      ],
      tipps: [`$${frRoh(N, N)}$`], richtig: `So ist es. Die Probe: $${dz(q(0, 0))} + ${dz(q(0, 1))} = ${dz(q(0, 2))}$, die Zeile geht auf.`, zeige: ["f22"], verberge: ["f11"] },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Eine Anteilstafel hat einen einzigen Nenner, die Gesamtzahl. Dann geht jede Zeile und Spalte auf, und rechts unten steht 1. Schreibe dir den Hefteintrag ab." },
  ];
  const tf = a.tafelFelder || [], f = (key) => tf.find((x) => x.key === key);
  const sel = [["0,0", "A und B", "w00"], ["0,2", "Summe A", "w02"], ["1,1", "$\\overline{A}$ und $\\overline{B}$", "w11"], ["2,1", "Summe $\\overline{B}$", "w11"]]
    .filter(([key]) => f(key)).map(([key, kurz, ab]) => ({ text: `${kurz} (drei Nachkommastellen):`, kurz, loesung: f(key).wert, toleranz: T3, ab, fehler: fehlerAus(f(key).fallen, f(key).wert, T3, ab) }));
  return gespraech(a, {
    titel: "Vierfeldertafel mit Anteilen",
    gegeben: `${N} ${k.wer}; A: ${k.A}, B: ${k.B}`,
    vorwissen: ["Anteil = Anzahl im Feld geteilt durch die Gesamtzahl"], merkzettel: [MERK.tafel],
    selbst: sel,
    hefteintrag: `Anteilstafel: jedes Feld durch ${N}\n\n` + [["", "B", "$\\overline{B}$", "Summe"], ["A", ...w2[0]], ["$\\overline{A}$", ...w2[1]], ["Summe", ...w2[2]]].map((zz) => zz.map((x) => (/^\d/.test(x) ? `$${x}$` : x)).join(" | ")).join("\n"),
    rueckblick: {
      titel: "Ein Nenner für alle Felder",
      frage: "Wie wird aus einer Tafel mit Anzahlen eine Tafel mit Anteilen?",
      schritte: [
        { kurz: "Die Frage", text: "Durch welche Zahl wird geteilt? Durch die Spalte, die Zeile oder alle?" },
        { kurz: "Die Entscheidung", text: `In die Anteilstafel gehört der Anteil an allen: oben links $${frRoh(w[0][0], N)} = ${dz(q(0, 0))}$.` },
        { kurz: "Auch am Rand", text: `Der Rand wird genauso geteilt: $${frRoh(w[0][2], N)} = ${dz(q(0, 2))}$.` },
        { kurz: "Die Probe", text: "Rechts unten steht 1, und jede Zeile geht auf." },
      ],
      einsicht: `Alle neun Felder haben denselben Nenner: $$\\text{Anteil} = \\frac{\\text{Anzahl im Feld}}{${N}}$$`,
      mitnehmen: "Wer innen durch die Spalte teilt, rechnet bedingte Anteile. Die gehören an den Baum, nicht in die Tafel.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* ---------- Bedingte Wahrscheinlichkeit ---------- */
BAU["w-bedingt"] = (a) => {
  const { w, k, N, x, y, notation, frage: fr0 } = a.sok;
  const r = x === "A" ? 0 : 1, c = y === "B" ? 0 : 1, anz = w[r][c], nx = w[r][2], ny = w[2][c];
  const EX = x === "A" ? "A" : ov("A"), EY = y === "B" ? "B" : ov("B");
  const D = { A: k.aD, nA: k.naD, B: k.bD, nB: k.nbD };
  const wert = [anz / N, anz / ny, anz / nx][notation], nenner = [N, ny, nx][notation];
  const gruppe = [`f22`, spalte(c), [0, 1, 2].map((j) => `f${r}${j}`).join(",")][notation];
  const z = Zeichnung();
  const sicht = tafelZ(z, { kopf: ["B", ov("B")], seite: ["A", ov("A")], w: w.map((zz) => zz.map(String)), legende: legende(k) });
  const opt = [
    { text: `Aus allen ${N}`, hinweis: `Lies die Frage noch einmal. Wird aus allen ausgewählt oder aus einer Gruppe?` },
    { text: `Aus den ${ny}, die ${D[y]}`, hinweis: notation === 0 ? "Hier wird aus allen ausgewählt. Beide Merkmale werden erst danach gefragt." : `Gefragt wird, ob ${k.pron} ${D[y]}. Ausgewählt wird aus einer anderen Gruppe.` },
    { text: `Aus den ${nx}, die ${D[x]}`, hinweis: notation === 0 ? "Hier wird aus allen ausgewählt. Beide Merkmale werden erst danach gefragt." : `Gefragt wird, ob ${k.pron} ${D[x]}. Ausgewählt wird aus einer anderen Gruppe.` },
  ].map((o, i) => (i === notation ? { text: o.text, richtig: true } : o));
  const notat = [`$P(${EX} \\cap ${EY})$`, `$P(${EX} \\mid ${EY})$`, `$P(${EY} \\mid ${EX})$`];
  const fehl = [0, 1, 2].filter((i) => i !== notation).map((i) => ({ wert: [anz / N, anz / ny, anz / nx][i], text: [`Das ist der Anteil an allen ${N}. Ausgewählt wird aber aus einer Gruppe.`, `Du hast durch die ${ny} geteilt, die ${D[y]}. Aus welcher Gruppe wird ausgewählt?`, `Du hast durch die ${nx} geteilt, die ${D[x]}. Aus welcher Gruppe wird ausgewählt?`][i] }));
  const vergleich = notation === 0 ? 1 : 0, vWert = [anz / N, anz / ny, anz / nx][vergleich];
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Die [[Tafel|gitter]] kennst du schon. Die Frage lautet:\n\n${fr0}` },
    { id: "gruppe", typ: "wahl", text: "Aus welcher Gruppe wird ausgewählt?", optionen: opt,
      tipps: ["Achte auf „unter allen“ oder „der … ist“: Das legt die Gruppe fest."],
      richtig: `${lob()} Die Gruppe steht [[hier|${gruppe}]]. ${notation === 0 ? `Es sind alle ${N}.` : `Sie hat ${nenner} Mitglieder.`}`, zeigeNachRichtig: gruppe.split(",") },
    { id: "notation", typ: "wahl", text: "Welche Wahrscheinlichkeit ist damit gefragt?",
      optionen: notat.map((t, i) => (i === notation ? { text: t, richtig: true } : { text: t, hinweis: i === 0 ? "Der Schnitt zählt unter allen. Hier wird aber aus einer Gruppe ausgewählt." : notation === 0 ? "Hier gibt es keine Bedingung: ausgewählt wird aus allen." : "Hinter dem Strich steht die Gruppe, aus der ausgewählt wird." })),
      tipps: ["Hinter dem senkrechten Strich steht die Bedingung, also die Gruppe."],
      richtig: `Genau: ${notat[notation]}.` },
    { id: "wert", typ: "zahl", text: `Wie groß ist ${notat[notation]}? Bruch oder drei Nachkommastellen.`,
      loesung: wert, toleranz: T3, falsch: "Zähler: beides trifft zu. Nenner: die Gruppe.",
      fehler: fehlerAus(fehl, wert, T3),
      tipps: [`Im Zähler steht das [[Feld, in dem beides gilt|f${r}${c}]]: ${anz}.`, `$${frRoh(anz, nenner)}$`],
      richtig: `${lob()} ${notat[notation]} $= ${frRoh(anz, nenner)} \\approx ${dz(wert)}$.`, zeigeNachRichtig: [`f${r}${c}`] },
    { id: "vergleich", typ: "zahl", text: `Zum Vergleich: Wie groß ist ${notat[vergleich]}? Bruch oder drei Nachkommastellen.`,
      loesung: vWert, toleranz: T3, falsch: vergleich === 0 ? `Jetzt wird aus allen ${N} ausgewählt.` : `Jetzt wird aus den ${ny} ausgewählt, die ${D[y]}.`,
      fehler: fehlerAus([{ wert, text: "Das ist der Wert von eben. Der Zähler bleibt, aber der Nenner ändert sich." }], vWert, T3),
      tipps: [`Der Zähler bleibt ${anz}.`, `$${frRoh(anz, [N, ny, nx][vergleich])}$`],
      richtig: `${lob()} $${frRoh(anz, [N, ny, nx][vergleich])} \\approx ${dz(vWert)}$. Gleicher Zähler, anderer Nenner, ganz anderer Wert.` },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Zuerst fragen, aus welcher Gruppe ausgewählt wird. Ihre Anzahl ist der Nenner. $$P(A \\mid B) = \\frac{\\text{Anzahl A und B}}{\\text{Anzahl B}}$$ Schreibe dir den Hefteintrag ab." },
  ];
  return gespraech(a, {
    titel: "Bedingte Wahrscheinlichkeit",
    gegeben: `${N} ${k.wer}; A: ${k.A}, B: ${k.B}`,
    vorwissen: ["Vierfeldertafel lesen", "Schreibweise $P(A \\mid B)$: Wahrscheinlichkeit von A unter der Bedingung B"], merkzettel: [MERK.bedingt],
    selbst: [{ ...frage(feld(a, "p"), "gruppe", { kurz: "Wahrscheinlichkeit" }) }],
    hefteintrag: `Gruppe, aus der ausgewählt wird: ${notation === 0 ? `alle ${N}` : `${nenner}, die ${notation === 1 ? D[y] : D[x]}`}\n\n${notat[notation]} $= ${frRoh(anz, nenner)} \\approx ${dz(wert)}$\n\nVergleich: ${notat[vergleich]} $= ${frRoh(anz, [N, ny, nx][vergleich])} \\approx ${dz(vWert)}$`,
    rueckblick: {
      titel: "Der Nenner ist die Gruppe",
      frage: "Wie liest man eine bedingte Wahrscheinlichkeit aus der Tafel ab?",
      schritte: [
        { kurz: "Die Gruppe finden", text: `Die Frage wählt ${notation === 0 ? `aus allen ${N}` : `aus den ${nenner}, die ${notation === 1 ? D[y] : D[x]}`}.` },
        { kurz: "Benennen", text: `Die Gruppe ist die Bedingung und steht hinter dem Strich.` },
        { kurz: "Teilen", text: `Gezählt wird, wo beides zutrifft: $${frRoh(anz, nenner)} \\approx ${dz(wert)}$.` },
        { kurz: "Vergleichen", text: `Mit einer anderen Gruppe kommt bei gleichem Zähler $${frRoh(anz, [N, ny, nx][vergleich])} \\approx ${dz(vWert)}$ heraus.` },
      ],
      einsicht: "Der Zähler ist immer das Feld, in dem beides gilt, der Nenner die Gruppe: $$P(A | B) = \\frac{\\text{Anzahl A und B}}{\\text{Anzahl B}}$$",
      mitnehmen: "Ich frage mich jedes Mal: Aus welcher Gruppe wird ausgewählt?",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* ---------- Baum und Tafel übersetzen ---------- */
BAU["w-baumtafel"] = (a) => {
  const { w, k, N, ersteA } = a.sok;
  const rand = ersteA ? [w[0][2], w[1][2]] : [w[2][0], w[2][1]];
  const innen = ersteA ? [[w[0][0], w[0][1]], [w[1][0], w[1][1]]] : [[w[0][0], w[1][0]], [w[0][1], w[1][1]]];
  const [X, Y] = ersteA ? ["A", "B"] : ["B", "A"];
  const s1 = [X, ov(X)], s2 = [[Y, ov(Y)], [Y, ov(Y)]];
  const z = Zeichnung();
  const tb = tafelZ(z, { kopf: ["B", ov("B")], seite: ["A", ov("A")], w: w.map((zz) => zz.map(String)), legende: legende(k) }, 0.6, 5.3);
  const bb = baumZ(z, { s1, s2, p1: rand.map((x) => dz(x / N, 2)), p2: innen.map((zz, i) => zz.map((x) => dz(x / rand[i], 3))), enden: innen.flat().map((x) => dz(x / N, 3)) });
  const sicht = [Math.min(tb[0], bb[0]), Math.max(tb[1], bb[1]), bb[2], tb[3]];
  const zelleVon = (i, j) => (ersteA ? `f${i}${j}` : `f${j}${i}`), randVon = (i) => (ersteA ? `f${i}2` : `f2${i}`);
  const p1 = rand[0] / N, b11 = innen[0][0] / rand[0], b21 = innen[1][0] / rand[1];
  const name1 = (i) => (i ? `$\\overline{${X}}$` : X);
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Oben steht die [[Tafel|gitter]], unten der [[Baum|a1,a2,a11,a12,a21,a22]]. Seine erste Stufe ist ${X}.\n\nWir übersetzen die Tafel Ast für Ast.` },
    { id: "eins", typ: "zahl", text: `Was gehört an den [[ersten Ast ①|a1]], also $P(${X})$? Zwei Nachkommastellen.`,
      loesung: p1, toleranz: T2, falsch: `Randwert von ${X} geteilt durch ${N}.`,
      fehler: fehlerAus([{ wert: rand[0], text: "Das ist die Anzahl. An den Ast gehört der Anteil." }, { wert: innen[0][0] / N, text: "Das ist ein Innenfeld. Die erste Stufe fragt nur nach " + X + ": Das steht am Rand." }], p1, T2),
      tipps: [`Der [[Randwert von ${X}|${randVon(0)}]] ist ${rand[0]}.`, `$${frRoh(rand[0], N)}$`],
      richtig: `${lob()} $P(${X}) = ${frRoh(rand[0], N)} = ${dz(p1, 2)}$.`, zeige: [randVon(0)], zeigeNachRichtig: ["q1"] },
    { id: "zwei", typ: "wahl", text: "Und an den [[Ast ②|a2]]?",
      optionen: [
        { text: `$1 - ${dz(p1, 2)} = ${dz(1 - p1, 2)}$`, richtig: true },
        { text: `$${dz(p1, 2)}$, wie bei ①`, hinweis: "Die beiden Äste an einem Knoten teilen alle Fälle unter sich auf. Was ergeben sie zusammen?" },
        { text: "Das lässt sich ohne Tafel nicht sagen", hinweis: "An einem Knoten ergeben die Äste zusammen 1. Was folgt daraus?" },
      ],
      tipps: ["Die Äste an einem Knoten ergeben zusammen 1."], richtig: `Genau: $P(${ov(X)}) = ${dz(1 - p1, 2)}$.`, zeigeNachRichtig: ["q2"] },
    { id: "drei", typ: "wahl", text: `Was gehört an den [[Ast ③|a11]], hinter ${X}?`,
      optionen: [
        { text: `Der Anteil innerhalb der Gruppe ${X}: $${frRoh(innen[0][0], rand[0])}$`, richtig: true },
        { text: `Der Anteil an allen: $${frRoh(innen[0][0], N)}$`, hinweis: "Das ist ein Pfadende. Am zweiten Ast steht der Anteil innerhalb der Gruppe, aus der der Ast kommt." },
        { text: `Der Randwert von ${Y}: $${frRoh(ersteA ? w[2][0] : w[0][2], N)}$`, hinweis: `Hinter ${X} betrachten wir nur noch die Gruppe ${X}. Der Randwert gilt für alle.` },
      ],
      tipps: [`Wer an diesem Ast steht, gehört schon zu ${X}.`],
      richtig: `${lob()} Es ist $P(${Y} \\mid ${X})$, eine bedingte Wahrscheinlichkeit.`, zeige: [zelleVon(0, 0), randVon(0)] },
    { id: "drei_w", typ: "zahl", text: `Wie groß ist ③ $= P(${Y} \\mid ${X})$? Drei Nachkommastellen.`,
      loesung: b11, toleranz: T3, falsch: `Innenfeld geteilt durch den Randwert ${rand[0]}.`,
      fehler: fehlerAus([{ wert: innen[0][0] / N, text: `Das ist der Anteil an allen ${N}. Am zweiten Ast steht der Anteil innerhalb der Gruppe: durch ${rand[0]} teilen.` }], b11, T3),
      tipps: [`$${frRoh(innen[0][0], rand[0])}$`], richtig: `${lob()} $${frRoh(innen[0][0], rand[0])} \\approx ${dz(b11)}$, und ④ ist $${dz(1 - b11)}$.`, zeigeNachRichtig: ["q11", "q12"] },
    { id: "fuenf", typ: "zahl", text: `Nun hinter $${ov(X)}$: Wie groß ist ⑤ $= P(${Y} \\mid ${ov(X)})$? Drei Nachkommastellen.`,
      loesung: b21, toleranz: T3, falsch: `Teile durch die Gruppe $${ov(X)}$: ${rand[1]}.`,
      fehler: fehlerAus([{ wert: innen[1][0] / N, text: `Das ist der Anteil an allen. Teile durch die ${rand[1]} in der Gruppe.` }, { wert: innen[1][0] / rand[0], text: `Du hast durch die Gruppe ${X} geteilt. Dieser Ast kommt aus der anderen Gruppe.` }], b21, T3),
      tipps: [`$${frRoh(innen[1][0], rand[1])}$`], richtig: `${lob()} $${frRoh(innen[1][0], rand[1])} \\approx ${dz(b21)}$, und ⑥ ist $${dz(1 - b21)}$.`, zeige: [zelleVon(1, 0), randVon(1)], verberge: [zelleVon(0, 0), randVon(0)], zeigeNachRichtig: ["q21", "q22"] },
    { id: "probe", typ: "wahl", text: `Was ergibt ① · ③, das [[Ende des oberen Pfades|a1,a11]]?`,
      optionen: [
        { text: `Das Innenfeld „A und B“ als Anteil: $${dz(innen[0][0] / N)}$`, richtig: true },
        { text: `Den Randwert von ${Y}`, hinweis: "Ein Pfad verlangt beide Merkmale zugleich. Steht so etwas am Rand?" },
        { text: "Nichts, was in der Tafel steht", hinweis: `Rechne nach: $${dz(p1, 2)} \\cdot ${dz(b11)}$. Suche diesen Anteil in der Tafel.` },
      ],
      tipps: [`$${frRoh(rand[0], N)} \\cdot ${frRoh(innen[0][0], rand[0])}$: Was kürzt sich?`],
      richtig: "So ist es. Die Pfadenden sind die Innenfelder der Anteilstafel.", zeigeNachRichtig: ["e11", "e12", "e21", "e22"] },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Erste Äste sind Randwerte, zweite Äste bedingte Anteile innerhalb der Gruppe, Pfadenden die Innenfelder. Schreibe dir den Hefteintrag ab." },
  ];
  const ab = ["eins", "zwei", "drei", "drei_w", "fuenf", "fuenf"];
  return gespraech(a, {
    titel: "Baum und Tafel übersetzen",
    gegeben: `${N} ${k.wer}; erste Stufe ${X}`,
    vorwissen: ["Vierfeldertafel lesen", "Bedingte Wahrscheinlichkeit"], merkzettel: [MERK.bedingt, MERK.pfad],
    selbst: (a.felder || []).map((f, i) => frage(f, ab[i] || "eins")),
    hefteintrag: `Baum aus der Tafel, erste Stufe ${X}\n\n① $P(${X}) = ${frRoh(rand[0], N)} = ${dz(p1, 2)}$  ② $P(${ov(X)}) = ${dz(1 - p1, 2)}$\n\n③ $P(${Y} \\mid ${X}) = ${frRoh(innen[0][0], rand[0])} \\approx ${dz(b11)}$  ④ $\\approx ${dz(1 - b11)}$\n\n⑤ $P(${Y} \\mid ${ov(X)}) = ${frRoh(innen[1][0], rand[1])} \\approx ${dz(b21)}$  ⑥ $\\approx ${dz(1 - b21)}$`,
    rueckblick: {
      titel: "Rand, Gruppe, Innenfeld",
      frage: "Wie wird aus einer Vierfeldertafel ein Baumdiagramm?",
      schritte: [
        { kurz: "Erste Stufe", text: `Die ersten Äste sind Randwerte: $P(${X}) = ${frRoh(rand[0], N)}$.` },
        { kurz: "Die Stolperstelle", text: `Am zweiten Ast steht nicht der Anteil an allen, sondern der Anteil innerhalb der Gruppe: $${frRoh(innen[0][0], rand[0])}$ statt $${frRoh(innen[0][0], N)}$.` },
        { kurz: "Ergänzen", text: "Die Äste an jedem Knoten ergeben zusammen 1." },
        { kurz: "Zurück zur Tafel", text: "Rand mal bedingter Anteil ergibt ein Pfadende, also ein Innenfeld der Anteilstafel." },
      ],
      einsicht: `Die Pfadregel verbindet beide Bilder: $$\\frac{${rand[0]}}{${N}} \\cdot \\frac{${innen[0][0]}}{${rand[0]}} = \\frac{${innen[0][0]}}{${N}}$$`,
      mitnehmen: "Am zweiten Ast frage ich: Welche Gruppe ist hier schon ausgewählt? Durch ihre Anzahl teile ich.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* ---------- Umgekehrter Baum ---------- */
BAU["w-umkehr"] = (a) => {
  const { A, B, a: pa, b, c } = a.sok;
  const ab = pa * b, nab = (1 - pa) * c, pB = ab + nab, pAB = ab / pB;
  const gerundet = rund(ab, 2) / (rund(ab, 2) + rund(nab, 2));
  const z = Zeichnung();
  const sicht = baumZ(z, { s1: ["A", ov("A")], s2: [["B", ov("B")], ["B", ov("B")]], p1: [dz(pa, 3), dz(1 - pa, 3)], p2: [[dz(b, 3), dz(1 - b, 3)], [dz(c, 3), dz(1 - c, 3)]], enden: [dz(ab, 5), "", dz(nab, 5), ""] }, { p1: true, p2: true });
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. A heißt „${A}“, B heißt „${B}“. Der [[Baum|a1,a2,a11,a12,a21,a22]] beginnt mit A, so sind die Angaben gegeben.\n\nGefragt ist aber $P(A \\mid B)$: Die Bedingung ist B.` },
    { id: "angabe", typ: "wahl", text: `Die Aufgabe nennt $${pzT(b)}$. Ist das schon die gesuchte Wahrscheinlichkeit?`,
      optionen: [
        { text: `Nein, $${pzT(b)}$ ist $P(B \\mid A)$, gesucht ist $P(A \\mid B)$`, richtig: true },
        { text: "Ja, sie beschreibt dieselbe Gruppe", hinweis: `$${pzT(b)}$ zählt unter allen mit „${A}“. Gefragt wird unter allen mit „${B}“. Sind das dieselben?` },
        { text: `Nein, $${pzT(b)}$ ist $P(A \\cap B)$`, hinweis: "Die Angabe gilt nur für die Gruppe A, nicht für alle. Welche Schreibweise passt dazu?" },
      ],
      tipps: ["Unter welchen Fällen wird die Angabe gezählt?"],
      richtig: `${lob()} Die Angabe steht am [[Ast hinter A|a11]]. Wir müssen umkehren.` },
    { id: "pfad1", typ: "zahl", text: `Wie groß ist $P(A \\cap B)$, der [[Pfad über A zu B|a1,a11]]? Runde auf vier Nachkommastellen.`,
      loesung: ab, toleranz: T4, falsch: "Entlang des Pfades wird multipliziert.",
      fehler: fehlerAus([{ wert: b, text: "Das ist nur die zweite Stufe. Erst muss A eintreten: noch mal P(A)." }, { wert: pa + b, text: "Entlang eines Pfades wird multipliziert, nicht addiert." }], ab, T4),
      tipps: [`$${dz(pa, 3)} \\cdot ${dz(b, 3)}$`], richtig: `${lob()} $${dz(pa, 3)} \\cdot ${dz(b, 3)} = ${dz(ab, 5)}$.`, zeigeNachRichtig: ["e11"] },
    { id: "pfad2", typ: "zahl", text: `Auch über $\\overline{A}$ kommt man zu B. Wie groß ist $P(\\overline{A} \\cap B)$, der [[zweite Pfad|a2,a21]]? Vier Nachkommastellen.`,
      loesung: nab, toleranz: T4, falsch: "Multipliziere entlang des Pfades über $\\overline{A}$.",
      fehler: fehlerAus([{ wert: c, text: "Das ist nur die zweite Stufe. Davor steht $P(\\overline{A})$." }], nab, T4),
      tipps: [`$${dz(1 - pa, 3)} \\cdot ${dz(c, 3)}$`], richtig: `${lob()} $${dz(1 - pa, 3)} \\cdot ${dz(c, 3)} = ${dz(nab, 5)}$.`, zeigeNachRichtig: ["e21"] },
    { id: "pb", typ: "zahl", text: "Wie groß ist $P(B)$, alle Fälle mit B? Runde auf drei Nachkommastellen.",
      loesung: pB, toleranz: T3, falsch: "Addiere die beiden Pfade, die bei B enden.",
      fehler: fehlerAus([{ wert: ab, text: "Das ist nur der Pfad über A. B erreicht man auch über $\\overline{A}$." }, { wert: b, text: "Das ist $P(B \\mid A)$. P(B) ist die Summe beider Pfade zu B." }], pB, T3),
      tipps: [`$${dz(ab, 5)} + ${dz(nab, 5)}$`], richtig: `${lob()} $P(B) = ${dz(pB, 5)} \\approx ${dz(pB)}$.` },
    { id: "pab", typ: "zahl", text: "Nun die Umkehrung: Welcher Anteil der Fälle mit B läuft über A? Wie groß ist $P(A \\mid B)$? Drei Nachkommastellen.",
      loesung: pAB, toleranz: T3, falsch: "Teile den Pfad über A durch P(B). Rechne mit den ungerundeten Werten.",
      fehler: fehlerAus([{ wert: b, text: "Das ist die Angabe P(B | A). Gesucht ist die Umkehrung." }, { wert: ab, text: "Das ist P(A ∩ B). Es muss noch durch P(B) geteilt werden." }, ...(Math.abs(gerundet - pAB) > 0.0015 ? [{ wert: gerundet, text: "Fast, aber du hast unterwegs gerundet. Rechne mit den ungerundeten Pfadwerten." }] : [])], pAB, T3),
      tipps: ["$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$", `$\\frac{${dz(ab, 5)}}{${dz(pB, 5)}}$`],
      richtig: `${lob()} $P(A \\mid B) = \\frac{${dz(ab, 5)}}{${dz(pB, 5)}} \\approx ${dz(pAB)} \\approx ${pzT(pAB)}$.` },
    { id: "deuten", typ: "wahl", text: `Warum liegen $P(B \\mid A) = ${dz(b, 3)}$ und $P(A \\mid B) \\approx ${dz(pAB)}$ so weit auseinander?`,
      optionen: [
        { text: "Weil die Bedingung wechselt: einmal teilt man durch alle mit A, einmal durch alle mit B", richtig: true },
        { text: "Einer der beiden Werte ist falsch gerechnet", hinweis: "Beide stimmen. Vergleiche die Gruppen, unter denen gezählt wird." },
        { text: "Eigentlich müssten sie gleich sein", hinweis: "Gleich wären sie nur, wenn die Gruppen A und B gleich groß wären. Sind sie das?" },
      ],
      tipps: [`$P(A) = ${dz(pa, 3)}$, aber $P(B) \\approx ${dz(pB)}$.`],
      richtig: `So ist es. Unter allen mit B sind auch die [[Fälle über $\\overline{A}$|a2,a21]], und davon gibt es ${nab > ab ? "sogar mehr" : "eine ganze Menge"}.` },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Im Nenner stehen alle Pfade, die bei der Bedingung enden. $$P(A \\mid B) = \\frac{P(A \\cap B)}{P(A \\cap B) + P(\\overline{A} \\cap B)}$$ Gerundet wird erst am Schluss." },
  ];
  return gespraech(a, {
    titel: "Umgekehrter Baum",
    gegeben: `$P(A) = ${dz(pa, 3)}$, $P(B \\mid A) = ${dz(b, 3)}$, $P(B \\mid \\overline{A}) = ${dz(c, 3)}$`,
    vorwissen: ["Pfadregeln", "Bedingte Wahrscheinlichkeit $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$"], merkzettel: [MERK.pfad, MERK.bedingt],
    selbst: [frage(feld(a, "pb"), "pfad1", { kurz: "$P(B)$" }), frage(feld(a, "pab"), "pab", { kurz: "$P(A \\mid B)$" })],
    hefteintrag: `A: ${A}, B: ${B}\n\n$P(A \\cap B) = ${dz(pa, 3)} \\cdot ${dz(b, 3)} = ${dz(ab, 5)}$\n\n$P(\\overline{A} \\cap B) = ${dz(1 - pa, 3)} \\cdot ${dz(c, 3)} = ${dz(nab, 5)}$\n\n$P(B) = ${dz(pB, 5)} \\approx ${dz(pB)}$\n\n$P(A \\mid B) = \\frac{${dz(ab, 5)}}{${dz(pB, 5)}} \\approx ${pzT(pAB)}$`,
    rueckblick: {
      titel: "Die Bedingung umdrehen",
      frage: `Wie wahrscheinlich ist „${A}“, wenn „${B}“ beobachtet wird?`,
      schritte: [
        { kurz: "Unterscheiden", text: `Gegeben ist $P(B | A) = ${dz(b, 3)}$, gefragt die Umkehrung $P(A | B)$.` },
        { kurz: "Alle Wege zu B", text: `B entsteht auf zwei Pfaden: $${dz(ab, 5)}$ über A und $${dz(nab, 5)}$ über die anderen.` },
        { kurz: "Der Anteil", text: `Der Pfad über A ist der Anteil an allen B: $${dz(ab, 5)} : ${dz(pB, 5)} \\approx ${dz(pAB)}$.` },
        { kurz: "Deuten", text: `Die Umkehrung ist ${pAB < b ? "viel kleiner" : "anders"} als die Angabe, weil im Nenner auch die Fälle ohne A stehen.` },
      ],
      einsicht: "Im Nenner stehen alle Pfade, die bei B enden: $$P(A | B) = \\frac{P(A ∩ B)}{P(B)}$$",
      mitnehmen: "Ich runde erst am Schluss und frage immer, welche Fälle im Nenner stehen.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* Gemischte Stationen nehmen den Baukasten ihrer Herkunft */
BAU["w-mix"] = (a) => BAU[a.herkunft](a);

/* ---------- öffentlich ---------- */
const TrS = {
  BAU, zuTex, aufgabeAus, frage, feld, fehlerAus, gespraech, Zeichnung, baumZ, tafelZ, flaecheZ, rasterZ, omegaZ, legende, spalte,
  dz, fr, frRoh, frGleich, ov, tx, pzT, gross, lob, T2, T3, T4, GANZ, MERK, rund,
  kann(id, a) { const b = BAU[id === "w-mix" || id === "u-mix" ? a && a.herkunft : id]; return !!(b && a && a.sok); },
  dialog(id, a, heim) {
    const quelle = id === "w-mix" || id === "u-mix" ? a.herkunft : id;
    lobNr = Math.floor(Math.random() * LOB.length);
    const d = BAU[quelle](a);
    d.heim = heim;
    d.kennung = quelle + ":" + Date.now().toString(36);
    return d;
  },
};
g.TraineliaSokrates = TrS;
})(typeof window !== "undefined" ? window : globalThis);
