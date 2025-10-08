# Deployment Guide

## 🚀 GitHub Repository Setup

### 1. Repository erstellen
```bash
# Auf GitHub.com
1. New Repository erstellen
2. Name: "CamperShare-Platform" 
3. Private (wegen Credentials)
4. README.md bereits vorhanden
```

### 2. Repository verknüpfen
```bash
# Im Projektordner
git init
git add .
git commit -m "Initial CamperShare platform with full functionality"
git branch -M main
git remote add origin [DEIN_GITHUB_URL]
git push -u origin main
```

### 3. Projektpartner hinzufügen
```bash
# Auf GitHub.com unter Settings > Manage access
1. "Invite a collaborator"
2. GitHub-Username des Partners eingeben
3. Role: "Admin" für vollen Zugriff
```

## 🌐 Produktions-Deployment

### Option 1: Vercel (Empfohlen für Next.js)
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment
vercel

# Environment Variables in Vercel Dashboard setzen:
POSTGRES_HOST=dein-db-host
POSTGRES_DB=campershare
POSTGRES_USER=campershare_user
POSTGRES_PASSWORD=secure_password_123
STRIPE_SECRET_KEY=sk_live_[DEIN_LIVE_KEY]
STRIPE_PUBLISHABLE_KEY=pk_live_[DEIN_LIVE_KEY]
EMAIL_USER=camper-shair@outlook.com
EMAIL_PASS=!#CamperShair
```

### Option 2: Docker Production
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - POSTGRES_HOST=prod-db-host
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: campershare
      POSTGRES_USER: campershare_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
volumes:
  postgres_data:
```

### Option 3: VPS/Server Deployment
```bash
# Auf dem Server
git clone [DEIN_REPO_URL]
cd CamperShare-Platform

# Environment Variables setzen
cp .env.example .env.production
# .env.production editieren mit Live-Credentials

# Docker Production starten
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Produktions-Checkliste

### Vor Live-Gang
- [ ] Stripe auf Live-Modus umstellen
- [ ] Neue Datenbank-Passwörter generieren  
- [ ] Admin-Passwort ändern
- [ ] Domain/SSL-Zertifikat einrichten
- [ ] Email-Provider für Produktions-Volume konfigurieren
- [ ] Backup-System einrichten
- [ ] Monitoring/Logging aktivieren

### Stripe Live-Modus
```javascript
// In next.config.mjs oder .env.production
STRIPE_PUBLISHABLE_KEY=pk_live_[DEIN_LIVE_KEY]
STRIPE_SECRET_KEY=sk_live_[DEIN_LIVE_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[LIVE_WEBHOOK]
```

### Database Migration
```sql
-- Für Produktions-DB
CREATE DATABASE campershare_production;
-- Dann SQL-Files aus /database/ ausführen
```

## 📊 Monitoring & Backup

### Logging
```bash
# Docker Logs
docker-compose logs -f --tail=100

# Database Backup
docker exec postgres pg_dump -U campershare_user campershare > backup.sql
```

### Health Checks
```bash
# System Status prüfen
curl http://localhost:3000/api/health
curl http://localhost:3000/api/admin/status
```

## 🔧 Troubleshooting

### Häufige Deployment-Probleme
1. **Environment Variables:** Alle Credentials richtig gesetzt?
2. **Database Connection:** Host/Port für Produktions-DB?
3. **Stripe Webhooks:** Webhook-URL in Stripe Dashboard?
4. **Email SMTP:** Provider-Limits für Produktions-Mails?

---

**Deployment-Ready!** 🎯

Alle Services sind für Produktion vorbereitet.
