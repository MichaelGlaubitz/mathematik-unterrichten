/* =====================================================================
   SOKRATISCHER TRAINER · Kapitel 3 „Integration durch Substitution“
   Baukästen je Station (s-…); Gerüst aus sokrates-trainer.js.
   Die Aufgabe liefert in  sok  fertige TeX-Zeichenketten und
   GeoGebra-Terme (siehe sokVon in trainelia-bau/stationen_s.js).
   ===================================================================== */
(function (g) {
"use strict";
const S = g.TraineliaSokrates;
if (!S) return;
const { BAU, gespraech, Zeichnung, fehlerAus, dz, lob, T3 } = S;

const bT = (b) => (b[1] === 1 ? String(b[0]) : `${b[0] < 0 ? "-" : ""}\\frac{${Math.abs(b[0])}}{${b[1]}}`);
const bw = (b) => b[0] / b[1];
const eins = (b) => b[0] === 1 && b[1] === 1;
const koef = (b) => (eins(b) ? "" : b[0] === -1 && b[1] === 1 ? "-" : bT(b) + "\\,");
const MERK_S = {
  ketten: { begriff: "Kettenregel", text: "$\\bigl(F(g(x))\\bigr)' = f(g(x))\\cdot g'(x)$: äußere Ableitung mal innere Ableitung." },
  sub: { begriff: "Substitution", text: "$u = g(x)$, $du = g'(x)\\,dx$, also $dx = \\frac{du}{g'(x)}$. Danach darf kein x mehr dastehen." },
  grenzen: { begriff: "Grenzen", text: "$\\int_a^b f(g(x))\\,g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du$" },
};

/* Zeichnung: Integrand, dazu Stammfunktion (unbestimmt) oder k·f(u) mit Flächen (bestimmt) */
function zeichnung(s, bestimmt) {
  const z = Zeichnung();
  z.befehle.push(`hf(x)=${s.hG}`); z.stil.hf = { farbe: "gold", dicke: 4 }; z.sichtbar.push("hf");
  if (bestimmt) {
    z.befehle.push(`A=Integral(hf,${s.x1},${s.x2})`); z.stil.A = { farbe: "gold", fuellung: 0.35, dicke: 2 };
    z.befehle.push(`gf(x)=${s.fG}`); z.stil.gf = { farbe: "wasser", dicke: 4 };
    z.befehle.push(`B=Integral(gf,${s.u1},${s.u2})`); z.stil.B = { farbe: "wasser", fuellung: 0.35, dicke: 2 };
  } else {
    z.befehle.push(`Sf(x)=${s.FG}`); z.stil.Sf = { farbe: "wasser", dicke: 4 };
  }
  return { ...z.fertig(s.sicht), frei: true, achsen: { x: bestimmt ? "x, u" : "x", y: "y" } };
}

/* Die ersten Schritte sind bei beiden Arten gleich */
function anfangsSchritte(s, intT) {
  const innenOpt = [
    { text: `$u = ${s.gT}$`, richtig: true },
    { text: `$u = ${s.ganzT}$`, hinweis: "Das ist die ganze Verkettung. u ist das, was innen steckt." },
    ...(s.xPow ? [{ text: `$u = ${s.xPow}$`, hinweis: "Das ist der Faktor davor. Er wird gleich von $dx = \\frac{du}{u'}$ aufgefressen." }] : []),
  ];
  const duOpt = [
    { text: `$du = ${s.dT}\\,dx$`, richtig: true },
    { text: `$du = ${s.gT}\\,dx$`, hinweis: "Das ist u selbst. du entsteht durch Ableiten von u." },
    s.duF ? { text: `$du = ${s.duF}\\,dx$`, hinweis: "Beim Ableiten wandert der Exponent als Faktor nach vorn." }
      : { text: "$du = dx$", hinweis: `Die Ableitung von $${s.gT}$ ist die Steigung ${s.p}, nicht 1.` },
  ];
  const kFehler = fehlerAus([
    { wert: 1 / bw(s.k), text: `Umgekehrt: Teile die Zahl ${s.c} durch die Zahl ${s.d} aus $u'$.` },
    { wert: s.c, text: `Aus $dx = \\frac{du}{${s.dT}}$ kommt noch der Faktor $\\frac{1}{${s.d}}$.` },
    { wert: 1 / s.d, text: `Die Zahl ${s.c} vor dem x-Faktor gehört mit in k.` },
  ], bw(s.k), T3);
  return [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Vor uns liegt $${intT}$. Keine Grundregel passt.\n\nAber vielleicht hat beim [[Integranden|hf]] die Kettenregel ihre Spuren hinterlassen: eine Verkettung, und daneben die Ableitung ihres Inneren.`, zeige: s.x1 !== undefined ? ["A"] : [] },
    { id: "innen", typ: "wahl", text: "Welcher Teil steckt verkettet in einem anderen? Sein Inneres nennen wir u.", optionen: innenOpt,
      tipps: [`Schau, was in der Klammer, im Exponenten oder unter dem Bruchstrich steht.`], richtig: `${lob()} $u = ${s.gT}$.` },
    { id: "du", typ: "wahl", text: `Leite u ab. Was ist du?`, optionen: duOpt,
      tipps: ["$\\frac{du}{dx} = u'(x)$, dann mit dx malnehmen."], richtig: `${lob()} Also $dx = \\frac{du}{${s.dT}}$.` },
    { id: "k", typ: "zahl", text: `Setze $dx = \\frac{du}{${s.dT}}$ ein. Das x kürzt sich, es bleibt eine Zahl k:\n\n$$${intT} = k\\cdot\\int ${s.uT}\\,du$$\n\nWie groß ist k? Bruch oder drei Nachkommastellen.`,
      loesung: bw(s.k), toleranz: T3, fehler: kFehler, falsch: `Teile die Zahl vor dem x-Faktor durch die Zahl in $u' = ${s.dT}$.`,
      tipps: [`Vor dem x-Faktor steht ${s.c}, in $u'$ steht ${s.d}.`, `$k = \\frac{${s.c}}{${s.d}}$`], richtig: `${lob()} $k = ${bT(s.k)}$, und kein x ist mehr übrig.` },
  ];
}
function stammWahl(s) {
  const opt = [{ text: `$${s.FuT}$`, richtig: true }];
  if (s.ablU) opt.push({ text: `$${s.ablU}$`, hinweis: "Das ist die Ableitung, nicht die Stammfunktion." });
  if (!eins(s.Fk)) opt.push({ text: `$${s.bareU}$`, hinweis: `Leite sie ab. ${s.Fk[0] < 0 ? "Das Vorzeichen stimmt nicht." : "Es fehlt ein Faktor."}` });
  if (s.art === "exp") opt.push({ text: "$\\frac{e^{u+1}}{u+1}$", hinweis: "Die Potenzregel gilt nicht für e-Funktionen: u steht im Exponenten. $e^u$ ist ihre eigene Stammfunktion." });
  if (opt.length < 3) opt.push({ text: `$u\\cdot ${s.uT}$`, hinweis: "Leite ab: Mit der Produktregel entstehen zwei Summanden." });
  return { id: "stamm", typ: "wahl", text: `Jetzt ein Grundintegral. Welche Stammfunktion hat $${s.uT}$?`, optionen: opt,
    tipps: ["Welche Funktion ergibt abgeleitet genau $" + s.uT + "$?"], richtig: `${lob()} $${s.grund}$.` };
}

/* ---------- unbestimmt ---------- */
function unbestimmt(a) {
  const s = a.sok, intT = `\\int ${s.hT}\\,dx`;
  const schritte = anfangsSchritte(s, intT);
  schritte.push(stammWahl(s));
  if (!eins(s.Fk)) schritte.push({ id: "K", typ: "zahl", text: `Zusammen: $${bT(s.k)}\\cdot ${s.FuT}$. Welche Zahl steht dann vor $${s.bareU}$? Bruch oder drei Nachkommastellen.`,
    loesung: bw(s.K), toleranz: T3, falsch: "Multipliziere die beiden Faktoren.",
    fehler: fehlerAus([{ wert: bw(s.k), text: "Der Faktor aus dem Grundintegral fehlt." }, { wert: bw(s.Fk), text: "Der Faktor k fehlt." }, { wert: -bw(s.K), text: "Prüfe das Vorzeichen." }], bw(s.K), T3),
    tipps: [`$${bT(s.k)}\\cdot ${bT(s.Fk)}$`], richtig: `${lob()} $${koef(s.K)}${s.bareU}$.` });
  schritte.push({ id: "zurueck", typ: "wahl", text: `Wir haben $${koef(s.K)}${s.bareU} + C$. Ist das schon die Antwort?`,
    optionen: [
      { text: `Nein: u durch $${s.gT}$ ersetzen`, richtig: true },
      { text: "Ja, fertig", hinweis: "Gefragt ist eine Stammfunktion in x. u war nur ein Hilfsname." },
      { text: "Nein: u durch x ersetzen", hinweis: `u ist nicht x, sondern $${s.gT}$.` }],
    tipps: ["In welcher Variablen ist die Aufgabe gestellt?"], richtig: `${lob()} Und so entsteht die [[Stammfunktion|Sf]].`, zeigeNachRichtig: ["Sf"] });
  schritte.push({ id: "schluss", typ: "rede", text: `So halten wir fest, {name}: $$${intT} = ${s.ergT}$$ Leite zur Probe ab: äußere Ableitung mal innere Ableitung $${s.dT}$, und der Faktor gleicht die Zahl aus. Schreibe dir den Hefteintrag ab.`, zeige: ["Sf"] });
  const selbst = [{ text: "Faktor k vor dem u-Integral (Bruch oder drei Nachkommastellen):", kurz: "k", loesung: bw(s.k), toleranz: T3, ab: "k", fehler: schritte.find((x) => x.id === "k").fehler }];
  if (!eins(s.Fk)) selbst.push({ text: `Zahl vor $${s.bareG}$ im Ergebnis:`, kurz: "Faktor im Ergebnis", loesung: bw(s.K), toleranz: T3, ab: "K" });
  return gespraech(a, {
    titel: "Integration durch Substitution",
    aufgabe: `Bestimme $${intT}$.`, gegeben: `$h(x) = ${s.hT}$`,
    vorwissen: ["Kettenregel", "Grundintegrale"], merkzettel: [MERK_S.ketten, MERK_S.sub],
    selbst,
    hefteintrag: `$u = ${s.gT}$, $du = ${s.dT}\\,dx$\n\n$${intT} = ${bT(s.k)}\\int ${s.uT}\\,du = ${bT(s.k)}\\cdot ${s.FuT} + C$\n\n$= ${s.ergT}$`,
    rueckblick: {
      titel: "Kettenregel rückwärts",
      frage: `Wie findet man eine Stammfunktion von $${s.hT}$?`,
      schritte: [
        { kurz: "Erkennen", text: `Verkettet ist $${s.ganzT}$, das Innere $u = ${s.gT}$ hat die Ableitung $${s.dT}$.` },
        { kurz: "Ersetzen", text: `Mit $dx = \\frac{du}{${s.dT}}$ kürzt sich jedes x, es bleibt $${bT(s.k)}\\int ${s.uT}\\,du$.` },
        { kurz: "Integrieren", text: `Ein Grundintegral: $${s.grund}$.` },
        { kurz: "Zurück", text: `u wieder durch $${s.gT}$ ersetzen: $${s.ergT}$.` },
      ],
      einsicht: "Substitution ist die Kettenregel rückwärts: $$\\int f(g(x))\\,g'(x)\\,dx = F(g(x)) + C$$",
      mitnehmen: "Ich suche das Innere und prüfe, ob seine Ableitung bis auf eine Zahl danebensteht. Am Ende leite ich zur Probe ab.",
    },
    geogebra: zeichnung(s, false), schritte,
  });
}

/* ---------- bestimmt ---------- */
function bestimmt(a) {
  const s = a.sok, intT = `\\int_{${s.x1}}^{${s.x2}} ${s.hT}\\,dx`;
  const schritte = anfangsSchritte(s, `\\int ${s.hT}\\,dx`);
  const uFehler = (xa) => [{ wert: xa, toleranz: 0.4, hinweis: "Das ist die alte Grenze, ein x-Wert. Setze sie in u ein." }];
  schritte.push(
    { id: "u1", typ: "zahl", text: `Die Grenzen ${s.x1} und ${s.x2} sind x-Werte. Für das neue Integral brauchen wir u-Werte. Welchen Wert hat $u = ${s.gT}$ bei $x = ${s.x1}$?`,
      loesung: s.u1, toleranz: 0.4, fehler: s.u1 === s.x1 ? [] : uFehler(s.x1), falsch: `Setze $x = ${s.x1}$ in $${s.gT}$ ein.`, tipps: [`$u(${s.x1})$`], richtig: `${lob()} Die untere Grenze ist $u_1 = ${s.u1}$.` },
    { id: "u2", typ: "zahl", text: `Und bei $x = ${s.x2}$?`, loesung: s.u2, toleranz: 0.4, fehler: s.u2 === s.x2 ? [] : uFehler(s.x2),
      falsch: `Setze $x = ${s.x2}$ in $${s.gT}$ ein.`, tipps: [`$u(${s.x2})$`], richtig: `${lob()} Also $$${intT} = ${bT(s.k)}\\int_{${s.u1}}^{${s.u2}} ${s.uT}\\,du$$` },
    { id: "bild", typ: "wahl", text: `Sieh dir die [[neue Fläche|B]] unter $${bT(s.k)}\\cdot ${s.uT}$ an. Die waagrechte Achse zählt dort u. Was gilt für sie und die [[alte Fläche|A]]?`,
      zeige: ["gf", "B"],
      optionen: [
        { text: "Sie haben denselben Inhalt", richtig: true },
        { text: "Die breitere ist größer", hinweis: "Breiter heißt hier auch flacher. Die Substitution verzerrt die Fläche, ihr Inhalt bleibt." },
        { text: "Sie haben nichts miteinander zu tun", hinweis: "Die Gleichung oben sagt: Beide Integrale sind gleich." }],
      tipps: ["Lies die Gleichung: links das alte, rechts das neue Integral."], richtig: `${lob()} Andere Form, gleicher Inhalt.` },
    stammWahl(s),
    { id: "wert", typ: "zahl", text: `Rechne aus: $${bT(s.k)}\\Bigl[${s.FuT}\\Bigr]_{${s.u1}}^{${s.u2}}$. Drei Nachkommastellen.`,
      loesung: s.V, toleranz: T3, falsch: "Obere Grenze einsetzen, untere Grenze einsetzen, abziehen, mit k malnehmen.",
      fehler: fehlerAus([
        { wert: s.altV, text: "Du hast die alten x-Grenzen eingesetzt. Zu u gehören die neuen." },
        { wert: s.V / bw(s.k), text: "Der Faktor k fehlt." },
        { wert: -s.V, text: "Vorzeichen: obere minus untere Grenze." }], s.V, T3),
      tipps: [`Setze $u = ${s.u2}$ und $u = ${s.u1}$ in $${s.FuT}$ ein.`], richtig: `${lob()} $${intT} \\approx ${dz(s.V)}$.` },
    { id: "schluss", typ: "rede", text: `So halten wir fest, {name}: Mit den neuen Grenzen rechnen wir in u zu Ende. Zurücksubstituieren ist nicht nötig.\n\n$$${intT} = ${bT(s.k)}\\int_{${s.u1}}^{${s.u2}} ${s.uT}\\,du \\approx ${dz(s.V)}$$ Schreibe dir den Hefteintrag ab.` },
  );
  return gespraech(a, {
    titel: "Grenzen mitnehmen",
    aufgabe: `Berechne $${intT}$.`, gegeben: `$h(x) = ${s.hT}$, von $x = ${s.x1}$ bis $x = ${s.x2}$`,
    vorwissen: ["Kettenregel", "Grundintegrale", "Hauptsatz: $\\int_a^b f(x)\\,dx = F(b) - F(a)$"], merkzettel: [MERK_S.sub, MERK_S.grenzen],
    selbst: [
      { text: "Faktor k (Bruch oder drei Nachkommastellen):", kurz: "k", loesung: bw(s.k), toleranz: T3, ab: "k" },
      { text: "Neue untere Grenze $u_1$:", kurz: "$u_1$", loesung: s.u1, toleranz: 0.4, ab: "u1" },
      { text: "Neue obere Grenze $u_2$:", kurz: "$u_2$", loesung: s.u2, toleranz: 0.4, ab: "u2" },
      { text: "Wert des Integrals (drei Nachkommastellen):", kurz: "Wert", loesung: s.V, toleranz: T3, ab: "wert", fehler: fehlerAus([{ wert: s.altV, text: "Alte Grenzen in die u-Stammfunktion eingesetzt." }], s.V, T3, "u1") },
    ],
    hefteintrag: `$u = ${s.gT}$, $du = ${s.dT}\\,dx$\n\n$x = ${s.x1} \\Rightarrow u = ${s.u1}$, $x = ${s.x2} \\Rightarrow u = ${s.u2}$\n\n$${intT} = ${bT(s.k)}\\int_{${s.u1}}^{${s.u2}} ${s.uT}\\,du = ${bT(s.k)}\\Bigl[${s.FuT}\\Bigr]_{${s.u1}}^{${s.u2}} \\approx ${dz(s.V)}$`,
    rueckblick: {
      titel: "Zwei Flächen, ein Inhalt",
      frage: `Wie berechnet man $${intT}$?`,
      schritte: [
        { kurz: "Erkennen", text: `Das Innere ist $u = ${s.gT}$, seine Ableitung $${s.dT}$ steht bis auf eine Zahl daneben.` },
        { kurz: "Ersetzen", text: `Mit $dx = \\frac{du}{${s.dT}}$ bleibt $${bT(s.k)}\\int ${s.uT}\\,du$.` },
        { kurz: "Grenzen", text: `Die x-Grenzen werden zu u-Grenzen: $u(${s.x1}) = ${s.u1}$, $u(${s.x2}) = ${s.u2}$.` },
        { kurz: "Das Bild", text: "Unter dem neuen Graphen liegt eine andere Fläche mit demselben Inhalt." },
        { kurz: "Ausrechnen", text: `In u zu Ende: $\\approx ${dz(s.V)}$.` },
      ],
      einsicht: "Die Grenzen wandern mit: $$\\int_a^b f(g(x))\\,g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du$$",
      mitnehmen: "Nach dem Substituieren frage ich: Gehören meine Grenzen noch zur Variablen, nach der ich integriere?",
    },
    geogebra: zeichnung(s, true),
    werte: [
      { text: "Integral über x", objekt: "A", ab: "wert", wann: "richtig", stellen: 3 },
      { text: "Integral über u", objekt: "B", ab: "wert", wann: "richtig", stellen: 3 },
    ],
    schritte,
  });
}

BAU["s-idee"] = unbestimmt;
BAU["s-erkennen"] = unbestimmt;
BAU["s-verfahren"] = unbestimmt;
BAU["s-linear"] = unbestimmt;
BAU["s-grenzen"] = bestimmt;
BAU["s-fehler"] = bestimmt;
BAU["s-mix"] = (a) => BAU[a.herkunft](a);
})(typeof window !== "undefined" ? window : globalThis);
