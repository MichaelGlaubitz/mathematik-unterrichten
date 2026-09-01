/* ============================================================
   Rueckmeldebrett · Node-Zwilling
   ------------------------------------------------------------
   Dieselbe Logik wie im Worker (kern.mjs), nur mit dem Dateisystem
   als Speicher und einem node:http-Server davor. Zwei Zwecke:

     1. Pruefen und Ansehen. Was hier durchlaeuft, laeuft auch im
        Worker — es ist Zeile fuer Zeile derselbe Code. Damit lassen
        sich die Seiten /fr und /mr fertigbauen, bevor irgendetwas
        bei Cloudflare steht.
     2. Rueckfallweg. Faellt der Dienst aus, startet man diesen
        Server und haengt an die Seite ?dienst=http://<IP>:8742 an.

   Aufruf:
     node lokal.mjs
     CODES="7b:probe1234" LEHRER=geheim node lokal.mjs --port 8742

   Ohne CODES laeuft er mit "probe1234" fuer die Klasse 7b — das ist
   ein Probierschluessel und ausdruecklich keiner fuer den Betrieb.
   ============================================================ */
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { mkdir, readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { bearbeite, ARTEN } from "./kern.mjs";

const arg = (name, ersatz) => {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : ersatz;
};
const PORT = Number(process.env.PORT || arg("port", 8742));
const CODES = process.env.CODES || arg("codes", "7b:probe1234");
const LEHRER = process.env.LEHRER || arg("lehrer", "probe");
const WURZEL = path.resolve(process.env.BRETT || arg("brett", "brett"));

const ordner = (art) => path.join(WURZEL, art);
const pfad = (art, id) => path.join(ordner(art), id + ".json");

const brett = {
  async lies(art) {
    let namen;
    try { namen = await readdir(ordner(art)); } catch { return []; }
    const raus = [];
    for (const n of namen) {
      if (!n.endsWith(".json")) continue;
      try { raus.push(JSON.parse(await readFile(path.join(ordner(art), n), "utf8"))); }
      catch { /* eine kaputte Datei soll nicht das ganze Brett kippen */ }
    }
    return raus;
  },
  async sichere(art, eintrag) {
    await mkdir(ordner(art), { recursive: true });
    await writeFile(pfad(art, eintrag.id), JSON.stringify(eintrag, null, 1), "utf8");
  },
  async entferne(art, id) {
    try { await unlink(pfad(art, id)); } catch { }
  },
};

/* Die Wache im Zwilling zaehlt in einer Map. Im Worker macht das der
   Speicher des Durable Objects — dort muss es ueber mehrere
   Rechenknoten hinweg stimmen, hier laeuft ohnehin ein Prozess. */
const zaehler = new Map();
const wache = {
  async zaehle(schluessel, grenze, fensterSek) {
    const jetzt = Date.now();
    const e = zaehler.get(schluessel);
    if (!e || jetzt > e.bis) {
      zaehler.set(schluessel, { n: 1, bis: jetzt + fensterSek * 1000 });
      return true;
    }
    if (e.n >= grenze) return false;
    e.n++;
    return true;
  },
};

function alsRequest(req) {
  const url = "http://" + (req.headers.host || "x") + req.url;
  const kopf = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") kopf.set(k, v);
  if (!kopf.get("cf-connecting-ip")) kopf.set("cf-connecting-ip", req.socket.remoteAddress || "?");
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

const server = http.createServer(async (req, res) => {
  try {
    const antwort = await bearbeite(await alsRequest(req), brett, wache,
      { codes: CODES, lehrer: LEHRER });
    res.writeHead(antwort.status, Object.fromEntries(antwort.headers));
    res.end(Buffer.from(await antwort.arrayBuffer()));
  } catch (e) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Fehler: " + (e && e.message));
  }
});

server.listen(PORT, () => {
  const adressen = Object.values(os.networkInterfaces()).flat()
    .filter((x) => x && x.family === "IPv4" && !x.internal).map((x) => x.address);
  console.log("Rückmeldebrett (lokal) auf Port " + PORT + ", Bretter: " + ARTEN.join(", "));
  console.log("Ablage: " + WURZEL);
  console.log("Moderationsseite: http://localhost:" + PORT + "/?s=" + LEHRER);
  console.log("Klassencodes: " + CODES);
  for (const a of adressen) console.log("Im Netz: http://" + a + ":" + PORT);
});
