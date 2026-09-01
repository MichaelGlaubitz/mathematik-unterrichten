/* ============================================================
   Rueckmeldebrett · Pruefung

   Faehrt kern.mjs gegen einen Speicher im Arbeitsspeicher durch —
   ohne Netz, ohne Cloudflare, ohne Konto. Geprueft wird das, was das
   Brett verspricht:

     * Ohne eingerichteten Klassencode nimmt es GAR NICHTS an.
     * Mit falschem Code auch nicht — weder melden noch abstimmen.
     * Lesen geht ohne alles.
     * Eine leere, zu knappe oder sinnlose Meldung wird abgewiesen,
       und zwar mit einem Satz, der sagt, was fehlt.
     * Die Klasse kommt aus dem Code, nicht aus dem Formular.
     * Kuerzel und Geraetenummern verlassen den Dienst nicht.
     * Eine Stimme je Geraet, aenderbar, und die Summen stimmen
       nach jedem Umschwenken.
     * Wichtiges steht oben, Abgeschlossenes unten.
     * Moderation nur mit Lehrerschluessel; Ausgeblendetes ist vom
       Brett weg, fuer die Lehrkraft aber noch da.
     * Die Schranken greifen.

   Aufruf:  node pruefe.mjs
   ============================================================ */
import {
  bearbeite, sortiere, punkte, istGehaltvoll, codesLesen, klasseFuerCode,
  GRENZE_MELDUNG_GERAET,
} from "./kern.mjs";

const CODES = "7b:hufeisen42, 10b:seilbahn7";
const LEHRER = "geheim-probe";
const GEHEIM = { codes: CODES, lehrer: LEHRER };
const OHNE_CODES = { codes: "", lehrer: LEHRER };

const fehler = [];
const pruefe = (name, ist, soll) => {
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if (!ok) fehler.push(name + ": " + JSON.stringify(ist) + " statt " + JSON.stringify(soll));
  console.log((ok ? "  ok   " : "  FEHL ") + name);
};

function neuesBrett() {
  const m = new Map();
  return {
    m,
    async lies(art) {
      return [...m.entries()].filter(([k]) => k.startsWith(art + ":")).map(([, v]) => v);
    },
    async sichere(art, e) { m.set(art + ":" + e.id, e); },
    async entferne(art, id) { m.delete(art + ":" + id); },
  };
}
function neueWache() {
  const z = new Map();
  return { async zaehle(k, grenze) { const n = (z.get(k) || 0) + 1; z.set(k, n); return n <= grenze; } };
}

const jetzt = new Date("2026-09-03T09:15:00Z");
let br = neuesBrett(), wa = neueWache();
const ruf = (req, geheim = GEHEIM, b = br, w = wa) => bearbeite(req, b, w, geheim, jetzt);

const post = (pfad, koerper, kopf = {}) => new Request("https://x" + pfad, {
  method: "POST",
  headers: { "content-type": "application/json", "cf-connecting-ip": "1.2.3.4", ...kopf },
  body: JSON.stringify(koerper),
});
const hole = (pfad, kopf = {}) => new Request("https://x" + pfad, { headers: kopf });

const MANGEL = {
  art: "mr", code: "hufeisen42", geraet: "geraet-aaaaaaaa",
  titel: "Zeichenfeld verliert die Eingabe beim Prüfen",
  felder: {
    wo: "Zehnerpotenzen 10b, Aufgabe 3, das Zeichenfeld",
    schritte: "Ich habe meine Antwort eingetippt und dann auf Prüfen getippt.",
    passiert: "Die Seite ist an den Anfang gesprungen und meine Eingabe war weg.",
    erwartet: "Dass die Lösung erscheint und die Eingabe stehen bleibt.",
    haeufig: "jedes Mal",
    geraet_art: "iPad, Safari",
  },
  kuerzel: "L.A.",
};
const WUNSCH = {
  art: "fr", code: "seilbahn7", geraet: "geraet-bbbbbbbb",
  titel: "Am Schluss zeigen, welche Aufgaben falsch waren",
  felder: {
    problem: "Ich weiß am Ende der Stunde nicht, welche Aufgaben ich falsch hatte.",
    wann: "Jedes Mal beim Exit-Ticket, seit den Selbstlernstunden.",
    vorschlag: "Eine Liste am Schluss: Aufgabe 1 richtig, Aufgabe 2 falsch, mit Link zur Lösung.",
    nutzen: "Allen, die zu Hause weiterüben wollen und nicht wissen womit.",
  },
};

