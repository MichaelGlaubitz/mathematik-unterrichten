/* ============================================================
   Zaehler · Cloudflare Worker

   Diese Datei ist nur die Verkabelung. Die Logik steht in kern.mjs
   und laeuft hier Zeile fuer Zeile genauso wie im Node-Zwilling.

   WARUM EIN DURABLE OBJECT
   ------------------------
   Hier wird gezaehlt, und Zaehlen vertraegt kein "irgendwann
   konsistent": Zwei Meldungen zur selben Sekunde wuerden sich in
   einem KV-Speicher gegenseitig ueberschreiben. Ein Durable Object
   nimmt die Aufrufe nacheinander an; Lesen, Aendern und
   Zurueckschreiben ist darin unteilbar, solange dazwischen nur der
   Speicher angefasst wird — genau das tut kern.mjs.

   WARUM JE ZAEHLER EIN SCHLUESSEL
   -------------------------------
   Ein Durable Object begrenzt den einzelnen Wert. Alle Zahlen in
   einem Datensatz waeren irgendwann am Anschlag — ohne Vorwarnung.
   Je Trainer, Tag und Ereignis ein Schluessel kennt diese Grenze
   nicht, und der Lesezugriff holt nur den Zeitraum, der gefragt ist.

   Verkabelt werden zwei Dinge:

     BUCH    das Durable Object mit den Zahlen.
     LESEN   der Leseschluessel fuer die Auswertung.
             Setzen mit:  npx wrangler secret put LESEN
             Mindestens 16 Zeichen, frei erfunden, NIRGENDS sonst
             benutzt. Ein Beispiel steht hier mit Absicht nicht.

   Fehlt LESEN, zaehlt der Dienst weiter, gibt aber keine Zahlen
   heraus. Das ist die gewollte Richtung des Fehlers.
   ============================================================ */
import { bearbeite } from "./kern.mjs";

export class Buch {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }

  async fetch(req) {
    /* Der Speicher lebt in DIESEM Objekt. Deshalb steht er hier und
       nicht draussen: Ausserhalb waeren es Netzaufrufe, und jeder
       Netzaufruf oeffnet die Eingangsschleuse fuer den naechsten
       Aufruf — dann waere die Unteilbarkeit dahin, auf der die
       Zaehlung beruht. */
    const speicher = this.ctx.storage;
    const buch = {
      hole: (k) => speicher.get(k),
      setze: (k, v) => speicher.put(k, v),
      async bereich(von, bis) {
        const karte = await speicher.list({ start: von, end: bis, limit: 20000 });
        return [...karte.entries()];
      },
    };
    return bearbeite(req, buch, { lesen: this.env.LESEN || "" });
  }
}

export default {
  async fetch(req, env) {
    /* Alle Anfragen laufen durch dasselbe Objekt — nur so stimmen die
       Zahlen. Von der Anfrage wird nichts weitergereicht ausser ihr
       selbst: keine IP, kein Land, keine Kennung. */
    const stub = env.BUCH.get(env.BUCH.idFromName("buch"));
    return stub.fetch(req);
  },
};
