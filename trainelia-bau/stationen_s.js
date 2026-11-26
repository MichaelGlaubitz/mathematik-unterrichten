/* ============================================================
   4. Die Stationen (Kapitel 3: Integration durch Substitution)
   Jede Station: id, titel, vor (Schritte), merke, stolper,
   neu() → Aufgabe, ziel (Serie richtig in Folge)
   Ein Vorführschritt: { t, v, f? }  mit  f = { q, o:[{t, ok?, w}], d? }:
   Sokrates-Frage vor dem Weitergehen (Weiter erst nach der richtigen Wahl).
   Aufgabe: { html, bild?, felder:[{id,label,wert,tol,art,fallen}], auswahl?,
              tipps:[html], loesung:html, sok? }
   art "z": beliebige Zahl mit Toleranz (nicht als Prozent gelesen),
   art "n": ganze Zahl, exakt.
   ============================================================ */
const STATIONEN = [];
const T = String.raw;

/* ---------- Formeln mit KaTeX ---------- */
const KATEX_OPT = { throwOnError: false, strict: false, trust: (k) => k.command === "\\htmlClass" };
const M = (tex) => (window.katex ? katex.renderToString(tex, KATEX_OPT) : `<span class="m">${tex}</span>`);
const MD = (tex) => (window.katex ? katex.renderToString(tex, { ...KATEX_OPT, displayMode: true }) : `<div class="m">${tex}</div>`);
const IN = (s) => T`\htmlClass{t-in}{${s}}`;      // das Innere, blau
const AB = (s) => T`\htmlClass{t-ab}{${s}}`;      // die innere Ableitung, türkis
const misch = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const kzT = (x, st = 3) => kz(x, st).replace(",", "{,}");

/* ---------- Brüche ---------- */
const Bruch = (z, n = 1) => { if (n < 0) { z = -z; n = -n; } const g = ggt(z, n); return [z / g, n / g]; };
const bmal = (a, b) => Bruch(a[0] * b[0], a[1] * b[1]);
const bdurch = (a, b) => Bruch(a[0] * b[1], a[1] * b[0]);
const bw = (a) => a[0] / a[1];
const bgleich = (a, b) => a[0] === b[0] && a[1] === b[1];
function bTex(b) { const [z, n] = b; if (n === 1) return String(z); return (z < 0 ? "-" : "") + T`\frac{${Math.abs(z)}}{${n}}`; }
function bTxt(b) { return b[1] === 1 ? String(b[0]) : `${b[0]}/${b[1]}`; }
/* Faktor vor einem Ausdruck: 1 → nichts, −1 → „−“ */
function koef(b) { if (bgleich(b, [1, 1])) return ""; if (bgleich(b, [-1, 1])) return "-"; return bTex(b) + T`\,`; }

/* ---------- Innere Funktion g(x) = p·xⁿ + q ---------- */
const xPot = (e) => (e === 0 ? "" : e === 1 ? "x" : `x^{${e}}`);
function innen(p, n, q) {
  const mon = (p === 1 ? "" : p === -1 ? "-" : String(p)) + xPot(n);
  const tex = mon + (q > 0 ? ` + ${q}` : q < 0 ? ` - ${-q}` : "");
  const ggb = `${p}*x^${n}` + (q > 0 ? `+${q}` : q < 0 ? `${q}` : "");
  const d = n * p;                                     // g'(x) = d·x^(n−1)
  const dTex = n === 1 ? String(p) : (d === 1 ? "" : d === -1 ? "-" : String(d)) + xPot(n - 1);
  return { p, n, q, tex, ggb, d, dTex, w: (x) => p * x ** n + q };
}

/* ---------- Äußere Funktionen ----------
   F = Fk · bare(u) ist eine Stammfunktion von f. */
const klam = (U) => (/^[a-z]$/.test(U) ? U : `(${U})`);
const AUSSEN = {
  pot: (m) => ({ art: "pot", m, f: (u) => u ** m, F: (u) => u ** (m + 1) / (m + 1), Fk: [1, m + 1],
    tex: (U) => `${klam(U)}^{${m}}`, bare: (U) => `${klam(U)}^{${m + 1}}`, abl: (U) => `${m}${klam(U)}^{${m - 1 === 1 ? "" : m - 1}}`.replace("^{}", ""),
    ggb: (U) => `(${U})^${m}`, Fggb: (U) => `(${U})^${m + 1}`,
    grund: T`\int u^{${m}}\,du = \frac{1}{${m + 1}}\,u^{${m + 1}} + C`, fehlt: `Beim Integrieren von ${M(`u^{${m}}`)} steigt der Exponent auf ${m + 1}, und es kommt der Faktor ${M(T`\frac{1}{${m + 1}}`)} dazu.` }),
  exp: () => ({ art: "exp", f: Math.exp, F: Math.exp, Fk: [1, 1],
    tex: (U) => `e^{${U}}`, bare: (U) => `e^{${U}}`, abl: null,
    ggb: (U) => `exp(${U})`, Fggb: (U) => `exp(${U})`,
    grund: T`\int e^{u}\,du = e^{u} + C`, fehlt: "" }),
  sin: () => ({ art: "sin", f: Math.sin, F: (u) => -Math.cos(u), Fk: [-1, 1],
    tex: (U) => T`\sin(${U})`, bare: (U) => T`\cos(${U})`, abl: (U) => T`\cos(${U})`,
    ggb: (U) => `sin(${U})`, Fggb: (U) => `cos(${U})`,
    grund: T`\int \sin(u)\,du = -\cos(u) + C`, fehlt: `Die Stammfunktion von ${M(T`\sin`)} ist ${M(T`-\cos`)}: Achte auf das Minus.` }),
  cos: () => ({ art: "cos", f: Math.cos, F: Math.sin, Fk: [1, 1],
    tex: (U) => T`\cos(${U})`, bare: (U) => T`\sin(${U})`, abl: (U) => T`-\sin(${U})`,
    ggb: (U) => `cos(${U})`, Fggb: (U) => `sin(${U})`,
    grund: T`\int \cos(u)\,du = \sin(u) + C`, fehlt: `Die Stammfunktion von ${M(T`\cos`)} ist ${M(T`\sin`)}, ohne Minus.` }),
  kehr: () => ({ art: "kehr", f: (u) => 1 / u, F: (u) => Math.log(Math.abs(u)), Fk: [1, 1],
    tex: (U) => T`\frac{1}{${U}}`, bare: (U) => T`\ln|${U}|`, abl: (U) => T`-\frac{1}{${klam(U)}^{2}}`,
    ggb: (U) => `1/(${U})`, Fggb: (U) => `ln(abs(${U}))`,
    grund: T`\int \frac{1}{u}\,du = \ln|u| + C`, fehlt: "" }),
  wurzel: () => ({ art: "wurzel", f: Math.sqrt, F: (u) => (2 / 3) * u ** 1.5, Fk: [2, 3],
    tex: (U) => T`\sqrt{${U}}`, bare: (U) => `${klam(U)}^{\\frac{3}{2}}`, abl: (U) => T`\frac{1}{2\sqrt{${U}}}`,
    ggb: (U) => `sqrt(${U})`, Fggb: (U) => `(${U})^(3/2)`,
    grund: T`\int \sqrt{u}\,du = \int u^{\frac{1}{2}}\,du = \frac{2}{3}\,u^{\frac{3}{2}} + C`, fehlt: `${M(T`\sqrt{u} = u^{\frac{1}{2}}`)}: Der Exponent steigt auf ${M(T`\frac{3}{2}`)}, dazu kommt der Faktor ${M(T`\frac{2}{3}`)}.` }),
};

/* Vorfaktor c·x^e und Integrand c·x^(n−1)·f(g(x)) als TeX */
function vorTex(cB, e) {
  const xs = xPot(e);
  if (!xs) return bgleich(cB, [1, 1]) ? "" : bgleich(cB, [-1, 1]) ? "-" : bTex(cB);
  if (bgleich(cB, [1, 1])) return xs;
  if (bgleich(cB, [-1, 1])) return "-" + xs;
  return bTex(cB) + xs;
}
function hTex(cB, gi, a, faerben) {
  const gT = faerben ? IN(gi.tex) : gi.tex;
  const xs = xPot(gi.n - 1);
  if (a.art === "kehr") {
    const oben = cB[1] === 1 ? (vorTex(cB, gi.n - 1) || "1").replace(/^-$/, "-1") : (xs || "1");
    const davor = cB[1] === 1 ? "" : bTex(cB) + T`\cdot `;
    return davor + T`\frac{${faerben && xs ? AB(oben) : oben}}{${gT}}`;
  }
  const v = vorTex(cB, gi.n - 1);
  const vT = faerben && v && v !== "-" ? AB(v) : v;
  return v === "" ? a.tex(gT) : v === "-" ? "-" + a.tex(gT) : `${vT}\\,${a.tex(gT)}`;
}
const ggbZahl = (b) => (b[1] === 1 ? String(b[0]) : `(${b[0]}/${b[1]})`);

/* Eine Substitutionsaufgabe würfeln.
   o.n: Grade des Inneren, o.arten: äußere Funktionen, o.def: bestimmtes Integral */
function sub(o = {}) {
  for (let v = 0; v < 400; v++) {
    const n = wahl(o.n || [1, 2, 2, 3]);
    const p = n === 1 ? wahl([2, 3, 4, 5, -2, -3]) : wahl([1, 1, 1, 2, 3]);
    const q = n === 1 ? wahl([1, 2, 3, 5, -1, -2, -4, 7]) : wahl([0, 1, 1, 2, 3, 4, 5, -1, -2]);
    const art = wahl(o.arten || ["pot", "pot", "exp", "sin", "cos", "kehr", "wurzel"]);
    if ((art === "pot" || art === "kehr" || art === "wurzel") && q === 0) continue;
    const m = art === "pot" ? wahl(n === 1 ? [2, 3, 4, 5, 6] : [2, 3, 4]) : 0;
    const a = art === "pot" ? AUSSEN.pot(m) : AUSSEN[art]();
    const gi = innen(p, n, q);
    const c = n === 1 ? wahl([1, 1, 1, 2, 3]) : wahl([1, 1, 2, 3, 4, 6, Math.abs(gi.d), 2 * Math.abs(gi.d)]);
    const cB = [c, 1];
    const k = Bruch(c, gi.d);                         // ∫ h dx = k ∫ f(u) du
    const K = bmal(k, a.Fk);                          // Ergebnis: K · bare(g(x)) + C
    const h = (x) => c * x ** (n - 1) * a.f(gi.w(x));
    const t = { n, p, q, c, cB, art, m, a, gi, k, K, h, geschichte: art + n };
    t.hT = hTex(cB, gi, a);
    t.hTf = hTex(cB, gi, a, true);
    t.uT = a.tex("u");
    t.FuT = koef(a.Fk) + a.bare("u");
    t.ergT = `${koef(K)}${a.bare(gi.tex)} + C`;
    t.hG = `${c}*x^${n - 1}*${a.ggb(gi.ggb)}`;
    t.FG = `${ggbZahl(K)}*${a.Fggb(gi.ggb)}`;
    t.fG = `${ggbZahl(k)}*${a.ggb("x")}`;
    if (o.def) {
      const paare = n === 1 ? [[0, 1], [0, 2], [1, 2], [1, 3], [-1, 1], [0, 3]] : [[0, 1], [0, 1], [0, 2], [1, 2]];
      const [x1, x2] = wahl(paare);
      const u1 = gi.w(x1), u2 = gi.w(x2);
      if (u1 === u2) continue;
      if (art === "exp" && Math.max(Math.abs(u1), Math.abs(u2)) > 5) continue;
      if (art === "kehr" && u1 * u2 <= 0) continue;
      if (art === "wurzel" && Math.min(u1, u2) < 0) continue;
      if (art === "pot" && Math.max(Math.abs(u1), Math.abs(u2)) ** (m + 1) > 4000) continue;
      const V = bw(k) * (a.F(u2) - a.F(u1));
      if (!isFinite(V) || Math.abs(V) < 0.02 || Math.abs(V) > 3000) continue;
      Object.assign(t, { x1, x2, u1, u2, V, geschichte: art + n + "d" });
      t.altV = bw(k) * (a.F(x2) - a.F(x1));            // alte Grenzen in u eingesetzt
    }
    return t;
  }
  throw new Error("Keine Aufgabe gefunden");
}
/* Für den sokratischen Trainer: nur Zeichenketten und Zahlen */
function sokVon(t) {
  const { a, gi } = t;
  const s = { art: t.art, m: t.m, n: t.n, p: t.p, q: t.q, c: t.c, d: gi.d, k: t.k, K: t.K, Fk: a.Fk,
    hT: t.hT, gT: gi.tex, dT: gi.dTex, ganzT: a.tex(gi.tex),
    duF: t.n > 1 ? (t.p === 1 ? "" : String(t.p)) + xPot(t.n - 1) : "", uT: t.uT, FuT: t.FuT, bareU: a.bare("u"), bareG: a.bare(gi.tex), ergT: t.ergT,
    ablU: a.abl ? a.abl("u") : "", grund: a.grund,
    hG: t.hG, FG: t.FG, fG: t.fG, xPow: xPot(t.n - 1) };
  const xs = t.x1 !== undefined ? [Math.min(t.x1, t.u1, t.u2, 0), Math.max(t.x2, t.u1, t.u2)] : [-2.5, 2.5];
  if (t.x1 !== undefined) Object.assign(s, { x1: t.x1, x2: t.x2, u1: t.u1, u2: t.u2, V: t.V, altV: t.altV });
  /* Ausschnitt aus Stichproben: Integrand (und äußere Funktion bzw. Stammfunktion) */
  const proben = [];
  const probe = (f, von, bis) => { for (let i = 0; i <= 200; i++) { const y = f(von + (bis - von) * i / 200); if (isFinite(y)) proben.push(y); } };
  if (t.x1 !== undefined) {          // nur dort, wo die Flächen liegen
    probe(t.h, t.x1, t.x2);
    probe((u) => bw(t.k) * a.f(u), Math.min(t.u1, t.u2), Math.max(t.u1, t.u2));
  } else {
    probe(t.h, xs[0], xs[1]);
    probe((x) => bw(t.K) * (a.F(gi.w(x)) / bw(a.Fk)), xs[0], xs[1]);
  }
  proben.sort((u, w) => u - w);
  const rand = t.x1 !== undefined ? 0 : 0.03;
  let lo = Math.min(0, proben[Math.floor((proben.length - 1) * rand)] ?? -1), hi = Math.max(0, proben[Math.ceil((proben.length - 1) * (1 - rand))] ?? 1);
  if (hi - lo < 1) hi = lo + 1;
  s.sicht = [xs[0] - 0.4, xs[1] + 0.4, lo - (hi - lo) * 0.12, hi + (hi - lo) * 0.12];
  return s;
}

