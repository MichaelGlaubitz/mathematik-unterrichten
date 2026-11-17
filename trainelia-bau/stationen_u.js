/* ============================================================
   4. Die Stationen
   Jede Station: id, titel, vor (Schritte), merke, stolper,
   neu() → Aufgabe, ziel (Serie richtig in Folge)
   Aufgabe: { html, bild?, felder:[{id,label,wert,tol,art,fallen:[{wert,text}]}],
              auswahl?, tafelFelder?, tipps:[html], loesung:html }
   ============================================================ */
const STATIONEN = [];
const FARBEN = [["rot", "blau"], ["grün", "gelb"], ["schwarz", "weiß"]];
const groß = (s) => s[0].toUpperCase() + s.slice(1);

/* Auswahl „unabhängig / abhängig“ mit Begründung bei falscher Wahl */
function entscheidung(unab, warum) {
  return { label: "A und B sind stochastisch …", optionen: ["unabhängig", "abhängig"], richtig: unab ? 0 : 1, falsch: () => warum };
}

/* Beispieltafeln für die Vorführungen */
const VOR_K = { A: "Instrument", nA: "kein Instrument", B: "Chor", nB: "kein Chor", ik: { A: "note", B: "mikro" } };
const VOR_ABH = [[60, 100, 160], [40, 200, 240], [100, 300, 400]];       // abhängig
const HAUS = KONTEXTE[3];
const VOR_UNAB = [[60, 140, 200], [90, 210, 300], [150, 350, 500]];      // unabhängig
const vk = tafelKopf(VOR_K), hk = tafelKopf(HAUS);

/* Eine Vierfeldertafel, in der A und B genau unabhängig sind */
function unabTafel() {
  const ps = [0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8];
  for (;;) {
    const N = wahl([400, 800, 1200, 2000]), pa = wahl(ps), pb = wahl(ps);
    const a = Math.round(N * pa), b = Math.round(N * pb), ab = Math.round(N * pa * pb);
    if (Math.abs(ab - N * pa * pb) > 1e-6) continue;
    const w = [[ab, a - ab, a], [b - ab, N - a - b + ab, N - a], [b, N - b, N]];
    if (w.flat().some((x) => x < 5)) continue;
    return { N, w, k: wahl(KONTEXTE) };
  }
}
const istUnab = (w) => w[0][0] * w[2][2] === w[0][2] * w[2][0];

