/* ============================================================
   Zaehler · Pruefung

   Faehrt kern.mjs gegen einen Speicher im Arbeitsspeicher durch —
   ohne Netz, ohne Cloudflare, ohne Konto. Geprueft wird das, was der
   Zaehler verspricht:

     * Gezaehlt wird nur, was auf der Liste steht. Ein erfundener
       Name, ein unerlaubter Zusatz, ein fremder Trainer: nichts.
     * Im Speicher steht je Trainer, Tag und Ereignis eine Zahl —
       und sonst NICHTS. Keine Adresse, keine Kennung, keine Uhrzeit.
     * Der Tag ist der deutsche Tag, nicht der in Weltzeit.
     * Lesen geht nur mit Leseschluessel. Ohne eingerichteten oder
       mit zu kurzem Schluessel gibt es keine Zahlen.
     * Die Obergrenzen greifen.
     * Die Auswertung summiert richtig, auch ueber Tagesgrenzen.

   Aufruf:  node pruefe.mjs
   ============================================================ */
import {
  bearbeite, ereignisPruefen, tagIn, zeilen, gleich,
  GRENZE_JE_ZAEHLER_TAG, GRENZE_ZAEHLER_JE_TAG, MAX_JE_MELDUNG, MAX_KOERPER,
} from "./kern.mjs";

/* Erfundener Wert, der NIRGENDS gesetzt werden darf. */
const LESEN = "pruefwert-lesen-aaaa-bbbb";
const GEHEIM = { lesen: LESEN };

const fehler = [];
const pruefe = (name, ist, soll) => {
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if (!ok) fehler.push(name + ": " + JSON.stringify(ist) + " statt " + JSON.stringify(soll));
  console.log((ok ? "  ok   " : "  FEHL ") + name);
};

function neuesBuch() {
  const m = new Map();
  return {
    m,
    async hole(k) { return m.get(k); },
    async setze(k, v) { m.set(k, v); },
    async bereich(von, bis) { return [...m.entries()].filter(([k]) => k >= von && k < bis).sort(); },
  };
}

const mittags = new Date("2026-10-10T10:00:00Z");
let buch = neuesBuch();
const ruf = (req, geheim = GEHEIM, b = buch, jetzt = mittags) => bearbeite(req, b, geheim, jetzt);
const melde = (koerper, kopf = {}) => new Request("https://x/v1/z", {
  method: "POST",
  headers: { "content-type": "text/plain;charset=UTF-8", "cf-connecting-ip": "203.0.113.7",
             "user-agent": "Pruefgeraet/1.0", ...kopf },
  body: typeof koerper === "string" ? koerper : JSON.stringify(koerper),
});
const hole = (pfad, kopf = {}) => new Request("https://x" + pfad, { headers: kopf });
const antwort = async (r) => ({ status: r.status, ...(await r.json()) });

console.log("\nEreignisnamen");
pruefe("bekannter Name", ereignisPruefen("diagnose-ende"), "diagnose-ende");
pruefe("Name mit Thema", ereignisPruefen("sicher:grundwert"), "sicher:grundwert");
pruefe("Name mit Zahl", ereignisPruefen("diagnose-sicher:4"), "diagnose-sicher:4");
pruefe("erfundener Name", ereignisPruefen("irgendwas"), null);
pruefe("Zusatz, wo keiner hingehört", ereignisPruefen("ton:laut"), null);
pruefe("fehlender Zusatz", ereignisPruefen("sicher"), null);
pruefe("Zusatz mit Großbuchstaben", ereignisPruefen("sicher:Grundwert"), null);
pruefe("Zusatz als Freitext", ereignisPruefen("sicher:max mustermann"), null);
pruefe("zwei Doppelpunkte", ereignisPruefen("sicher:a:b"), null);
pruefe("zu langer Zusatz", ereignisPruefen("sicher:abcdefghijklmnop"), null);
pruefe("keine Zeichenkette", ereignisPruefen({ name: "ton" }), null);

console.log("\nMelden");
pruefe("eine Meldung mit drei Ereignissen",
  await antwort(await ruf(melde({ t: "prozent", e: ["besuch-neu", "diagnose-start", "sicher:grundwert"] }))),
  { status: 200, ok: true, gezaehlt: 3 });
pruefe("Unbekanntes wird übergangen, Bekanntes gezählt",
  await antwort(await ruf(melde({ t: "prozent", e: ["besuch-neu", "geheim", "ton:x", 7, null] }))),
  { status: 200, ok: true, gezaehlt: 1 });
pruefe("fremder Trainer", (await ruf(melde({ t: "bruch", e: ["besuch-neu"] }))).status, 400);
pruefe("kein JSON", (await ruf(melde("besuch-neu"))).status, 400);
pruefe("Ereignisse nicht als Liste", (await ruf(melde({ t: "prozent", e: "besuch-neu" }))).status, 400);
pruefe("zu großer Körper", (await ruf(melde("x".repeat(MAX_KOERPER + 1)))).status, 413);
pruefe("mehr als erlaubt je Meldung: der Rest fällt weg",
  (await antwort(await ruf(melde({ t: "prozent", e: Array(MAX_JE_MELDUNG + 5).fill("eltern") })))).gezaehlt,
  MAX_JE_MELDUNG);

