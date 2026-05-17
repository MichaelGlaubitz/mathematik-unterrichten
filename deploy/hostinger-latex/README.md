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

## CORS / andere Domains

Erlaubte Origin ist in `Caddyfile` fest `https://mathematik-unterrichten.de`. Für eine **Staging-Domain** oder **localhost** musst du die drei `Access-Control-Allow-Origin`-Zeilen dort anpassen (oder eine zweite Zeile mit Matcher — siehe Caddy-Doku).

## Hinweis

Wir können deinen VPS von hier aus **nicht** einrichten; bei Problemen: `docker compose logs -f` und Hostinger-Firewall/DNS prüfen.
