/* ============================================================
   KI-Rückmeldung · Cloudflare Worker

   Nur die Verkabelung. Die Logik steht in kern.mjs, die Anfrage an
   Claude in claude.mjs.

   WARUM EIN DURABLE OBJECT
   ------------------------
   Hier wird gezählt (Rückmeldungen und Fehlversuche je Tag), und
   Zählen verträgt kein „irgendwann konsistent“. Das Objekt nimmt die
   Aufrufe nacheinander an. kern.mjs erhöht den Zähler, BEVOR es
   Claude fragt — Lesen und Schreiben liegen also unteilbar vor dem
   ersten Netzaufruf.

   Verkabelt werden:
     BUCH               das Durable Object mit den Tageszahlen
     FAMILIENCODE       Secret, mindestens 8 Zeichen, frei erfunden
                        npx wrangler secret put FAMILIENCODE
     ANTHROPIC_API_KEY  Secret, der API-Schlüssel von platform.claude.com
                        npx wrangler secret put ANTHROPIC_API_KEY

   Fehlt eines der beiden Secrets, antwortet der Dienst mit 503 und
   ruft Claude nie auf.
   ============================================================ */
import { bearbeite } from "./kern.mjs";
import { macheFrage } from "./claude.mjs";

export class Buch {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    this.frage = macheFrage(env.ANTHROPIC_API_KEY);
  }

  async fetch(req) {
    const speicher = this.ctx.storage;
    const buch = { hole: (k) => speicher.get(k), setze: (k, v) => speicher.put(k, v) };
    return bearbeite(req, buch, { code: this.env.FAMILIENCODE || "", frage: this.frage });
  }
}

export default {
  async fetch(req, env) {
    const stub = env.BUCH.get(env.BUCH.idFromName("buch"));
    return stub.fetch(req);
  },
};
