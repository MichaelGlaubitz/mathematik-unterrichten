/* ============================================================
   KI-Rückmeldung · Anfrage an Claude
   ------------------------------------------------------------
   Die einzige Stelle, die mit der Claude-API spricht. Worker und
   Node-Zwilling benutzen sie beide; kern.mjs bekommt nur die fertige
   Funktion strom(system, text) gereicht.

   strom() liefert die Antwort STÜCKWEISE (async iterable von Texten),
   so wie Claude sie schreibt — die Seite zeigt sie mitlaufend an.
   Lehnt Claude ab (stop_reason "refusal"), endet der Strom mit dem
   Fehler ABGELEHNT; kern.mjs macht daraus eine verständliche Meldung.

   Modell: Claude Opus 5.5 mit niedriger Denktiefe (effort "low") —
   eine Rückmeldung ist kurz, und niedrige Denktiefe hält sie schnell
   und billig. Der Rückfall bei einer Ablehnung durch die
   Sicherheitsfilter ist eingeschaltet (fallbacks "default").

   Der API-Schlüssel steht in keiner Datei. Im Worker kommt er aus
   dem Secret ANTHROPIC_API_KEY, im Zwilling aus der Umgebung.
   ============================================================ */
import Anthropic from "@anthropic-ai/sdk";

export const MODELL = "claude-opus-5-5";
export const ABGELEHNT = "ABGELEHNT";

export function macheStrom(apiKey) {
  if (!apiKey) return null;
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 90_000 });
  return async function* strom(system, text) {
    const s = client.beta.messages.stream({
      model: MODELL,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system,
      messages: [{ role: "user", content: text }],
    });
    for await (const ev of s) {
      if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta" && ev.delta.text)
        yield ev.delta.text;
    }
    const fertig = await s.finalMessage();
    if (fertig.stop_reason === "refusal") throw new Error(ABGELEHNT);
  };
}
