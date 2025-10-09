# 👨‍💻 CamperShare - Entwickler-Dokumentation

> **Umfassende Anleitung für neue Entwickler und Contributors**

## 📚 Projekt-Übersicht

CamperShare ist eine moderne Wohnmobil-Vermietungsplattform, entwickelt mit **Next.js**, **PostgreSQL** und **Docker**. Das System folgt modernen Web-Development-Patterns und ist vollständig dokumentiert.

### 🏗️ Architektur-Übersicht

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • React Pages   │    │ • REST APIs     │    │ • User Data     │
│ • Components    │    │ • Business      │    │ • Bookings      │
│ • Styling       │    │   Logic         │    │ • Analytics     │
│ • State Mgmt    │    │ • Auth          │    │ • Cache (Redis) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Schneller Einstieg

### 1. Entwicklungsumgebung Setup

```bash
# Repository klonen
git clone https://github.com/jimmyjp1/campershare.git
cd campershare

# Docker-Umgebung starten (empfohlen)
docker-compose up -d

# Oder: Lokale Entwicklung
npm install
npm run dev
```

### 2. Wichtige URLs

| Service | URL | Zweck |
|---------|-----|-------|
| **App** | http://localhost:3000 | Hauptanwendung |
| **pgAdmin** | http://localhost:8080 | Datenbank-Management |
| **API** | http://localhost:3000/api | REST Endpoints |

### 3. Erste Schritte

1. **Code erkunden**: Beginne mit `src/pages/index.jsx` (Homepage)
2. **Komponenten verstehen**: Schau dir `src/components/Header.jsx` an
3. **API testen**: Besuche `/api/campers` für Beispiel-Daten
4. **Datenbank prüfen**: Nutze pgAdmin für DB-Einblicke

## 📁 Code-Organisation

### Frontend-Struktur

```
src/
├── 📄 pages/              # Next.js Seiten (File-based Routing)
│   ├── index.jsx          # Homepage (/)
│   ├── about.jsx          # Über Uns (/about)
│   ├── campers/           # Fahrzeug-Seiten (/campers/*)
│   ├── admin.jsx          # Admin Dashboard
│   ├── analytics.jsx      # Statistiken
│   └── api/               # Backend API Routes
│
├── 🧩 components/         # Wiederverwendbare UI-Komponenten
│   ├── Header.jsx         # Navigation & Logo
│   ├── Footer.jsx         # Footer-Bereich
│   ├── Button.jsx         # Standard-Button
│   ├── Container.jsx      # Layout-Wrapper
│   └── ...
│
├── 🔧 services/           # Business Logic & API-Calls
│   ├── multilanguageService.js    # Übersetzungssystem
│   ├── bookingService.js          # Buchungslogik
│   ├── userAuthenticationService.js # User-Management
│   └── ...
│
├── 🎣 hooks/              # Custom React Hooks
│   └── useAnalytics.js    # Analytics Tracking
│
├── 🗃️ lib/               # Utilities & Helper-Funktionen
│   ├── databaseConnection.js      # DB-Verbindung
│   ├── automaticEmailSender.js   # E-Mail-System
│   └── ...
│
└── 🎨 styles/             # Styling-Dateien
    ├── tailwind.css       # Haupt-CSS-Datei
    └── prism.css          # Code-Highlighting
```

### Backend-API-Struktur

```
src/pages/api/
├── 👤 auth/               # Authentifizierung
│   ├── login.js          # POST /api/auth/login
│   ├── register.js       # POST /api/auth/register
│   └── logout.js         # POST /api/auth/logout
│
├── 🚐 campers/            # Fahrzeug-Management
│   ├── index.js          # GET /api/campers (Liste)
│   └── [slug].js         # GET /api/campers/[slug] (Detail)
│
├── 📅 bookings/           # Buchungssystem
│   ├── create.js         # POST /api/bookings/create
│   ├── index.js          # GET /api/bookings (Liste)
│   └── [bookingId].js    # GET/PUT/DELETE einzelne Buchung
│
├── 📊 analytics/          # Statistiken & Tracking
│   ├── dashboard.js      # GET Analytics-Daten
│   └── track.js          # POST Event-Tracking
│
└── 🛡️ admin/             # Admin-Funktionen
    ├── users.js          # User-Management
    └── analytics.js      # Admin-Analytics
```

