# Eigener LaTeX-PDF-Dienst auf Hostinger-VPS (ohne n8n)

Damit entfällt die Abhängigkeit vom öffentlichen `latex.ytotech.com`. Die Mathe-Seite nutzt dann `PUBLIC_MU_LATEX_HTTP_URL` (siehe Projekt-`.env.example`).

**Wichtig:** Das Docker-Hub-Image **`yoant/latexonhttp-python:debian`** enthält nur TeXLive + Python, **nicht** die HTTP-App (kein Gunicorn). Laufbar ist nur ein **selbst gebautes** Image aus dem offiziellen Repo — siehe unten.

## Was du brauchst

1. **Eine (Sub-)Domain**, die per **A-Record** auf die **VPS-IP** zeigt (im Hostinger-DNS oder wo die Domain liegt).
2. Auf dem VPS: **Docker** + **Docker Compose Plugin** (Hostinger-Docs: „Docker“ / SSH-Root oder sudo).
3. Firewall: **80** und **443** eingehend offen (oder nur intern, wenn Traefik die Ports schon belegt — siehe Abschnitt n8n/Traefik).

## Variante A: Caddy direkt auf 80/443 (ohne n8n/Traefik auf denselben Ports)

Per SSH:

```bash
mkdir -p ~/latex-proxy && cd ~/latex-proxy
```

Dateien aus dem Repo: `docker-compose.yml`, `Caddyfile`, `env.example`.

```bash
cp env.example .env
nano .env   # SITE_ADDRESS=latex.deinedomain.de eintragen
docker compose up -d --build
```

Der **erste Build** lädt das GitHub-Repo und baut das Image `latex-onhttp:local` (kann **15–45 Minuten** dauern, viel CPU/RAM). Spätere Starts sind schnell.

Prüfen:

```bash
docker compose ps
curl -sI "https://$(grep SITE_ADDRESS .env | cut -d= -f2)/packages" | head -5
```

Bei `docker compose ps` soll der LaTeX-Container **kein** reines `bash` als Endlos-Prozess ohne Gunicorn sein — sinnvoll ist u. a.:

```bash
docker compose logs --tail=20 latex
```

(dort sollte u. a. **gunicorn** vorkommen)

## Variante B: Hostinger-VPS mit **n8n + Traefik** (80/443 schon von Traefik belegt)

1. **Netzwerk** von Traefik ermitteln:

```bash
docker inspect n8n-traefik-1 --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}'
```

2. **Image einmal bauen** (nur Beispielpfad):

```bash
mkdir -p /opt/src && cd /opt/src
git clone --depth 1 https://github.com/YtoTech/latex-on-http.git
cd latex-on-http
docker build -t latex-onhttp:local .
```

3. Eigene `docker-compose.yml` in `~/latex-proxy` mit **Traefik-Labels** (Vorlage: `docker-compose.traefik.example.yml` im Repo): `image: latex-onhttp:local`, `name: …` = Netzwerk aus Schritt 1, `certresolver` / `entrypoints` wie bei deinem n8n-Container (`mytlschallenge`, `websecure`).

4. `docker compose up -d` im Ordner `~/latex-proxy`.

## Mathe-Seite (Build / Hosting)

```bash
PUBLIC_MU_LATEX_HTTP_URL=https://latex.deinedomain.de/builds/sync
```

Dann Site neu bauen/deployen. Die Seite versucht **zuerst** diese URL, danach weiterhin ytotech als Fallback.

## Hauptdomain noch bei anderem Anbieter (z. B. webgo), Hostinger nur VPS + zweite Domain

1. **DNS** z. B. `latex.mathechismus.de` → **A** → **VPS-IPv4**.
2. `PUBLIC_MU_LATEX_HTTP_URL=https://latex.mathechismus.de/builds/sync` beim Build der Seite unter **https://mathematik-unterrichten.de**.
3. **CORS:** Im Caddy-`Caddyfile` bzw. in den Traefik-Labels ist `https://mathematik-unterrichten.de` vorgesehen.

## CORS / andere Domains

Anpassen, wenn du von weiteren Origins aus zugreifen willst (Caddy-Doku bzw. Traefik-Header-Middleware).

## Hinweis

Wir können deinen VPS von hier aus **nicht** einrichten; bei Problemen: `docker compose logs -f` und Hostinger-Firewall/DNS prüfen.
