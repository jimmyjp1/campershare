/**
 * =============================================================================
 * CONTAINER KOMPONENTE
 * =============================================================================
 * 
 * Wiederverwendbare Layout-Komponente für konsistente Content-Zentrierung
 * und responsive Padding. Bildet das Foundation für alle Seiten-Layouts.
 * 
 * EIGENSCHAFTEN:
 * - Maximale Breite von 7xl (80rem/1280px) für optimale Lesbarkeit
 * - Automatische horizontale Zentrierung mit mx-auto
 * - Responsive Padding: 16px (mobile) → 24px (tablet) → 32px (desktop)
 * - Forward Ref Support für Parent-Child Interaktionen
 * - Vollständig anpassbar durch className Override
 * 
 * VERWENDUNG:
 * <Container>
 *   <h1>Seiten-Inhalt</h1>
 *   <p>Automatisch zentriert und responsive gepaddet</p>
 * </Container>
 * 
 * <Container className="py-16">
 *   <section>Mit zusätzlichem vertikalen Padding</section>
 * </Container>
 * 
 * RESPONSIVE VERHALTEN:
 * - Mobile (default): px-4 (16px seitlich)
 * - Tablet (sm:640px+): px-6 (24px seitlich)  
 * - Desktop (lg:1024px+): px-8 (32px seitlich)
 * - Max-Width stoppt bei 1280px für optimale Zeilenlänge
 */
import { forwardRef } from 'react'
import clsx from 'clsx'

const Container = forwardRef(function Container(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
})

export { Container }
