/* KI-Rückmeldung · Prüfung ohne Netz, ohne Konto, ohne Kosten.
   Aufruf: node pruefe.mjs                                          */
import { bearbeite, GRENZE_JE_TAG, GRENZE_FEHLVERSUCHE, SYSTEM, nachrichtBauen, ABBRUCH } from "./kern.mjs";

let fehler = 0, n = 0;
const soll = (wahr, was) => { n++; if (!wahr) { fehler++; console.log("FEHLER: " + was); } };

const neuesBuch = () => { const m = new Map(); return { m, hole: async (k) => m.get(k), setze: async (k, v) => m.set(k, v) }; };
let gefragt = [];
const stromAus = (stuecke) => async function* (system, text) { gefragt.push({ system, text }); for (const s of stuecke) yield s; };
const strom = stromAus(["Rück", "meldung", " kommt"]);
const CODE = "familie-probe";
const gut = { code: CODE, station: "w-bedingt", aufgabe: "Aufgabe", loesung: "Lösung", antwort: "P(A|B) = 20/29" };
const post = (d, origin = "https://mathematik-unterrichten.de") =>
  new Request("https://x/v1/rueckmeldung", { method: "POST", headers: { origin, "content-type": "application/json" }, body: typeof d === "string" ? d : JSON.stringify(d) });
const json = async (r) => ({ status: r.status, d: await r.json(), r });

// 1. Ohne Code oder ohne strom(): 503, Claude wird nie gefragt
for (const umg of [{ code: "", strom }, { code: "kurz", strom }, { code: CODE, strom: null }]) {
  gefragt = [];
  const { status } = await json(await bearbeite(post(gut), neuesBuch(), umg));
  soll(status === 503 && gefragt.length === 0, "ohne Einrichtung muss 503 kommen");
}

// 2. Richtiger Weg: gestreamter Text
{
  gefragt = []; const b = neuesBuch();
  const r = await bearbeite(post(gut), b, { code: CODE, strom });
  soll(r.status === 200 && r.headers.get("content-type").startsWith("text/plain"), "Erfolg ist text/plain");
  soll(await r.text() === "Rückmeldung kommt", "alle Stücke kommen an");
  soll(r.headers.get("x-rest") === String(GRENZE_JE_TAG - 1), "x-rest zählt herunter");
  soll(r.headers.get("access-control-expose-headers") === "x-rest", "x-rest für den Browser lesbar");
  soll(gefragt.length === 1 && gefragt[0].system === SYSTEM, "System-Text geht mit");
  soll(gefragt[0].text.includes("bedingte Wahrscheinlichkeit") && gefragt[0].text.includes("P(A|B) = 20/29"), "Nachricht enthält Station und Weg");
  soll(r.headers.get("access-control-allow-origin") === "https://mathematik-unterrichten.de", "CORS für die Website");
}

// 3. Falscher Code: 403, zählt Fehlversuch, fragt nicht; nach Grenze 429 auch für den richtigen
{
  gefragt = []; const b = neuesBuch();
  for (let i = 0; i < GRENZE_FEHLVERSUCHE; i++) {
    const { status } = await json(await bearbeite(post({ ...gut, code: "falsch" }), b, { code: CODE, strom }));
    soll(status === 403, "falscher Code → 403");
  }
  const { status } = await json(await bearbeite(post(gut), b, { code: CODE, strom }));
  soll(status === 429 && gefragt.length === 0, "nach zu vielen Fehlversuchen gesperrt");
}

// 4. Tagesgrenze
{
  const b = neuesBuch(); const jetzt = new Date("2026-11-12T10:00:00Z");
  for (let i = 0; i < GRENZE_JE_TAG; i++) await (await bearbeite(post(gut), b, { code: CODE, strom }, jetzt)).text();
  gefragt = [];
  const { status } = await json(await bearbeite(post(gut), b, { code: CODE, strom }, jetzt));
  soll(status === 429 && gefragt.length === 0, "Tagesgrenze greift");
  const morgen = await bearbeite(post(gut), b, { code: CODE, strom }, new Date("2026-11-13T10:00:00Z"));
  soll(morgen.status === 200, "am nächsten Tag geht es wieder");
}

// 5. Eingaben
for (const [d, was] of [
  [{ ...gut, station: "x" }, "unbekannte Station"],
  [{ ...gut, antwort: " " }, "leerer Weg"],
  [{ ...gut, antwort: "x".repeat(5000) }, "zu langer Weg"],
  [{ ...gut, aufgabe: undefined }, "fehlende Aufgabe"],
]) {
  gefragt = [];
  const { status } = await json(await bearbeite(post(d), neuesBuch(), { code: CODE, strom }));
  soll(status === 400 && gefragt.length === 0, was + " → 400");
}
soll((await bearbeite(post("kein json"), neuesBuch(), { code: CODE, strom })).status === 400, "kein JSON → 400");

// 6. Fehler vor dem ersten Stück → JSON 502; Abbruch mitten drin → Hinweis im Text
{
  const abl = async function* () { throw new Error("ABGELEHNT"); };
  const kaputt = async function* () { throw new Error("netz"); };
  const leer = async function* () { yield "  "; };
  const mitten = async function* () { yield "Anfang"; throw new Error("netz"); };
  const a1 = await json(await bearbeite(post(gut), neuesBuch(), { code: CODE, strom: abl }));
  soll(a1.status === 502 && /keine Rückmeldung/.test(a1.d.fehler), "Ablehnung → 502 mit Hinweis");
  const a2 = await json(await bearbeite(post(gut), neuesBuch(), { code: CODE, strom: kaputt }));
  soll(a2.status === 502 && /nicht erreichbar/.test(a2.d.fehler), "Netzfehler → 502");
  soll((await bearbeite(post(gut), neuesBuch(), { code: CODE, strom: leer })).status === 502, "nur Leerzeichen → 502");
  const a4 = await bearbeite(post(gut), neuesBuch(), { code: CODE, strom: mitten });
  soll(a4.status === 200 && (await a4.text()) === "Anfang" + ABBRUCH, "Abbruch mitten im Strom wird angezeigt");
}

// 7. Status, OPTIONS, fremde Herkunft, nichts vom Weg im Speicher
{
  const b = neuesBuch();
  await (await bearbeite(post(gut), b, { code: CODE, strom })).text();
  const st = await json(await bearbeite(new Request("https://x/v1/status"), b, { code: CODE, strom }));
  soll(st.status === 200 && st.d.bereit === true && st.d.heute.genutzt === 1, "Status zeigt Tageszahl");
  soll([...b.m.values()].every((v) => typeof v === "number"), "im Speicher stehen nur Zahlen");
  const opt = await bearbeite(new Request("https://x/v1/rueckmeldung", { method: "OPTIONS", headers: { origin: "http://localhost:8752" } }), b, { code: CODE, strom });
  soll(opt.status === 204 && opt.headers.get("access-control-allow-origin") === "http://localhost:8752", "OPTIONS für localhost");
  const fremd = await bearbeite(post(gut, "https://boese.example"), neuesBuch(), { code: CODE, strom });
  soll(fremd.headers.get("access-control-allow-origin") !== "https://boese.example", "fremde Herkunft bekommt kein CORS");
}

// 8. Nachricht kürzt überlange Felder
soll(nachrichtBauen({ ...gut, aufgabe: "a".repeat(9999) }).length < 9000, "Aufgabe wird gekürzt");

console.log(fehler ? `${fehler} von ${n} Prüfungen gescheitert.` : `Alle ${n} Prüfungen bestanden.`);
process.exit(fehler ? 1 : 0);
