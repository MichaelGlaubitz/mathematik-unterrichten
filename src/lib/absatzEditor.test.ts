// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { absatzZurDatei, pruefeAbsatz } from './astroText';
import { bereinigeMarkup, domZuMarkup, linkZielGueltig, textZuMarkup } from './absatzEditor';

const durch = (roh: string) => bereinigeMarkup(roh, document);

describe('textZuMarkup', () => {
  it('maskiert, was die Seite zerlegen würde', () => {
    expect(textZuMarkup('a < b')).toBe('a &lt; b');
    expect(textZuMarkup('Menge {1, 2}')).toBe('Menge &#123;1, 2&#125;');
    expect(textZuMarkup('Meyer & Co')).toBe('Meyer &amp; Co');
  });

  it('lässt ein Größer-als stehen — als Text ist es harmlos', () => {
    expect(textZuMarkup('a > b')).toBe('a > b');
  });
});

describe('domZuMarkup: erlaubte Auszeichnung', () => {
  it('behält Hervorhebung und Betonung', () => {
    expect(durch('Sie zeigen, <em>wie</em> es geht.')).toBe('Sie zeigen, <em>wie</em> es geht.');
    expect(durch('<strong>Fett</strong>')).toBe('<strong>Fett</strong>');
  });

  it('behält einen Link samt erlaubter Attribute', () => {
    expect(durch('Das <a href="/konzept" title="Mehr">KLAR-Konzept</a>')).toBe(
      'Das <a href="/konzept" title="Mehr">KLAR-Konzept</a>'
    );
  });

  it('behält Verschachtelung', () => {
    expect(durch('<strong>Das <a href="/k">KLAR</a></strong> – Rest')).toBe(
      '<strong>Das <a href="/k">KLAR</a></strong> – Rest'
    );
  });

  it('behält einen Zeilenumbruch', () => {
    expect(durch('Zeile<br />Zeile')).toBe('Zeile<br />Zeile');
  });
});

describe('domZuMarkup: was der Browser beim Formatieren erzeugt', () => {
  it('macht aus <b> und <i> die Hausform', () => {
    expect(durch('<b>fett</b> und <i>kursiv</i>')).toBe('<strong>fett</strong> und <em>kursiv</em>');
  });

  it('packt eine Hülle mit Stilangabe aus', () => {
    expect(durch('<span style="color: red">Text</span>')).toBe('Text');
    expect(durch('<font face="Arial">Text</font>')).toBe('Text');
  });

  it('packt eingefügte Blockelemente aus, statt sie zu übernehmen', () => {
    expect(durch('<div>Erste</div>')).toBe('Erste');
    expect(durch('<p>Text aus der Zwischenablage</p>')).toBe('Text aus der Zwischenablage');
  });

  it('wirft leere Hüllen weg', () => {
    expect(durch('<strong></strong>Text')).toBe('Text');
    expect(durch('<em>  </em>Text')).toBe('Text');
  });
});

describe('domZuMarkup: was nicht durchkommt', () => {
  it('lässt kein Skript zurück', () => {
    expect(durch('<script>boese()</script>Text')).toBe('Text');
    expect(durch('Vor<script>boese()</script>Nach')).toBe('VorNach');
  });

  it('entfernt Ereignis-Attribute', () => {
    expect(durch('<a href="/x" onclick="boese()">Text</a>')).toBe('<a href="/x">Text</a>');
  });

  it('entfernt einen Link auf javascript:', () => {
    // Das Ziel fällt weg; damit trägt der Link nichts mehr und wird ausgepackt.
    expect(durch('<a href="javascript:alert(1)">Klick</a>')).toBe('Klick');
  });

  it('übernimmt kein Bild und keinen Rahmen', () => {
    expect(durch('Vor<img src="/x.jpg" alt="B">Nach')).toBe('VorNach');
    expect(durch('<iframe src="https://fremd.de"></iframe>Text')).toBe('Text');
  });

  it('lässt aus einem Kleiner-als kein Element werden', () => {
    // So kommt es aus der Zwischenablage als Text an.
    const huelle = document.createElement('div');
    huelle.append(document.createTextNode('für a < b gilt'));
    expect(domZuMarkup(huelle)).toBe('für a &lt; b gilt');
  });
});

describe('domZuMarkup: Rundgang', () => {
  const proben = [
    'Ganz ohne Auszeichnung.',
    'Sie zeigen, <em>wie</em> es geht.',
    '<strong>Das <a href="/konzept">KLAR-Konzept</a></strong> – der Ablauf.',
    'Zeile<br />Zeile',
    'Menge &#123;1, 2&#125; und a &lt; b',
    'Meyer &amp; Co',
    'Ein <q lang="en">Zitat</q> mittendrin.',
  ];

  it('bleibt beim zweiten Durchgang gleich', () => {
    for (const probe of proben) {
      const einmal = durch(probe);
      expect(durch(einmal)).toBe(einmal);
    }
  });

  it('lässt bereits gespeicherte Auszeichnung unverändert', () => {
    for (const probe of proben) {
      expect(durch(probe)).toBe(probe);
    }
  });

  it('erzeugt nur, was die Prüfung annimmt', () => {
    const boesartig = [
      '<script>x()</script>',
      '<a href="javascript:x()">y</a>',
      '<div onclick="x()">y</div>',
      '<em>ohne Ende',
      '<img src=x onerror=alert(1)>',
      '<span style="position:fixed">y</span>',
    ];
    for (const probe of [...proben, ...boesartig]) {
      const markup = durch(probe);
      expect(pruefeAbsatz(markup)).toBeNull();
      // Und der Weg in die Datei ändert daran nichts mehr.
      expect(absatzZurDatei(markup)).toBe(markup);
    }
  });
});

describe('linkZielGueltig', () => {
  it('nimmt seiteneigene Pfade, http(s) und mailto', () => {
    expect(linkZielGueltig('/konzept')).toBe(true);
    expect(linkZielGueltig('#abschnitt')).toBe(true);
    expect(linkZielGueltig('https://mrbartonmaths.com/')).toBe(true);
    expect(linkZielGueltig('mailto:kontakt@mathematik-unterrichten.de')).toBe(true);
  });

  it('weist javascript: und Unbrauchbares ab', () => {
    expect(linkZielGueltig('javascript:alert(1)')).toBe(false);
    expect(linkZielGueltig('  JavaScript:alert(1)')).toBe(false);
    expect(linkZielGueltig('')).toBe(false);
    expect(linkZielGueltig('konzept')).toBe(false);
  });
});