/* ---------- Bilder ---------- */
let grNr = 0;
function stufe(spanne) { const r = spanne / 6, e = 10 ** Math.floor(Math.log10(r)); return [1, 2, 2.5, 5, 10].map((f) => f * e).find((s) => s >= r); }
/* o = {xmin,xmax,ymin,ymax, xname, kurven:[{f, farbe:"a"|"b", von, bis, flaeche:[a,b], text, legende}]} */
function graph(o) {
  const W = 340, H = 224, L = 36, R = 12, Tp = 12, B = 26, id = "gk" + ++grNr;
  const { xmin, xmax, ymin, ymax } = o;
  const sx = (x) => L + (x - xmin) / (xmax - xmin) * (W - L - R);
  const sy = (y) => Tp + (ymax - y) / (ymax - ymin) * (H - Tp - B);
  const r = (z) => Math.round(z * 10) / 10;
  let s = `<svg class="gr" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.label || "Graph"}"><defs><clipPath id="${id}"><rect x="${L}" y="${Tp}" width="${W - L - R}" height="${H - Tp - B}"/></clipPath></defs>`;
  const dx = o.dx || stufe(xmax - xmin), dy = o.dy || stufe(ymax - ymin);
  const y0 = ymin <= 0 && ymax >= 0 ? 0 : ymin, x0 = xmin <= 0 && xmax >= 0 ? 0 : xmin;
  for (let x = Math.ceil(xmin / dx) * dx; x <= xmax + 1e-9; x += dx) {
    s += `<line class="git" x1="${r(sx(x))}" y1="${Tp}" x2="${r(sx(x))}" y2="${H - B}"/>`;
    if (Math.abs(x) > 1e-9) s += `<text x="${r(sx(x))}" y="${r(sy(y0) + 14)}" text-anchor="middle">${kz(x, 2)}</text>`;
  }
  for (let y = Math.ceil(ymin / dy) * dy; y <= ymax + 1e-9; y += dy) {
    s += `<line class="git" x1="${L}" y1="${r(sy(y))}" x2="${W - R}" y2="${r(sy(y))}"/>`;
    if (Math.abs(y) > 1e-9) s += `<text x="${r(sx(x0) - 5)}" y="${r(sy(y) + 4)}" text-anchor="end">${kz(y, 2)}</text>`;
  }
  s += `<line class="ach" x1="${L}" y1="${r(sy(y0))}" x2="${W - R}" y2="${r(sy(y0))}"/><line class="ach" x1="${r(sx(x0))}" y1="${Tp}" x2="${r(sx(x0))}" y2="${H - B}"/>`;
  s += `<text x="${W - R - 2}" y="${r(sy(y0) - 6)}" text-anchor="end" class="an">${o.xname || "x"}</text>`;
  s += `<g clip-path="url(#${id})">`;
  for (const k of o.kurven) if (k.flaeche) {
    const [a, b] = k.flaeche, N = 80;
    let d = `M${r(sx(a))},${r(sy(0))}`;
    for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N, y = k.f(x); d += `L${r(sx(x))},${r(sy(Math.max(ymin - 1, Math.min(ymax + 1, y))))}`; }
    s += `<path class="fa-${k.farbe}" d="${d}L${r(sx(b))},${r(sy(0))}Z"/>`;
  }
  for (const k of o.kurven) {
    const a = Math.max(xmin, k.von ?? xmin), b = Math.min(xmax, k.bis ?? xmax), N = 240;
    let d = "", auf = false;
    for (let i = 0; i <= N; i++) {
      const x = a + (b - a) * i / N, y = k.f(x);
      if (!isFinite(y) || Math.abs(y) > 1e4) { auf = false; continue; }
      d += `${auf ? "L" : "M"}${r(sx(x))},${r(sy(Math.max(ymin - 5, Math.min(ymax + 5, y))))}`; auf = true;
    }
    s += `<path class="ku-${k.farbe}" d="${d}"/>`;
  }
  s += `</g>`;
  for (const k of o.kurven) if (k.flaeche && k.text) {
    const xm = (k.flaeche[0] + k.flaeche[1]) / 2;
    s += `<text class="ft" x="${r(sx(xm))}" y="${r(sy(k.f(xm) / 2) + 4)}" text-anchor="middle">${k.text}</text>`;
  }
  let ly = Tp + 14;
  for (const k of o.kurven) if (k.legende) { s += `<text class="lt-${k.farbe}" x="${W - R - 4}" y="${ly}" text-anchor="end">${k.legende}</text>`; ly += 15; }
  return s + `</svg>`;
}
const formelBild = (tex, unter) => `<div class="fbild">${MD(tex)}${unter ? `<div class="klein leise">${unter}</div>` : ""}</div>`;
/* Rechenweg, der Zeile für Zeile wächst; die neueste Zeile ist markiert */
function rechenweg(zeilen, bis) {
  return `<div class="rweg">${zeilen.slice(0, bis + 1).map((z, i) => `<div class="rz${i === bis ? " neu" : ""}"><span class="rnr">${z[0]}</span><span>${M(z[1])}</span></div>`).join("")}</div>`;
}
/* Bild zu einer Aufgabe mit Grenzen: Fläche unter dem Integranden */
function flaechenBild(t, mitU) {
  const xs = mitU ? [Math.min(t.x1, t.u1, t.u2, 0), Math.max(t.x2, t.u1, t.u2)] : [Math.min(t.x1, 0), t.x2];
  const ys = [0];
  for (let i = 0; i <= 120; i++) {
    const x = xs[0] + (xs[1] - xs[0]) * i / 120;
    for (const y of [t.h(x), mitU ? bw(t.k) * t.a.f(x) : NaN]) if (isFinite(y)) ys.push(y);
  }
  ys.sort((a, b) => a - b);
  const lo = Math.min(0, ys[Math.floor(ys.length * 0.02)]), hi = Math.max(0, ys[Math.floor(ys.length * 0.98)]) || 1;
  const kurven = [{ f: t.h, farbe: "a", flaeche: [t.x1, t.x2], legende: "Integrand über dem x-Intervall" }];
  if (mitU) kurven.push({ f: (x) => bw(t.k) * t.a.f(x), farbe: "b", flaeche: [Math.min(t.u1, t.u2), Math.max(t.u1, t.u2)], legende: "k · f(u) über dem u-Intervall" });
  return graph({ xmin: xs[0] - 0.3, xmax: xs[1] + 0.3, ymin: lo - (hi - lo) * 0.1, ymax: hi + (hi - lo) * 0.15, kurven, label: "Fläche unter dem Integranden" });
}

/* Auswahl als Knöpfe (Formeln sind erlaubt). opts: [{t, ok?, w}] */
function knopfWahl(label, opts) {
  const o = misch(opts);
  return { label, optionen: o.map((x) => x.t), richtig: o.findIndex((x) => x.ok), falsch: (i) => o[i].w || "" };
}
/* Verschiedene Optionen: gleiche Formeln nur einmal */
function eindeutig(opts) { const ges = new Set(); return opts.filter((x) => (ges.has(x.t) ? false : ges.add(x.t))); }

/* Fallen für den Faktor vor der Stammfunktion */
function faktorFallen(t) {
  const { a, gi, k, K, c } = t;
  return [
    { wert: bw(bmal([c, 1], a.Fk)), text: `Du hast nicht durch die innere Ableitung geteilt. Aus ${M(T`dx = \frac{du}{${gi.dTex}}`)} kommt der Faktor ${M(T`\frac{1}{${gi.d}}`)}.` },
    { wert: bw(bmal([c * gi.d, 1], a.Fk)), text: `Du hast mit der inneren Ableitung ${M(String(gi.d))} multipliziert. Beim Integrieren wird durch sie geteilt.` },
    ...(bgleich(a.Fk, [1, 1]) ? [] : [{ wert: bw(k), text: a.fehlt || "Der Faktor aus dem Grundintegral fehlt." }]),
    { wert: -bw(K), text: "Prüfe das Vorzeichen." },
  ];
}

/* ---------- 0 · Vorher: die Kettenregel ---------- */
/* Text mit $…$ → KaTeX (dieselben Hinweise dienen dem Trainer und dem Sokrates-Gespräch) */
const mt = (s) => s.replace(/\$([^$]+)\$/g, (_, x) => M(x));
/* Ableitung von f(g(x)) als C · x^e · Stück(G); bei kehr und wurzel als Bruch */
function ablTex(C, e, art, m, G) {
  if (art === "kehr" || art === "wurzel") {
    const num = vorTex([Math.abs(C[0]), 1], e) || "1";
    const den = (C[1] === 1 ? "" : C[1]) + (art === "kehr" ? `${klam(G)}^{2}` : T`\sqrt{${G}}`);
    return (C[0] < 0 ? "-" : "") + T`\frac{${num}}{${den}}`;
  }
  const P = { pot: m - 1 === 1 ? klam(G) : `${klam(G)}^{${m - 1}}`, exp: `e^{${G}}`, sin: T`\cos(${G})`, cos: T`\sin(${G})` }[art];
  return mitVor(vorTex(C, e), P);
}
const mitVor = (v, P) => (v === "" ? P : v === "-" ? "-" + P : `${v}\\,${P}`);
const ABL_U = { pot: (m) => (m - 1 === 1 ? `${m}u` : `${m}u^{${m - 1}}`), exp: () => "e^{u}", sin: () => T`\cos(u)`, cos: () => T`-\sin(u)`,
  kehr: () => T`-\frac{1}{u^{2}}`, wurzel: () => T`\frac{1}{2\sqrt{u}}` };