/* ---------- 1 · Die Idee ---------- */
STATIONEN.push({
  id: "u-idee", titel: "Was heißt unabhängig?", ziel: 3,
  vor: (() => {
    const b0 = { s1: ["rot", "blau"], s2: [["rot", "blau"], ["rot", "blau"]] };
    const p1 = ["3/5", "2/5"];
    return [
      { t: `In einer Urne liegen 3 rote und 2 blaue Kugeln. Es werden zwei Kugeln nacheinander gezogen. A: „Die erste ist rot.“ B: „Die zweite ist rot.“ <b>Frage:</b> Ändert das Wissen über die erste Kugel die Chance der zweiten?`, v: () => urneBild("rot", "blau", 3, 2) },
      { t: `<b>Mit Zurücklegen:</b> Die erste Kugel kommt zurück, die Urne ist wieder wie vorher. Egal was zuerst kam: <span class="m">P(B | A) = ${br(3, 5)}</span>, und auch ohne Vorwissen <span class="m">P(B) = ${br(3, 5)}</span>. Das Wissen über A ändert nichts.`, v: () => baum({ ...b0, p1, p2: [["3/5", "2/5"], ["3/5", "2/5"]], hl: [0] }) },
      { t: `<b>Ohne Zurücklegen:</b> Nach einer roten Kugel liegen nur noch 2 rote unter 4: <span class="m">P(B | A) = ${brRoh(2, 4)} = ${br(1, 2)}</span>.`, v: () => baum({ ...b0, p1, p2: [["2/4", "2/4"], ["3/4", "1/4"]], hl: [0] }) },
      { t: `Und ohne Vorwissen? Zwei Pfade enden bei „zweite rot“: <span class="m">P(B) = ${br(3, 5)} · ${brRoh(2, 4)} + ${br(2, 5)} · ${brRoh(3, 4)} = ${brRoh(12, 20)} = ${br(3, 5)}</span>. Also <span class="m">P(B | A) = ${br(1, 2)} ≠ ${br(3, 5)} = P(B)</span>: Das Wissen über A ändert die Chance.`, v: () => baum({ ...b0, p1, p2: [["2/4", "2/4"], ["3/4", "1/4"]], hl: [0, 2], enden: ["6/20", "", "6/20", ""] }) },
      { t: `<b>Fachwort:</b> A und B heißen <b>stochastisch unabhängig</b>, wenn <span class="m">P(B | A) = P(B)</span>. Mit Zurücklegen sind sie unabhängig, ohne Zurücklegen <b>abhängig</b>.`, v: () => urneBild("rot", "blau", 3, 2) },
      { t: `Gleichwertig und oft bequemer: <span class="m">P(A ∩ B) = P(A) · P(B)</span>. Mit Zurücklegen: <span class="m">${br(3, 5)} · ${br(3, 5)} = ${br(9, 25)}</span> ✓. Ohne: <span class="m">P(A ∩ B) = ${brRoh(6, 20)} = ${br(3, 10)}</span>, aber <span class="m">P(A) · P(B) = ${br(9, 25)}</span> ✗.`, v: () => baum({ ...b0, p1, p2: [["2/4", "2/4"], ["3/4", "1/4"]], hl: [0], enden: ["3/10", "", "", ""] }) },
    ];
  })(),
  merke: `A und B sind <b>stochastisch unabhängig</b>, wenn <span class="m">P(B | A) = P(B)</span>, gleichwertig <span class="m">P(A ∩ B) = P(A) · P(B)</span>. Sonst heißen sie abhängig.`,
  stolper: `Ohne Zurücklegen ist P(B) trotzdem ${br(3, 5)}, nicht ${br(1, 2)}: P(B) fragt ohne Vorwissen über die erste Kugel. Erst P(B | A) kennt die erste Kugel.`,
  neu() {
    /* Zwei Sorten Dinge (cnt[0], cnt[1]); A: erstes Ding ist Sorte i, B: zweites Ding ist Sorte j */
    const art = wahl(["urne", "urne", "lose", "karten"]);
    let cnt, name, satz, einleitung, bild = "", ding;
    if (art === "urne") {
      const [f1, f2] = wahl(FARBEN);
      cnt = [zufall(2, 6), zufall(2, 6)]; name = [f1, f2]; ding = "Kugel";
      satz = (pos, s) => `Die ${pos} Kugel ist ${name[s]}.`;
      einleitung = (mit) => `In einer Urne liegen ${cnt[0]} ${f1}e und ${cnt[1]} ${f2}e Kugeln. Es werden nacheinander zwei Kugeln gezogen, <b>${mit ? "mit" : "ohne"} Zurücklegen</b>.`;
      bild = (mit) => urneBild(f1, f2, cnt[0], cnt[1], mit ? "↺ mit Zurücklegen" : "ohne Zurücklegen");
    } else if (art === "lose") {
      cnt = [zufall(2, 5), zufall(5, 15)]; name = ["Gewinn", "Niete"]; ding = "Los";
      satz = (pos, s) => `Das ${pos} Los ist ${s ? "eine Niete" : "ein Gewinn"}.`;
      einleitung = (mit) => `In einer Lostrommel liegen ${cnt[0]} Gewinne und ${cnt[1]} Nieten. Zwei Lose werden nacheinander gezogen, <b>${mit ? "das erste wird zurückgelegt und neu gemischt" : "ohne Zurücklegen"}</b>.`;
    } else {
      const ass = Math.random() < 0.5;
      cnt = ass ? [4, 28] : [8, 24]; name = ass ? ["Ass", "kein Ass"] : ["Herz", "kein Herz"]; ding = "Karte";
      satz = (pos, s) => `Die ${pos} Karte ist ${ass ? (s ? "kein Ass" : "ein Ass") : (s ? "keine Herz-Karte" : "eine Herz-Karte")}.`;
      einleitung = (mit) => `Aus einem Kartenspiel mit 32 Karten (darin ${ass ? "4 Asse" : "8 Herz-Karten"}) werden nacheinander zwei Karten gezogen, <b>${mit ? "mit Zurücklegen und Mischen" : "ohne Zurücklegen"}</b>.`;
    }
    const n = cnt[0] + cnt[1];
    const erstes = { Kugel: "Die erste Kugel", Los: "Das erste Los", Karte: "Die erste Karte" }[ding];
    const mit = Math.random() < 0.5;
    const [i, j] = wahl([[0, 0], [0, 0], [1, 0], [0, 1], [1, 1]]);
    const p2 = mit ? [[cnt[0] / n, cnt[1] / n], [cnt[0] / n, cnt[1] / n]] : [[(cnt[0] - 1) / (n - 1), cnt[1] / (n - 1)], [cnt[0] / (n - 1), (cnt[1] - 1) / (n - 1)]];
    const z2 = mit ? [[cnt[0], cnt[1]], [cnt[0], cnt[1]]] : [[cnt[0] - 1, cnt[1]], [cnt[0], cnt[1] - 1]], n2 = mit ? n : n - 1;
    const pBA = p2[i][j], pB = cnt[j] / n, pfad = (cnt[i] / n) * pBA;
    const andereBA = mit ? (cnt[j] - (i === j)) / (n - 1) : cnt[j] / n;
    const html = `<p>${einleitung(mit)}</p>
      <p>A: „${satz("erste", i)}“<br>B: „${satz("zweite", j)}“</p>
      <p class="klein leise">Brüche (z. B. 3/7) oder Dezimalzahlen auf drei Stellen.</p>`;
    const felder = [
      { id: "ba", label: "P(B | A)", wert: pBA, tol: 0.0006,
        fallen: [
          { wert: andereBA, text: mit ? `So wäre es ohne Zurücklegen. Hier kommt ${erstes.replace(/^D/, "d")} zurück: Alles ist wieder wie am Anfang.` : `${erstes} fehlt: Es sind nur noch ${n - 1} übrig, davon ${z2[i][j]} der Sorte „${name[j]}“.` },
          ...(mit ? [] : [{ wert: pfad, text: "Das ist P(A ∩ B), ein ganzer Pfad. Bei P(B | A) weißt du schon, dass A eingetreten ist: Es zählt nur die zweite Stufe." }]),
        ] },
      { id: "b", label: "P(B)", wert: pB, tol: 0.0006,
        fallen: [
          { wert: pfad, text: `Das ist nur der Pfad über A. P(B) fragt ohne Vorwissen über den ersten Zug: Beide Pfade, die bei „zweite: ${name[j]}“ enden, gehören dazu.` },
          ...(mit ? [] : [{ wert: pBA, text: `Das ist P(B | A). Ohne Vorwissen über den ersten Zug addierst du beide Pfade, die bei „zweite: ${name[j]}“ enden.` }]),
        ] },
    ];
    const baumDaten = { s1: name, s2: [name, name], p1: [brT(cnt[0], n), brT(cnt[1], n)], p2: z2.map((z) => z.map((x) => brT(x, n2))) };
    return {
      html, felder, geschichte: "idee-" + art,
      bild: bild ? bild(mit) : "",
      auswahl: entscheidung(mit, mit
        ? "Vergleiche: P(B | A) und P(B) sind gleich. Das Wissen über den ersten Zug ändert nichts am zweiten."
        : `Vergleiche: P(B | A) ist ${pBA < pB ? "kleiner" : "größer"} als P(B). Das Wissen über den ersten Zug ändert die Chance beim zweiten.`),
      tipps: [
        `Zeichne den Baum: erster Zug „${name[0]}“ oder „${name[1]}“, dann der zweite. ${mit ? "Mit Zurücklegen sieht die zweite Stufe aus wie die erste." : `Ohne Zurücklegen sind in der zweiten Stufe nur noch ${n - 1} übrig.`}`,
        `${baum({ ...baumDaten, hl: [j, 2 + j] })}<p>P(B | A): der Ast „${name[j]}“ hinter „${name[i]}“. P(B): beide markierten Pfade addieren.</p>`,
      ],
      loesung: `${baum({ ...baumDaten, hl: [j, 2 + j] })}
        <p>P(B | A) = ${br(z2[i][j], n2)} ≈ ${kz(pBA)}</p>
        <p>P(B) = ${br(cnt[0], n)} · ${br(z2[0][j], n2)} + ${br(cnt[1], n)} · ${br(z2[1][j], n2)} = ${br(cnt[j], n)} ≈ ${kz(pB)}</p>
        <p>${mit ? "Gleich, also unabhängig." : "Verschieden, also abhängig."}</p>`,
    };
  },
});