console.log("=== Codes lesen");
pruefe("zwei Codes erkannt", codesLesen(CODES).length, 2);
pruefe("Code führt zur Klasse", klasseFuerCode(codesLesen(CODES), "seilbahn7"), "10b");
pruefe("falscher Code führt nirgendwohin", klasseFuerCode(codesLesen(CODES), "seilbahn8"), null);
pruefe("blanker Code gilt für alle", codesLesen("nurdieser")[0].klasse, "alle");
pruefe("zu kurzer Code zählt nicht", codesLesen("ab").length, 0);

console.log("\n=== Ohne eingerichteten Code nimmt der Dienst nichts an");
let a = await ruf(post("/v1/melden", MANGEL), OHNE_CODES);
pruefe("melden: 503", a.status, 503);
a = await ruf(post("/v1/stimme", { art: "mr", code: "x", geraet: "geraet-aaaaaaaa",
  id: "mr-20260903-abc123", wert: 1 }), OHNE_CODES);
pruefe("abstimmen: 503", a.status, 503);
a = await ruf(hole("/v1/ping"), OHNE_CODES);
pruefe("ping sagt es ehrlich", (await a.json()).schreiben, false);

console.log("\n=== Mit falschem Code auch nicht");
a = await ruf(post("/v1/melden", { ...MANGEL, code: "hufeisen43" }));
pruefe("melden: 403", a.status, 403);
pruefe("Grund genannt", (await ruf(post("/v1/zutritt", { code: "falsch" })) ).status, 403);
a = await ruf(post("/v1/zutritt", { code: "hufeisen42" }));
pruefe("Zutritt mit Code nennt die Klasse", (await a.json()).klasse, "7b");

console.log("\n=== Melden");
a = await ruf(post("/v1/melden", MANGEL));
pruefe("gültige Meldung angenommen", a.status, 200);
let d = await a.json();
const mangelId = d.eintrag.id;
pruefe("Klasse kommt aus dem Code, nicht aus dem Formular", d.eintrag.klasse, "7b");
pruefe("die eigene Stimme zählt sofort", d.eintrag.punkte, 1);
pruefe("Antwort nennt kein Kürzel", "kuerzel" in d.eintrag, false);
pruefe("Antwort nennt keine Gerätenummern", "stimmen" in d.eintrag, false);

a = await ruf(post("/v1/melden", WUNSCH));
pruefe("Wunsch angenommen, andere Klasse", (await a.json()).eintrag.klasse, "10b");

console.log("\n=== Was abgewiesen wird — und ob es sagt, warum");
const felderVon = async (koerper) => (await (await ruf(post("/v1/melden", koerper))).json()).fehler;
let f = await felderVon({ ...MANGEL, geraet: "geraet-cccccccc", titel: "kaputt" });
pruefe("zu knapper Titel benannt", typeof f.titel === "string" && f.titel.length > 20, true);
f = await felderVon({ ...MANGEL, geraet: "geraet-cccccccc", titel: "aaaa aaaa aaaa aaaa" });
pruefe("Titel ohne Gehalt abgewiesen", typeof f.titel === "string", true);
f = await felderVon({ ...MANGEL, geraet: "geraet-cccccccc",
  felder: { ...MANGEL.felder, passiert: "" } });
pruefe("fehlendes Pflichtfeld benannt", f.passiert, "Dieses Feld brauche ich.");
f = await felderVon({ ...MANGEL, geraet: "geraet-cccccccc",
  felder: { ...MANGEL.felder, passiert: "geht nicht" } });
