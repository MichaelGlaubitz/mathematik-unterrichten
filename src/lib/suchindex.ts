import { getCollection } from 'astro:content';
import { werkzeuge, werkzeugPfad } from './werkzeuge';
import { methoden } from './methoden';
import { kiPrompts } from './kiPrompts';

/**
 * Baut den Suchindex für die Volltextsuche.
 *
 * Der Index wird beim Build einmal als statische JSON-Datei erzeugt
 * (`/suchindex.json`) und im Browser durchsucht – kein Server, keine
 * externe Suchmaschine, keine Anfragen beim Tippen.
 */

export type Bereich =
  | 'Blog'
  | 'Aufgabe'
  | 'Stundenverlauf'
  | 'Diagnosefrage'
  | 'Thema'
  | 'Fehlvorstellung'
  | 'Werkzeug'
  | 'Methode'
  | 'KI-Prompt'
  | 'Handreichung'
  | 'Seite';

export interface Sucheintrag {
  /** Überschrift des Treffers. */
  t: string;
  /** Ziel-URL. */
  u: string;
  /** Bereich (für Filter und Kennzeichnung). */
  b: Bereich;
  /** Kurzbeschreibung, wird im Treffer angezeigt. */
  s: string;
  /** Zusätzliche Suchbegriffe, die nicht angezeigt werden. */
  k?: string;
}