/* ---------- 2 · Prüfen an der Tafel ---------- */
STATIONEN.push({
  id: "u-tafel", titel: "Unabhängigkeit an der Vierfeldertafel prüfen", ziel: 3,
  vor: [
    { t: `400 Jugendliche: Wer ein Instrument spielt (A), wer im Chor singt (B). Sind A und B unabhängig? Wir vergleichen <span class="m">P(A)</span> mit <span class="m">P(A | B)</span>.`, v: () => tafel(VOR_ABH, vk) },
    { t: `Unter allen: <span class="m">P(A) = ${brRoh(160, 400)} = 0,4</span>. Unter den Chorsängern: <span class="m">P(A | B) = ${brRoh(60, 100)} = 0,6</span>. Wer im Chor singt, spielt öfter ein Instrument: <b>abhängig</b>.`, v: () => tafel(VOR_ABH, { ...vk, hl: { "0,0": "hl", "2,0": "hl2", "0,2": "hl", "2,2": "hl2" } }) },
    { t: `<b>Gegenprobe mit dem Produkt:</b> <span class="m">P(A) · P(B) = 0,4 · 0,25 = 0,1</span>, aber <span class="m">P(A ∩ B) = ${brRoh(60, 400)} = 0,15</span>. Nicht gleich, also abhängig. Beide Wege führen immer zum selben Urteil.`, v: () => tafel(VOR_ABH, { ...vk, hl: { "0,0": "hl", "0,2": "hl2", "2,0": "hl2" } }) },
    { t: `Eine andere Umfrage: 500 Haushalte, Garten (A) und Haustier (B). <span class="m">P(A) = ${brRoh(200, 500)} = 0,4</span> und <span class="m">P(A | B) = ${brRoh(60, 150)} = 0,4</span>. Gleich: Ob ein Haustier da ist, ändert nichts am Anteil mit Garten. <b>Unabhängig.</b>`, v: () => tafel(VOR_UNAB, { ...hk, hl: { "0,0": "hl", "2,0": "hl2" } }) },
    { t: `Produktprobe: <span class="m">0,4 · 0,3 = 0,12</span> und <span class="m">${brRoh(60, 500)} = 0,12</span> ✓. Bei Unabhängigkeit ist jedes Innenfeld das Produkt seiner beiden Randwerte.`, v: () => tafel(VOR_UNAB.map((z) => z.map((x) => x / 500)), { ...hk, fmt: (x) => kz(x) }) },
  ],
  merke: `Prüfen: <span class="m">P(A | B) = P(A)</span>? Oder: <span class="m">P(A ∩ B) = P(A) · P(B)</span>? Gilt eins davon, gilt auch das andere: unabhängig.`,
  stolper: `Nicht P(A ∩ B) mit P(A | B) vergleichen. P(A ∩ B) ist der Anteil an <b>allen</b>, P(A | B) der Anteil in der Spalte B.`,
  neu() {
    const unab = Math.random() < 0.45;
    const { w, k, N } = unab ? unabTafel() : neueTafel();
    const umgekehrt = Math.random() < 0.5;            // P(B) und P(B | A) statt P(A) und P(A | B)
    const [X, Y] = umgekehrt ? ["B", "A"] : ["A", "B"];
    const nX = umgekehrt ? w[2][0] : w[0][2], nY = umgekehrt ? w[0][2] : w[2][0], nXY = w[0][0];
    const pX = nX / N, pXY = nXY / nY;
    const html = `<p>${k.intro(N)}</p>${leg(k)}${tafel(w, tafelKopf(k))}
      <p>Sind A und B stochastisch unabhängig? Berechne P(${X}) und P(${X} | ${Y}) und vergleiche. <span class="klein leise">(Dezimalzahlen auf drei Stellen.)</span></p>`;
    return {
      html,
      felder: [
        { id: "px", label: `P(${X})`, wert: pX, tol: 0.0006,
          fallen: [{ wert: nXY / N, text: `Das ist das Innenfeld „A und B“. P(${X}) steht am Rand: alle mit ${X}, geteilt durch ${N}.` }] },
        { id: "pxy", label: `P(${X} | ${Y})`, wert: pXY, tol: 0.0006,
          fallen: [
            { wert: nXY / N, text: `Das ist P(A ∩ B), der Anteil an allen ${N}. Bei „unter der Bedingung ${Y}“ teilst du durch die ${nY} mit ${Y}.` },
            { wert: nXY / nX, text: `Das ist P(${Y} | ${X}). Die Bedingung ${Y} steht hinter dem Strich: Teile durch die Anzahl mit ${Y}.` },
          ] },
      ],
      auswahl: entscheidung(unab, unab
        ? `P(${X} | ${Y}) und P(${X}) sind gleich. Ob ${Y} eintritt, ändert nichts an der Wahrscheinlichkeit von ${X}.`
        : `P(${X} | ${Y}) und P(${X}) sind verschieden. Unter der Bedingung ${Y} ist ${X} ${pXY > pX ? "wahrscheinlicher" : "unwahrscheinlicher"}.`),
      tipps: [
        `P(${X}): Randwert von ${X} geteilt durch ${N}. P(${X} | ${Y}): Feld „A und B“ geteilt durch den Randwert von ${Y}.`,
        `P(${X}) = ${brRoh(nX, N)}, P(${X} | ${Y}) = ${brRoh(nXY, nY)}. Sind die beiden Werte gleich?`,
      ],
      loesung: `<p>P(${X}) = ${brRoh(nX, N)} ≈ ${kz(pX)}; P(${X} | ${Y}) = ${brRoh(nXY, nY)} ≈ ${kz(pXY)}</p>
        <p>Produktprobe: P(A) · P(B) = ${kz(w[0][2] / N, 4)} · ${kz(w[2][0] / N, 4)} ≈ ${kz(w[0][2] * w[2][0] / N / N, 4)}, P(A ∩ B) = ${brRoh(nXY, N)} ≈ ${kz(nXY / N, 4)}</p>
        <p>${unab ? "Gleich, also unabhängig." : "Verschieden, also abhängig."}</p>`,
    };
  },
});

