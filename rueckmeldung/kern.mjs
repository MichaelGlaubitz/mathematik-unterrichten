/* ============================================================
   Rueckmeldebrett · Kern
   ------------------------------------------------------------
   Zwei Bretter fuer die Arbeit mit den Selbstlernstunden:

     mr   Maengelberichte  — etwas ist kaputt oder unverstaendlich
     fr   Feature-Requests — etwas fehlt und wuerde helfen

   Die Klasse meldet, die Klasse stimmt ab, die Lehrkraft antwortet
   oeffentlich. Die ganze Logik steht GENAU EINMAL hier und laeuft
   unveraendert an zwei Orten:

     worker.mjs   Cloudflare Worker (das, was im Netz steht)
     lokal.mjs    Node-Zwilling (zum Pruefen und fuer den Notfall)

   WER DARF SCHREIBEN — und warum das nicht der Knopf entscheidet
   --------------------------------------------------------------
   Lesen darf jeder: Die Bretter haengen an /fr und /mr auf der
   Website und werden aus den Stunden heraus verlinkt.

   Schreiben und Abstimmen darf nur, wer den KLASSENCODE hat. Der
   steht in KEINER Datei der Website, sondern als Worker-Secret bei
   Cloudflare, und wird in der Stunde muendlich genannt. Das ist die
   einzige Absicherung, die auf einer oeffentlichen Seite ueberhaupt
   traegt: Ein Geheimnis, das man in die Seite schreibt, ist keins —
   dreissig iPads koennen den Quelltext lesen.

   Fehlt der Code in der Umgebung, nimmt der Dienst GAR NICHTS an.
   Das ist die gewollte Richtung des Fehlers: lieber ein Brett, auf
   dem niemand schreiben kann, als eines, auf dem jeder schreibt.

   Je Lerngruppe ein eigener Code. Damit weiss der Dienst ohne
   Nachfrage, aus welcher Klasse eine Meldung kommt, und ein Code,
   der die Runde macht, laesst sich fuer eine Gruppe allein
   austauschen.

   WAS DER DIENST NICHT KANN
   -------------------------
   Er kann nicht erkennen, ob hinter einer Geraetenummer wirklich
   ein anderes Geraet steckt. Wer den Klassencode hat, koennte sich
   Nummern ausdenken und mehrfach abstimmen. Deshalb steht neben
   jedem Eintrag, WIE VIELE abgestimmt haben: Eine Zahl, die nicht
   zur Klassenstaerke passt, faellt auf. Dazu kommen Schranken je
   Geraet, je Adresse und je Tag.

   WAS GESPEICHERT WIRD
   --------------------
   Je Meldung: Brett, Klasse, Zeitpunkt, die ausgefuellten Felder,
   eine zufaellige Geraetenummer und — falls freiwillig angegeben —
   ein Kuerzel. Das Kuerzel sieht NUR die Lehrkraft, nie das Brett.
   IP-Adressen werden nicht gespeichert, sie gehen nur fluechtig in
   die Zaehlung ein. Namen werden nirgends verlangt.
   ============================================================ */

export const ARTEN = ["mr", "fr"];

/* Die Bezeichnung der Bretter — steht an genau einer Stelle, damit
   Worker, Zwilling und Lehrerseite dasselbe sagen. */
export const BRETT = {
  mr: { titel: "Mängelberichte", kurz: "Mangel" },
  fr: { titel: "Feature-Requests", kurz: "Wunsch" },
};

/* Der oeffentliche Weg einer Meldung. Er ist kurz und er endet
   IMMER sichtbar — auch "nicht geplant" ist eine Antwort, und eine
   begruendete Absage haelt die Beteiligung eher aufrecht als
   Schweigen. */
export const STATUS = ["neu", "gesehen", "in-arbeit", "erledigt", "nicht-geplant"];
export const STATUS_TEXT = {
  "neu": "neu",
  "gesehen": "gelesen",
  "in-arbeit": "in Arbeit",
  "erledigt": "erledigt",
  "nicht-geplant": "nicht geplant",
};

export const TITEL_MIN = 8;
export const TITEL_MAX = 90;
export const KUERZEL_MAX = 24;
export const NOTIZ_MAX = 400;
export const MAX_EINTRAEGE = 500;          // je Brett
export const GRENZE_MELDUNG_GERAET = 6;    // je Geraet und Tag
export const GRENZE_STIMME_GERAET = 80;    // je Geraet und Stunde
export const GRENZE_MELDUNG_TAG = 300;     // insgesamt je Tag

