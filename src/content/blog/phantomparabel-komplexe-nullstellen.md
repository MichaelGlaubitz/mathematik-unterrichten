---
title: "Die Phantomparabel: komplexe Nullstellen sichtbar machen"
untertitel: "Klappen und drehen"
autor: "Michael Glaubitz"
datum: 2026-10-04
tags: ["Quadratische Funktionen", "Nullstellen", "Komplexe Zahlen", "Visualisierung", "Mathe-AG"]
kategorie: "Didaktik"
teaser: "Jede quadratische Funktion hat zwei Nullstellen, auch wenn ihr Graph die x-Achse nie berührt. Mit einem kleinen Gespenst, der Phantomparabel, lassen sich auch die komplexen Nullstellen zeigen."
bild: "/blog/phantomparabel/schritt-4.png"
bildAlt: "Räumliches Koordinatensystem: eine grüne, nach oben geöffnete Parabel über der reellen Achse und darunter, um 90 Grad gedreht, eine blaue, nach unten geöffnete Parabel, die die imaginäre Achse in zwei rot markierten Punkten durchstößt."
entwurf: false
---

Die Nullstellen einer quadratischen Funktion zu veranschaulichen, ist bekanntlich einfach, solange sie reell sind: Man zeichnet den Graphen, markiert die Schnittpunkte mit der $x$-Achse und ist fertig. Je nach Fall ergeben sich zwei Nullstellen, eine oder gar keine.

![Drei Parabeln nebeneinander: y = x² + 2 liegt ganz oberhalb der x-Achse, y = x² berührt sie im Ursprung, y = x² − 2 schneidet sie zweimal.](/blog/phantomparabel/drei-parabeln.jpg)

Andererseits wissen wir, dass *jedes* Polynom zweiten Grades zwei Nullstellen hat (Fundamentalsatz der Algebra). Sind sie am Graphen nicht zu sehen, müssen sie komplex sein, also einen Imaginärteil besitzen. Haben Sie sich schon einmal gefragt, wie sich diese komplexen Nullstellen auf einfache Weise sichtbar machen lassen? Es geht tatsächlich, und es ist ziemlich faszinierend. Man braucht dazu die sogenannte Phantomparabel. Ich beschreibe zuerst das Verfahren und liefere danach den mathematischen Hintergrund.

## Das Verfahren

Nehmen wir als Beispiel die Parabel mit der Gleichung $y = x^2 + 2$. Sie hat keine reellen Nullstellen. Um die komplexen zu sehen, muss man zunächst die komplexe Ebene sichtbar machen. Das ist die Ebene, die die $x$-Achse enthält und „unter“ der Parabel liegt:

![Die Parabel y = x² + 2 im räumlichen Koordinatensystem; unter ihr liegt als Gitter die komplexe Ebene mit reeller und imaginärer Achse.](/blog/phantomparabel/schritt-1.png)

Nun klappt man die Parabel am Scheitelpunkt nach unten:

![Zur ursprünglichen Parabel kommt eine zweite, am Scheitelpunkt nach unten geklappte Parabel hinzu.](/blog/phantomparabel/schritt-2.png)

Die so entstandene orangefarbene Parabel dreht man um 90° (um die Achse durch den Scheitelpunkt).

![Die nach unten geklappte Parabel wird um die senkrechte Achse durch den Scheitelpunkt gedreht.](/blog/phantomparabel/schritt-3.png)

Et voilà: Die Phantomparabel ist fertig. Ihre Schnittpunkte mit der Ebene entsprechen den komplexen Nullstellen der Ausgangsfunktion: $\pm i\sqrt{2}$. Das sind genau die beiden Abschnitte auf der imaginären (blauen) Achse.

![Die fertige Phantomparabel: Sie durchstößt die komplexe Ebene in zwei rot markierten Punkten auf der imaginären Achse.](/blog/phantomparabel/schritt-4.png)

Hier lässt sich die Parabel samt ihrem Phantom in einer bewegten Darstellung betrachten:

<img src="/blog/phantomparabel/parabel-mit-phantom.gif" alt="Animation: Das räumliche Koordinatensystem mit Parabel und Phantomparabel dreht sich um die senkrechte Achse." loading="lazy" />

Und hier die gesamte Konstruktion noch einmal als Animation:

