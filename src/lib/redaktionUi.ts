/**
 * Bedienung der Redaktion (`/admin`): Dateiliste, Formulare, GitHub.
 *
 * Die reine Textlogik — Frontmatter zerlegen und zurückschreiben, Markdown
 * für die Vorschau — liegt in `redaktionText.ts` und ist dort getestet.
 * Hier steht nur, was ohne Browser keinen Sinn ergibt.
 */
import {
  alsZeile,
  findeTextstellen,
  setzeTextstellen,
  zurAnzeige,
  zurDatei,
} from './astroText';
import {
  b64ZuText,
  escapeHtml,
  fuegeZusammen,
  klartext,
  kopfFelder,
  mdZuHtml,
  setzeFeld,
  textZuB64,
  wertArt,
  zerlege,
  type KopfFeld,
  type Zerlegt,
} from './redaktionText';

const TOKEN_SCHLUESSEL = 'mu-redaktion-token';
const API = 'https://api.github.com';

export type Eintrag = {
  gruppe: string;
  pfad: string;
  datei: string;
  titel: string;
  url: string | null;
  art: 'markdown' | 'json' | 'astro';
};

type Zustand = Zerlegt & {
  token: string;
  eintrag: Eintrag | null;
  /** Blob-SHA — sorgt dafür, dass ein Schreiben fremde Änderungen nicht überfährt. */
  sha: string;
  /** Dateiinhalt beim Öffnen; Vergleichsgrundlage für „geändert“. */
  original: string;
  json: unknown;
};

type GhFehler = Error & { status?: number };