console.log("\nWas im Speicher steht");
pruefe("Schlüssel", [...buch.m.keys()].sort(), [
  "c:prozent:2026-10-10:besuch-neu", "c:prozent:2026-10-10:diagnose-start",
  "c:prozent:2026-10-10:eltern", "c:prozent:2026-10-10:sicher:grundwert", "n:prozent:2026-10-10"]);
pruefe("Werte sind nichts als Zahlen", [...buch.m.values()].every((v) => Number.isInteger(v)), true);
const alles = JSON.stringify([...buch.m.entries()]);
pruefe("keine IP im Speicher", alles.includes("203.0.113"), false);
pruefe("kein Gerätename im Speicher", alles.includes("Pruefgeraet"), false);
pruefe("keine Uhrzeit im Speicher", /\d\d:\d\d/.test(alles), false);
pruefe("besuch-neu steht auf 2", buch.m.get("c:prozent:2026-10-10:besuch-neu"), 2);

console.log("\nDer Tag ist der deutsche Tag");
pruefe("23:30 Uhr Weltzeit im Sommer ist schon morgen", tagIn(new Date("2026-08-01T23:30:00Z")), "2026-08-02");
pruefe("22:30 Uhr Weltzeit im Winter ist noch heute", tagIn(new Date("2026-12-01T22:30:00Z")), "2026-12-01");
pruefe("23:30 Uhr Weltzeit im Winter ist schon morgen", tagIn(new Date("2026-12-01T23:30:00Z")), "2026-12-02");

console.log("\nLesen");
pruefe("ohne Schlüssel: Startseite verrät nichts", await (await ruf(hole("/"))).text(), "Zähler läuft.");
pruefe("Zahlen ohne Schlüssel", (await ruf(hole("/v1/zahlen"))).status, 403);
pruefe("Zahlen mit falschem Schlüssel", (await ruf(hole("/v1/zahlen?s=falsch-falsch-falsch"))).status, 403);
pruefe("kein Schlüssel eingerichtet", (await ruf(hole("/v1/zahlen?s=" + LESEN), { lesen: "" })).status, 503);
pruefe("zu kurzer Schlüssel gilt als nicht eingerichtet",
  (await ruf(hole("/v1/zahlen?s=kurz"), { lesen: "kurz" })).status, 503);
pruefe("leerer Schlüssel öffnet nichts", gleich("", ""), false);
const zahlen = await antwort(await ruf(hole("/v1/zahlen?s=" + LESEN)));
pruefe("mit Schlüssel: Summe", zahlen.summe,
  { "besuch-neu": 2, "diagnose-start": 1, "eltern": MAX_JE_MELDUNG, "sicher:grundwert": 1 });
pruefe("Schlüssel auch als Kopfzeile", (await ruf(hole("/v1/zahlen", { "x-lesen": LESEN }))).status, 200);
pruefe("fremder Trainer beim Lesen", (await ruf(hole("/v1/zahlen?t=bruch&s=" + LESEN))).status, 404);
const seite = await (await ruf(hole("/?s=" + LESEN))).text();
pruefe("Seite nennt die Stationen", seite.includes("Diagnose begonnen") && seite.includes("grundwert"), true);
pruefe("Seite nennt den Schlüssel nicht", seite.includes(LESEN), false);
pruefe("Ping nennt keinen Schlüssel und keine Zahl",
  await antwort(await ruf(hole("/v1/ping"))),
  { status: 200, ok: true, dienst: "zaehler", trainer: ["prozent", "knobeln10"], lesen: true, schluesselZuKurz: false });

console.log("\nKnobelsprünge 10: eigene Stationen");
pruefe("Anmeldung mit Tafelzahl", ereignisPruefen("anmeldung:zahl", "knobeln10"), "anmeldung:zahl");
pruefe("Aufgabe mit Nummer", ereignisPruefen("aufgabe:c8", "knobeln10"), "aufgabe:c8");
pruefe("Station des Prozent-Trainers gilt hier nicht", ereignisPruefen("diagnose-start", "knobeln10"), null);
pruefe("Station von Knobeln gilt beim Prozent-Trainer nicht", ereignisPruefen("tueftel:t1", "prozent"), null);
pruefe("unbekannte Seite", ereignisPruefen("besuch-neu", "bruch"), null);
pruefe("Meldung von Knobeln",
  await antwort(await ruf(melde({ t: "knobeln10", e: ["besuch-neu", "anmeldung:ohne", "aufgabe:a1", "sicher:grundwert"] }))),
  { status: 200, ok: true, gezaehlt: 3 });
