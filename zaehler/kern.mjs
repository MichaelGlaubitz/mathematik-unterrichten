/* ============================================================
   Zaehler · Kern
   ------------------------------------------------------------
   Zaehlt, wie weit die oeffentlichen Trainer (public/trainer/…)
   benutzt werden: Seite geoeffnet, Diagnose begonnen, Diagnose
   beendet, Vorfuehrung angesehen, Thema geschafft. Mehr nicht.

   Die ganze Logik steht GENAU EINMAL hier und laeuft unveraendert an
   zwei Orten:

     worker.mjs   Cloudflare Worker (das, was im Netz steht)
     lokal.mjs    Node-Zwilling (zum Pruefen)

   WOZU
   ----
   Der Trainer ist ein Pilot. Die Frage dahinter: Halten Kinder ohne
   Lehrkraft durch — und bis wohin? Das laesst sich nur beantworten,
   wenn man die Stationen zaehlt. Google Analytics kommt dafuer nicht
   in Frage: Die Seite richtet sich an Kinder, und sie verspricht,
   dass der Lernstand das Geraet nicht verlaesst.

   WAS GESPEICHERT WIRD
   --------------------
   Je Trainer, Tag und Ereignis EINE ZAHL. Sonst nichts:

     * keine Kennung des Geraets, kein Cookie, keine Sitzung
     * keine IP-Adresse — sie wird nicht einmal fuer eine Schranke
       herangezogen
     * keine Uhrzeit, nur der Tag (deutsche Zeit)
     * keine Antworten, keine Ergebnisse einzelner Aufgaben

   Der Trainer legt fuer die Zaehlung auch nichts auf dem Geraet ab
   und liest dafuer nichts aus: Ein Ereignis wird in dem Augenblick
   gemeldet, in dem es geschieht. Die Folge: Gezaehlt werden
   EREIGNISSE, nicht Geraete. Wer die Seite dreimal oeffnet, zaehlt
   dreimal. Das ist der Preis dafuer, niemanden wiederzuerkennen.

   WAS DER DIENST NICHT KANN
   -------------------------
   Er kann nicht pruefen, ob eine Meldung wirklich vom Trainer kommt.
   Die Adresse steht im Quelltext der Seite; wer will, kann Zahlen
   hochtreiben. Deshalb gibt es Obergrenzen je Zaehler und Tag — und
   deshalb sind die Zahlen ein Anhaltspunkt, kein Messwert. Ein Tag
   mit genau 20 000 "besuch-neu" ist kein Erfolg, sondern Unfug.

   WER LESEN DARF
   --------------
   Nur, wer den LESESCHLUESSEL hat. Er steht in KEINER Datei, sondern
   als Worker-Secret bei Cloudflare. Fehlt er oder ist er zu kurz,
   gibt der Dienst keine Zahlen heraus — die gewollte Richtung des
   Fehlers.
   ============================================================ */

/* Die Stationen je Seite. Die Reihenfolge ist die des Wegs durch die
   Seite und zugleich die der Auswertung. `zusatz: true` heisst: Das
   Ereignis traegt ein Thema ("sicher:grundwert") oder eine Zahl
   ("diagnose-sicher:4") hinter dem Doppelpunkt. Eine neue Seite kommt
   hier mit ihrer eigenen Liste dazu. */
const PROZENT = [
  { name: "besuch-neu",      text: "Seite geöffnet, noch ohne Stand" },
  { name: "besuch-wieder",   text: "Seite geöffnet, mit Stand" },
  { name: "diagnose-start",  text: "Diagnose begonnen" },
  { name: "diagnose-ende",   text: "Diagnose beendet" },
  { name: "diagnose-sicher", text: "… davon mit so vielen sicheren Themen", zusatz: true },
  { name: "vorfuehrung",     text: "Vorführung angesehen", zusatz: true },
  { name: "beispiel",        text: "Noch ein Beispiel verlangt" },
  { name: "ton",             text: "Ton eingeschaltet" },
  { name: "ueben",           text: "Üben begonnen", zusatz: true },
  { name: "retest",          text: "Re-Test begonnen", zusatz: true },
  { name: "sicher",          text: "Re-Test bestanden", zusatz: true },
  { name: "nochnicht",       text: "Re-Test nicht bestanden", zusatz: true },
  { name: "alle-sicher",     text: "Alle Themen sicher" },
  { name: "check-ende",      text: "Arbeits-Check beendet" },
  { name: "eltern",          text: "Seite für Eltern und Lehrkräfte geöffnet" },
];

