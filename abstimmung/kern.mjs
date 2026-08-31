/* ============================================================
   Live-Abstimmung · Kern
   ------------------------------------------------------------
   Die ganze Logik steht GENAU EINMAL hier und laeuft unveraendert
   an zwei Orten:

     worker.mjs   Cloudflare Worker (das, was im Netz steht)
     lokal.mjs    Node-Zwilling auf dem Lehrer-Laptop (zum Pruefen
                  und als Rueckfallweg, wenn das Schul-WLAN streikt)

   Damit kann das Gepruefte nicht vom Ausgelieferten abweichen.

   Was gespeichert wird
   --------------------
   Je Raum: die laufende Frage, ihre Antworten und eine Zuordnung
   Geraetekennung -> Wahl. Die Geraetekennung ist eine Zufallszahl,
   die sich das iPad selbst gibt; sie steht in keinem Zusammenhang
   mit einer Person und wird nicht protokolliert. Keine Namen, keine
   Anmeldung, keine IP-Adressen. Nach sechs Stunden ohne Benutzung
   verfaellt ein Raum.

   Was die Schuelergeraete NICHT bekommen
   --------------------------------------
   Weder die Verteilung der Stimmen noch die richtige Antwort. Beides
   gibt es nur gegen den Lehrerschluessel. Das ist dieselbe Regel wie
   im lokalen Taktgeber-Server.
   ============================================================ */

export const VERFALL_MS = 6 * 60 * 60 * 1000;      // sechs Stunden
const MAX_OPTIONEN = 4;                            // A bis D
const MAX_GERAETE = 200;                           // Notbremse gegen Unfug

const json = (daten, status = 200, kopf = {}) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { "content-type": "application/json; charset=utf-8",
               "cache-control": "no-store", ...kopf, ...corsKopf() },
  });

/* Der Dienst kennt keine Anmeldung und keine Kekse, deshalb darf jede
   Herkunft fragen. Geschuetzt ist nicht der Zugang, sondern was man
   zurueckbekommt: Ergebnisse nur gegen den Lehrerschluessel. */
export const corsKopf = () => ({
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-lehrer",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-max-age": "86400",
});

const leer = (code) => ({
  code, frage: "", optionen: [], offen: false, schluessel: "",
  stimmen: {}, geaendert: Date.now(),
});

const zaehle = (z) => {
  const c = new Array(z.optionen.length).fill(0);
  for (const w of Object.values(z.stimmen)) if (w >= 0 && w < c.length) c[w]++;
  return c;
};

const saeubere = (text, laenge = 240) => String(text ?? "").slice(0, laenge);

/**
 * @param req        Request (Web-Standard)
 * @param speicher   { lies(code), schreib(code, zustand) }
 * @param lehrer     geheimer Schluessel der Lehrkraft
 */
export async function bearbeite(req, speicher, lehrer) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsKopf() });

  const url = new URL(req.url);
  const teile = url.pathname.split("/").filter(Boolean);        // ["v1","raum","7bdi",…]
  if (teile[0] !== "v1") return json({ ok: false, grund: "unbekannt" }, 404);
  if (teile[1] === "ping") return json({ ok: true, dienst: "abstimmung" });
  if (teile[1] !== "raum" || !teile[2]) return json({ ok: false, grund: "kein raum" }, 404);

  const code = teile[2].toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24);
  if (!code) return json({ ok: false, grund: "kein raum" }, 404);
  const was = teile[3] || "";
  const istLehrer = lehrer && req.headers.get("x-lehrer") === lehrer;

  let z = await speicher.lies(code);
  if (!z || Date.now() - z.geaendert > VERFALL_MS) z = leer(code);

  /* ---- Schuelerseite: was steht gerade an? ------------------------ */
  if (req.method === "GET" && !was) {
    return json({
      ok: true, offen: z.offen, schluessel: z.schluessel,
      frage: z.frage, optionen: z.optionen,
      /* Wie viele schon abgestimmt haben, darf jeder sehen - es macht
         das Warten ertraeglich und verraet nichts ueber die Antwort. */
      abgestimmt: Object.keys(z.stimmen).length,
    });
  }

  /* ---- Schuelerseite: Stimme abgeben ------------------------------ */
  if (req.method === "POST" && was === "stimme") {
    let b; try { b = await req.json(); } catch { return json({ ok: false, grund: "kaputt" }, 400); }
    const geraet = saeubere(b.geraet, 40);
    const wahl = Number(b.wahl);
    if (!geraet) return json({ ok: false, grund: "kein geraet" }, 400);
    if (!z.offen) return json({ ok: false, grund: "zu" }, 409);
    if (b.schluessel && b.schluessel !== z.schluessel)
      return json({ ok: false, grund: "andere frage" }, 409);
    if (!Number.isInteger(wahl) || wahl < 0 || wahl >= z.optionen.length)
      return json({ ok: false, grund: "keine wahl" }, 400);
    if (!(geraet in z.stimmen) && Object.keys(z.stimmen).length >= MAX_GERAETE)
      return json({ ok: false, grund: "zu viele" }, 429);
    z.stimmen[geraet] = wahl;          // je Geraet genau eine Stimme, aenderbar bis „zu"
    z.geaendert = Date.now();
    await speicher.schreib(code, z);
    return json({ ok: true, wahl });
  }

  /* ---- Lehrerseite ------------------------------------------------ */
  if (!istLehrer) return json({ ok: false, grund: "kein schluessel" }, 403);

  if (req.method === "POST" && was === "frage") {
    let b; try { b = await req.json(); } catch { return json({ ok: false, grund: "kaputt" }, 400); }
    const optionen = Array.isArray(b.optionen)
      ? b.optionen.map(o => saeubere(o, 200)).slice(0, MAX_OPTIONEN) : [];
    if (optionen.length < 2) return json({ ok: false, grund: "zu wenig optionen" }, 400);
    const schluessel = saeubere(b.schluessel, 60) || String(Date.now());
    /* Neue Frage heisst: frische Stimmen. Dieselbe Frage noch einmal
       oeffnen (gleicher Schluessel) behaelt sie - so kann man eine
       versehentlich geschlossene Abstimmung wieder aufmachen. */
    if (schluessel !== z.schluessel) z.stimmen = {};
    z.schluessel = schluessel;
    z.frage = saeubere(b.frage, 400);
    z.optionen = optionen;
    z.offen = true;
    z.geaendert = Date.now();
    await speicher.schreib(code, z);
    return json({ ok: true, schluessel });
  }

  if (req.method === "POST" && was === "zu") {
    z.offen = false;
    z.geaendert = Date.now();
    await speicher.schreib(code, z);
    return json({ ok: true });
  }

  if (req.method === "POST" && was === "leeren") {
    await speicher.schreib(code, leer(code));
    return json({ ok: true });
  }

  if (req.method === "GET" && was === "ergebnis") {
    return json({
      ok: true, offen: z.offen, frage: z.frage, optionen: z.optionen,
      schluessel: z.schluessel, zaehler: zaehle(z),
      abgestimmt: Object.keys(z.stimmen).length,
    });
  }

  return json({ ok: false, grund: "unbekannt" }, 404);
}
