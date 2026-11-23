/* =====================================================================
   SOKRATES-ENGINE  –  gemeinsam für alle Gespräche.
   Jede Seite definiert vorher ein globales  const DIALOG = {...}
   (Aufbau siehe /sokrates/index.html) und bindet dann diese Datei ein.
   Zusätze gegenüber der ersten Fassung:
     · Hell/Dunkel-Umschalter (localStorage 'sokratesThema'), färbt auch GeoGebra um
     · werte: {stellen, einheit}  ·  zahl-Schritte: {einheit, tausender}
     · DIALOG.heim = {text, href} für den Rücklink im Kopf
     · Aufgabenleiste: In jedem Schritt steht über Sokrates die Aufgabe.
       DIALOG.gegeben = "$d = 1{,}52$ m, $b = 2{,}20$ m" ist die Datenzeile,
       die auch zugeklappt sichtbar bleibt; ein Schritt kann sie mit eigenem
       gegeben:"…" ersetzen (gilt ab dort, etwa für Teil b). Nur gegebene
       Daten eintragen, nie Zwischenergebnisse. Der volle Aufgabentext klappt
       darunter auf; der Zustand steht in localStorage 'sokratesAufgabe'.
     · Notizen (✎): freies Textfeld je Seite, localStorage 'sokratesNotiz:'+Pfad.
     · Auf Touch-Geräten hängen die Tafeln (Rechner, Merkzettel, Notizen)
       oben und folgen dem sichtbaren Ausschnitt, damit die Tastatur sie
       nicht verdeckt.
     · „Ich rechne selbst“: DIALOG.selbst = { text?, richtig?, weiter?:{text,ab},
         fragen:[{text, kurz?, einheit?, loesung, toleranz, tausender?, ab,
                  fehler?:[{wert, toleranz?, hinweis, ab?}]}] }
     · KI-Tutor: DIALOG.ais = { nummer, titel } zeigt im eigenen Weg den Knopf
       „Weg vom KI-Tutor prüfen lassen“. Er kopiert Aufgabe, Weg und Ergebnisse
       und öffnet AIS.chat; den Code nennt die Lehrkraft an der Tafel. nummer
       und titel müssen zur Aufgabenliste im AIS-Lernszenario passen.
       Die Klasse rechnet auf eigenem Weg (Feld „Dein Weg“ = die Notizen)
       und gibt nur Ergebnisse ein. Stimmt alles: Hefteintrag zum Vergleich.
       Sonst Hinweis zum erkannten Fehler und Einstieg ins Gespräch bei
       `ab` (Schritt-id) des ersten falschen Ergebnisses.
     · Rückblick: DIALOG.rueckblick = { titel, frage, schritte:[{kurz, text}],
         einsicht, mitnehmen } zeichnet nach dem letzten Schritt und nach dem
       stimmigen eigenen Weg nach, wie sich der Gedanke entwickelt hat. Er lässt
       sich als Text oder Bild kopieren und auf dem iPad an eine App senden
       (anders als der Hefteintrag, der von Hand abgeschrieben wird).
       Formeln: nur $…$/$$…$$ mit \frac, \sqrt, ^, _, \lim, \text und Zeichen
       aus TEX_ZEICHEN; keine [[Begriffe]], kein {name}.
   ===================================================================== */
(function(){
const PALETTE = {
  dunkel:{gold:"#D4AF37", hellgold:"#F2D27A", creme:"#EDE6D6", matt:"#9A8F78", leucht:"#FFF6D7", kupfer:"#CD7F32", gruen:"#7FB069", rot:"#C0504D", wasser:"#5B8DB8", bg:"#0A0A0C", blink:"#FFF6D7"},
  hell:  {gold:"#A67C12", hellgold:"#B7791F", creme:"#2B2417", matt:"#8A7D62", leucht:"#C2410C", kupfer:"#A0522D", gruen:"#4E8A3A", rot:"#B03A36", wasser:"#3B78B0", bg:"#F6F1E4", blink:"#E4570F"}
};
let thema = document.documentElement.dataset.thema === 'hell' ? 'hell' : 'dunkel';
const F = () => PALETTE[thema];
const DREI = !!(typeof DIALOG !== 'undefined' && DIALOG.geogebra && DIALOG.geogebra.dim3);
let api = null, schritt = -1, zustand = [], gemischt = {}, gruppen = {};
const $ = s => document.querySelector(s);
const hex = c => F()[c] || c || F().creme;
const rgb = h => { h = h.replace('#',''); return [0,2,4].map(i => parseInt(h.substr(i,2),16)); };
let name = null; try { const n = localStorage.getItem('sokratesName'); if (n === 'Thea' || n === 'Theo') name = n; } catch(e){}
const nm = t => String(t).replace(/\{name\}/g, name || 'Theo');
const zahl = (v, st) => { st = (st === undefined ? 2 : st); return Number(v).toLocaleString('de-DE', {minimumFractionDigits:st, maximumFractionDigits:st}); };

/* ---- Text mit Formeln und Begriffen ---- */
function rich(src){
  let s = nm(src).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  s = s.replace(/\[\[(.+?)\|([\w,]+)\]\]([.,;:!?)]*)/g, (m,l,o,p) => `<span style="white-space:nowrap"><span class="begriff" tabindex="0" data-obj="${o}">${l}</span>${p}</span>`);
  return s.split(/\n\s*\n/).map(p => '<p>'+p.replace(/\n/g,'<br>')+'</p>').join('');
}
function formeln(el){
  if (window.renderMathInElement) renderMathInElement(el, {delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}], throwOnError:false});
  el.querySelectorAll('.begriff').forEach(b => {
    b.onclick = () => { if (!b.classList.contains('inaktiv')) blinke(b.dataset.obj.split(',')); };
    b.onkeydown = e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); b.click(); } };
  });
  begriffeAktualisieren(el);
}
function begriffeAktualisieren(root){
  if (!api) return;
  (root||document).querySelectorAll('.begriff').forEach(b => {
    const ok = b.dataset.obj.split(',').every(o => api.exists(o) && api.getVisible(o));
    b.classList.toggle('inaktiv', !ok);
  });
}

/* ---- Sichtbarkeit ---- */
function idx(id){ return DIALOG.schritte.findIndex(s => s.id === id); }
function sichtbareObjekte(){
  const v = new Set(DIALOG.geogebra.sichtbar);
  DIALOG.schritte.forEach((s,i) => {
    if (i <= schritt) (s.zeige||[]).forEach(o => v.add(o));
    if (i < schritt || (i === schritt && zustand[i]==='richtig')) (s.zeigeNachRichtig||[]).forEach(o => v.add(o));
    if (i <= schritt) (s.verberge||[]).forEach(o => v.delete(o));
  });
  return v;
}
function wertAktiv(w){
  if (w.nurGeloest && schritt >= 0){ const sc = DIALOG.schritte[schritt]; if (sc && sc.typ === 'zahl' && zustand[schritt] !== 'richtig') return false; }
  if (w.bis){ const j = idx(w.bis); if (j >= 0 && schritt > j) return false; }   // optional: nur bis zu diesem Schritt
  const i = idx(w.ab); if (i < 0) return schritt >= 0;
  if (schritt > i) return true;
  if (schritt === i) return w.wann !== 'richtig' || zustand[i] === 'richtig';
  return false;
}
function sichtAnwenden(){
  if (!api) return;
  const v = sichtbareObjekte();
  Object.keys(DIALOG.geogebra.stil).concat(DIALOG.geogebra.sichtbar).forEach(o => {
    if (!api.exists(o)) return;
    const an = v.has(o);
    api.setVisible(o, an);
    (gruppen[o]||[]).forEach(t => api.setVisible(t, an));
  });
  if (DREI) punkteAufraeumen();
  begriffeAktualisieren();
  werteZeichnen();
}