## 🛠️ Entwicklungs-Patterns

### 1. Komponenten-Entwicklung

```jsx
/**
 * Beispiel-Komponente mit TypeScript-ähnlicher Dokumentation
 * 
 * @param {Object} props - Komponenten-Properties
 * @param {string} props.title - Titel der Komponente
 * @param {ReactNode} props.children - Kinder-Elemente
 * @param {string} props.variant - Styling-Variante
 */
function ExampleComponent({ title, children, variant = 'default' }) {
  const { t } = useLanguage() // Übersetzungen
  
  return (
    <div className={`component-base ${variant}`}>
      <h2>{t('component.title')}</h2>
      {children}
    </div>
  )
}
```

### 2. API-Routes Pattern

```javascript
/**
 * API Route Template
 * 
 * @param {NextApiRequest} req - Request Object
 * @param {NextApiResponse} res - Response Object
 */
export default async function handler(req, res) {
  // 1. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    // 2. Validation
    const { requiredField } = req.body
    if (!requiredField) {
      return res.status(400).json({ error: 'Missing required field' })
    }
    
    // 3. Business Logic
    const result = await performOperation(requiredField)
    
    // 4. Success Response
    res.status(200).json({ success: true, data: result })
    
  } catch (error) {
    // 5. Error Handling
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

### 3. Service Pattern

```javascript
/**
 * Service-Klasse für Business Logic
 */
export class ExampleService {
  constructor() {
    this.data = new Map()
  }
  
  /**
   * Erstellt einen neuen Eintrag
   * @param {Object} payload - Daten für den Eintrag
   * @returns {Promise<Object>} Erstellter Eintrag
   */
  async create(payload) {
    // Validierung
    if (!payload.name) {
      throw new Error('Name ist erforderlich')
    }
    
    // Business Logic
    const entry = {
      id: generateId(),
      ...payload,
      createdAt: new Date()
    }
    
    // Speichern
    this.data.set(entry.id, entry)
    
    return entry
  }
}
```

## 🌍 Mehrsprachigkeit (i18n)

Das Projekt unterstützt Deutsch und Englisch über den `multilanguageService`.

### Übersetzungen hinzufügen

```javascript
// In multilanguageService.js
const translations = {
  de: {
    newSection: {
      title: 'Neuer Titel',
      description: 'Deutsche Beschreibung'
    }
  },
  en: {
    newSection: {
      title: 'New Title',
      description: 'English Description'
    }
  }
}
```

### Übersetzungen verwenden

```jsx
function Component() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  )
}
```

## 🗄️ Datenbank-Operationen

### Standard Database Query

```javascript
import { query } from '@/lib/databaseConnection'

// Beispiel: Alle Camper abrufen
async function getAllCampers() {
  const result = await query(`
    SELECT 
      id, name, description, price_per_day, 
      images, location, seats, beds
    FROM camper_vans 
    WHERE status = 'active'
    ORDER BY created_at DESC
  `)
  
  return result.rows
}

// Beispiel: Buchung erstellen
async function createBooking(bookingData) {
  const result = await query(`
    INSERT INTO bookings 
    (id, camper_id, user_id, start_date, end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `, [
    bookingData.id,
    bookingData.camperId,
    bookingData.userId,
    bookingData.startDate,
    bookingData.endDate,
    bookingData.totalPrice,
    'pending'
  ])
  
  return result.rows[0]
}
```

## 🎨 Styling Guidelines

Das Projekt verwendet **Tailwind CSS** für Styling. Hier sind die wichtigsten Patterns:

### Responsive Design

```jsx
<div className="
  grid 
  grid-cols-1     /* Mobile: 1 Spalte */
  md:grid-cols-2  /* Tablet: 2 Spalten */
  lg:grid-cols-3  /* Desktop: 3 Spalten */
  gap-6
">
```

### Dark Mode Support

```jsx
<div className="
  bg-white        /* Light Mode */
  dark:bg-zinc-900 /* Dark Mode */
  text-zinc-900 
  dark:text-zinc-100
