/**
 * CamperShare - Footer-Komponente (Footer.jsx)
 * 
 * Der globale Footer der Anwendung mit umfassenden Links und Informationen.
 * Enthält alle wichtigen Seiten-Links, rechtliche Hinweise und Kontaktdaten.
 * 
 * Features:
 * - Responsive Multi-Spalten-Layout
 * - Dark Mode Unterstützung
 * - Mehrsprachige Links und Texte
 * - Cookie-Status-Anzeige
 * - Scroll-Animation beim ersten Erscheinen
 * - Social Media Links
 * - Rechtliche Compliance (DSGVO)
 * 
 * Struktur:
 * - Logo und Unternehmensbeschreibung
 * - Navigation (Hauptseiten)
 * - Services (Buchung, Support, etc.)
 * - Rechtliches (Datenschutz, Impressum)
 * - Kontaktinformationen
 */

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

import { Container } from '@/components/Container'
import { CamperShareIcon } from '@/components/CamperShareIcon'
import { CookieStatusButton } from '@/components/CookieComponents'
import { useLanguage } from '@/services/multilanguageService'

/**
 * Einzelner Navigations-Link mit Hover-Effekten
 * Verwendet für alle internen und externen Links im Footer
 */
function NavLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`text-zinc-600 dark:text-zinc-400 transition hover:text-teal-500 dark:hover:text-teal-400 ${className}`}
    >
      {children}
    </Link>
  )
}

/**
 * Custom Hook: Footer Scroll-Animation
 * Triggert eine Ein-Blende-Animation wenn der Footer ins Viewport kommt
 */
function useFooterAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true) // Animation nur einmal triggern
        }
      },
      {
        threshold: 0.1, // Trigger bei 10% Sichtbarkeit
        rootMargin: '0px 0px -50px 0px' // 50px Puffer vom unteren Bildschirmrand
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

export function Footer() {
  const [footerRef, isVisible] = useFooterAnimation()
  const { t } = useLanguage()

  return (
    <footer 
      ref={footerRef}
      className={`mt-32 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 transform transition-all duration-1000 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-8 opacity-0'
      }`}
    >
      <Container>
        <div className="pt-16 pb-8">
          {/* Main Footer Content */}
          <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 mb-12 transform transition-all duration-1000 ease-out ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: isVisible ? '0.2s' : '0' }}
          >
            {/* Company Info */}
            <div className={`lg:col-span-1 transform transition-all duration-700 ease-out ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: isVisible ? '0.3s' : '0' }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <CamperShareIcon className="h-10 w-10 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                  CamperShare
                </h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                {t('footer.companyDescription')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.312-.219-.312-.219c0-1.188.687-2.077 1.542-2.077.728 0 1.219.219 1.219 1.188 0 .728-.219 1.188-.219 1.875s.312 1.542 1.219 1.542c1.188 0 2.077-.687 2.077-1.875 0-1.875-1.188-2.77-3.439-2.77-2.351 0-3.439 1.667-3.439 3.439 0 .728.312 1.188.312 1.875 0 .312-.105.625-.312.625-.728 0-1.188-.937-1.188-1.875 0-1.875 1.188-3.439 3.439-3.439 1.875 0 3.439 1.188 3.439 3.439 0 2.077-1.188 3.439-3.439 3.439-1.188 0-2.077-.312-2.77-.937-.312.937-.625 2.077-.937 3.439 6.883-.312 12.017-6.154 12.017-11.987C24.035 5.367 18.635.029 12.017.029z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className={`transform transition-all duration-700 ease-out ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: isVisible ? '0.4s' : '0' }}
            >
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                {t('footer.navigation')}
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <NavLink href="/">{t('footer.home')}</NavLink>
                </li>
                <li>
                  <NavLink href="/campers">{t('footer.campers')}</NavLink>
                </li>
                <li>
                  <NavLink href="/about">{t('footer.about')}</NavLink>
                </li>
                <li>
                  <NavLink href="/contact">{t('footer.contactUs')}</NavLink>
                </li>
                <li>
                  <NavLink href="/faq">{t('footer.faq')}</NavLink>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className={`transform transition-all duration-700 ease-out ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: isVisible ? '0.5s' : '0' }}
            >
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                {t('footer.services')}
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <NavLink href="/booking">{t('footer.booking')}</NavLink>
                </li>
                <li>
                  <NavLink href="/insurance">{t('footer.insurance')}</NavLink>
                </li>
                <li>
                  <NavLink href="/support">{t('footer.support')}</NavLink>
                </li>
                <li>
                  <NavLink href="/wishlist">{t('footer.wishlist')}</NavLink>
                </li>
                <li>
                  <NavLink href="/profile">{t('footer.profile')}</NavLink>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className={`transform transition-all duration-700 ease-out ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: isVisible ? '0.6s' : '0' }}
            >
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                {t('footer.contact')}
              </h3>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span>info@campershare.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <span>+49 (0) 123 456 789</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="h-4 w-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span>Musterstraße 123<br />12345 Berlin, Deutschland</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Section */}
          <div className={`border-t border-zinc-200 dark:border-zinc-700/60 pt-8 transform transition-all duration-700 ease-out ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: isVisible ? '0.7s' : '0' }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  © {t('footer.copyright')} {new Date().getFullYear()}
                </p>
              </div>
              
              {/* Legal Links */}
              <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-xs">
                <NavLink href="/privacy" className="text-zinc-500 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400">Datenschutz</NavLink>
                <NavLink href="/terms" className="text-zinc-500 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400">Allgemeine Geschäftsbedingungen</NavLink>
                <NavLink href="/impressum" className="text-zinc-500 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400">Impressum</NavLink>
                <CookieStatusButton />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
