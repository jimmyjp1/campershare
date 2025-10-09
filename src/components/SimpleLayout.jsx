/**
 * =============================================================================
 * SIMPLE LAYOUT KOMPONENTE
 * =============================================================================
 * 
 * Minimalistisches Layout-Template für Content-Seiten mit fokussierter
 * Darstellung von Titel, Einleitungstext und Hauptinhalt.
 * 
 * EIGENSCHAFTEN:
 * - Clean Design mit großzügigen Abständen
 * - Responsive Typography (4xl → 5xl auf größeren Screens)
 * - Maximale Breite von 2xl (42rem) für optimale Lesbarkeit
 * - Dark Mode kompatible Farbpalette
 * - Konsistente Abstände mit Tailwind Spacing Scale
 * - Flexibles Content-Layout für verschiedene Inhaltstypen
 * 
 * LAYOUT STRUKTUR:
 * - Header: Titel + Intro Text (max-width für Lesbarkeit)
 * - Content: Flexible Darstellung des Children-Contents
 * - Container: Automatische Zentrierung und responsive Padding
 * 
 * VERWENDUNG:
 * <SimpleLayout 
 *   title="Über WWISCA" 
 *   intro="Entdecken Sie unsere Mission und Geschichte."
 * >
 *   <Section title="Geschichte">
 *     <p>Content hier...</p>
 *   </Section>
 * </SimpleLayout>
 * 
 * RESPONSIVE VERHALTEN:
 * - Mobile: mt-16, text-4xl
 * - Desktop (sm+): mt-32, text-5xl, erweiterte Abstände
 * - Optimiert für Touch-Navigation und Desktop-Browsing
 */
import { Container } from '@/components/Container'

export function SimpleLayout({ title, intro, children }) {
  return (
    <Container className="mt-16 sm:mt-32">
      {/* Page Header mit Titel und Einleitung */}
      <header className="max-w-2xl">
        {/* Haupt-Titel mit responsive Typography */}
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          {title}
        </h1>
        {/* Einleitungstext mit gedämpfter Farbe */}
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          {intro}
        </p>
      </header>
      {/* Content Area mit separatem Abstand */}
      <div className="mt-16 sm:mt-20">{children}</div>
    </Container>
  )
}