/* ---------- 3 · Ergänzen ---------- */
const ANT = (w) => w.map((z) => z.map((x) => x));
STATIONEN.push({
  id: "u-ergaenzen", titel: "Tafel ergänzen bei Unabhängigkeit", ziel: 2,
  vor: (() => {
    const t = [[0.12, 0.28, 0.4], [0.18, 0.42, 0.6], [0.3, 0.7, 1]];
    const nur = (keys) => t.map((z, r) => z.map((x, c) => (keys.includes(r + "," + c) ? x : null)));
    const o = { ...hk, fmt: (x) => kz(x) };
    return [
      { t: `40 % der Haushalte haben einen Garten, 30 % ein Haustier. Wir <b>nehmen an</b>, dass beides unabhängig ist. Dann lässt sich die ganze Anteilstafel aus den Rändern füllen.`, v: () => tafel(nur(["0,2", "2,0", "2,2"]), { ...o, hl: { "0,2": "hl", "2,0": "hl" } }) },
      { t: `Unabhängig heißt: <span class="m">P(A ∩ B) = P(A) · P(B) = 0,4 · 0,3 = 0,12</span>. Das Innenfeld oben links ist das Produkt seiner Randwerte.`, v: () => tafel(nur(["0,0", "0,2", "2,0", "2,2"]), { ...o, hl: { "0,0": "hl" } }) },
      { t: `Der Rest geht wie immer über Zeilen und Spalten: <span class="m">0,4 − 0,12 = 0,28</span>, <span class="m">0,3 − 0,12 = 0,18</span>, <span class="m">1 − 0,4 = 0,6</span>, <span class="m">0,6 − 0,18 = 0,42</span>.`, v: () => tafel(t, { ...o, hl: { "0,1": "hl", "1,0": "hl", "1,1": "hl", "1,2": "hl", "2,1": "hl" } }) },
      { t: `<b>Probe:</b> Auch die anderen Innenfelder sind Produkte ihrer Ränder, z. B. <span class="m">0,6 · 0,7 = 0,42</span> ✓. Mit A und B sind auch ${Q("A")} und ${Q("B")} unabhängig.`, v: () => tafel(t, { ...o, hl: { "1,1": "hl", "1,2": "hl2", "2,1": "hl2" } }) },
      { t: `<b>Rückwärts:</b> Sind A und B unabhängig mit <span class="m">P(A) = 0,4</span> und <span class="m">P(A ∩ B) = 0,1</span>, dann folgt aus <span class="m">0,4 · P(B) = 0,1</span>: <span class="m">P(B) = 0,1 : 0,4 = 0,25</span>.`, v: () => tafel([[0.1, null, 0.4], [null, null, null], [null, null, 1]], { fmt: (x) => kz(x) }) },
    ];
  })(),
  merke: `Bei Unabhängigkeit ist jedes Innenfeld der Anteilstafel das Produkt seiner Randwerte. Ist ein Produkt bekannt, findet man den fehlenden Faktor durch Teilen.`,
  stolper: `Nicht addieren: P(A ∩ B) ist nicht P(A) + P(B). Und die Produktregel gilt nur, weil Unabhängigkeit <b>vorausgesetzt</b> ist.`,
  neu() {
    if (Math.random() < 0.55) {
      const k = wahl(KONTEXTE);
      const pa = wahl([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]), pb = wahl([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65]);
      const t = [[pa * pb, pa * (1 - pb), pa], [(1 - pa) * pb, (1 - pa) * (1 - pb), 1 - pa], [pb, 1 - pb, 1]];
      const geg = ["0,2", "2,0", "2,2"];
      const offen = ["0,0", "0,1", "1,0", "1,1", "1,2", "2,1"];
      const bekannt = t.map((z, r) => z.map((x, c) => (geg.includes(r + "," + c) ? x : null)));
      const html = `<p>Für ${k.wer} gilt: ${pz(pa)} ${k.aP}, ${pz(pb)} ${k.bP}. Angenommen, A und B sind <b>stochastisch unabhängig</b>.</p>${leg(k)}
        <p>Fülle die Anteilstafel aus (Dezimalzahlen, z. B. 0,12).</p>
        ${tafel(bekannt, { ...tafelKopf(k), fmt: (x) => kz(x), eingabe: new Set(offen), id: "uebTafel" })}`;
      const tf = offen.map((key) => {
        const [r, c] = key.split(",").map(Number);
        const fallen = [];
        if (key === "0,0") fallen.push({ wert: pa + pb, text: "Addiert statt multipliziert. Bei Unabhängigkeit gilt P(A ∩ B) = P(A) · P(B)." });
        if (key === "1,1") fallen.push({ wert: 1 - pa * pb, text: "Das ist 1 − P(A ∩ B). Gesucht ist „weder A noch B“: P(Ā) · P(B̄) oder über die Zeile." });
        return { key, wert: t[r][c], tol: 0.0051, fallen };
      });
      return {
        html, felder: [], art: "tafel", tafelFelder: tf,
        tipps: [`Oben links: P(A) · P(B) = ${kz(pa)} · ${kz(pb)}.`, `Danach jede Zeile und jede Spalte: innen zusammen = Rand. Probe: Auch unten rechts innen ist ein Produkt, ${kz(1 - pa)} · ${kz(1 - pb)}.`],
        loesung: tafel(t, { ...tafelKopf(k), fmt: (x) => kz(x, 4) }),
      };
    }
    const pa = wahl([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]), pb = wahl([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8]);
    const pab = pa * pb;
    const html = `<p>A und B sind stochastisch unabhängig. Es gilt <span class="m">P(A) = ${kz(pa)}</span> und <span class="m">P(A ∩ B) = ${kz(pab, 4)}</span>.</p>
      <p class="klein leise">Dezimalzahlen auf drei Stellen.</p>`;
    return {
      html,
      felder: [
        { id: "pb", label: "P(B)", wert: pb, tol: 0.0006,
          fallen: [
            { wert: pab * pa, text: "Multipliziert statt geteilt. Aus P(A) · P(B) = P(A ∩ B) folgt P(B) = P(A ∩ B) : P(A)." },
            { wert: pab, text: "Das ist P(A ∩ B) selbst. Gesucht ist der zweite Faktor." },
            { wert: pa - pab, text: "Das ist P(A ∩ B̄) (Rest der Zeile A). Gesucht ist P(B): teilen statt abziehen." },
          ] },
        Math.random() < 0.5
          ? { id: "nn", label: `P(${Q("A")} ∩ ${Q("B")})`, wert: (1 - pa) * (1 - pb), tol: 0.0006,
              fallen: [
                { wert: 1 - pab, text: "Das ist 1 − P(A ∩ B), also „nicht beides“. Gesucht ist „weder A noch B“." },
                { wert: 1 - pa - pb, text: "Du hast P(A ∩ B) doppelt abgezogen. Rechne P(Ā) · P(B̄) oder über die Tafel." },
              ] }
          : { id: "oder", label: "P(A ∪ B)", wert: pa + pb - pab, tol: 0.0006,
              fallen: [
                { wert: pa + pb, text: "Einfach addiert: Dann zählt „A und B“ doppelt. P(A ∪ B) = P(A) + P(B) − P(A ∩ B)." },
                { wert: pab, text: "Das ist „A und B“. Gesucht ist „A oder B“ (mindestens eins von beiden)." },
              ] },
      ],
      tipps: [`Setze ein: ${kz(pa)} · P(B) = ${kz(pab, 4)}. Nach P(B) auflösen.`, `Zeichne die Anteilstafel: Mit P(A), P(B) und P(A ∩ B) bekommst du jedes Feld über Zeilen und Spalten. Mit A und B sind auch ${Q("A")} und ${Q("B")} unabhängig.`],
      loesung: `<p>P(B) = ${kz(pab, 4)} : ${kz(pa)} = ${kz(pb)}</p><p>P(${Q("A")} ∩ ${Q("B")}) = ${kz(1 - pa)} · ${kz(1 - pb)} = ${kz((1 - pa) * (1 - pb), 4)}; P(A ∪ B) = ${kz(pa)} + ${kz(pb)} − ${kz(pab, 4)} = ${kz(pa + pb - pab, 4)}</p>
        ${tafel([[pab, pa - pab, pa], [pb - pab, (1 - pa) * (1 - pb), 1 - pa], [pb, 1 - pb, 1]], { fmt: (x) => kz(x, 4) })}`,
    };
  },
});

