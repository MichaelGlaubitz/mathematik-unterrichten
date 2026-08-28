/* ==========================================================================
   Gemeinsame Grundfunktionen der Unterrichtswerkzeuge
   --------------------------------------------------------------------------
   Kopfleiste, Hell/Dunkel, Beamer-Modus, Vollbild, Speichern im Browser,
   Zufall und ein kurzer Ton. Kein Framework, keine externe Abhängigkeit.

   Einbinden:  <script src="werkzeug.js"></script>  (vor dem eigenen Skript)
   Kopfleiste: WZ.kopf({ titel: 'Unterrichts-Timer' })
   ========================================================================== */

(function (global) {
  'use strict';

  const SCHLUESSEL_THEMA = 'wz-thema';
  const SCHLUESSEL_BEAMER = 'wz-beamer';

  // --- Speicher (fällt still zurück, wenn der Browser localStorage sperrt) --

  function lies(schluessel, ersatz) {
    try {
      const roh = localStorage.getItem(schluessel);
      return roh === null ? ersatz : JSON.parse(roh);
    } catch (e) {
      return ersatz;
    }
  }

  function schreib(schluessel, wert) {
    try {
      localStorage.setItem(schluessel, JSON.stringify(wert));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loesche(schluessel) {
    try {
      localStorage.removeItem(schluessel);
    } catch (e) {
      /* egal */
    }
  }

  // --- Darstellung ---------------------------------------------------------

  function themaSetzen(wert) {
    document.documentElement.setAttribute('data-thema', wert);
    schreib(SCHLUESSEL_THEMA, wert);
    const knopf = document.getElementById('wz-thema-knopf');
    if (knopf) {
      knopf.textContent = wert === 'dunkel' ? '☀' : '☾';
      knopf.setAttribute('aria-label', wert === 'dunkel' ? 'Zu hell wechseln' : 'Zu dunkel wechseln');
    }
  }

  function themaInitialisieren() {
    let gespeichert = lies(SCHLUESSEL_THEMA, null);
    if (gespeichert !== 'hell' && gespeichert !== 'dunkel') {
      let dunkel = false;
      try {
        dunkel = global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch (e) {
        dunkel = false;
      }
      gespeichert = dunkel ? 'dunkel' : 'hell';
    }
    document.documentElement.setAttribute('data-thema', gespeichert);
  }

  function beamerSetzen(an) {
    document.documentElement.setAttribute('data-beamer', an ? 'an' : 'aus');
    schreib(SCHLUESSEL_BEAMER, !!an);
    const knopf = document.getElementById('wz-beamer-knopf');
    if (knopf) {
      knopf.setAttribute('aria-pressed', an ? 'true' : 'false');
      knopf.title = an ? 'Beamer-Modus aus (B)' : 'Beamer-Modus an — alles größer (B)';
    }
  }

  function vollbildUmschalten() {
    const doc = document;
    if (!doc.fullscreenElement) {
      const anfrage = doc.documentElement.requestFullscreen || doc.documentElement.webkitRequestFullscreen;
      if (anfrage) anfrage.call(doc.documentElement).catch(function () {});
    } else {
      const ende = doc.exitFullscreen || doc.webkitExitFullscreen;
      if (ende) ende.call(doc).catch(function () {});
    }
  }

  // --- Kopf- und Fußleiste -------------------------------------------------

  function kopf(einstellungen) {
    const opt = einstellungen || {};
    const titel = opt.titel || document.title;
    const zurueck = opt.zurueck || '/werkzeuge';

    const kopfEl = document.createElement('header');
    kopfEl.className = 'wz-kopf wz-nicht-drucken';
    kopfEl.innerHTML =
      '<div class="wz-kopf-innen">' +
      '<a class="wz-marke" href="' + zurueck + '">← <b>mathematik-unterrichten.de</b></a>' +
      '<span aria-hidden="true" style="color:var(--text-schwach)">·</span>' +
      '<p class="wz-titel">' + esc(titel) + '</p>' +
      '<div class="wz-kopf-rechts">' +
      '<button class="wz-knopf wz-icon-knopf" id="wz-beamer-knopf" type="button" aria-pressed="false" title="Beamer-Modus (B)">⛶</button>' +
      '<button class="wz-knopf wz-icon-knopf" id="wz-vollbild-knopf" type="button" title="Vollbild (F)">⤢</button>' +
      '<button class="wz-knopf wz-icon-knopf" id="wz-thema-knopf" type="button" title="Hell/Dunkel">☾</button>' +
      '</div></div><div class="wz-streifen" aria-hidden="true"></div>';
    document.body.insertBefore(kopfEl, document.body.firstChild);

    document.getElementById('wz-thema-knopf').addEventListener('click', function () {
      themaSetzen(document.documentElement.getAttribute('data-thema') === 'dunkel' ? 'hell' : 'dunkel');
    });
    document.getElementById('wz-beamer-knopf').addEventListener('click', function () {
      beamerSetzen(document.documentElement.getAttribute('data-beamer') !== 'an');
    });
    document.getElementById('wz-vollbild-knopf').addEventListener('click', vollbildUmschalten);

    themaSetzen(document.documentElement.getAttribute('data-thema') || 'hell');
    beamerSetzen(lies(SCHLUESSEL_BEAMER, false) === true);

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Werkzeuge, die die Buchstaben selbst brauchen (Abstimmung zaehlt A-E,
      // Whiteboard-Check R/H/F/N), fangen die Taste vorher ab und rufen
      // preventDefault. Dann darf hier nichts mehr passieren - sonst schaltet
      // ein getipptes "B" mitten in der Erfassung den Beamer-Modus um.
      if (e.defaultPrevented) return;
      const ziel = e.target;
      if (ziel && (ziel.tagName === 'INPUT' || ziel.tagName === 'TEXTAREA' || ziel.isContentEditable)) return;
      if (e.key === 'b' || e.key === 'B') {
        beamerSetzen(document.documentElement.getAttribute('data-beamer') !== 'an');
      } else if (e.key === 'f' || e.key === 'F') {
        vollbildUmschalten();
      }
    });
  }

  function fuss(zusatz, tasten) {
    const el = document.createElement('footer');
    el.className = 'wz-fuss wz-nicht-drucken';
    el.innerHTML =
      '<span>' + (zusatz || 'Läuft vollständig im Browser — es werden keine Daten übertragen.') + '</span>' +
      '<span>' + (tasten || '<kbd>B</kbd> Beamer · <kbd>F</kbd> Vollbild') + '</span>' +
      '<span style="margin-left:auto"><a href="/werkzeuge">Alle Werkzeuge</a> · ' +
      '<a href="/">mathematik-unterrichten.de</a> · ' +
      '<a href="/impressum">Impressum</a></span>';
    document.body.appendChild(el);
  }

  // --- Werkzeugkiste -------------------------------------------------------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (z) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[z];
    });
  }

  /** Ganzzahl aus [min, max] – beide Grenzen eingeschlossen. */
  function zufallGanz(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Zufälliges Element einer Liste. */
  function zufallAus(liste) {
    return liste[Math.floor(Math.random() * liste.length)];
  }

  /** Fisher-Yates: mischt eine Kopie der Liste. */
  function mische(liste) {
    const kopie = liste.slice();
    for (let i = kopie.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const h = kopie[i];
      kopie[i] = kopie[j];
      kopie[j] = h;
    }
    return kopie;
  }

  /** Größter gemeinsamer Teiler (für gekürzte Brüche). */
  function ggt(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const h = b;
      b = a % b;
      a = h;
    }
    return a || 1;
  }

  /** Deutsche Zahlschreibweise: Komma statt Punkt, höchstens `stellen` Nachkommastellen. */
  function zahl(wert, stellen) {
    const n = typeof stellen === 'number' ? stellen : 2;
    if (!isFinite(wert)) return '—';
    const gerundet = Math.round(wert * Math.pow(10, n)) / Math.pow(10, n);
    return String(gerundet).replace('.', ',');
  }

  /** Kurzer Ton ohne Audiodatei (Web Audio API). */
  let tonKontext = null;
  function ton(frequenz, dauerMs, lautstaerke) {
    try {
      const Kontext = global.AudioContext || global.webkitAudioContext;
      if (!Kontext) return;
      if (!tonKontext) tonKontext = new Kontext();
      if (tonKontext.state === 'suspended') tonKontext.resume();
      const osz = tonKontext.createOscillator();
      const verstaerker = tonKontext.createGain();
      osz.type = 'sine';
      osz.frequency.value = frequenz || 880;
      const spitze = typeof lautstaerke === 'number' ? lautstaerke : 0.18;
      const jetzt = tonKontext.currentTime;
      const dauer = (dauerMs || 220) / 1000;
      verstaerker.gain.setValueAtTime(0.0001, jetzt);
      verstaerker.gain.exponentialRampToValueAtTime(spitze, jetzt + 0.015);
      verstaerker.gain.exponentialRampToValueAtTime(0.0001, jetzt + dauer);
      osz.connect(verstaerker).connect(tonKontext.destination);
      osz.start(jetzt);
      osz.stop(jetzt + dauer + 0.02);
    } catch (e) {
      /* Ton ist Beiwerk – Fehler bleiben folgenlos */
    }
  }

  /** Dreiklang zum Phasenende. */
  function gong() {
    ton(660, 260, 0.2);
    setTimeout(function () { ton(880, 260, 0.2); }, 180);
    setTimeout(function () { ton(1175, 420, 0.22); }, 360);
  }

  /** mm:ss aus Sekunden. */
  function uhrzeit(sekunden) {
    const s = Math.max(0, Math.round(sekunden));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
  }

  /** Kürzeste Schreibweise eines Bruchs (gekürzt, ganzzahlig wenn möglich). */
  function bruchText(zaehler, nenner) {
    const t = ggt(zaehler, nenner);
    const z = zaehler / t;
    const n = nenner / t;
    return n === 1 ? String(z) : z + '/' + n;
  }

  /** Datei aus einem Text erzeugen und herunterladen (CSV-Export). */
  function herunterladen(dateiname, inhalt, typ) {
    try {
      const blob = new Blob(['﻿' + inhalt], { type: (typ || 'text/csv') + ';charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = dateiname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    } catch (e) {
      global.alert('Der Browser hat den Download blockiert.');
    }
  }

  /** Kurzer Elementaufbau: el('div', {class:'x'}, [kind, 'Text']) */
  function el(tag, attribute, kinder) {
    const knoten = document.createElement(tag);
    if (attribute) {
      Object.keys(attribute).forEach(function (name) {
        const wert = attribute[name];
        if (wert === null || wert === undefined || wert === false) return;
        if (name === 'text') knoten.textContent = wert;
        else if (name === 'html') knoten.innerHTML = wert;
        else if (name.slice(0, 2) === 'on' && typeof wert === 'function') {
          knoten.addEventListener(name.slice(2).toLowerCase(), wert);
        } else knoten.setAttribute(name, wert === true ? '' : wert);
      });
    }
    (kinder || []).forEach(function (kind) {
      if (kind === null || kind === undefined) return;
      knoten.appendChild(typeof kind === 'string' ? document.createTextNode(kind) : kind);
    });
    return knoten;
  }

  themaInitialisieren();

  global.WZ = {
    kopf: kopf,
    fuss: fuss,
    lies: lies,
    schreib: schreib,
    loesche: loesche,
    esc: esc,
    el: el,
    zufallGanz: zufallGanz,
    zufallAus: zufallAus,
    mische: mische,
    ggt: ggt,
    zahl: zahl,
    ton: ton,
    gong: gong,
    uhrzeit: uhrzeit,
    bruchText: bruchText,
    herunterladen: herunterladen,
    vollbild: vollbildUmschalten,
  };
})(window);
