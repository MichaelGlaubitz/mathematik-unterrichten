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

const MAX_BILDER = 32;                             // so viele Kacheln passen an die Wand
const MAX_BILD_ZEICHEN = 160000;                   // ~120 KB PNG als data:-URL

const leer = (code) => ({
  code, frage: "", optionen: [], offen: false, schluessel: "",
  stimmen: {}, hinweis: "", geaendert: Date.now(),
  /* Zeichenauftrag: art "zeichnen" statt "wahl". Die Bilder selbst liegen
     im Speicher unter eigenen Schluesseln (speicher.schreibBild); hier
     steht je Geraet nur, wann es kam und ob es freigegeben ist. */
  art: "wahl", bilder: {}, freiAlle: false,
});

const freigegeben = (z, g) => !!(z.freiAlle || (z.bilder[g] && z.bilder[g].frei));

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
  if (!z.bilder) z.bilder = {};                    // Raeume von vor dem Zeichenauftrag
  if (!z.art) z.art = "wahl";

  /* ---- Schuelerseite: was steht gerade an? ------------------------ */
  if (req.method === "GET" && !was) {
    /* ?geraet=… laesst das Geraet erfahren, ob sein eigenes Bild da und
       freigegeben ist - mehr ueber die Bilder anderer erfaehrt es nicht. */
    const g = saeubere(url.searchParams.get("geraet"), 40);
    return json({
      ok: true, offen: z.offen, schluessel: z.schluessel,
      frage: z.frage, optionen: z.optionen, art: z.art,
      /* Wie viele schon abgestimmt haben, darf jeder sehen - es macht
         das Warten ertraeglich und verraet nichts ueber die Antwort. */
      abgestimmt: Object.keys(z.stimmen).length,
      eingereicht: Object.keys(z.bilder).length,
      meins: g && z.bilder[g] ? { da: true, frei: freigegeben(z, g) } : null,
      /* Der Grundzustand: Steht hier ein Text („Blick nach vorn."), zeigt
         das Geraet nur ihn - keine Karten, keine Frage. */
      hinweis: z.hinweis || "",
    });
  }

  /* ---- Schuelerseite: Bild einreichen ------------------------------ */
  if (req.method === "POST" && was === "bild") {
    let b; try { b = await req.json(); } catch { return json({ ok: false, grund: "kaputt" }, 400); }
    const geraet = saeubere(b.geraet, 40);
    const daten = String(b.daten ?? "");
    if (!geraet) return json({ ok: false, grund: "kein geraet" }, 400);
    if (!z.offen || z.art !== "zeichnen") return json({ ok: false, grund: "zu" }, 409);
    if (b.schluessel && b.schluessel !== z.schluessel)
      return json({ ok: false, grund: "andere frage" }, 409);
    if (!daten.startsWith("data:image/png;base64,") || daten.length > MAX_BILD_ZEICHEN)
      return json({ ok: false, grund: "kein bild" }, 400);
    if (!(geraet in z.bilder) && Object.keys(z.bilder).length >= MAX_BILDER)
      return json({ ok: false, grund: "voll" }, 429);
    await speicher.schreibBild(code, geraet, daten);
    /* Ein zweites Bild ersetzt das erste - und verliert dessen Freigabe:
       Was die Lehrkraft gesehen hat, ist nicht mehr das, was jetzt da ist. */
    z.bilder[geraet] = { zeit: Date.now(), frei: false };
    z.geaendert = Date.now();
    await speicher.schreib(code, z);
    return json({ ok: true, eingereicht: Object.keys(z.bilder).length });
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
    const art = b.art === "zeichnen" ? "zeichnen" : "wahl";
    const optionen = art === "wahl" && Array.isArray(b.optionen)
      ? b.optionen.map(o => saeubere(o, 200)).slice(0, MAX_OPTIONEN) : [];
    if (art === "wahl" && optionen.length < 2)
      return json({ ok: false, grund: "zu wenig optionen" }, 400);
    const schluessel = saeubere(b.schluessel, 60) || String(Date.now());
    /* Neue Frage heisst: frische Stimmen und frische Bilder. Dieselbe
       Frage noch einmal oeffnen (gleicher Schluessel) behaelt beides - so
       kann man eine versehentlich geschlossene Abstimmung wieder aufmachen. */
    if (schluessel !== z.schluessel) {
      z.stimmen = {};
      z.bilder = {};
      z.freiAlle = false;
      if (speicher.loescheBilder) await speicher.loescheBilder(code);
    }
    z.schluessel = schluessel;
    z.art = art;
    z.frage = saeubere(b.frage, 400);
    z.optionen = optionen;
    z.offen = true;
    z.hinweis = "";                    // eine offene Frage beendet den Grundzustand
    z.geaendert = Date.now();
    await speicher.schreib(code, z);
    return json({ ok: true, schluessel });
  }

  /* Grundzustand: Die Geraete zeigen nur einen Satz („Blick nach vorn.")
     und keine Karten. Frage, Antworten und Stimmen bleiben im Raum
     liegen - wird dieselbe Frage danach wieder geoeffnet, sind die
     Stimmen noch da. Ein leerer Text hebt den Grundzustand auf. */
  if (req.method === "POST" && was === "hinweis") {
    let b; try { b = await req.json(); } catch { return json({ ok: false, grund: "kaputt" }, 400); }
    z.hinweis = saeubere(b.text, 120);
    z.offen = false;
    z.geaendert = Date.now();
    await speicher.schreib(code, z);
    return json({ ok: true, hinweis: z.hinweis });
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
      schluessel: z.schluessel, zaehler: zaehle(z), art: z.art,
      abgestimmt: Object.keys(z.stimmen).length,
      /* Die Bilder selbst kommen einzeln (GET bild?geraet=…) - die Wand
         fragt alle anderthalb Sekunden nach dem Stand und holt nur, was
         sie noch nicht hat. */
      bilder: Object.entries(z.bilder)
        .sort((a, b2) => a[1].zeit - b2[1].zeit)
        .map(([g, m]) => ({ geraet: g, zeit: m.zeit, frei: freigegeben(z, g) })),
      freiAlle: !!z.freiAlle,
    });
  }

  if (req.method === "GET" && was === "bild") {
    const g = saeubere(url.searchParams.get("geraet"), 40);
    if (!g || !z.bilder[g]) return json({ ok: false, grund: "kein bild" }, 404);
    const daten = speicher.liesBild ? await speicher.liesBild(code, g) : null;
    if (!daten) return json({ ok: false, grund: "kein bild" }, 404);
    return json({ ok: true, geraet: g, daten, frei: freigegeben(z, g) });
  }

  /* Freigabe: einzeln (geraet) oder alle auf einmal (alle: true). Wer bei
     „alle frei" ein einzelnes Bild zurueckzieht, bekommt die Freigabe
     vorher auf die einzelnen Bilder verteilt - sonst haette das Zurueck-
     ziehen keine Wirkung. */
  if (req.method === "POST" && was === "frei") {
    let b; try { b = await req.json(); } catch { return json({ ok: false, grund: "kaputt" }, 400); }
    const frei = !!b.frei;
    if (b.alle) {
      z.freiAlle = frei;
      for (const m of Object.values(z.bilder)) m.frei = frei;
    } else {
      const g = saeubere(b.geraet, 40);
      if (!g || !z.bilder[g]) return json({ ok: false, grund: "kein bild" }, 404);
      if (z.freiAlle) {
        z.freiAlle = false;
        for (const m of Object.values(z.bilder)) m.frei = true;
      }
      z.bilder[g].frei = frei;
    }
    z.geaendert = Date.now();
    await speicher.schreib(code, z);
    return json({ ok: true, freiAlle: !!z.freiAlle,
                  frei: Object.keys(z.bilder).filter(g => freigegeben(z, g)).length });
  }

  return json({ ok: false, grund: "unbekannt" }, 404);
}