/* ---------- 4 · Flächenbild ---------- */
STATIONEN.push({
  id: "u-flaeche", titel: "Flächenbild: gerade oder gestuft?", ziel: 2,
  vor: [
    { t: `Ein Quadrat steht für alle 400 Jugendlichen. Senkrecht teilen wir nach B: Die Spalte „Chor“ ist ${brRoh(100, 400)} = ein Viertel breit. In jeder Spalte teilen wir waagerecht nach A.`, v: () => mosaikBild(VOR_ABH, VOR_K) },
    { t: `Die <b>Höhe</b> des blauen Teils ist der Anteil von A <i>in dieser Spalte</i>: links <span class="m">P(A | B) = 0,6</span>, rechts <span class="m">P(A | ${Q("B")}) = ${brRoh(100, 300)} ≈ 0,33</span>. Die Trennlinie springt: <b>abhängig</b>.`, v: () => mosaikBild(VOR_ABH, VOR_K) },
    { t: `Die Haushalte mit Garten und Haustier: links ${brRoh(60, 150)} = 0,4, rechts ${brRoh(140, 350)} = 0,4. Die Trennlinie läuft <b>gerade durch</b>: <b>unabhängig</b>.`, v: () => mosaikBild(VOR_UNAB, HAUS) },
    { t: `Die Fläche des blauen Rechtecks links ist Breite mal Höhe: <span class="m">P(B) · P(A | B) = P(A ∩ B)</span>. Läuft die Linie gerade, ist die Höhe überall P(A), also <span class="m">P(A ∩ B) = P(B) · P(A)</span>, die Produktregel.`, v: () => mosaikBild(VOR_UNAB, HAUS) },
  ],
  merke: `Im Flächenbild ist die Breite P(B), die Höhe in der Spalte P(A | B). Gleich hohe Teile in beiden Spalten bedeuten Unabhängigkeit.`,
  stolper: `Nicht die Flächen vergleichen, sondern die Höhen. Eine schmale Spalte hat wenig Fläche, kann aber denselben Anteil haben.`,
  neu() {
    const unab = Math.random() < 0.45;
    const { w, k, N } = unab ? unabTafel() : neueTafel();
    const h1 = w[0][0] / w[2][0], h2 = w[0][1] / w[2][1];
    const html = `<p>${k.intro(N)}</p>${leg(k)}
      <p>Das Flächenbild zeigt das Ergebnis. In der Spalte B sind ${w[2][0]}, in der Spalte ${Q("B")} ${w[2][1]}.</p>
      <p class="klein leise">Dezimalzahlen auf drei Stellen.</p>`;
    return {
      html, bild: mosaikBild(w, k),
      felder: [
        { id: "h1", label: "P(A | B)", wert: h1, tol: 0.0006,
          fallen: [{ wert: w[0][0] / N, text: `Das ist P(A ∩ B), der Anteil an allen ${N}. Die Höhe misst den Anteil in der Spalte: durch ${w[2][0]} teilen.` },
                   { wert: w[0][0] / w[0][2], text: "Das ist P(B | A). Die Spalte ist B: Teile durch die Anzahl in der Spalte B." }] },
        { id: "h2", label: `P(A | ${Q("B")})`, wert: h2, tol: 0.0006,
          fallen: [{ wert: w[0][1] / N, text: `Das ist P(A ∩ ${Q("B")}), der Anteil an allen. Die Höhe misst den Anteil in der Spalte ${Q("B")}: durch ${w[2][1]} teilen.` }] },
      ],
      auswahl: entscheidung(unab, unab ? "Die blauen Teile sind in beiden Spalten gleich hoch: Die Trennlinie läuft gerade durch." : "Die blauen Teile sind verschieden hoch: Die Trennlinie springt."),
      tipps: [`Höhe links: Anzahl „A und B“ geteilt durch die ${w[2][0]} in Spalte B. Fehlt eine Zahl im Bild, rechne über die Spalte: oben + unten = Spaltensumme.`, `P(A | B) = ${brRoh(w[0][0], w[2][0])}, P(A | ${Q("B")}) = ${brRoh(w[0][1], w[2][1])}. Gleich oder nicht?`],
      loesung: `<p>P(A | B) = ${brRoh(w[0][0], w[2][0])} ≈ ${kz(h1)}; P(A | ${Q("B")}) = ${brRoh(w[0][1], w[2][1])} ≈ ${kz(h2)}</p><p>${unab ? "Gleich hoch, also unabhängig." : "Verschieden hoch, also abhängig."}</p>${tafel(w, tafelKopf(k))}`,
    };
  },
});