export function starteRedaktion(): void {
  const el = <T extends HTMLElement = HTMLElement>(id: string) =>
    document.getElementById(id) as T;
  const zeigen = (knoten: HTMLElement | null, an: boolean) =>
    knoten?.classList.toggle('verborgen', !an);

  const REPO = document.querySelector<HTMLMetaElement>('meta[name="mu-repo"]')?.content ?? '';
  const BRANCH =
    document.querySelector<HTMLMetaElement>('meta[name="mu-branch"]')?.content ?? 'main';
  const DATEIEN: Eintrag[] = JSON.parse(el('mu-dateien')?.textContent ?? '[]');
  const GRUPPEN: string[] = JSON.parse(el('mu-gruppen')?.textContent ?? '[]');

  const zustand: Zustand = {
    token: '',
    eintrag: null,
    sha: '',
    original: '',
    kopfAnfang: '',
    kopf: '',
    kopfEnde: '',
    rumpf: '',
    json: null,
  };

  // =========================================================================
  // GitHub
  // =========================================================================

  async function gh(pfad: string, optionen: RequestInit = {}): Promise<any> {
    const antwort = await fetch(API + pfad, {
      ...optionen,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: 'Bearer ' + zustand.token,
        ...(optionen.headers ?? {}),
      },
    });
    const text = await antwort.text();
    let daten: any = null;
    try {
      daten = text ? JSON.parse(text) : null;
    } catch {
      /* GitHub antwortet im Fehlerfall gelegentlich mit HTML */
    }
    if (!antwort.ok) {
      const fehler = new Error(daten?.message ?? antwort.statusText) as GhFehler;
      fehler.status = antwort.status;
      throw fehler;
    }
    return daten;
  }

  const inhaltsPfad = (pfad: string) =>
    `/repos/${REPO}/contents/` + pfad.split('/').map(encodeURIComponent).join('/');

  const githubEditUrl = (pfad: string) =>
    `https://github.com/${REPO}/edit/${encodeURIComponent(BRANCH)}/` +
    pfad.split('/').map(encodeURIComponent).join('/');

  // =========================================================================
  // Zustand
  // =========================================================================

  function aktuellerText(): string {
    if (!zustand.eintrag) return '';
    if (zustand.eintrag.art === 'json') return JSON.stringify(zustand.json, null, 2) + '\n';
    return fuegeZusammen(zustand);
  }

  const geaendert = () => Boolean(zustand.eintrag) && aktuellerText() !== zustand.original;

  function zustandAuffrischen(): void {
    const dreckig = geaendert();
    el<HTMLButtonElement>('speichern').disabled = !dreckig;
    el<HTMLButtonElement>('verwerfen').disabled = !dreckig;
    const anzeige = el('kopf-zustand');
    anzeige.className = 'zustand';
    anzeige.textContent = zustand.eintrag
      ? dreckig
        ? '● nicht veröffentlicht'
        : 'gespeichert'
      : '';
  }

  let vorschauTimer: ReturnType<typeof setTimeout> | null = null;
  function vorschauAuffrischen(): void {
    if (zustand.eintrag?.art !== 'markdown') return;
    if (vorschauTimer) clearTimeout(vorschauTimer);
    vorschauTimer = setTimeout(() => {
      const titelFeld = kopfFelder(zustand.kopf).find((f) =>
        ['title', 'titel'].includes(f.schluessel)
      );
      const titel = titelFeld ? `<h1>${escapeHtml(klartext(titelFeld.roh))}</h1>` : '';
      el('vorschau').innerHTML = titel + mdZuHtml(zustand.rumpf);
    }, 140);
  }

  // =========================================================================
  // JSON-Formular
  // =========================================================================

  function leereKopie(vorlage: unknown): unknown {
    if (Array.isArray(vorlage)) return [];
    if (vorlage && typeof vorlage === 'object') {
      const neu: Record<string, unknown> = {};
      for (const k of Object.keys(vorlage)) neu[k] = leereKopie((vorlage as any)[k]);
      return neu;
    }
    if (typeof vorlage === 'number') return 0;
    if (typeof vorlage === 'boolean') return false;
    return '';
  }

  const anPfad = (wurzel: any, pfad: (string | number)[]) =>
    pfad.reduce((o: any, k) => o?.[k], wurzel);

  function setzeAnPfad(wurzel: any, pfad: (string | number)[], wert: unknown): void {
    anPfad(wurzel, pfad.slice(0, -1))[pfad[pfad.length - 1]!] = wert;
  }

  const BESCHRIFTUNG: Record<string, string> = {
    titel: 'Titel',
    title: 'Titel',
    untertitel: 'Untertitel',
    thema: 'Thema',
    autor: 'Autor',
    datum: 'Datum',
    aktualisiert: 'Aktualisiert',
    tags: 'Tags',
    kategorie: 'Kategorie',
    teaser: 'Teaser',
    frage: 'Frage',
    loesung: 'Lösung',
    text: 'Text',
    korrekt: 'richtig',
    deutung: 'Deutung',
    erklaerung: 'Erklärung',
    einfuehrung: 'Einführung',
    beschreibung: 'Beschreibung',
    punkte: 'Punkte',
    optionen: 'Optionen',
    fragen: 'Fragen',
    entwurf: 'Entwurf (wird nicht veröffentlicht)',
    klassenstufe: 'Klassenstufe',
    fehlvorstellungen: 'Fehlvorstellungen',
    whiteboardAufgaben: 'Whiteboard-Aufgaben',
    unterthemenBloecke: 'Unterthemen-Blöcke',
    didaktischerKontext: 'Didaktischer Kontext',
    didaktischerHinweis: 'Didaktischer Hinweis',
    klassenstufenAnzeige: 'Klassenstufen-Anzeige',
    klassenstufeBand: 'Klassenstufen-Band',
    blogTags: 'Blog-Tags',
    ordnung: 'Ordnung',
    kontext: 'Kontext',
    schwierigkeit: 'Schwierigkeit',
    abbildungFrage: 'Abbildung zur Frage (SVG)',
    abbildungLoesung: 'Abbildung zur Lösung (SVG)',
  };

  const beschriften = (k: string) => BESCHRIFTUNG[k] ?? k;

  function knopf(text: string, klasse: string, beiKlick: () => void): HTMLButtonElement {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = klasse;
    b.textContent = text;
    b.addEventListener('click', beiKlick);
    return b;
  }

  function jsonFeld(
    name: string,
    wert: unknown,
    pfad: (string | number)[],
    neuZeichnen: () => void
  ): HTMLElement {
    const huelle = document.createElement('div');

    if (typeof wert === 'boolean') {
      huelle.className = 'feld zeile';
      const kasten = document.createElement('input');
      kasten.type = 'checkbox';
      kasten.checked = wert;
      kasten.id = 'j-' + pfad.join('-');
      kasten.addEventListener('change', () => {
        setzeAnPfad(zustand.json, pfad, kasten.checked);
        zustandAuffrischen();
      });
      const marke = document.createElement('label');
      marke.htmlFor = kasten.id;
      marke.textContent = beschriften(name);
      huelle.append(kasten, marke);
      return huelle;
    }

    if (typeof wert === 'number') {
      huelle.className = 'feld';
      const marke = document.createElement('label');
      marke.textContent = beschriften(name);
      const eingabe = document.createElement('input');
      eingabe.type = 'number';
      eingabe.value = String(wert);
      eingabe.addEventListener('input', () => {
        const zahl = Number(eingabe.value);
        if (Number.isFinite(zahl)) {
          setzeAnPfad(zustand.json, pfad, zahl);
          zustandAuffrischen();
        }
      });
      huelle.append(marke, eingabe);
      return huelle;
    }

    if (typeof wert === 'string') {
      huelle.className = 'feld';
      const marke = document.createElement('label');
      marke.textContent = beschriften(name);
      const lang = wert.length > 70 || wert.includes('\n');
      const eingabe = document.createElement(lang ? 'textarea' : 'input') as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (eingabe instanceof HTMLInputElement) eingabe.type = 'text';
      else eingabe.rows = Math.min(14, Math.max(3, Math.ceil(wert.length / 70) + 1));
      eingabe.value = wert;
      eingabe.addEventListener('input', () => {
        setzeAnPfad(zustand.json, pfad, eingabe.value);
        zustandAuffrischen();
      });
      huelle.append(marke, eingabe);
      return huelle;
    }

    if (Array.isArray(wert)) {
      huelle.className = 'knoten';
      const kopf = document.createElement('div');
      kopf.className = 'knoten-kopf';
      const marke = document.createElement('span');
      marke.className = 'name';
      marke.textContent = `${beschriften(name)} (${wert.length})`;
      kopf.append(
        marke,
        knopf('+ hinzufügen', 'mini', () => {
          wert.push(wert.length ? leereKopie(wert[wert.length - 1]) : '');
          neuZeichnen();
        })
      );
      huelle.append(kopf);

      wert.forEach((posten, index) => {
        const kasten = document.createElement('div');
        kasten.className = 'posten';
        const pkopf = document.createElement('div');
        pkopf.className = 'posten-kopf';
        const nr = document.createElement('span');
        nr.className = 'nr';
        nr.textContent = '#' + (index + 1);

        const hoch = knopf('↑', 'mini', () => {
          [wert[index - 1], wert[index]] = [wert[index], wert[index - 1]];
          neuZeichnen();
        });
        hoch.disabled = index === 0;

        const runter = knopf('↓', 'mini', () => {
          [wert[index + 1], wert[index]] = [wert[index], wert[index + 1]];
          neuZeichnen();
        });
        runter.disabled = index === wert.length - 1;

        const weg = knopf('löschen', 'mini weg', () => {
          if (!confirm(`#${index + 1} wirklich löschen?`)) return;
          wert.splice(index, 1);
          neuZeichnen();
        });

        pkopf.append(nr, hoch, runter, weg);
        kasten.append(pkopf, jsonFeld('', posten, [...pfad, index], neuZeichnen));
        huelle.append(kasten);
      });
      return huelle;
    }

    if (wert && typeof wert === 'object') {
      huelle.className = name ? 'knoten' : '';
      if (name) {
        const kopf = document.createElement('div');
        kopf.className = 'knoten-kopf';
        const marke = document.createElement('span');
        marke.className = 'name';
        marke.textContent = beschriften(name);
        kopf.append(marke);
        huelle.append(kopf);
      }
      for (const k of Object.keys(wert)) {
        huelle.append(jsonFeld(k, (wert as any)[k], [...pfad, k], neuZeichnen));
      }
      return huelle;
    }

    // null — unverändert lassen, aber sichtbar machen
    huelle.className = 'feld';
    huelle.textContent = `${beschriften(name)}: (leer)`;
    return huelle;
  }

  // =========================================================================
  // Editor aufbauen
  // =========================================================================

  function baueJsonEditor(editor: HTMLElement): void {
    const titel = document.createElement('p');
    titel.className = 'abschnitt-titel';
    titel.textContent = 'Inhalt';
    const behaelter = document.createElement('div');
    editor.append(titel, behaelter);

    const zeichnen = () => {
      behaelter.innerHTML = '';
      behaelter.append(jsonFeld('', zustand.json, [], zeichnen));
      zustandAuffrischen();
    };
    zeichnen();

    const roh = document.createElement('details');
    roh.className = 'roh';
    roh.innerHTML = '<summary>Rohdaten (JSON)</summary>';
    const flaeche = document.createElement('textarea');
    flaeche.spellcheck = false;
    flaeche.value = JSON.stringify(zustand.json, null, 2);
    const meldung = document.createElement('div');
    meldung.className = 'zustand';
    flaeche.addEventListener('change', () => {
      try {
        zustand.json = JSON.parse(flaeche.value);
        meldung.textContent = 'übernommen';
        meldung.className = 'zustand gut';
        zeichnen();
      } catch (e) {
        meldung.textContent = 'Kein gültiges JSON: ' + (e as Error).message;
        meldung.className = 'zustand fehler';
      }
    });
    roh.addEventListener('toggle', () => {
      if (roh.open) flaeche.value = JSON.stringify(zustand.json, null, 2);
    });
    roh.append(flaeche, meldung);
    editor.append(roh);
  }

  /** Deutsche Beschriftung für das umgebende Element einer Textstelle. */
  const ELEMENTNAME: Record<string, string> = {
    h1: 'Überschrift 1',
    h2: 'Überschrift 2',
    h3: 'Überschrift 3',
    h4: 'Überschrift 4',
    p: 'Absatz',
    li: 'Listenpunkt',
    strong: 'Hervorhebung',
    em: 'Betonung',
    a: 'Link',
    span: 'Textstück',
    div: 'Textstück',
    button: 'Knopf',
    summary: 'Aufklapp-Titel',
    figcaption: 'Bildunterschrift',
    th: 'Tabellenkopf',
    td: 'Tabellenzelle',
    dt: 'Begriff',
    dd: 'Erläuterung',
    label: 'Feldbeschriftung',
    title: 'Seitentitel',
    beschreibung: 'Seitenbeschreibung (für Suchmaschinen)',
    alt: 'Bildbeschreibung',
    'aria-label': 'Beschriftung für Screenreader',
    placeholder: 'Platzhalter im Eingabefeld',
  };

  /**
   * Feste Seiten bestehen fast nur aus Auszeichnung. Die Redaktion zeigt
   * deshalb die Textstellen als Felder; das Gerüst bleibt unsichtbar und
   * unangetastet. Was die Erkennung nicht sicher greift, bleibt über die
   * Rohansicht darunter erreichbar.
   */
  function baueAstroEditor(editor: HTMLElement): void {
    let basis = zustand.rumpf;
    let stellen = findeTextstellen(basis);
    let werte: Array<string | null> = stellen.map(() => null);

    const uebernehmen = () => {
      zustand.rumpf = setzeTextstellen(basis, stellen, werte);
      zustandAuffrischen();
    };

    const hinweis = document.createElement('div');
    hinweis.className = 'hinweis';
    hinweis.innerHTML =
      '<strong>Feste Seite.</strong> Unten stehen die Texte dieser Seite, jeder für sich. ' +
      'Das Seitengerüst drumherum wird nicht angezeigt und bleibt unverändert — ' +
      'du kannst hier nichts am Aufbau zerbrechen. ' +
      'Wer doch ans Gerüst muss, klappt unten die Rohansicht auf.';

    const titel = document.createElement('p');
    titel.className = 'abschnitt-titel';
    const felder = document.createElement('div');
    editor.append(hinweis, titel, felder);

    const beschriften2 = (stelle: (typeof stellen)[number]) =>
      ELEMENTNAME[stelle.herkunft] ??
      (stelle.art === 'attribut' ? `${stelle.herkunft}=` : stelle.herkunft);

    const zeichneFelder = () => {
      felder.innerHTML = '';

      // Stücke desselben Absatzes stehen zusammen. Ein Satz mit <em> zerfällt
      // in mehrere Stellen; getrennt gezeigt wäre er nicht wiederzuerkennen.
      const gruppen: Array<{ schluessel: string; element: string; posten: number[] }> = [];
      stellen.forEach((stelle, i) => {
        const letzte = gruppen[gruppen.length - 1];
        if (letzte && letzte.schluessel === stelle.gruppe) letzte.posten.push(i);
        else gruppen.push({ schluessel: stelle.gruppe, element: stelle.gruppenElement, posten: [i] });
      });

      titel.textContent = `Texte dieser Seite (${gruppen.length})`;

      for (const gruppe of gruppen) {
        const mehrteilig = gruppe.posten.length > 1;
        const kasten = document.createElement(mehrteilig ? 'fieldset' : 'div');
        kasten.className = mehrteilig ? 'textgruppe' : 'feld';

        if (mehrteilig) {
          const marke = document.createElement('legend');
          marke.textContent =
            (ELEMENTNAME[gruppe.element] ?? gruppe.element) + ` · ${gruppe.posten.length} Teile`;
          kasten.append(marke);
        }

        for (const i of gruppe.posten) {
          const stelle = stellen[i];
          const anzeige = zurAnzeige(alsZeile(stelle.roh));

          const huelle = mehrteilig ? document.createElement('div') : kasten;
          if (mehrteilig) huelle.className = 'feld';

          const marke = document.createElement('label');
          marke.textContent = beschriften2(stelle);
          const lang = anzeige.length > 70;
          const eingabe = document.createElement(lang ? 'textarea' : 'input') as
            | HTMLInputElement
            | HTMLTextAreaElement;
          if (eingabe instanceof HTMLInputElement) eingabe.type = 'text';
          else eingabe.rows = Math.min(10, Math.ceil(anzeige.length / 90) + 1);
          eingabe.value = anzeige;
          eingabe.spellcheck = true;
          eingabe.addEventListener('input', () => {
            // Unverändert heißt: das Original zeichengenau übernehmen. Nur
            // wirklich Geändertes wird neu kodiert.
            werte[i] = eingabe.value === anzeige ? null : zurDatei(eingabe.value, stelle.art);
            uebernehmen();
          });

          huelle.append(marke, eingabe);
          if (mehrteilig) kasten.append(huelle);
        }

        felder.append(kasten);
      }
    };

    zeichneFelder();

    const roh = document.createElement('details');
    roh.className = 'roh';
    roh.innerHTML = '<summary>Rohansicht mit Seitengerüst</summary>';
    const flaeche = document.createElement('textarea');
    flaeche.spellcheck = false;
    flaeche.value = zustand.rumpf;
    flaeche.addEventListener('change', () => {
      zustand.rumpf = flaeche.value;
      basis = flaeche.value;
      stellen = findeTextstellen(basis);
      werte = stellen.map(() => null);
      zeichneFelder();
      zustandAuffrischen();
    });
    roh.addEventListener('toggle', () => {
      if (roh.open) flaeche.value = zustand.rumpf;
    });
    roh.append(flaeche);
    editor.append(roh);
  }

  function baueMarkdownEditor(editor: HTMLElement): void {
    const kopfTitel = document.createElement('p');
    kopfTitel.className = 'abschnitt-titel';
    kopfTitel.textContent = 'Angaben';
    const angaben = document.createElement('div');
    editor.append(kopfTitel, angaben);

    const rohBlock = document.createElement('details');
    rohBlock.className = 'roh';
    rohBlock.innerHTML = '<summary>Alle Angaben als Rohtext (YAML)</summary>';
    const rohFlaeche = document.createElement('textarea');
    rohFlaeche.spellcheck = false;

    const schreibe = (feld: KopfFeld, neu: string | boolean | string[]) => {
      zustand.kopf = setzeFeld(zustand.kopf, feld, neu);
      rohFlaeche.value = zustand.kopf;
      zustandAuffrischen();
      vorschauAuffrischen();
    };

    const zeichneAngaben = () => {
      angaben.innerHTML = '';
      const felder = kopfFelder(zustand.kopf);
      if (!felder.length) {
        const leer = document.createElement('p');
        leer.className = 'zustand';
        leer.textContent = 'Keine einfachen Angaben erkannt — siehe Rohtext unten.';
        angaben.append(leer);
      }

      for (const feld of felder) {
        const art = wertArt(feld.roh);
        const wert = klartext(feld.roh);
        const huelle = document.createElement('div');

        if (art === 'bool') {
          huelle.className = 'feld zeile';
          const kasten = document.createElement('input');
          kasten.type = 'checkbox';
          kasten.checked = wert === 'true';
          kasten.id = 'fm-' + feld.schluessel;
          kasten.addEventListener('change', () => schreibe(feld, kasten.checked));
          const marke = document.createElement('label');
          marke.htmlFor = kasten.id;
          marke.textContent = beschriften(feld.schluessel);
          huelle.append(kasten, marke);
          angaben.append(huelle);
          continue;
        }

        huelle.className = 'feld';
        const marke = document.createElement('label');
        marke.textContent = beschriften(feld.schluessel);
        let eingabe: HTMLInputElement | HTMLTextAreaElement;

        if (art === 'liste') {
          const einzeilig = document.createElement('input');
          einzeilig.type = 'text';
          einzeilig.value = (JSON.parse(feld.roh) as string[]).join(', ');
          einzeilig.addEventListener('input', () =>
            schreibe(
              feld,
              einzeilig.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          );
          marke.textContent += ' (mit Komma trennen)';
          eingabe = einzeilig;
        } else if (art === 'datum' || art === 'zahl') {
          const einzeilig = document.createElement('input');
          einzeilig.type = art === 'datum' ? 'date' : 'number';
          einzeilig.value = wert;
          einzeilig.addEventListener('input', () => schreibe(feld, einzeilig.value));
          eingabe = einzeilig;
        } else if (wert.length > 70) {
          const mehrzeilig = document.createElement('textarea');
          mehrzeilig.rows = Math.min(10, Math.ceil(wert.length / 80) + 1);
          mehrzeilig.value = wert;
          mehrzeilig.addEventListener('input', () => schreibe(feld, mehrzeilig.value));
          eingabe = mehrzeilig;
        } else {
          const einzeilig = document.createElement('input');
          einzeilig.type = 'text';
          einzeilig.value = wert;
          einzeilig.addEventListener('input', () => schreibe(feld, einzeilig.value));
          eingabe = einzeilig;
        }

        huelle.append(marke, eingabe);
        angaben.append(huelle);
      }
    };

    rohFlaeche.value = zustand.kopf;
    rohFlaeche.addEventListener('change', () => {
      zustand.kopf = rohFlaeche.value;
      zeichneAngaben();
      zustandAuffrischen();
      vorschauAuffrischen();
    });
    rohBlock.append(rohFlaeche);

    zeichneAngaben();
    editor.append(rohBlock);

    const textTitel = document.createElement('p');
    textTitel.className = 'abschnitt-titel';
    textTitel.textContent = 'Text';
    const feld = document.createElement('div');
    feld.className = 'rumpf-feld';
    const flaeche = document.createElement('textarea');
    flaeche.spellcheck = true;
    flaeche.value = zustand.rumpf;
    flaeche.addEventListener('input', () => {
      zustand.rumpf = flaeche.value;
      zustandAuffrischen();
      vorschauAuffrischen();
    });
    feld.append(flaeche);
    editor.append(textTitel, feld);

    vorschauAuffrischen();
  }

  function baueEditor(): void {
    const editor = el('editor');
    editor.innerHTML = '';
    const art = zustand.eintrag?.art;
    const mitVorschau = art === 'markdown';

    zeigen(el('vorschau-spalte'), mitVorschau);
    el('zwei').classList.toggle('einspaltig', !mitVorschau);

    if (art === 'json') baueJsonEditor(editor);
    else if (art === 'astro') baueAstroEditor(editor);
    else baueMarkdownEditor(editor);
  }

  // =========================================================================
  // Öffnen, Veröffentlichen, Verwerfen
  // =========================================================================

  function markiereListe(pfad: string): void {
    for (const k of document.querySelectorAll<HTMLElement>('.datei-knopf')) {
      k.setAttribute('aria-current', String(k.dataset.pfad === pfad));
    }
  }

  async function oeffne(eintrag: Eintrag): Promise<void> {
    if (geaendert() && !confirm('Es gibt nicht veröffentlichte Änderungen. Trotzdem wechseln?')) {
      return;
    }

    el('kopf-pfad').textContent = eintrag.pfad;
    el('editor').innerHTML = '<p class="platzhalter">Wird geladen…</p>';

    try {
      const daten = await gh(`${inhaltsPfad(eintrag.pfad)}?ref=${encodeURIComponent(BRANCH)}`);
      const roh = b64ZuText(daten.content);

      zustand.eintrag = eintrag;
      zustand.sha = daten.sha;
      zustand.original = roh;
      zustand.json = null;
      Object.assign(zustand, { kopfAnfang: '', kopf: '', kopfEnde: '', rumpf: roh });

      if (eintrag.art === 'json') {
        zustand.json = JSON.parse(roh);
        // Vergleichsgrundlage ist die normalisierte Fassung — sonst gilt eine
        // Datei mit anderer Einrückung sofort als geändert.
        zustand.original = JSON.stringify(zustand.json, null, 2) + '\n';
      } else if (eintrag.art === 'markdown') {
        Object.assign(zustand, zerlege(roh));
      }

      const ansehen = el<HTMLAnchorElement>('ansehen');
      ansehen.hidden = !eintrag.url;
      if (eintrag.url) ansehen.href = eintrag.url;

      baueEditor();
      zustandAuffrischen();
      markiereListe(eintrag.pfad);
    } catch (fehler) {
      el('editor').innerHTML =
        '<div class="hinweis fehler"><strong>Konnte nicht geladen werden.</strong><br>' +
        `${escapeHtml((fehler as Error).message)}</div>`;
      zustand.eintrag = null;
      zustandAuffrischen();
    }
  }

  async function veroeffentliche(): Promise<void> {
    if (!zustand.eintrag || !geaendert()) return;
    const speichern = el<HTMLButtonElement>('speichern');
    const anzeige = el('kopf-zustand');
    speichern.disabled = true;
    anzeige.className = 'zustand';
    anzeige.textContent = 'wird veröffentlicht…';

    const text = aktuellerText();
    try {
      const antwort = await gh(inhaltsPfad(zustand.eintrag.pfad), {
        method: 'PUT',
        body: JSON.stringify({
          message: `Redaktion: ${zustand.eintrag.titel} (${zustand.eintrag.datei})`,
          content: textZuB64(text),
          sha: zustand.sha,
          branch: BRANCH,
        }),
      });
      zustand.sha = antwort.content.sha;
      zustand.original = text;
      anzeige.className = 'zustand gut';
      anzeige.innerHTML =
        'veröffentlicht — in etwa zwei Minuten live ' +
        `(<a href="https://github.com/${REPO}/actions" target="_blank" rel="noopener">Stand</a>)`;
      zustandAuffrischen();
    } catch (fehler) {
      const status = (fehler as GhFehler).status;
      anzeige.className = 'zustand fehler';
      if (status === 409) {
        anzeige.textContent = 'Konflikt: Die Datei wurde anderswo geändert. Seite neu laden.';
      } else if (status === 401 || status === 403) {
        anzeige.textContent = 'Dem Token fehlt die Schreibberechtigung (Contents: Read and write).';
      } else {
        anzeige.textContent = 'Fehler: ' + (fehler as Error).message;
      }
      speichern.disabled = false;
    }
  }

  function verwerfe(): void {
    if (!zustand.eintrag) return;
    if (!confirm('Alle Änderungen an dieser Datei verwerfen?')) return;
    const roh = zustand.original;
    if (zustand.eintrag.art === 'json') zustand.json = JSON.parse(roh);
    else if (zustand.eintrag.art === 'markdown') Object.assign(zustand, zerlege(roh));
    else zustand.rumpf = roh;
    baueEditor();
    zustandAuffrischen();
  }

  // =========================================================================
  // Dateiliste
  // =========================================================================

  function zeichneListe(suchbegriff = ''): void {
    const behaelter = el('dateiliste');
    behaelter.innerHTML = '';
    const suche = suchbegriff.trim().toLowerCase();

    for (const gruppe of GRUPPEN) {
      const treffer = DATEIEN.filter(
        (d) =>
          d.gruppe === gruppe &&
          (!suche ||
            d.titel.toLowerCase().includes(suche) ||
            d.datei.toLowerCase().includes(suche))
      );
      if (!treffer.length) continue;

      const titel = document.createElement('div');
      titel.className = 'gruppe-titel';
      titel.textContent = `${gruppe} (${treffer.length})`;
      behaelter.append(titel);

      for (const eintrag of treffer) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'datei-knopf';
        b.dataset.pfad = eintrag.pfad;
        b.setAttribute('aria-current', String(zustand.eintrag?.pfad === eintrag.pfad));
        b.innerHTML =
          `${escapeHtml(eintrag.titel)}<span class="dn">${escapeHtml(eintrag.datei)}</span>`;
        b.addEventListener('click', () => void oeffne(eintrag));
        behaelter.append(b);
      }
    }
  }

  /**
   * `/admin?datei=…` — kommt von Strg+Shift+E auf einer beliebigen Seite.
   * Nicht jede Quelldatei ist hier geführt (etwa die Übungsgeneratoren);
   * dafür bleibt der Weg über GitHub.
   */
  function oeffneAusAdresse(): void {
    const gewuenscht = new URLSearchParams(location.search).get('datei');
    if (!gewuenscht) return;

    const treffer = DATEIEN.find((d) => d.pfad === gewuenscht);
    if (treffer) {
      void oeffne(treffer);
      return;
    }

    el('kopf-pfad').textContent = gewuenscht;
    el('editor').innerHTML =
      '<div class="hinweis"><strong>Diese Datei führt die Redaktion nicht.</strong><br>' +
      `<code>${escapeHtml(gewuenscht)}</code> ist eine Seite mit überwiegend Programmtext. ` +
      `<a href="${githubEditUrl(gewuenscht)}" target="_blank" rel="noopener">Auf GitHub bearbeiten</a> ` +
      '— oder links eine der geführten Dateien wählen.</div>';
  }

  // =========================================================================
  // Anmeldung
  // =========================================================================

  async function anmelden(token: string): Promise<void> {
    zustand.token = token;
    const zeile = el('tor-zustand');
    zeile.className = 'zustand';
    zeile.textContent = 'wird geprüft…';
    try {
      await gh(`/repos/${REPO}`);
      localStorage.setItem(TOKEN_SCHLUESSEL, token);
      zeigen(el('tor'), false);
      zeigen(el('kopf'), true);
      zeigen(el('raster'), true);
      zeichneListe();
      oeffneAusAdresse();
    } catch (fehler) {
      zustand.token = '';
      const status = (fehler as GhFehler).status;
      zeile.className = 'zustand fehler';
      zeile.textContent =
        status === 401
          ? 'Token wird nicht angenommen.'
          : status === 404
            ? `Kein Zugriff auf ${REPO} — beim Token das Repository freigeben.`
            : 'Fehler: ' + (fehler as Error).message;
    }
  }

  function abmelden(): void {
    if (geaendert() && !confirm('Es gibt nicht veröffentlichte Änderungen. Trotzdem abmelden?')) {
      return;
    }
    localStorage.removeItem(TOKEN_SCHLUESSEL);
    location.href = location.pathname;
  }

  // =========================================================================
  // Verdrahtung
  // =========================================================================

  el('anmelden').addEventListener('click', () => {
    const token = el<HTMLInputElement>('token-eingabe').value.trim();
    if (token) void anmelden(token);
  });
  el('token-eingabe').addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') el('anmelden').click();
  });
  el('speichern').addEventListener('click', () => void veroeffentliche());
  el('verwerfen').addEventListener('click', verwerfe);
  el('abmelden').addEventListener('click', abmelden);
  el('filter').addEventListener('input', (e) =>
    zeichneListe((e.target as HTMLInputElement).value)
  );

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      void veroeffentliche();
    }
  });

  window.addEventListener('beforeunload', (e) => {
    if (!geaendert()) return;
    e.preventDefault();
    e.returnValue = '';
  });

  const gemerkt = localStorage.getItem(TOKEN_SCHLUESSEL);
  if (gemerkt) void anmelden(gemerkt);
}
