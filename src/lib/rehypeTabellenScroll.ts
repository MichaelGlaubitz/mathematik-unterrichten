import type { Root, Element, Parent } from 'hast';

/**
 * Legt jede Tabelle aus Markdown in einen eigenen Rahmen, der waagerecht
 * rollen darf.
 *
 * Ohne das schiebt eine breite Tabelle die ganze Seite zur Seite – auf einem
 * Telefon war das zuletzt ein halber Bildschirm. Die Alternative wäre
 * `display: block` an der Tabelle selbst; das nimmt ihr aber die Tabellen-
 * bedeutung für Vorleseprogramme. Der Rahmen kostet nichts und behält sie.
 */
export function rehypeTabellenScroll() {
  return (baum: Root) => {
    const gehe = (knoten: Parent) => {
      const kinder = knoten.children;
      for (let i = 0; i < kinder.length; i++) {
        const kind = kinder[i] as Element;
        if (kind && kind.type === 'element') {
          if (kind.tagName === 'table') {
            kinder[i] = {
              type: 'element',
              tagName: 'div',
              properties: { className: ['mu-tabelle-scroll'] },
              children: [kind],
            } as Element;
            continue;
          }
          if (kind.children) gehe(kind as unknown as Parent);
        }
      }
    };
    gehe(baum as unknown as Parent);
  };
}