/* ---------- 5 · Würfel und Karten ---------- */
const EV_W = [
  { t: "Der erste Wurf zeigt eine 6.", f: (x) => x === 6 },
  { t: "Der erste Wurf zeigt eine gerade Zahl.", f: (x) => x % 2 === 0 },
  { t: "Der zweite Wurf zeigt höchstens eine 2.", f: (x, y) => y <= 2 },
  { t: "Die Augensumme ist 7.", f: (x, y) => x + y === 7 },
  { t: "Die Augensumme ist 8.", f: (x, y) => x + y === 8 },
  { t: "Die Augensumme ist gerade.", f: (x, y) => (x + y) % 2 === 0 },
  { t: "Es fällt ein Pasch (zweimal dieselbe Zahl).", f: (x, y) => x === y },
  { t: "Die Augensumme ist größer als 9.", f: (x, y) => x + y > 9 },
  { t: "Der zweite Wurf ist größer als der erste.", f: (x, y) => y > x },
  { t: "Die Augensumme ist höchstens 4.", f: (x, y) => x + y <= 4 },
  { t: "Beide Würfe zeigen eine ungerade Zahl.", f: (x, y) => x % 2 === 1 && y % 2 === 1 },
  { t: "Mindestens ein Wurf zeigt eine 6.", f: (x, y) => x === 6 || y === 6 },
  { t: "Der zweite Wurf zeigt eine 3 oder eine 4.", f: (x, y) => y === 3 || y === 4 },
  { t: "Das Produkt der Augenzahlen ist gerade.", f: (x, y) => (x * y) % 2 === 0 },
];
/* Drei Münzwürfe: Zeile = erster Wurf, Spalte = zweiter und dritter Wurf */
const MZ = ["W", "Z"], MS = ["WW", "WZ", "ZW", "ZZ"];
const EV_M = [
  { t: "Der erste Wurf zeigt Wappen.", f: (s) => s[0] === "W" },
  { t: "Es fällt genau zweimal Wappen.", f: (s) => s.split("W").length - 1 === 2 },
  { t: "Es fällt mindestens einmal Zahl.", f: (s) => s.includes("Z") },
  { t: "Der dritte Wurf zeigt Zahl.", f: (s) => s[2] === "Z" },
  { t: "Alle drei Würfe zeigen dasselbe.", f: (s) => s === "WWW" || s === "ZZZ" },
  { t: "Der zweite Wurf zeigt dasselbe wie der erste.", f: (s) => s[0] === s[1] },
  { t: "Es fällt öfter Wappen als Zahl.", f: (s) => s.split("W").length - 1 >= 2 },
];
const EV_K = [
  { t: "Die Karte ist eine Herz-Karte.", f: (fa) => fa === 2 },
  { t: "Die Karte ist rot (Herz oder Karo).", f: (fa) => fa >= 2 },
  { t: "Die Karte ist schwarz (Kreuz oder Pik).", f: (fa) => fa < 2 },
  { t: "Die Karte ist ein Bube.", f: (fa, we) => we === 4 },
  { t: "Die Karte ist ein Ass.", f: (fa, we) => we === 7 },
  { t: "Die Karte ist ein Bild (Bube, Dame oder König).", f: (fa, we) => we >= 4 && we <= 6 },
  { t: "Die Karte ist eine Zahlkarte (7 bis 10).", f: (fa, we) => we <= 3 },
  { t: "Die Karte ist eine Dame oder ein König.", f: (fa, we) => we === 5 || we === 6 },
  { t: "Die Karte ist eine Kreuz-Karte.", f: (fa) => fa === 0 },
  { t: "Die Karte hat einen Wert von 9 bis König.", f: (fa, we) => we >= 2 && we <= 6 },
  { t: "Die Karte ist eine rote Zahlkarte.", f: (fa, we) => fa >= 2 && we <= 3 },
  { t: "Die Karte ist ein König.", f: (fa, we) => we === 6 },
];
STATIONEN.push({
  id: "u-abzaehlen", titel: "Würfel und Karten: abzählen und prüfen", ziel: 3,
  vor: (() => {
    const A = (x) => x === 6, B7 = (x, y) => x + y === 7, B8 = (x, y) => x + y === 8;
    const m = (fa, fb) => (r, c) => { const a = fa(r + 1, c + 1), b = fb(r + 1, c + 1); return a && b ? "ab" : a ? "a" : b ? "b" : ""; };
    const zk = [1, 2, 3, 4, 5, 6];
    return [
      { t: `Zwei Würfelwürfe: 36 gleich wahrscheinliche Ergebnisse. A: „Der erste Wurf zeigt eine 6.“ B: „Die Augensumme ist 7.“`, v: () => rasterBild(zk, zk, null, "1. Wurf", "2. Wurf") },
      { t: `Abzählen: A hat 6 Felder, B hat 6 Felder, beides zugleich nur (6 | 1). <span class="m">P(A) · P(B) = ${br(1, 6)} · ${br(1, 6)} = ${br(1, 36)}</span> und <span class="m">P(A ∩ B) = ${br(1, 36)}</span> ✓. <b>Unabhängig.</b>`, v: () => rasterBild(zk, zk, m(A, B7), "1. Wurf", "2. Wurf") + RASTER_LEG },
      { t: `Mit B: „Augensumme 8“ sieht es anders aus. B hat 5 Felder, beides zugleich wieder eins: <span class="m">P(A ∩ B) = ${br(1, 36)}</span>, aber <span class="m">P(A) · P(B) = ${br(1, 6)} · ${br(5, 36)} = ${br(5, 216)}</span>. <b>Abhängig.</b>`, v: () => rasterBild(zk, zk, m(A, B8), "1. Wurf", "2. Wurf") + RASTER_LEG },
      { t: `In Worten: Nach einer 6 im ersten Wurf ist Summe 8 mit ${br(1, 6)} möglich (eine 2), insgesamt nur mit ${br(5, 36)}. Die erste 6 macht die 8 wahrscheinlicher. Bei der 7 klappt es nach jeder ersten Zahl genau einmal.`, v: () => rasterBild(zk, zk, m(A, B8), "1. Wurf", "2. Wurf") + RASTER_LEG },
      { t: `<b>Achtung, unvereinbar ist nicht unabhängig:</b> „Ass“ und „Bild“ können nie zusammen kommen, <span class="m">P(A ∩ B) = 0</span>. Das Produkt der beiden Wahrscheinlichkeiten ist aber nicht 0. Wer ein Ass zieht, weiß sicher: kein Bild. Das ist stärkste Abhängigkeit.`, v: () => rasterBild(FARB, WERTE, (r, c) => (c === 7 ? "a" : c >= 4 && c <= 6 ? "b" : ""), "Farbe", "Wert", (r) => (r >= 2 ? "rot" : "")) + RASTER_LEG },
    ];
  })(),
  merke: `Bei gleich wahrscheinlichen Ergebnissen: zählen, dann <span class="m">P(A ∩ B) = P(A) · P(B)</span> prüfen. Unvereinbare Ereignisse (beide möglich) sind immer abhängig.`,
  stolper: `Unabhängig heißt nicht „haben nichts miteinander zu tun“ und nicht „können nicht zusammen eintreten“. Entscheidend ist allein die Rechnung.`,
  neu() {
    const art = wahl(["karten", "wuerfel", "muenzen"]), karten = art === "karten";
    const liste = { karten: EV_K, wuerfel: EV_W, muenzen: EV_M }[art];
    const Z = { karten: 4, wuerfel: 6, muenzen: 2 }[art], S = { karten: 8, wuerfel: 6, muenzen: 4 }[art], N = Z * S;
    /* Ereignis an der Stelle (Zeile r, Spalte c) auswerten */
    const gilt = (E, r, c) => (art === "karten" ? E.f(r, c) : art === "wuerfel" ? E.f(r + 1, c + 1) : E.f(MZ[r] + MS[c]));
    const will = Math.random() < 0.45;
    let A, B, nA, nB, nAB, unab;
    for (let v = 0; v < 300; v++) {
      [A, B] = mischen([...liste]).slice(0, 2);
      nA = nB = nAB = 0;
      for (let r = 0; r < Z; r++) for (let c = 0; c < S; c++) {
        const a = gilt(A, r, c), b = gilt(B, r, c);
        nA += a; nB += b; nAB += a && b;
      }
      if (nA === 0 || nB === 0 || nA === N || nB === N || nA === nAB && nB === nAB) continue;
      unab = nAB * N === nA * nB;
      if (unab === will) break;
    }
    const mark = (r, c) => { const a = gilt(A, r, c), b = gilt(B, r, c); return a && b ? "ab" : a ? "a" : b ? "b" : ""; };
    const raster = (m) => art === "karten" ? rasterBild(FARB, WERTE, m, "Farbe", "Wert", (r) => (r >= 2 ? "rot" : ""))
      : art === "wuerfel" ? rasterBild([1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6], m, "1. Wurf", "2. Wurf")
      : rasterBild(MZ, MS, m, "1. Wurf", "2. und 3. Wurf");
    const html = `<p>${{ karten: "Aus einem Kartenspiel mit 32 Karten (Kreuz, Pik, Herz, Karo; jeweils 7, 8, 9, 10, Bube, Dame, König, Ass) wird zufällig eine Karte gezogen.", wuerfel: "Ein Würfel wird zweimal geworfen.", muenzen: "Eine Münze wird dreimal geworfen (W: Wappen, Z: Zahl)." }[art]}</p>
      <p>A: „${A.t.replace(/\.$/, "")}.“<br>B: „${B.t.replace(/\.$/, "")}.“</p>
      <p class="klein leise">Als Bruch (z. B. ${{ karten: "3/8", wuerfel: "5/36", muenzen: "3/8" }[art]}) oder als Dezimalzahl auf drei Stellen.</p>`;
    const pA = nA / N, pB = nB / N, pAB = nAB / N;
    return {
      html, geschichte: "abzaehlen-" + art, bild: raster(null) + `<p class="klein leise unterschrift">${N} gleich wahrscheinliche Ergebnisse</p>`,
      felder: [
        { id: "a", label: "P(A)", wert: pA, tol: 0.0006, fallen: [{ wert: nA, text: `Das ist eine Anzahl. Teile durch alle ${N} Ergebnisse.` }] },
        { id: "b", label: "P(B)", wert: pB, tol: 0.0006, fallen: [{ wert: nB, text: `Das ist eine Anzahl. Teile durch alle ${N} Ergebnisse.` }] },
        { id: "ab", label: "P(A ∩ B)", wert: pAB, tol: 0.0006,
          fallen: [
            ...(unab ? [] : [{ wert: pA * pB, text: "Das ist P(A) · P(B). Ob das gleich P(A ∩ B) ist, sollst du gerade prüfen. Zähle die Ergebnisse, bei denen A und B zugleich eintreten." }]),
            { wert: (nA + nB - nAB) / N, text: "Das ist „A oder B“. Gesucht ist „A und B“: beides zugleich." },
          ] },
      ],
      auswahl: entscheidung(unab, unab ? `P(A) · P(B) = ${brT(nA * nB, N * N)} und P(A ∩ B) = ${brT(nAB, N)} sind gleich.` : `P(A) · P(B) = ${brT(nA * nB, N * N)}, aber P(A ∩ B) = ${brT(nAB, N)}.${nAB === 0 ? " Unvereinbare Ereignisse sind abhängig: Tritt A ein, ist B ausgeschlossen." : ""}`),
      tipps: [`Geh das Raster durch: In welchen Feldern gilt A, in welchen B, in welchen beides? Zähle alle drei.`, raster(mark) + RASTER_LEG],
      loesung: `${raster(mark)}${RASTER_LEG}<p>P(A) = ${br(nA, N)}, P(B) = ${br(nB, N)}, P(A ∩ B) = ${nAB ? br(nAB, N) : "0"}</p>
        <p>P(A) · P(B) = ${br(nA * nB, N * N)} ${unab ? "=" : "≠"} P(A ∩ B), also ${unab ? "unabhängig" : "abhängig"}.</p>`,
    };
  },
});