/* ------------------------------------------------------------------
   Die Felder — und warum es Felder sind und kein Textfeld

   Ein leeres "Was moechtest du melden?" bringt "geht nicht" zurueck.
   Damit kann niemand etwas anfangen, und der Melder lernt nichts.
   Die Felder unten sind die eingeuebte Form eines brauchbaren
   Fehlerberichts (Wo · Was getan · Was passiert · Was erwartet) und
   eines brauchbaren Wunsches (Problem VOR Loesung · Wann · Vorschlag
   · Wem nuetzt es). Sie sind hier nicht Zierde des Formulars,
   sondern werden hier im Kern geprueft — auch ein selbstgebauter
   Aufruf kommt an ihnen nicht vorbei.
   ------------------------------------------------------------------ */
export const FELDER = {
  mr: [
    { schluessel: "wo", frage: "Wo ist es passiert?",
      hilfe: "Stunde, Seite und Aufgabe — so genau, dass ich es wiederfinde.",
      beispiel: "Zehnerpotenzen 10b, Aufgabe 3, das Zeichenfeld",
      min: 4, max: 200, pflicht: true },
    { schluessel: "schritte", frage: "Was hattest du gerade gemacht?",
      hilfe: "Die letzten Schritte, damit ich es nachstellen kann.",
      beispiel: "Ich habe meine Antwort eingetippt und auf „Prüfen“ getippt.",
      min: 10, max: 800, pflicht: true },
    { schluessel: "passiert", frage: "Was ist dann passiert?",
      hilfe: "Was du gesehen hast. Der Wortlaut einer Meldung hilft sehr.",
      beispiel: "Die Seite ist an den Anfang gesprungen, meine Eingabe war weg.",
      min: 10, max: 800, pflicht: true },
    { schluessel: "erwartet", frage: "Was hättest du erwartet?",
      hilfe: "Ohne diesen Satz ist oft nicht klar, ob es ein Fehler ist.",
      beispiel: "Dass die Lösung erscheint und meine Eingabe stehen bleibt.",
      min: 5, max: 400, pflicht: true },
    { schluessel: "haeufig", frage: "Wie oft?",
      hilfe: "„Jedes Mal“ finde ich sofort, „einmal“ muss ich suchen.",
      auswahl: ["einmal", "mehrmals", "jedes Mal"], pflicht: true },
    { schluessel: "geraet_art", frage: "Gerät und Browser",
      hilfe: "Wird automatisch eingetragen; du darfst es ändern.",
      max: 160, pflicht: false },
  ],
  fr: [
    { schluessel: "problem", frage: "Was fällt dir gerade schwer?",
      hilfe: "Erst das Problem, noch nicht die Lösung. Daran erkenne ich, "
           + "ob es sich vielleicht auch anders lösen lässt.",
      beispiel: "Ich weiß am Ende der Stunde nicht, welche Aufgaben ich falsch hatte.",
      min: 15, max: 800, pflicht: true },
    { schluessel: "wann", frage: "Wann tritt das auf?",
      hilfe: "In welcher Stunde, an welcher Stelle, wie oft.",
      beispiel: "Jedes Mal beim Exit-Ticket, seit wir die Selbstlernstunden haben.",
      min: 5, max: 400, pflicht: true },
    { schluessel: "vorschlag", frage: "Dein Vorschlag",
      hilfe: "Was genau soll es können? Ein Satz reicht, wenn er konkret ist.",
      beispiel: "Am Schluss eine Liste: Aufgabe 1 ✓, Aufgabe 2 ✗, mit Link zur Lösung.",
      min: 10, max: 800, pflicht: true },
    { schluessel: "nutzen", frage: "Wem hilft das außer dir?",
      hilfe: "Wünsche, die vielen helfen, kommen zuerst dran — deshalb die Frage.",
      beispiel: "Allen, die zu Hause weiterüben wollen und nicht wissen, womit.",
      min: 5, max: 400, pflicht: true },
  ],
};

/* Der Leitfaden steht im Kern, nicht in der Seite: Die Regeln
   gelten fuer beide Bretter und sollen an genau einer Stelle
   gepflegt werden. Die Seite holt sie sich per /v1/leitfaden. */
