/**
 * =============================================================================
 * BUTTON KOMPONENTE
 * =============================================================================
 * 
 * Universelle Button-Komponente mit konsistentem Styling und mehreren Varianten.
 * Unterstützt sowohl normale Buttons als auch Next.js Link-Routing.
 * 
 * EIGENSCHAFTEN:
 * - Drei visuelle Varianten: primary, secondary, outline
 * - Vier Größen: sm, md, lg, xl mit responsive Padding
 * - Dark Mode Unterstützung mit optimierten Farben
 * - Automatische Link-Erkennung über href Property
 * - Accessibility-optimiert mit Focus States
 * - Smooth Transitions für bessere UX
 * 
 * VERWENDUNG:
 * <Button variant="primary" size="lg" href="/booking">
 *   Jetzt buchen
 * </Button>
 * 
 * <Button variant="secondary" onClick={handleClick}>
 *   Abbrechen
 * </Button>
 * 
 * DESIGN SYSTEM:
 * - Primary: Teal-Markenfarbe für CTA-Actions
 * - Secondary: Neutrales Grau für sekundäre Actions
 * - Outline: Minimales Design für tertiary Actions
 */
import Link from 'next/link'
import clsx from 'clsx'

/**
 * BUTTON VARIANTEN
 * Definiert das visuelle Styling für verschiedene Button-Types
 */
const variantStyles = {
  // Primary Button - Hauptaktionen wie "Buchen", "Anmelden"
  primary:
    'bg-teal-600 font-semibold text-white hover:bg-teal-700 active:bg-teal-800 active:text-white/90 dark:bg-teal-600 dark:hover:bg-teal-700 dark:active:bg-teal-800 dark:active:text-white/90',
  
  // Secondary Button - Sekundäre Aktionen wie "Abbrechen", "Zurück"
  secondary:
    'bg-zinc-100 font-medium text-zinc-900 hover:bg-zinc-200 active:bg-zinc-200 active:text-zinc-900/80 border border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70 dark:border-zinc-700',
  
  // Outline Button - Minimale Aktionen wie "Mehr erfahren", "Details"
  outline:
    'bg-white font-medium text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 border border-zinc-300 shadow-sm dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:active:bg-zinc-800',
}

/**
 * BUTTON GRÖSSEN
 * Responsive Padding und Schriftgrößen für verschiedene Kontexte
 */
const sizeStyles = {
  sm: 'py-1.5 px-2.5 text-sm',  // 6px/10px - Kompakte Buttons in Listen
  md: 'py-2 px-3 text-sm',      // 8px/12px - Standard Button-Größe
  lg: 'py-3 px-6 text-base',    // 12px/24px - Hervorgehobene Buttons
  xl: 'py-4 px-8 text-lg',      // 16px/32px - Hero Section CTAs
}

export function Button({ variant = 'primary', size = 'md', className, href, ...props }) {
  // Kombiniert alle Styling-Klassen mit Tailwind clsx Utility
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md font-medium outline-offset-2 transition active:transition-none',
    variantStyles[variant],  // Fügt die entsprechende Varianten-Styles hinzu
    sizeStyles[size],        // Fügt die entsprechende Größen-Styles hinzu
    className               // Überschreibt mit benutzerdefinierten Klassen
  )

  // Rendert als Next.js Link wenn href übergeben wird, sonst als normaler Button
  return href ? (
    <Link href={href} className={className} {...props} />
  ) : (
    <button className={className} {...props} />
  )
}
