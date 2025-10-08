import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/services/multilanguageService'
import { Container } from '@/components/Container'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { authService } from '@/services/userAuthenticationService'
import { CamperShareIcon } from '@/components/CamperShareIcon'

function NavItem({ href, children }) {
  let router = useRouter()
  let isActive = router.pathname === href

  return (
    <li>
      <Link
        href={href}
        className={`relative block px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 whitespace-nowrap rounded-md ${
          isActive
            ? 'text-teal-500 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
            : 'hover:text-teal-500 dark:hover:text-teal-400 hover:bg-teal-50/70 dark:hover:bg-teal-900/10 hover:scale-105'
        }`}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 top-full mt-2 h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
        )}
      </Link>
    </li>
  )
}

function DesktopNavigation(props) {
  const { t } = useLanguage()

  return (
    <nav {...props}>
      <ul className="flex rounded-full bg-white/90 px-2 sm:px-3 text-xs sm:text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <NavItem href="/">{t('nav.home')}</NavItem>
        <NavItem href="/about">{t('nav.about')}</NavItem>
        <NavItem href="/campers">{t('nav.campers')}</NavItem>
        <NavItem href="/contact">{t('nav.contact')}</NavItem>
      </ul>
    </nav>
  )
}

function MobileNavigation() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="pointer-events-auto rounded-md bg-white/90 px-2 py-2 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="sr-only">Toggle navigation</span>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-zinc-900/5 dark:bg-zinc-800 dark:ring-white/10 lg:hidden">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.home')}
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.about')}
          </Link>
          <Link
            href="/campers"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.campers')}
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.contact')}
          </Link>
        </div>
      )}
    </>
  )
}

function ModeToggle() {
  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function toggleMode() {
    disableTransitionsTemporarily()

    let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = document.documentElement.classList.toggle('dark')

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    } else {
      window.localStorage.isDarkMode = isDarkMode
    }
  }

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
      onClick={toggleMode}
    >
      <svg
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-teal-50 [@media(prefers-color-scheme:dark)]:stroke-teal-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-teal-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-teal-600"
      >
        <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z" />
        <path d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-teal-500"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
        />
      </svg>
    </button>
  )
}

function UserMenu() {
  const { t } = useLanguage()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    // Check current user
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    // Close menu when clicking outside
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setIsOpen(false)
    router.push('/')
  }

  const handleLogin = () => {
    router.push('/auth')
  }

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="rounded-full bg-teal-600 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-white hover:bg-teal-700 transition-colors"
      >
        {t('auth.login')}
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Analytics Button - nur für Admins */}
      {user.role === 'admin' && (
        <Link
          href="/analytics"
          className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-xl"
          title="Analytics Dashboard"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </Link>
      )}
      
      {/* User Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
        >
        <div className="h-6 w-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
          {(user.firstName || user.first_name)?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="block">{user.firstName || user.first_name || 'User'}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-zinc-800 dark:ring-white/10">
          <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {(user.firstName || user.first_name)} {(user.lastName || user.last_name)}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
          </div>
          
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            {t('auth.profile')}
          </Link>
          
          <Link
            href="/bookings"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            {t('auth.myBookings')}
          </Link>
          
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            {t('auth.settings')}
          </Link>
          
          {user.role === 'admin' && (
            <>
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
              <Link
                href="/analytics"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                onClick={() => setIsOpen(false)}
              >
                Analytics
              </Link>
            </>
          )}
          
          <div className="border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-700"
            >
              {t('auth.logout')}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export function Header() {
  let router = useRouter()
  let isHomePage = router.pathname === '/'

  return (
    <header className="pointer-events-none relative z-50 flex flex-none flex-col">
      <div className="top-0 z-10 h-20 py-5">
        <Container className="w-full">
          <div className="relative flex items-center">
            {/* Logo und Brand - Links */}
            <div className="flex flex-1 items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm p-1.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:ring-white/10 transition-all duration-200 hover:scale-110 hover:shadow-xl">
                <Link href="/" aria-label="Home" className="pointer-events-auto">
                  <div className="rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white h-full w-full hover:from-teal-500 hover:to-blue-700 transition-all duration-200">
                    <CamperShareIcon className="h-8 w-8" />
                  </div>
                </Link>
              </div>
              <div className="hidden sm:block pointer-events-auto">
                <Link href="/" className="text-left hover:opacity-80 transition-all duration-200 hover:scale-105">
                  <h1 className="text-lg font-bold text-teal-600 dark:text-teal-400 leading-tight">CamperShare</h1>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-tight">Premium Wohnmobil-Vermietung</p>
                </Link>
              </div>
            </div>
            
            {/* Navigation - Absolut zentriert */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <DesktopNavigation className="pointer-events-auto hidden lg:block" />
            </div>
            
            {/* User Actions - Rechts */}
            <div className="flex flex-1 justify-end">
              <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 lg:gap-4">
                <UserMenu />
                <div className="hidden sm:block">
                  <ModeToggle />
                </div>
                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>
                <div className="relative lg:hidden">
                  <MobileNavigation />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}