/* Knobelsprünge 10 (public/knobeln-10/, Vertretung 05.11.2026). Die
   Tafelzahl trennt die Klasse im Raum ("zahl") von allen anderen ("ohne"). */
const KNOBELN10 = [
  { name: "besuch-neu",    text: "Seite geöffnet, noch ohne Stand" },
  { name: "besuch-wieder", text: "Seite geöffnet, mit Stand" },
  { name: "anmeldung",     text: "Angemeldet (zahl = mit Tafelzahl, ohne = ohne Zahl)", zusatz: true },
  { name: "aufgabe",       text: "Aufgabe bearbeitet", zusatz: true },
  { name: "tipp",          text: "Tipp angesehen" },
  { name: "tueftel",       text: "Tüftelaufgabe gelöst", zusatz: true },
  { name: "ergebnis",      text: "Ergebnisseite geöffnet" },
  { name: "gespeichert",   text: "Ergebnis gespeichert" },
];

export const EREIGNISSE_JE = { prozent: PROZENT, knobeln10: KNOBELN10 };
export const TRAINER = Object.keys(EREIGNISSE_JE);
export const EREIGNISSE = PROZENT;
const BEKANNT_JE = Object.fromEntries(TRAINER.map((t) =>
  [t, new Map(EREIGNISSE_JE[t].map((e) => [e.name, e]))]));
const ZUSATZ_RE = /^[a-z0-9]{1,12}$/;

export const MAX_KOERPER = 2000;              // Zeichen je Meldung
export const MAX_JE_MELDUNG = 12;             // Ereignisse je Meldung
export const GRENZE_JE_ZAEHLER_TAG = 20000;   // ein Zaehler waechst je Tag nicht weiter
export const GRENZE_ZAEHLER_JE_TAG = 200;     // verschiedene Zaehler je Trainer und Tag
export const SCHLUESSEL_MIN = 16;             // kuerzere Leseschluessel gelten als nicht gesetzt
export const TAGE_STANDARD = 30;
export const TAGE_MAX = 400;

/* Jede Herkunft darf melden: Eine Herkunftspruefung hielte nur
   Browser auf, und die sind nicht das Problem. Geschuetzt ist das
   Lesen, nicht das Zaehlen. */
export const corsKopf = () => ({
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-lesen",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-max-age": "86400",
});

export const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const json = (daten, status = 200) => new Response(JSON.stringify(daten), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...corsKopf() },
});

/* Vergleich ohne fruehen Abbruch. */
export function gleich(a, b) {
  const x = String(a == null ? "" : a), y = String(b == null ? "" : b);
  if (!x || !y || x.length !== y.length) return false;
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}

/* Der Tag in deutscher Zeit, als JJJJ-MM-TT. Ein Abend in Hameln soll
   nicht zur Haelfte auf den naechsten Tag fallen. */
const TAG_FORMAT = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" });
export const tagIn = (d) => TAG_FORMAT.format(d);
export function tagVor(d, n) { return tagIn(new Date(d.getTime() - n * 86400000)); }

/* Ein gemeldetes Ereignis ist entweder ein bekannter Name oder ein
   bekannter Name mit erlaubtem Zusatz. Alles andere faellt weg —
   sonst liesse sich ueber den Zaehlernamen beliebiger Text ablegen. */
export function ereignisPruefen(roh, trainer = "prozent") {
  if (typeof roh !== "string" || roh.length > 40) return null;
  const bekannt = BEKANNT_JE[trainer];
  if (!bekannt) return null;
  const [name, zusatz, mehr] = roh.split(":");
  const e = bekannt.get(name);
  if (!e || mehr !== undefined) return null;
  if (zusatz === undefined) return e.zusatz ? null : name;
  if (!e.zusatz || !ZUSATZ_RE.test(zusatz)) return null;
  return name + ":" + zusatz;
}

const zKey = (trainer, tag, ereignis) => "c:" + trainer + ":" + tag + ":" + ereignis;
const nKey = (trainer, tag) => "n:" + trainer + ":" + tag;

