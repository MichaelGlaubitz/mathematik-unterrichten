/* ============================================================
   Rueckmeldebrett · Cloudflare Worker

   Diese Datei ist nur die Verkabelung. Die Logik steht in kern.mjs
   und laeuft hier Zeile fuer Zeile genauso wie im Node-Zwilling.

   WARUM ALLES IN EINEM DURABLE OBJECT LIEGT
   -----------------------------------------
   Auf diesem Brett wird gezaehlt, und Zaehlen vertraegt kein
   "irgendwann konsistent": Stimmten dreissig iPads gleichzeitig fuer
   denselben Eintrag, wuerde ein KV-Speicher die Haelfte der Stimmen
   ueberschreiben. Ein Durable Object nimmt die Aufrufe nacheinander
   an; Lesen, Aendern und Zurueckschreiben ist darin unteilbar,
   solange dazwischen nur Speicher angefasst wird — genau das tut
   kern.mjs.

   Es ist EIN Objekt fuer beide Bretter. Getrennte Objekte waeren
   sauberer abgegrenzt, aber die Moderationsseite braucht ohnehin
   beide auf einmal, und dreissig Geraete sind fuer ein Objekt keine
   Last.

   WARUM JE EINTRAG EIN SCHLUESSEL
   -------------------------------
   Ein Durable Object begrenzt den einzelnen Wert. Das ganze Brett
   als ein Datensatz waere nach ein paar Dutzend ausfuehrlichen
   Meldungen am Anschlag — und zwar mitten im Schuljahr, ohne
   Vorwarnung. Je Meldung ein Schluessel kennt diese Grenze nicht.

   Verkabelt werden drei Dinge:

     BRETT    das Durable Object. Es haelt die Meldungen und die
              Zaehler fuer die Schranken.
     CODES    die Klassencodes. Ohne sie nimmt der Dienst NICHTS an.
              Setzen mit:  npx wrangler secret put CODES
              Form:        7b:hufeisen42, 10b:seilbahn7
     LEHRER   das Geheimnis, mit dem die Moderationsseite aufgeht.
              Setzen mit:  npx wrangler secret put LEHRER

   Fehlt CODES, ist das Brett nur lesbar. Fehlt LEHRER, gibt es keine
   Moderationsseite. Beides ist die gewollte Richtung des Fehlers.
   ============================================================ */
import { bearbeite } from "./kern.mjs";

export class Brett {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }

  async fetch(req) {
    /* Speicher und Wache leben beide in DIESEM Objekt. Deshalb stehen
       sie hier und nicht draussen: Ausserhalb waeren es Netzaufrufe,
       und jeder Netzaufruf oeffnet die Eingangsschleuse fuer den
       naechsten Aufruf — dann waere die Unteilbarkeit dahin, auf der
       die Zaehlung beruht. */
    const speicher = this.ctx.storage;
    const schl = (art, id) => "e:" + art + ":" + id;

    const brett = {
      async lies(art) {
        const karte = await speicher.list({ prefix: "e:" + art + ":", limit: 1000 });
        return [...karte.values()];
      },
      async sichere(art, eintrag) {
        await speicher.put(schl(art, eintrag.id), eintrag);
      },
      async entferne(art, id) {
        await speicher.delete(schl(art, id));
      },
    };

    const wache = {
      async zaehle(schluessel, grenze, fensterSek) {
        const k = "z:" + schluessel;
        const jetzt = Date.now();
        const e = await speicher.get(k);
        if (!e || jetzt > e.bis) {
          await speicher.put(k, { n: 1, bis: jetzt + fensterSek * 1000 });
          /* Der Alarm raeumt abgelaufene Zaehler weg, damit das
             Objekt nicht mit jeder Woche weiterwaechst. */
          await speicher.setAlarm(jetzt + fensterSek * 1000 + 60000);
          return true;
        }
        if (e.n >= grenze) return false;
        e.n++;
        await speicher.put(k, e);
        return true;
      },
    };

    return bearbeite(req, brett, wache, {
      codes: this.env.CODES || "",
      lehrer: this.env.LEHRER || "",
    });
  }

  /* Nur die Zaehler verfallen. Die Meldungen bleiben — ein Brett,
     das sich selbst leert, waere ein Brett, auf das niemand schreibt. */
  async alarm() {
    const jetzt = Date.now();
    const alle = await this.ctx.storage.list({ prefix: "z:" });
    for (const [k, v] of alle) if (!v || jetzt > v.bis) await this.ctx.storage.delete(k);
  }
}

export default {
  async fetch(req, env) {
    /* Alle Anfragen laufen durch dasselbe Objekt — nur so stimmen die
       Zahlen. Die IP kommt als Kopfzeile mit, weil die Zaehlung sie
       braucht; gespeichert wird sie nirgends. */
    const stub = env.BRETT.get(env.BRETT.idFromName("brett"));
    return stub.fetch(req);
  },
};
