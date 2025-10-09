/**
 * =============================================================================
 * CARD KOMPONENTE SYSTEM
 * =============================================================================
 * 
 * Modulares Card-System für konsistente Content-Darstellung mit verschiedenen
 * Unter-Komponenten. Optimiert für Blog-Posts, Fahrzeugkarten und Listen.
 * 
 * KOMPONENTEN:
 * - Card: Basis Container mit Hover-Effekten
 * - Card.Link: Klickbare Overlay-Verknüpfung  
 * - Card.Title: Überschrift mit optionalem Link
 * - Card.Description: Beschreibungstext
 * - Card.Cta: Call-to-Action mit Icon
 * - Card.Eyebrow: Metadaten/Label am oberen Rand
 * 
 * DESIGN FEATURES:
 * - Smooth Scale-Animationen beim Hovern
 * - Dark Mode kompatible Farbpalette
 * - Accessibility-optimierte Link-Bereiche
 * - Flexible HTML Tag-Überrides
 * - Z-Index Management für Layering
 * 
 * VERWENDUNG:
 * <Card>
 *   <Card.Eyebrow decorate>Kategorie</Card.Eyebrow>
 *   <Card.Title href="/artikel">Artikel Titel</Card.Title>
 *   <Card.Description>Kurze Beschreibung...</Card.Description>
 *   <Card.Cta>Weiterlesen</Card.Cta>
 * </Card>
 */
import Link from 'next/link'
import clsx from 'clsx'

/**
 * CHEVRON RIGHT ICON
 * Inline SVG für CTA-Pfeile (momentan auskommentiert in Card.Cta)
 */
function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.75 5.75 9.25 8l-2.5 2.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * HAUPT CARD KOMPONENTE
 * Basis-Container mit flexiblem HTML-Tag und Hover-Gruppierung
 */
export function Card({ as: Component = 'div', className, children }) {
  return (
    <Component
      className={clsx(className, 'group relative flex flex-col items-start')}
    >
      {children}
    </Component>
  )
}

/**
 * CARD LINK OVERLAY
 * Unsichtbare Klick-Fläche die die gesamte Card verlinkt
 * Erzeugt Hover-Effekt mit Hintergrund-Animation
 */
Card.Link = function CardLink({ children, ...props }) {
  return (
    <>
      {/* Hover-Hintergrund mit Scale-Animation */}
      <div className="absolute -inset-y-6 -inset-x-4 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 sm:-inset-x-6 sm:rounded-2xl" />
      <Link {...props}>
        {/* Klickbare Fläche (unsichtbar, über gesamte Card) */}
        <span className="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
        {/* Sichtbarer Content */}
        <span className="relative z-10">{children}</span>
      </Link>
    </>
  )
}

/**
 * CARD TITEL
 * Überschrift mit optionaler Link-Funktionalität
 */
Card.Title = function CardTitle({ as: Component = 'h2', href, children }) {
  return (
    <Component className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
      {href ? <Card.Link href={href}>{children}</Card.Link> : children}
    </Component>
  )
}

/**
 * CARD BESCHREIBUNG
 * Sekundärer Text unter dem Titel mit gedämpfter Farbe
 */
Card.Description = function CardDescription({ children }) {
  return (
    <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
      {children}
    </p>
  )
}

/**
 * CARD CALL-TO-ACTION
 * Styled Link mit Markenfarbe für Aktionen
 * Chevron-Icon ist auskommentiert aber verfügbar
 */
Card.Cta = function CardCta({ children }) {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
    >
      {children}
      {/* <ChevronRightIcon className="ml-1 h-4 w-4 stroke-current" /> */}
    </div>
  )
}

/**
 * CARD EYEBROW (METADATEN)
 * Kleine Labels/Kategorien am oberen Rand der Card
 * Unterstützt optionale linke Dekoration
 */
Card.Eyebrow = function CardEyebrow({
  as: Component = 'p',
  decorate = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        className,
        'relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500',
        decorate && 'pl-3.5'  // Zusätzliches Padding wenn Dekoration aktiv
      )}
      {...props}
    >
      {/* Optionale linke Dekoration (vertikale Linie) */}
      {decorate && (
        <span
          className="absolute inset-y-0 left-0 flex items-center"
          aria-hidden="true"
        >
          <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
        </span>
      )}
      {children}
    </Component>
  )
}
