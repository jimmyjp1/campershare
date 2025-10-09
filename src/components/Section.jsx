/**
 * =============================================================================
 * SECTION LAYOUT KOMPONENTE
 * =============================================================================
 * 
 * Strukturierte Layout-Komponente für Content-Sektionen mit seitlicher
 * Navigation und semantischer HTML-Struktur. Optimiert für About-Pages
 * und ähnliche informative Inhalte.
 * 
 * EIGENSCHAFTEN:
 * - Responsive Grid Layout: 1 Spalte (mobile) → 4 Spalten (desktop)
 * - Linker Border auf Desktop für visuelle Trennung
 * - Accessibility-optimiert mit aria-labelledby Verknüpfung
 * - Automatische ID-Generierung mit useId Hook
 * - Dark Mode kompatible Styling
 * 
 * LAYOUT STRUKTUR:
 * - Title: 1/4 der Breite auf Desktop (linke Spalte)
 * - Content: 3/4 der Breite auf Desktop (rechte Spalten)
 * - Mobile: Titel über Content gestapelt
 * 
 * VERWENDUNG:
 * <Section title="Über uns">
 *   <p>Content der rechts neben dem Titel erscheint...</p>
 *   <p>Weitere Absätze und Inhalte...</p>
 * </Section>
 * 
 * ACCESSIBILITY:
 * - Semantisches <section> Element
 * - Automatische ID/aria-labelledby Verknüpfung
 * - Screen Reader optimierte Struktur
 */
import { useId } from 'react'

export function Section({ title, children }) {
  // Generiert eindeutige ID für Accessibility-Verknüpfung
  let id = useId()

  return (
    <section
      aria-labelledby={id}  // Verknüpft Section mit ihrem Titel für Screen Reader
      className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40"
    >
      {/* Responsive Grid: 1 Spalte mobile, 4 Spalten desktop */}
      <div className="grid max-w-3xl grid-cols-1 items-baseline gap-y-8 md:grid-cols-4">
        {/* Section Titel - Links positioniert auf Desktop */}
        <h2
          id={id}  // ID für aria-labelledby Referenz
          className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
        >
          {title}
        </h2>
        {/* Content Area - Nimmt 3 von 4 Spalten auf Desktop */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </section>
  )
}
