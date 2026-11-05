/* ------------------------------------------------------------------
   Service Worker der Sichtung - Meldungen aufs Lehrerhandy.

   Der Dienst schickt einen LEEREN Push (siehe abstimmung/push.mjs). Hier
   wird daraus eine Benachrichtigung: Mit dem Lehrerschluessel, den die
   Sichtung in IndexedDB gelegt hat, fragt der Worker nur Raum und
   „dringend" der juengsten Meldungen ab. Was das Kind geschrieben hat,
   steht nie auf dem Sperrbildschirm - das zeigt erst die Sichtung.

   Ein Tipp auf die Benachrichtigung oeffnet die Sichtung des Raums.
   ------------------------------------------------------------------ */
"use strict";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

function werte(){
  return new Promise(fertig => {
    try {
      const r = indexedDB.open("abstimmung-sichtung", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("werte");
      r.onsuccess = () => {
        const aus = {};
        const tx = r.result.transaction("werte", "readonly");
        const st = tx.objectStore("werte");
        for (const k of ["schluessel", "dienst"]) st.get(k).onsuccess = ev => { aus[k] = ev.target.result; };
        tx.oncomplete = () => fertig(aus);
        tx.onerror = () => fertig({});
      };
      r.onerror = () => fertig({});
    } catch(e){ fertig({}); }
  });
}

async function melden(){
  let raum = "", dringend = false, zahl = 0;
  try {
    const w = await werte();
    if (w.schluessel && w.dienst){
      const a = await fetch(w.dienst + "/v1/push/meldungen",
                            { headers: { "x-lehrer": w.schluessel }, cache: "no-store" });
      const d = await a.json();
      /* Die letzten zwei Minuten zusammenfassen: Kam darin eine dringende,
         heisst die Meldung dringend - auch wenn danach eine normale kam. */
      const jung = (d.meldungen || []).filter(m => Date.now() - m.zeit < 2 * 60 * 1000);
      const erst = jung.find(m => m.dringend) || jung[0] || (d.meldungen || [])[0];
      if (erst){ raum = erst.raum; dringend = !!erst.dringend; }
      zahl = jung.length;
    }
  } catch(e){}
  const ort = raum && raum !== "probe" ? " · " + raum.toUpperCase() : "";
  const titel = raum === "probe" ? "🔔 Probe"
              : (dringend ? "❗ Dringende Mitteilung" : "🔒 Private Mitteilung") + ort;
  const text = raum === "probe" ? "Die Meldungen kommen auf diesem Handy an."
             : (zahl > 1 ? zahl + " Mitteilungen in den letzten Minuten. " : "")
               + "Antippen öffnet die Sichtung.";
  return self.registration.showNotification(titel, {
    body: text, tag: "mitteilung", renotify: true, requireInteraction: dringend,
    vibrate: dringend ? [300, 100, 300, 100, 600] : [200],
    data: { raum: raum === "probe" ? "" : raum },
  });
}

self.addEventListener("push", e => e.waitUntil(melden()));

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const raum = (e.notification.data && e.notification.data.raum) || "";
  const ziel = new URL("sichtung.html" + (raum ? "?raum=" + encodeURIComponent(raum) : ""),
                       self.registration.scope).href;
  e.waitUntil((async () => {
    const offen = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of offen){
      if (c.url.includes("/sichtung.html")){
        try { await c.navigate(ziel); } catch(_){}
        return c.focus();
      }
    }
    return self.clients.openWindow(ziel);
  })());
});
