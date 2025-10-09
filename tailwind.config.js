/**
 * =============================================================================
 * TAILWIND CSS KONFIGURATION
 * =============================================================================
 * 
 * Diese Datei konfiguriert das Tailwind CSS Framework für die WWISCA 
 * Camper-Rental Plattform. Tailwind ist ein utility-first CSS Framework,
 * das durch vordefinierte Klassen das Styling beschleunigt.
 * 
 * HAUPTFUNKTIONEN:
 * - Responsive Design System mit konsistenten Breakpoints
 * - Dark Mode Unterstützung mit class-basierter Umschaltung
 * - Typography Plugin für optimierte Textdarstellung
 * - Custom Font Sizes für bessere Typografie-Hierarchie
 * - Extensive Color Palette für Branding und UI-Konsistenz
 * - Custom Spacing und Layout-Utilities
 * 
 * DESIGN SYSTEM:
 * - Primärfarben: Teal-Palette für CTA-Elemente und Navigation
 * - Sekundärfarben: Gray-Palette für Text und Hintergründe
 * - Accent-Farben: Orange und weitere für Highlights
 * - Responsive Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
 * 
 * VERWENDUNG:
 * - Klassen werden automatisch in React-Komponenten verwendet
 * - JIT (Just-In-Time) Compilation für optimale Performance
 * - PurgeCSS entfernt ungenutzte Styles im Production Build
 * 
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class',
  plugins: [require('@tailwindcss/typography')],
  theme: {
    /**
     * CUSTOM FONT SIZES
     * Erweiterte Font-Size Palette für bessere typografische Hierarchie.
     * Jede Größe hat eine optimierte Line-Height für bessere Lesbarkeit.
     */
    fontSize: {
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],    // 13px - Kleinste Texte, Metadaten
      sm: ['0.875rem', { lineHeight: '1.5rem' }],     // 14px - Labels, Captions
      base: ['1rem', { lineHeight: '1.75rem' }],      // 16px - Standard Body Text
      lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px - Hervorgehobener Text
      xl: ['1.25rem', { lineHeight: '2rem' }],        // 20px - Untertitel
      '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px - Kleine Überschriften
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - Mittlere Überschriften
      '4xl': ['2rem', { lineHeight: '2.5rem' }],      // 32px - Große Überschriften
      '5xl': ['3rem', { lineHeight: '3.5rem' }],      // 48px - Hero Headlines
      '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px - Display Headlines
      '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px - Extra Large Display
      '8xl': ['6rem', { lineHeight: '1' }],           // 96px - Marketing Headlines
      '9xl': ['8rem', { lineHeight: '1' }],           // 128px - Massive Display
    },

    /**
     * TYPOGRAPHY KONFIGURATION
     * Erweitert das @tailwindcss/typography Plugin für optimale Textdarstellung
     * mit Dark Mode Unterstützung und konsistenter Farbpalette.
     */
    typography: (theme) => ({
      // Dark Mode Typography - Invertierte Farbpalette für dunkle Themes
      invert: {
        css: {
          '--tw-prose-body': 'var(--tw-prose-invert-body)',
          '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
          '--tw-prose-links': 'var(--tw-prose-invert-links)',
          '--tw-prose-links-hover': 'var(--tw-prose-invert-links-hover)',
          '--tw-prose-underline': 'var(--tw-prose-invert-underline)',
          '--tw-prose-underline-hover':
            'var(--tw-prose-invert-underline-hover)',
          '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
          '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
          '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
          '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
          '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
          '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
          '--tw-prose-code': 'var(--tw-prose-invert-code)',
          '--tw-prose-code-bg': 'var(--tw-prose-invert-code-bg)',
          '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
          '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
          '--tw-prose-pre-border': 'var(--tw-prose-invert-pre-border)',
          '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
          '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
        },
      },
      // Standard Light Mode Typography - Optimiert für Lesbarkeit
      DEFAULT: {
        css: {
          '--tw-prose-body': theme('colors.zinc.600'),     // Haupttext in warmem Grau
          '--tw-prose-headings': theme('colors.zinc.900'), // Überschriften in dunklem Grau
          '--tw-prose-links': theme('colors.teal.500'),    // Links in Markenfarbe
          '--tw-prose-links-hover': theme('colors.teal.600'),         // Hover-Zustand für Links
          '--tw-prose-underline': theme('colors.teal.500 / 0.2'),   // Subtile Link-Unterstreichung
          '--tw-prose-underline-hover': theme('colors.teal.500'),   // Verstärkte Hover-Unterstreichung
          '--tw-prose-bold': theme('colors.zinc.900'),              // Fettschrift in dunklem Grau
          '--tw-prose-counters': theme('colors.zinc.900'),          // Listennummerierung
          '--tw-prose-bullets': theme('colors.zinc.900'),           // Listenpunkte
          '--tw-prose-hr': theme('colors.zinc.100'),                // Horizontale Trennlinien
          '--tw-prose-quote-borders': theme('colors.zinc.200'),     // Zitat-Rahmen
          '--tw-prose-captions': theme('colors.zinc.400'),          // Bildunterschriften
          '--tw-prose-code': theme('colors.zinc.700'),              // Inline Code
          '--tw-prose-code-bg': theme('colors.zinc.300 / 0.2'),    // Code Hintergrund
          '--tw-prose-pre-code': theme('colors.zinc.100'),          // Code Block Text
          '--tw-prose-pre-bg': theme('colors.zinc.900'),            // Code Block Hintergrund
          '--tw-prose-pre-border': 'transparent',                   // Code Block Rahmen
          '--tw-prose-th-borders': theme('colors.zinc.200'),        // Tabellen-Header Rahmen
          '--tw-prose-td-borders': theme('colors.zinc.100'),        // Tabellen-Zellen Rahmen

          // Dark Mode Variablen - Für automatische Umschaltung bei Theme-Wechsel
          '--tw-prose-invert-body': theme('colors.zinc.400'),       // Dunkler Modus: Haupttext
          '--tw-prose-invert-headings': theme('colors.zinc.200'),   // Dunkler Modus: Überschriften
          '--tw-prose-invert-links': theme('colors.teal.400'),      // Dunkler Modus: Links
          '--tw-prose-invert-links-hover': theme('colors.teal.400'), // Dunkler Modus: Link Hover
          '--tw-prose-invert-underline': theme('colors.teal.400 / 0.3'), // Dunkler Modus: Unterstreichung
          '--tw-prose-invert-underline-hover': theme('colors.teal.400'), // Dunkler Modus: Hover Unterstreichung
          '--tw-prose-invert-bold': theme('colors.zinc.200'),       // Dunkler Modus: Fettschrift
          '--tw-prose-invert-counters': theme('colors.zinc.200'),   // Dunkler Modus: Zähler
          '--tw-prose-invert-bullets': theme('colors.zinc.200'),    // Dunkler Modus: Bullets
          '--tw-prose-invert-hr': theme('colors.zinc.700 / 0.4'),   // Dunkler Modus: Trennlinien
          '--tw-prose-invert-quote-borders': theme('colors.zinc.500'), // Dunkler Modus: Zitat-Rahmen
          '--tw-prose-invert-captions': theme('colors.zinc.500'),     // Dunkler Modus: Bildunterschriften
          '--tw-prose-invert-code': theme('colors.zinc.300'),         // Dunkler Modus: Inline Code
          '--tw-prose-invert-code-bg': theme('colors.zinc.200 / 0.05'), // Dunkler Modus: Code Hintergrund
          '--tw-prose-invert-pre-code': theme('colors.zinc.100'),     // Dunkler Modus: Code Block Text
          '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 0.4)',            // Dunkler Modus: Code Block BG
          '--tw-prose-invert-pre-border': theme('colors.zinc.200 / 0.1'), // Dunkler Modus: Code Border
          '--tw-prose-invert-th-borders': theme('colors.zinc.700'),   // Dunkler Modus: Table Header
          '--tw-prose-invert-td-borders': theme('colors.zinc.800'),   // Dunkler Modus: Table Cells

          // GRUNDLEGENDE TYPOGRAFIE-STILE
          color: 'var(--tw-prose-body)',      // Verwendet CSS Custom Properties für Theme-Flexibilität
          lineHeight: theme('lineHeight.7'),  // Optimierte Zeilenhöhe für Lesbarkeit

          // Globaler Abstand zwischen Elementen
          '> *': {
            marginTop: theme('spacing.10'),    // 40px Abstand zwischen Hauptelementen
            marginBottom: theme('spacing.10'),
          },

          // Absätze mit reduziertem Abstand für besseren Textfluss
          p: {
            marginTop: theme('spacing.7'),     // 28px Abstand für Absätze
            marginBottom: theme('spacing.7'),
          },

          // ÜBERSCHRIFTEN-HIERARCHIE
          // Konsistente Größen und Abstände für klare Content-Struktur
          'h2, h3': {
            color: 'var(--tw-prose-headings)',
            fontWeight: theme('fontWeight.semibold'), // 600 - Mittleres Gewicht
          },

          // H2 - Hauptüberschriften (Sektionen)
          h2: {
            fontSize: theme('fontSize.xl')[0],        // 20px
            lineHeight: theme('lineHeight.7'),        // 28px
            marginTop: theme('spacing.20'),           // 80px - Großer Abstand zu vorherigem Content
            marginBottom: theme('spacing.4'),         // 16px - Kompakter Abstand zum folgenden Content
          },

          // H3 - Unterüberschriften (Subsektionen)
          h3: {
            fontSize: theme('fontSize.base')[0],      // 16px - Gleiche Größe wie Body Text aber fett
            lineHeight: theme('lineHeight.7'),        // 28px
            marginTop: theme('spacing.16'),           // 64px - Mittlerer Abstand
            marginBottom: theme('spacing.4'),         // 16px
          },
          // Direktes nachfolgendes Element nach Überschriften hat keinen Top-Margin
          ':is(h2, h3) + *': {
            marginTop: 0, // Verhindert doppelte Abstände nach Überschriften
          },

          // BILDER UND MEDIEN
          // Abgerundete Ecken für moderne Optik
          img: {
            borderRadius: theme('borderRadius.3xl'), // 24px Radius für sanfte Ecken
          },

          // INLINE ELEMENTE UND INTERAKTIVE KOMPONENTEN
          
          // Links mit sanften Hover-Effekten
          a: {
            color: 'var(--tw-prose-links)',              // Teal Markenfarbe
            fontWeight: theme('fontWeight.semibold'),    // Halbfett für bessere Sichtbarkeit
            textDecoration: 'underline',                 // Standard Unterstreichung
            textDecorationColor: 'var(--tw-prose-underline)', // Subtile Unterstreichungsfarbe
            transitionProperty: 'color, text-decoration-color', // Animierte Eigenschaften
            transitionDuration: theme('transitionDuration.150'), // 150ms Animation
            transitionTimingFunction: theme('transitionTimingFunction.in-out'), // Sanfte Kurve
          },
          
          // Link Hover-Zustand für bessere UX
          'a:hover': {
            color: 'var(--tw-prose-links-hover)',        // Dunklere Teal-Variante
            textDecorationColor: 'var(--tw-prose-underline-hover)', // Verstärkte Unterstreichung
          },
          
          // Fettgedruckter Text
          strong: {
            color: 'var(--tw-prose-bold)',               // Dunkles Grau für Kontrast
            fontWeight: theme('fontWeight.semibold'),    // 600 Gewicht
          },
          
          // Inline Code Styling
          code: {
            display: 'inline-block',                     // Bessere Kontrolle über Spacing
            color: 'var(--tw-prose-code)',               // Dunkleres Grau
            fontSize: theme('fontSize.sm')[0],           // 14px - Kleiner als Body Text
            fontWeight: theme('fontWeight.semibold'),        // Halbfett für Lesbarkeit
            backgroundColor: 'var(--tw-prose-code-bg)',   // Subtiler Hintergrund
            borderRadius: theme('borderRadius.lg'),       // 8px Radius
            paddingLeft: theme('spacing.1'),              // 4px Padding links
            paddingRight: theme('spacing.1'),             // 4px Padding rechts
          },
          
          // Code innerhalb von Links erbt die Link-Farbe
          'a code': {
            color: 'inherit',
          },
          
          // Code in Überschriften ist fetter dargestellt
          ':is(h2, h3) code': {
            fontWeight: theme('fontWeight.bold'),          // 700 Gewicht für Überschriften
          },

          // ZITATE UND HERVORGEHOBENE INHALTE
          
          // Blockquotes mit linkem Rahmen und Einrückung
          blockquote: {
            paddingLeft: theme('spacing.6'),               // 24px Einrückung
            borderLeftWidth: theme('borderWidth.2'),       // 2px linker Rahmen
            borderLeftColor: 'var(--tw-prose-quote-borders)', // Grauer Rahmen
            fontStyle: 'italic',                           // Kursive Schrift für Zitate
          },

          // BILDUNTERSCHRIFTEN UND METADATEN
          
          // Figure Captions mit reduzierter Größe und Kontrast
          figcaption: {
            color: 'var(--tw-prose-captions)',             // Gedämpfte Farbe
            fontSize: theme('fontSize.sm')[0],             // 14px - Kleiner als Body
            lineHeight: theme('lineHeight.6'),             // 24px Zeilenhöhe
            marginTop: theme('spacing.3'),                 // 12px Abstand zum Bild
          },
          
          // Absätze in Bildunterschriften ohne Margin
          'figcaption > p': {
            margin: 0,                                     // Kein zusätzlicher Abstand
          },

          // LISTEN UND AUFZÄHLUNGEN
          // Strukturierte Darstellung von Listen mit konsistenten Abständen
          
          // Ungeordnete Listen mit Punkten
          ul: {
            listStyleType: 'disc',                         // Standardpunkte für erste Ebene
          },
          
          // Geordnete Listen mit Zahlen
          ol: {
            listStyleType: 'decimal',                      // Arabische Zahlen
          },
          
          // Gemeinsame Einrückung für alle Listen
          'ul, ol': {
            paddingLeft: theme('spacing.6'),               // 24px Einrückung vom linken Rand
          },
          
          // Listenpunkte mit ausreichend Abstand
          li: {
            marginTop: theme('spacing.6'),                 // 24px Abstand zwischen Punkten
            marginBottom: theme('spacing.6'),
            paddingLeft: theme('spacing[3.5]'),            // 14px zusätzlicher Abstand zum Marker
          },
          
          // Styling der Listen-Marker (Punkte/Zahlen)
          'li::marker': {
            fontSize: theme('fontSize.sm')[0],             // 14px - Etwas kleiner als Body Text
            fontWeight: theme('fontWeight.semibold'),      // Halbfett für bessere Sichtbarkeit
          },
          
          // Zahlen in geordneten Listen
          'ol > li::marker': {
            color: 'var(--tw-prose-counters)',             // Dunkles Grau für Zahlen
          },
          
          // Punkte in ungeordneten Listen
          'ul > li::marker': {
            color: 'var(--tw-prose-bullets)',              // Dunkles Grau für Bullets
          },
          
          // Verschachtelte Listen mit reduziertem Abstand
          'li :is(ol, ul)': {
            marginTop: theme('spacing.4'),                 // 16px - Weniger Abstand in verschachtelten Listen
            marginBottom: theme('spacing.4'),
          },
          
          // Listenpunkte und Absätze in Listen mit kompakterem Abstand
          'li :is(li, p)': {
            marginTop: theme('spacing.3'),                 // 12px - Kompakter für besseren Textfluss
            marginBottom: theme('spacing.3'),
          },

          // CODE BLÖCKE UND SYNTAX HIGHLIGHTING
          // Styled für optimale Code-Darstellung mit dunklem Theme
          
          pre: {
            color: 'var(--tw-prose-pre-code)',             // Helle Schrift auf dunklem Grund
            fontSize: theme('fontSize.sm')[0],             // 14px - Standard Code-Größe
            fontWeight: theme('fontWeight.medium'),        // 500 - Mittleres Gewicht für Lesbarkeit
            backgroundColor: 'var(--tw-prose-pre-bg)',     // Dunkler Hintergrund (Zinc 900)
            borderRadius: theme('borderRadius.3xl'),       // 24px - Große abgerundete Ecken
            padding: theme('spacing.8'),                   // 32px Padding für ausreichend Platz
            overflowX: 'auto',                             // Horizontales Scrollen bei langen Zeilen
            border: '1px solid',                           // Subtiler Rahmen
            borderColor: 'var(--tw-prose-pre-border)',     // Transparenter Rahmen (definiert in CSS Vars)
          },
          
          // Code innerhalb von Pre-Blöcken resettet Inline-Styles
          'pre code': {
            display: 'inline',                             // Normaler Inline-Flow
            color: 'inherit',                              // Erbt Farbe vom Pre-Element
            fontSize: 'inherit',                           // Erbt Größe vom Pre-Element
            fontWeight: 'inherit',                         // Erbt Gewicht vom Pre-Element
            backgroundColor: 'transparent',               // Kein Hintergrund (wird von Pre bereitgestellt)
            borderRadius: 0,                              // Keine abgerundeten Ecken
            padding: 0,                                   // Kein zusätzliches Padding
          },

          // HORIZONTALE TRENNLINIEN
          // Großzügige Abstände für klare Sektions-Trennung
          hr: {
            marginTop: theme('spacing.20'),               // 80px Abstand oben
            marginBottom: theme('spacing.20'),            // 80px Abstand unten
            borderTopWidth: '1px',                        // Dünne obere Linie
            borderColor: 'var(--tw-prose-hr)',            // Subtile graue Farbe
            '@screen lg': {                               // Auf größeren Bildschirmen:
              marginLeft: `calc(${theme('spacing.12')} * -1)`,  // -48px links (über Container hinaus)
              marginRight: `calc(${theme('spacing.12')} * -1)`, // -48px rechts (über Container hinaus)
            },
          },

          // TABELLEN
          // Strukturierte Darstellung tabellarischer Daten
          
          table: {
            width: '100%',                                // Volle Breite des Containers
            tableLayout: 'auto',                          // Automatische Spaltenbreite
            textAlign: 'left',                            // Linksbündig (deutsch üblich)
            fontSize: theme('fontSize.sm')[0],            // 14px - Kompaktere Darstellung
          },
          
          // Tabellen-Header mit Untergrenze
          thead: {
            borderBottomWidth: '1px',                     // Trennlinie unter Header
            borderBottomColor: 'var(--tw-prose-th-borders)', // Graue Linie
          },
          
          // Header-Zellen Styling
          'thead th': {
            color: 'var(--tw-prose-headings)',            // Dunkle Farbe für Wichtigkeit
            fontWeight: theme('fontWeight.semibold'),     // Halbfett zur Hervorhebung
            verticalAlign: 'bottom',                      // Untere Ausrichtung
            paddingBottom: theme('spacing.2'),            // 8px Abstand zur Trennlinie
          },
          
          // Header-Spalten mit seitlichem Padding (außer erste/letzte)
          'thead th:not(:first-child)': {
            paddingLeft: theme('spacing.2'),              // 8px links (außer erste Spalte)
          },
          'thead th:not(:last-child)': {
            paddingRight: theme('spacing.2'),             // 8px rechts (außer letzte Spalte)
          },
          
          // Tabellen-Body Zeilen mit Trennlinien
          'tbody tr': {
            borderBottomWidth: '1px',                     // Trennlinie zwischen Zeilen
            borderBottomColor: 'var(--tw-prose-td-borders)', // Hellgraue Linien
          },
          
          // Letzte Zeile ohne untere Trennlinie
          'tbody tr:last-child': {
            borderBottomWidth: 0,                         // Keine Linie nach letzter Zeile
          },
          
          // Standard-Zellen mit Basis-Ausrichtung
          'tbody td': {
            verticalAlign: 'baseline',                    // Text an Grundlinie ausrichten
          },
          
          // Tabellen-Footer mit oberer Trennlinie
          tfoot: {
            borderTopWidth: '1px',                        // Trennlinie über Footer
            borderTopColor: 'var(--tw-prose-th-borders)', // Gleiche Farbe wie Header
          },
          
          // Footer-Zellen mit Top-Ausrichtung
          'tfoot td': {
            verticalAlign: 'top',                         // Oben ausrichten
          },
          
          // Padding für alle Body- und Footer-Zellen
          ':is(tbody, tfoot) td': {
            paddingTop: theme('spacing.2'),               // 8px oben
            paddingBottom: theme('spacing.2'),            // 8px unten
          },
          
          // Seitliches Padding für Tabellen-Zellen
          ':is(tbody, tfoot) td:not(:first-child)': {
            paddingLeft: theme('spacing.2'),              // 8px links (außer erste Spalte)
          },
          ':is(tbody, tfoot) td:not(:last-child)': {
            paddingRight: theme('spacing.2'),             // 8px rechts (außer letzte Spalte)
          },
        },
      },
    }),

    /**
     * EXTEND KONFIGURATION
     * Hier können weitere Theme-Erweiterungen hinzugefügt werden:
     * - Custom Colors für Branding
     * - Additional Font Families
     * - Custom Spacing Values
     * - Animation und Transition Presets
     */
    extend: {
      // Platz für zukünftige Theme-Erweiterungen
      // Beispiel: colors, fontFamily, spacing, etc.
    },
  },
};
