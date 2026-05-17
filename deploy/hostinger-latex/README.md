# Eigener LaTeX-PDF-Dienst auf Hostinger-VPS (ohne n8n)

Damit entfällt die Abhängigkeit vom öffentlichen `latex.ytotech.com`. Die Mathe-Seite nutzt dann `PUBLIC_MU_LATEX_HTTP_URL` (siehe Projekt-`.env.example`).

## Was du brauchst

1. **Eine (Sub-)Domain**, die per **A-Record** auf die **VPS-IP** zeigt (im Hostinger-DNS oder wo die Domain liegt).
2. Auf dem VPS: **Docker** + **Docker Compose Plugin** (Hostinger-Docs: „Docker“ / SSH-Root oder sudo).
3. Firewall: **80** und **443** eingehend offen.

## Schritte (nur einmal)

Per SSH auf dem VPS einloggen, dann:

```bash
mkdir -p ~/latex-proxy && cd ~/latex-proxy
```

Diesen Ordner `deploy/hostinger-latex/` aus dem Repo hierher kopieren (oder Dateien per Editor anlegen): `docker-compose.yml`, `Caddyfile`, `env.example`.

```bash
cp env.example .env
nano .env   # SITE_ADDRESS=latex.deinedomain.de eintragen
docker compose pull
docker compose up -d
```

Der erste `pull` kann **lange** dauern und **mehrere Gigabyte** laden (TeX Live im Image).

Prüfen:

```bash
curl -sI "https://$(grep SITE_ADDRESS .env | cut -d= -f2)/packages" | head -3
```

HTTP **200** von deinem Host ist gut.

## Mathe-Seite (Build / Hosting)

Umgebungsvariable setzen (Komma/Leerzeichen für mehrere URLs möglich — siehe Haupt-`.env.example`):

```bash
PUBLIC_MU_LATEX_HTTP_URL=https://latex.deinedomain.de/builds/sync
```

Dann Site neu bauen/deployen. Die Seite versucht **zuerst** diese URL, danach weiterhin ytotech als Fallback.

## Hauptdomain noch bei anderem Anbieter (z. B. webgo), Hostinger nur VPS + zweite Domain

Das ist **unkritisch** für den LaTeX-Proxy:

1. **DNS für den LaTeX-Host nur dort pflegen, wo du die Domain schon hast** — z. B. bei Hostinger für `mathechismus.de`: Subdomain **`latex.mathechismus.de`** anlegen, **A-Record** auf die **VPS-IP** (nicht auf Shared Hosting).
2. In `.env` auf dem VPS: `SITE_ADDRESS=latex.mathechismus.de` (Beispiel).
3. Beim **Build** der Seite unter **https://mathematik-unterrichten.de** (egal ob die Dateien bei webgo liegen):  
   `PUBLIC_MU_LATEX_HTTP_URL=https://latex.mathechismus.de/builds/sync`  
   Der Browser ruft damit deinen VPS auf; **CORS** im mitgelieferten `Caddyfile` ist bereits auf **`https://mathematik-unterrichten.de`** eingestellt — das passt, solange Nutzer die Seite unter genau dieser Origin aufrufen.
4. **Ab Oktober**, wenn `mathematik-unterrichten.de` zu Hostinger (oder woanders) umzieht: solange die Seite weiter unter `https://mathematik-unterrichten.de` läuft, **ändert sich am LaTeX-Setup nichts**. Wenn du später eine **zweite** Origin brauchst (z. B. Preview unter `https://mathechismus.de`), im `Caddyfile` die `Access-Control-Allow-Origin`-Zeilen erweitern (Caddy: z. B. per `map` auf erlaubte Origins) — siehe Caddy-Doku.

**Wichtig:** Die LaTeX-Subdomain muss **nicht** `mathematik-unterrichten.de` heißen; sie kann ruhig unter `mathechismus.de` laufen.

## CORS / andere Domains

Erlaubte Origin ist in `Caddyfile` fest `https://mathematik-unterrichten.de`. Für eine **Staging-Domain** oder **localhost** musst du die drei `Access-Control-Allow-Origin`-Zeilen dort anpassen (oder eine zweite Zeile mit Matcher — siehe Caddy-Doku).

## Hinweis

Wir können deinen VPS von hier aus **nicht** einrichten; bei Problemen: `docker compose logs -f` und Hostinger-Firewall/DNS prüfen.
