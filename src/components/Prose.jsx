/**
 * =============================================================================
 * PROSE KOMPONENTE
 * =============================================================================
 * 
 * Wrapper-Komponente für typografisch optimierte Textinhalte.
 * Nutzt das Tailwind Typography Plugin für konsistente Darstellung
 * von Fließtexten, Listen, Überschriften und anderen Text-Elementen.
 * 
 * EIGENSCHAFTEN:
 * - Automatische Typography-Klassen Anwendung
 * - Dark Mode Support mit prose-invert
 * - Alle Tailwind Typography Features verfügbar
 * - Vollständig anpassbar durch className Override
 * 
 * VERWENDUNG:
 * <Prose>
 *   <h1>Überschrift</h1>
 *   <p>Automatisch gestylter Fließtext mit optimalen Abständen...</p>
 *   <ul>
 *     <li>Listenpunkte</li>
 *     <li>Werden automatisch gestylt</li>
 *   </ul>
 * </Prose>
 * 
 * <Prose className="prose-lg">
 *   <p>Größere Schrift für wichtige Inhalte</p>
 * </Prose>
 * 
 * DESIGN FEATURES:
 * - Optimierte Zeilenhöhen und Abstände
 * - Konsistente Farbpalette (definiert in tailwind.config.js)
 * - Responsive Typografie
 * - Code-Block und Inline-Code Styling
 * - Automatische Link-Hervorhebung
 */
import clsx from 'clsx'

export function Prose({ children, className }) {
  return (
    <div className={clsx(className, 'prose dark:prose-invert')}>{children}</div>
  )
}
