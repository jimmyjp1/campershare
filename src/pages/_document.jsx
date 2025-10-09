/**
 * =============================================================================
 * NEXT.JS DOCUMENT KOMPONENTE
 * =============================================================================
 * 
 * Custom Document-Komponente für die WWISCA Camper-Rental Plattform.
 * Erweitert das Standard HTML-Dokument mit Dark Mode Support und 
 * Performance-Optimierungen.
 * 
 * HAUPTFUNKTIONEN:
 * - Dark Mode System mit automatischer OS-Erkennung
 * - Flash-freier Theme-Wechsel via Inline-Script
 * - Font-Optimierung und Antialiasing
 * - SEO-Meta Tags und Viewport-Konfiguration
 * - Performance-optimierte Resource Loading
 * 
 * DARK MODE FEATURES:
 * - Automatische Erkennung der System-Einstellungen
 * - LocalStorage-basierte Nutzer-Präferenzen
 * - Event-Listener für Theme-Wechsel
 * - Transition-Suppression für flüssige Umschaltung
 * - Cross-Tab Synchronisation
 * 
 * ANTI-FLASH MECHANISMUS:
 * - Inline-Script verhindert FOUC (Flash of Unstyled Content)
 * - Sofortige Klassen-Anwendung vor React-Hydration
 * - Temporäre Transition-Deaktivierung für sanfte Übergänge
 * 
 * PERFORMANCE OPTIMIERUNGEN:
 * - Antialiased Font-Rendering für bessere Lesbarkeit
 * - Optimierte HTML-Struktur für schnelle Parser
 * - Minimaler Critical CSS Path
 * 
 * VERWENDUNG:
 * Diese Komponente wird automatisch von Next.js verwendet.
 * Keine direkte Importierung in anderen Komponenten erforderlich.
 */
import { Head, Html, Main, NextScript } from 'next/document'

/**
 * DARK MODE SCRIPT
 * Inline-JavaScript für flash-freien Dark Mode Support.
 * Wird vor React-Hydration ausgeführt.
 */
const modeScript = `
  // Media Query für System-Dark-Mode Erkennung
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // Initiale Mode-Anwendung
  updateMode()
  
  // Event-Listener für automatische Updates
  darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)  // Cross-Tab Sync

  /**
   * MODE UPDATE FUNKTION
   * Bestimmt und wendet Dark/Light Mode basierend auf Nutzer-Präferenzen an
   */
  function updateMode() {
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)

    // Tailwind Dark Mode Klasse hinzufügen/entfernen
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // LocalStorage bereinigen wenn Mode dem System entspricht
    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
  }

  /**
   * TRANSITION SUPPRESSION
   * Verhindert störende Animationen während Theme-Wechsel
   */
  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  /**
   * MODE UPDATE OHNE TRANSITIONS
   * Kombiniert Mode-Update mit Transition-Suppression
   */
  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`

export default function Document() {
  return (
    <Html className="h-full antialiased" lang="en">
      <Head>
        {/* Dark Mode Script - Muss vor allem anderen Content geladen werden */}
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        
        {/* FAVICONS UND PWA MANIFEST */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.svg" sizes="16x16" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d9488" />  {/* Teal-600 für Brand Identity */}
        
        {/* RSS FEEDS für Content Syndication */}
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.xml`}
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.json`}
        />
      </Head>
      
      {/* BODY mit Flexbox-Layout für Sticky Footer */}
      <body className="flex h-full flex-col bg-zinc-50 dark:bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