/* Zaehlt ein Ereignis. Lesen, Aendern, Zurueckschreiben — im Worker
   ist das unteilbar, solange dazwischen nur der Speicher angefasst
   wird. Genau das geschieht hier. */
async function zaehle(buch, trainer, tag, ereignis) {
  const k = zKey(trainer, tag, ereignis);
  const bisher = await buch.hole(k);
  if (bisher === undefined || bisher === null) {
    const anzahl = (await buch.hole(nKey(trainer, tag))) || 0;
    if (anzahl >= GRENZE_ZAEHLER_JE_TAG) return false;
    await buch.setze(nKey(trainer, tag), anzahl + 1);
    await buch.setze(k, 1);
    return true;
  }
  if (bisher >= GRENZE_JE_ZAEHLER_TAG) return false;
  await buch.setze(k, bisher + 1);
  return true;
}

/* Alle Zaehler eines Trainers aus den letzten `tage` Tagen. */
export async function lies(buch, trainer, tage, jetzt) {
  const von = tagVor(jetzt, tage - 1), bis = tagIn(jetzt);
  const paare = await buch.bereich("c:" + trainer + ":" + von, "c:" + trainer + ":" + bis + ":￿");
  const jeTag = {}, summe = {};
  for (const [k, n] of paare) {
    const teile = k.split(":");                       // c, trainer, tag, name[, zusatz]
    const tag = teile[2], ereignis = teile.slice(3).join(":");
    (jeTag[tag] = jeTag[tag] || {})[ereignis] = n;
    summe[ereignis] = (summe[ereignis] || 0) + n;
  }
  return { trainer, von, bis, tage: jeTag, summe };
}

/* Die Zeilen der Auswertung in der Reihenfolge des Wegs; Ereignisse
   mit Zusatz bekommen eine Summenzeile und je Zusatz eine eigene. */
export function zeilen(summe, trainer = "prozent") {
  const raus = [];
  for (const e of EREIGNISSE_JE[trainer] || []) {
    if (!e.zusatz) { raus.push({ ereignis: e.name, text: e.text, n: summe[e.name] || 0, stufe: 0 }); continue; }
    const teile = Object.keys(summe).filter((k) => k.startsWith(e.name + ":")).sort((a, b) =>
      a.localeCompare(b, "de", { numeric: true }));
    const gesamt = teile.reduce((s, k) => s + summe[k], 0);
    raus.push({ ereignis: e.name, text: e.text, n: gesamt, stufe: 0 });
    for (const k of teile) raus.push({ ereignis: k, text: k.slice(e.name.length + 1), n: summe[k], stufe: 1 });
  }
  return raus;
}