/** Entfernt KaTeX-/Markdown-Reste, damit die Suche auf Klartext arbeitet. */
function klartext(s: string): string {
  return s
    .replace(/\$\$?([^$]*)\$\$?/g, '$1')
    .replace(/\\t?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
    .replace(/\\sqrt\{([^}]*)\}/g, 'wurzel $1')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}\\*_`#]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function kuerzen(s: string, laenge = 190): string {
  const text = klartext(s);
  return text.length <= laenge ? text : text.slice(0, laenge - 1).replace(/\s\S*$/, '') + '…';
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Statische Seiten, die keine Content-Collection haben. */
const seiten: Sucheintrag[] = [
  {
    t: 'Das KLAR-Konzept',
    u: '/konzept',
    b: 'Seite',
    s: 'Klären, Lösen lassen, Abgleichen, Rückkoppeln – der diagnosegeleitete Stundenablauf in vier Schritten.',
    k: 'methode konzept glaubitz unterrichtsablauf stundenverlauf diagnose',
  },
  {
    t: 'Werkzeugkasten',
    u: '/werkzeuge',
    b: 'Seite',
    s: 'Alle Unterrichtswerkzeuge auf einen Blick – ohne Login, ohne Installation, offline nutzbar.',
    k: 'tools software beamer',
  },
  {
    t: 'Methodenkoffer',
    u: '/methoden',
    b: 'Seite',
    s: 'Unterrichtsmethoden mit je drei Schritten für morgen früh, Stolperstein und Forschungsbeleg.',
    k: 'methoden übersicht',
  },
  {
    t: 'Fehlvorstellungs-Katalog',
    u: '/fehlvorstellungen',
    b: 'Seite',
    s: 'Typische Fehlvorstellungen von Klasse 5 bis zur Oberstufe – mit Ursache und Gegenmittel.',
    k: 'fehler misconception diagnose katalog',
  },
  {
    t: 'KI im Mathematikunterricht',
    u: '/ki',
    b: 'Seite',
    s: 'Erprobte Prompts zum Kopieren – mit dem Hinweis, was vor dem Einsatz zu prüfen ist.',
    k: 'künstliche intelligenz chatgpt claude prompt sprachmodell',
  },
  {
    t: 'Fortbildung',
    u: '/fortbildung',
    b: 'Seite',
    s: 'Fachdidaktische Fortbildungen für Fachschaften, Kollegien und Studienseminare.',
    k: 'schilf schulinterne lehrerfortbildung seminar vortrag kollegium',
  },
  {
    t: 'Schnellstart',
    u: '/schnellstart',
    b: 'Seite',
    s: 'Was Sie brauchen, wenn die Stunde in zwanzig Minuten anfängt.',
    k: 'sofort vertretungsstunde spontan einstieg',
  },
  {
    t: 'Themenübersicht',
    u: '/themen',
    b: 'Seite',
    s: 'Alle Themen von Klasse 5 bis zur Oberstufe mit Übungsgeneratoren und Mini-Whiteboard-Aufgaben.',
    k: 'übersicht lehrplan inhalte',
  },
  {
    t: 'Handreichungen für die Ausbildung',
    u: '/ausb/',
    b: 'Seite',
    s: 'Handreichungen für Referendarinnen und Referendare im Fach Mathematik.',
    k: 'referendariat studienseminar vorbereitungsdienst lehrprobe',
  },
  {
    t: 'Über diese Seite',
    u: '/ueber',
    b: 'Seite',
    s: 'Wer hier schreibt und warum.',
    k: 'glaubitz autor impressum person',
  },
  {
    t: 'Kontakt',
    u: '/kontakt',
    b: 'Seite',
    s: 'Nachricht schreiben.',
    k: 'e-mail schreiben anfrage',
  },
];

/** Handreichungen unter public/ausb/ – statische Dateien ohne Collection. */
const handreichungen: Sucheintrag[] = [
  {
    t: 'Handreichung: Lernziele formulieren',
    u: '/ausb/handreichung-lernziele.html',
    b: 'Handreichung',
    s: 'Überprüfbare Feinlernziele im Fach Mathematik – mit Leitfaden und Beispielen.',
    k: 'lernziel feinlernziel operationalisieren entwurf unterrichtsentwurf',
  },
  {
    t: 'Handreichung: Produktive Unterrichtsgespräche',
    u: '/ausb/handreichung-pu.html',
    b: 'Handreichung',
    s: 'Die 5 Praktiken nach Smith & Stein: anticipate, monitor, select, sequence, connect.',
    k: '5 praktiken gesprächsführung sicherung plenum smith stein',
  },
  {
    t: 'Handreichung: Prüfungsunterricht',
    u: '/ausb/handreichung-pruefungsunterricht.html',
    b: 'Handreichung',
    s: 'Struktur des idealen Mathematik-Prüfungsunterrichts für Lehrproben.',
    k: 'lehrprobe prüfungsstunde examen unterrichtsbesuch',
  },
  {
    t: 'Handreichung: Open Middle Math',
    u: '/ausb/handreichung-open-middle.html',
    b: 'Handreichung',
    s: 'Aufgaben mit festem Anfang, festem Ende und vielen Wegen dazwischen.',
    k: 'open middle differenzierung problemlösen',
  },
  {
    t: 'Handreichung: Mathe-Trails & MathCityMap',
    u: '/ausb/handreichung-mathe-trails.html',
    b: 'Handreichung',
    s: 'Mathematikaufgaben an realen Orten – Planung und digitale Unterstützung.',
    k: 'mathcitymap außerschulisch modellieren schulhof',
  },
  {
    t: 'Handreichung: Denkendes Klassenzimmer',
    u: '/ausb/handreichung-denkende-klassenzimmer.html',
    b: 'Handreichung',
    s: 'Zufallsgruppen, senkrechte Flächen, mündliche Aufträge nach Liljedahl.',
    k: 'liljedahl building thinking classrooms gruppenarbeit whiteboards',
  },
  {
    t: 'Handreichung: Stundenverlaufsplan',
    u: '/ausb/handreichung-stundenverlaufsplan.html',
    b: 'Handreichung',
    s: 'Aufbau und Fallstricke des Verlaufsplans im Unterrichtsentwurf.',
    k: 'verlaufsplan tabelle entwurf phasen',
  },
];

export async function baueSuchindex(): Promise<Sucheintrag[]> {
  const eintraege: Sucheintrag[] = [...seiten, ...handreichungen];

  const blog = await getCollection('blog', ({ data }) => !data.entwurf);
  for (const e of blog) {
    eintraege.push({
      t: e.data.title,
      u: `/blog/${e.slug}`,
      b: 'Blog',
      s: kuerzen(e.data.teaser),
      k: [e.data.kategorie, ...(e.data.tags ?? []), e.data.untertitel ?? ''].join(' '),
    });
  }

  const aufgaben = await getCollection('aufgaben', ({ data }) => !data.entwurf);
  for (const e of aufgaben) {
    eintraege.push({
      t: e.data.titel,
      u: `/aufgaben/${e.slug}`,
      b: 'Aufgabe',
      s: kuerzen(e.data.didaktischerHinweis),
      k: [e.data.thema, `Klasse ${e.data.klassenstufe.join(' ')}`, e.data.schwierigkeit, ...(e.data.tags ?? [])].join(' '),
    });
  }

  const stunden = await getCollection('stunden', ({ data }) => !data.entwurf);
  for (const e of stunden) {
    eintraege.push({
      t: e.data.titel,
      u: `/stunden/${e.slug}`,
      b: 'Stundenverlauf',
      s: kuerzen(e.data.kurz),
      // Stundenziel, Phasentitel und Exit-Fragen mitindizieren: So findet man
      // eine Stunde auch über das, was in ihr passiert.
      k: [
        e.data.thema,
        `Klasse ${e.data.klassenstufe.join(' ')}`,
        `${e.data.dauer} Minuten`,
        klartext(e.data.stundenziel),
        ...e.data.phasen.map((f) => f.titel),
        ...e.data.exitTicket.map((f) => klartext(f)),
        ...(e.data.tags ?? []),
      ].join(' '),
    });
  }

  const quizzes = await getCollection('quizzes', ({ data }) => !data.entwurf);
  for (const e of quizzes) {
    eintraege.push({
      t: e.data.titel,
      u: `/quizzes/${e.id}`,
      b: 'Diagnosefrage',
      s: kuerzen(e.data.didaktischerKontext),
      // Fragetexte mitindizieren: So findet man ein Quiz auch über die Aufgabe darin.
      k: [e.data.thema, `Klasse ${e.data.klassenstufe.join(' ')}`, ...e.data.fragen.map((f) => klartext(f.frage))].join(' '),
    });
  }

  const themen = await getCollection('themen', ({ data }) => !data.entwurf);
  for (const e of themen) {
    const slug = slugify(e.data.thema);
    eintraege.push({
      t: e.data.titel,
      u: `/themen#thema-${slug}`,
      b: 'Thema',
      s: kuerzen(e.data.einfuehrung),
      k: [e.data.klassenstufenAnzeige, ...(e.data.blogTags ?? [])].join(' '),
    });
    for (const fv of e.data.fehlvorstellungen) {
      eintraege.push({
        t: klartext(fv),
        u: `/fehlvorstellungen#thema-${slug}`,
        b: 'Fehlvorstellung',
        s: `Typische Fehlvorstellung im Thema ${e.data.titel} · ${e.data.klassenstufenAnzeige}`,
        k: e.data.thema,
      });
    }
  }

  for (const w of werkzeuge) {
    eintraege.push({
      t: w.titel,
      u: werkzeugPfad(w),
      b: 'Werkzeug',
      s: w.kurz,
      k: [w.kategorie, w.einsatz, w.stufe, ...w.schlagwoerter].join(' '),
    });
  }

  for (const m of methoden) {
    eintraege.push({
      t: m.name,
      u: `/methoden#${m.slug}`,
      b: 'Methode',
      s: m.kurz,
      k: [m.feld, m.dauer, klartext(m.wofuer)].join(' '),
    });
  }

  for (const p of kiPrompts) {
    eintraege.push({
      t: p.titel,
      u: `/ki#${p.slug}`,
      b: 'KI-Prompt',
      s: p.zweck,
      k: [p.feld, 'prompt ki chatgpt', p.prompt.slice(0, 260)].join(' '),
    });
  }

  return eintraege;
}
