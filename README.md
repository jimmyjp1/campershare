# CamperShare - Camper Van Rental Platform

Ein vollständiges Camper-Vermietungsportal mit Next.js, PostgreSQL und Docker.

## 🚀 Schnellstart

### Voraussetzungen
- Docker Desktop
- Git
- Node.js 18+ (für lokale Entwicklung)

### Installation & Start

1. **Repository klonen:**
```bash
git clone [REPOSITORY_URL]
cd main
```

2. **Docker-Umgebung starten:**
```bash
docker-compose up -d
```

3. **Anwendung öffnen:**
- Frontend: http://localhost:3000
- PgAdmin: http://localhost:8080
- API-Dokumentation: http://localhost:3000/api

## 📋 Projekt-Übersicht

### Technologie-Stack
- **Frontend:** Next.js 12.x mit React
- **Backend:** Next.js API Routes
- **Datenbank:** PostgreSQL 15
- **Cache:** Redis
- **Styling:** Tailwind CSS
- **Payment:** Stripe (Test-Modus)
- **Email:** Multi-Provider SMTP (Outlook primär)
- **Container:** Docker Compose

### Hauptfunktionen
- ✅ 19 vollständig konfigurierte Camper-Fahrzeuge
- ✅ Erweiterte Suchfunktion mit Filtern
- ✅ Reisezeit-Berechnung zu Standorten
- ✅ Stripe-Payment-Integration
- ✅ Email-Benachrichtigungssystem
- ✅ Admin-Dashboard
- ✅ Responsive Design mit Dark Mode
- ✅ GPS-basierte Standortdienste

## 🗃️ Datenbank-Zugang

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

## 📧 Email-Konfiguration

### Outlook SMTP (Primär)
```
Account: camper-shair@outlook.com
Password: !#CamperShair
SMTP: smtp-mail.outlook.com:587
```

### Alternative Provider
- Gmail-Backup konfiguriert
- Yahoo-Backup konfiguriert

## 💳 Stripe-Payment

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

## 🛠️ Entwicklung

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

## 📁 Projektstruktur

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

## 🚚 Camper-Fahrzeuge

Das System enthält 19 vollständig konfigurierte Camper mit:
- Kompletten technischen Spezifikationen
- Hochauflösenden Bildern
- GPS-Standorten
- Preiskalkulationen
- Verfügbarkeitskalendern

## 🌍 Standorte & Reisezeit

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

## 👨‍💼 Admin-Bereich

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

## 🔧 Troubleshooting

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

## 📞 Support & Kontakt

Bei Fragen oder Problemen:
1. Issues im GitHub-Repository erstellen
2. Docker-Logs prüfen
3. Container-Status überprüfen: `docker-compose ps`

## 🔒 Sicherheitshinweise

- Alle Passwörter sind für Entwicklung/Test
- Vor Produktion alle Credentials ändern
- Stripe ist im Test-Modus konfiguriert
- Email-Accounts sind bereits eingerichtet

---

**Projekt bereit für sofortige Nutzung!** 🎉

Einfach `docker-compose up -d` ausführen und unter http://localhost:3000 starten.