const kz = await antwort(await ruf(hole("/v1/zahlen?t=knobeln10&s=" + LESEN)));
pruefe("Knobeln getrennt vom Prozent-Trainer", kz.summe, { "anmeldung:ohne": 1, "aufgabe:a1": 1, "besuch-neu": 1 });
pruefe("Zeilen in der Reihenfolge der Knobel-Stationen",
  kz.zeilen.filter((x) => x.stufe === 0).map((x) => x.ereignis),
  ["besuch-neu", "besuch-wieder", "anmeldung", "aufgabe", "tipp", "tueftel", "ergebnis", "gespeichert"]);
pruefe("Prozent-Zahlen unverändert", (await antwort(await ruf(hole("/v1/zahlen?s=" + LESEN)))).summe["besuch-neu"], 2);
const kseite = await (await ruf(hole("/?t=knobeln10&s=" + LESEN))).text();
pruefe("Knobel-Seite nennt ihre Stationen, nicht die fremden",
  kseite.includes("Tüftelaufgabe gelöst") && !kseite.includes("Diagnose begonnen"), true);

console.log("\nÜber Tagesgrenzen");
buch = neuesBuch();
const tag = (iso) => new Date(iso + "T10:00:00Z");
await ruf(melde({ t: "prozent", e: ["besuch-neu", "vorfuehrung:zurueck"] }), GEHEIM, buch, tag("2026-10-08"));
await ruf(melde({ t: "prozent", e: ["besuch-neu", "vorfuehrung:zurueck", "vorfuehrung:doppelt"] }), GEHEIM, buch, tag("2026-10-10"));
await ruf(melde({ t: "prozent", e: ["besuch-neu"] }), GEHEIM, buch, tag("2026-08-01"));
const d3 = await antwort(await ruf(hole("/v1/zahlen?tage=3&s=" + LESEN), GEHEIM, buch, tag("2026-10-10")));
pruefe("drei Tage: Zeitraum", [d3.von, d3.bis], ["2026-10-08", "2026-10-10"]);
pruefe("drei Tage: Summe ohne den August", d3.summe,
  { "besuch-neu": 2, "vorfuehrung:zurueck": 2, "vorfuehrung:doppelt": 1 });
pruefe("ein Tag: nur heute",
  (await antwort(await ruf(hole("/v1/zahlen?tage=1&s=" + LESEN), GEHEIM, buch, tag("2026-10-10")))).summe,
  { "besuch-neu": 1, "vorfuehrung:doppelt": 1, "vorfuehrung:zurueck": 1 });
const z = zeilen(d3.summe);
pruefe("Zeilen: Vorführungen als Summe und je Thema",
  z.filter((x) => x.ereignis.startsWith("vorfuehrung")).map((x) => [x.ereignis, x.n, x.stufe]),
  [["vorfuehrung", 3, 0], ["vorfuehrung:doppelt", 1, 1], ["vorfuehrung:zurueck", 2, 1]]);
pruefe("Zeilen: nie Gezähltes steht mit 0 da", z.find((x) => x.ereignis === "check-ende").n, 0);

console.log("\nObergrenzen");
buch = neuesBuch();
buch.m.set("c:prozent:2026-10-10:eltern", GRENZE_JE_ZAEHLER_TAG);
buch.m.set("n:prozent:2026-10-10", 1);
pruefe("ein voller Zähler wächst nicht weiter",
  (await antwort(await ruf(melde({ t: "prozent", e: ["eltern"] }), GEHEIM, buch))).gezaehlt, 0);
pruefe("… und bleibt auf der Grenze", buch.m.get("c:prozent:2026-10-10:eltern"), GRENZE_JE_ZAEHLER_TAG);
buch = neuesBuch();
buch.m.set("n:prozent:2026-10-10", GRENZE_ZAEHLER_JE_TAG);
pruefe("zu viele verschiedene Zähler an einem Tag: kein neuer",
  (await antwort(await ruf(melde({ t: "prozent", e: ["sicher:neuesthema"] }), GEHEIM, buch))).gezaehlt, 0);
pruefe("… am nächsten Tag wieder",
  (await antwort(await ruf(melde({ t: "prozent", e: ["sicher:neuesthema"] }), GEHEIM, buch, tag("2026-10-11")))).gezaehlt, 1);

console.log("\nSonstiges");
pruefe("OPTIONS", (await ruf(new Request("https://x/v1/z", { method: "OPTIONS" }))).status, 204);
pruefe("jede Herkunft darf melden",
  (await ruf(melde({ t: "prozent", e: ["ton"] }))).headers.get("access-control-allow-origin"), "*");
pruefe("unbekannter Pfad", (await ruf(hole("/v1/alles"))).status, 404);
pruefe("GET auf den Meldeweg zählt nicht", (await ruf(hole("/v1/z"))).status, 404);

console.log(fehler.length ? "\nNICHT IN ORDNUNG:\n  · " + fehler.join("\n  · ") : "\nAlles in Ordnung.");
process.exit(fehler.length ? 1 : 0);
