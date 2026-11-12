/* ============================================================
   KI-Rückmeldung · Anfrage an Claude
   ------------------------------------------------------------
   Die einzige Stelle, die mit der Claude-API spricht. Worker und
   Node-Zwilling benutzen sie beide; kern.mjs bekommt nur die fertige
   Funktion frage(system, text) gereicht.

   Modell: Claude Opus 5.5 mit niedriger Denktiefe (effort "low") —
   eine Rückmeldung ist kurz, und niedrige Denktiefe hält sie schnell
   und billig. Der Rückfall bei einer Ablehnung durch die
   Sicherheitsfilter ist eingeschaltet (fallbacks "default"); lehnt
   auch das Ersatzmodell ab, meldet frage() `abgelehnt`.

   Der API-Schlüssel steht in keiner Datei. Im Worker kommt er aus
   dem Secret ANTHROPIC_API_KEY, im Zwilling aus der Umgebung.
   ============================================================ */
import Anthropic from "@anthropic-ai/sdk";

export const MODELL = "claude-opus-5-5";

export function macheFrage(apiKey) {
  if (!apiKey) return null;
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 60_000 });
  return async function frage(system, text) {
    const r = await client.beta.messages.create({
      model: MODELL,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system,
      messages: [{ role: "user", content: text }],
    });
    if (r.stop_reason === "refusal") return { text: "", abgelehnt: true };
    const teile = [];
    for (const b of r.content) if (b.type === "text") teile.push(b.text);
    return { text: teile.join("\n").trim(), abgelehnt: false };
  };
}