/* ---------- 6 · Produktfalle ---------- */
/* t(pA, pB, pAgB) → Sachtext; unab: A und B sind unabhängig (P(A | B) = P(A)) */
const FALLE = [
  { pB: [1, 4], pAB: [60, 85], q: [15, 25],
    t: (a, b, ab) => `Unter den jungen Männern einer Stadt sind ${pz(a)} größer als 1,85 m (A). ${pz(b)} spielen im Verein Basketball (B). Von den Basketballern sind ${pz(ab)} größer als 1,85 m.` },
  { pB: [10, 25], pAB: [70, 90], q: [10, 25],
    t: (a, b, ab) => `An ${pz(b)} der Sommertage ist es heiß, über 30 °C (B). An ${pz(a)} aller Sommertage verkauft ein Eiscafé mehr als 300 Kugeln (A), an den heißen Tagen sogar an ${pz(ab)}.` },
  { pB: [5, 15], pAB: [50, 80], q: [10, 20],
    t: (a, b, ab) => `An ${pz(a)} der Wintertage hat ein Regionalzug Verspätung (A). An ${pz(b)} der Wintertage schneit es (B). An Schneetagen ist der Zug zu ${pz(ab)} verspätet.` },
  { pB: [24, 26], q: [15, 25], unab: true,
    t: (a, b, ab) => `Unter den jungen Männern einer Stadt sind ${pz(a)} größer als 1,85 m (A). ${pz(b)} haben im Sommer Geburtstag, Juni bis August (B). Von den Sommergeborenen sind ${pz(ab)} größer als 1,85 m.` },
  { pB: [5, 12], pAB: [20, 40], q: [1, 3],
    t: (a, b, ab) => `In einem Dorf fällt an ${pz(a)} der Sommertage kurz der Strom aus (A). An ${pz(b)} der Sommertage gibt es ein Gewitter (B). An Gewittertagen fällt der Strom an ${pz(ab)} der Tage aus.` },
  { pB: [20, 35], pAB: [80, 95], q: [15, 30],
    t: (a, b, ab) => `Ein Pendler hat an ${pz(a)} der Arbeitstage eine Regenjacke dabei (A). An ${pz(b)} der Arbeitstage regnet es morgens (B). An Regentagen nimmt er die Jacke in ${pz(ab)} der Fälle mit.` },
  { pB: [7, 9], q: [9, 12], unab: true,
    t: (a, b, ab) => `${pz(a)} der Menschen sind Linkshänder (A). ${pz(b)} der Menschen haben im Juni Geburtstag (B). Unter den Juni-Geborenen sind ebenfalls ${pz(ab)} Linkshänder.` },
  { pB: [48, 52], q: [32, 35], unab: true,
    t: (a, b, ab) => `Ein Würfel und eine Münze werden gleichzeitig geworfen, viele Male hintereinander. Der Würfel zeigt in ${pz(a)} der Würfe eine 1 oder 2 (A), die Münze in ${pz(b)} der Würfe Wappen (B). Unter den Würfen mit Wappen zeigt der Würfel in ${pz(ab)} der Fälle eine 1 oder 2.` },
];
/* Gemeinsame Ursache: Wetter → Eis, Wetter → Sonnenbrand */
function ursacheBild() {
  const kasten = (x, y, w, t, cls) => `<rect x="${x}" y="${y}" width="${w}" height="38" rx="9" class="uk ${cls}"/><text x="${x + w / 2}" y="${y + 25}" class="ut">${t}</text>`;
  return `<svg class="ursache" viewBox="0 0 320 190" role="img" aria-label="Heißes Wetter führt zu mehr Eis und zu mehr Sonnenbrand">
    <defs><marker id="pfeilU" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="up"/></marker></defs>
    ${kasten(95, 8, 130, "heißes Wetter", "w")}
    <line x1="130" y1="48" x2="72" y2="128" class="ul" marker-end="url(#pfeilU)"/><line x1="190" y1="48" x2="248" y2="128" class="ul" marker-end="url(#pfeilU)"/>
    ${kasten(8, 132, 120, "viel Eis", "e")}${kasten(192, 132, 120, "Sonnenbrand", "e")}
    <line x1="132" y1="151" x2="188" y2="151" class="ud"/><text x="160" y="182" class="ut klein2">abhängig, aber keine Ursache</text></svg>`;
}
STATIONEN.push({
  id: "u-falle", titel: "Die Produktfalle", ziel: 3,
  vor: (() => {
    const s = { s1: ["B", QS("B")], s2: [["A", QS("A")], ["A", QS("A")]] };
    return [
      { t: `2 % der jungen Männer einer Stadt spielen im Verein Basketball (B). 25 % sind größer als 1,85 m (A). Wie viele sind beides?`, v: () => hundertBild(25, "größer als 1,85 m", null) },
      { t: `<b>Falsch:</b> <span class="m">0,25 · 0,02 = 0,005</span>. Das Produkt unterstellt, dass Basketballer nicht öfter groß sind als alle anderen, also Unabhängigkeit. Die ist hier nicht plausibel.`, v: () => baum({ ...s, p1: ["0,02", "0,98"], p2: [["0,25 ?", ""], ["", ""]] }) },
      { t: `<b>Richtig:</b> Von den Basketballern sind etwa 70 % groß, <span class="m">P(A | B) = 0,7</span>. Pfadregel: <span class="m">P(A ∩ B) = P(B) · P(A | B) = 0,02 · 0,7 = 0,014</span>, fast dreimal so viel.`, v: () => baum({ ...s, p1: ["0,02", "0,98"], p2: [["0,7", "0,3"], ["", ""]], hl: [0], enden: ["0,014", "", "", ""] }) },
      { t: `Die Pfadregel <span class="m">P(A ∩ B) = P(B) · P(A | B)</span> gilt <b>immer</b>. Nur bei Unabhängigkeit darf man P(A | B) durch P(A) ersetzen. Das ist die Produktregel.`, v: () => baum({ ...s, p1: ["P(B)", ""], p2: [["P(A | B)", ""], ["", ""]], hl: [0], enden: ["P(A ∩ B)", "", "", ""] }) },
      { t: `<b>Abhängig heißt nicht verursacht.</b> An heißen Tagen wird mehr Eis verkauft, und es gibt mehr Sonnenbrand: stochastisch abhängig. Trotzdem verursacht das Eis keinen Sonnenbrand. Beides hängt am Wetter. Die Rechnung zeigt den Zusammenhang, nicht den Grund.`, v: () => ursacheBild() },
    ];
  })(),
  merke: `Immer richtig: <span class="m">P(A ∩ B) = P(B) · P(A | B)</span>. Nur bei Unabhängigkeit: <span class="m">P(A ∩ B) = P(A) · P(B)</span>. Abhängigkeit beschreibt einen Zusammenhang, keine Ursache.`,
  stolper: `Wer ohne Prüfung P(A) · P(B) rechnet, unterstellt Unabhängigkeit. Bei Zusammenhängen wie Sport und Körpergröße liegt man damit weit daneben.`,
  neu() {
    const c = wahl(FALLE);
    const pB = zufall(c.pB[0], c.pB[1]) / 100, q = zufall(c.q[0], c.q[1]) / 100;
    const pAgB = c.unab ? q : zufall(c.pAB[0], c.pAB[1]) / 100;
    const pA = c.unab ? q : Math.round((pB * pAgB + (1 - pB) * q) * 100) / 100;
    const richtig = pB * pAgB;
    const html = `<p>${c.t(pA, pB, pAgB)}</p>
      <p><b>Wie groß ist P(A ∩ B)?</b> Und sind A und B unabhängig?</p>
      <p class="klein leise">Dezimalzahl auf vier Stellen, z. B. 0,0125.</p>`;
    return {
      html,
      felder: [
        { id: "ab", label: "P(A ∩ B)", wert: richtig, tol: 0.00006,
          fallen: [
            ...(c.unab ? [] : [{ wert: pA * pB, text: "Das ist P(A) · P(B), die Produktregel. Sie gilt nur bei Unabhängigkeit. Hier ist P(A | B) ≠ P(A): Rechne P(B) · P(A | B)." }]),
            { wert: pAgB, text: "Das ist P(A | B), der Anteil unter B. Gesucht ist der Anteil an allen: noch mal P(B)." },
          ] },
      ],
      geschichte: "falle-" + FALLE.indexOf(c),
      auswahl: entscheidung(!!c.unab, c.unab ? `P(A | B) = ${pz(pAgB)} = P(A): Ob B eintritt, ändert nichts an der Wahrscheinlichkeit von A.` : `P(A | B) = ${pz(pAgB)}, aber P(A) = ${pz(pA)}. Unter B ist A viel häufiger.`),
      tipps: [`Vergleiche P(A | B) mit P(A). Sind sie gleich, darfst du P(A) · P(B) rechnen, sonst nicht.`, `Pfad im Baum mit erster Stufe B: P(A ∩ B) = P(B) · P(A | B) = ${kz(pB)} · ${kz(pAgB)}.`],
      loesung: `<p>P(A ∩ B) = P(B) · P(A | B) = ${kz(pB)} · ${kz(pAgB)} = ${kz(richtig, 4)}</p>
        <p>${c.unab ? `Hier gilt auch P(A) · P(B) = ${kz(pA * pB, 4)}, weil A und B unabhängig sind.` : `Das falsche Produkt P(A) · P(B) = ${kz(pA * pB, 4)} liegt um den Faktor ${kz(richtig / (pA * pB), 1)} daneben.`}</p>`,
    };
  },
});

/* ---------- 7 · gemischt ---------- */
STATIONEN.push({
  id: "u-mix", titel: "Gemischte Aufgaben", ziel: 5, vor: null,
  merke: `Erst fragen: Ist Unabhängigkeit <b>gegeben</b> (dann Produktregel) oder soll sie <b>geprüft</b> werden (dann P(A | B) mit P(A) oder P(A ∩ B) mit P(A) · P(B) vergleichen)?`,
  stolper: `Unvereinbar ist nicht unabhängig, und abhängig heißt nicht verursacht.`,
  neu() {
    const quelle = wahl(["u-idee", "u-tafel", "u-ergaenzen", "u-flaeche", "u-abzaehlen", "u-falle"]);
    const a = STATIONEN.find((s) => s.id === quelle).neu();
    a.herkunft = quelle;
    return a;
  },
});