export const LEITFADEN = {
  mr: [
    "Eine Sache je Meldung. Zwei Fehler sind zwei Meldungen — sonst lässt sich der eine abhaken und der andere nicht.",
    "Beschreibe, was passiert ist, nicht wer schuld ist. Keine Namen von Mitschülerinnen und Mitschülern.",
    "Sieh erst nach, ob es die Meldung schon gibt. Wenn ja: dafür stimmen. Zehn gleiche Meldungen bringen mich nicht weiter, zehn Stimmen schon.",
    "„Geht nicht“ hilft niemandem. Die vier Fragen unten sind genau das, was ich brauche, um den Fehler nachzustellen.",
  ],
  fr: [
    "Erst das Problem, dann die Lösung. Ein Problem lässt sich manchmal besser lösen, als du und ich es zuerst denken.",
    "Ein Wunsch je Meldung. Ein Bündel lässt sich nicht abstimmen.",
    "Sieh erst nach, ob es den Wunsch schon gibt. Wenn ja: dafür stimmen — dann rückt er nach oben.",
    "Sachlich bleiben. Das Brett steht offen im Netz, jeder kann es lesen.",
  ],
};

/* ------------------------------------------------------------------ */

const json = (daten, status = 200, kopf = {}) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { "content-type": "application/json; charset=utf-8",
               "cache-control": "no-store", ...kopf, ...corsKopf() },
  });

/* Jede Herkunft darf lesen und — mit Code — schreiben. Die Stunden
   liegen auf der Website und werden auch von file:// geoeffnet; eine
   Herkunftspruefung waere hier nur Zierde. Geschuetzt ist nicht der
   Zugang, sondern das Schreiben: nichts ohne Klassencode. */
export const corsKopf = () => ({
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-lehrer",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-max-age": "86400",
});

export const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

