/* ============================================================
   KI-Rückmeldung · Node-Zwilling
   ------------------------------------------------------------
   Dieselbe Logik wie im Worker (kern.mjs), mit Speicher im
   Arbeitsspeicher und einem node:http-Server davor.

   Aufruf:
     node lokal.mjs --attrappe            # ohne Claude, ohne Kosten
     node lokal.mjs                       # echt; braucht ANTHROPIC_API_KEY
     node lokal.mjs --port 8761 --code probecode-lokal

   Der Lernweg spricht hierher, wenn er mit ?ki=http://localhost:8761
   aufgerufen wird.
   ============================================================ */
import http from "node:http";
import { bearbeite } from "./kern.mjs";

const arg = (name, ersatz) => {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : ersatz;
};
const PORT = Number(process.env.PORT || arg("port", 8761));
const CODE = process.env.FAMILIENCODE || arg("code", "probecode-lokal");
const ATTRAPPE = process.argv.includes("--attrappe");

let strom;
if (ATTRAPPE) {
  /* Schreibt Wort für Wort, damit sich das Streamen auf der Seite prüfen lässt */
  strom = async function* (system, text) {
    const weg = (text.split("<rechenweg_des_lernenden>")[1] || "").split("</rechenweg_des_lernenden>")[0].trim();
    const satz = `(Attrappe, keine KI) Dein Rechenweg kam an: „${weg.slice(0, 80)}“. So würde eine Rückmeldung Stück für Stück erscheinen, während Claude schreibt.`;
    for (const w of satz.split(/(?<= )/)) { await new Promise((r) => setTimeout(r, 60)); yield w; }
  };
} else {
  const { macheStrom } = await import("./claude.mjs");
  strom = macheStrom(process.env.ANTHROPIC_API_KEY);
  if (!strom) { console.error("ANTHROPIC_API_KEY fehlt. Mit --attrappe geht es ohne."); process.exit(1); }
}

const zahlen = new Map();
const buch = { async hole(k) { return zahlen.get(k); }, async setze(k, v) { zahlen.set(k, v); } };

function alsRequest(req) {
  const url = "http://" + (req.headers.host || "x") + req.url;
  const kopf = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") kopf.set(k, v);
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS")
    return Promise.resolve(new Request(url, { method: req.method, headers: kopf }));
  return new Promise((fertig, fehler) => {
    const teile = [];
    req.on("data", (c) => teile.push(c));
    req.on("end", () => fertig(new Request(url, { method: req.method, headers: kopf, body: Buffer.concat(teile) })));
    req.on("error", fehler);
  });
}

http.createServer(async (req, res) => {
  try {
    const a = await bearbeite(await alsRequest(req), buch, { code: CODE, strom });
    res.writeHead(a.status, Object.fromEntries(a.headers));
    if (!a.body) { res.end(); return; }
    for await (const stueck of a.body) res.write(Buffer.from(stueck));
    res.end();
  } catch (e) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Fehler: " + (e && e.message));
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`KI-Rückmeldung (lokal${ATTRAPPE ? ", Attrappe" : ""}) auf Port ${PORT}, Code: ${CODE}`);
});