pruefe("zu knappes Feld benannt", typeof f.passiert === "string" && f.passiert.length > 20, true);
f = await felderVon({ ...MANGEL, geraet: "geraet-cccccccc",
  felder: { ...MANGEL.felder, haeufig: "manchmal" } });
pruefe("Auswahl außerhalb der Möglichkeiten abgewiesen",
  f.haeufig, "Bitte eine der Möglichkeiten wählen.");
a = await ruf(post("/v1/melden", { ...MANGEL, geraet: "kurz" }));
pruefe("unsinnige Gerätenummer abgewiesen", (await a.json()).grund, "geraet");
a = await ruf(post("/v1/melden", { ...MANGEL, art: "xx" }));
pruefe("unbekanntes Brett abgewiesen", (await a.json()).grund, "brett");

pruefe("Blabla erkannt", istGehaltvoll("aaaa aaaa aaaa"), false);
pruefe("echter Satz erkannt", istGehaltvoll("Die Eingabe verschwindet beim Prüfen"), true);

console.log("\n=== Lesen: offen, aber ohne Innenleben");
a = await ruf(hole("/v1/brett/mr"));
pruefe("Brett ohne alles lesbar", a.status, 200);
d = await a.json();
pruefe("ein Eintrag steht darauf", d.eintraege.length, 1);
pruefe("kein Kürzel im Brett", "kuerzel" in d.eintraege[0], false);
pruefe("keine Gerätenummern im Brett", "stimmen" in d.eintraege[0], false);
pruefe("keine Gerätenummer des Melders", "geraet" in d.eintraege[0], false);
pruefe("eigene Stimme nur mit eigener Nummer",
  (await (await ruf(hole("/v1/brett/mr?geraet=geraet-aaaaaaaa"))).json()).eintraege[0].meine, 1);
pruefe("fremdes Gerät sieht keine eigene Stimme",
  (await (await ruf(hole("/v1/brett/mr?geraet=geraet-zzzzzzzz"))).json()).eintraege[0].meine, 0);
pruefe("Klassenfilter greift",
  (await (await ruf(hole("/v1/brett/mr?klasse=10b"))).json()).eintraege.length, 0);

console.log("\n=== Abstimmen");
const stimme = (geraet, wert, id = mangelId, code = "hufeisen42") =>
  ruf(post("/v1/stimme", { art: "mr", code, geraet, id, wert }));

a = await stimme("geraet-dddddddd", 1);
pruefe("zweites Gerät stimmt zu", (await a.json()).eintrag.punkte, 2);
a = await stimme("geraet-dddddddd", -1);
d = (await a.json()).eintrag;
pruefe("Umschwenken zählt nicht doppelt", [d.hoch, d.runter, d.punkte], [1, 1, 0]);
pruefe("es bleiben zwei Abstimmende", d.abgestimmt, 2);
a = await stimme("geraet-dddddddd", 0);
d = (await a.json()).eintrag;
pruefe("Zurücknehmen räumt auf", [d.hoch, d.runter, d.punkte, d.abgestimmt], [1, 0, 1, 1]);

a = await stimme("geraet-dddddddd", 1, mangelId, "falscher-code");
pruefe("abstimmen ohne gültigen Code: 403", a.status, 403);
a = await stimme("geraet-dddddddd", 1, "mr-20260903-zzzzzz");
pruefe("abstimmen für Unbekanntes: 404", a.status, 404);
a = await stimme("geraet-dddddddd", 1, "quatsch");
pruefe("unsinnige Kennung abgewiesen", (await a.json()).grund, "id");

console.log("\n=== Reihenfolge");
const bsp = [
  { id: "a", zeit: "2026-09-01T08:00:00Z", status: "neu", hoch: 1, runter: 0, stimmen: { x: 1 } },
  { id: "b", zeit: "2026-09-02T08:00:00Z", status: "neu", hoch: 9, runter: 1, stimmen: { x: 1 } },
  { id: "c", zeit: "2026-09-03T08:00:00Z", status: "erledigt", hoch: 20, runter: 0, stimmen: { x: 1 } },
];
pruefe("Wichtiges oben, Abgeschlossenes unten",
  sortiere(bsp).map((e) => e.id), ["b", "a", "c"]);