<img src="/blog/phantomparabel/konstruktion.gif" alt="Animation der Konstruktion: Die Parabel wird am Scheitelpunkt nach unten geklappt und anschließend um 90 Grad gedreht." loading="lazy" />

Das Ganze lässt sich also in zwei Worten zusammenfassen: „Klappen und drehen!“ Mich beeindruckt immer wieder, wie einfach dieses Verfahren ist.

## Der mathematische Hintergrund

Womit lässt sich diese Konstruktion mathematisch begründen? Nehmen wir an, die quadratische Funktion, deren Nullstellen wir veranschaulichen wollen, habe die Form $y = ax^2 + c$. Hat sie diese Form nicht, lässt sie sich durch einfache Umformungen herstellen (siehe unten). Da $x$ komplex sein darf, schreiben wir $x = m + ni$ und fragen, welche Werte $x$ annimmt, wenn $y = 0$ ist.

Nach Voraussetzung ist $y$ reell, denn wir betrachten nur die Funktionswerte über der reellen Achse. Also muss $x$ entweder rein reell oder rein imaginär sein. Das sieht man an $x^2 = (m+ni)^2 = m^2 - n^2 + 2i\,mn$: Der Imaginärteil verschwindet genau dann, wenn $m = 0$ ist ($x$ ist rein imaginär) oder $n = 0$ ($x$ ist rein reell).

Ist $x$ rein reell, dann ist $n = 0$ und damit $y = ax^2 + c = am^2 + c$. Das ist die Gleichung der ursprünglichen Parabel über der reellen Achse.

Ist $x$ rein imaginär, dann ist $m = 0$ und folglich $y = a(ni)^2 + c$. Das vereinfacht sich zu $y = -an^2 + c$. Und das ist die Gleichung der Phantomparabel über der imaginären Achse!

Das Minuszeichen vor dem $a$ zeigt an, dass die Phantomparabel nach unten geöffnet ist. Außerdem ist sie gegenüber der ursprünglichen Parabel um 90° gedreht, weil sie sich über der imaginären $n$-Achse erstreckt, während die ursprüngliche Parabel nur über der reellen $m$-Achse verläuft.

Die Nullstellen beider Parabeln ergeben sich durch einfaches Umformen zu $m = \pm\sqrt{\frac{-c}{a}}$ und $n = \pm\sqrt{\frac{-c}{-a}}$. In unserem Beispiel ist $a = 1$ und $c = 2$. Auf der (reellen) $m$-Achse finden wir keine Lösungen, auf der (imaginären) $n$-Achse dagegen erhalten wir $n_{1,2} = \pm\sqrt{\frac{-2}{-1}} = \pm\sqrt{2}$.

Diese Überlegung gilt für jede Parabel. Liegt sie in der Form $y = ax^2 + bx + c$ vor, bringt man sie in die Scheitelpunktform $y = a(x-d)^2 + e$ und ersetzt $(x-d)$ durch die Substitution $v = x - d$.

Jede Parabel hat also eine Phantomparabel, und wer beide zeichnet, sieht sämtliche Nullstellen der zugehörigen quadratischen Funktion. Sind die Nullstellen reell, durchstößt die ursprüngliche Parabel die komplexe Ebene an den entsprechenden Stellen der $x$-Achse, und die Phantomparabel „hängt“ unter der Ebene. Gibt es eine doppelte Nullstelle, berühren sich Parabel und Phantomparabel in genau einem Punkt der $x$-Achse. Alle diese Fälle können Sie selbst ausprobieren: Ein passendes GeoGebra-Applet finden Sie unter [geogebra.org/m/wuwekaxy](https://www.geogebra.org/m/wuwekaxy), weitere Phantomgraphen auf [phantomgraphs.weebly.com](https://phantomgraphs.weebly.com/) (beides auf Englisch). Bei anderen Funktionstypen sind die Verfahren mitunter deutlich aufwendiger.

Die Phantomparabel aber ist so einfach, dass sie ein schönes Thema für eine Mathe-AG oder einen mathematischen Arbeitskreis abgibt, besonders wenn dort das Thema „imaginäre Zahlen“ erkundet werden soll. Ich habe sie in solchen Runden mit großem Gewinn eingesetzt und Schülerinnen und Schüler damit zum Staunen gebracht.

*Dieser Beitrag erschien zuerst im August 2021 auf Englisch auf teaching-math.com.*