/* ---- Messwerte ---- */
let werteGeplant = false;
function werteZeichnen(){
  const box = $('#werte'); if (!box) return;
  const aktiv = (DIALOG.werte||[]).filter(wertAktiv);
  const schluessel = aktiv.map(w => w.objekt).join('|');
  if (box.dataset.k !== schluessel){
    box.dataset.k = schluessel;
    box.innerHTML = aktiv.map(w => `<div class="wert"><span>${w.text}</span><span class="zahl" data-obj="${w.objekt}" data-st="${w.stellen === undefined ? 2 : w.stellen}" data-e="${w.einheit||''}"></span></div>`).join('');
    formeln(box);
  }
  werteAktualisieren();
}
function reglerZeichnen(){
  const box = $('#regler'); if (!box) return;
  const aktiv = (DIALOG.regler||[]).filter(wertAktiv);
  const k = aktiv.map(w => w.objekt).join('|');
  if (box.dataset.k !== k){
    box.dataset.k = k;
    box.innerHTML = aktiv.map(w => `<label class="regel"><span>${w.text}</span><input type="range" min="${w.min}" max="${w.max}" step="${w.schritt||0.01}" data-obj="${w.objekt}"></label>`).join('');
    formeln(box);
    box.querySelectorAll('input').forEach((r,i) => r.oninput = () => { if (!api) return; const w = aktiv[i]; if (w.setze) api.evalCommand(w.setze.replace(/#/g, '(' + parseFloat(r.value) + ')')); else api.setValue(r.dataset.obj, parseFloat(r.value)); koppelZurueck(); });
  }
  if (api) box.querySelectorAll('input').forEach(r => { if (document.activeElement !== r) r.value = api.getValue(r.dataset.obj); });
}
let koppelt = false;
function koppelZurueck(){
  if (!api) return;
  (DIALOG.geogebra.koppeln||[]).forEach(k => {
    koppelt = true;
    try { api.setCoords(k.punkt, api.getValue(k.px), api.getValue(k.py)); } catch(e){}
    koppelt = false;
  });
}
function koppelnEinrichten(){
  (DIALOG.geogebra.koppeln||[]).forEach(k => {
    api.registerObjectUpdateListener(k.punkt, () => {
      if (koppelt) return;
      let v = api.getValue(k.aus);
      if (k.min !== undefined) v = Math.max(k.min, v);
      if (k.max !== undefined) v = Math.min(k.max, v);
      const f = Math.pow(10, k.runden === undefined ? 3 : k.runden);
      api.setValue(k.ziel, Math.round(v * f) / f);
    });
  });
}
function punkteAufraeumen(){
  if (!api) return;
  const st = DIALOG.geogebra.stil;
  api.getAllObjectNames().forEach(o => { if (!st[o] && api.getObjectType(o) === 'point' && api.getVisible(o)) api.setVisible(o, false); });
}
function werteAktualisieren(){
  if (!api) return;
  if (DREI) punkteAufraeumen();
  reglerZeichnen();
  document.querySelectorAll('.wert .zahl').forEach(z => { z.textContent = '= ' + zahl(api.getValue(z.dataset.obj), +z.dataset.st) + (z.dataset.e ? ' ' + z.dataset.e : ''); });
}

/* ---- Farben (auch beim Themenwechsel) ---- */
function stileAnwenden(nurFarbe){
  if (!api) return;
  try { api.setGraphicsOptions(DREI ? 3 : 1, DIALOG.geogebra.achsen ? {bgColor: F().bg, axesColor: F().matt} : {bgColor: F().bg}); } catch(e){}
  const st = DIALOG.geogebra.stil;
  Object.keys(st).forEach(o => {
    if (!api.exists(o)) return;
    const s = st[o], [r,g,b] = rgb(hex(s.farbe));
    [o].concat(gruppen[o]||[]).forEach(t => {
      api.setColor(t, r,g,b);
      if (nurFarbe) return;
      if (s.dicke) api.setLineThickness(t, s.dicke);
      if (s.strich === 'gestrichelt') api.setLineStyle(t, 1);
      if (s.strich === 'gepunktet') api.setLineStyle(t, 3);
    });
    if (nurFarbe) return;
    if (s.punkt) api.setPointSize(o, s.punkt);
    if (s.fuellung !== undefined) api.setFilling(o, s.fuellung);
    if (s.name){ api.setCaption(o, s.name); api.setLabelVisible(o, true); api.setLabelStyle(o, 3); }
  });
}
function themaSetzen(t){
  thema = t === 'hell' ? 'hell' : 'dunkel';
  document.documentElement.dataset.thema = thema;
  try { localStorage.setItem('sokratesThema', thema); } catch(e){}
  const k = $('#thema');
  if (k){ k.textContent = thema === 'hell' ? '☾ Dunkel' : '☀ Hell'; k.title = thema === 'hell' ? 'Zum dunklen Design wechseln' : 'Zum hellen Design wechseln'; }
  blinkend.clear();
  stileAnwenden(true);
}

/* ---- Blinken ---- */
const blinkend = new Set();
function blinke(objs){
  if (!api) return;
  objs.forEach(o => {
    if (!api.exists(o) || blinkend.has(o)) return;
    const st = DIALOG.geogebra.stil[o] || {};
    const ziele = [o].concat(gruppen[o]||[]);
    const alt = ziele.map(t => ({t, dicke:api.getLineThickness(t), punkt:api.getPointSize(t), typ:api.getObjectType(t)}));
    blinkend.add(o);
    let n = 0;
    const tick = () => {
      if (!blinkend.has(o)) return;
      const an = n % 2 === 0;
      alt.forEach(a => {
        const [r,g,b] = rgb(an ? F().blink : hex(st.farbe)); api.setColor(a.t, r,g,b);
        if (an){
          if (a.typ === 'point') api.setPointSize(a.t, Math.min(9, (a.punkt||5)+3));
          else api.setLineThickness(a.t, Math.min(13, (a.dicke||3)+6));
        } else {
          if (a.typ === 'point') api.setPointSize(a.t, a.punkt); else api.setLineThickness(a.t, a.dicke);
        }
      });
      n++;
      if (n < 6) setTimeout(tick, 230); else blinkend.delete(o);
    };
    tick();
  });
}

/* ---- Schreibmaschine ---- */
let gesehen = {}, letzteAntwort = '', tippTimer = null, tippEinheiten = [];
const ruhig = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function einheitenSammeln(el, out){
  [...el.childNodes].forEach(n => {
    if (n.nodeType === 3){
      const teile = n.textContent.split(/(\s+)/);
      if (teile.every(t => !t.trim())) return;
      const frag = document.createDocumentFragment();
      teile.forEach(t => {
        if (!t) return;
        if (!t.trim()) { frag.appendChild(document.createTextNode(t)); return; }
        const sp = document.createElement('span'); sp.className = 'tw'; sp.textContent = t; frag.appendChild(sp); out.push(sp);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1){
      if (n.tagName === 'BR') return;
      if (n.matches('.katex, .katex-display, .begriff')){ n.classList.add('tw'); out.push(n); }
      else einheitenSammeln(n, out);
    }
  });
}
function tippeFertig(){
  clearTimeout(tippTimer); tippTimer = null;
  tippEinheiten.forEach(e => e.classList.add('an')); tippEinheiten = [];
  document.querySelectorAll('#dialog .wartet').forEach(e => e.classList.remove('wartet'));
  const d = $('#dialog'); if (d) d.classList.remove('tippt');
  const so = $('#sofort'); if (so) so.hidden = true;
}
function tippe(elemente){
  clearTimeout(tippTimer); tippEinheiten = [];
  elemente = elemente.filter(Boolean);
  if (!elemente.length || ruhig) return tippeFertig();
  elemente.forEach(el => einheitenSammeln(el, tippEinheiten));
  if (!tippEinheiten.length) return tippeFertig();
  document.querySelectorAll('#dialog .optionen, #dialog .zahlfeld, #dialog .hinweis, #dialog .nav').forEach(e => e.classList.add('wartet'));
  const d = $('#dialog'); d.classList.add('tippt');
  const so = $('#sofort'); so.hidden = false; so.onclick = tippeFertig;
  d.querySelectorAll('.rede, .antwort').forEach(el => el.addEventListener('click', e => { if (d.classList.contains('tippt') && !e.target.closest('.begriff')) tippeFertig(); }));
  let i = 0;
  const takt = () => {
    if (i >= tippEinheiten.length) return tippeFertig();
    const e = tippEinheiten[i++]; e.classList.add('an');
    const laenge = (e.textContent || '').length;
    const pause = e.classList.contains('katex') || e.classList.contains('katex-display') ? 260 : Math.min(240, 55 + laenge * 11) + (/[.?!:]$/.test(e.textContent) ? 260 : /[,;–]$/.test(e.textContent) ? 110 : 0);
    tippTimer = setTimeout(takt, pause * (auto && sprachOK ? 1.25 : 1));
  };
  takt();
}

/* ---- Stimme (Browser) ---- */
const sprachOK = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let auto = false; try { auto = localStorage.getItem('sokratesAuto') === 'an'; } catch(e){}
let stimme = null;
function stimmeWaehlen(){
  if (!sprachOK) return;
  const v = speechSynthesis.getVoices().filter(x => /^de(-|_|$)/i.test(x.lang));
  const bevorzugt = [/conrad/i, /stefan/i, /markus/i, /yannick/i, /florian/i, /killian/i, /male|männl/i, /google deutsch/i, /katja|hedda|anna|petra/i];
  stimme = null;
  for (const r of bevorzugt){ stimme = v.find(x => r.test(x.name)); if (stimme) break; }
  if (!stimme) stimme = v[0] || null;
}
if (sprachOK){ stimmeWaehlen(); speechSynthesis.onvoiceschanged = stimmeWaehlen; }
function texSprache(t){
  return t
    .replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, (m,a,b) => ' ' + (a||b) + ' ')
    .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, ' $1 durch $2 ')
    .replace(/\\sqrt\{([^{}]*)\}/g, ' Wurzel aus $1 ')
    .replace(/\\overrightarrow\{([^}]*)\}/g, (m,a) => ' Vektor ' + a.split('').join(' ') + ' ')
    .replace(/\\vec\s*\{?0\}?/g, ' Nullvektor ')
    .replace(/\\vec\s*\{?([a-zA-Z])\}?/g, ' Vektor $1 ')
    .replace(/_\{\\min\}/g, ' min ').replace(/_\{\\max\}/g, ' max ')
    .replace(/\{,\}/g, ',')
    .replace(/\\pi|π/g, ' pi ')
    .replace(/\\approx/g, ' ungefähr ')
    .replace(/\^\{?\\?,?\s*2\}?/g, ' Quadrat ').replace(/\^\{?3\}?/g, ' hoch drei ')
    .replace(/\\cdot/g, ' mal ').replace(/\\ge/g, ' größer gleich ').replace(/\\le/g, ' kleiner gleich ')
    .replace(/\\(bigl|bigr|left|right|,|;|!|quad)/g, ' ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/([a-zA-Z])\(([^()]*)\)/g, '$1 von $2')
    .replace(/=/g, ' gleich ').replace(/\+/g, ' plus ').replace(/[-−]/g, ' minus ').replace(/:/g, ' geteilt durch ').replace(/\|/g, ' ')
    .replace(/[{}()\[\]]/g, ' ')
    .replace(/([A-Z])(?=[A-Z])/g, '$1 ');
}
function sprechtext(src){
  return nm(src)
    .replace(/\[\[(.+?)\|[\w,]+\]\]/g, '$1')
    .replace(/\$\$([\s\S]+?)\$\$/g, (m,t) => ' ' + texSprache(t) + '. ')
    .replace(/\$([^$]+)\$/g, (m,t) => ' ' + texSprache(t) + ' ')
    .replace(/\bcm³/g, 'Kubikzentimeter').replace(/\bm³/g, 'Kubikmeter').replace(/\bcm²/g, 'Quadratzentimeter').replace(/\bm²/g, 'Quadratmeter')
    .replace(/[–—]/g, ', ')
    .replace(/\s+([.,?!:;])/g, '$1').replace(/([.?!])\.+/g, '$1').replace(/\s+/g, ' ').trim();
}
function stopSprechen(){ if (sprachOK) speechSynthesis.cancel(); const b = $('#vorlesen'); if (b) b.classList.remove('an'); }
function sprich(text){
  if (!sprachOK || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE'; if (stimme) u.voice = stimme;
  u.rate = 0.95; u.pitch = 0.9;
  const b = $('#vorlesen');
  u.onstart = () => { if (b) { b.classList.add('an'); b.textContent = '■ Anhalten'; } };
  u.onend = u.onerror = () => { const bb = $('#vorlesen'); if (bb) { bb.classList.remove('an'); bb.textContent = '🔊 Vorlesen'; } };
  speechSynthesis.speak(u);
}
function sprachKnoepfe(s, antwortQuelle){
  const v = $('#vorlesen'), a = $('#auto');
  if (!sprachOK || !v) return;
  v.hidden = false; a.hidden = false;
  v.onclick = () => {
    if (speechSynthesis.speaking){ stopSprechen(); v.textContent = '🔊 Vorlesen'; return; }
    sprich(sprechtext(s.text) + ' ' + sprechtext(antwortQuelle || ''));
  };
  a.onclick = () => {
    auto = !auto; try { localStorage.setItem('sokratesAuto', auto ? 'an' : 'aus'); } catch(e){}
    a.classList.toggle('an', auto); a.textContent = 'automatisch: ' + (auto ? 'an' : 'aus');
    if (!auto) stopSprechen();
  };
}

/* ---- Ablauf ---- */
function mische(arr, seed){
  const a = arr.map((x,i)=>({x,i})); let s = seed*9301+49297;
  for (let i=a.length-1;i>0;i--){ s=(s*9301+49297)%233280; const j=Math.floor(s/233280*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function zeigeStart(){
  schritt = -1; imRueckblick = false; try{ stopSprechen(); tippeFertig(); }catch(e){}
  $('#fortschritt').textContent = '';
  $('#dialog').innerHTML = `
    <div class="karte">
      <div class="sprecher">Die Aufgabe</div>
      <div class="aufgabe rede">${rich(DIALOG.aufgabe)}</div>
      ${DIALOG.vorwissen && DIALOG.vorwissen.length ? `<h2>Was du dafür brauchst</h2><ul>${DIALOG.vorwissen.map(v => '<li>'+rich(v).replace(/^<p>|<\/p>$/g,'')+'</li>').join('')}</ul>` : ''}
      ${/\{name\}/.test(DIALOG.schueler) ? `<h2>Wer bist du?</h2><div class="namenwahl" role="radiogroup" aria-label="Wer bist du?">${['Thea','Theo'].map(n => `<label class="name${name===n?' an':''}"><input type="radio" name="wer" value="${n}"${name===n?' checked':''}> ${n}</label>`).join('')}</div>` : ''}
      <div class="startwahl">
        <div class="startweg"><button class="start" id="los"${/\{name\}/.test(DIALOG.schueler) && !name ? ' disabled' : ''}>Gespräch beginnen ▸</button>
          <div class="tipp">Schritt für Schritt mit Sokrates.</div></div>
        ${selbstAktiv() ? `<div class="startweg"><button class="start start2" id="selbstlos"${/\{name\}/.test(DIALOG.schueler) && !name ? ' disabled' : ''}>Ich rechne selbst ▸</button>
          <div class="tipp">Du rechnest auf deinem Weg und gibst nur die Ergebnisse ein. Sokrates sagt dir, was stimmt – und wo es hakt, steigt ihr gemeinsam ein.</div></div>` : ''}
      </div>
      <div class="tipp">Unterstrichene Begriffe im Gespräch kannst du antippen – das Element leuchtet dann in der Zeichnung auf.</div>
    </div>`;
  formeln($('#dialog'));
  document.querySelectorAll('.namenwahl input').forEach(r => r.onchange = () => {
    name = r.value; try { localStorage.setItem('sokratesName', name); } catch(e){}
    document.querySelectorAll('.namenwahl .name').forEach(l => l.classList.toggle('an', l.contains(r)));
    $('#los').disabled = false;
    if ($('#selbstlos')) $('#selbstlos').disabled = false;
  });
  $('#los').onclick = () => geheZu(0);
  if ($('#selbstlos')) $('#selbstlos').onclick = () => zeigeSelbst();
  if (api && !DREI){ letzteSicht = JSON.stringify(aktuelleSicht()); sichtEinpassen(); }
  sichtAnwenden();
}
/* ---- Aufgabenleiste: die Daten bleiben im Blick ---- */
const inline = t => rich(t).replace(/^<p>|<\/p>$/g,'');
function aktuellGegeben(){
  for (let i = Math.min(schritt, DIALOG.schritte.length-1); i >= 0; i--) if (DIALOG.schritte[i].gegeben) return DIALOG.schritte[i].gegeben;
  return DIALOG.gegeben || '';
}
function aufgabeOffen(){
  let z = null; try { z = localStorage.getItem('sokratesAufgabe'); } catch(e){}
  if (z === 'auf') return true; if (z === 'zu') return false;
  return !aktuellGegeben();   // ohne Datenzeile zunächst offen, sonst genügt die Zeile
}
function aufgabenleiste(){
  if (!DIALOG.aufgabe) return '';
  const g = aktuellGegeben();
  return `<details class="aufgabenleiste" id="aufgabenleiste"${aufgabeOffen() ? ' open' : ''}>
      <summary><span class="al-kopf">Aufgabe</span>${g ? `<span class="al-gegeben">${inline(g)}</span>` : '<span class="al-gegeben al-leer">Aufgabentext</span>'}<span class="al-schalter"></span></summary>
      <div class="al-text">${rich(DIALOG.aufgabe)}</div>
    </details>`;
}
function aufgabenleisteVerdrahten(){
  const d = $('#aufgabenleiste'); if (!d) return;
  d.addEventListener('toggle', () => { try { localStorage.setItem('sokratesAufgabe', d.open ? 'auf' : 'zu'); } catch(e){} });
}

/* ---- Notizen: ein freies Feld je Seite, auch als „Dein Weg“ ---- */
const notizSchluessel = () => 'sokratesNotiz:' + location.pathname;
function notizLesen(){ try { return localStorage.getItem(notizSchluessel()) || ''; } catch(e){ return ''; } }
function notizVerdrahten(root){
  (root || document).querySelectorAll('textarea.notiz').forEach(a => {
    if (document.activeElement !== a) a.value = notizLesen();
    a.oninput = () => {
      try { localStorage.setItem(notizSchluessel(), a.value); } catch(e){}
      document.querySelectorAll('textarea.notiz').forEach(b => { if (b !== a) b.value = a.value; });
    };
  });
}

/* ---- Zahlen lesen (Komma, Minus, Tausenderpunkte) ---- */
function zahlAus(roh, tausender){
  roh = String(roh || '').trim().replace(/\s/g,'').replace(/−/g,'-');   // \s deckt auch geschützte Leerzeichen ab
  if (tausender) roh = roh.replace(/\.(?=\d{3}(\D|$))/g, '');
  roh = roh.replace(',', '.');
  const v = parseFloat(roh);
  return (roh === '' || isNaN(v)) ? null : v;
}
const gesagtText = v => v.toLocaleString('de-DE', {maximumFractionDigits:6}).replace('-','−');
let letztesFeld = null;
document.addEventListener('focusin', e => { if (e.target.matches && e.target.matches('#eingabe, .seingabe')) letztesFeld = e.target; });

/* ---- „Ich rechne selbst“: ganzer Weg, Rückmeldung auf die Ergebnisse ---- */
let selbstWerte = {}, selbstStand = null;
function selbstAktiv(){ return !!(DIALOG.selbst && DIALOG.selbst.fragen && DIALOG.selbst.fragen.length); }
function selbstPruefen(){
  document.querySelectorAll('.seingabe').forEach(e => { selbstWerte[+e.dataset.i] = e.value; });
  selbstStand = DIALOG.selbst.fragen.map((f,i) => {
    const v = zahlAus(selbstWerte[i], f.tausender);
    if (v === null) return {ok:false, leer:true, ab:f.ab};
    const tol = f.toleranz || 1e-9;
    if (Math.abs(v - f.loesung) <= tol) return {ok:true, v};
    const fe = (f.fehler || []).find(x => Math.abs(v - x.wert) <= (x.toleranz === undefined ? tol : x.toleranz));
    return {ok:false, v, hinweis: fe ? fe.hinweis : (f.falsch || 'Das stimmt noch nicht. Prüfe deinen Weg an dieser Stelle.'), ab: (fe && fe.ab) || f.ab};
  });
  zeigeSelbst(true);
}
function einsteigen(id){
  let k = idx(id); if (k < 0) k = 0;
  zustand = []; gemischt = {}; gesehen = {}; letzteAntwort = '';
  startwerte();
  for (let j = 0; j < k; j++){
    const s = DIALOG.schritte[j]; zustand[j] = 'richtig';
    (s.beimStart || []).forEach(c => api && api.evalCommand(c));
    (s.nachRichtig || []).forEach(c => api && api.evalCommand(c));
  }
  koppelZurueck();
  geheZu(k);
}
// KI-Tutor in AIS.chat: Aufgabe und eigenen Weg in die Zwischenablage, dann AIS.chat öffnen.
// Den Beitrittscode der Stunde zeigt die Lehrkraft an der Tafel; die Seite schickt nichts selbst.
const AIS_ADRESSE = 'https://app.ais-chat.schule/';
function aisText(){
  const A = DIALOG.ais, weg = (($('#wegfeld') || {}).value || '').trim();
  const erg = DIALOG.selbst.fragen.map((f,i) => {
    const w = String(selbstWerte[i] || '').trim();
    return w ? `- ${(f.kurz || f.text).replace(/\$/g,'')}: ${w}${f.einheit ? ' ' + f.einheit.replace(/\$/g,'') : ''}` : '';
  }).filter(Boolean).join('\n');
  return `Aufgabe ${A.nummer} (${A.titel}). Mein Weg:\n${weg}${erg ? '\n\nMeine Ergebnisse:\n' + erg : ''}`;
}
function aisOeffnen(){
  const info = $('#aisinfo'), feld = $('#wegfeld');
  if (!feld || !feld.value.trim()){
    info.hidden = false;
    info.innerHTML = 'Schreib zuerst deinen Weg ins Feld „Dein Weg“. Den schickst du dann dem KI-Tutor.';
    if (feld) feld.focus();
    return;
  }
  const text = aisText();
  let kopiert = false;
  try { if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).catch(() => {}); kopiert = true; } } catch(e){}
  window.open(AIS_ADRESSE, '_blank', 'noopener');
  info.hidden = false;
  info.innerHTML = `<ol><li>Gib auf AIS.chat den <b>Code von der Tafel</b> ein und tippe auf „Zum Dialog“.</li>`
    + `<li>Füge deinen Weg ins Chatfeld ein${kopiert ? ' – er ist schon kopiert (lange tippen → <b>Einsetzen</b>)' : ''} und schick ihn ab.</li>`
    + `<li>Gib dort keinen Namen ein.</li></ol>`
    + `<details${kopiert ? '' : ' open'}><summary>Text zum Kopieren</summary><textarea class="ais-text" readonly rows="5"></textarea></details>`;
  const ta = info.querySelector('.ais-text'); ta.value = text;
  ta.onfocus = () => ta.select();
}
function zeigeSelbst(neuGeprueft){
  schritt = -2; imRueckblick = false; try { stopSprechen(); tippeFertig(); } catch(e){}
  const S = DIALOG.selbst, st = selbstStand;
  const alle = !!(st && st.every(x => x.ok));
  $('#fortschritt').textContent = 'Eigener Weg';
  let rede;
  if (!st) rede = S.text || 'Gut, {name}. Dann gehe deinen eigenen Weg. Schreib ihn hier auf oder in dein Heft und gib mir deine Ergebnisse. Ich sage dir, was stimmt. Wo es hakt, gehen wir es gemeinsam durch.';
  else if (alle) rede = (S.richtig || 'Vortrefflich, {name}. Alle Ergebnisse stimmen.') + '\n\nVergleiche deinen Weg mit dem Hefteintrag. Fehlt dir ein Schritt, oder hast du einen anderen Weg gefunden?';
  else rede = st.some(x => x.ok) ? 'Ein Teil stimmt schon, {name}. Sieh dir die anderen noch einmal an.' : 'Noch stimmt es nicht, {name}. Sieh dir deinen Weg noch einmal an.';
  let antwort = '';
  if (st && !alle) antwort = S.fragen.map((f,i) => {
    const r = st[i]; if (r.ok) return '';
    const kopf = `<b>${inline(f.kurz || f.text)}</b>`;
    if (r.leer) return `<p>${kopf}: Hier fehlt noch dein Ergebnis.</p>`;
    return `<p>${kopf}: Du sagst <span class="zitat">${gesagtText(r.v)}${f.einheit ? ' ' + inline(f.einheit) : ''}</span>?</p>${rich(r.hinweis)}`;
  }).join('');
  const zeilen = S.fragen.map((f,i) => {
    const r = st ? st[i] : null, ok = !!(r && r.ok);
    const wert = String(selbstWerte[i] || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
    return `<div class="sfrage${r ? (ok ? ' ok' : ' nein') : ''}">
        <div class="sf-text">${inline(f.text)}</div>
        <div class="zahlfeld"><input class="seingabe" data-i="${i}" inputmode="decimal" autocomplete="off" placeholder="Zahl" value="${wert}"${ok ? ' readonly' : ''}>${f.einheit ? `<span class="einheit">${inline(f.einheit)}</span>` : ''}${r ? `<span class="smarke">${ok ? '✓' : '✗'}</span>` : ''}</div>
      </div>`;
  }).join('');
  const ersterFehler = st && !alle ? st.find(x => !x.ok) : null;
  $('#dialog').innerHTML = `
    ${aufgabenleiste()}
    <div class="sprecherzeile"><div class="sprecher">${DIALOG.lehrer}</div></div>
    <div class="rede">${rich(rede)}</div>
    <div class="antwort">${antwort}</div>
    ${alle && DIALOG.hefteintrag ? `<div class="heft" id="heft"><div class="heft-kopf"><span>Hefteintrag</span><span class="heft-hinweis">Vergleiche ihn mit deinem Weg.</span></div>${rich(DIALOG.hefteintrag)}</div>` : ''}
    <div class="schueler">
      <div class="sprecher">${nm(DIALOG.schueler)}</div>
      <div class="weg-kopf">Dein Weg <span class="weg-hinweis">bleibt auf diesem Gerät gespeichert, auch unter ✎ Notizen</span></div>
      <textarea class="notiz weg" id="wegfeld" rows="6" placeholder="Schreib hier deinen Rechenweg auf – Ansatz, Formel, Zwischenergebnisse …"></textarea>
      ${DIALOG.ais ? `<div class="ais-kasten"><button class="ais-knopf" id="aisknopf">Weg vom KI-Tutor prüfen lassen ▸</button><span class="ais-hinweis">AIS.chat – den Code bekommst du an der Tafel</span><div class="ais-info" id="aisinfo" hidden></div></div>` : ''}
      <div class="sfragen">${zeilen}</div>
      <div class="nav">
        <button class="zurueck" id="zurueck">◂ Aufgabe</button>
        ${alle ? `<button class="weiter" id="mitsokrates">Mit Sokrates durchgehen</button>${S.weiter ? `<button class="weiter" id="selbstweiter">${inline(S.weiter.text)} ▸</button>` : ''}${rueckblickAktiv() ? '<button class="weiter" id="selbstrueckblick">Rückblick ▸</button>' : ''}`
               : `<button class="weiter" id="spruefen">Prüfen</button>${ersterFehler ? '<button class="zurueck" id="einstieg">Mit Sokrates an dieser Stelle weiter ▸</button>' : ''}`}
      </div>
    </div>`;
  sichtAnwenden();
  formeln($('#dialog'));
  aufgabenleisteVerdrahten();
  notizVerdrahten($('#dialog'));
  const heft = $('#heft');
  if (heft) ['copy','cut','contextmenu','selectstart','dragstart'].forEach(ev => heft.addEventListener(ev, e => e.preventDefault()));
  document.querySelectorAll('.seingabe').forEach(e => {
    e.oninput = () => { selbstWerte[+e.dataset.i] = e.value; };
    e.onkeydown = ev => { if (ev.key === 'Enter') selbstPruefen(); };
  });
  $('#zurueck').onclick = () => zeigeStart();
  if ($('#spruefen')) $('#spruefen').onclick = selbstPruefen;
  if ($('#einstieg')) $('#einstieg').onclick = () => einsteigen(ersterFehler.ab);
  if ($('#mitsokrates')) $('#mitsokrates').onclick = () => einsteigen(DIALOG.schritte[0].id);
  if ($('#selbstweiter')) $('#selbstweiter').onclick = () => einsteigen(S.weiter.ab);
  if ($('#selbstrueckblick')) $('#selbstrueckblick').onclick = () => zeigeRueckblick('selbst');
  if ($('#aisknopf')) $('#aisknopf').onclick = aisOeffnen;
  if (neuGeprueft){ const a = $('#dialog .antwort'); if (a && a.textContent.trim()) a.scrollIntoView({block:'nearest', behavior:'smooth'}); else if (heft) heft.scrollIntoView({block:'nearest', behavior:'smooth'}); }
}
/* ---- Rückblick: Wie hat sich der Gedanke entwickelt? ---- */
let imRueckblick = false, rueckblickVon = 'gespraech', rbBildVersprechen = null, rbBlob = null;
function rueckblickAktiv(){ const R = DIALOG.rueckblick; return !!(R && R.titel && R.einsicht && R.schritte && R.schritte.length); }
const TEX_ZEICHEN = {pi:'π',cdot:'·',approx:'≈',to:'→',rightarrow:'→',Rightarrow:'⇒',Delta:'Δ',alpha:'α',beta:'β',gamma:'γ',ge:'≥',geq:'≥',le:'≤',leq:'≤',ne:'≠',neq:'≠',times:'×',pm:'±',infty:'∞',quad:' ',qquad:'  ',';':' ',',':' ','!':'','%':'%'};
const TEX_OP = '=+−≈·:→⇒≤≥≠×±';
function texBaum(q){
  let i = 0;
  const leer = () => { while (q[i] === ' ' || q[i] === '\n') i++; };
  const arg = () => { leer(); if (q[i] === '{'){ i++; const n = folge('}'); i++; return n; } return eins(); };
  const roh = () => { leer(); if (q[i] !== '{') return q[i++] || ''; const a = ++i; let t = 1; while (i < q.length && t){ if (q[i] === '{') t++; else if (q[i] === '}') t--; i++; } return q.slice(a, i-1); };
  const zeichen = z => [TEX_OP.includes(z) ? {t:'op', s:z} : {t:'zeichen', s:z}];
  function befehl(){
    i++;
    let w = '';
    if (/[a-zA-Z]/.test(q[i] || '')) while (/[a-zA-Z]/.test(q[i] || '')) w += q[i++]; else w = q[i++] || '';
    if (/^[dt]?frac$/.test(w)){ const a = arg(), b = arg(); return [{t:'bruch', a, b}]; }
    if (w === 'sqrt') return [{t:'wurzel', a:arg()}];
    if (w === 'text' || w === 'mathrm') return [{t:'wort', s:roh()}];
    if (w === 'lim'){ leer(); let u = []; if (q[i] === '_'){ i++; u = arg(); } return [{t:'lim', u}]; }
    if (/^(left|right|bigl|bigr|big|displaystyle)$/.test(w)) return [];
    if (w in TEX_ZEICHEN) return TEX_ZEICHEN[w] ? zeichen(TEX_ZEICHEN[w]) : [];
    return [{t:'unbekannt', s:'\\' + w}];
  }
  function eins(){
    leer();
    const c = q[i];
    if (c === undefined) return [];
    if (c === '\\') return befehl();
    if (c === '{'){ i++; const n = folge('}'); i++; return n; }
    i++;
    return zeichen(c === '-' ? '−' : c);
  }
  function folge(ende){
    const n = [];
    while (i < q.length && q[i] !== ende){
      leer(); if (i >= q.length || q[i] === ende) break;
      if (q[i] === '^' || q[i] === '_'){ const t = q[i++] === '^' ? 'hoch' : 'tief'; n.push({t, a:arg()}); continue; }
      n.push(...eins());
    }
    return n;
  }
  return folge();
}
const RB_HOCH = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','−':'⁻','+':'⁺',n:'ⁿ'};
const RB_TIEF = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',a:'ₐ',e:'ₑ',h:'ₕ',i:'ᵢ',k:'ₖ',m:'ₘ',n:'ₙ',p:'ₚ',r:'ᵣ',s:'ₛ',t:'ₜ',x:'ₓ'};
function texKlar(ns){
  let o = '';
  const klammer = t => /[ +−·]/.test(t) ? '(' + t + ')' : t;
  ns.forEach(n => {
    if (n.t === 'op'){ const vorz = /[+−]/.test(n.s) && (!o.trim() || /[=+−≈·→(\[]\s*$/.test(o)); o += vorz ? n.s : ' ' + n.s + ' '; }
    else if (n.t === 'zeichen' || n.t === 'wort' || n.t === 'unbekannt') o += n.s;
    else if (n.t === 'bruch') o += klammer(texKlar(n.a).trim()) + '/' + klammer(texKlar(n.b).trim());
    else if (n.t === 'wurzel'){ const a = texKlar(n.a).trim(); o += '√' + (a.length > 1 ? '(' + a + ')' : a); }
    else if (n.t === 'lim') o += 'lim ' + texKlar(n.u).replace(/\s/g,'') + ' ';
    else if (n.t === 'hoch' || n.t === 'tief'){
      const a = texKlar(n.a).replace(/\s/g,''), karte = n.t === 'hoch' ? RB_HOCH : RB_TIEF;
      o += [...a].every(c => karte[c]) ? [...a].map(c => karte[c]).join('') : (n.t === 'hoch' ? '^' : '_') + (a.length > 1 ? '(' + a + ')' : a);
    }
  });
  return o;
}
const rbKlar = t => nm(t)
  .replace(/\$\$([\s\S]+?)\$\$/g, (m,f) => '\n' + texKlar(texBaum(f)).trim() + '\n')
  .replace(/\$([^$]+)\$/g, (m,f) => texKlar(texBaum(f)).trim())
  .replace(/[ \t]*\n[ \t]*/g, '\n').replace(/\n{2,}/g, '\n').trim();
const rbAufgabe = () => String(DIALOG.titel || '').replace(/\s*[–-]\s*ein Gespräch mit Sokrates\s*$/i, '');
const rbKlasse = () => String((DIALOG.heim || {}).text || '').replace(/[^\wäöüÄÖÜ ]/g, '').trim();
const rbHerkunft = () => [rbKlasse(), rbAufgabe()].filter(Boolean).join(' · ');
const rbAdresse = () => location.host + location.pathname;
function rueckblickText(){
  const R = DIALOG.rueckblick;
  return [`RÜCKBLICK · ${rbHerkunft()}`, rbKlar(R.titel), '', 'Die Frage', rbKlar(R.frage), '',
    'So hat sich der Gedanke entwickelt', ...R.schritte.map((s,i) => `${i+1}. ${rbKlar(s.kurz)}: ${rbKlar(s.text)}`), '',
    'Die Einsicht', rbKlar(R.einsicht), ...(R.mitnehmen ? ['', 'Das nehme ich mit', rbKlar(R.mitnehmen)] : []), '',
    `Gespräch mit Sokrates · ${rbAdresse()}`].join('\n');
}
function rueckblickHtml(){
  const R = DIALOG.rueckblick;
  const e = t => rbKlar(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  return `<h2>${e(R.titel)}</h2><p><i>Rückblick · ${e(rbHerkunft())}</i></p>`
    + `<p><b>Die Frage</b><br>${e(R.frage)}</p><p><b>So hat sich der Gedanke entwickelt</b></p>`
    + `<ol>${R.schritte.map(s => `<li><b>${e(s.kurz)}:</b> ${e(s.text)}</li>`).join('')}</ol>`
    + `<p><b>Die Einsicht</b><br>${e(R.einsicht)}</p>`
    + (R.mitnehmen ? `<p><b>Das nehme ich mit</b><br>${e(R.mitnehmen)}</p>` : '')
    + `<p><small>Gespräch mit Sokrates · ${e(rbAdresse())}</small></p>`;
}
/* Das Bild wird selbst gezeichnet: Papierfarbe in beiden Themen, echte Brüche und Wurzeln. */
const RB_F = {papier:'#FBF7EC', tinte:'#2B2417', gold:'#A67C12', matt:'#76694F', linie:'#DCCFAE', flaeche:'#F3EAD2'};
const RB_MATHE = '"Times New Roman","Liberation Serif",Times,serif', RB_TEXT = '"Source Sans 3","Segoe UI",Helvetica,Arial,sans-serif', RB_KOPF = '"Cormorant Garamond",Georgia,serif';
function rbText(ctx, s, schrift){ ctx.font = schrift; const b = ctx.measureText(s).width; const gr = parseFloat(schrift.match(/([\d.]+)px/)[1]); return {b, o:gr*.76, u:gr*.24, mal(x,y){ ctx.font = schrift; ctx.fillText(s, x, y); }}; }
function rbReihe(teile){
  let x = 0, o = 0, u = 0;
  const lage = teile.map(t => { const d = x; x += t.b; o = Math.max(o, t.o); u = Math.max(u, t.u); return d; });
  return {b:x, o, u, mal(X,Y){ teile.forEach((t,i) => t.mal(X + lage[i], Y)); }};
}
function rbMathe(ctx, ns, gr){
  const teile = []; let hatLinks = false, letztes = '';
  const luft = b => ({b, o:0, u:0, mal(){}});
  ns.forEach(n => {
    if (n.t === 'op'){
      const vorz = /[+−]/.test(n.s) && (!hatLinks || letztes === 'op' || letztes === '(');
      const box = rbText(ctx, n.s, `${gr}px ${RB_MATHE}`);
      teile.push(...(vorz ? [box] : [luft(gr*.26), box, luft(gr*.26)]));
      letztes = 'op'; hatLinks = true; return;
    }
    hatLinks = true; letztes = n.t === 'zeichen' ? n.s : n.t;
    if (n.t === 'zeichen'){
      if (n.s === ' ' || n.s === ' ') return teile.push(luft(gr * (n.s === ' ' ? .5 : .18)));
      teile.push(rbText(ctx, n.s, `${/[a-zA-Zα-ω]/.test(n.s) ? 'italic ' : ''}${gr}px ${RB_MATHE}`));
    } else if (n.t === 'wort' || n.t === 'unbekannt') teile.push(rbText(ctx, n.s, `${gr}px ${RB_MATHE}`));
    else if (n.t === 'bruch'){
      const A = rbMathe(ctx, n.a, gr*.8), B = rbMathe(ctx, n.b, gr*.8), b = Math.max(A.b, B.b) + gr*.3, achse = gr*.3, luecke = gr*.13;
      teile.push(luft(gr*.08), {b, o:achse + luecke + A.u + A.o, u:luecke + B.o + B.u - achse, mal(X,Y){
        A.mal(X + (b-A.b)/2, Y - achse - luecke - A.u); B.mal(X + (b-B.b)/2, Y - achse + luecke + B.o);
        ctx.fillRect(X, Y - achse - gr*.025, b, Math.max(1.5, gr*.05)); }}, luft(gr*.08));
    } else if (n.t === 'wurzel'){
      const A = rbMathe(ctx, n.a, gr), h = gr*.62, kopf = A.o + gr*.14;
      teile.push({b:h + A.b + gr*.08, o:kopf + gr*.06, u:A.u + gr*.04, mal(X,Y){
        ctx.save(); ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1.5, gr*.05); ctx.lineJoin = 'round'; ctx.beginPath();
        ctx.moveTo(X + gr*.04, Y - gr*.26); ctx.lineTo(X + gr*.16, Y - gr*.32); ctx.lineTo(X + gr*.32, Y + A.u); ctx.lineTo(X + h - gr*.06, Y - kopf); ctx.lineTo(X + h + A.b + gr*.06, Y - kopf); ctx.stroke(); ctx.restore();
        A.mal(X + h, Y); }});
    } else if (n.t === 'hoch' || n.t === 'tief'){
      const A = rbMathe(ctx, n.a, gr*.68), weg = n.t === 'hoch' ? -gr*.42 : gr*.22;
      teile.push({b:A.b + gr*.04, o:Math.max(0, A.o - weg), u:Math.max(0, A.u + weg), mal(X,Y){ A.mal(X + gr*.02, Y + weg); }});
    } else if (n.t === 'lim'){
      const L = rbText(ctx, 'lim', `${gr}px ${RB_MATHE}`), U = rbMathe(ctx, n.u, gr*.62), b = Math.max(L.b, U.b), tiefe = gr*.24 + U.o;
      teile.push({b:b + gr*.22, o:L.o, u:tiefe + U.u, mal(X,Y){ L.mal(X + (b-L.b)/2, Y); U.mal(X + (b-U.b)/2, Y + tiefe); }});
    }
  });
  return rbReihe(teile);
}
// Fließtext mit Formeln umbrechen; gibt die neue y-Lage zurück.
function rbAbsatz(ctx, q, x, y, breite, st, mal){
  const gr = st.gr, schrift = `${st.schnitt || ''} ${gr}px ${st.familie || RB_TEXT}`.trim();
  const zeilen = []; let gruppen = [], gruppe = [];
  const schliesse = () => { if (gruppe.length){ gruppen.push(rbReihe(gruppe)); gruppe = []; } };
  const absatz = () => { schliesse(); if (gruppen.length) zeilen.push(...rbUmbruch(gruppen, breite, ctx, schrift)); gruppen = []; };
  nm(q).split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/).forEach(t => {
    if (!t) return;
    if (t.startsWith('$$')){ absatz(); zeilen.push({mitte:true, box:rbMathe(ctx, texBaum(t.slice(2,-2)), gr*1.3)}); return; }
    if (t.startsWith('$')){ gruppe.push(rbMathe(ctx, texBaum(t.slice(1,-1)), gr*1.04)); return; }
    t.split(/(\s+)/).forEach(w => { if (!w) return; if (!w.trim()){ schliesse(); if (/\n/.test(w)) absatz(); } else gruppe.push(rbText(ctx, w, schrift)); });
  });
  absatz();
  ctx.fillStyle = st.farbe || RB_F.tinte;
  zeilen.forEach(z => {
    const o = Math.max(z.box.o, gr*.82), u = Math.max(z.box.u, gr*.34), extra = z.mitte ? gr*.42 : 0;
    if (mal) z.box.mal(z.mitte ? x + (breite - z.box.b)/2 : x, y + extra + o);
    y += o + u + extra*2 + (st.abstand === undefined ? gr*.16 : st.abstand);
  });
  return y;
}
function rbUmbruch(gruppen, breite, ctx, schrift){
  ctx.font = schrift;
  const raum = ctx.measureText(' ').width, zeilen = []; let z = [], b = 0;
  const luft = {b:raum, o:0, u:0, mal(){}};
  gruppen.forEach(g => {
    if (z.length && b + raum + g.b > breite){ zeilen.push({box:rbReihe(z)}); z = []; b = 0; }
    if (z.length){ z.push(luft); b += raum; }
    z.push(g); b += g.b;
  });
  if (z.length) zeilen.push({box:rbReihe(z)});
  return zeilen;
}
function rbKarte(ctx, W, mal){
  const R = DIALOG.rueckblick, M = 76, B = W - 2*M;
  if (mal){ ctx.fillStyle = RB_F.papier; ctx.fillRect(0, 0, W, ctx.canvas.height); ctx.fillStyle = RB_F.gold; ctx.fillRect(0, 0, W, 12); }
  let y = 58;
  ctx.textBaseline = 'alphabetic';
  if (mal){ ctx.fillStyle = RB_F.gold; ctx.font = `700 26px ${RB_TEXT}`; if ('letterSpacing' in ctx) ctx.letterSpacing = '4px'; ctx.fillText('RÜCKBLICK', M, y + 22); if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    ctx.fillStyle = RB_F.matt; ctx.font = `26px ${RB_TEXT}`; const h = rbHerkunft(); ctx.fillText(h, W - M - ctx.measureText(h).width, y + 22); }
  y += 44;
  y = rbAbsatz(ctx, R.titel, M, y, B, {gr:64, schnitt:'700', familie:RB_KOPF, farbe:RB_F.gold, abstand:0}, mal) + 18;
  const fh = rbAbsatz(ctx, R.frage, M + 28, y + 50, B - 28, {gr:32, schnitt:'italic'}, false) - y;
  if (mal){ ctx.fillStyle = RB_F.gold; ctx.fillRect(M, y, 5, fh); ctx.font = `700 24px ${RB_TEXT}`; ctx.fillText('Die Frage', M + 28, y + 28); rbAbsatz(ctx, R.frage, M + 28, y + 40, B - 28, {gr:32, schnitt:'italic'}, true); }
  y += fh + 26;
  if (mal){ ctx.fillStyle = RB_F.tinte; ctx.font = `700 42px ${RB_KOPF}`; ctx.fillText('So hat sich der Gedanke entwickelt', M, y + 38); }
  y += 66;
  const links = M + 72, TB = B - 72, n = R.schritte.length;
  R.schritte.forEach((s,i) => {
    const y0 = y, yK = rbAbsatz(ctx, s.kurz, links, y, TB, {gr:32, schnitt:'700', farbe:RB_F.gold, abstand:0}, mal);
    const y1 = rbAbsatz(ctx, s.text, links, yK, TB, {gr:32}, mal) + 20;
    if (mal){
      const cx = M + 26, cy = y0 + 28;
      if (i < n-1){ ctx.fillStyle = RB_F.linie; ctx.fillRect(cx - 1.5, cy, 3, y1 - y0); }
      ctx.fillStyle = RB_F.gold; ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = RB_F.papier; ctx.font = `700 29px ${RB_TEXT}`; const z = String(i+1); ctx.fillText(z, cx - ctx.measureText(z).width/2, cy + 10);
    }
    y = y1;
  });
  y += 8;
  const eH = rbAbsatz(ctx, R.einsicht, M + 30, y + 62, B - 60, {gr:34, schnitt:'600'}, false) - y + 12;
  if (mal){
    ctx.fillStyle = RB_F.flaeche; ctx.fillRect(M, y, B, eH); ctx.strokeStyle = RB_F.gold; ctx.lineWidth = 2.5; ctx.strokeRect(M, y, B, eH);
    ctx.fillStyle = RB_F.gold; ctx.font = `700 34px ${RB_KOPF}`; ctx.fillText('Die Einsicht', M + 30, y + 42);
    rbAbsatz(ctx, R.einsicht, M + 30, y + 62, B - 60, {gr:34, schnitt:'600'}, true);
  }
  y += eH + 28;
  if (R.mitnehmen){
    if (mal){ ctx.fillStyle = RB_F.gold; ctx.font = `700 34px ${RB_KOPF}`; ctx.fillText('Das nehme ich mit', M, y + 30); }
    y = rbAbsatz(ctx, R.mitnehmen, M, y + 44, B, {gr:32}, mal) + 16;
  }
  if (mal){ ctx.fillStyle = RB_F.linie; ctx.fillRect(M, y, B, 2); ctx.fillStyle = RB_F.matt; ctx.font = `22px ${RB_TEXT}`; ctx.fillText(`Gespräch mit Sokrates · ${rbAdresse()}`, M, y + 36); }
  return y + 66;
}
function rueckblickBild(){
  if (rbBildVersprechen) return rbBildVersprechen;
  const schriften = document.fonts && document.fonts.load
    ? Promise.race([Promise.all(['700 64px "Cormorant Garamond"','400 32px "Source Sans 3"','600 32px "Source Sans 3"','700 32px "Source Sans 3"','italic 400 32px "Source Sans 3"'].map(f => document.fonts.load(f, 'RÜCKBLICK äöß'))), new Promise(ok => setTimeout(ok, 2500))]).catch(() => {})
    : Promise.resolve();
  rbBildVersprechen = schriften.then(() => new Promise((ok, nein) => {
    const c = document.createElement('canvas'), ctx = c.getContext('2d'), W = 1240;
    c.width = W; c.height = 100;
    const h = Math.ceil(rbKarte(ctx, W, false));
    c.height = Math.min(h, 8000);
    rbKarte(ctx, W, true);
    c.toBlob(b => { if (b){ rbBlob = b; ok(b); } else nein(new Error('Bild nicht erzeugt')); }, 'image/png');
  }));
  rbBildVersprechen.catch(() => { rbBildVersprechen = null; });
  return rbBildVersprechen;
}
function rbMelde(t){ const m = $('#rbmeldung'); if (m) m.textContent = t; }
function rbErsatzText(text){
  const f = $('#rbersatz'); f.hidden = false;
  f.innerHTML = '<p>Automatisch ging es hier nicht. Tippe in das Feld, wähle <b>Alles auswählen</b> und dann <b>Kopieren</b>.</p><textarea readonly rows="9"></textarea>';
  const a = f.querySelector('textarea'); a.value = text; a.onfocus = () => a.select(); a.focus({preventScroll:true}); a.select();
}
function rbErsatzBild(blob){
  const f = $('#rbersatz'); f.hidden = false;
  f.innerHTML = '<p>Halte den Finger auf das Bild und wähle <b>Kopieren</b> oder <b>Teilen</b>.</p><img alt="Rückblick als Bild">';
  f.querySelector('img').src = URL.createObjectURL(blob);
}
async function rbTextKopieren(){
  const text = rueckblickText(), html = rueckblickHtml();
  let ok = false;
  try {
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write){
      await navigator.clipboard.write([new ClipboardItem({'text/plain':new Blob([text],{type:'text/plain'}), 'text/html':new Blob([html],{type:'text/html'})})]);
      ok = true;
    }
  } catch(e){}
  if (!ok) try { await navigator.clipboard.writeText(text); ok = true; } catch(e){}
  if (ok){ $('#rbersatz').hidden = true; rbMelde('✓ Text kopiert. Lange in deine Notizen tippen, dann „Einsetzen“.'); }
  else { rbMelde(''); rbErsatzText(text); }
}
async function rbBildKopieren(){
  const bild = rueckblickBild();
  let ok = false;
  try {
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write){
      await navigator.clipboard.write([new ClipboardItem({'image/png':bild})]);
      ok = true;
    }
  } catch(e){}
  if (ok){ $('#rbersatz').hidden = true; rbMelde('✓ Bild kopiert. Lange in deine Notizen tippen, dann „Einsetzen“.'); return; }
  rbMelde('');
  try { rbErsatzBild(await bild); } catch(e){ rbMelde('Das Bild ließ sich nicht erzeugen. Kopiere bitte den Text.'); }
}
const rbDateiname = () => 'Rueckblick-' + (location.pathname.split('/').pop().replace(/\.html$/,'') || 'Sokrates') + '.png';
async function rbTeilen(){
  if (!rbBlob) return;
  try {
    await navigator.share({files:[new File([rbBlob], rbDateiname(), {type:'image/png'})], title:'Rückblick: ' + rbKlar(DIALOG.rueckblick.titel)});
    rbMelde('✓ Gesendet.');
  } catch(e){ if (!e || e.name !== 'AbortError') rbErsatzBild(rbBlob); }
}
function vonVorn(){ zustand = []; gemischt = {}; gesehen = {}; letzteAntwort = ''; startwerte(); koppelZurueck(); zeigeStart(); }
function zeigeRueckblick(von){
  if (!rueckblickAktiv()) return;
  rueckblickVon = von || rueckblickVon; imRueckblick = true;
  try { stopSprechen(); tippeFertig(); } catch(e){}
  const R = DIALOG.rueckblick;
  $('#fortschritt').textContent = 'Rückblick';
  $('#dialog').innerHTML = `
    <div class="sprecherzeile"><div class="sprecher">${DIALOG.lehrer}</div></div>
    <div class="rede"><p>${inline('Blicken wir zurück, {name}. So hat sich der Gedanke entwickelt. Nimm ihn mit in deine Unterlagen.')}</p></div>
    <article class="rueckblick" id="rueckblick">
      <div class="rb-kopf"><span class="rb-dach">Rückblick</span><span class="rb-herkunft">${rbHerkunft()}</span></div>
      <h2>${inline(R.titel)}</h2>
      <div class="rb-frage"><span class="rb-marke">Die Frage</span>${rich(R.frage)}</div>
      <h3>So hat sich der Gedanke entwickelt</h3>
      <ol class="rb-weg">${R.schritte.map(s => `<li><strong>${inline(s.kurz)}</strong>${rich(s.text)}</li>`).join('')}</ol>
      <div class="rb-einsicht"><span class="rb-marke">Die Einsicht</span>${rich(R.einsicht)}</div>
      ${R.mitnehmen ? `<div class="rb-mit"><span class="rb-marke">Das nehme ich mit</span>${rich(R.mitnehmen)}</div>` : ''}
    </article>
    <div class="rb-aktionen">
      <button class="rb-knopf" id="rbtext">Text kopieren</button>
      <button class="rb-knopf" id="rbbild">Als Bild kopieren</button>
      <button class="rb-knopf" id="rbteilen" hidden>An App senden …</button>
    </div>
    <div class="rb-tipp">Der Text passt in Notizen und Word. Das Bild behält Formeln und Gestaltung, etwa für GoodNotes.</div>
    <div class="rb-meldung" id="rbmeldung" role="status" aria-live="polite"></div>
    <div class="rb-ersatz" id="rbersatz" hidden></div>
    <div class="schueler"><div class="nav">
      <button class="zurueck" id="rbzurueck">◂ zurück</button>
      <button class="weiter" id="rbvorn">Von vorn</button>
    </div></div>`;
  formeln($('#dialog'));
  $('#rbtext').onclick = rbTextKopieren;
  $('#rbbild').onclick = rbBildKopieren;
  $('#rbteilen').onclick = rbTeilen;
  $('#rbzurueck').onclick = () => { if (rueckblickVon === 'selbst') zeigeSelbst(); else geheZu(DIALOG.schritte.length - 1); };
  $('#rbvorn').onclick = vonVorn;
  $('#dialog').scrollIntoView({block:'start'});
  rueckblickBild().then(b => {
    const t = $('#rbteilen'); if (!t || !navigator.canShare) return;
    try { if (navigator.canShare({files:[new File([b], rbDateiname(), {type:'image/png'})]})) t.hidden = false; } catch(e){}
  }).catch(() => {});
}
function geheZu(i){
  schritt = i; imRueckblick = false;
  if (zustand[i] === undefined) zustand[i] = (DIALOG.schritte[i].typ === 'wahl' || DIALOG.schritte[i].typ === 'zahl') ? 'offen' : 'richtig';
  const s = DIALOG.schritte[i];
  (s.beimStart||[]).forEach(c => api && api.evalCommand(c));
  koppelZurueck();
  if (api && !DREI && JSON.stringify(aktuelleSicht()) !== letzteSicht){ letzteSicht = JSON.stringify(aktuelleSicht()); zoom = 1; sichtEinpassen(); }
  else if (api && !DREI && zoom !== 1) sichtEinpassen();
  zeichne();
}
function zeichne(fehl, fehlQuelle){
  const s = DIALOG.schritte[schritt], N = DIALOG.schritte.length;
  $('#fortschritt').textContent = `Schritt ${schritt+1} von ${N}`;
  const geloest = zustand[schritt] === 'richtig';
  let antwort = '';
  if (geloest && s.richtig) antwort = rich(s.richtig);
  else if (fehl) antwort = fehl;

  let unten = '';
  if (s.typ === 'wahl' && !geloest){
    if (!gemischt[schritt]) gemischt[schritt] = s.mischen === false ? s.optionen.map((x,i)=>({x,i})) : mische(s.optionen, schritt+3);
    unten = `<div class="optionen">${gemischt[schritt].map(o => `<button class="option${(zustand['f'+schritt]||[]).includes(o.i)?' falsch':''}" data-i="${o.i}">${rich(o.x.text).replace(/^<p>|<\/p>$/g,'')}</button>`).join('')}</div>`;
  } else if (s.typ === 'zahl' && !geloest){
    unten = `<div class="zahlfeld"><input id="eingabe" inputmode="decimal" autocomplete="off" placeholder="Zahl">${s.einheit ? `<span class="einheit">${rich(s.einheit).replace(/^<p>|<\/p>$/g,'')}</span>` : ''}<button class="option" id="pruefen">Prüfen</button></div>`;
  } else if (s.typ === 'probieren'){
    unten = `<div class="hinweis">${rich(s.hinweis || 'Probiere es in der Zeichnung aus.').replace(/^<p>|<\/p>$/g,'')}</div>`;
  }
  const tipps = (s.typ === 'wahl' || s.typ === 'zahl') && !geloest ? (s.tipps || (s.falsch ? [s.falsch] : [])) : [];
  const nT = Math.min(zustand['t'+schritt] || 0, tipps.length);
  if (tipps.length) unten += `<div class="tippzeile"><button class="klein" id="tippknopf">💡 Tipp${tipps.length > 1 ? ' ' + Math.min(nT+1, tipps.length) + '/' + tipps.length : ''}</button></div><div class="tipps" id="tipps">${tipps.slice(0,nT).map((t,i) => '<div class="tipp1"><b>Tipp ' + (i+1) + ':</b> ' + rich(t).replace(/^<p>|<\/p>$/g,'') + '</div>').join('')}</div>`;
  const letzter = schritt === N-1;
  $('#dialog').innerHTML = `
    ${aufgabenleiste()}
    <div class="sprecherzeile">
      <div class="sprecher">${DIALOG.lehrer}</div>
      <button class="klein" id="vorlesen" title="Sokrates' Text vorlesen" hidden>🔊 Vorlesen</button>
      <button class="klein${auto ? ' an' : ''}" id="auto" title="Neue Sätze automatisch vorlesen" hidden>automatisch: ${auto ? 'an' : 'aus'}</button>
      <button class="klein" id="sofort" title="Ganzen Text sofort zeigen" hidden>» sofort</button>
    </div>
    <div class="rede">${rich(s.text)}</div>
    <div class="antwort">${antwort}</div>
    <div class="werte" id="werte"></div>
    <div class="reglerbox" id="regler"></div>
    ${letzter && DIALOG.hefteintrag ? `<div class="heft" id="heft"><div class="heft-kopf"><span>Hefteintrag</span><span class="heft-hinweis">Übertrage ihn von Hand in dein Heft.</span></div>${rich(DIALOG.hefteintrag)}</div>` : ''}
    <div class="schueler">
      <div class="sprecher">${nm(DIALOG.schueler)}</div>
      ${unten}
      <div class="nav">
        ${schritt > 0 ? '<button class="zurueck" id="zurueck">◂ zurück</button>' : '<button class="zurueck" id="zurueck">◂ Aufgabe</button>'}
        <button class="weiter" id="weiter" ${geloest ? '' : 'disabled'}>${letzter ? (rueckblickAktiv() ? 'Rückblick ▸' : 'Von vorn') : 'Weiter ▸'}</button>
      </div>
    </div>`;
  sichtAnwenden();
  formeln($('#dialog'));
  aufgabenleisteVerdrahten();
  const heft = $('#heft');
  if (heft) ['copy','cut','contextmenu','selectstart','dragstart'].forEach(ev => heft.addEventListener(ev, e => e.preventDefault()));
  document.querySelectorAll('.option[data-i]').forEach(b => b.onclick = () => waehle(+b.dataset.i));
  const tk = $('#tippknopf');
  if (tk){
    if (nT >= tipps.length) tk.disabled = true;
    tk.onclick = () => {
      const n = (zustand['t'+schritt] || 0); if (n >= tipps.length) return;
      zustand['t'+schritt] = n + 1;
      const div = document.createElement('div'); div.className = 'tipp1';
      div.innerHTML = '<b>Tipp ' + (n+1) + ':</b> ' + rich(tipps[n]).replace(/^<p>|<\/p>$/g,'');
      $('#tipps').appendChild(div); formeln(div);
      if (n + 1 >= tipps.length){ tk.disabled = true; tk.textContent = '💡 Tipp'; } else tk.textContent = '💡 Tipp ' + (n+2) + '/' + tipps.length;
      if (auto) sprich(sprechtext(tipps[n]));
    };
  }
  if ($('#pruefen')){
    const pr = () => pruefeZahl();
    $('#pruefen').onclick = pr;
    $('#eingabe').onkeydown = e => { if (e.key === 'Enter') pr(); };
    if (matchMedia('(pointer:fine)').matches) $('#eingabe').focus({preventScroll:true});
  }
  $('#weiter').onclick = () => { if (!letzter) geheZu(schritt+1); else if (rueckblickAktiv()) zeigeRueckblick('gespraech'); else vonVorn(); };
  $('#zurueck').onclick = () => { if (schritt > 0) geheZu(schritt-1); else zeigeStart(); };

  const redeNeu = !gesehen[schritt];
  gesehen[schritt] = true;
  const antwortQuelle = (geloest && s.richtig) ? s.richtig : (fehlQuelle || '');
  const antwortNeu = antwortQuelle && antwortQuelle !== letzteAntwort;
  letzteAntwort = antwortQuelle;
  const teile = [];
  if (redeNeu) teile.push($('#dialog .rede'));
  if (antwortNeu) teile.push($('#dialog .antwort'));
  sprachKnoepfe(s, antwortQuelle);
  stopSprechen();
  if (auto){
    const t = (redeNeu ? sprechtext(s.text) + ' ' : '') + (antwortNeu ? sprechtext(antwortQuelle) : '');
    if (t.trim()) sprich(t);
  }
  tippe(teile);
}
function richtigGeloest(){
  const s = DIALOG.schritte[schritt];
  zustand[schritt] = 'richtig';
  (s.nachRichtig||[]).forEach(c => api && api.evalCommand(c));
  koppelZurueck();
  zeichne();
}
function waehle(i){
  const s = DIALOG.schritte[schritt], o = s.optionen[i];
  if (o.richtig) return richtigGeloest();
  const f = zustand['f'+schritt] = (zustand['f'+schritt]||[]); if (!f.includes(i)) f.push(i);
  const zitat = rich(o.text).replace(/^<p>|<\/p>$/g,'');
  const hinweis = o.hinweis || s.falsch || 'Denk noch einmal nach.';
  zeichne(`<p>Du sagst: <span class="zitat">${zitat}</span>?</p>` + rich(hinweis), 'Du sagst: ' + o.text + '? ' + hinweis);
}
function pruefeZahl(){
  const s = DIALOG.schritte[schritt];
  let roh = $('#eingabe').value.trim().replace(/[\s  ]/g,'').replace(/−/g,'-');
  if (s.tausender) roh = roh.replace(/\.(?=\d{3}(\D|$))/g, '');
  roh = roh.replace(',', '.');
  const v = parseFloat(roh);
  if (roh === '' || isNaN(v)) return;
  if (Math.abs(v - s.loesung) <= (s.toleranz || 1e-9)) return richtigGeloest();
  const gesagt = v.toLocaleString('de-DE', {maximumFractionDigits:4}).replace('-','−');
  zeichne(`<p>Du sagst ${gesagt}?</p>` + rich(s.falsch || 'Prüfe es noch einmal.'), 'Du sagst ' + gesagt + '? ' + (s.falsch || 'Prüfe es noch einmal.'));
}

/* ---- Rechner (eigener Parser, kein eval) ---- */
function rechne(text){
  const src = text.replace(/\s+/g,'').replace(/×|·|\*/g,'*').replace(/÷|:/g,'/').replace(/−/g,'-').replace(/,/g,'.').replace(/π|pi/gi,'π').replace(/√|wurzel|sqrt/gi,'√');
  let i = 0;
  const peek = () => src[i];
  const fehler = m => { throw new Error(m); };
  function zahlLesen(){ const m = src.slice(i).match(/^\d*\.?\d+(e[-+]?\d+)?/i); if (!m) fehler('Zahl erwartet'); i += m[0].length; return parseFloat(m[0]); }
  function primaer(){
    const c = peek();
    if (c === '(') { i++; const v = ausdruck(); if (peek() !== ')') fehler('Klammer fehlt'); i++; return v; }
    if (c === 'π') { i++; return Math.PI; }
    if (c === '√') { i++; const v = potenz(); if (v < 0) fehler('Wurzel aus negativer Zahl'); return Math.sqrt(v); }
    if (c !== undefined && /[\d.]/.test(c)) return zahlLesen();
    fehler('Unerwartetes Zeichen' + (c ? ' „' + c + '“' : ''));
  }
  function potenz(){ const b = primaer(); if (peek() === '^') { i++; return Math.pow(b, vorzeichen()); } return b; }
  function vorzeichen(){ if (peek() === '-') { i++; return -vorzeichen(); } if (peek() === '+') { i++; return vorzeichen(); } return potenz(); }
  function term(){
    let v = vorzeichen();
    for(;;){
      const c = peek();
      if (c === '*') { i++; v *= vorzeichen(); }
      else if (c === '/') { i++; const d = vorzeichen(); if (d === 0) fehler('Division durch 0'); v /= d; }
      else if (c === '(' || c === 'π' || c === '√' || (c !== undefined && /[\d.]/.test(c))) v *= vorzeichen();
      else return v;
    }
  }
  function ausdruck(){ let v = term(); for(;;){ const c = peek(); if (c === '+') { i++; v += term(); } else if (c === '-') { i++; v -= term(); } else return v; } }
  if (!src) fehler('Leer');
  const v = ausdruck(); if (i < src.length) fehler('Unerwartetes Zeichen „' + src[i] + '“');
  if (!isFinite(v)) fehler('Kein endliches Ergebnis');
  return v;
}
function hilfenEinrichten(){
  const kopf = document.querySelector('.kopf-rechts');
  if (!kopf || $('#rechnerknopf')) return;
  kopf.insertAdjacentHTML('afterbegin', '<button class="klein" id="notizknopf" title="Eigene Notizen">✎ Notizen</button><button class="klein" id="merkknopf" title="Begriffe und Formeln">📘 Merkzettel</button><button class="klein" id="rechnerknopf" title="Taschenrechner">🧮 Rechner</button>');
  document.body.insertAdjacentHTML('beforeend', `
    <div class="tafel" id="rechner" hidden><div class="tafel-kopf"><span>Rechner</span><button class="klein" data-zu="rechner">✕</button></div>
      <div class="rechner-zeile"><input id="rin" autocomplete="off" inputmode="text" placeholder="z. B. (1,1^2 − 2 + 1) : 0,1"><button class="option" id="rgleich">=</button></div>
      <div class="rechner-tasten">${['(',')','^','√','π','·',':'].map(t => `<button class="klein" data-t="${t}">${t}</button>`).join('')}<button class="klein" data-t="C">C</button></div>
      <div class="rechner-erg" id="rerg"></div><div class="rechner-verlauf" id="rverlauf"></div>
      <div class="rechner-hinweis">Komma oder Punkt als Dezimalzeichen · Potenz mit ^ · Wurzel mit √ · Ergebnis antippen übernimmt es.</div></div>
    <div class="tafel" id="merk" hidden><div class="tafel-kopf"><span>Merkzettel</span><button class="klein" data-zu="merk">✕</button></div><div id="merkinhalt"></div></div>
    <div class="tafel" id="notizen" hidden><div class="tafel-kopf"><span>Notizen</span><button class="klein" data-zu="notizen">✕</button></div>
      <textarea class="notiz" id="notizfeld" rows="9" placeholder="Platz für deine Rechnungen, Ideen und Fragen …"></textarea>
      <div class="rechner-hinweis">Bleibt auf diesem Gerät gespeichert, auch nach dem Neuladen.</div></div>`);
  notizVerdrahten(document.body);
  const zeige = id => {
    const t = $('#'+id); t.hidden = !t.hidden;
    if (!t.hidden && (id === 'merk' || id === 'notizen')) $('#' + (id === 'merk' ? 'notizen' : 'merk')).hidden = true;   // beide links: nur eine zur Zeit
    if (!t.hidden && id === 'rechner') $('#rin').focus({preventScroll:true});
    if (!t.hidden && id === 'notizen') { notizVerdrahten(t); if (matchMedia('(pointer:fine)').matches) $('#notizfeld').focus({preventScroll:true}); }
  };
  $('#rechnerknopf').onclick = () => zeige('rechner');
  $('#notizknopf').onclick = () => zeige('notizen');
  $('#merkknopf').onclick = () => {
    const m = DIALOG.merkzettel || (DIALOG.vorwissen||[]).map(v => ({text:v}));
    $('#merkinhalt').innerHTML = m.map(e => `<div class="merk1">${e.begriff ? '<b>' + e.begriff + '</b><br>' : ''}${rich(e.text).replace(/^<p>|<\/p>$/g,'')}</div>`).join('') || '<p>Noch kein Merkzettel.</p>';
    formeln($('#merkinhalt')); zeige('merk');
  };
  document.querySelectorAll('[data-zu]').forEach(b => b.onclick = () => { $('#'+b.dataset.zu).hidden = true; });
  const rin = $('#rin');
  const los = () => {
    let erg;
    try { const v = rechne(rin.value); erg = v.toLocaleString('de-DE', {maximumSignificantDigits:12}); $('#rerg').textContent = '= ' + erg; $('#rerg').classList.remove('fehler');
      $('#rverlauf').insertAdjacentHTML('afterbegin', `<div class="vz"><span>${rin.value.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span><button class="klein" data-wert="${erg}">= ${erg}</button></div>`);
      $('#rverlauf').querySelectorAll('[data-wert]').forEach(b => b.onclick = () => {
        const e = (letztesFeld && document.body.contains(letztesFeld) && !letztesFeld.readOnly) ? letztesFeld : $('#eingabe');
        if (e) { e.value = b.dataset.wert.replace(/\./g,''); e.dispatchEvent(new Event('input')); e.focus({preventScroll:true}); } else { rin.value += b.dataset.wert; }
      });
    } catch(e){ $('#rerg').textContent = e.message; $('#rerg').classList.add('fehler'); }
  };
  $('#rgleich').onclick = los;
  rin.onkeydown = e => { if (e.key === 'Enter') los(); };
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { if (b.dataset.t === 'C') { rin.value = ''; $('#rerg').textContent = ''; } else rin.value += b.dataset.t; rin.focus({preventScroll:true}); });
  // iPad: Die Tafeln hängen oben (CSS, pointer:coarse) und folgen dem sichtbaren
  // Ausschnitt – geht die Tastatur auf, schrumpft er, und nichts liegt darunter.
  const vv = window.visualViewport;
  if (vv){
    const passe = () => {
      const r = document.documentElement.style;
      r.setProperty('--vv-oben', vv.offsetTop + 'px');
      r.setProperty('--vv-hoehe', vv.height + 'px');
    };
    vv.addEventListener('resize', passe); vv.addEventListener('scroll', passe); passe();
  }
}

/* ---- GeoGebra ---- */
function startwerte(){
  if (!api) return;
  const sw = DIALOG.geogebra.startwerte || {};
  Object.keys(sw).forEach(o => { const v = sw[o]; if (Array.isArray(v)) api.setCoords(o, v[0], v[1]); else api.setValue(o, v); });
}
function ansichtAttr(){
  const a = DIALOG.geogebra.ansicht3d || {};
  const el = $('#ggb'); const f = Math.min(el.clientWidth / 700, el.clientHeight / 520);
  return `xZero="${a.x0||0}" yZero="${a.y0||0}" zZero="${a.z0||0}" scale="${((a.massstab||50)*f).toFixed(2)}" xAngle="${a.kippen===undefined?20:a.kippen}" zAngle="${a.drehen===undefined?-60:a.drehen}" `;
}
function ansichtZuruecksetzen(){
  if (!api || !DREI) return;
  const el = $('#ggb'); api.setSize(el.clientWidth, el.clientHeight);
  api.setXML(api.getXML().replace(/(<euclidianView3D>\s*<coordSystem )[^>]*\/>/, '$1' + ansichtAttr() + '/>'));
}
function aktuelleSicht(){
  for (let i = Math.min(schritt, DIALOG.schritte.length-1); i >= 0; i--) if (DIALOG.schritte[i].sicht) return DIALOG.schritte[i].sicht;
  return DIALOG.geogebra.sicht;
}
let letzteSicht = null, zoom = 1, koords = false;
function schoeneSchritt(v){ const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v/e; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e; }
function zoome(f){
  if (f === 0) zoom = 1; else zoom = Math.min(80, Math.max(0.5, zoom * f));
  if (DREI){
    if (f === 0) return ansichtZuruecksetzen();
    api.setXML(api.getXML().replace(/(<euclidianView3D>\s*<coordSystem [^>]*scale=")([\d.]+)/, (m,a,b) => a + (parseFloat(b)*f).toFixed(3)));
    return;
  }
  sichtEinpassen();
}
function koordPunkte(){
  const st = DIALOG.geogebra.stil;
  return (DIALOG.geogebra.koordinaten || Object.keys(st).filter(o => st[o].name && api && api.exists(o) && api.getObjectType(o) === 'point'));
}
function koordAnwenden(){
  if (!api) return;
  try { api.setRounding('3'); } catch(e){}
  koordPunkte().forEach(o => { const n = (DIALOG.geogebra.stil[o]||{}).name || o; if (api.exists(o)) { api.setCaption(o, koords ? n + '(%x | %y)' : n); api.setLabelVisible(o, true); api.setLabelStyle(o, 3); } });
  const k = $('#koordknopf'); if (k) k.classList.toggle('an', koords);
}
function sichtEinpassen(){
  if (!api) return;
  const el = $('#ggb'); const w = el.clientWidth, h = el.clientHeight;
  api.setSize(w, h);
  if (DREI) return;
  let [x0,x1,y0,y1,dx,dy] = aktuelleSicht();
  if (zoom !== 1){
    const f = DIALOG.geogebra.fokus;
    let cx = (x0+x1)/2, cy = (y0+y1)/2;
    if (f && api.exists(f) && api.getVisible(f)) { cx = api.getXcoord(f); cy = api.getYcoord(f); }
    const hx = (x1-x0)/2/zoom, hy = (y1-y0)/2/zoom;
    x0 = cx-hx; x1 = cx+hx; y0 = cy-hy; y1 = cy+hy;
    if (dx) { dx = schoeneSchritt((x1-x0)/7); dy = schoeneSchritt((y1-y0)/7); }
  }
  if (DIALOG.geogebra.achsen && dx) { try { api.setAxisSteps(1, dx, dy); } catch(e){} }
  if (DIALOG.geogebra.frei){
    api.setCoordSystem(x0, x1, y0, y1);
    window._soll = {xmin: x0, inv: (x1-x0)/w};
    return;
  }
  const sx = w/(x1-x0), sy = h/(y1-y0), sc = Math.min(sx, sy);
  const cx = (x0+x1)/2, cy = (y0+y1)/2, hx = w/sc/2, hy = h/sc/2;
  api.setCoordSystem(cx-hx, cx+hx, cy-hy, cy+hy);
  window._soll = {xmin: cx-hx, inv: 1/sc};
}
function ggbBereit(a){
  api = a;
  try { api.setErrorDialogsActive(false); } catch(e){}
  if (DREI){
    try { api.setPerspective('T'); } catch(e){}
    let x = api.getXML();
    x = x.replace(/<plate show="true"\/>/,'<plate show="false"/>').replace(/<axis id="(\d)" show="true"/g,'<axis id="$1" show="false"').replace(/axes="true"/g,'axes="false"').replace(/grid="true"/g,'grid="false"');
    x = x.replace(/(<euclidianView3D>\s*<coordSystem )[^>]*\/>/, '$1' + ansichtAttr() + '/>');
    api.setXML(x);
  } else {
    const ax = DIALOG.geogebra.achsen;
    api.setAxesVisible(!!ax, !!ax); api.setGridVisible(false);
    if (ax) { try { api.setAxisLabels(1, ax.x || 'x', ax.y || 'y'); } catch(e){} }
  }
  DIALOG.geogebra.befehle.forEach(c => api.evalCommand(c));
  // Polygone: Kanten mitführen
  const stilNamen = Object.keys(DIALOG.geogebra.stil);
  const befehl = {}; stilNamen.forEach(n => { if (api.exists(n)) befehl[n] = api.getCommandString(n,false) || ''; });
  api.getAllObjectNames().forEach(o => {
    if (DIALOG.geogebra.stil[o] || api.getObjectType(o) === 'point') return;
    const cs = api.getCommandString(o,false) || '';
    const m = cs.match(/,\s*([\wÄÖÜäöüß]+)\s*[\])]\s*$/);
    let eltern = (m && DIALOG.geogebra.stil[m[1]] && /^\s*(Segment|Strecke|Polygon|Vieleck)/.test(cs)) ? m[1] : null;
    if (!eltern && cs) eltern = stilNamen.find(n => befehl[n] === cs) || null;
    if (eltern) (gruppen[eltern] = gruppen[eltern]||[]).push(o);
  });
  api.getAllObjectNames().forEach(o => { api.setLabelVisible(o,false); api.setVisible(o,false); });
  stileAnwenden(false);
  const ziehbar = new Set(DIALOG.geogebra.ziehbar||[]);
  api.getAllObjectNames().forEach(o => api.setFixed(o, !ziehbar.has(o), ziehbar.has(o)));
  startwerte();
  koppelZurueck(); koppelnEinrichten(); koordAnwenden();
  if (DREI) ansichtZuruecksetzen(); else sichtEinpassen();
  api.registerUpdateListener(() => { if (!werteGeplant){ werteGeplant = true; requestAnimationFrame(() => { werteGeplant = false; werteAktualisieren(); }); } });
  if (!DREI) setInterval(() => { try{ const v = JSON.parse(api.getViewProperties(1)); if (window._soll && (Math.abs(v.xMin-window._soll.xmin) > 0.01 || Math.abs(v.invXscale-window._soll.inv)/window._soll.inv > 0.003)) sichtEinpassen(); }catch(e){} }, 300);
  $('#ggb').addEventListener('wheel', e => { e.preventDefault(); e.stopPropagation(); }, {capture:true, passive:false});
  if (imRueckblick) zeigeRueckblick(); else if (schritt === -2) zeigeSelbst(); else if (schritt < 0) zeigeStart(); else zeichne();
}

window.addEventListener('load', () => {
  document.title = DIALOG.titel;
  $('#titel').textContent = DIALOG.titel;
  if (DIALOG.heim && $('#heim')){ $('#heim').textContent = DIALOG.heim.text; $('#heim').href = DIALOG.heim.href; $('#heim').hidden = false; }
  const k = $('#thema'); if (k) k.onclick = () => themaSetzen(thema === 'hell' ? 'dunkel' : 'hell');
  themaSetzen(thema);
  zeigeStart();
  const el = $('#ggb');
  const applet = new GGBApplet({
    appName: DREI ? '3d' : 'classic', width: el.clientWidth, height: el.clientHeight,
    showToolBar:false, showAlgebraInput:false, showMenuBar:false, showResetIcon:false,
    enableRightClick:false, enableShiftDragZoom:false, enableLabelDrags:false,
    showZoomButtons:false, showFullscreenButton:false, enableUndoRedo:false,
    allowStyleBar:false, preventFocus:true, errorDialogsActive:false,
    borderColor: F().bg, perspective: DREI ? 'T' : 'G', language:'de', useBrowserForJS:false,
    appletOnLoad: ggbBereit
  }, true);
  applet.inject('ggb');
  const z = document.querySelector('.zeichnung');
  z.insertAdjacentHTML('beforeend', `<div class="werkzeuge"><button class="klein" id="zplus" title="Vergrößern">＋</button><button class="klein" id="zminus" title="Verkleinern">－</button><button class="klein" id="zreset" title="Ansicht zurücksetzen">⟲</button>${DREI ? '' : '<button class="klein" id="koordknopf" title="Koordinaten der Punkte anzeigen">(x | y)</button>'}</div>` + (DREI ? '<div class="drehhinweis">Zum Drehen in die Zeichnung ziehen</div>' : ''));
  $('#zplus').onclick = () => zoome(1.6); $('#zminus').onclick = () => zoome(1/1.6); $('#zreset').onclick = () => zoome(0);
  if ($('#koordknopf')) $('#koordknopf').onclick = () => { koords = !koords; koordAnwenden(); };
  hilfenEinrichten();
  let t; const neu = () => { clearTimeout(t); t = setTimeout(() => { if (DREI) { if (api) api.setSize(el.clientWidth, el.clientHeight); } else sichtEinpassen(); }, 120); };
  window.addEventListener('resize', neu);
  if (window.ResizeObserver) new ResizeObserver(neu).observe(el);
});
window.SOKRATES = { get api(){ return api; }, themaSetzen, geheZu, blinke, zeigeRueckblick, rueckblickText, rueckblickHtml, rueckblickBild,
  get selbstStand(){ return selbstStand; }, selbstNeu(){ selbstStand = null; selbstWerte = {}; } };
})();
