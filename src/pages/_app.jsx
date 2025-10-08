import { useEffect, useRef } from 'react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageProvider } from '@/services/multilanguageService'
import { notificationService } from '@/services/notificationService'
import { authService } from '@/services/userAuthenticationService'
import { CookieProvider } from '@/services/browserCookieManager'
import { CookieBanner, CookieSettings } from '@/components/CookieComponents'

import '@/styles/tailwind.css'
import 'focus-visible'

function usePrevious(value) {
  let ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default function App({ Component, pageProps, router }) {
  let previousPathname = usePrevious(router.pathname)

  // Initialize notification service
  useEffect(() => {
    const initializeNotifications = async () => {
      // Check if user is authenticated
      const user = authService.getCurrentUser();
      if (user) {
        // Initialize notification service with user ID
        notificationService.initialize(user.id);
        
        // Request browser notification permission
        await notificationService.requestPermission();
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      notificationService.disconnect();
    };
  }, []);

  return (
    <CookieProvider>
      <LanguageProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="CamperShare - Ihr Partner für unvergessliche Reiseerlebnisse" />
          <meta name="author" content="CamperShare Team" />
          <meta property="og:title" content="CamperShare - Wohnmobil-Vermietung" />
          <meta property="og:description" content="Premium Wohnmobile für Ihr nächstes Abenteuer" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@campershare" />
          <link rel="icon" href="/images/logos/campershare-icon.svg" />
          <link rel="shortcut icon" href="/images/logos/campershare-icon.svg" />
          <link rel="canonical" href="https://campershare.com" />
        </Head>
        
        {/* Vollbreites Layout ohne schwarze Balken */}
        <div className="min-h-screen bg-white dark:bg-zinc-900">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 w-full">
              <Component previousPathname={previousPathname} {...pageProps} />
            </main>
            <Footer />
          </div>
        </div>

        {/* Cookie Banner & Settings */}
        <CookieBanner />
        <CookieSettings />
      </LanguageProvider>
    </CookieProvider>
  )
}
