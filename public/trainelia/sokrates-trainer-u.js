/* =====================================================================
   SOKRATISCHER TRAINER · Kapitel 2 „Stochastische Unabhängigkeit“
   Baukästen je Station (u-…); Helfer und Zeichnungen aus sokrates-trainer.js.
   ===================================================================== */
(function (g) {
"use strict";
const S = g.TraineliaSokrates;
if (!S) return;
const { BAU, frage, feld, fehlerAus, gespraech, Zeichnung, baumZ, tafelZ, flaecheZ, rasterZ, legende, spalte,
  dz, fr, frRoh, ov, tx, pzT, gross, lob, T2, T3, T4, GANZ, MERK } = S;
const unab0 = "Nacheinander heißt nicht unabhängig. Entscheidend ist allein der Vergleich der beiden Zahlen.";

/* ---------- Die Idee: mit und ohne Zurücklegen ---------- */
BAU["u-idee"] = (a) => {
  const { art, cnt, name, mit, i, j, satzA, satzB } = a.sok, n = cnt[0] + cnt[1];
  const z2 = mit ? [[cnt[0], cnt[1]], [cnt[0], cnt[1]]] : [[cnt[0] - 1, cnt[1]], [cnt[0], cnt[1] - 1]], n2 = mit ? n : n - 1;
  const pBA = z2[i][j] / n2, pB = cnt[j] / n;
  const N = name.map(tx), ding = { urne: "Kugeln", lose: "Lose", karten: "Karten" }[art];
  const z = Zeichnung();
  const sicht = baumZ(z, { s1: N, s2: [N, N], p1: [fr(cnt[0], n), fr(cnt[1], n)], p2: z2.map((zz) => zz.map((x) => fr(x, n2))) }, { p1: true });
  const ast = `a${i + 1}${j + 1}`;
  const falschZahl = i === j ? cnt[j] : cnt[j] - 1;
  const urneOpt = mit
    ? [{ text: `Wie am Anfang: ${n} ${ding}, davon ${cnt[j]} „${name[j]}“`, richtig: true },
       { text: `Eins weniger: ${n - 1} ${ding}`, hinweis: "So wäre es ohne Zurücklegen. Hier kommt der erste Zug zurück." },
       { text: `Die Sorte „${name[i]}“ ist jetzt häufiger`, hinweis: "Zurücklegen stellt den Anfang wieder her. Woher sollte eine Sorte dazukommen?" }]
    : [{ text: `${n - 1} ${ding}, davon ${z2[i][j]} „${name[j]}“`, richtig: true },
       { text: `Wie am Anfang: ${n} ${ding}`, hinweis: "So wäre es mit Zurücklegen. Hier fehlt der erste Zug." },
       { text: `${n - 1} ${ding}, davon ${falschZahl} „${name[j]}“`, hinweis: i === j ? `Der erste Zug war „${name[i]}“. Er fehlt jetzt genau bei dieser Sorte.` : `Der erste Zug war „${name[i]}“, nicht „${name[j]}“. Bei „${name[j]}“ fehlt nichts.` }];
  const unabText = mit ? "unabhängig, denn $P(B \\mid A) = P(B)$" : "abhängig, denn $P(B \\mid A) \\neq P(B)$";
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Zwei Züge nacheinander, ${mit ? "mit" : "ohne"} Zurücklegen.\n\nA: „${satzA}“ B: „${satzB}“\n\nUnsere Frage: Ändert das Wissen über den ersten Zug die Chance beim zweiten?` },
    { id: "urne", typ: "wahl", text: `Angenommen, der erste Zug war „${name[i]}“. Wie sieht es vor dem [[zweiten Zug|a${i + 1}1,a${i + 1}2]] aus?`, optionen: urneOpt,
      tipps: [mit ? "Was geschieht mit dem ersten Zug?" : "Welcher Zug fehlt nach dem ersten Ziehen?"],
      richtig: `${lob()} Darum stehen an den zweiten Ästen diese Werte.`, zeigeNachRichtig: ["q11", "q12", "q21", "q22"] },
    { id: "ba", typ: "zahl", text: `A ist eingetreten. Am [[Ast „${name[j]}“ hinter „${name[i]}“|${ast}]] steht $P(B \\mid A)$. Wie groß ist sie? Bruch oder drei Nachkommastellen.`,
      loesung: pBA, toleranz: T3, falsch: "Es zählt nur der zweite Zug, mit dem Stand nach dem ersten.",
      fehler: fehlerAus(feld(a, "ba").fallen, pBA, T3),
      tipps: [`Vor dem zweiten Zug: ${n2} ${ding}, davon ${z2[i][j]} „${name[j]}“.`, `$${frRoh(z2[i][j], n2)}$`],
      richtig: `${lob()} $P(B \\mid A) = ${fr(z2[i][j], n2)} \\approx ${dz(pBA)}$.` },
    { id: "bedeutung", typ: "wahl", text: "Nun $P(B)$, ohne Strich. Wonach fragt sie?",
      optionen: [
        { text: "Nach dem zweiten Zug, ohne zu wissen, was zuerst kam", richtig: true },
        { text: "Nach dem zweiten Zug, wenn A eingetreten ist", hinweis: "Das ist $P(B \\mid A)$, die haben wir schon. Ohne Strich gibt es kein Vorwissen." },
        { text: "Nach beiden Zügen zugleich", hinweis: "Das wäre $P(A \\cap B)$, ein ganzer Pfad." },
      ],
      tipps: ["Ohne Strich gibt es keine Bedingung."], richtig: `Genau. Darum zählen [[beide Pfade|a1,a${1}${j + 1},a2,a2${j + 1}]], die bei „${name[j]}“ enden.` },
    { id: "b", typ: "zahl", text: "Wie groß ist $P(B)$? Bruch oder drei Nachkommastellen.",
      loesung: pB, toleranz: T3, falsch: `Addiere die beiden Pfade, die beim zweiten Zug auf „${name[j]}“ enden.`,
      fehler: fehlerAus(feld(a, "b").fallen, pB, T3),
      tipps: [`$${fr(cnt[0], n)} \\cdot ${fr(z2[0][j], n2)} + ${fr(cnt[1], n)} \\cdot ${fr(z2[1][j], n2)}$`],
      richtig: `${lob()} $P(B) = ${fr(cnt[j], n)} \\approx ${dz(pB)}$. Ohne Vorwissen ist der zweite Zug so gut wie der erste.` },
    { id: "urteil", typ: "wahl", text: `Vergleiche $P(B \\mid A) \\approx ${dz(pBA)}$ mit $P(B) \\approx ${dz(pB)}$. Was folgt?`,
      optionen: [
        { text: `A und B sind ${unabText}`, richtig: true },
        { text: mit ? "A und B sind abhängig, denn der zweite Zug kommt nach dem ersten" : "A und B sind unabhängig, denn jeder Zug ist Zufall", hinweis: unab0 },
        { text: mit ? "A und B sind abhängig, denn $P(B \\mid A) \\neq P(B)$" : "A und B sind unabhängig, denn $P(B \\mid A) = P(B)$", hinweis: `Sieh noch einmal hin: ${dz(pBA)} und ${dz(pB)}. Sind sie gleich?` },
      ],
      tipps: ["Unabhängig heißt: Das Wissen über A ändert die Wahrscheinlichkeit von B nicht."],
      richtig: mit ? "So ist es. Zurücklegen stellt den Anfang wieder her: Der erste Zug verrät nichts über den zweiten." : "So ist es. Ohne Zurücklegen verändert der erste Zug die Urne, und damit die Chance beim zweiten." },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: A und B heißen stochastisch unabhängig, wenn $$P(B \\mid A) = P(B).$$ Mit Zurücklegen gilt das, ohne Zurücklegen nicht. Schreibe dir den Hefteintrag ab." },
  ];
  return gespraech(a, {
    titel: "Was heißt unabhängig?",
    gegeben: `${cnt[0]} „${name[0]}“, ${cnt[1]} „${name[1]}“; ${mit ? "mit" : "ohne"} Zurücklegen`,
    vorwissen: ["Baumdiagramm und Pfadregeln", "Bedingte Wahrscheinlichkeit $P(B \\mid A)$"], merkzettel: [MERK.unab],
    selbst: [frage(feld(a, "ba"), "ba", { kurz: "$P(B \\mid A)$" }), frage(feld(a, "b"), "bedeutung", { kurz: "$P(B)$" })],
    hefteintrag: `${mit ? "Mit" : "Ohne"} Zurücklegen; A: ${satzA} B: ${satzB}\n\n$P(B \\mid A) = ${fr(z2[i][j], n2)} \\approx ${dz(pBA)}$\n\n$P(B) = ${fr(cnt[0], n)} \\cdot ${fr(z2[0][j], n2)} + ${fr(cnt[1], n)} \\cdot ${fr(z2[1][j], n2)} = ${fr(cnt[j], n)} \\approx ${dz(pB)}$\n\n${mit ? "Gleich: A und B sind unabhängig." : "Verschieden: A und B sind abhängig."}`,
    rueckblick: {
      titel: mit ? "Zurücklegen macht unabhängig" : "Der erste Zug verrät etwas",
      frage: "Ändert das Wissen über den ersten Zug die Chance beim zweiten?",
      schritte: [
        { kurz: "Mit Vorwissen", text: `Ist A eingetreten, bleiben vor dem zweiten Zug ${n2} ${ding}: $P(B | A) = ${frRoh(z2[i][j], n2)} \\approx ${dz(pBA)}$.` },
        { kurz: "Ohne Vorwissen", text: `P(B) addiert beide Pfade zum zweiten Zug und ergibt $${frRoh(cnt[j], n)} \\approx ${dz(pB)}$.` },
        { kurz: "Vergleichen", text: mit ? "Beide Werte sind gleich. Das Wissen über A ändert nichts." : "Die Werte sind verschieden. Das Wissen über A ändert die Chance." },
        { kurz: "Benennen", text: mit ? "A und B sind stochastisch unabhängig." : "A und B sind stochastisch abhängig." },
      ],
      einsicht: "Unabhängig heißt: Vorwissen über A ändert nichts an B. $$P(B | A) = P(B)$$",
      mitnehmen: "Ich vergleiche die Wahrscheinlichkeit mit und ohne Vorwissen. Nacheinander heißt noch nicht abhängig.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* ---------- Prüfen an der Tafel ---------- */
BAU["u-tafel"] = (a) => {
  const { w, k, N, unab, umgekehrt } = a.sok;
  const [X, Y] = umgekehrt ? ["B", "A"] : ["A", "B"];
  const nX = umgekehrt ? w[2][0] : w[0][2], nY = umgekehrt ? w[0][2] : w[2][0], nXY = w[0][0];
  const pX = nX / N, pXY = nXY / nY, prod = (w[0][2] * w[2][0]) / N / N, pAB = nXY / N;
  const randX = umgekehrt ? "f20" : "f02", randY = umgekehrt ? "f02" : "f20";
  const gruppeY = umgekehrt ? "f00,f01,f02" : spalte(0);
  const z = Zeichnung();
  const sicht = tafelZ(z, { kopf: ["B", ov("B")], seite: ["A", ov("A")], w: w.map((zz) => zz.map(String)), legende: legende(k) });
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Sind A und B unabhängig? Wir prüfen es an der [[Tafel|gitter]].\n\nDie Frage lautet: Ändert das Wissen über ${Y} die Wahrscheinlichkeit von ${X}?` },
    { id: "px", typ: "zahl", text: `Zuerst ohne Vorwissen: Wie groß ist $P(${X})$? Drei Nachkommastellen.`,
      loesung: pX, toleranz: T3, falsch: `Der [[Randwert von ${X}|${randX}]] geteilt durch ${N}.`,
      fehler: fehlerAus(feld(a, "px").fallen, pX, T3),
      tipps: [`$${frRoh(nX, N)}$`], richtig: `${lob()} $P(${X}) = ${frRoh(nX, N)} \\approx ${dz(pX)}$.`, zeige: [randX] },
    { id: "nenner", typ: "wahl", text: `Nun mit Vorwissen: $P(${X} \\mid ${Y})$. Durch welche Zahl teilst du?`,
      optionen: [
        { text: `Durch ${nY}, die Zahl mit ${Y}`, richtig: true },
        { text: `Durch ${N}, die Zahl aller`, hinweis: `Das ergäbe den Anteil an allen. Unter der Bedingung ${Y} zählt nur die Gruppe ${Y}.` },
        { text: `Durch ${nX}, die Zahl mit ${X}`, hinweis: `Das ergäbe $P(${Y} \\mid ${X})$. Hinter dem Strich steht ${Y}.` },
      ],
      tipps: ["Hinter dem Strich steht die Gruppe. Ihre Anzahl ist der Nenner."],
      richtig: `${lob()} Die [[Gruppe ${Y}|${gruppeY}]] hat ${nY} Mitglieder.`, zeige: gruppeY.split(","), verberge: [randX] },
    { id: "pxy", typ: "zahl", text: `Wie groß ist $P(${X} \\mid ${Y})$? Drei Nachkommastellen.`,
      loesung: pXY, toleranz: T3, falsch: `Das Feld „A und B“ geteilt durch ${nY}.`,
      fehler: fehlerAus(feld(a, "pxy").fallen, pXY, T3),
      tipps: [`$${frRoh(nXY, nY)}$`], richtig: `${lob()} $P(${X} \\mid ${Y}) = ${frRoh(nXY, nY)} \\approx ${dz(pXY)}$.` },
    { id: "urteil", typ: "wahl", text: `Vergleiche: $P(${X}) \\approx ${dz(pX)}$ und $P(${X} \\mid ${Y}) \\approx ${dz(pXY)}$. Was folgt?`,
      optionen: [
        { text: unab ? "Unabhängig: Beide Werte sind gleich" : "Abhängig: Die Werte sind verschieden", richtig: true },
        { text: unab ? "Abhängig: Die Werte sind verschieden" : "Unabhängig: Die Werte sind gleich", hinweis: `Sieh noch einmal hin: ${dz(pX)} und ${dz(pXY)}.` },
        { text: "Das entscheidet erst die Produktprobe", hinweis: "Der Vergleich entscheidet schon. Die Produktprobe ist gleichwertig und führt immer zum selben Urteil." },
      ],
      tipps: ["Unabhängig heißt: Das Wissen über " + Y + " ändert nichts."],
      richtig: unab ? `So ist es. Ob ${Y} eintritt, ändert nichts an ${X}.` : `So ist es. Unter ${Y} ist ${X} ${pXY > pX ? "wahrscheinlicher" : "unwahrscheinlicher"}.`, verberge: gruppeY.split(",") },
    { id: "produkt", typ: "zahl", text: "Zur Gegenprobe die Produktform: Wie groß ist $P(A) \\cdot P(B)$? Runde auf vier Nachkommastellen.",
      loesung: prod, toleranz: T4, falsch: "Multipliziere die beiden Randanteile von A und B.",
      fehler: fehlerAus([{ wert: pAB, text: "Das ist P(A ∩ B) aus der Tafel. Gefragt ist das Produkt der beiden Randanteile." }, { wert: (w[0][2] + w[2][0]) / N, text: "Du hast addiert. Gefragt ist das Produkt." }], prod, T4),
      tipps: [`$${frRoh(w[0][2], N)} \\cdot ${frRoh(w[2][0], N)}$`],
      richtig: `${lob()} $P(A) \\cdot P(B) \\approx ${dz(prod, 4)}$, und $P(A \\cap B) = ${frRoh(nXY, N)} \\approx ${dz(pAB, 4)}$. ${unab ? "Gleich, also unabhängig." : "Verschieden, also abhängig."} Beide Wege sagen dasselbe.`, zeige: ["f00", "f02", "f20"] },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Prüfe $P(A \\mid B) = P(A)$ oder $P(A \\cap B) = P(A) \\cdot P(B)$. Gilt eins, gilt auch das andere. Schreibe dir den Hefteintrag ab." },
  ];
  return gespraech(a, {
    titel: "Unabhängigkeit an der Tafel prüfen",
    gegeben: `${N} ${k.wer}; A: ${k.A}, B: ${k.B}`,
    vorwissen: ["Vierfeldertafel lesen", "Bedingte Wahrscheinlichkeit"], merkzettel: [MERK.unab, MERK.bedingt],
    selbst: [frage(feld(a, "px"), "px", { kurz: `$P(${X})$` }), frage(feld(a, "pxy"), "nenner", { kurz: `$P(${X} \\mid ${Y})$` })],
    hefteintrag: `$P(${X}) = ${frRoh(nX, N)} \\approx ${dz(pX)}$\n\n$P(${X} \\mid ${Y}) = ${frRoh(nXY, nY)} \\approx ${dz(pXY)}$\n\nProbe: $P(A) \\cdot P(B) \\approx ${dz(prod, 4)}$, $P(A \\cap B) \\approx ${dz(pAB, 4)}$\n\n${unab ? "Gleich: A und B sind unabhängig." : "Verschieden: A und B sind abhängig."}`,
    rueckblick: {
      titel: "Mit und ohne Vorwissen",
      frage: "Wie erkennt man an einer Vierfeldertafel, ob zwei Merkmale unabhängig sind?",
      schritte: [
        { kurz: "Ohne Vorwissen", text: `Unter allen: $P(${X}) = ${frRoh(nX, N)} \\approx ${dz(pX)}$.` },
        { kurz: "Mit Vorwissen", text: `Nur in der Gruppe ${Y}: $P(${X} | ${Y}) = ${frRoh(nXY, nY)} \\approx ${dz(pXY)}$.` },
        { kurz: "Urteilen", text: unab ? "Beide Werte sind gleich: unabhängig." : "Die Werte sind verschieden: abhängig." },
        { kurz: "Gegenprobe", text: unab ? `Das Produkt der Ränder $\\approx ${dz(prod, 4)}$ stimmt mit $P(A ∩ B) \\approx ${dz(pAB, 4)}$ überein.` : `Das Produkt der Ränder $\\approx ${dz(prod, 4)}$ weicht von $P(A ∩ B) \\approx ${dz(pAB, 4)}$ ab.` },
      ],
      einsicht: "Zwei gleichwertige Proben führen zum selben Urteil: $$P(A | B) = P(A) \\quad \\text{oder} \\quad P(A ∩ B) = P(A) \\cdot P(B)$$",
      mitnehmen: "Ich vergleiche nie P(A ∩ B) mit P(A | B): Das eine zählt unter allen, das andere in einer Gruppe.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* ---------- Ergänzen bei vorausgesetzter Unabhängigkeit ---------- */
BAU["u-ergaenzen"] = (a) => (a.sok.v === "rueck" ? ergaenzenRueck(a) : ergaenzenTafel(a));

function ergaenzenTafel(a) {
  const { k, pa, pb } = a.sok, pab = pa * pb;
  const t = [[pab, pa - pab, pa], [pb - pab, (1 - pa) * (1 - pb), 1 - pa], [pb, 1 - pb, 1]];
  const z = Zeichnung(), EX = 0.0006;
  const sicht = tafelZ(z, { kopf: ["B", ov("B")], seite: ["A", ov("A")], w: t.map((zz) => zz.map((x) => dz(x, 4))), an: new Set(["0,2", "2,0", "2,2"]), legende: legende(k) });
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Bekannt sind nur die Ränder: $P(A) = ${dz(pa)}$ und $P(B) = ${dz(pb)}$. Dazu die Annahme: A und B sind unabhängig.\n\nMit ihr füllen wir die ganze [[Tafel|gitter]].` },
    { id: "annahme", typ: "wahl", text: "Was folgt aus der Unabhängigkeit für das [[Feld oben links|f00]]?",
      optionen: [
        { text: "$P(A \\cap B) = P(A) \\cdot P(B)$", richtig: true },
        { text: "$P(A \\cap B) = P(A) + P(B)$", hinweis: "Die Summe wäre größer als P(A). Kann „A und B“ häufiger sein als „A“ allein?" },
        { text: "Ohne weitere Angabe lässt es sich nicht berechnen", hinweis: "Die Annahme der Unabhängigkeit ist die fehlende Angabe. Was besagt sie in Produktform?" },
      ],
      tipps: ["Unabhängig heißt in Produktform …"], richtig: `${lob()} Das Innenfeld ist das Produkt seiner Ränder.`, zeige: ["f00"] },
    { id: "f00", typ: "zahl", text: "Wie groß ist $P(A \\cap B)$? Gib den Wert genau an.",
      loesung: pab, toleranz: EX, falsch: "Multipliziere die beiden Randwerte.",
      fehler: fehlerAus([{ wert: pa + pb, text: "Addiert statt multipliziert. Bei Unabhängigkeit gilt P(A ∩ B) = P(A) · P(B)." }], pab, EX),
      tipps: [`$${dz(pa)} \\cdot ${dz(pb)}$`], richtig: `${lob()} $${dz(pa)} \\cdot ${dz(pb)} = ${dz(pab, 4)}$.`, zeigeNachRichtig: ["z00"] },
    { id: "f01", typ: "zahl", text: "Der Rest geht wie immer über Zeilen und Spalten. Was steht im [[Feld „A und $\\overline{B}$“|f01]]? Genau.",
      loesung: t[0][1], toleranz: EX, falsch: "In der Zeile A gilt: innen zusammen ergibt den Rand.",
      fehler: fehlerAus([{ wert: pa + pab, text: "Du hast addiert. Der Rand ist schon bekannt: Ziehe ab." }], t[0][1], EX),
      tipps: [`$${dz(pa)} - ${dz(pab, 4)}$`], richtig: `${lob()} $${dz(pa)} - ${dz(pab, 4)} = ${dz(t[0][1], 4)}$.`, zeige: ["f01"], verberge: ["f00"], zeigeNachRichtig: ["z01"] },
    { id: "f10", typ: "zahl", text: "Und im [[Feld „$\\overline{A}$ und B“|f10]], über die Spalte B? Genau.",
      loesung: t[1][0], toleranz: EX, falsch: "In der Spalte B gilt: oben + unten = Summe.",
      fehler: fehlerAus([{ wert: pb + pab, text: "Du hast addiert. Ziehe vom Rand ab." }], t[1][0], EX),
      tipps: [`$${dz(pb)} - ${dz(pab, 4)}$`], richtig: `${lob()} $${dz(t[1][0], 4)}$. Die Ränder für $\\overline{A}$ und $\\overline{B}$ ergänzen sich zu 1: $${dz(1 - pa)}$ und $${dz(1 - pb)}$.`, zeige: ["f10"], verberge: ["f01"], zeigeNachRichtig: ["z10", "z12", "z21"] },
    { id: "f11", typ: "zahl", text: "Bleibt das [[Feld „weder A noch B“|f11]]. Was steht dort? Genau.",
      loesung: t[1][1], toleranz: EX, falsch: "Über die Zeile $\\overline{A}$: Rand minus das linke Feld.",
      fehler: fehlerAus([{ wert: 1 - pab, text: "Das ist 1 − P(A ∩ B), also „nicht beides“. Gesucht ist „weder A noch B“." }, { wert: 1 - pa - pb, text: "Du hast P(A ∩ B) nicht wieder dazugezählt. Rechne über die Zeile." }], t[1][1], EX),
      tipps: [`$${dz(1 - pa)} - ${dz(t[1][0], 4)}$`], richtig: `${lob()} $${dz(t[1][1], 4)}$.`, zeige: ["f11"], verberge: ["f10"], zeigeNachRichtig: ["z11"] },
    { id: "probe", typ: "wahl", text: "Ist auch das [[Feld „weder A noch B“|f11]] ein Produkt seiner Ränder?",
      optionen: [
        { text: `Ja: $${dz(1 - pa)} \\cdot ${dz(1 - pb)} = ${dz(t[1][1], 4)}$`, richtig: true },
        { text: "Nein, das gilt nur oben links", hinweis: `Rechne nach: $${dz(1 - pa)} \\cdot ${dz(1 - pb)}$.` },
        { text: "Nur wenn P(A) und P(B) gleich sind", hinweis: `Rechne mit den Zahlen dieser Tafel nach: $${dz(1 - pa)} \\cdot ${dz(1 - pb)}$.` },
      ],
      tipps: [`$${dz(1 - pa)} \\cdot ${dz(1 - pb)}$`], richtig: "So ist es. Mit A und B sind auch $\\overline{A}$ und $\\overline{B}$ unabhängig, jedes Innenfeld ist ein Produkt." },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Ist Unabhängigkeit vorausgesetzt, gilt $$P(A \\cap B) = P(A) \\cdot P(B).$$ Den Rest liefert die Tafel. Schreibe dir den Hefteintrag ab." },
  ];
  const tf = a.tafelFelder || [], f = (key) => tf.find((x) => x.key === key);
  const sel = [["0,0", "A und B", "annahme"], ["0,1", "A und $\\overline{B}$", "f01"], ["1,0", "$\\overline{A}$ und B", "f10"], ["1,1", "$\\overline{A}$ und $\\overline{B}$", "f11"]]
    .filter(([key]) => f(key)).map(([key, kurz, ab]) => ({ text: `${kurz} (zwei Nachkommastellen):`, kurz, loesung: f(key).wert, toleranz: T2, ab, fehler: fehlerAus(f(key).fallen, f(key).wert, T2, ab) }));
  return gespraech(a, {
    titel: "Tafel ergänzen bei Unabhängigkeit",
    gegeben: `$P(A) = ${dz(pa)}$, $P(B) = ${dz(pb)}$; A und B unabhängig`,
    vorwissen: ["Anteilstafel", "Produktform der Unabhängigkeit"], merkzettel: [MERK.unab, MERK.tafel],
    selbst: sel,
    hefteintrag: `Unabhängig: $P(A \\cap B) = ${dz(pa)} \\cdot ${dz(pb)} = ${dz(pab, 4)}$\n\n` + [["", "B", "$\\overline{B}$", "Summe"], ["A", ...t[0]], ["$\\overline{A}$", ...t[1]], ["Summe", ...t[2]]].map((zz) => zz.map((x) => (typeof x === "number" ? `$${dz(x, 4)}$` : x)).join(" | ")).join("\n"),
    rueckblick: {
      titel: "Aus den Rändern die ganze Tafel",
      frage: "Wie füllt man eine Anteilstafel, wenn nur die Ränder bekannt sind?",
      schritte: [
        { kurz: "Das Hindernis", text: "Zwei Randwerte allein legen die Innenfelder nicht fest." },
        { kurz: "Die Annahme", text: `Unabhängigkeit liefert das fehlende Feld: $${dz(pa)} \\cdot ${dz(pb)} = ${dz(pab, 4)}$.` },
        { kurz: "Auffüllen", text: "Die übrigen Felder folgen über Zeilen und Spalten." },
        { kurz: "Probe", text: `Auch „weder A noch B“ ist ein Produkt: $${dz(1 - pa)} \\cdot ${dz(1 - pb)} = ${dz(t[1][1], 4)}$.` },
      ],
      einsicht: "Bei Unabhängigkeit ist jedes Innenfeld das Produkt seiner Ränder: $$P(A ∩ B) = P(A) \\cdot P(B)$$",
      mitnehmen: "Die Produktregel benutze ich nur, wenn Unabhängigkeit vorausgesetzt oder geprüft ist.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
}

function ergaenzenRueck(a) {
  const { pa, pb, zweit } = a.sok, pab = pa * pb, nn = (1 - pa) * (1 - pb), oder = pa + pb - pab;
  const t = [[pab, pa - pab, pa], [pb - pab, nn, 1 - pa], [pb, 1 - pb, 1]];
  const z = Zeichnung();
  const sicht = tafelZ(z, { kopf: ["B", ov("B")], seite: ["A", ov("A")], w: t.map((zz) => zz.map((x) => dz(x, 4))), an: new Set(["0,0", "0,2", "2,2"]) });
  const zf = feld(a, zweit);
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. A und B sind unabhängig. Bekannt sind [[P(A)|f02]] $= ${dz(pa)}$ und [[$P(A \\cap B)$|f00]] $= ${dz(pab, 4)}$.\n\nGesucht ist zuerst $P(B)$.` },
    { id: "gleichung", typ: "wahl", text: "Welche Gleichung gilt hier?",
      optionen: [
        { text: `$${dz(pa)} \\cdot P(B) = ${dz(pab, 4)}$`, richtig: true },
        { text: `$${dz(pa)} + P(B) = ${dz(pab, 4)}$`, hinweis: "Unabhängigkeit heißt Produkt, nicht Summe." },
        { text: `$P(B) = ${dz(pa)} \\cdot ${dz(pab, 4)}$`, hinweis: "Setze erst in $P(A) \\cdot P(B) = P(A \\cap B)$ ein. Dann löse nach P(B) auf." },
      ],
      tipps: ["Unabhängig heißt: $P(A \\cap B) = P(A) \\cdot P(B)$."], richtig: `${lob()} Nun nach $P(B)$ auflösen.` },
    { id: "pb", typ: "zahl", text: "Wie groß ist $P(B)$? Drei Nachkommastellen.",
      loesung: pb, toleranz: T3, falsch: "Teile beide Seiten durch P(A).",
      fehler: fehlerAus(feld(a, "pb").fallen, pb, T3),
      tipps: [`$P(B) = ${dz(pab, 4)} : ${dz(pa)}$`], richtig: `${lob()} $P(B) = ${dz(pab, 4)} : ${dz(pa)} = ${dz(pb)}$.`, zeige: ["f20"], zeigeNachRichtig: ["z20"] },
  ];
  if (zweit === "nn") schritte.push(
    { id: "sinn", typ: "wahl", text: "Nun $P(\\overline{A} \\cap \\overline{B})$. Was bedeutet das in Worten?",
      optionen: [
        { text: "Weder A noch B", richtig: true },
        { text: "Nicht beides zugleich", hinweis: "„Nicht beides“ wäre $1 - P(A \\cap B)$. Dazu gehört auch „nur A“." },
        { text: "Genau eines von beiden", hinweis: "$\\overline{A} \\cap \\overline{B}$ verlangt: A tritt nicht ein und B tritt nicht ein." },
      ],
      tipps: ["$\\overline{A}$: nicht A. $\\cap$: und."], richtig: `${lob()} Das ist das [[Feld unten rechts innen|f11]].`, zeige: ["f11"], verberge: ["f20"] },
    { id: "zweit", typ: "zahl", text: "Wie groß ist $P(\\overline{A} \\cap \\overline{B})$? Drei Nachkommastellen.",
      loesung: nn, toleranz: T3, falsch: "Auch $\\overline{A}$ und $\\overline{B}$ sind unabhängig: Multipliziere.",
      fehler: fehlerAus(zf.fallen, nn, T3),
      tipps: [`$${dz(1 - pa)} \\cdot ${dz(1 - pb)}$`], richtig: `${lob()} $${dz(1 - pa)} \\cdot ${dz(1 - pb)} = ${dz(nn, 4)}$.`, zeigeNachRichtig: ["z11"] });
  else schritte.push(
    { id: "sinn", typ: "wahl", text: "Nun $P(A \\cup B)$. Was bedeutet das in Worten?",
      optionen: [
        { text: "Mindestens eines von beiden", richtig: true },
        { text: "Genau eines von beiden", hinweis: "„Oder“ schließt in der Mathematik „beides“ mit ein." },
        { text: "Beides zugleich", hinweis: "Das wäre $A \\cap B$, das Und." },
      ],
      tipps: ["$\\cup$ ist das mathematische Oder."], richtig: `${lob()} Also alles außer „weder A noch B“.` },
    { id: "zweit", typ: "zahl", text: "Wie groß ist $P(A \\cup B)$? Drei Nachkommastellen.",
      loesung: oder, toleranz: T3, falsch: "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$",
      fehler: fehlerAus(zf.fallen, oder, T3),
      tipps: ["Addierst du P(A) und P(B), zählt „A und B“ doppelt.", `$${dz(pa)} + ${dz(pb)} - ${dz(pab, 4)}$`], richtig: `${lob()} $${dz(pa)} + ${dz(pb)} - ${dz(pab, 4)} = ${dz(oder, 4)}$.` });
  schritte.push({ id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Ist ein Produkt bekannt, findest du den fehlenden Faktor durch Teilen. $$P(B) = \\frac{P(A \\cap B)}{P(A)}$$ Schreibe dir den Hefteintrag ab." });
  return gespraech(a, {
    titel: "Rückwärts mit der Produktregel",
    gegeben: `$P(A) = ${dz(pa)}$, $P(A \\cap B) = ${dz(pab, 4)}$; A und B unabhängig`,
    vorwissen: ["Produktform der Unabhängigkeit", "Gleichungen umstellen"], merkzettel: [MERK.unab],
    selbst: [frage(feld(a, "pb"), "gleichung", { kurz: "$P(B)$" }), frage(zf, "sinn", { kurz: zweit === "nn" ? "$P(\\overline{A} \\cap \\overline{B})$" : "$P(A \\cup B)$" })],
    hefteintrag: `$${dz(pa)} \\cdot P(B) = ${dz(pab, 4)}$, also $P(B) = ${dz(pb)}$\n\n${zweit === "nn" ? `$P(\\overline{A} \\cap \\overline{B}) = ${dz(1 - pa)} \\cdot ${dz(1 - pb)} = ${dz(nn, 4)}$` : `$P(A \\cup B) = ${dz(pa)} + ${dz(pb)} - ${dz(pab, 4)} = ${dz(oder, 4)}$`}`,
    rueckblick: {
      titel: "Den fehlenden Faktor finden",
      frage: "Wie findet man P(B), wenn P(A) und P(A ∩ B) bekannt sind?",
      schritte: [
        { kurz: "Ansetzen", text: `Unabhängigkeit heißt Produkt: $${dz(pa)} \\cdot P(B) = ${dz(pab, 4)}$.` },
        { kurz: "Umstellen", text: `Teilen liefert $P(B) = ${dz(pb)}$.` },
        { kurz: "Übersetzen", text: zweit === "nn" ? "„Weder A noch B“ ist nicht dasselbe wie „nicht beides“." : "„A oder B“ heißt: mindestens eines, beides eingeschlossen." },
        { kurz: "Rechnen", text: zweit === "nn" ? `$${dz(1 - pa)} \\cdot ${dz(1 - pb)} = ${dz(nn, 4)}$` : `$${dz(pa)} + ${dz(pb)} - ${dz(pab, 4)} = ${dz(oder, 4)}$` },
      ],
      einsicht: "Aus der Produktform folgt jeder fehlende Faktor durch Teilen: $$P(B) = \\frac{P(A ∩ B)}{P(A)}$$",
      mitnehmen: "Bevor ich rechne, übersetze ich jedes Zeichen in Worte: ∩ ist und, ∪ ist oder, der Strich ist nicht.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
}

/* ---------- Flächenbild ---------- */
BAU["u-flaeche"] = (a) => {
  const { w, k, N, unab } = a.sok, h1 = w[0][0] / w[2][0], h2 = w[0][1] / w[2][1];
  const z = Zeichnung(), sicht = flaecheZ(z, w);
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Das Quadrat steht für alle ${N}. Die [[Spalte B|spaltenB]] ist so breit wie $P(B)$.\n\nIn jeder Spalte zeigt der [[goldene Teil|rab,ranb]] die mit A.`, zeige: ["spaltenB"] },
    { id: "hoehe", typ: "wahl", text: "Was misst die Höhe des [[goldenen Teils in der Spalte B|rab]]?",
      optionen: [
        { text: "Den Anteil von A unter den B: $P(A \\mid B)$", richtig: true },
        { text: "$P(A \\cap B)$", hinweis: "P(A ∩ B) ist die Fläche, Breite mal Höhe. Die Höhe allein misst den Anteil in der Spalte." },
        { text: "$P(A)$", hinweis: "P(A) gilt für alle. Die Höhe misst nur innerhalb dieser einen Spalte." },
      ],
      tipps: ["Die Spalte ist ganz hoch: Sie steht für alle B. Welcher Teil davon ist golden?"], richtig: `${lob()} Die Höhe ist ein Anteil innerhalb der Spalte.`, verberge: ["spaltenB"] },
    { id: "h1", typ: "zahl", text: `Wie groß ist $P(A \\mid B)$? In der Spalte B sind ${w[2][0]}, golden sind ${w[0][0]}. Drei Nachkommastellen.`,
      loesung: h1, toleranz: T3, falsch: `Teile die goldenen durch alle in der Spalte B.`,
      fehler: fehlerAus(feld(a, "h1").fallen, h1, T3),
      tipps: [`$${frRoh(w[0][0], w[2][0])}$`], richtig: `${lob()} $${frRoh(w[0][0], w[2][0])} \\approx ${dz(h1)}$.` },
    { id: "h2", typ: "zahl", text: `Und in der Spalte $\\overline{B}$: Wie groß ist $P(A \\mid \\overline{B})$? Dort sind ${w[2][1]}, golden ${w[0][1]}. Drei Nachkommastellen.`,
      loesung: h2, toleranz: T3, falsch: "Teile die goldenen durch alle in dieser Spalte.",
      fehler: fehlerAus(feld(a, "h2").fallen, h2, T3),
      tipps: [`$${frRoh(w[0][1], w[2][1])}$`], richtig: `${lob()} $${frRoh(w[0][1], w[2][1])} \\approx ${dz(h2)}$.` },
    { id: "urteil", typ: "wahl", text: `Die Höhen sind $${dz(h1)}$ und $${dz(h2)}$. Was zeigt die [[Trennlinie|trenn]]?`,
      optionen: [
        { text: unab ? "Unabhängig: Die Linie läuft gerade durch" : "Abhängig: Die Linie springt", richtig: true },
        { text: unab ? "Abhängig: Die Linie springt" : "Unabhängig: Die Linie läuft gerade durch", hinweis: `Vergleiche die Höhen: ${dz(h1)} und ${dz(h2)}.` },
        { text: unab ? "Abhängig, weil die goldenen Flächen verschieden groß sind" : "Abhängig, weil die goldenen Flächen verschieden groß sind", hinweis: "Nicht die Flächen vergleichen, sondern die Höhen. Eine schmale Spalte hat wenig Fläche, kann aber denselben Anteil haben." },
      ],
      tipps: ["Gleich hohe goldene Teile bedeuten: Das Wissen über B ändert nichts an A."],
      richtig: unab ? "So ist es. In beiden Spalten ist der Anteil von A gleich: Er ist überall P(A)." : "So ist es. Unter B ist A anders verteilt als unter $\\overline{B}$." },
    { id: "flaeche", typ: "wahl", text: "Was ist die Fläche des [[goldenen Rechtecks in der Spalte B|rab]]?",
      optionen: [
        { text: "Breite mal Höhe: $P(B) \\cdot P(A \\mid B) = P(A \\cap B)$", richtig: true },
        { text: "Immer $P(A) \\cdot P(B)$", hinweis: "Das gilt nur, wenn die Höhe überall P(A) ist, also bei Unabhängigkeit. Breite mal Höhe gilt immer." },
        { text: "$P(A \\mid B)$", hinweis: "Das ist nur die Höhe. Eine Fläche hat auch eine Breite." },
      ],
      tipps: ["Die Breite ist P(B), die Höhe P(A | B)."],
      richtig: `${lob()} Das ist die Pfadregel als Bild. ${unab ? "Weil die Linie gerade läuft, ist sie hier auch $P(A) \\cdot P(B)$." : "Weil die Linie springt, ist sie hier nicht $P(A) \\cdot P(B)$."}` },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Im Flächenbild ist die Breite $P(B)$, die Höhe $P(A \\mid B)$. Gleich hohe Teile in beiden Spalten bedeuten Unabhängigkeit. Schreibe dir den Hefteintrag ab." },
  ];
  return gespraech(a, {
    titel: "Flächenbild: gerade oder gestuft?",
    gegeben: `${N} ${k.wer}; Spalte B: ${w[2][0]}, Spalte $\\overline{B}$: ${w[2][1]}`,
    vorwissen: ["Bedingte Wahrscheinlichkeit", "Fläche eines Rechtecks"], merkzettel: [MERK.unab],
    selbst: [frage(feld(a, "h1"), "hoehe", { kurz: "$P(A \\mid B)$" }), frage(feld(a, "h2"), "h2", { kurz: "$P(A \\mid \\overline{B})$" })],
    hefteintrag: `$P(A \\mid B) = ${frRoh(w[0][0], w[2][0])} \\approx ${dz(h1)}$\n\n$P(A \\mid \\overline{B}) = ${frRoh(w[0][1], w[2][1])} \\approx ${dz(h2)}$\n\n${unab ? "Gleich hoch: A und B sind unabhängig." : "Verschieden hoch: A und B sind abhängig."}`,
    rueckblick: {
      titel: "Höhen vergleichen, nicht Flächen",
      frage: "Wie sieht man einem Flächenbild an, ob A und B unabhängig sind?",
      schritte: [
        { kurz: "Lesen", text: "Die Breite einer Spalte ist P(B), die Höhe des goldenen Teils der Anteil von A in dieser Spalte." },
        { kurz: "Messen", text: `Links $${frRoh(w[0][0], w[2][0])} \\approx ${dz(h1)}$, rechts $${frRoh(w[0][1], w[2][1])} \\approx ${dz(h2)}$.` },
        { kurz: "Die Stolperstelle", text: "Die Flächen täuschen: Eine schmale Spalte hat wenig Fläche, auch wenn der Anteil gleich ist." },
        { kurz: "Urteilen", text: unab ? "Gleich hoch: Die Linie läuft gerade, A und B sind unabhängig." : "Verschieden hoch: Die Linie springt, A und B sind abhängig." },
      ],
      einsicht: "Die Fläche ist Breite mal Höhe, also die Pfadregel: $$P(A ∩ B) = P(B) \\cdot P(A | B)$$",
      mitnehmen: "Im Flächenbild vergleiche ich Höhen. Läuft die Trennlinie gerade durch, sind die Merkmale unabhängig.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* ---------- Würfel und Karten: abzählen ---------- */
const KZ = ["\\clubsuit", "\\spadesuit", "\\heartsuit", "\\diamondsuit"];
BAU["u-abzaehlen"] = (a) => {
  const { art, At, Bt, marken, N, nA, nB, nAB, unab } = a.sok;
  const pA = nA / N, pB = nB / N, pAB = nAB / N, prod = pA * pB;
  const kopf = {
    karten: [KZ, ["7", "8", "9", "10", "B", "D", "K", "A"].map((x) => (/\d/.test(x) ? x : tx(x))), "Zeilen: Farbe, Spalten: Wert"],
    wuerfel: [["1", "2", "3", "4", "5", "6"], ["1", "2", "3", "4", "5", "6"], "Zeilen: 1. Wurf, Spalten: 2. Wurf"],
    muenzen: [[tx("W"), tx("Z")], ["WW", "WZ", "ZW", "ZZ"].map(tx), "Zeilen: 1. Wurf, Spalten: 2. und 3. Wurf"],
  }[art];
  const z = Zeichnung();
  const sicht = rasterZ(z, kopf[0], kopf[1], (r, c) => ({ a: marken[r][c].includes("a"), b: marken[r][c].includes("b") }), tx(kopf[2]));
  const beides = nAB ? "[[beides|rasterAB]]" : "beides";
  const urteilOpt = [
    { text: unab ? `Unabhängig: $P(A) \\cdot P(B) = P(A \\cap B)$` : `Abhängig: $P(A) \\cdot P(B) \\neq P(A \\cap B)$`, richtig: true },
    { text: unab ? `Abhängig: $P(A) \\cdot P(B) \\neq P(A \\cap B)$` : `Unabhängig: $P(A) \\cdot P(B) = P(A \\cap B)$`, hinweis: `Vergleiche: $${fr(nA * nB, N * N)}$ und $${nAB ? fr(nAB, N) : "0"}$.` },
    nAB === 0
      ? { text: "Unabhängig, weil A und B nie zusammen eintreten", hinweis: "Unvereinbar ist nicht unabhängig. Wer A beobachtet, weiß sicher: B ist ausgeschlossen. Das ist stärkste Abhängigkeit." }
      : { text: "Unabhängig, weil A und B nichts miteinander zu tun haben", hinweis: "Ob Ereignisse „etwas miteinander zu tun haben“, entscheidet die Rechnung, nicht das Gefühl." },
  ];
  const schritte = [
    { id: "anfang", typ: "rede", text: `Sei gegrüßt, {name}. Das [[Raster|gitter]] zeigt alle ${N} Ergebnisse, jedes gleich wahrscheinlich.\n\nA: „${At.replace(/\.$/, "")}.“ B: „${Bt.replace(/\.$/, "")}.“` },
    { id: "na", typ: "zahl", text: "Geh das Raster durch. In wie vielen Feldern gilt A?",
      loesung: nA, toleranz: GANZ, falsch: "Zähle Zeile für Zeile.", fehler: fehlerAus([{ wert: N - nA, text: "Das sind die Felder, in denen A nicht gilt." }], nA, GANZ),
      tipps: [`A: „${At}“ Prüfe jedes Feld.`], richtig: `${lob()} [[${nA} Felder|rasterA]], also $P(A) = ${fr(nA, N)}$.`, zeigeNachRichtig: ["rasterA"] },
    { id: "nb", typ: "zahl", text: "Und in wie vielen Feldern gilt B?",
      loesung: nB, toleranz: GANZ, falsch: "Zähle Zeile für Zeile.", fehler: fehlerAus([{ wert: N - nB, text: "Das sind die Felder, in denen B nicht gilt." }], nB, GANZ),
      tipps: [`B: „${Bt}“ Prüfe jedes Feld.`], richtig: `${lob()} [[${nB} Felder|rasterB]], also $P(B) = ${fr(nB, N)}$.`, zeigeNachRichtig: ["rasterB"] },
    { id: "nab", typ: "zahl", text: "In wie vielen Feldern gilt beides zugleich?",
      loesung: nAB, toleranz: GANZ, falsch: "Suche Felder, die gold und blau zugleich sind.",
      fehler: fehlerAus([{ wert: nA + nB - nAB, text: "Das sind die Felder mit A oder B. Gesucht ist „A und B“: beides zugleich." }, { wert: nA + nB, text: "Du hast addiert. Gesucht sind die Felder, die zu beiden gehören." }], nAB, GANZ),
      tipps: ["Ein Feld zählt nur, wenn es links gold und rechts blau ist."],
      richtig: nAB ? `${lob()} ${beides} trifft in ${nAB} ${nAB === 1 ? "Feld" : "Feldern"} zu: $P(A \\cap B) = ${fr(nAB, N)}$.` : `${lob()} Kein Feld: A und B treten nie zusammen ein, $P(A \\cap B) = 0$.`, zeigeNachRichtig: nAB ? ["rasterAB"] : [] },
    { id: "produkt", typ: "zahl", text: "Wie groß ist $P(A) \\cdot P(B)$? Ein Bruch ist am genauesten, sonst vier Nachkommastellen.",
      loesung: prod, toleranz: T4, falsch: "Multipliziere die beiden Wahrscheinlichkeiten.",
      fehler: fehlerAus([{ wert: pAB, text: "Das ist P(A ∩ B), abgezählt. Gefragt ist das Produkt von P(A) und P(B)." }, { wert: pA + pB, text: "Du hast addiert. Gefragt ist das Produkt." }], prod, T4),
      tipps: [`$${fr(nA, N)} \\cdot ${fr(nB, N)}$`], richtig: `${lob()} $${fr(nA, N)} \\cdot ${fr(nB, N)} = ${fr(nA * nB, N * N)}$.` },
    { id: "urteil", typ: "wahl", text: `Vergleiche $P(A) \\cdot P(B) = ${fr(nA * nB, N * N)}$ mit $P(A \\cap B) = ${nAB ? fr(nAB, N) : "0"}$. Was folgt?`, optionen: urteilOpt,
      tipps: ["Unabhängig heißt in Produktform: $P(A \\cap B) = P(A) \\cdot P(B)$."],
      richtig: unab ? "So ist es. Das Produkt stimmt genau: A und B sind unabhängig." : nAB === 0 ? "So ist es. Unvereinbare Ereignisse sind immer abhängig." : "So ist es. Das Produkt weicht ab: A und B sind abhängig." },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Bei gleich wahrscheinlichen Ergebnissen erst zählen, dann $$P(A \\cap B) = P(A) \\cdot P(B)$$ prüfen. Entscheidend ist allein die Rechnung. Schreibe dir den Hefteintrag ab." },
  ];
  return gespraech(a, {
    titel: "Abzählen und prüfen",
    gegeben: `${N} gleich wahrscheinliche Ergebnisse`,
    vorwissen: ["Wahrscheinlichkeit durch Abzählen", "Produktform der Unabhängigkeit"], merkzettel: [MERK.unab],
    selbst: [frage(feld(a, "a"), "na", { kurz: "$P(A)$" }), frage(feld(a, "b"), "nb", { kurz: "$P(B)$" }), frage(feld(a, "ab"), "nab", { kurz: "$P(A \\cap B)$" })],
    hefteintrag: `$P(A) = ${fr(nA, N)}$, $P(B) = ${fr(nB, N)}$, $P(A \\cap B) = ${nAB ? fr(nAB, N) : "0"}$\n\n$P(A) \\cdot P(B) = ${fr(nA * nB, N * N)}$ ${unab ? "=" : "\\neq"} $P(A \\cap B)$\n\n${unab ? "A und B sind unabhängig." : "A und B sind abhängig."}`,
    rueckblick: {
      titel: "Zählen entscheidet",
      frage: "Wie prüft man Unabhängigkeit, wenn alle Ergebnisse gleich wahrscheinlich sind?",
      schritte: [
        { kurz: "Zählen", text: `A trifft in ${nA}, B in ${nB} von ${N} Feldern zu, beides in ${nAB}.` },
        { kurz: "Multiplizieren", text: `$P(A) \\cdot P(B) = ${frRoh(nA, N)} \\cdot ${frRoh(nB, N)}$.` },
        { kurz: "Vergleichen", text: unab ? "Das Produkt stimmt mit dem abgezählten Wert überein." : `Das Produkt weicht vom abgezählten Wert $${nAB ? frRoh(nAB, N) : "0"}$ ab.` },
        { kurz: "Urteilen", text: unab ? "A und B sind unabhängig." : nAB === 0 ? "A und B sind abhängig: Sie schließen einander aus." : "A und B sind abhängig." },
      ],
      einsicht: "Nur die Rechnung entscheidet, kein Gefühl: $$P(A ∩ B) = P(A) \\cdot P(B)$$",
      mitnehmen: "Unvereinbar ist nicht unabhängig. Ich zähle und vergleiche, bevor ich urteile.",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

/* ---------- Die Produktfalle ---------- */
BAU["u-falle"] = (a) => {
  const { pA, pB, pAgB, unab } = a.sok, richtig = pB * pAgB;
  const z = Zeichnung();
  const sicht = baumZ(z, { s1: ["B", ov("B")], s2: [["A", ov("A")], ["A", ov("A")]], p1: [dz(pB, 2), dz(1 - pB, 2)], p2: [[dz(pAgB, 2), dz(1 - pAgB, 2)], ["", ""]], enden: [dz(richtig, 4), "", "", ""] }, { p1: true });
  const angabe = unab
    ? { id: "angabe", typ: "wahl", text: `Die Aufgabe nennt $${pzT(pA, 0)}$ für alle und $${pzT(pAgB, 0)}$ unter B. Was fällt daran auf?`,
        optionen: [
          { text: "$P(A \\mid B)$ und $P(A)$ sind gleich", richtig: true },
          { text: "Die Aufgabe wiederholt sich nur", hinweis: "Die beiden Angaben zählen unter verschiedenen Gruppen: einmal unter allen, einmal unter B." },
          Math.abs(pA - pB) < 0.005
            ? { text: "Alle drei Angaben bedeuten dasselbe", hinweis: "Die Zahlen sind gleich, aber sie zählen unter verschiedenen Gruppen. Welche zwei Angaben betreffen beide A?" }
            : { text: "$P(A)$ und $P(B)$ sind gleich", hinweis: `$P(B)$ ist $${pzT(pB, 0)}$. Welche zwei Angaben sind gleich?` },
        ],
        tipps: ["Unter welcher Gruppe zählt jede Angabe?"], richtig: `${lob()} Unter B ist A genauso häufig wie unter allen.`, zeigeNachRichtig: ["q11", "q12"] }
    : { id: "angabe", typ: "wahl", text: "Welche Angabe ist $P(A \\mid B)$?",
        optionen: [
          { text: `$${pzT(pAgB, 0)}$, denn sie zählt nur unter B`, richtig: true },
          { text: `$${pzT(pA, 0)}$`, hinweis: "Diese Angabe gilt für alle, ohne Bedingung. Das ist P(A)." },
          Math.abs(pA - pB) < 0.005
            ? { text: "Keine, sie muss erst berechnet werden", hinweis: "Sie steht schon in der Aufgabe. Achte auf die Angabe, die nur unter B zählt." }
            : { text: `$${pzT(pB, 0)}$`, hinweis: "Das ist P(B), der Anteil von B unter allen." },
        ],
        tipps: ["Hinter dem Strich steht die Gruppe, unter der gezählt wird."], richtig: `${lob()} Sie steht am [[Ast hinter B|a11]].`, zeigeNachRichtig: ["q11", "q12"] };
  const schritte = [
    { id: "anfang", typ: "rede", text: "Sei gegrüßt, {name}. Gesucht ist $P(A \\cap B)$. Wer schnell ist, rechnet $P(A) \\cdot P(B)$.\n\nPrüfen wir, ob das hier erlaubt ist. Der [[Baum|a1,a2,a11,a12]] beginnt mit B." },
    angabe,
    { id: "darf", typ: "wahl", text: "Darf man hier $P(A) \\cdot P(B)$ rechnen?",
      optionen: unab
        ? [{ text: "Ja, denn $P(A \\mid B) = P(A)$: A und B sind unabhängig", richtig: true },
           { text: "Nein, das darf man nie", hinweis: "Bei Unabhängigkeit ist die Produktregel richtig. Ist sie hier erfüllt?" },
           { text: "Ja, das geht immer", hinweis: "Das ist die Falle. Die Produktregel verlangt Unabhängigkeit. Hier ist sie erfüllt, aber das muss man prüfen." }]
        : [{ text: "Nein, denn $P(A \\mid B) \\neq P(A)$", richtig: true },
           { text: "Ja, das geht immer", hinweis: "Das ist die Falle. Die Produktregel unterstellt, dass B nichts an A ändert. Stimmt das hier?" },
           { text: "Ja, wenn man am Ende rundet", hinweis: "Runden ändert nichts am Fehler. Vergleiche P(A | B) mit P(A)." }],
      tipps: ["Die Produktregel gilt nur bei Unabhängigkeit."],
      richtig: unab ? "So ist es. Hier ist die Produktregel erlaubt, weil wir es geprüft haben." : "So ist es. Die Pfadregel gilt immer, die Produktregel nur bei Unabhängigkeit." },
    { id: "ab", typ: "zahl", text: "Rechne mit der Pfadregel entlang des [[Pfades über B zu A|a1,a11]]: $P(A \\cap B) = P(B) \\cdot P(A \\mid B)$. Vier Nachkommastellen.",
      loesung: richtig, toleranz: T4, falsch: "Multipliziere die beiden Äste des Pfades.",
      fehler: fehlerAus(feld(a, "ab").fallen, richtig, T4),
      tipps: [`$${dz(pB, 2)} \\cdot ${dz(pAgB, 2)}$`],
      richtig: `${lob()} $${dz(pB, 2)} \\cdot ${dz(pAgB, 2)} = ${dz(richtig, 4)}$.${unab ? "" : ` Das falsche Produkt wäre $${dz(pA * pB, 4)}$.`}`, zeigeNachRichtig: ["e11"] },
    { id: "ursache", typ: "wahl", text: "Was beschreibt stochastische Abhängigkeit eigentlich?",
      optionen: [
        { text: "Einen Zusammenhang der Häufigkeiten, keine Ursache", richtig: true },
        { text: "Dass B das Ereignis A verursacht", hinweis: "Abhängig heißt nicht verursacht. An heißen Tagen gibt es mehr Eis und mehr Sonnenbrand, und doch macht Eis keinen Sonnenbrand." },
        { text: "Dass A und B nie zusammen vorkommen", hinweis: "Das hieße unvereinbar. Abhängig sind auch Ereignisse, die oft zusammen vorkommen." },
      ],
      tipps: ["Die Rechnung zählt nur, wie oft etwas zusammen vorkommt."], richtig: "So ist es. Die Rechnung zeigt einen Zusammenhang, nicht seinen Grund." },
    { id: "schluss", typ: "rede", text: "So halten wir fest, {name}: Immer richtig ist $$P(A \\cap B) = P(B) \\cdot P(A \\mid B).$$ Nur bei Unabhängigkeit darf $P(A \\mid B)$ durch $P(A)$ ersetzt werden. Schreibe dir den Hefteintrag ab." },
  ];
  return gespraech(a, {
    titel: "Die Produktfalle",
    gegeben: `$P(A) = ${dz(pA, 2)}$, $P(B) = ${dz(pB, 2)}$, $P(A \\mid B) = ${dz(pAgB, 2)}$`,
    vorwissen: ["Pfadregel", "Produktform der Unabhängigkeit"], merkzettel: [MERK.unab, MERK.pfad],
    selbst: [frage(feld(a, "ab"), "angabe", { kurz: "$P(A \\cap B)$" })],
    hefteintrag: `$P(A \\cap B) = P(B) \\cdot P(A \\mid B) = ${dz(pB, 2)} \\cdot ${dz(pAgB, 2)} = ${dz(richtig, 4)}$\n\n${unab ? `Hier gilt auch $P(A) \\cdot P(B) = ${dz(pA * pB, 4)}$, weil $P(A \\mid B) = P(A)$.` : `Falsch wäre $P(A) \\cdot P(B) = ${dz(pA * pB, 4)}$, denn $P(A \\mid B) \\neq P(A)$.`}`,
    rueckblick: {
      titel: "Erst prüfen, dann multiplizieren",
      frage: "Wann darf man P(A ∩ B) als P(A) · P(B) berechnen?",
      schritte: [
        { kurz: "Die Versuchung", text: "Das Produkt P(A) · P(B) liegt nahe, unterstellt aber Unabhängigkeit." },
        { kurz: "Prüfen", text: `Hier ist $P(A | B) = ${dz(pAgB, 2)}$ und $P(A) = ${dz(pA, 2)}$: ${unab ? "gleich" : "verschieden"}.` },
        { kurz: "Sicher rechnen", text: `Die Pfadregel gilt immer: $${dz(pB, 2)} \\cdot ${dz(pAgB, 2)} = ${dz(richtig, 4)}$.` },
        { kurz: "Deuten", text: "Abhängigkeit beschreibt einen Zusammenhang der Häufigkeiten, keine Ursache." },
      ],
      einsicht: "Die Pfadregel gilt immer, die Produktregel nur bei Unabhängigkeit: $$P(A ∩ B) = P(B) \\cdot P(A | B)$$",
      mitnehmen: "Bevor ich P(A) · P(B) rechne, frage ich: Ist Unabhängigkeit gegeben oder geprüft?",
    },
    geogebra: z.fertig(sicht), schritte,
  });
};

BAU["u-mix"] = (a) => BAU[a.herkunft](a);
})(typeof window !== "undefined" ? window : globalThis);