/* Einzeiler: Steuerzeichen und Zeilenumbrueche raus. */
const einzeilig = (s, max) => String(s == null ? "" : s)
  .replace(/[\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

/* Mehrzeiler: Absaetze bleiben, Steuerzeichen nicht. Mehr als zwei
   leere Zeilen hintereinander sind Formatierungslaerm. */
const mehrzeilig = (s, max) => String(s == null ? "" : s)
  .replace(/\r\n?/g, "\n")
  .replace(/[\x00-\x09\x0b-\x1f\x7f]/g, " ")
  .replace(/[ \t]+/g, " ")
  .split("\n").map((z) => z.trim()).join("\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim().slice(0, max);

const KLASSE_RE = /^[0-9]{1,2}[a-zA-Z]?$/;
const GERAET_RE = /^[A-Za-z0-9_-]{8,64}$/;
const ID_RE = /^[a-z]{2}-[0-9]{8}-[a-z0-9]{6}$/;

/* Vergleich ohne fruehen Abbruch. Bei einem kurzen Klassencode ist
   das keine echte Schranke, kostet aber auch nichts — und der
   Lehrerschluessel laeuft durch dieselbe Zeile. */
export function gleich(a, b) {
  const x = String(a == null ? "" : a), y = String(b == null ? "" : b);
  if (!x || !y || x.length !== y.length) return false;
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}

/* ------------------------------------------------------------------
   Geheimnisse, die keine sind.

   Am 01.09.2026 stand in dieser Datei eine Beispielzeile mit vier
   erfundenen Codes. Sie wurde beim Einrichten wortwoertlich uebernommen
   — und damit war die Zugangssperre wertlos, denn die Beispiele liegen
   oeffentlich auf GitHub. Derselbe Fehler beim Lehrerschluessel: Gesetzt
   wurde das hausweite Lehrerkennwort, das im Quelltext jeder
   veroeffentlichten Stundenseite steht.

   Eine Warnung im Text haette das nicht verhindert — sie stand da. Der
   Dienst weist solche Werte deshalb ZURUECK, statt so zu tun, als sei
   er geschuetzt. Dass die Liste die verbrannten Werte nennt, schadet
   nicht: Sie sind ohnehin oeffentlich, und Git vergisst sie nie wieder.
------------------------------------------------------------------ */
export const VERBRANNT = [
  "sumdideldum",                                     // hausweites Lehrerkennwort
  "hufeisen42", "seilbahn7", "nordpol3", "kreide19", // frueheres Beispiel
  "geheim-probe", "probe", "probe1234", "probe5678", // Werte aus der Pruefung
];
export const istVerbrannt = (s) =>
  VERBRANNT.includes(String(s == null ? "" : s).trim().toLowerCase());

/* Die Codes kommen als ein einziges Secret herein, damit nicht fuer
   jede neue Lerngruppe die Konfiguration angefasst werden muss:

     CODES = "7b:<eigener Code>, 10b:<eigener Code>"

   Ein blanker Code ohne Klasse gilt fuer alle und traegt die Klasse
   "alle" — fuer den Fall, dass es schnell gehen muss. */
/* `auchVerbrannte` zaehlt mit, was sonst wegfaellt — nur damit die
   Statusauskunft sagen kann, dass etwas abgewiesen wurde. */
export function codesLesen(roh, auchVerbrannte = false) {
  const raus = [];
  const weg = auchVerbrannte ? () => false : istVerbrannt;
  for (const stueck of String(roh || "").split(/[,;\n]+/)) {
    const t = stueck.trim();
    if (!t) continue;
    const i = t.indexOf(":");
    if (i > 0) {
      const klasse = t.slice(0, i).trim();
      const code = t.slice(i + 1).trim();
      if (KLASSE_RE.test(klasse) && code.length >= 4 && !weg(code))
        raus.push({ klasse, code });
    } else if (t.length >= 4 && !weg(t)) {
      raus.push({ klasse: "alle", code: t });
    }
  }
  return raus;
}

/* Welche Klasse gehoert zu diesem Code? null heisst: kein Zutritt. */
export function klasseFuerCode(codes, eingabe) {
  const e = einzeilig(eingabe, 64);
  if (!e) return null;
  for (const c of codes) if (gleich(c.code, e)) return c.klasse;
  return null;
}

/* ------------------------------------------------------------------
   Felder pruefen. Gibt entweder die sauberen Werte zurueck oder — und
   das ist der Punkt — je Feld einen Satz, der SAGT, was fehlt. Eine
   Abweisung, die nur "ungueltig" meldet, erzieht zu nichts.
   ------------------------------------------------------------------ */
export function felderPruefen(art, roh) {
  const felder = {}, fehler = {};
  for (const f of FELDER[art] || []) {
    const wert = f.auswahl
      ? einzeilig(roh && roh[f.schluessel], 40)
      : mehrzeilig(roh && roh[f.schluessel], f.max || 800);

    if (f.auswahl) {
      if (!f.auswahl.includes(wert)) {
        if (f.pflicht) fehler[f.schluessel] = "Bitte eine der Möglichkeiten wählen.";
        continue;
      }
      felder[f.schluessel] = wert;
      continue;
    }

    if (!wert) {
      if (f.pflicht) fehler[f.schluessel] = "Dieses Feld brauche ich.";
      continue;
    }
    if (f.min && wert.length < f.min) {
      fehler[f.schluessel] = "Das ist zu knapp — daraus kann ich nicht erkennen, "
        + "worum es geht. Ein ganzer Satz genügt.";
      continue;
    }
    felder[f.schluessel] = wert;
  }
  return { felder, fehler };
}

/* Steht da wirklich etwas? Eine Meldung aus lauter "aaaaaaaaaa"
   erfuellt jede Mindestlaenge und sagt nichts. */
export function istGehaltvoll(text) {
  const t = String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (t.length < 10) return false;
  const worte = t.split(" ").filter((w) => w.length > 1);
  if (worte.length < 3) return false;
  const verschieden = new Set(t.replace(/[^a-zäöüß0-9]/g, "")).size;
  return verschieden >= 5;
}

/* ------------------------------------------------------------------ */

export const isoTag = (d) => d.toISOString().slice(0, 10);

export function neueId(art, jetzt, zufall = Math.random) {
  const t = isoTag(jetzt).replace(/-/g, "");
  let s = "";
  while (s.length < 6) s += Math.floor(zufall() * 36).toString(36);
  return art + "-" + t + "-" + s.slice(0, 6);
}

export const punkte = (e) => (e.hoch || 0) - (e.runter || 0);
export const abgestimmt = (e) => Object.keys(e.stimmen || {}).length;

/* Die oeffentliche Sicht. Was hier NICHT drinsteht, ist Entscheidung,
   nicht Versehen: keine Geraetenummern (sonst liesse sich
   zusammenzaehlen, wer wie gestimmt hat) und kein Kuerzel — das
   Brett bleibt anonym, damit niemand aus Ruecksicht schweigt. */
export function oeffentlich(e, geraet) {
  return {
    id: e.id, art: e.art, klasse: e.klasse,
    titel: e.titel, felder: e.felder,
    zeit: e.zeit, status: e.status, notiz: e.notiz || "",
    hoch: e.hoch || 0, runter: e.runter || 0,
    punkte: punkte(e), abgestimmt: abgestimmt(e),
    meine: (geraet && e.stimmen && e.stimmen[geraet]) || 0,
  };
}

/* Standardreihenfolge ist "wichtig", nicht "neu": Das Brett soll
   zeigen, was viele betrifft. Abgeschlossenes rutscht ans Ende — es
   ist nicht weg, aber es steht niemandem mehr im Weg. */
export function sortiere(liste, wie = "wichtig") {
  const kopie = liste.slice();
  const fertig = (e) => (e.status === "erledigt" || e.status === "nicht-geplant") ? 1 : 0;
  if (wie === "neu") kopie.sort((a, b) => String(b.zeit).localeCompare(String(a.zeit)));
  else kopie.sort((a, b) =>
    fertig(a) - fertig(b) ||
    punkte(b) - punkte(a) ||
    abgestimmt(b) - abgestimmt(a) ||
    String(b.zeit).localeCompare(String(a.zeit)));
  return kopie;
}

/* ------------------------------------------------------------------
   Die Lehrerseite. Schmucklos, weil sie zwischen zwei Stunden auf
   dem Handy gelesen wird: je Eintrag der ganze Text, die Zahlen, ein
   Statusmenue, ein Feld fuer die oeffentliche Antwort, ein Knopf zum
   Ausblenden und einer zum Loeschen.
   ------------------------------------------------------------------ */
function seiteBauen(alle) {
  const block = (art) => {
    const liste = sortiere(alle[art] || []);
    const zeilen = liste.map((e) => {
      const felder = (FELDER[e.art] || []).map((f) => e.felder && e.felder[f.schluessel]
        ? '<p class="f"><b>' + esc(f.frage) + '</b><br>' + esc(e.felder[f.schluessel]) + '</p>'
        : "").join("");
      const status = STATUS.map((st) =>
        '<option value="' + st + '"' + (e.status === st ? " selected" : "") + '>'
        + esc(STATUS_TEXT[st]) + '</option>').join("");
      return '<article class="e' + (e.sichtbar === false ? " weg" : "") + '" data-id="'
        + esc(e.id) + '" data-art="' + esc(e.art) + '">'
        + '<h3>' + esc(e.titel) + '</h3>'
        + '<p class="m">' + esc(e.klasse) + ' · ' + esc(String(e.zeit).slice(0, 16).replace("T", " "))
        + ' · <b>' + punkte(e) + '</b> ' + (Math.abs(punkte(e)) === 1 ? "Punkt" : "Punkte")
        + ' (' + (e.hoch || 0) + '&uarr; ' + (e.runter || 0) + '&darr;, '
        + abgestimmt(e) + (abgestimmt(e) === 1 ? ' Stimme)' : ' Stimmen)')
        + (e.kuerzel ? ' · von ' + esc(e.kuerzel) : ' · anonym')
        + (e.sichtbar === false ? ' · <b>ausgeblendet</b>' : '') + '</p>'
        + felder
        + '<p class="t"><select class="st">' + status + '</select>'
        + '<input class="no" placeholder="Öffentliche Antwort (steht dann unter der Meldung)" '
        + 'value="' + esc(e.notiz || "") + '" maxlength="' + NOTIZ_MAX + '">'
        + '<button data-tat="status">Speichern</button>'
        + '<button data-tat="' + (e.sichtbar === false ? "zeigen" : "verbergen") + '">'
        + (e.sichtbar === false ? "Wieder zeigen" : "Ausblenden") + '</button>'
        + '<button data-tat="loeschen" class="rot">Löschen</button></p>'
        + '</article>';
    }).join("");
    return '<h2>' + esc(BRETT[art].titel) + ' <span class="n">' + liste.length + '</span></h2>'
      + (zeilen || '<p class="leer">Noch nichts gemeldet.</p>');
  };

  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Rückmeldungen</title><style>
body{font:16px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:52rem;
 margin:1.5rem auto;padding:0 1rem;color:#14202a}
h1{font-size:1.4rem;color:#0b5aa0}h2{font-size:1.05rem;color:#0b5aa0;margin:1.8rem 0 .4rem}
h3{font-size:1rem;margin:0 0 .2rem}
.n{background:#e6f4ea;border:1px solid #a8d5b5;border-radius:999px;padding:0 .5rem;
 font-size:.8rem;color:#1b5e20}
.e{border:1px solid #cfd8de;border-radius:10px;padding:.7rem .9rem;margin:.6rem 0}
.e.weg{opacity:.55;background:#f6f7f8}
.m{color:#5a6672;font-size:.82rem;margin:0 0 .5rem}
.f{margin:.35rem 0;font-size:.9rem;white-space:pre-wrap}.f b{color:#0b5aa0;font-weight:600}
.t{display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0 0}
.t input{flex:1 1 14rem;min-width:0}
select,input,button{font:inherit;font-size:.85rem;padding:.3rem .5rem;
 border:1px solid #cfd8de;border-radius:7px;background:#fff}
button{background:#0b5aa0;color:#fff;border-color:#0b5aa0;cursor:pointer}
button.rot{background:#fff;color:#b3261e;border-color:#e3b7b3}
.leer{color:#5a6672}
</style></head><body>
<h1>Rückmeldungen</h1>
<p class="leer">Ausgeblendetes bleibt für Sie sichtbar, verschwindet aber vom Brett.
Eine öffentliche Antwort steht danach unter der Meldung — auch bei „nicht geplant“.</p>
${block("mr")}
${block("fr")}
<script>
const S = new URLSearchParams(location.search).get("s") || "";
document.addEventListener("click", async (ev) => {
  const b = ev.target.closest("button[data-tat]"); if (!b) return;
  const a = b.closest("article");
  const tat = b.dataset.tat;
  if (tat === "loeschen" && !confirm("Diese Meldung endgültig löschen?")) return;
  b.disabled = true;
  const r = await fetch("/v1/moderation", { method: "POST",
    headers: { "content-type": "application/json", "x-lehrer": S },
    body: JSON.stringify({ art: a.dataset.art, id: a.dataset.id, tat: tat,
      status: a.querySelector(".st").value, notiz: a.querySelector(".no").value }) });
  if (r.ok) location.reload(); else { b.disabled = false; alert("Ging nicht: " + r.status); }
});
<\/script>
</body></html>`;
}

/* ------------------------------------------------------------------
   Der eine Einstiegspunkt.

   brett  = { lies(art) -> [Eintraege],
              sichere(art, eintrag),      // legt an oder ersetzt
              entferne(art, id) }
   Je Eintrag ein eigener Schluessel, nicht das ganze Brett als ein
   Wert: Ein Durable Object begrenzt den EINZELNEN Wert, und ein
   Brett mit fuenfhundert Meldungen liefe dagegen.
   wache  = { zaehle(schluessel, grenze, fensterSek) -> true/false }
   geheim = { codes: "7b:… ,10b:…", lehrer: "…" }

   Lesen und Schreiben laufen im Worker in EINEM Durable Object;
   dessen Eingangsschleuse haelt die Aufrufe auseinander, solange
   dazwischen nur Speicher angefasst wird. Deshalb darf hier gelesen,
   geaendert und zurueckgeschrieben werden, ohne dass zwei
   gleichzeitige Stimmen einander ueberschreiben.
   ------------------------------------------------------------------ */
export async function bearbeite(req, brett, wache, geheim, jetzt = new Date()) {
  const url = new URL(req.url);
  const pfad = url.pathname.replace(/\/+$/, "") || "/";
  const codes = codesLesen(geheim && geheim.codes);
  /* Ein verbrannter Lehrerschluessel oeffnet nichts. Fail closed: lieber
     keine Moderationsseite als eine, die jeder aufbekommt. */
  const rohLehrer = (geheim && geheim.lehrer) || "";
  const lehrer = istVerbrannt(rohLehrer) ? "" : rohLehrer;

  if (req.method === "OPTIONS")
    return new Response(null, { status: 204, headers: corsKopf() });

  /* Die Statusauskunft nennt die Lerngruppen, aber nie einen Code: So
     laesst sich nachsehen, ob eine Klasse eingerichtet ist, ohne dass
     jemand mitliest, womit. `verbrannt` faellt auf, wenn ein Geheimnis
     abgewiesen wurde — sonst suchte man den Fehler bei den iPads. */
  if (pfad === "/v1/ping") {
    const abgewiesen = codesLesen((geheim && geheim.codes) || "", true).length - codes.length;
    return json({ ok: true, dienst: "rueckmeldung", bretter: ARTEN,
                  schreiben: codes.length > 0,
                  klassen: codes.map((c) => c.klasse),
                  moderation: !!lehrer,
                  verbrannt: abgewiesen + (istVerbrannt(rohLehrer) ? 1 : 0) });
  }

  /* Felder und Leitfaden holt sich die Seite hier ab, damit Formular
     und Pruefung nicht auseinanderlaufen koennen. */
  if (pfad === "/v1/leitfaden")
    return json({ ok: true, felder: FELDER, leitfaden: LEITFADEN,
                  titel: { min: TITEL_MIN, max: TITEL_MAX },
                  brett: BRETT, status: STATUS_TEXT });

  /* ---------------- Lesen: offen ---------------- */
  if (pfad.startsWith("/v1/brett/")) {
    const art = pfad.slice("/v1/brett/".length);
    if (!ARTEN.includes(art)) return json({ ok: false, grund: "brett" }, 404);
    const geraet = einzeilig(url.searchParams.get("geraet"), 64);
    const klasse = einzeilig(url.searchParams.get("klasse"), 4);
    let liste = (await brett.lies(art)).filter((e) => e.sichtbar !== false);
    if (klasse && KLASSE_RE.test(klasse)) liste = liste.filter((e) => e.klasse === klasse);
    const wie = url.searchParams.get("sortierung") === "neu" ? "neu" : "wichtig";
    return json({ ok: true, art, sortierung: wie,
                  eintraege: sortiere(liste, wie).map((e) => oeffentlich(e, geraet)) });
  }

  /* ---------------- Code prüfen ---------------- */
  /* Ein eigener Weg dafuer, damit der Anmeldeschirm sagen kann "der
     Code stimmt" — und nicht erst die fertig getippte Meldung daran
     scheitert. */
  if (pfad === "/v1/zutritt" && req.method === "POST") {
    if (!codes.length) return json({ ok: false, grund: "kein-code-eingerichtet" }, 503);
    let d; try { d = await req.json(); } catch { return json({ ok: false, grund: "kein-json" }, 400); }
    const ip = req.headers.get("cf-connecting-ip") || "?";
    if (!(await wache.zaehle("zutritt:" + ip, 60, 3600)))
      return json({ ok: false, grund: "zu-oft" }, 429);
    const klasse = klasseFuerCode(codes, d.code);
    if (!klasse) return json({ ok: false, grund: "code" }, 403);
    return json({ ok: true, klasse });
  }

  /* ---------------- Melden ---------------- */
  if (pfad === "/v1/melden" && req.method === "POST") {
    /* Ohne eingerichteten Code nimmt der Dienst nichts an. Lieber
       ein stummes Brett als ein offenes. */
    if (!codes.length) return json({ ok: false, grund: "kein-code-eingerichtet" }, 503);

    let d; try { d = await req.json(); } catch { return json({ ok: false, grund: "kein-json" }, 400); }

    const art = einzeilig(d.art, 2);
    if (!ARTEN.includes(art)) return json({ ok: false, grund: "brett" }, 400);

    const klasse = klasseFuerCode(codes, d.code);
    if (!klasse) return json({ ok: false, grund: "code" }, 403);

    const geraet = einzeilig(d.geraet, 64);
    if (!GERAET_RE.test(geraet)) return json({ ok: false, grund: "geraet" }, 400);

    const ip = req.headers.get("cf-connecting-ip") || "?";
    if (!(await wache.zaehle("melden:" + geraet, GRENZE_MELDUNG_GERAET, 86400)))
      return json({ ok: false, grund: "zu-oft" }, 429);
    if (!(await wache.zaehle("melden-ip:" + ip, GRENZE_MELDUNG_GERAET * 5, 86400)))
      return json({ ok: false, grund: "zu-oft" }, 429);
    if (!(await wache.zaehle("melden-tag:" + isoTag(jetzt), GRENZE_MELDUNG_TAG, 86400)))
      return json({ ok: false, grund: "tageslimit" }, 429);

    const titel = einzeilig(d.titel, TITEL_MAX);
    const fehler = {};
    if (titel.length < TITEL_MIN)
      fehler.titel = "Die Überschrift ist zu knapp. Ein halber Satz, an dem "
        + "andere erkennen, ob sie dasselbe meinen.";
    else if (!istGehaltvoll(titel))
      fehler.titel = "Diese Überschrift sagt noch nichts. Wie würdest du es "
        + "einem Mitschüler in einem Satz sagen?";

    const gepruefte = felderPruefen(art, d.felder);
    Object.assign(fehler, gepruefte.fehler);
    for (const f of FELDER[art]) {
      if (f.auswahl || fehler[f.schluessel]) continue;
      const wert = gepruefte.felder[f.schluessel];
      if (f.pflicht && f.min >= 10 && wert && !istGehaltvoll(wert))
        fehler[f.schluessel] = "Damit kann ich noch nichts anfangen — bitte "
          + "in einem ganzen Satz.";
    }
    if (Object.keys(fehler).length) return json({ ok: false, grund: "felder", fehler }, 400);

    const vorhanden = await brett.lies(art);
    const eintrag = {
      id: neueId(art, jetzt), art, klasse,
      titel, felder: gepruefte.felder,
      kuerzel: einzeilig(d.kuerzel, KUERZEL_MAX),
      geraet, zeit: jetzt.toISOString(),
      status: "neu", notiz: "", sichtbar: true,
      hoch: 1, runter: 0, stimmen: { [geraet]: 1 },
    };
    /* Wer meldet, hat damit abgestimmt. Alles andere waere eine
       Fangfrage: Die eigene Meldung nicht zu unterstuetzen ergibt
       keinen Sinn, und ohne diese eine Stimme staende jede neue
       Meldung bei null und ganz unten. */
    await brett.sichere(art, eintrag);

    /* Das Brett laeuft nicht ueber: Ist es voll, weicht das aelteste
       ABGESCHLOSSENE. Offene Meldungen bleiben immer stehen — lieber
       ein volles Brett als eine verschwundene Meldung. */
    if (vorhanden.length + 1 > MAX_EINTRAEGE) {
      const weg = vorhanden
        .filter((e) => e.status === "erledigt" || e.status === "nicht-geplant")
        .sort((a, b) => String(a.zeit).localeCompare(String(b.zeit)))[0];
      if (weg) await brett.entferne(art, weg.id);
    }
    return json({ ok: true, eintrag: oeffentlich(eintrag, geraet) });
  }

  /* ---------------- Abstimmen ---------------- */
  if (pfad === "/v1/stimme" && req.method === "POST") {
    if (!codes.length) return json({ ok: false, grund: "kein-code-eingerichtet" }, 503);

    let d; try { d = await req.json(); } catch { return json({ ok: false, grund: "kein-json" }, 400); }

    const art = einzeilig(d.art, 2);
    if (!ARTEN.includes(art)) return json({ ok: false, grund: "brett" }, 400);
    if (!klasseFuerCode(codes, d.code)) return json({ ok: false, grund: "code" }, 403);

    const geraet = einzeilig(d.geraet, 64);
    if (!GERAET_RE.test(geraet)) return json({ ok: false, grund: "geraet" }, 400);

    const id = einzeilig(d.id, 32);
    if (!ID_RE.test(id)) return json({ ok: false, grund: "id" }, 400);

    const wert = d.wert === 1 || d.wert === -1 ? d.wert : 0;
    if (!(await wache.zaehle("stimme:" + geraet, GRENZE_STIMME_GERAET, 3600)))
      return json({ ok: false, grund: "zu-oft" }, 429);

    const liste = await brett.lies(art);
    const e = liste.find((x) => x.id === id);
    if (!e || e.sichtbar === false) return json({ ok: false, grund: "unbekannt" }, 404);

    /* Ein Geraet, eine Stimme — und sie ist aenderbar. Erst die alte
       zuruecknehmen, dann die neue zaehlen; sonst wandern die Summen
       mit jedem Umschwenken davon. */
    e.stimmen = e.stimmen || {};
    const alt = e.stimmen[geraet] || 0;
    if (alt === 1) e.hoch = Math.max(0, (e.hoch || 0) - 1);
    if (alt === -1) e.runter = Math.max(0, (e.runter || 0) - 1);
    if (wert === 1) e.hoch = (e.hoch || 0) + 1;
    if (wert === -1) e.runter = (e.runter || 0) + 1;
    if (wert === 0) delete e.stimmen[geraet]; else e.stimmen[geraet] = wert;

    await brett.sichere(art, e);
    return json({ ok: true, eintrag: oeffentlich(e, geraet) });
  }

  /* ---------------- Lehrkraft ---------------- */
  const s = url.searchParams.get("s") || req.headers.get("x-lehrer") || "";
  const darf = lehrer && gleich(s, lehrer);

  if (pfad === "/" || pfad === "/v1/alle") {
    if (!darf) return new Response("Kein Zugriff.", { status: 401,
      headers: { "content-type": "text/plain; charset=utf-8", ...corsKopf() } });
    const alle = {};
    for (const art of ARTEN) alle[art] = await brett.lies(art);
    if (pfad === "/v1/alle") return json({ ok: true, alle });
    return new Response(seiteBauen(alle), {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }

  if (pfad === "/v1/moderation" && req.method === "POST") {
    if (!darf) return json({ ok: false, grund: "kein-zugriff" }, 401);
    let d; try { d = await req.json(); } catch { return json({ ok: false, grund: "kein-json" }, 400); }
    const art = einzeilig(d.art, 2);
    if (!ARTEN.includes(art)) return json({ ok: false, grund: "brett" }, 400);
    const liste = await brett.lies(art);
    const i = liste.findIndex((x) => x.id === einzeilig(d.id, 32));
    if (i < 0) return json({ ok: false, grund: "unbekannt" }, 404);

    const tat = einzeilig(d.tat, 20);
    if (tat === "loeschen") {
      await brett.entferne(art, liste[i].id);
      return json({ ok: true });
    }
    if (tat === "verbergen") liste[i].sichtbar = false;
    else if (tat === "zeigen") liste[i].sichtbar = true;
    else if (tat === "status") {
      const st = einzeilig(d.status, 20);
      if (STATUS.includes(st)) liste[i].status = st;
      liste[i].notiz = einzeilig(d.notiz, NOTIZ_MAX);
    } else return json({ ok: false, grund: "tat" }, 400);

    await brett.sichere(art, liste[i]);
    return json({ ok: true });
  }

  return json({ ok: false, grund: "unbekannt" }, 404);
}