">
```

### Glassmorphism Design

```jsx
<div className="
  bg-white/90 
  dark:bg-zinc-800/90 
  backdrop-blur-xl 
  border border-white/20 
  dark:border-zinc-700/50 
  shadow-xl
">
```

## 🧪 Testing & Debugging

### Browser Developer Tools

1. **Network Tab**: API-Calls überwachen
2. **Console**: Error-Logs und Debug-Ausgaben
3. **Application Tab**: LocalStorage & Cookies prüfen
4. **Sources Tab**: Breakpoints setzen

### Debugging-Funktionen

```javascript
// Cookie Banner zurücksetzen (Development)
resetCookieBanner()

// Cookie Status prüfen
showCookieStatus()

// Analytics Events tracken
window.trackEvent('custom_event', { data: 'value' })
```

### Database Debugging

```sql
-- Aktuelle Buchungen anzeigen
SELECT b.*, cv.name as camper_name, u.email 
FROM bookings b
JOIN camper_vans cv ON b.camper_id = cv.id
JOIN users u ON b.user_id = u.id
ORDER BY b.created_at DESC;

-- Performance-Check
EXPLAIN ANALYZE SELECT * FROM camper_vans WHERE location = 'Berlin';
```

## 🚀 Deployment

### Development

```bash
# Docker (empfohlen)
docker-compose up -d

# Oder lokal
npm run dev
```

### Production

```bash
# Build erstellen
npm run build

# Production-Server
npm start

# Oder Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Häufige Aufgaben

### Neuen Camper hinzufügen

1. **Datenbank**: SQL-Insert in `camper_vans` Tabelle
2. **Bilder**: Hochladen nach `public/images/caravans/`
3. **Test**: Verfügbarkeit auf `/campers` prüfen

### Neue Seite erstellen

1. **Datei**: `src/pages/new-page.jsx` erstellen
2. **Navigation**: Link in `Header.jsx` hinzufügen
3. **Übersetzungen**: Texte in `multilanguageService.js`
4. **Styling**: Tailwind CSS verwenden

### API-Endpoint hinzufügen

1. **Route**: `src/pages/api/new-endpoint.js` erstellen
2. **Validation**: Input-Validierung implementieren
3. **Database**: Query-Funktionen schreiben
4. **Testing**: Mit Postman oder curl testen

## 🤝 Contribution Guidelines

### Code-Standards

- ✅ **Kommentare**: Alle Funktionen dokumentieren
- ✅ **Naming**: Aussagekräftige Variablennamen
- ✅ **Struktur**: Logische Datei-Organisation
- ✅ **Styling**: Konsistente Tailwind-Nutzung
- ✅ **Error Handling**: Immer try-catch verwenden

### Git Workflow

```bash
# Feature Branch erstellen
git checkout -b feature/new-feature

# Änderungen commiten
git add .
git commit -m "✨ Add new feature"

# Push und Pull Request
git push origin feature/new-feature
```

### Commit Message Format

```
<emoji> <type>: <description>

Beispiele:
✨ feat: Add camper search functionality
🐛 fix: Resolve booking confirmation email issue
📝 docs: Update API documentation
🎨 style: Improve mobile responsiveness
```

## 🆘 Hilfe & Support

### Häufige Probleme

**Problem**: Docker Container startet nicht
```bash
# Lösung: Logs prüfen
docker-compose logs app
```

**Problem**: Datenbank-Verbindung fehlgeschlagen
```bash
# Lösung: Container-Status prüfen
docker-compose ps
```

**Problem**: Übersetzungen funktionieren nicht
```javascript
// Lösung: LanguageProvider prüfen
console.log(useLanguage()) // Sollte Objekt zurückgeben
```

### Nützliche Ressourcen

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Docker**: https://docs.docker.com/

---

**🎉 Viel Erfolg beim Entwickeln!** 

Bei Fragen oder Problemen, prüfe zuerst diese Dokumentation. Für weitere Hilfe, erstelle ein GitHub Issue oder kontaktiere das Entwicklerteam.
