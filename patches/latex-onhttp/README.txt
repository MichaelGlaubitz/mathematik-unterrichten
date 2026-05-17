Patch für selbst gehostetes YtoTech/latex-on-http (Docker-Image latex-onhttp:local)

Problem: pdflatex/latexmk schreiben Logzeilen oft in Latin-1; Python 3.13 decodiert
stdout sonst strikt als UTF-8 → UnicodeDecodeError → HTTP 500.

---

Anwendung auf dem VPS

1) In den latex-on-http-Quellbaum wechseln (Pfad anpassen, falls bei dir anders):

  cd /opt/src/latex-on-http

2) Patch einspielen — eine der beiden Varianten:

Variante A — Patch direkt von GitHub laden (kein Klon von mathematik-unterrichten nötig):

  curl -fsSL -o /tmp/compiler-utf8-errors-replace.patch \
    "https://raw.githubusercontent.com/MichaelGlaubitz/mathematik-unterrichten/main/patches/latex-onhttp/compiler-utf8-errors-replace.patch"
  patch -p1 < /tmp/compiler-utf8-errors-replace.patch

Variante B — Repo mathematik-unterrichten liegt bereits auf dem Server (beliebiger Pfad):

  patch -p1 < /DEIN/PFAD/mathematik-unterrichten/patches/latex-onhttp/compiler-utf8-errors-replace.patch

3) Image neu bauen und Stack neu starten:

  docker build -t latex-onhttp:local .
  cd ~/latex-proxy && docker compose up -d --force-recreate

Hinweis: `/opt/src/latex-on-http` und `~/latex-proxy` sind Beispiele — durch deine echten Verzeichnisse ersetzen.
