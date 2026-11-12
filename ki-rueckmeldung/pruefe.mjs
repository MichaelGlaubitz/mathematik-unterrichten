/* KI-Rückmeldung · Prüfung ohne Netz, ohne Konto, ohne Kosten.
   Aufruf: node pruefe.mjs                                          */
import { bearbeite, GRENZE_JE_TAG, GRENZE_FEHLVERSUCHE, SYSTEM, nachrichtBauen } from "./kern.mjs";

let fehler = 0, n = 0;
const soll = (wahr, was) => { n++; if (!wahr) { fehler++; console.log("FEHLER: " + was); } };

const neuesBuch = () => { const m = new Map(); return { m, hole: async (k) => m.get(k), setze: async (k, v) => m.set(k, v) }; };
let gefragt = [];
const frage = async (system, text) => { gefragt.push({ system, text }); return { text: "Rückmeldung", abgelehnt: false }; };
const CODE = "familie-probe";
const gut = { code: CODE, station: "w-bedingt", aufgabe: "Aufgabe", loesung: "Lösung", antwort: "P(A|B) = 20/29" };
const post = (d, origin = "https://mathematik-unterrichten.de") =>
  new Request("https://x/v1/rueckmeldung", { method: "POST", headers: { origin, "content-type": "application/json" }, body: typeof d === "string" ? d : JSON.stringify(d) });
const json = async (r) => ({ status: r.status, d: await r.json(), r });

// 1. Ohne Code oder ohne frage(): 503, Claude wird nie gefragt
for (const umg of [{ code: "", frage }, { code: "kurz", frage }, { code: CODE, frage: null }]) {
  gefragt = [];
  const { status } = await json(await bearbeite(post(gut), neuesBuch(), umg));
  soll(status === 503 && gefragt.length === 0, "ohne Einrichtung muss 503 kommen");
}

// 2. Richtiger Weg
{
  gefragt = []; const b = neuesBuch();
  const { status, d, r } = await json(await bearbeite(post(gut), b, { code: CODE, frage }));
  soll(status === 200 && d.text === "Rückmeldung" && d.rest === GRENZE_JE_TAG - 1, "Rückmeldung kommt an");
  soll(gefragt.length === 1 && gefragt[0].system === SYSTEM, "System-Text geht mit");
  soll(gefragt[0].text.includes("bedingte Wahrscheinlichkeit") && gefragt[0].text.includes("P(A|B) = 20/29"), "Nachricht enthält Station und Weg");
  soll(r.headers.get("access-control-allow-origin") === "https://mathematik-unterrichten.de", "CORS für die Website");
}

// 3. Falscher Code: 403, zählt Fehlversuch, fragt nicht; nach Grenze 429 auch für den richtigen
{
  gefragt = []; const b = neuesBuch();
  for (let i = 0; i < GRENZE_FEHLVERSUCHE; i++) {
    const { status } = await json(await bearbeite(post({ ...gut, code: "falsch" }), b, { code: CODE, frage }));
    soll(status === 403, "falscher Code → 403");
  }
  const { status } = await json(await bearbeite(post(gut), b, { code: CODE, frage }));
  soll(status === 429 && gefragt.length === 0, "nach zu vielen Fehlversuchen gesperrt");
}

// 4. Tagesgrenze
{
  const b = neuesBuch(); const jetzt = new Date("2026-11-12T10:00:00Z");
  for (let i = 0; i < GRENZE_JE_TAG; i++) await bearbeite(post(gut), b, { code: CODE, frage }, jetzt);
  gefragt = [];
  const { status } = await json(await bearbeite(post(gut), b, { code: CODE, frage }, jetzt));
  soll(status === 429 && gefragt.length === 0, "Tagesgrenze greift");
  const morgen = await json(await bearbeite(post(gut), b, { code: CODE, frage }, new Date("2026-11-13T10:00:00Z")));
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
  const { status } = await json(await bearbeite(post(d), neuesBuch(), { code: CODE, frage }));
  soll(status === 400 && gefragt.length === 0, was + " → 400");
}
{
  const { status } = await json(await bearbeite(post("kein json"), neuesBuch(), { code: CODE, frage }));
  soll(status === 400, "kein JSON → 400");
}

// 6. Ablehnung und Netzfehler
{
  const abl = async () => ({ text: "", abgelehnt: true });
  const kaputt = async () => { throw new Error("netz"); };
  soll((await bearbeite(post(gut), neuesBuch(), { code: CODE, frage: abl })).status === 502, "Ablehnung → 502");
  soll((await bearbeite(post(gut), neuesBuch(), { code: CODE, frage: kaputt })).status === 502, "Netzfehler → 502");
}

// 7. Status, OPTIONS, fremde Herkunft, nichts vom Weg im Speicher
{
  const b = neuesBuch();
  await bearbeite(post(gut), b, { code: CODE, frage });
  const st = await json(await bearbeite(new Request("https://x/v1/status"), b, { code: CODE, frage }));
  soll(st.status === 200 && st.d.bereit === true && st.d.heute.genutzt === 1, "Status zeigt Tageszahl");
  soll([...b.m.values()].every((v) => typeof v === "number"), "im Speicher stehen nur Zahlen");
  const opt = await bearbeite(new Request("https://x/v1/rueckmeldung", { method: "OPTIONS", headers: { origin: "http://localhost:8752" } }), b, { code: CODE, frage });
  soll(opt.status === 204 && opt.headers.get("access-control-allow-origin") === "http://localhost:8752", "OPTIONS für localhost");
  const fremd = await bearbeite(post(gut, "https://boese.example"), neuesBuch(), { code: CODE, frage });
  soll(fremd.headers.get("access-control-allow-origin") !== "https://boese.example", "fremde Herkunft bekommt kein CORS");
}

// 8. Nachricht kürzt überlange Felder
soll(nachrichtBauen({ ...gut, aufgabe: "a".repeat(9999) }).length < 9000, "Aufgabe wird gekürzt");

console.log(fehler ? `${fehler} von ${n} Prüfungen gescheitert.` : `Alle ${n} Prüfungen bestanden.`);
process.exit(fehler ? 1 : 0);
