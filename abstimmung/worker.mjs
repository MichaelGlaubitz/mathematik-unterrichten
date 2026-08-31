/* ============================================================
   Live-Abstimmung · Cloudflare Worker
   ------------------------------------------------------------
   Duenne Schale um kern.mjs. Der Zustand liegt in einem Durable
   Object je Raum - nur dort laesst sich zuverlaessig zaehlen; ein
   Schluessel-Wert-Speicher waere „eventually consistent" und
   verloere unter dreissig gleichzeitigen Stimmen welche davon.

   Ausrollen (einmalig, an Ihrem Rechner):

     cd abstimmung
     npx wrangler login                    # oeffnet den Browser
     npx wrangler secret put LEHRER        # den Lehrerschluessel setzen
     npx wrangler deploy

   Danach nennt wrangler die Adresse, etwa
   https://abstimmung.<konto>.workers.dev — die gehoert in
   ABSTIMMUNG_URL der Wandfassung (siehe abstimmung/LIESMICH.md).
   ============================================================ */
import { bearbeite, corsKopf } from "./kern.mjs";

/* Ein Durable Object je Raum: eine Instanz, ein Zaehler, keine Wettlaeufe. */
export class Raum {
  constructor(state, env) { this.state = state; this.env = env; }

  async fetch(req) {
    const speicher = {
      lies: async () => (await this.state.storage.get("z")) || null,
      schreib: async (_code, z) => { await this.state.storage.put("z", z); },
    };
    return bearbeite(req, speicher, this.env.LEHRER);
  }
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsKopf() });
    const url = new URL(req.url);
    const teile = url.pathname.split("/").filter(Boolean);
    if (teile[0] === "v1" && teile[1] === "ping")
      return new Response(JSON.stringify({ ok: true, dienst: "abstimmung" }),
                          { headers: { "content-type": "application/json", ...corsKopf() } });
    const code = (teile[2] || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24);
    if (teile[0] !== "v1" || teile[1] !== "raum" || !code)
      return new Response(JSON.stringify({ ok: false, grund: "unbekannt" }),
                          { status: 404, headers: { "content-type": "application/json", ...corsKopf() } });
    const id = env.RAUM.idFromName(code);
    return env.RAUM.get(id).fetch(req);
  },
};
