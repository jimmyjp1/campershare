# CamperShare - PrivatProjekt 


CamperShare ist eine umfassende Wohnmobil-Vermietungsplattform, die mit Next.js, PostgreSQL und Docker entwickelt wurde. 
Das System bietet eine komplette Lösung von der Fahrzeugsuche bis zur Buchungsabwicklung.

## Schnellstart

### Voraussetzungen
- **Docker Desktop** (empfohlen für einfache Installation)
- **Git** für Repository-Verwaltung
- **Node.js 18+** (nur für lokale Entwicklung ohne Docker)

### 1. Installation

```bash
# Repository klonen
git clone https://github.com/jimmyjp1/campershare.git
cd campershare

# Docker-Umgebung starten (automatische Setup)
docker-compose up -d
```

### 2. Zugriff

Nach dem Start sind folgende Services verfügbar:

| Service | URL | Beschreibung |
|---------|-----|-------------|
| **Hauptanwendung** | http://localhost:3000 | CamperShare Frontend |
| **Datenbank-Admin** | http://localhost:8080 | pgAdmin (admin@campershare.de / admin) |
| **API-Endpoints** | http://localhost:3000/api | REST API |

### 3. Erste Schritte

1. **Frontend erkunden:** Besuche http://localhost:3000
2. **Test-Buchung:** Verwende die Suchfunktion 
3. **Admin-Zugang:** Registriere einen Account und setze Admin-Rechte in der DB
4. **Analytics:** Besuche `/analytics` für Statistiken

## Projektstruktur

```
campershare/
├──  docker-compose.yml          # Container-Orchestrierung
├──  package.json                # NPM-Abhängigkeiten
├──  next.config.mjs             # Next.js Konfiguration
├──  tailwind.config.js          # Styling-Framework
├── 
├──  src/
│   ├──  components/             # React-Komponenten
│   │   ├── Header.jsx             # Navigation & Logo
│   │   ├── Footer.jsx             # Footer-Informationen
│   │   ├── CookieComponents.jsx   # DSGVO Cookie-Banner
│   │   └── ...                    # Weitere UI-Komponenten
│   │
│   ├──  pages/                  # Next.js Seiten
│   │   ├── index.jsx              # Startseite
│   │   ├── about.jsx              # Über Uns (mit Video)
│   │   ├── campers/               # Fahrzeug-Katalog
│   │   ├── admin.jsx              # Admin-Dashboard
│   │   ├── analytics.jsx          # Statistiken (mehrsprachig)
│   │   └── api/                   # Backend API-Routes
│   │
│   ├──  services/               # Business Logic
│   │   ├── multilanguageService.js    # Übersetzungssystem
│   │   ├── bookingService.js          # Buchungslogik
│   │   ├── userAuthenticationService.js # Benutzer-Management
│   │   └── ...                        # Weitere Services
│   │
│   └──  lib/                   # Utilities & Helpers
│       ├── databaseConnection.js  # PostgreSQL-Verbindung
│       ├── automaticEmailSender.js # E-Mail-System
│       └── ...                    # Weitere Hilfsfunktionen
│
├──  database/                  # SQL-Schemas & Daten
│   ├── init/                     # Auto-Import bei Start
│   │   ├── 01-schema.sql         # Tabellenstrukturen
│   │   └── 02-sample-data.sql    # Test-/Demo-Daten
│   └── ...                       # Zusätzliche SQL-Dateien
│
└──  public/                    # Statische Assets
    ├── images/                   # Logos, Team-Fotos, Camper-Bilder
    ├── videos/                   # Hintergrund- & Marketing-Videos
    └── ...                       # Icons, Manifest, etc.

##  Technologie-Stack

### Frontend
- **Next.js 12.x:** React-Framework mit SSR/SSG
- **Tailwind CSS:** Utility-First CSS-Framework
- **React Context:** State-Management für Auth & Language
- **Headless UI:** Accessible UI-Komponenten

### Backend
- **Next.js API Routes:** Serverless API-Endpoints
- **PostgreSQL 15:** Relationale Datenbank
- **Redis 7:** Caching & Session-Storage
- **Node.js:** JavaScript-Runtime

### Infrastructure
- **Docker Compose:** Container-Orchestrierung
- **Alpine Linux:** Leichtgewichtige Container-Images
- **nginx:** Reverse Proxy (Production)

## Datenbank-Zugang

### PostgreSQL-Verbindung
```
Host: localhost
Port: 5432
Database: campershare
Username: campershare_user
Password: secure_password_123
```

### PgAdmin Web-Interface
```
URL: http://localhost:8080
Email: admin@campershare.com
Password: admin123
```

## Email-Konfiguration

### Outlook SMTP (Primär)
```
Account: camper-shair@outlook.com
Password: !#CamperShair
SMTP: smtp-mail.outlook.com:587
```

## Stripe-Payment

### Test-Credentials
```
Publishable Key: pk_test_51QDPnhDhFBdKJl7XgJCfJPRmXh9j5YPCxXrBSKPZeqDDcCdyNdtYKkI3nPWzKE2sBkX6DqhZvP1LnkRAyKR3GBH000qwNSLBzm
Secret Key: sk_test_51QDPnhDhFBdKJl7XgkYKON20J7J7YzYdcwR8GdLHxrxCYTQhgqZcKWj1N2cYzQKNZhRBgwQcGZFfHl5YJJxdN2T700vYGRYjGL
```

### Test-Kreditkarten
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
CVV: 123, Ablauf: 12/34
```

## Entwicklung

### Lokale Entwicklung
```bash
npm install
npm run dev
```

### Docker-Entwicklung
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

### Logs anzeigen
```bash
docker-compose logs -f app
```

## Projektstruktur

```
main/
├── src/
│   ├── components/          # React-Komponenten
│   ├── pages/              # Next.js-Seiten
│   ├── lib/                # Utility-Funktionen
│   └── styles/             # CSS-Dateien
├── database/               # SQL-Schema & Beispieldaten
├── public/                 # Statische Dateien
├── uploads/               # Upload-Verzeichnis
└── docker-compose.yml     # Container-Konfiguration
```

## Camper-Fahrzeuge

Das System enthält 19 vollständig konfigurierte Camper mit:
- Kompletten technischen Spezifikationen
- Hochauflösenden Bildern
- GPS-Standorten
- Preiskalkulationen
- Verfügbarkeitskalendern

## Standorte & Reisezeit

### Verfügbare Abholstandorte
- München (Hauptstandort)
- Berlin
- Hamburg
- Köln
- Frankfurt
- Stuttgart
- Dresden
- Düsseldorf

Reisezeiten werden automatisch basierend auf der Entfernung zwischen Städten berechnet.

## Admin-Bereich

### Zugang
```
URL: http://localhost:3000/admin
Login: admin@campershare.com
Password: admin123
```

### Admin-Funktionen
- Fahrzeug-Verwaltung
- Buchungs-Übersicht
- Benutzer-Verwaltung
- Email-Logs
- System-Status

## Troubleshooting

### Container neu starten
```bash
docker-compose down
docker-compose up -d
```

### Datenbank zurücksetzen
```bash
docker-compose down -v
docker-compose up -d
```

### Logs prüfen
```bash
docker-compose logs app
docker-compose logs db
```

## Sicherheitshinweise

- Alle Passwörter sind für Entwicklung/Test
- Vor Produktion alle Credentials ändern
- Stripe ist im Test-Modus konfiguriert
- Email-Accounts sind bereits eingerichtet

Einfach `docker-compose up -d` ausführen und unter http://localhost:3000 starten.
