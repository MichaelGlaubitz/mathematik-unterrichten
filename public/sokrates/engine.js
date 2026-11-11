/* =====================================================================
   SOKRATES-ENGINE  –  gemeinsam für alle Gespräche.
   Jede Seite definiert vorher ein globales  const DIALOG = {...}
   (Aufbau siehe /sokrates/index.html) und bindet dann diese Datei ein.
   Zusätze gegenüber der ersten Fassung:
     · Hell/Dunkel-Umschalter (localStorage 'sokratesThema'), färbt auch GeoGebra um
     · werte: {stellen, einheit}  ·  zahl-Schritte: {einheit, tausender}
     · DIALOG.heim = {text, href} für den Rücklink im Kopf
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
    box.querySelectorAll('input').forEach((r,i) => r.oninput = () => { if (!api) return; const w = aktiv[i]; if (w.setze) api.evalCommand(w.setze.replace(/#/g, '(' + parseFloat(r.value) + ')')); else api.setValue(r.dataset.obj, parseFloat(r.value)); });
  }
  if (api) box.querySelectorAll('input').forEach(r => { if (document.activeElement !== r) r.value = api.getValue(r.dataset.obj); });
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
  schritt = -1; try{ stopSprechen(); tippeFertig(); }catch(e){}
  $('#fortschritt').textContent = '';
  $('#dialog').innerHTML = `
    <div class="karte">
      <div class="sprecher">Die Aufgabe</div>
      <div class="aufgabe rede">${rich(DIALOG.aufgabe)}</div>
      ${DIALOG.vorwissen && DIALOG.vorwissen.length ? `<h2>Was du dafür brauchst</h2><ul>${DIALOG.vorwissen.map(v => '<li>'+rich(v).replace(/^<p>|<\/p>$/g,'')+'</li>').join('')}</ul>` : ''}
      ${/\{name\}/.test(DIALOG.schueler) ? `<h2>Wer bist du?</h2><div class="namenwahl" role="radiogroup" aria-label="Wer bist du?">${['Thea','Theo'].map(n => `<label class="name${name===n?' an':''}"><input type="radio" name="wer" value="${n}"${name===n?' checked':''}> ${n}</label>`).join('')}</div>` : ''}
      <button class="start" id="los"${/\{name\}/.test(DIALOG.schueler) && !name ? ' disabled' : ''}>Gespräch beginnen ▸</button>
      <div class="tipp">Unterstrichene Begriffe im Gespräch kannst du antippen – das Element leuchtet dann in der Zeichnung auf.</div>
    </div>`;
  formeln($('#dialog'));
  document.querySelectorAll('.namenwahl input').forEach(r => r.onchange = () => {
    name = r.value; try { localStorage.setItem('sokratesName', name); } catch(e){}
    document.querySelectorAll('.namenwahl .name').forEach(l => l.classList.toggle('an', l.contains(r)));
    $('#los').disabled = false;
  });
  $('#los').onclick = () => geheZu(0);
  if (api && !DREI){ letzteSicht = JSON.stringify(aktuelleSicht()); sichtEinpassen(); }
  sichtAnwenden();
}
function geheZu(i){
  schritt = i;
  if (zustand[i] === undefined) zustand[i] = (DIALOG.schritte[i].typ === 'wahl' || DIALOG.schritte[i].typ === 'zahl') ? 'offen' : 'richtig';
  const s = DIALOG.schritte[i];
  (s.beimStart||[]).forEach(c => api && api.evalCommand(c));
  if (api && !DREI && JSON.stringify(aktuelleSicht()) !== letzteSicht){ letzteSicht = JSON.stringify(aktuelleSicht()); sichtEinpassen(); }
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
  const letzter = schritt === N-1;
  $('#dialog').innerHTML = `
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
        <button class="weiter" id="weiter" ${geloest ? '' : 'disabled'}>${letzter ? 'Von vorn' : 'Weiter ▸'}</button>
      </div>
    </div>`;
  sichtAnwenden();
  formeln($('#dialog'));
  const heft = $('#heft');
  if (heft) ['copy','cut','contextmenu','selectstart','dragstart'].forEach(ev => heft.addEventListener(ev, e => e.preventDefault()));
  document.querySelectorAll('.option[data-i]').forEach(b => b.onclick = () => waehle(+b.dataset.i));
  if ($('#pruefen')){
    const pr = () => pruefeZahl();
    $('#pruefen').onclick = pr;
    $('#eingabe').onkeydown = e => { if (e.key === 'Enter') pr(); };
    if (matchMedia('(pointer:fine)').matches) $('#eingabe').focus({preventScroll:true});
  }
  $('#weiter').onclick = () => { if (letzter){ zustand = []; gemischt = {}; gesehen = {}; letzteAntwort = ''; startwerte(); zeigeStart(); } else geheZu(schritt+1); };
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
let letzteSicht = null;
function sichtEinpassen(){
  if (!api) return;
  const el = $('#ggb'); const w = el.clientWidth, h = el.clientHeight;
  api.setSize(w, h);
  if (DREI) return;
  const [x0,x1,y0,y1,dx,dy] = aktuelleSicht();
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
  if (DREI) ansichtZuruecksetzen(); else sichtEinpassen();
  api.registerUpdateListener(() => { if (!werteGeplant){ werteGeplant = true; requestAnimationFrame(() => { werteGeplant = false; werteAktualisieren(); }); } });
  if (!DREI) setInterval(() => { try{ const v = JSON.parse(api.getViewProperties(1)); if (window._soll && (Math.abs(v.xMin-window._soll.xmin) > 0.01 || Math.abs(v.invXscale-window._soll.inv)/window._soll.inv > 0.003)) sichtEinpassen(); }catch(e){} }, 300);
  $('#ggb').addEventListener('wheel', e => { e.preventDefault(); e.stopPropagation(); }, {capture:true, passive:false});
  if (schritt < 0) zeigeStart(); else zeichne();
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
  if (DREI){
    const z = document.querySelector('.zeichnung');
    z.insertAdjacentHTML('beforeend', '<button class="klein ansicht" id="ansicht" title="Ansicht zurücksetzen">⟲ Ansicht</button><div class="drehhinweis">Zum Drehen in die Zeichnung ziehen</div>');
    $('#ansicht').onclick = ansichtZuruecksetzen;
  }
  let t; const neu = () => { clearTimeout(t); t = setTimeout(() => { if (DREI) { if (api) api.setSize(el.clientWidth, el.clientHeight); } else sichtEinpassen(); }, 120); };
  window.addEventListener('resize', neu);
  if (window.ResizeObserver) new ResizeObserver(neu).observe(el);
});
window.SOKRATES = { get api(){ return api; }, themaSetzen, geheZu, blinke };
})();
