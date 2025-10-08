# CamperShare - Setup Guide für Projektpartner

## Sofortiger Start

### 1. Repository Setup
```bash
# Repository klonen
git clone [DEIN_GITHUB_REPO_URL]
cd main

# Docker starten (alles ist bereits konfiguriert)
docker-compose up -d
```

### 2. Zugriff auf die Anwendung
- **Frontend:** http://localhost:3000
- **Admin-Panel:** http://localhost:3000/admin
- **Datenbank-Admin:** http://localhost:8080

## 🔑 Alle Login-Daten

### Admin-Dashboard
```
URL: http://localhost:3000/admin
Email: admin@campershare.com
Password: admin123
```

### PostgreSQL Datenbank
```
Host: localhost:5432
Database: campershare
Username: campershare_user
Password: secure_password_123
```

### PgAdmin (Datenbank-Interface)
```
URL: http://localhost:8080
Email: admin@campershare.com
Password: admin123
```

### Email-System
```
Outlook SMTP:
Account: camper-shair@outlook.com
Password: !#CamperShair
Server: smtp-mail.outlook.com:587
```

### Stripe Payment (Test-Modus)
```
Publishable Key: pk_test_51QDPnhDhFBdKJl7XgJCfJPRmXh9j5YPCxXrBSKPZeqDDcCdyNdtYKkI3nPWzKE2sBkX6DqhZvP1LnkRAyKR3GBH000qwNSLBzm
Secret Key: sk_test_51QDPnhDhFBdKJl7XgkYKON20J7J7YzYdcwR8GdLHxrxCYTQhgqZcKWj1N2cYzQKNZhRBgwQcGZFfHl5YJJxdN2T700vYGRYjGL

Test-Kreditkarten:
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
CVV: 123, Ablauf: 12/34
```

## ✅ Was bereits funktioniert

### Vollständige Fahrzeugdaten
- **19 Camper** mit kompletten technischen Spezifikationen
- Alle Preise, Bilder und Standorte konfiguriert
- Reisezeit-Berechnung zwischen Städten

### Email-System
- **Funktional getestet** - Emails werden versendet
- Multi-Provider Setup (Outlook primär, Gmail/Yahoo backup)
- Automatische Buchungsbestätigungen

### Payment-System
- **Stripe vollständig integriert**
- Test-Modus aktiviert für sichere Entwicklung
- 4 Zahlungsmethoden unterstützt

### Admin-Funktionen
- Fahrzeug-Verwaltung
- Buchungs-Übersicht
- Email-Logs
- System-Status

## 🛠️ Entwicklung

### Lokale Änderungen
```bash
# In separatem Terminal für Live-Entwicklung
npm install
npm run dev
```

### Docker-Logs anzeigen
```bash
docker-compose logs -f app
docker-compose logs -f db
```

### Container neu starten
```bash
docker-compose down
docker-compose up -d
```

## 📂 Wichtige Dateien

### Konfiguration
- `docker-compose.yml` - Container-Setup
- `next.config.mjs` - Next.js Konfiguration
- `src/lib/databaseConnection.js` - Datenbankverbindung

### Email-System
- `src/lib/automaticEmailSender.js` - Email-Provider Management
- Outlook-Account bereits eingerichtet und getestet

### Payment
- `src/lib/paymentService.js` - Stripe Integration
- Test-Keys bereits konfiguriert

### Hauptseiten
- `src/pages/caravans/index.jsx` - Fahrzeug-Übersicht
- `src/pages/caravans/[slug].jsx` - Detail-Seiten
- `src/pages/admin.jsx` - Admin-Dashboard

## 🔧 Troubleshooting

### Häufige Probleme
1. **Port bereits belegt:** Docker-Container stoppen und neu starten
2. **Datenbank-Fehler:** `docker-compose down -v && docker-compose up -d`
3. **Email-Probleme:** Login-Daten in `src/lib/automaticEmailSender.js` prüfen

### Support
- Alle Logs in Docker verfügbar
- Datenbank über PgAdmin erreichbar
- Frontend-Errors in Browser-Console

## 🎯 Nächste Schritte

1. **System testen:** Alle URLs aufrufen und Funktionen prüfen
2. **Anpassungen:** Design/Text nach Bedarf ändern
3. **Deployment:** Für Produktion Credentials ändern

---

**Alles ist bereits konfiguriert und funktionsfähig!** 🚀

Bei Fragen einfach melden - alle Systeme laufen out-of-the-box.