function seiteBauen(daten, tageSpalten, jetzt) {
  const spalten = [];
  /* heute zuerst: Auf dem Handy steht das Neueste dann ohne Wischen da */
  for (let i = 0; i < tageSpalten; i++) spalten.push(tagVor(jetzt, i));
  const kopf = spalten.map((t) => "<th>" + esc(t.slice(8) + "." + t.slice(5, 7) + ".") + "</th>").join("");
  const reihen = zeilen(daten.summe, daten.trainer).map((z) => {
    const zellen = spalten.map((t) => {
      const tag = daten.tage[t] || {};
      const n = z.stufe === 0 && !(z.ereignis in tag)
        ? Object.keys(tag).filter((k) => k.startsWith(z.ereignis + ":")).reduce((s, k) => s + tag[k], 0)
        : (tag[z.ereignis] || 0);
      return "<td>" + (n || "") + "</td>";
    }).join("");
    return '<tr class="s' + z.stufe + '"><th>' + esc(z.text) + "</th><td class=\"sum\">" + z.n + "</td>" + zellen + "</tr>";
  }).join("");
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Zähler · ${esc(daten.trainer)}</title>
<style>
body{font:15px/1.45 system-ui,sans-serif;margin:1.2rem;color:#2a241d;background:#faf8f2}
h1{font-size:1.25rem;margin:0 0 .2rem} p{margin:.2rem 0 1rem;color:#564938;max-width:70ch}
.rahmen{overflow-x:auto} table{border-collapse:collapse;background:#fff}
th,td{border:1px solid #dcd5c5;padding:.25rem .55rem;text-align:right;white-space:nowrap}
tr th:first-child{text-align:left} thead th{background:#f3efe6}
tr.s1 th{font-weight:400;padding-left:1.6rem;color:#564938} tr.s1 td{color:#564938}
td.sum{font-weight:700;background:#f3efe6}
</style></head><body>
<h1>Zähler · Trainer „${esc(daten.trainer)}“</h1>
<p>Gezählt werden Ereignisse, nicht Geräte: Wer die Seite dreimal öffnet, zählt dreimal.
Summe über ${esc(daten.von)} bis ${esc(daten.bis)}, daneben die letzten ${tageSpalten} Tage.</p>
<div class="rahmen"><table><thead><tr><th>Station</th><th>Summe</th>${kopf}</tr></thead><tbody>${reihen}</tbody></table></div>
</body></html>`;
}

/* ------------------------------------------------------------------
   Der eine Eingang. `buch` ist der Speicher (hole, setze, bereich),
   `geheim.lesen` der Leseschluessel.
   ------------------------------------------------------------------ */
export async function bearbeite(req, buch, geheim, jetzt = new Date()) {
  const url = new URL(req.url);
  const pfad = url.pathname.replace(/\/+$/, "") || "/";
  const roh = (geheim && geheim.lesen) || "";
  const lesen = roh.length >= SCHLUESSEL_MIN ? roh : "";

  if (req.method === "OPTIONS")
    return new Response(null, { status: 204, headers: corsKopf() });

  /* Statusauskunft: ob der Dienst laeuft und ob gelesen werden kann —
     nie der Schluessel selbst, nie eine Zahl. */
  if (pfad === "/v1/ping")
    return json({ ok: true, dienst: "zaehler", trainer: TRAINER, lesen: !!lesen,
                  schluesselZuKurz: !!roh && !lesen });

  /* ---------------- Melden: offen ---------------- */
  if (pfad === "/v1/z" && req.method === "POST") {
    let text;
    try { text = await req.text(); } catch { return json({ ok: false, grund: "kein-koerper" }, 400); }
    if (text.length > MAX_KOERPER) return json({ ok: false, grund: "zu-gross" }, 413);
    let d; try { d = JSON.parse(text); } catch { return json({ ok: false, grund: "kein-json" }, 400); }
    if (!d || typeof d !== "object" || !TRAINER.includes(d.t) || !Array.isArray(d.e))
      return json({ ok: false, grund: "form" }, 400);
    const tag = tagIn(jetzt);
    let gezaehlt = 0;
    for (const rohEreignis of d.e.slice(0, MAX_JE_MELDUNG)) {
      const ereignis = ereignisPruefen(rohEreignis, d.t);
      if (ereignis && (await zaehle(buch, d.t, tag, ereignis))) gezaehlt++;
    }
    return json({ ok: true, gezaehlt });
  }

  /* ---------------- Lesen: nur mit Schluessel ---------------- */
  if (pfad === "/v1/zahlen" || pfad === "/") {
    const schluessel = req.headers.get("x-lesen") || url.searchParams.get("s") || "";
    if (pfad === "/" && !schluessel)
      return new Response("Zähler läuft.", { headers: { "content-type": "text/plain; charset=utf-8", ...corsKopf() } });
    if (!lesen) return json({ ok: false, grund: "kein-leseschluessel-eingerichtet" }, 503);
    if (!gleich(schluessel, lesen)) return json({ ok: false, grund: "schluessel" }, 403);
    const trainer = url.searchParams.get("t") || TRAINER[0];
    if (!TRAINER.includes(trainer)) return json({ ok: false, grund: "trainer" }, 404);
    const tage = Math.max(1, Math.min(TAGE_MAX, Number(url.searchParams.get("tage")) || TAGE_STANDARD));
    const daten = await lies(buch, trainer, tage, jetzt);
    if (pfad === "/v1/zahlen") return json({ ok: true, ...daten, zeilen: zeilen(daten.summe, trainer) });
    return new Response(seiteBauen(daten, Math.min(tage, 14), jetzt), {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store",
                 "referrer-policy": "no-referrer" },
    });
  }

  return json({ ok: false, grund: "unbekannt" }, 404);
}