pruefe("nach Datum sortiert sich anders",
  sortiere(bsp, "neu").map((e) => e.id), ["c", "b", "a"]);
pruefe("Punkte = hoch minus runter", punkte(bsp[1]), 8);

console.log("\n=== Moderation");
a = await ruf(hole("/"));
pruefe("Moderationsseite ohne Schlüssel: 401", a.status, 401);
a = await ruf(hole("/?s=falsch"));
pruefe("falscher Schlüssel: 401", a.status, 401);
a = await ruf(post("/v1/moderation", { art: "mr", id: mangelId, tat: "verbergen" }));
pruefe("Moderation ohne Schlüssel: 401", a.status, 401);

a = await ruf(hole("/?s=" + LEHRER));
pruefe("Moderationsseite mit Schlüssel: 200", a.status, 200);
const seite = await a.text();
pruefe("die Seite nennt das Kürzel — nur hier", seite.includes("L.A."), true);
pruefe("die Seite zeigt beide Bretter",
  seite.includes("Mängelberichte") && seite.includes("Feature-Requests"), true);

const moderiere = (koerper) => ruf(post("/v1/moderation", koerper, { "x-lehrer": LEHRER }));
a = await moderiere({ art: "mr", id: mangelId, tat: "status",
  status: "in-arbeit", notiz: "Gesehen, kommt zur nächsten Stunde." });
pruefe("Status gesetzt", a.status, 200);
d = (await (await ruf(hole("/v1/brett/mr"))).json()).eintraege[0];
pruefe("Status steht öffentlich", d.status, "in-arbeit");
pruefe("Antwort steht öffentlich", d.notiz, "Gesehen, kommt zur nächsten Stunde.");

await moderiere({ art: "mr", id: mangelId, tat: "verbergen" });
pruefe("Ausgeblendetes ist vom Brett weg",
  (await (await ruf(hole("/v1/brett/mr"))).json()).eintraege.length, 0);
pruefe("für die Lehrkraft ist es noch da",
  (await (await ruf(hole("/v1/alle?s=" + LEHRER))).json()).alle.mr.length, 1);
a = await stimme("geraet-eeeeeeee", 1);
pruefe("für Ausgeblendetes lässt sich nicht stimmen", a.status, 404);

await moderiere({ art: "mr", id: mangelId, tat: "zeigen" });
pruefe("wieder gezeigt",
  (await (await ruf(hole("/v1/brett/mr"))).json()).eintraege.length, 1);
await moderiere({ art: "mr", id: mangelId, tat: "loeschen" });
pruefe("gelöscht ist gelöscht",
  (await (await ruf(hole("/v1/brett/mr"))).json()).eintraege.length, 0);

console.log("\n=== Schranken");
br = neuesBrett(); wa = neueWache();
let letzte = null;
for (let i = 0; i < GRENZE_MELDUNG_GERAET + 2; i++)
  letzte = await ruf(post("/v1/melden", { ...MANGEL, titel: MANGEL.titel + " Nummer " + i }), GEHEIM, br, wa);
pruefe("nach " + GRENZE_MELDUNG_GERAET + " Meldungen je Gerät: abgewiesen", letzte.status, 429);
pruefe("gespeichert wurden höchstens " + GRENZE_MELDUNG_GERAET,
  (await br.lies("mr")).length <= GRENZE_MELDUNG_GERAET, true);

console.log("\n=== Leitfaden und Felder kommen aus dem Kern");
d = await (await ruf(hole("/v1/leitfaden"))).json();
pruefe("beide Bretter haben Felder",
  d.felder.mr.length > 0 && d.felder.fr.length > 0, true);
pruefe("beide Bretter haben Regeln",
  d.leitfaden.mr.length > 0 && d.leitfaden.fr.length > 0, true);

console.log();
if (fehler.length) {
  console.log("FEHLER:");
  fehler.forEach((f) => console.log("- " + f));
  process.exit(1);
}
console.log("Rückmeldebrett: nimmt nur mit Code an, gibt kein Innenleben heraus,");
console.log("und die Stimmen stimmen.");
