/* ============================================================
   Live-Abstimmung · Node-Zwilling
   ------------------------------------------------------------
   Dieselbe Logik wie im Worker (kern.mjs), nur mit einem Map als
   Speicher und einem node:http-Server davor. Zwei Zwecke:

     1. Pruefen. Was hier durchlaeuft, laeuft auch im Worker —
        es ist Zeile fuer Zeile derselbe Code.
     2. Rueckfallweg. Faellt das Netz aus, startet man diesen
        Server auf dem Lehrer-Laptop und traegt in der Wandfassung
        http://<Lehrer-IP>:8740 als Adresse ein.

   Aufruf:  node lokal.mjs            (Port 8740, Schluessel "probe")
            LEHRER=xyz node lokal.mjs --port 8740
   ============================================================ */
import http from "node:http";
import os from "node:os";
import { bearbeite } from "./kern.mjs";

const arg = (name, ersatz) => {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : ersatz;
};
const PORT = Number(process.env.PORT || arg("port", 8740));
const LEHRER = process.env.LEHRER || arg("lehrer", "probe");

const raeume = new Map();
const speicher = {
  lies: async (code) => raeume.get(code) || null,
  schreib: async (code, z) => { raeume.set(code, z); },
};

/* node:http -> Web-Request und zurueck. Node 18+ bringt Request/Response mit. */
function alsRequest(req) {
  const url = "http://" + (req.headers.host || "x") + req.url;
  const kopf = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") kopf.set(k, v);
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS")
    return Promise.resolve(new Request(url, { method: req.method, headers: kopf }));
  return new Promise((fertig, fehler) => {
    const stuecke = [];
    let laenge = 0;
    req.on("data", d => {
      laenge += d.length;
      if (laenge > 64 * 1024) { req.destroy(); fehler(new Error("zu gross")); return; }
      stuecke.push(d);
    });
    req.on("end", () => fertig(new Request(url, {
      method: req.method, headers: kopf, body: Buffer.concat(stuecke),
    })));
    req.on("error", fehler);
  });
}

const server = http.createServer(async (req, res) => {
  let antwort;
  try {
    antwort = await bearbeite(await alsRequest(req), speicher, LEHRER);
  } catch (e) {
    antwort = new Response(JSON.stringify({ ok: false, grund: String(e.message || e) }),
                           { status: 400, headers: { "content-type": "application/json" } });
  }
  const kopf = {};
  antwort.headers.forEach((v, k) => { kopf[k] = v; });
  res.writeHead(antwort.status, kopf);
  res.end(Buffer.from(await antwort.arrayBuffer()));
});

const adressen = () => {
  const aus = [];
  for (const liste of Object.values(os.networkInterfaces()))
    for (const n of liste || [])
      if (n.family === "IPv4" && !n.internal) aus.push("http://" + n.address + ":" + PORT);
  return aus;
};

server.listen(PORT, () => {
  console.log("Abstimmung (Zwilling) laeuft auf Port " + PORT);
  console.log("  Lehrerschluessel: " + LEHRER);
  for (const a of adressen()) console.log("  erreichbar unter " + a);
});