function kette() {
  for (let v = 0; v < 400; v++) {
    const n = wahl([1, 1, 2, 2, 3]);
    const p = n === 1 ? wahl([2, 3, 4, 5, -2, -3]) : wahl([1, 1, 2, 3, -1]);
    const q = n === 1 ? wahl([1, 2, 3, 5, -1, -2, -4, 7]) : wahl([0, 1, 2, 3, 4, 5, -1, -2]);
    const art = wahl(["pot", "pot", "pot", "exp", "sin", "cos", "kehr", "wurzel"]);
    if ((art === "pot" || art === "kehr" || art === "wurzel") && q === 0) continue;
    if (art === "wurzel" && (q < 0 || p < 0)) continue;
    const m = art === "pot" ? wahl(n === 1 ? [2, 3, 4, 5] : [2, 3, 4]) : 0;
    const a = art === "pot" ? AUSSEN.pot(m) : AUSSEN[art]();
    const gi = innen(p, n, q), d = gi.d, e = n - 1;
    const C = { pot: [m * d, 1], exp: [d, 1], sin: [d, 1], cos: [-d, 1], kehr: [-d, 1], wurzel: Bruch(d, 2) }[art];
    const P = { pot: (u) => u ** (m - 1), exp: Math.exp, sin: Math.cos, cos: Math.sin, kehr: (u) => 1 / (u * u), wurzel: (u) => 1 / Math.sqrt(u) }[art];
    const Pg = { pot: (g) => `(${g})^${m - 1}`, exp: (g) => `exp(${g})`, sin: (g) => `cos(${g})`, cos: (g) => `sin(${g})`, kehr: (g) => `1/(${g})^2`, wurzel: (g) => `1/sqrt(${g})` }[art];
    const h = (x) => a.f(gi.w(x));
    const hp = (x) => bw(C) * x ** e * P(gi.w(x));
    const t = { n, p, q, m, art, a, gi, C, e, h, hp, geschichte: "k" + art + n };
    t.hT = a.tex(gi.tex); t.hTf = a.tex(IN(gi.tex));
    t.hpT = ablTex(C, e, art, m, gi.tex);
    t.aussenAblT = ABL_U[art](m);
    /* falsche Ableitungen mit Begründung ($…$ ist TeX) */
    const ohne = bdurch(C, [d, 1]);
    t.falsch = [
      { tex: ablTex(ohne, 0, art, m, gi.tex), grund: `Die innere Ableitung fehlt. Nach der äußeren Ableitung kommt noch der Faktor $g'(x) = ${gi.dTex}$.` },
    ];
    if (art === "exp") t.falsch.push({ tex: `${klam(gi.tex)}\\,e^{${gi.tex}-1}`, grund: "Die Potenzregel gilt nicht, wenn x im Exponenten steht. $e^{u}$ ist seine eigene Ableitung." });
    else t.falsch.push({ tex: mitVor(vorTex([d, 1], e), a.tex(gi.tex)), grund: `Hier wurde nur das Innere abgeleitet. Auch die äußere Funktion $${a.tex("u")}$ muss abgeleitet werden.` });
    if (n > 1) t.falsch.push({ tex: ablTex(ohne, 0, art, m, gi.dTex), grund: `In der äußeren Ableitung bleibt das Innere unverändert stehen: Dort gehört $${gi.tex}$ hin, nicht seine Ableitung.` });
    if (art === "sin") t.falsch.push({ tex: ablTex(bmal(C, [-1, 1]), e, art, m, gi.tex), grund: "Die Ableitung von $\\sin$ ist $\\cos$, ohne Minus." });
    if (art === "cos") t.falsch.push({ tex: ablTex(bmal(C, [-1, 1]), e, art, m, gi.tex), grund: "Die Ableitung von $\\cos$ ist $-\\sin$: Das Minus fehlt." });
    if (art === "kehr") t.falsch.push({ tex: ablTex(bmal(C, [-1, 1]), e, art, m, gi.tex), grund: "$\\bigl(\\frac{1}{u}\\bigr)' = -\\frac{1}{u^{2}}$: Achte auf das Minus." });
    if (art === "pot") t.falsch.push({ tex: mitVor(vorTex(C, e), `${klam(gi.tex)}^{${m}}`), grund: "Beim Ableiten sinkt der Exponent um 1." });
    if (art === "wurzel") t.falsch.push({ tex: ablTex([d, 1], e, art, m, gi.tex), grund: "$(\\sqrt{u})' = \\frac{1}{2\\sqrt{u}}$: Die 2 im Nenner fehlt." });
    /* Stelle für die Steigung */
    const stellen = misch([1, -1, 2, 0, 0.5]).filter((x0) => isFinite(h(x0)) && isFinite(hp(x0)) && Math.abs(hp(x0)) > 0.05 && Math.abs(hp(x0)) < 60);
    if (!stellen.length) continue;
    t.x0 = stellen[0]; t.y0 = h(t.x0); t.m0 = hp(t.x0);
    t.hG = a.ggb(gi.ggb); t.hpG = `${ggbZahl(C)}*x^${e}*${Pg(gi.ggb)}`;
    return t;
  }
  throw new Error("Keine Kettenaufgabe gefunden");
}
function sokKette(t) {
  const proben = [];
  for (const f of [t.h, t.hp]) for (let i = 0; i <= 200; i++) { const y = f(-2.5 + 5 * i / 200); if (isFinite(y)) proben.push(y); }
  proben.sort((u, w) => u - w);
  let lo = Math.min(0, proben[Math.floor((proben.length - 1) * 0.05)] ?? -1), hi = Math.max(0, proben[Math.ceil((proben.length - 1) * 0.95)] ?? 1);
  lo = Math.min(lo, t.y0 - 1); hi = Math.max(hi, t.y0 + 1);
  if (hi - lo < 2) hi = lo + 2;
  return { kette: true, art: t.art, n: t.n, p: t.p, hT: t.hT, gT: t.gi.tex, dT: t.gi.dTex, aussenT: t.a.tex("u"), aussenAblT: t.aussenAblT,
    hpT: t.hpT, falsch: t.falsch, hG: t.hG, hpG: t.hpG, x0: t.x0, y0: t.y0, m0: t.m0,
    duF: (t.p === 1 ? "" : t.p === -1 ? "-" : String(t.p)) + xPot(t.n - 1),
    sicht: [-2.9, 2.9, lo - (hi - lo) * 0.1, hi + (hi - lo) * 0.1] };
}
const sinVergleich = () => graph({ xmin: -0.1, xmax: 3.3, ymin: -1.25, ymax: 1.95, dx: 0.5, dy: 0.5, kurven: [
  { f: Math.sin, farbe: "a", legende: "y = sin(x)" }, { f: (x) => Math.sin(3 * x), farbe: "b", legende: "y = sin(3x)" },
  { f: (x) => x, farbe: "a", von: 0, bis: 0.9 }, { f: (x) => 3 * x, farbe: "b", von: 0, bis: 0.33 }], label: "sin(x) und sin(3x) mit Tangenten im Nullpunkt" });
