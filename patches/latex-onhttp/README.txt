Patch für selbst gehostetes YtoTech/latex-on-http (Docker-Image latex-onhttp:local)

Problem: pdflatex/latexmk schreiben Logzeilen oft in Latin-1; Python 3.13 decodiert
stdout sonst strikt als UTF-8 → UnicodeDecodeError → HTTP 500.

Anwendung auf dem VPS (nach git pull des latex-on-http-Klons):

  cd /opt/src/latex-on-http
  patch -p1 < /pfad/zum/mathematik-unterrichten-repo/patches/latex-onhttp/compiler-utf8-errors-replace.patch

Dann Image neu bauen und Stack neu starten:

  docker build -t latex-onhttp:local .
  cd ~/latex-proxy && docker compose up -d --force-recreate
