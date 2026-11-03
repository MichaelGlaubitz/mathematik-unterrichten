/* ============================================================
   Zaehler · Node-Zwilling
   ------------------------------------------------------------
   Dieselbe Logik wie im Worker (kern.mjs), nur mit einer JSON-Datei
   als Speicher und einem node:http-Server davor. Zweck: den Trainer
   gegen einen Zaehler pruefen, bevor irgendetwas bei Cloudflare
   steht. Was hier durchlaeuft, laeuft auch im Worker — es ist Zeile
   fuer Zeile derselbe Code.

   Aufruf:
     node lokal.mjs
     LESEN=<mindestens 16 Zeichen> node lokal.mjs --port 8743

   Ohne LESEN laeuft er mit einem Probierschluessel, der beim Start
   angezeigt wird — ausdruecklich keiner fuer den Betrieb.

   Der Trainer meldet hierher, wenn er von localhost geladen und mit
   ?zaehler=http://localhost:8743 aufgerufen wird.
   ============================================================ */
import http from "node:http";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { bearbeite, TRAINER } from "./kern.mjs";

const arg = (name, ersatz) => {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : ersatz;
};
const PORT = Number(process.env.PORT || arg("port", 8743));
const LESEN = process.env.LESEN || arg("lesen", "probierschluessel-nur-lokal");
const DATEI = path.resolve(process.env.BUCH || arg("buch", "buch/zahlen.json"));

let zahlen = {};
try { zahlen = JSON.parse(await readFile(DATEI, "utf8")); } catch { /* noch keine Zahlen */ }
let schreibt = Promise.resolve();
const sichern = () => {
  schreibt = schreibt.then(async () => {
    await mkdir(path.dirname(DATEI), { recursive: true });
    await writeFile(DATEI, JSON.stringify(zahlen, null, 1), "utf8");
  }).catch(() => {});
  return schreibt;
};

const buch = {
  async hole(k) { return zahlen[k]; },
  async setze(k, v) { zahlen[k] = v; await sichern(); },
  async bereich(von, bis) {
    return Object.keys(zahlen).filter((k) => k >= von && k < bis).sort().map((k) => [k, zahlen[k]]);
  },
};

function alsRequest(req) {
  const url = "http://" + (req.headers.host || "x") + req.url;
  const kopf = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") kopf.set(k, v);
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS")
    return Promise.resolve(new Request(url, { method: req.method, headers: kopf }));
  return new Promise((fertig, fehler) => {
    const teile = [];
    req.on("data", (c) => teile.push(c));
    req.on("end", () => fertig(new Request(url, {
      method: req.method, headers: kopf, body: Buffer.concat(teile) })));
    req.on("error", fehler);
  });
}

/* Ein Aufruf nach dem anderen — wie im Durable Object. */
let schlange = Promise.resolve();
const server = http.createServer((req, res) => {
  schlange = schlange.then(async () => {
    try {
      const antwort = await bearbeite(await alsRequest(req), buch, { lesen: LESEN });
      res.writeHead(antwort.status, Object.fromEntries(antwort.headers));
      res.end(Buffer.from(await antwort.arrayBuffer()));
    } catch (e) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end("Fehler: " + (e && e.message));
    }
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Zähler (lokal) auf Port " + PORT + ", Trainer: " + TRAINER.join(", "));
  console.log("Ablage: " + DATEI);
  console.log("Auswertung: http://localhost:" + PORT + "/?s=" + LESEN);
});