const KETTE = [
  ["①", T`\text{außen: } f(u) = u^{3},\quad f'(u) = 3u^{2}`],
  ["②", T`\text{Inneres einsetzen: } 3(${IN("x^2+1")})^{2}`],
  ["③", T`\text{innen: } g(x) = ${IN("x^2+1")},\quad g'(x) = ${AB("2x")}`],
  ["④", T`h'(x) = 3(${IN("x^2+1")})^{2}\cdot ${AB("2x")} = 6x\,(x^2+1)^{2}`],
];
STATIONEN.push({
  id: "s-kette", titel: "Vorher: Die Kettenregel", ziel: 3,
  vor: [
    { t: `Die Substitution ist die Kettenregel rückwärts. Darum zuerst die Kettenregel selbst. Sie gilt für <b>verkettete</b> Funktionen: Zwei Funktionen werden nacheinander ausgeführt. Bei ${M(T`h(x) = (x^2+1)^3`)} rechnest du für ${M("x = 2")} zuerst ${M("2^2 + 1 = 5")} und dann ${M("5^3 = 125")}.`,
      v: () => formelBild(T`x \;\xrightarrow{\;g\;}\; ${IN("x^2+1")} \;\xrightarrow{\;f\;}\; (${IN("x^2+1")})^{3}`, "zuerst die innere Funktion g (blau), dann die äußere f(u) = u³"),
      f: { q: `Was ist bei ${M(T`h(x) = \sin(x^2)`)} die innere Funktion?`, o: [
        { t: M("x^2"), ok: true, w: `Genau: Zuerst wird quadriert, dann kommt der Sinus. Die äußere Funktion ist ${M(T`f(u) = \sin(u)`)}.` },
        { t: M(T`\sin(x)`), w: `Der Sinus kommt zuletzt, er ist außen. Was steht in seiner Klammer?` },
        { t: M(T`\sin(x^2)`), w: "Das ist die ganze Verkettung h. Gesucht ist der Teil, der zuerst gerechnet wird." }] } },
    { t: `Warum reicht es nicht, nur außen abzuleiten? Vergleiche ${M(T`\sin(x)`)} und ${M(T`\sin(3x)`)}. Die zweite Kurve durchläuft dieselben Werte, aber dreimal so schnell, denn das Innere ${M("3x")} wächst dreimal so schnell wie x. Darum ist sie überall dreimal so steil.`,
      v: sinVergleich,
      f: { q: `Nur außen abgeleitet hieße ${M(T`\bigl(\sin(3x)\bigr)' = \cos(3x)`)}. Im Nullpunkt wäre die Steigung dann ${M(T`\cos(0) = 1`)}. Was zeigt das Bild?`, o: [
        { t: "Die Steigung ist 3: Es fehlt der Faktor 3", ok: true, w: `Genau. Die 3 ist die Ableitung des Inneren ${M("3x")}. Sie kommt als Faktor dazu.` },
        { t: "Die Steigung ist 1, das passt", w: "Schau auf die türkise Tangente: Sie steigt auf einem Drittel Weg schon um 1. Ihre Steigung ist 3." },
        { t: `Die Steigung ist ${M(T`\tfrac{1}{3}`)}`, w: "sin(3x) ist steiler als sin(x), nicht flacher." }] } },
    { t: `Das ist die <b>Kettenregel</b>: ${M(T`\bigl(f(${IN("g(x)")})\bigr)' = f'(${IN("g(x)")})\cdot ${AB("g'(x)")}`)}. In Worten: die äußere Funktion ableiten und das Innere dabei unverändert stehen lassen, dann mit der inneren Ableitung malnehmen.`,
      v: () => formelBild(T`\bigl(f(${IN("g(x)")})\bigr)' = f'(${IN("g(x)")})\cdot ${AB("g'(x)")}`, "äußere Ableitung · innere Ableitung"),
      f: { q: `Was ist ${M(T`\bigl(\sin(3x)\bigr)'`)}?`, o: [
        { t: M(T`\cos(3x)\cdot 3`), ok: true, w: "Genau: außen cos, das Innere 3x bleibt stehen, mal 3." },
        { t: M(T`\cos(3x)`), w: "Die innere Ableitung 3 fehlt. Das Bild hat gezeigt: Die Kurve ist dreimal so steil." },
        { t: M(T`\cos(3)`), w: "In der äußeren Ableitung bleibt das Innere unverändert stehen. Aus 3x wird dort nicht 3." },
        { t: M(T`3\cos(x)`), w: "Das Innere 3x muss im Kosinus stehen bleiben." }] } },
    { t: `Ein ganzes Beispiel: ${M(T`h(x) = (x^2+1)^3`)}. Erst außen ableiten und das Innere wieder einsetzen, dann die innere Ableitung bestimmen und malnehmen.`,
      v: () => rechenweg(KETTE, 3),
      f: { q: `Welche Ableitung hat ${M(T`(2x-5)^4`)}?`, o: [
        { t: M(T`8\,(2x-5)^{3}`), ok: true, w: `Genau: ${M(T`4(2x-5)^3\cdot 2`)}.` },
        { t: M(T`4\,(2x-5)^{3}`), w: "Die innere Ableitung 2 fehlt." },
        { t: M(T`4\cdot 2^{3}`), w: "In der äußeren Ableitung bleibt das Innere 2x − 5 unverändert stehen." },
        { t: M(T`8x\,(2x-5)^{3}`), w: "Die Ableitung von 2x − 5 ist 2, ohne x." }] } },
    { t: `Bei der e-Funktion ist es besonders einfach, denn ${M(T`(e^u)' = e^u`)}. Außen bleibt also alles stehen, nur die innere Ableitung kommt dazu: ${M(T`\bigl(e^{${IN("x^2")}}\bigr)' = e^{${IN("x^2")}}\cdot ${AB("2x")}`)}.`,
      v: () => formelBild(T`\bigl(e^{${IN("x^2")}}\bigr)' = e^{${IN("x^2")}}\cdot ${AB("2x")}`),
      f: { q: `Was ist ${M(T`\bigl(e^{-3x}\bigr)'`)}?`, o: [
        { t: M(T`-3\,e^{-3x}`), ok: true, w: "Genau: e^(−3x) bleibt stehen, mal die innere Ableitung −3." },
        { t: M(T`e^{-3x}`), w: "Die innere Ableitung −3 fehlt." },
        { t: M(T`-3x\,e^{-3x-1}`), w: "Die Potenzregel gilt nicht, wenn x im Exponenten steht." },
        { t: M(T`e^{-3}`), w: "Das Innere −3x bleibt im Exponenten stehen." }] } },
    { t: `Bei Sinus und Kosinus kommt das Vorzeichen dazu: ${M(T`(\sin u)' = \cos u`)} und ${M(T`(\cos u)' = -\sin u`)}. Zum Beispiel ${M(T`\bigl(\cos(${IN("x^2")})\bigr)' = -\sin(${IN("x^2")})\cdot ${AB("2x")} = -2x\sin(x^2)`)}.`,
      v: () => formelBild(T`\bigl(\cos(${IN("x^2")})\bigr)' = -\sin(${IN("x^2")})\cdot ${AB("2x")}`),
      f: { q: `Was ist ${M(T`\bigl(\cos(4x+1)\bigr)'`)}?`, o: [
        { t: M(T`-4\sin(4x+1)`), ok: true, w: "Genau: −sin außen, das Innere bleibt, mal 4." },
        { t: M(T`4\sin(4x+1)`), w: "Die Ableitung von cos ist −sin. Das Minus fehlt." },
        { t: M(T`-\sin(4x+1)`), w: "Die innere Ableitung 4 fehlt." },
        { t: M(T`-\sin(4)`), w: "Das Innere 4x + 1 bleibt in der äußeren Ableitung unverändert stehen." }] } },
    { t: `Und jetzt rückwärts gelesen: Weil ${M(T`\bigl(\sin(${IN("x^2")})\bigr)' = \cos(${IN("x^2")})\cdot ${AB("2x")}`)}, ist ${M(T`\int \cos(${IN("x^2")})\cdot ${AB("2x")}\,dx = \sin(x^2) + C`)}. Wer die Kettenregel kennt, erkennt ihre <b>Spur</b> im Integral: eine Verkettung und daneben die Ableitung ihres Inneren. Darum geht es ab der nächsten Station.`,
      v: () => formelBild(T`\int \cos(${IN("x^2")})\cdot ${AB("2x")}\,dx = \sin(x^2) + C`, "die Kettenregel, rückwärts gelesen"),
      f: { q: "In welchem Integral steckt die Spur der Kettenregel?", o: [
        { t: M(T`\int 2x\,e^{x^2}\,dx`), ok: true, w: `Genau: ${M(T`e^{x^2}`)} ist verkettet, und ${M("2x")} ist die Ableitung des Inneren. Also ${M(T`\int 2x\,e^{x^2}\,dx = e^{x^2} + C`)}.` },
        { t: M(T`\int e^{x^2}\,dx`), w: "Verkettet ist es, aber die Ableitung des Inneren fehlt daneben." },
        { t: M(T`\int x^2\,e^{x}\,dx`), w: `Hier ist nichts ineinander gesteckt: ${M("x^2")} und ${M("e^x")} werden nur malgenommen.` }] } },
  ],
  merke: `${M(T`\bigl(f(g(x))\bigr)' = f'(g(x))\cdot g'(x)`)}: die äußere Funktion ableiten, das Innere dabei unverändert stehen lassen, mit der inneren Ableitung malnehmen.`,
  stolper: `Die innere Ableitung vergessen. Und das Innere in der äußeren Ableitung verändern: ${M(T`\bigl(\sin(3x)\bigr)' = 3\cos(3x)`)}, nicht ${M(T`\cos(3)`)}.`,
  neu() {
    const t = kette();
    const { gi, a } = t;
    const tipps = [`Innen steht ${M(T`g(x) = ${IN(gi.tex)}`)}, außen ${M(T`f(u) = ${a.tex("u")}`)}.`,
      `Äußere Ableitung ${M(T`f'(u) = ${t.aussenAblT}`)}, innere Ableitung ${M(T`g'(x) = ${AB(gi.dTex)}`)}. Setze das Innere für u ein und nimm mal.`];
    const loesung = `${M(T`h'(x) = ${ablTex(bdurch(t.C, [gi.d, 1]), 0, t.art, t.m, IN(gi.tex))}\cdot ${AB(gi.dTex)} = ${t.hpT}`)}`;
    const sok = sokKette(t);
    if (Math.random() < 0.4 && (t.art === "pot" || t.art === "kehr") && Number.isInteger(t.x0)) {
      const wert = t.m0;
      const fallen = [
        { wert: bw(bdurch(t.C, [gi.d, 1])) * (t.art === "pot" ? gi.w(t.x0) ** (t.m - 1) : 1 / gi.w(t.x0) ** 2), text: `Die innere Ableitung fehlt. Es kommt noch der Faktor ${M(T`g'(${t.x0})`)} dazu.` },
        { wert: gi.d * t.x0 ** t.e * t.h(t.x0), text: "Die äußere Funktion wurde nicht abgeleitet." },
        { wert: -wert, text: "Prüfe das Vorzeichen." },
      ].filter((f) => isFinite(f.wert) && Math.abs(f.wert - wert) > 0.002);
      return {
        html: `<p>Wie steil ist der Graph von</p>${MD(`h(x) = ${t.hT}`)}<p>an der Stelle ${M(`x = ${t.x0}`)}? Berechne ${M(`h'(${t.x0})`)}.</p>`,
        geschichte: t.geschichte + "w", sok,
        felder: [{ id: "m0", label: `${M(`h'(${t.x0})`)} (Bruch erlaubt)`, wert, tol: 0.0011, art: "z", fallen }],
        tipps: [...tipps, `${M(T`h'(x) = ${t.hpT}`)}. Setze ${M(`x = ${t.x0}`)} ein.`],
        loesung: `${loesung}, also ${M(T`h'(${t.x0}) = ${kzT(wert, 4)}`)}.`,
      };
    }
    const opts = eindeutig([{ t: M(t.hpT), ok: true }, ...misch(t.falsch).map((f) => ({ t: M(f.tex), w: mt(f.grund) }))]).slice(0, 4);
    return {
      html: `<p>Leite ab.</p>${MD(`h(x) = ${t.hT}`)}`,
      geschichte: t.geschichte, sok, felder: [],
      auswahl: knopfWahl("h′(x) = …", opts),
      tipps, loesung,
    };
  },
});

/* ---------- 1 · Die Idee ---------- */
STATIONEN.push({
  id: "s-idee", titel: "Die Idee: Kettenregel rückwärts", ziel: 3,
  vor: [
    { t: `Manche Integrale passen zu keiner Grundregel, zum Beispiel ${M(T`\int 2x\cdot\cos(x^2)\,dx`)}. Ableiten kannst du aber fast alles. Die Idee: Wir lesen eine Ableitung <b>rückwärts</b>.`,
      v: () => graph({ xmin: -0.2, xmax: 2.4, ymin: -4.6, ymax: 3.2, kurven: [{ f: (x) => 2 * x * Math.cos(x * x), farbe: "a", legende: "y = 2x · cos(x²)" }] }),
      f: { q: `Welche Regel brauchst du, um ${M(T`\sin(x^2)`)} abzuleiten?`, o: [
        { t: "die Kettenregel", ok: true, w: "Genau: äußere Ableitung mal innere Ableitung." },
        { t: "die Produktregel", w: `${M(T`\sin(x^2)`)} ist kein Produkt, sondern eine Verkettung: ${M(T`\sin`)} von ${M("x^2")}.` },
        { t: "die Potenzregel", w: `Die Potenzregel allein reicht nicht, denn ${M("x^2")} steckt im Sinus.` }] } },
    { t: `Die Kettenregel liefert ${M(T`\bigl(\sin(${IN("x^2")})\bigr)' = \cos(${IN("x^2")})\cdot ${AB("2x")}`)}. Außen steht ${M(T`\sin`)}, innen ${M(IN("x^2"))}, und als Faktor erscheint die innere Ableitung ${M(AB("2x"))}.`,
      v: () => formelBild(T`\bigl(\sin(${IN("x^2")})\bigr)' = \cos(${IN("x^2")})\cdot ${AB("2x")}`, "blau: das Innere, türkis: seine Ableitung"),
      f: { q: `Was folgt daraus für ${M(T`\int 2x\cdot\cos(x^2)\,dx`)}?`, o: [
        { t: M(T`\sin(x^2) + C`), ok: true, w: "Denn die Ableitung von sin(x²) ist genau der Integrand." },
        { t: M(T`\cos(x^2)\cdot x^2 + C`), w: `Leite zur Probe ab. Mit der Produktregel entsteht etwas ganz anderes als ${M(T`2x\cos(x^2)`)}.` },
        { t: M(T`x^2\sin(x^2) + C`), w: "Leite zur Probe ab: Das gibt zwei Summanden. Der Integrand hat nur einen." }] } },
    { t: `Das ist das <b>Muster</b>: Steht im Integral eine Verkettung ${M(T`f(${IN("g(x)")})`)} und daneben die innere Ableitung ${M(AB("g'(x)"))}, dann ist ${M(T`\int f(${IN("g(x)")})\cdot ${AB("g'(x)")}\,dx = F(g(x)) + C`)}. Dabei ist F eine Stammfunktion von f.`,
      v: () => formelBild(T`\int f(${IN("g(x)")})\cdot ${AB("g'(x)")}\,dx = F(g(x)) + C`, "F ist eine Stammfunktion von f"),
      f: { q: `Bei ${M(T`\int 3x^2\, e^{x^3}\,dx`)}: Was ist innen, was ist die innere Ableitung?`, o: [
        { t: `innen ${M("x^3")}, Ableitung ${M("3x^2")}`, ok: true, w: `Genau. Darum ist ${M(T`\int 3x^2 e^{x^3}\,dx = e^{x^3} + C`)}.` },
        { t: `innen ${M("3x^2")}, Ableitung ${M("6x")}`, w: `${M("3x^2")} steht als Faktor davor, nicht in der e-Funktion. Innen ist, was im Exponenten steckt.` },
        { t: `innen ${M("e")}, Ableitung ${M("0")}`, w: "e ist eine feste Zahl. Verkettet ist die e-Funktion mit dem Exponenten." }] } },
    { t: `Die Probe ist immer erlaubt und immer sicher: ${M(T`\bigl(e^{x^3}\bigr)' = e^{x^3}\cdot 3x^2`)}. Das ist der Integrand. Wer eine Stammfunktion gefunden hat, leitet sie zur Kontrolle ab.`,
      v: () => formelBild(T`\bigl(e^{x^3}\bigr)' = e^{x^3}\cdot 3x^2 \;\checkmark`) },
    { t: `Was, wenn der Zahlenfaktor nicht stimmt? Bei ${M(T`\int x\cdot e^{x^2}\,dx`)} wäre die innere Ableitung ${M("2x")}, da steht nur ${M("x")}. Ein Zahlenfaktor lässt sich ausgleichen: ${M(T`x = \tfrac{1}{2}\cdot 2x`)}.`,
      v: () => formelBild(T`\int x\, e^{x^2}\,dx = \frac{1}{2}\int 2x\, e^{x^2}\,dx`),
      f: { q: `Welche Stammfunktion hat ${M(T`x\cdot e^{x^2}`)}?`, o: [
        { t: M(T`\tfrac{1}{2}\, e^{x^2}`), ok: true, w: `Probe: ${M(T`\bigl(\tfrac{1}{2}e^{x^2}\bigr)' = \tfrac{1}{2}\, e^{x^2}\cdot 2x = x\, e^{x^2}`)}.` },
        { t: M(T`e^{x^2}`), w: `Ableiten gibt ${M(T`2x\, e^{x^2}`)}, doppelt so viel wie gewünscht.` },
        { t: M(T`2\, e^{x^2}`), w: `Ableiten gibt ${M(T`4x\, e^{x^2}`)}: Du hast mit 2 multipliziert statt durch 2 geteilt.` },
        { t: M(T`\frac{e^{x^2}}{2x}`), w: "Durch einen Term mit x darf man so nicht teilen. Leite ab: Mit der Quotientenregel entsteht etwas anderes." }] } },
    { t: `Ein fehlender <b>Zahlenfaktor</b> lässt sich ausgleichen, ein fehlender <b>Term mit x</b> nicht. ${M(T`\int e^{x^2}\,dx`)} hat keine Stammfunktion, die man mit den üblichen Funktionen hinschreiben kann.`,
      v: () => formelBild(T`\int e^{x^2}\,dx = \;?`, "hier fehlt der Faktor x, keine Zahl"),
      f: { q: `Klappt der Trick bei ${M(T`\int x^2\cos(x^3)\,dx`)}?`, o: [
        { t: `Ja, mit dem Faktor ${M(T`\tfrac{1}{3}`)}`, ok: true, w: `Die innere Ableitung ist ${M("3x^2")}, da steht ${M("x^2")}: nur die Zahl 3 fehlt. Also ${M(T`\tfrac{1}{3}\sin(x^3) + C`)}.` },
        { t: "Nein, es fehlt ein Term mit x", w: `Die innere Ableitung ist ${M("3x^2")}. Das x² steht schon da, es fehlt nur die Zahl 3.` },
        { t: `Ja, mit dem Faktor ${M("3")}`, w: `${M("x^2")} ist ein Drittel von ${M("3x^2")}. Der Faktor ist also ein Drittel, nicht drei.` }] } },
  ],
  merke: `${M(T`\int f(g(x))\cdot g'(x)\,dx = F(g(x)) + C`)}. Fehlt nur ein Zahlenfaktor der inneren Ableitung, gleicht man ihn aus. Probe: ableiten.`,
  stolper: `Durch Terme mit x darf man nicht „ausgleichen“: ${M(T`\int e^{x^2}dx \neq \frac{e^{x^2}}{2x}`)}. Leite ab, dann siehst du es.`,
  neu() {
    const t = sub({ n: [2, 2, 3, 1] });
    const { a, gi, K, cB } = t;
    const opts = eindeutig([
      { t: M(`${koef(K)}${a.bare(gi.tex)}`), ok: true },
      { t: M(`${koef(bmal(K, [gi.d * gi.d, 1]))}${a.bare(gi.tex)}`), w: `Leite ab. Es entsteht das ${M(String(gi.d * gi.d))}-Fache des Integranden: Du hast mit der inneren Ableitung multipliziert, statt durch sie zu teilen.` },
      ...(bgleich(K, a.Fk) ? [] : [{ t: M(`${koef(a.Fk)}${a.bare(gi.tex)}`), w: `Leite ab: Die innere Ableitung ${M(gi.dTex)} kommt als Faktor dazu. Gleiche sie durch ${M(T`\frac{1}{${gi.d}}`)} aus.` }]),
      ...(a.abl ? [{ t: M(`${koef(t.k)}${a.abl(gi.tex)}`), w: "Hier wurde die äußere Funktion abgeleitet statt integriert." }] : []),
      { t: M(`${koef(bmal(K, [-1, 1]))}${a.bare(gi.tex)}`), w: "Leite ab und achte auf das Vorzeichen." },
    ]).slice(0, 4);
    return {
      html: `<p>Welche Funktion ist eine Stammfunktion von</p>${MD(`h(x) = ${t.hT}`)}`,
      geschichte: t.geschichte, sok: sokVon(t), felder: [],
      auswahl: knopfWahl("Eine Stammfunktion ist …", opts),
      tipps: [`Was steckt verkettet in der äußeren Funktion? Das Innere ist ${M(gi.tex)}, seine Ableitung ${M(gi.dTex)}.`,
        `Leite jede Auswahl mit der Kettenregel ab und vergleiche mit ${M(t.hT)}.`],
      loesung: `${M(T`\int ${t.hT}\,dx = ${t.ergT}`)}. Probe: Ableiten ergibt äußere Ableitung mal innere Ableitung ${M(gi.dTex)}, und der Faktor ${M(bTex(K))} gleicht die Zahl aus.`,
    };
  },
});

/* ---------- 2 · Inneres und Faktor erkennen ---------- */
STATIONEN.push({
  id: "s-erkennen", titel: "Das Innere und den Faktor erkennen", ziel: 3,
  vor: [
    { t: `Vor jeder Substitution steht ein genauer Blick auf den Integranden. Nimm ${M(T`\int x\,(x^2+3)^4\,dx`)}. Welcher Teil ist verkettet? Sein Inneres bekommt einen neuen Namen: <b>u</b>.`,
      v: () => formelBild(T`\int x\,(x^2+3)^4\,dx`),
      f: { q: "Was ist hier das Innere?", o: [
        { t: M("x^2+3"), ok: true, w: "Genau, es steckt in der vierten Potenz." },
        { t: M("(x^2+3)^4"), w: "Das ist die ganze Verkettung. Innen steht, was in der Klammer steckt." },
        { t: M("x"), w: "x ist der Faktor vor der Klammer. Gesucht ist das Innere der Verkettung." }] } },
    { t: `Wir setzen ${M(T`u = ${IN("x^2+3")}`)}. Die Ableitung ist ${M(T`\frac{du}{dx} = ${AB("2x")}`)}. Als Merkzeile: ${M(T`du = ${AB("2x")}\,dx`)}, also ${M(T`dx = \frac{du}{${AB("2x")}}`)}.`,
      v: () => formelBild(T`u = ${IN("x^2+3")}\qquad dx = \frac{du}{${AB("2x")}}`),
      f: { q: `Ersetze dx durch ${M(T`\frac{du}{2x}`)}. Was geschieht mit dem Faktor x vor der Klammer?`, o: [
        { t: `Er kürzt sich: ${M(T`x\cdot\frac{1}{2x} = \frac{1}{2}`)}`, ok: true, w: "Genau. Übrig bleibt nur eine Zahl." },
        { t: "Er bleibt stehen", w: `Rechne ${M(T`x\cdot\frac{du}{2x}`)}: Das x steht oben und unten.` },
        { t: `Er wird zu ${M("2x")}`, w: "Es wird geteilt, nicht multipliziert." }] } },
    { t: `${M(T`\int x\,(x^2+3)^4\,dx = \int x\cdot u^4\cdot\frac{du}{2x} = \frac{1}{2}\int u^4\,du`)}. Kein x mehr! Das ist das Zeichen, dass die Substitution gelingt.`,
      v: () => formelBild(T`\int x\,(x^2+3)^4\,dx = \frac{1}{2}\int u^4\,du`, "rechts steht nur noch u") },
    { t: `Die Zahl vor dem neuen Integral nennen wir <b>k</b>. Bei ${M(T`\int 6x^2\cos(x^3+1)\,dx`)} ist ${M(T`u' = 3x^2`)}, also ${M(T`6x^2 = 2\cdot 3x^2`)} und ${M("k = 2")}.`,
      v: () => formelBild(T`\int 6x^2\cos(x^3+1)\,dx = 2\int \cos(u)\,du`),
      f: { q: `Welches k gehört zu ${M(T`\int x^2\sqrt{x^3+5}\,dx`)}?`, o: [
        { t: M(T`k = \tfrac{1}{3}`), ok: true, w: `${M(T`u' = 3x^2`)}, und ${M("x^2")} ist ein Drittel davon.` },
        { t: M("k = 3"), w: `Umgekehrt: ${M("x^2")} ist ein Drittel von ${M("3x^2")}, nicht das Dreifache.` },
        { t: M("k = 1"), w: `Es fehlt die 3 aus ${M(T`u' = 3x^2`)}.` }] } },
  ],
  merke: `u ist das Innere der Verkettung. Mit ${M(T`dx = \frac{du}{u'(x)}`)} muss jedes x verschwinden; übrig bleibt ${M(T`k\int f(u)\,du`)}.`,
  stolper: `Nicht das Ganze ist u, sondern das Innere. Und k ist (Zahl vor dem x-Faktor) geteilt durch (Zahl in u'), nicht umgekehrt.`,
  neu() {
    const t = sub({ n: [2, 2, 3] });
    const { a, gi, k, c } = t;
    const opts = eindeutig([
      { t: M(`u = ${gi.tex}`), ok: true },
      { t: M(`u = ${a.tex(gi.tex)}`), w: "Das ist die ganze Verkettung. u ist das, was innen steckt." },
      { t: M(`u = ${c === 1 ? "" : c}${xPot(gi.n - 1)}`), w: "Das ist der Faktor davor. Er wird nachher von dx = du : u' aufgefressen." },
      { t: M(`u = ${gi.dTex}`), w: "Das ist die Ableitung des Inneren, nicht das Innere selbst." },
    ]);
    return {
      html: `<p>Bei welcher Substitution verschwindet jedes x? Und welche Zahl k bleibt dann stehen?</p>${MD(T`\int ${t.hT}\,dx = k\cdot\int ${t.uT}\,du`)}`,
      geschichte: t.geschichte, sok: sokVon(t),
      auswahl: knopfWahl("Die passende Substitution:", opts),
      felder: [{ id: "k", label: `Faktor ${M("k")} (Bruch erlaubt)`, wert: bw(k), tol: 0.0011, art: "z", fallen: [
        { wert: bw(bdurch([1, 1], k)), text: `Umgekehrt: Teile die Zahl vor dem x-Faktor durch die Zahl in ${M(T`u' = ${gi.dTex}`)}.` },
        { wert: c, text: `Du hast nicht durch die innere Ableitung geteilt. Aus ${M(T`dx = \frac{du}{${gi.dTex}}`)} kommt noch ${M(T`\frac{1}{${gi.d}}`)}.` },
        { wert: 1 / gi.d, text: `Die Zahl ${M(String(c))} vor dem x-Faktor gehört mit in k.` }] }],
      tipps: [`Das Innere ist ${M(gi.tex)}. Leite es ab: ${M(T`du = ${gi.dTex}\,dx`)}.`,
        `Setze ${M(T`dx = \frac{du}{${gi.dTex}}`)} ein und kürze das x. Es bleibt ${M(T`\frac{${c}}{${gi.d}}`)}.`],
      loesung: `${M(T`u = ${gi.tex},\; dx = \frac{du}{${gi.dTex}}`)}, also ${M(T`\int ${t.hT}\,dx = ${bTex(k)}\int ${t.uT}\,du`)}, ${M(T`k = ${bTex(k)}`)}.`,
    };
  },
});

/* ---------- 3 · Das Verfahren ---------- */
const WEG3 = [
  ["①", T`u = x^3 + 2`],
  ["②", T`du = 3x^2\,dx \;\Rightarrow\; dx = \frac{du}{3x^2}`],
  ["③", T`\int x^2 (x^3+2)^4\,dx = \int x^2\, u^4\, \frac{du}{3x^2} = \frac{1}{3}\int u^4\,du`],
  ["④", T`= \frac{1}{3}\cdot\frac{u^5}{5} = \frac{1}{15}\,u^5`],
  ["⑤", T`= \frac{1}{15}\,(x^3+2)^5 + C`],
  ["✓", T`\Bigl(\tfrac{1}{15}(x^3+2)^5\Bigr)' = \tfrac{1}{15}\cdot 5(x^3+2)^4\cdot 3x^2 = x^2(x^3+2)^4`],
];
STATIONEN.push({
  id: "s-verfahren", titel: "Das Verfahren in fünf Schritten", ziel: 3,
  vor: [
    { t: `Jetzt der ganze Weg an einem Beispiel: ${M(T`\int x^2\,(x^3+2)^4\,dx`)}. <b>① Substituieren:</b> Das Innere heißt ${M(T`u = x^3+2`)}.`, v: () => rechenweg(WEG3, 0) },
    { t: `<b>② Differenzieren:</b> ${M(T`du = 3x^2\,dx`)}, nach dx umgestellt ${M(T`dx = \frac{du}{3x^2}`)}.`, v: () => rechenweg(WEG3, 1),
      f: { q: `Warum ist ${M(T`du = 3x^2\,dx`)} richtig?`, o: [
        { t: `Weil ${M(T`\frac{du}{dx} = u'(x) = 3x^2`)}`, ok: true, w: "Genau. Man schreibt die Ableitung als Quotient und stellt um." },
        { t: "Weil man u und x einfach vertauscht", w: "Vertauscht wird nichts. du und dx hängen über die Ableitung zusammen." },
        { t: `Weil ${M(T`x^3 + 2`)} und ${M("3x^2")} gleich groß sind`, w: `${M("3x^2")} ist die Ableitung von ${M("x^3+2")}, nicht derselbe Wert.` }] } },
    { t: `<b>③ Ersetzen:</b> Alles mit x wird ersetzt. Das ${M("x^2")} kürzt sich gegen das ${M("3x^2")} im Nenner. Übrig: ${M(T`\frac{1}{3}\int u^4\,du`)}.`, v: () => rechenweg(WEG3, 2),
      f: { q: "Was prüfst du nach dem Ersetzen?", o: [
        { t: "Dass kein x mehr dasteht", ok: true, w: "Steht noch ein x da, ist die Substitution gescheitert. Dann hilft eine andere oder gar keine." },
        { t: "Dass das Ergebnis positiv ist", w: "Das Vorzeichen spielt hier keine Rolle. Entscheidend ist, ob das x verschwunden ist." },
        { t: "Dass u kleiner als x ist", w: "u ist ein neuer Name, kein kleinerer Wert. Wichtig ist: Es darf kein x übrig sein." }] } },
    { t: `<b>④ Integrieren:</b> Jetzt ist es ein Grundintegral: ${M(T`\frac{1}{3}\cdot\frac{u^5}{5} = \frac{1}{15}\,u^5`)}.`, v: () => rechenweg(WEG3, 3),
      f: { q: `Welche Stammfunktion hat ${M("u^4")}?`, o: [
        { t: M(T`\frac{u^5}{5}`), ok: true, w: "Exponent um eins erhöhen, durch den neuen Exponenten teilen." },
        { t: M("4u^3"), w: "Das ist die Ableitung, nicht die Stammfunktion." },
        { t: M("u^5"), w: `Leite ab: ${M("5u^4")}. Es fehlt der Faktor ${M(T`\frac{1}{5}`)}.` }] } },
    { t: `<b>⑤ Zurücksubstituieren:</b> Für u wieder ${M("x^3+2")} einsetzen und ${M("+C")} nicht vergessen.`, v: () => rechenweg(WEG3, 4),
      f: { q: "Warum darf u am Ende nicht stehen bleiben?", o: [
        { t: "Gesucht ist eine Stammfunktion von x", ok: true, w: "u war nur ein Hilfsname. Die Aufgabe ist in x gestellt, die Antwort auch." },
        { t: "u darf nur bei Grenzen vorkommen", w: "Beim unbestimmten Integral ist u nur ein Hilfsname. Gefragt ist eine Funktion von x." },
        { t: "Sonst fehlt das C", w: "Das C gehört immer dazu. Zurück muss man, weil die Aufgabe in x gestellt ist." }] } },
    { t: `<b>Probe</b> durch Ableiten: äußere Ableitung mal innere Ableitung gibt genau den Integranden. Fertig.`, v: () => rechenweg(WEG3, 5) },
  ],
  merke: `① ${M("u = g(x)")} ② ${M(T`dx = \frac{du}{g'(x)}`)} ③ ersetzen, bis kein x mehr dasteht ④ integrieren ⑤ zurücksubstituieren, ${M("+C")}. Probe: ableiten.`,
  stolper: `Zwei Faktoren können zusammenkommen: einer aus ${M(T`dx = \frac{du}{g'(x)}`)}, einer aus dem Grundintegral. Beide gehören ins Ergebnis.`,
  neu() {
    const t = sub({ n: [2, 2, 3], arten: ["pot", "pot", "pot", "exp", "sin", "cos", "kehr", "wurzel"] });
    const { a, gi, K } = t;
    const felder = [{ id: "K", label: `Faktor vor ${M(a.bare(gi.tex))} (Bruch erlaubt)`, wert: bw(K), tol: 0.0011, art: "z", fallen: faktorFallen(t) }];
    let rechts = T`\square\cdot ${a.bare(gi.tex)} + C`;
    if (t.art === "pot") {
      rechts = T`\square\cdot (${gi.tex})^{\triangle} + C`;
      felder[0].label = `Faktor ${M(T`\square`)} (Bruch erlaubt)`;
      felder.push({ id: "e", label: `Exponent ${M(T`\triangle`)}`, wert: t.m + 1, art: "n", fallen: [
        { wert: t.m, text: "Beim Integrieren steigt der Exponent um eins." }, { wert: t.m - 1, text: "Das wäre beim Ableiten so. Beim Integrieren steigt der Exponent." }] });
    }
    return {
      html: `<p>Integriere mit Substitution und fülle die Lücken.</p>${MD(T`\int ${t.hT}\,dx = ${rechts}`)}`,
      geschichte: t.geschichte, sok: sokVon(t), felder,
      tipps: [`① ${M(T`u = ${gi.tex}`)} ② ${M(T`dx = \frac{du}{${gi.dTex}}`)} ③ Es bleibt ${M(T`${bTex(t.k)}\int ${t.uT}\,du`)}.`,
        `④ ${M(a.grund)}. Multipliziere die beiden Faktoren.`],
      loesung: `${M(T`\int ${t.hT}\,dx = ${bTex(t.k)}\int ${t.uT}\,du = ${bTex(t.k)}\cdot ${t.FuT} + C = ${t.ergT}`)}`,
    };
  },
});

/* ---------- 4 · Lineare Substitution ---------- */
STATIONEN.push({
  id: "s-linear", titel: "Innen steht ax + b", ziel: 4,
  vor: [
    { t: `Besonders oft steht innen eine lineare Funktion, etwa bei ${M(T`\int e^{3x-1}\,dx`)}. Dann ist alles schneller erledigt.`,
      v: () => formelBild(T`\int e^{${IN("3x-1")}}\,dx`),
      f: { q: `Was ist ${M("u'")} für ${M("u = 3x - 1")}?`, o: [
        { t: M("3"), ok: true, w: "Die Ableitung einer linearen Funktion ist ihre Steigung." },
        { t: M("3x"), w: `${M("3x")} abgeleitet ist ${M("3")}, ohne x.` },
        { t: M("-1"), w: "Die −1 fällt beim Ableiten weg. Es bleibt die Steigung." }] } },
    { t: `${M(T`du = 3\,dx`)}, also ${M(T`dx = \frac{du}{3}`)}. Damit ${M(T`\int e^{u}\,\frac{du}{3} = \frac{1}{3}\,e^{u} = \frac{1}{3}\,e^{3x-1} + C`)}.`,
      v: () => formelBild(T`\int e^{3x-1}\,dx = \frac{1}{3}\,e^{3x-1} + C`) },
    { t: `Allgemein gilt die <b>lineare Substitution</b>: ${M(T`\int f(ax+b)\,dx = \frac{1}{a}\,F(ax+b) + C`)}. Außen integrieren, durch die Steigung a teilen.`,
      v: () => formelBild(T`\int f(${IN("ax+b")})\,dx = \frac{1}{${AB("a")}}\,F(ax+b) + C`),
      f: { q: `${M(T`\int \cos(2x+5)\,dx = \;?`)}`, o: [
        { t: M(T`\tfrac{1}{2}\sin(2x+5) + C`), ok: true, w: `Probe: ${M(T`\bigl(\tfrac12\sin(2x+5)\bigr)' = \tfrac12\cos(2x+5)\cdot 2`)} ✓` },
        { t: M(T`2\sin(2x+5) + C`), w: "Leite ab: Es kommt 4·cos(2x+5) heraus. Durch a teilen, nicht malnehmen." },
        { t: M(T`\sin(2x+5) + C`), w: "Leite ab: Es kommt 2·cos(2x+5) heraus, doppelt so viel." },
        { t: M(T`-\tfrac{1}{2}\sin(2x+5) + C`), w: "Die Stammfunktion von cos ist sin, ohne Minus." }] } },
    { t: `Bei Potenzen kommen zwei Faktoren zusammen: ${M(T`\int (4x-3)^5\,dx = \frac{1}{4}\cdot\frac{(4x-3)^6}{6} = \frac{1}{24}(4x-3)^6 + C`)}. Ein Faktor stammt vom Grundintegral, einer von der Steigung.`,
      v: () => formelBild(T`\int (4x-3)^5\,dx = \frac{1}{4}\cdot\frac{1}{6}\,(4x-3)^6 + C`),
      f: { q: `Welcher Faktor steht bei ${M(T`\int (2x+1)^3\,dx`)} vor ${M(T`(2x+1)^4`)}?`, o: [
        { t: M(T`\tfrac{1}{8}`), ok: true, w: `${M(T`\tfrac14`)} vom Grundintegral, ${M(T`\tfrac12`)} von der Steigung.` },
        { t: M(T`\tfrac{1}{4}`), w: "Das ist nur der Faktor aus dem Grundintegral. Die Steigung 2 fehlt." },
        { t: M(T`\tfrac{1}{2}`), w: "Das ist nur der Faktor aus der Steigung. Das Grundintegral bringt noch ¼." },
        { t: M("2"), w: "Durch die Steigung wird geteilt, nicht mit ihr multipliziert." }] } },
  ],
  merke: `${M(T`\int f(ax+b)\,dx = \frac{1}{a}\,F(ax+b) + C`)}. Kurz: außen integrieren, durch die innere Ableitung a teilen.`,
  stolper: `Durch a teilen, nicht mit a malnehmen. Und bei Potenzen kommt der Faktor des Grundintegrals noch dazu.`,
  neu() {
    const t = sub({ n: [1], arten: ["pot", "pot", "exp", "sin", "cos", "kehr", "wurzel"] });
    const { a, gi, K } = t;
    return {
      html: `<p>Bestimme den Faktor.</p>${MD(T`\int ${t.hT}\,dx = \square\cdot ${a.bare(gi.tex)} + C`)}`,
      geschichte: t.geschichte, sok: sokVon(t),
      felder: [{ id: "K", label: `Faktor ${M(T`\square`)} (Bruch erlaubt)`, wert: bw(K), tol: 0.0011, art: "z", fallen: faktorFallen(t) }],
      tipps: [`Die Steigung innen ist ${M(T`a = ${gi.p}`)}. Durch sie wird geteilt.`, `${M(a.grund)}${t.c !== 1 ? `, und die ${t.c} davor bleibt stehen` : ""}.`],
      loesung: `${M(T`\int ${t.hT}\,dx = ${t.c !== 1 ? t.c + T`\cdot` : ""}\frac{1}{${gi.p}}\cdot ${koef(a.Fk)}${a.bare(gi.tex)} + C = ${t.ergT}`)}`,
    };
  },
});

/* ---------- 5 · Grenzen mitnehmen ---------- */
const BSP5 = { h: (x) => 2 * x / (x * x + 1), f: (u) => 1 / u };
const bild5 = (beide) => graph({ xmin: -0.1, xmax: 5.6, ymin: -0.05, ymax: 1.15, dx: 1, dy: 0.25, xname: beide ? "x bzw. u" : "x",
  kurven: [{ f: BSP5.h, farbe: "a", flaeche: [1, 2], legende: "y = 2x/(x²+1), x von 1 bis 2", text: beide ? "0,916" : "" },
    ...(beide ? [{ f: BSP5.f, farbe: "b", von: 0.15, flaeche: [2, 5], legende: "y = 1/u, u von 2 bis 5", text: "0,916" }] : [])] });
STATIONEN.push({
  id: "s-grenzen", titel: "Bestimmte Integrale: Grenzen mitnehmen", ziel: 3,
  vor: [
    { t: `Gesucht ist ${M(T`\int_1^2 \frac{2x}{x^2+1}\,dx`)}, die Fläche unter dem blauen Graphen zwischen 1 und 2.`, v: () => bild5(false),
      f: { q: "Welche Substitution bietet sich an?", o: [
        { t: M("u = x^2 + 1"), ok: true, w: `Und ${M("2x")} im Zähler ist genau ihre Ableitung.` },
        { t: M("u = 2x"), w: `Dann bliebe ${M("x^2+1")} im Nenner stehen, mit x darin.` },
        { t: M(T`u = \frac{1}{x^2+1}`), w: "Dann wäre u die ganze Verkettung. Innen steht der Nenner." }] } },
    { t: `Mit ${M("u = x^2+1")} und ${M(T`du = 2x\,dx`)} wird der Integrand zu ${M(T`\frac{1}{u}`)}. Aber Achtung: Die Grenzen 1 und 2 sind <b>x-Werte</b>.`, v: () => bild5(false),
      f: { q: "Welche u-Werte gehören zu x = 1 und x = 2?", o: [
        { t: "u = 2 und u = 5", ok: true, w: `${M("1^2+1 = 2")} und ${M("2^2+1 = 5")}.` },
        { t: "u = 1 und u = 2", w: "Das sind die alten Grenzen. Setze sie in u = x² + 1 ein." },
        { t: "u = 3 und u = 5", w: `Rechne nach: ${M("1^2 + 1 = 2")}.` }] } },
    { t: `Also ${M(T`\int_1^2 \frac{2x}{x^2+1}\,dx = \int_2^5 \frac{1}{u}\,du`)}. Rechts steht eine <b>andere Fläche</b>: unter ${M(T`\frac{1}{u}`)} von 2 bis 5.`, v: () => bild5(true),
      f: { q: "Ist die türkise Fläche genauso groß wie die blaue?", o: [
        { t: "Ja, genau gleich groß", ok: true, w: "Die Substitution verzerrt die Fläche: breiter, dafür flacher. Der Inhalt bleibt gleich." },
        { t: "Nein, die türkise ist größer, weil sie breiter ist", w: "Breiter ja, aber auch flacher. Beide haben den Inhalt 0,916." },
        { t: "Nein, die blaue ist größer, weil sie höher ist", w: "Höher ja, aber schmaler. Beide haben den Inhalt 0,916." }] } },
    { t: `Ausrechnen in u: ${M(T`\bigl[\ln u\bigr]_2^5 = \ln 5 - \ln 2 \approx 0{,}916`)}. Wer die Grenzen mitgenommen hat, muss nicht zurücksubstituieren.`, v: () => bild5(true) },
    { t: `Es gibt einen zweiten Weg: erst unbestimmt integrieren und zurücksubstituieren, ${M(T`\ln(x^2+1)`)}, dann die <b>alten</b> Grenzen einsetzen: ${M(T`\ln 5 - \ln 2`)}. Beide Wege sind richtig. Falsch ist nur die Mischung.`, v: () => bild5(true),
      f: { q: `Was kommt heraus, wenn man ${M(T`\ln u`)} mit den alten Grenzen 1 und 2 auswertet?`, o: [
        { t: `${M(T`\ln 2 - \ln 1 \approx 0{,}693`)}, also falsch`, ok: true, w: "Genau. u-Stammfunktion und x-Grenzen passen nicht zusammen." },
        { t: `${M(T`\ln 2 - \ln 1`)}, und das ist richtig`, w: "Rechne nach: 0,693 ist nicht 0,916. Zu u gehören die u-Grenzen." },
        { t: "Dasselbe, weil ln immer gleich bleibt", w: "Die Grenzen 1 und 2 sind x-Werte. Für u laufen sie von 2 bis 5." }] } },
  ],
  merke: `${M(T`\int_a^b f(g(x))\,g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du`)}. Neue Grenzen ausrechnen und in u zu Ende rechnen.`,
  stolper: `Nie die u-Stammfunktion mit den x-Grenzen auswerten. Entweder neue Grenzen oder zurücksubstituieren, nicht halb und halb.`,
  neu() {
    const t = sub({ def: true });
    const { gi, k } = t;
    return {
      html: `<p>Berechne mit Substitution.</p>${MD(T`\int_{${t.x1}}^{${t.x2}} ${t.hT}\,dx`)}`,
      bild: flaechenBild(t, false),
      geschichte: t.geschichte, sok: sokVon(t),
      felder: [
        { id: "u1", label: `neue untere Grenze ${M("u_1")}`, wert: t.u1, art: "n", fallen: [{ wert: t.x1, text: `Das ist die alte Grenze. Setze ${M(`x = ${t.x1}`)} in ${M(`u = ${gi.tex}`)} ein.` }] },
        { id: "u2", label: `neue obere Grenze ${M("u_2")}`, wert: t.u2, art: "n", fallen: [{ wert: t.x2, text: `Das ist die alte Grenze. Setze ${M(`x = ${t.x2}`)} in ${M(`u = ${gi.tex}`)} ein.` }] },
        { id: "V", label: "Wert des Integrals (drei Nachkommastellen)", wert: t.V, tol: 0.0011, art: "z", fallen: [
          { wert: t.altV, text: "Du hast die u-Stammfunktion mit den alten x-Grenzen ausgewertet. Nimm die neuen Grenzen." },
          { wert: t.V / bw(k), text: `Der Faktor ${M(T`k = ${bTex(k)}`)} aus ${M(T`dx = \frac{du}{${gi.dTex}}`)} fehlt.` },
          { wert: t.V / bw(k) / bw(k), text: `Der Faktor ist ${M(bTex(k))}, nicht ${M(bTex(bdurch([1, 1], k)))}.` },
          { wert: -t.V, text: "Prüfe das Vorzeichen: obere Grenze minus untere Grenze." }] },
      ],
      tipps: [`${M(T`u = ${gi.tex}`)}. Die neuen Grenzen: ${M(`u(${t.x1})`)} und ${M(`u(${t.x2})`)}.`,
        `${M(T`\int_{${t.x1}}^{${t.x2}} ${t.hT}\,dx = ${bTex(k)}\int_{${t.u1}}^{${t.u2}} ${t.uT}\,du`)}. ${M(t.a.grund)}.`],
      loesung: `${M(T`${bTex(k)}\int_{${t.u1}}^{${t.u2}} ${t.uT}\,du = ${bTex(k)}\Bigl[${t.FuT}\Bigr]_{${t.u1}}^{${t.u2}} \approx ${kzT(t.V)}`)}`,
    };
  },
});

/* ---------- 6 · Fehler finden ---------- */
STATIONEN.push({
  id: "s-fehler", titel: "Fehler finden", ziel: 3,
  vor: [
    { t: `Wer Fehler sicher findet, hat das Verfahren verstanden. Der häufigste: <b>dx nicht ersetzt</b>. Jemand rechnet ${M(T`\int x\cos(x^2)\,dx = \int\cos(u)\,du = \sin(x^2) + C`)}.`,
      v: () => formelBild(T`\int x\cos(x^2)\,dx \overset{?}{=} \sin(x^2) + C`),
      f: { q: `Stimmt das? Leite ${M(T`\sin(x^2)`)} ab.`, o: [
        { t: `Nein: Ableiten gibt ${M(T`2x\cos(x^2)`)}`, ok: true, w: `Das ist doppelt so viel. Aus ${M(T`dx = \frac{du}{2x}`)} fehlt der Faktor ${M(T`\frac12`)}.` },
        { t: "Ja, das ist richtig", w: `Leite ${M(T`\sin(x^2)`)} mit der Kettenregel ab: Es kommt ${M(T`2x\cos(x^2)`)} heraus.` },
        { t: `Nein: Es müsste ${M(T`\cos(x^2)`)} heißen`, w: "Die Stammfunktion von cos ist sin. Der Fehler steckt im Faktor." }] } },
    { t: `Zweiter Fehler: <b>alte Grenzen behalten</b>. Wer substituiert und in u rechnet, muss die Grenzen umrechnen: ${M("u_1 = g(a)")}, ${M("u_2 = g(b)")}.`,
      v: () => formelBild(T`\int_a^b \ldots\,dx = \int_{g(a)}^{g(b)} \ldots\,du`) },
    { t: `Dritter Fehler: <b>ein x bleibt stehen</b>. Bei ${M(T`\int e^{x^2}\,dx`)} mit ${M("u = x^2")} entsteht ${M(T`\int \frac{e^u}{2x}\,du`)}. Da steht noch ein x.`,
      v: () => formelBild(T`\int e^{x^2}dx = \int \frac{e^u}{2x}\,du`, "x und u gemischt: gescheitert"),
      f: { q: "Was folgt daraus?", o: [
        { t: "Diese Substitution führt nicht zum Ziel", ok: true, w: "Genau. Man darf das x nicht wie eine Zahl vor das Integral ziehen." },
        { t: `Man zieht ${M(T`\frac{1}{2x}`)} vor das Integral`, w: "x ist keine Konstante, solange nach u integriert wird. So entsteht ein falsches Ergebnis." },
        { t: "Man ersetzt x durch u", w: "x ist nicht u, sondern √u. Damit wird es nur schwieriger, nicht lösbar." }] } },
    { t: `Vierter Fehler: <b>falsche Stammfunktion</b>, etwa abgeleitet statt integriert oder ${M(T`\int\sin u\,du = \cos u`)} ohne Minus. Und immer gilt: Die Probe durch Ableiten deckt jeden Fehler beim unbestimmten Integral auf.`,
      v: () => formelBild(T`\int \sin(u)\,du = -\cos(u) + C`) },
  ],
  merke: `Prüfe vier Stellen: Ist u' richtig? Ist dx ersetzt (Faktor k)? Sind die Grenzen umgerechnet? Stimmt das Grundintegral?`,
  stolper: `Ein Fehler zieht alle folgenden Zeilen mit. Gesucht ist die <b>erste</b> falsche Zeile.`,
  neu() {
    const t = sub({ def: true, n: [2, 2, 3, 1] });
    const { a, gi, k } = t;
    const arten = ["keiner", "du", "dx", "grenze", "alt", "stamm"].filter((e) =>
      (e !== "du" || (gi.n > 1 && gi.p !== gi.d)) && (e !== "dx" || !bgleich(k, [1, 1])) && (e !== "grenze" || gi.n > 1) && (e !== "stamm" || a.abl) && (e !== "alt" || t.x1 !== t.u1 || t.x2 !== t.u2));
    const fehler = wahl(arten);
    /* richtige Werte, dann den Fehler einbauen; alle späteren Zeilen rechnen mit ihm weiter */
    let dT = gi.dTex, d = gi.d, kk = k, u1 = t.u1, u2 = t.u2, FT = t.FuT, F = (u) => a.F(u), zeile = 0;
    if (fehler === "du") { d = gi.p; dT = (gi.p === 1 ? "" : String(gi.p)) + xPot(gi.n - 1); kk = Bruch(t.c, d); zeile = 1; }
    if (fehler === "dx") { kk = [1, 1]; zeile = 3; }
    if (fehler === "grenze") { const f2 = gi.p * t.x2 + gi.q; if (f2 === u2) return this.neu(); u2 = f2; zeile = 2; }
    if (fehler === "alt") { u1 = t.x1; u2 = t.x2; zeile = 3; }
    if (fehler === "stamm") {
      FT = a.abl("u"); zeile = 4;
      const ab = { pot: (u) => t.m * u ** (t.m - 1), sin: Math.cos, cos: (u) => -Math.sin(u), kehr: (u) => -1 / (u * u), wurzel: (u) => 1 / (2 * Math.sqrt(u)) }[t.art];
      F = ab;
    }
    const wert = bw(kk) * (F(u2) - F(u1));
    if (!isFinite(wert) || (fehler !== "keiner" && Math.abs(wert - t.V) < 0.002)) return this.neu();
    const zeilen = [
      T`u = ${gi.tex},\quad du = ${dT}\,dx,\quad dx = \frac{du}{${dT}}`,
      T`x = ${t.x1} \Rightarrow u = ${fehler === "alt" ? t.u1 : u1},\qquad x = ${t.x2} \Rightarrow u = ${fehler === "alt" ? t.u2 : u2}`,
      T`\int_{${t.x1}}^{${t.x2}} ${t.hT}\,dx = ${koef(kk)}\int_{${u1}}^{${u2}} ${t.uT}\,du`,
      T`= ${koef(kk)}\Bigl[${FT}\Bigr]_{${u1}}^{${u2}} \approx ${kzT(wert)}`,
    ];
    const html = `<p>So hat jemand ${M(T`\int_{${t.x1}}^{${t.x2}} ${t.hT}\,dx`)} gerechnet:</p><div class="rweg">${zeilen.map((z, i) => `<div class="rz"><span class="rnr">${i + 1}</span><span>${M(z)}</span></div>`).join("")}</div>`;
    const warum = {
      keiner: "Jede Zeile stimmt. Prüfe trotzdem jede: u', Faktor, Grenzen, Grundintegral.",
      du: `In Zeile 1 ist ${M("u'")} falsch: Die Ableitung von ${M(gi.tex)} ist ${M(gi.dTex)}.`,
      grenze: `In Zeile 2 ist die obere Grenze falsch: ${M(`u(${t.x2}) = ${t.u2}`)}. Die Potenz von x wurde vergessen.`,
      dx: `In Zeile 3 fehlt der Faktor ${M(bTex(k))} aus ${M(T`dx = \frac{du}{${gi.dTex}}`)}.`,
      alt: "In Zeile 3 stehen am u-Integral noch die alten x-Grenzen, obwohl Zeile 2 die neuen ausgerechnet hat.",
      stamm: `In Zeile 4 wurde abgeleitet statt integriert. Richtig: ${M(a.grund)}.`,
    }[fehler];
    const opts = ["Zeile 1", "Zeile 2", "Zeile 3", "Zeile 4", "Kein Fehler"].map((txt, i) => ({ t: txt, ok: (i + 1) % 5 === zeile, w: warum }));
    return {
      html, geschichte: "fehler-" + fehler, sok: sokVon(t),
      auswahl: { label: "Der erste Fehler steckt in …", optionen: opts.map((o) => o.t), richtig: opts.findIndex((o) => o.ok), falsch: () => "Noch nicht. Prüfe Zeile für Zeile: u', die Grenzen, den Faktor k, das Grundintegral." },
      felder: [{ id: "V", label: "richtiger Wert des Integrals (drei Nachkommastellen)", wert: t.V, tol: 0.0011, art: "z", fallen: fehler === "keiner" ? [] : [{ wert, text: "Das ist der Wert aus dem fehlerhaften Rechenweg. Rechne ihn richtig nach." }] }],
      tipps: [`Rechne selbst: ${M(T`u = ${gi.tex}`)}, ${M(T`du = ${gi.dTex}\,dx`)}, neue Grenzen ${M(`${t.u1}`)} und ${M(`${t.u2}`)}.`,
        `${M(T`${bTex(k)}\int_{${t.u1}}^{${t.u2}} ${t.uT}\,du`)}. Vergleiche mit den Zeilen.`],
      loesung: `${warum} Richtig: ${M(T`${bTex(k)}\Bigl[${t.FuT}\Bigr]_{${t.u1}}^{${t.u2}} \approx ${kzT(t.V)}`)}.`,
    };
  },
});

/* ---------- 7 · Erklären können ---------- */
const ERKLAER = [
  { q: "Aus welcher Ableitungsregel entsteht die Integration durch Substitution?", o: [
    { t: "aus der Kettenregel", ok: true }, { t: "aus der Produktregel", w: "Die Produktregel rückwärts gelesen ergibt die partielle Integration, ein anderes Verfahren." },
    { t: "aus der Quotientenregel", w: "Die Quotientenregel hat kein eigenes Integrationsverfahren. Substitution ist die Kettenregel rückwärts." },
    { t: "aus der Summenregel", w: "Die Summenregel erlaubt nur, Summanden einzeln zu integrieren." }] },
  { q: "Woran erkennst du, dass Substitution passen könnte?", o: [
    { t: "Eine Verkettung steht da, und die Ableitung ihres Inneren steht bis auf eine Zahl als Faktor daneben", ok: true },
    { t: "Im Integranden steht ein Produkt", w: "Ein Produkt allein reicht nicht. x·eˣ ist ein Produkt, braucht aber partielle Integration." },
    { t: "Der Integrand ist ein Bruch", w: "Manche Brüche passen (2x/(x²+1)), andere nicht (1/(x²+1)). Entscheidend ist die innere Ableitung." },
    { t: "Im Integranden kommt eine e-Funktion vor", w: "e^(x²) allein lässt sich so gerade nicht integrieren. Entscheidend ist die innere Ableitung." }] },
  { q: `Warum klappt ${M(T`\int e^{x^2}\,dx`)} mit ${M("u = x^2")} nicht?`, o: [
    { t: "Nach dem Ersetzen bleibt ein x übrig, weil der Faktor 2x fehlt", ok: true },
    { t: `Es klappt: Das Ergebnis ist ${M(T`\frac{e^{x^2}}{2x}`)}`, w: "Leite ab: Mit der Quotientenregel kommt nicht e^(x²) heraus. Durch x darf man nicht so teilen." },
    { t: `Weil ${M("e^u")} keine Stammfunktion hat`, w: "eᵘ hat die Stammfunktion eᵘ. Das Problem ist das übrig bleibende x." },
    { t: "Weil man e-Funktionen nie substituiert", w: "Bei x·e^(x²) klappt es wunderbar. Hier fehlt nur das x." }] },
  { q: "Warum ändern sich beim bestimmten Integral die Grenzen?", o: [
    { t: "Nach dem Substituieren läuft u, und u läuft von g(a) bis g(b)", ok: true },
    { t: "Damit die Fläche gleich bleibt, verdoppelt man sie", w: "Verdoppelt wird nichts. Die Grenzen werden in u = g(x) eingesetzt." },
    { t: "Sie ändern sich gar nicht", w: "Die Grenzen a und b gehören zu x. Zum neuen Integral in u gehören g(a) und g(b)." },
    { t: "Weil die Stammfunktion sich ändert", w: "Die Grenzen ändern sich, weil die Integrationsvariable wechselt." }] },
  { q: `Was zeigt das Bild zu ${M(T`\int_1^2 \frac{2x}{x^2+1}\,dx = \int_2^5 \frac{1}{u}\,du`)}?`, o: [
    { t: "Zwei verschiedene Flächen mit demselben Inhalt", ok: true },
    { t: "Dieselbe Fläche, nur verschoben", w: "Die Flächen haben verschiedene Form: eine schmal und hoch, eine breit und flach." },
    { t: "Die zweite Fläche ist halb so groß", w: "Beide haben den Inhalt ln 5 − ln 2 ≈ 0,916." },
    { t: "Eine Fläche und ihre Stammfunktion", w: "Beide Bilder zeigen Flächen unter Graphen. Ihr Inhalt ist gleich." }] },
  { q: `Was bedeutet die Merkzeile ${M(T`du = g'(x)\,dx`)}?`, o: [
    { t: "Ändert sich x ein wenig, ändert sich u ungefähr g'(x)-mal so stark", ok: true },
    { t: "u und x sind gleich groß", w: "u = g(x) ist ein neuer Wert. Die Merkzeile vergleicht kleine Änderungen." },
    { t: "Man darf du und dx beliebig tauschen", w: "Getauscht wird nichts. Der Umrechnungsfaktor ist die Ableitung g'(x)." },
    { t: "Man multipliziert das Integral mit g'(x)", w: "Ersetzt wird dx durch du : g'(x). Das ist der Umrechnungsfaktor." }] },
  { q: `${M(T`\int \cos(3x)\,dx = \;?`)}`, o: [
    { t: M(T`\tfrac{1}{3}\sin(3x) + C`), ok: true }, { t: M(T`3\sin(3x) + C`), w: "Leite ab: 9·cos(3x). Durch die Steigung teilen." },
    { t: M(T`\sin(3x) + C`), w: "Leite ab: 3·cos(3x), dreimal zu viel." }, { t: M(T`-\tfrac{1}{3}\sin(3x) + C`), w: "Die Stammfunktion von cos ist sin, ohne Minus." }] },
  { q: `${M(T`\int \frac{x}{x^2+1}\,dx = \;?`)}`, o: [
    { t: M(T`\tfrac{1}{2}\ln(x^2+1) + C`), ok: true }, { t: M(T`\ln(x^2+1) + C`), w: "Leite ab: 2x/(x²+1), doppelt so viel." },
    { t: M(T`2\ln(x^2+1) + C`), w: "Leite ab: 4x/(x²+1). Durch 2 teilen, nicht malnehmen." }, { t: M(T`x\ln(x^2+1) + C`), w: "Ein x darf nicht vor dem ln stehen. Leite ab: Produktregel, zwei Summanden." }] },
  { q: "Welches Integral löst man durch Substitution?", o: [
    { t: M(T`\int x\,e^{x^2}\,dx`), ok: true }, { t: M(T`\int x\,e^{x}\,dx`), w: "Hier ist x nicht die Ableitung des Exponenten x. Das ist ein Fall für die partielle Integration." },
    { t: M(T`\int x\sin(x)\,dx`), w: "Hier steht im Sinus nur x. Das ist ein Fall für die partielle Integration." },
    { t: M(T`\int e^{x^2}\,dx`), w: "Hier fehlt der Faktor x. Das klappt mit keinem Schulverfahren." }] },
  { q: "Wie prüfst du ein unbestimmtes Integral am sichersten?", o: [
    { t: "Ableiten: Es muss der Integrand herauskommen", ok: true },
    { t: "Mit dem Taschenrechner einen Wert einsetzen", w: "Ein einzelner Wert sagt wenig. Ableiten prüft die ganze Funktion." },
    { t: "Noch einmal integrieren", w: "Zweimal integrieren gibt etwas Neues. Die Probe ist das Ableiten." },
    { t: "Nachsehen, ob ein C dasteht", w: "Das C gehört dazu, prüft aber nichts. Leite ab." }] },
  { q: "Beim bestimmten Integral hat man nach u gerechnet und die Grenzen umgerechnet. Muss man zurücksubstituieren?", o: [
    { t: "Nein, man rechnet mit den u-Grenzen zu Ende", ok: true },
    { t: "Ja, immer", w: "Mit neuen Grenzen ist man in u fertig. Zurück muss man nur, wenn man die alten Grenzen nehmen will." },
    { t: "Ja, und dann die u-Grenzen einsetzen", w: "Das mischt zwei Wege: Nach dem Zurücksubstituieren gehören die x-Grenzen dazu." },
    { t: "Nur, wenn eine Grenze 0 ist", w: "Mit der Null hat das nichts zu tun." }] },
  { q: "Wann teilt man durch die innere Ableitung, wann multipliziert man?", o: [
    { t: "Beim Integrieren teilt man, beim Ableiten multipliziert man", ok: true },
    { t: "Beim Integrieren multipliziert man", w: "Leite deine Stammfunktion ab: Die Kettenregel multipliziert. Damit es passt, muss man vorher geteilt haben." },
    { t: "Man multipliziert immer", w: "Beim Ableiten ja. Beim Integrieren muss man das ausgleichen, also teilen." },
    { t: "Das hängt vom Vorzeichen ab", w: "Das Vorzeichen spielt keine Rolle. Integrieren ist die Umkehrung: teilen." }] },
];
STATIONEN.push({
  id: "s-erklaeren", titel: "Erklären können", ziel: 5,
  vor: [
    { t: `Wer ein Verfahren erklären kann, hat es verstanden. Eine gute Erklärung hat fünf Teile: <b>Problem, Idee, Verfahren, Bild, Grenzen</b>.`,
      v: () => formelBild(T`\text{Problem} \to \text{Idee} \to \text{Verfahren} \to \text{Bild} \to \text{Grenzen}`),
      f: { q: "Womit beginnt eine Erklärung am besten?", o: [
        { t: "Mit einem Integral, das die Grundregeln nicht schaffen", ok: true, w: `Ein Problem macht neugierig: ${M(T`\int 2x\cos(x^2)\,dx`)} sieht schwierig aus, und keine Regel passt.` },
        { t: "Mit der allgemeinen Formel", w: "Die Formel ist das Ergebnis. Ohne Problem weiß niemand, wofür sie gut ist." },
        { t: "Mit einem schweren Beispiel", w: "Am Anfang soll das Problem klar sein, nicht die Rechnung schwer." }] } },
    { t: `<b>Idee:</b> Die Kettenregel ${M(T`\bigl(F(g(x))\bigr)' = f(g(x))\cdot g'(x)`)} wird rückwärts gelesen. Wer das zeigt, zeigt, <i>warum</i> das Verfahren stimmt.`,
      v: () => formelBild(T`\bigl(F(g(x))\bigr)' = f(g(x))\cdot g'(x)\;\Longleftrightarrow\;\int f(g(x))\,g'(x)\,dx = F(g(x)) + C`) },
    { t: `<b>Verfahren:</b> Ein Beispiel Schritt für Schritt vorrechnen, mit ①–⑤ an der Seite: substituieren, differenzieren, ersetzen, integrieren, zurücksubstituieren. Dazu die Probe.`,
      v: () => rechenweg(WEG3, 5),
      f: { q: "Welches Beispiel eignet sich als erstes?", o: [
        { t: M(T`\int 2x\,(x^2+1)^3\,dx`), ok: true, w: "Die innere Ableitung steht genau da. Kein Faktor stört, das Prinzip ist klar zu sehen." },
        { t: M(T`\int x^2\sqrt{2x^3-5}\,dx`), w: "Gut für später: Hier kommen zwei Faktoren zusammen. Für den Anfang zu viel auf einmal." },
        { t: M(T`\int e^{x^2}\,dx`), w: "Das klappt gar nicht. Es eignet sich für den Teil „Grenzen“." }] } },
    { t: `<b>Bild:</b> Beim bestimmten Integral entstehen zwei verschiedene Flächen mit gleichem Inhalt. Das macht die neuen Grenzen anschaulich.`,
      v: () => bild5(true) },
    { t: `<b>Grenzen:</b> Wann klappt es nicht? ${M(T`\int e^{x^2}dx`)}, weil ein x übrig bleibt. Und die Abgrenzung: ${M(T`\int x\,e^x\,dx`)} braucht die partielle Integration, die Produktregel rückwärts.`,
      v: () => formelBild(T`\int x\,e^{x^2}\,dx\;\checkmark\qquad \int x\,e^{x}\,dx\;\to\;\text{partiell}\qquad \int e^{x^2}dx\;\text{geht nicht}`),
      f: { q: "Und zum Schluss?", o: [
        { t: "Eine Frage an die Zuhörer, die sie selbst lösen", ok: true, w: `Zum Beispiel ${M(T`\int \cos(3x)\,dx`)}. Darunter stehen Fragen, die Zuhörer stellen könnten. Wer sie alle beantwortet, ist bereit.` },
        { t: "Noch einmal alle Formeln", w: "Eine Wiederholung ist gut, eine eigene Aufgabe für die Zuhörer ist besser." },
        { t: "Die Geschichte des Verfahrens", w: "Eine Geschichte passt eher an den Anfang. Am Ende sollen alle selbst rechnen." }] } },
  ],
  merke: `Problem (keine Grundregel passt) ▸ Idee (Kettenregel rückwärts) ▸ Verfahren (①–⑤ und Probe) ▸ Bild (gleiche Flächen) ▸ Grenzen (e^(x²), partielle Integration).`,
  stolper: `Wer nur die Formel aufsagt, kann Rückfragen nicht beantworten. Übe die Fragen unten, bis du jede Antwort begründen kannst.`,
  neu() {
    const nr = zufall(0, ERKLAER.length - 1), e = ERKLAER[nr];
    const richtig = e.o.find((o) => o.ok);
    return {
      html: `<p><b>Eine Frage aus dem Publikum:</b></p><p>${e.q}</p>`, geschichte: "erklaeren-" + nr, felder: [],
      auswahl: knopfWahl("Deine Antwort:", e.o),
      tipps: ["Denke an die Kettenregel und an die Probe durch Ableiten."],
      loesung: richtig.t,
    };
  },
});

/* ---------- 8 · Mix ---------- */
STATIONEN.push({
  id: "s-mix", titel: "Gemischt", ziel: 5,
  vor: null,
  merke: "Aufgaben aus allen Stationen, bunt gemischt. Erst überlegen: Welche Substitution? Bestimmt oder unbestimmt?",
  stolper: "Bei bestimmten Integralen die Grenzen umrechnen. Bei unbestimmten am Ende zurücksubstituieren.",
  neu() {
    const quellen = ["s-erkennen", "s-verfahren", "s-linear", "s-grenzen", "s-grenzen", "s-fehler"];
    const id = wahl(quellen), s = STATIONEN.find((x) => x.id === id);
    const a = s.neu();
    a.herkunft = id;
    a.html = `<p class="klein leise">aus: ${s.titel}</p>` + a.html;
    return a;
  },
});

/* Spickzettel mit Formeln setzen */
for (const e of document.querySelectorAll("[data-tex]")) e.innerHTML = M(e.dataset.tex);
