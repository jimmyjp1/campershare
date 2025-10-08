import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { useLanguage } from '@/services/multilanguageService'
import { CamperShareIcon } from '@/components/CamperShareIcon'
import { RecentlyViewedVehicles, TravelPlanningHub } from '@/components/CookieBanner'
import { usePageViewTracking, useScrollTracking, useTimeTracking, useAnalytics } from '@/hooks/useAnalytics'

// Hook for bidirectional scroll animations
function useScrollAnimation() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Element ist sichtbar - Animation einblenden
          entry.target.classList.remove('opacity-0', 'translate-y-8')
          entry.target.classList.add('opacity-100', 'translate-y-0')
        } else {
          // Element ist nicht sichtbar - Animation ausblenden
          entry.target.classList.add('opacity-0', 'translate-y-8')
          entry.target.classList.remove('opacity-100', 'translate-y-0')
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return ref
}

// Animated Section Header
function SectionHeader({ title, subtitle }) {
  const ref = useScrollAnimation()
  
  return (
    <div 
      ref={ref}
      className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700"
    >
      <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        {title}
      </h2>
      <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  )
}

// Animated Camper Card
function CamperCard({ van, index }) {
  const ref = useScrollAnimation()
  const { formatPrice, t } = useLanguage()
  const router = useRouter()
  
  const handleViewDetails = () => {
    // Verwende immer den slug aus van, da alle jetzt echte Slugs haben
    if (van.slug) {
      router.push(`/campers/${van.slug}`)
    } else {
      console.error('No slug available for camper:', van.name)
    }
  }
  
  return (
    <div 
      ref={ref}
      className="group opacity-0 translate-y-8 transition-all duration-700"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-3 overflow-hidden border border-white/20 dark:border-zinc-700/50 hover:bg-white/90 dark:hover:bg-zinc-800/90">
        {/* Enhanced Image Area */}
        <div className="relative aspect-video bg-gradient-to-br from-zinc-100/80 to-zinc-200/80 dark:from-zinc-700/50 dark:to-zinc-800/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <CamperShareIcon className="h-16 w-16 text-zinc-400 group-hover:text-teal-500 transition-colors duration-300" />
          </div>
          
          {/* Enhanced Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-xl border border-white/20 ${
              van.badge === 'Premium' ? 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white' :
              van.badge === 'Bestseller' ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white' :
              'bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white'
            }`}>
              {van.badge}
            </span>
          </div>
          
          {/* Enhanced Price Tag */}
          <div className="absolute bottom-4 left-4">
            <div className="backdrop-blur-xl bg-white/90 dark:bg-zinc-800/90 px-4 py-2 rounded-2xl shadow-lg border border-white/20 dark:border-zinc-700/50">
              <span className="font-bold text-lg bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {formatPrice(van.pricePerDay)}{t('home.perDay')}
              </span>
            </div>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Enhanced Content */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {van.name}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
            {van.description}
          </p>
          
          {/* Enhanced Details */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span className="text-sm font-medium">{van.beds} {t('home.beds')}</span>
              </div>
              <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="text-sm font-medium">{van.driveType}</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Features */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {van.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full border border-teal-200/50 dark:border-teal-800/50">
                  {feature}
                </span>
              ))}
              {van.features.length > 3 && (
                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-medium rounded-full">
                  +{van.features.length - 3} mehr
                </span>
              )}
            </div>
          </div>
          
          {/* Enhanced Action Button */}
          <Button 
            className="w-full bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600 text-zinc-900 dark:text-zinc-100 group-hover:from-teal-600 group-hover:to-cyan-600 group-hover:text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            onClick={handleViewDetails}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('home.viewDetails')}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mock-Daten für Wohnmobile
const CAMPER_VANS = [
  {
    id: 1,
    name: 'Mercedes Sprinter Luxus',
    description: 'Vollausgestattetes Luxus-Wohnmobil mit allem Komfort für bis zu 4 Personen.',
    pricePerDay: 89,
    beds: 4,
    driveType: 'Diesel',
    requiredLicense: 'Führerschein B',
    badge: 'Premium',
    features: ['Küche', 'Bad', 'Klimaanlage', 'Solaranlage']
  },
  {
    id: 2,
    name: 'VW Crafter Adventure',
    description: 'Perfekt für Abenteuer - robust und zuverlässig für jedes Terrain.',
    pricePerDay: 69,
    beds: 2,
    driveType: 'Diesel',
    requiredLicense: 'Führerschein B',
    badge: 'Bestseller',
    features: ['Offroad-Ausstattung', 'Markise', 'Küche']
  },
  {
    id: 3,
    name: 'Dethleffs Globebus Family',
    description: 'Geräumiges Familien-Wohnmobil mit separatem Schlafbereich für Kinder.',
    pricePerDay: 95,
    beds: 6,
    driveType: 'Diesel',
    requiredLicense: 'Führerschein B',
    badge: 'Familie',
    features: ['Familienausstattung', 'Spielbereich', 'Doppelbett']
  }
]

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 12l2 2 4-4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  )
}

// Video Background Component mit echtem Crossfade
function VideoBackground() {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [activeVideo, setActiveVideo] = useState(0)
  const [videoOpacity, setVideoOpacity] = useState([1, 0]) // [video1, video2]
  
  const videos = [
    '/videos/BackgroundVideo1.mp4',
    '/videos/BackgroundVideo2.mp4'
  ]

  useEffect(() => {
    // Video erst nach 500ms laden für bessere Performance
    const timer = setTimeout(() => setShouldLoad(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!shouldLoad) return

    // Crossfade zwischen Videos alle 20 Sekunden
    const interval = setInterval(() => {
      setVideoOpacity(prev => {
        const newOpacity = [...prev]
        // Welches Video ist gerade aktiv?
        if (newOpacity[0] > 0) {
          // Video 1 ist aktiv -> fade zu Video 2
          newOpacity[0] = 0
          newOpacity[1] = 1
          setActiveVideo(1)
        } else {
          // Video 2 ist aktiv -> fade zu Video 1
          newOpacity[0] = 1
          newOpacity[1] = 0
          setActiveVideo(0)
        }
        return newOpacity
      })
    }, 20000) // 20 Sekunden pro Video

    return () => clearInterval(interval)
  }, [shouldLoad])

  return (
    <>
      {shouldLoad && (
        <>
          {/* Video 1 - läuft kontinuierlich */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ease-in-out"
            style={{ 
              opacity: videoOpacity[0] * 0.4, // 40% max opacity für light mode
              filter: 'blur(0.3px)',
              '--tw-transition-duration': '3000ms'
            }}
            poster="/images/landscape-poster.jpg"
            onLoadedData={() => console.log('Video 1 loaded')}
          >
            <source src={videos[0]} type="video/mp4" />
          </video>

          {/* Video 2 - läuft kontinuierlich */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ease-in-out"
            style={{ 
              opacity: videoOpacity[1] * 0.4, // 40% max opacity für light mode
              filter: 'blur(0.3px)',
              '--tw-transition-duration': '3000ms'
            }}
            onLoadedData={() => console.log('Video 2 loaded')}
          >
            <source src={videos[1]} type="video/mp4" />
          </video>

          {/* Dark Mode Anpassung über CSS-Variable */}
          <style jsx>{`
            @media (prefers-color-scheme: dark) {
              video {
                --video-opacity: 0.3;
              }
            }
          `}</style>
          
          {/* Hellerer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/40 dark:from-black/25 dark:via-black/10 dark:to-black/25"></div>
        </>
      )}
    </>
  )
}

// Hero Section mit zentriertem Content
function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-teal-50/80 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 py-24 sm:py-32">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Video Background */}
      <VideoBackground />
      
      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          {/* Enhanced Premium Badge */}
          <div className="group inline-flex items-center justify-center px-8 py-4 mb-8 backdrop-blur-xl bg-gradient-to-r from-white/90 via-white/95 to-white/90 dark:from-zinc-800/90 dark:via-zinc-800/95 dark:to-zinc-800/90 rounded-3xl shadow-2xl border border-white/30 dark:border-zinc-700/50 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            {/* Background Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            {/* Premium Indicator */}
            <div className="relative flex items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-base font-bold bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-wide">
                  Premium Wohnmobil-Vermietung seit 2018
                </span>
                <div className="ml-2 px-2 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full">
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">✓ Verifiziert</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Haupttitel */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span className="block bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
              {t('home.heroTitleLine1')}
            </span>
            <span className="block bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t('home.heroTitleLine2')}
            </span>
          </h1>
          
          {/* Beschreibung */}
          <p className="mx-auto max-w-3xl text-xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
            {t('home.heroDescription')}
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-10 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => {
                // Smooth scroll zum Suchformular
                const searchSection = document.getElementById('search-section');
                if (searchSection) {
                  searchSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start' 
                  });
                  // Fokus auf erstes Eingabefeld nach dem Scrollen
                  setTimeout(() => {
                    const firstInput = searchSection.querySelector('input, select');
                    if (firstInput) firstInput.focus();
                  }, 800);
                }
              }}
            >
              <SearchIcon className="mr-3 h-6 w-6" />
              {t('home.searchCampers')}
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-lg px-10 py-5 backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 border border-white/20 dark:border-zinc-700/50 hover:bg-white/90 dark:hover:bg-zinc-800/90 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              href="/campers"
            >
              {t('home.viewAllCampers')}
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">50+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Premium Fahrzeuge</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">1000+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Zufriedene Kunden</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">4.9★</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Bewertung</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// Suchformular Section
function SearchSection() {
  const { t } = useLanguage()
  const sectionRef = useScrollAnimation()
  const [formData, setFormData] = useState({
    location: '',
    checkin: '',
    checkout: '',
    guests: 2
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(formData).toString()
    window.location.href = `/campers?${params}`
  }

  return (
    <section 
      id="search-section"
      ref={sectionRef} 
      className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/80 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 opacity-0 translate-y-8 transition-all duration-700 overflow-hidden"
    >
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-teal-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl">
          {/* Enhanced Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-teal-500/25">
              <SearchIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-6">
              {t('home.searchSectionTitle')}
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {t('home.searchSectionSubtitle')}
            </p>
          </div>
          
          {/* Modern Glassmorphism Search Form */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-700/50 p-8 md:p-12 hover:shadow-3xl transition-all duration-500 hover:bg-white/90 dark:hover:bg-zinc-800/90">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Location Field */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                  </div>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-14 pr-4 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500 appearance-none"
                  >
                    <option value="">{t('home.anyLocation')}</option>
                    <option value="München">München</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Hamburg">Hamburg</option>
                    <option value="Köln">Köln</option>
                    <option value="Frankfurt">Frankfurt</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <label className="absolute -top-2.5 left-3 px-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-zinc-800/90 rounded-md">
                    {t('home.location')}
                  </label>
                </div>
                
                {/* Check-in Field */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                      </svg>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={formData.checkin}
                    onChange={(e) => setFormData({...formData, checkin: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-14 pr-4 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500"
                  />
                  <label className="absolute -top-2.5 left-3 px-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-zinc-800/90 rounded-md">
                    {t('home.checkin')}
                  </label>
                </div>
                
                {/* Check-out Field */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                      </svg>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={formData.checkout}
                    onChange={(e) => setFormData({...formData, checkout: e.target.value})}
                    min={formData.checkin || new Date().toISOString().split('T')[0]}
                    className="w-full pl-14 pr-4 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500"
                  />
                  <label className="absolute -top-2.5 left-3 px-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-zinc-800/90 rounded-md">
                    {t('home.checkout')}
                  </label>
                </div>
                
                {/* Guests Field */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <div className="w-5 h-5 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                  </div>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                    className="w-full pl-14 pr-4 py-4 bg-zinc-50/80 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 rounded-2xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white dark:focus:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-500 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>
                        {num} {t('home.guest')}{num !== 1 ? t('home.guestsPlural') : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <label className="absolute -top-2.5 left-3 px-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-zinc-800/90 rounded-md">
                    {t('home.guests')}
                  </label>
                </div>
              </div>
              
              {/* Enhanced Search Button */}
              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-16 py-5 text-lg font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <SearchIcon className="mr-3 h-6 w-6" />
                  {t('home.searchCampers')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}

// Personalized Content Section
function PersonalizedSection() {
  const { t } = useLanguage()
  const sectionRef = useScrollAnimation()

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-teal-50/80 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90"
    >
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1500" />
      
      <Container className="relative">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Ihre persönliche CamperShare Erfahrung"
            subtitle="Entdecken Sie Fahrzeuge und beliebte Reiseziele für Ihr nächstes Abenteuer"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Recently Viewed */}
            <div>
              <RecentlyViewedVehicles />
            </div>
            
            {/* Travel Planning Hub */}
            <div>
              <TravelPlanningHub />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// Featured Campers Section mit echten API-Daten
function FeaturedCampersSection() {
  const { t, formatPrice } = useLanguage()
  const [featuredVans, setFeaturedVans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedCampers = async () => {
      try {
        // Direkt zur Campers-API
        const response = await fetch('/api/campers')
        const result = await response.json()
        
        if (result.success && result.data && result.data.length > 0) {
          // Transformation der Daten und Auswahl von 6 beliebten Campern
          const transformedData = result.data
            .slice(0, 6) // Erste 6 Camper anzeigen
            .map(camper => ({
              id: camper.id,
              slug: camper.slug,
              name: camper.name,
              description: camper.description,
              pricePerDay: parseFloat(camper.price_per_day),
              beds: camper.beds,
              driveType: camper.drive_type,
              features: camper.features ? JSON.parse(camper.features) : [],
              badge: camper.rating > 4.5 ? 'Premium' : camper.rating > 4.0 ? 'Bestseller' : 'Top',
              rating: camper.rating
            }))
          
          setFeaturedVans(transformedData)
        } else {
          // Fallback zu Mock-Daten mit echten Slugs
          const fallbackVans = [
            {
              id: 1,
              slug: 'vw-california-ocean', // Echter Slug aus der DB
              name: 'VW California Ocean',
              description: 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen.',
              pricePerDay: 89,
              beds: 4,
              driveType: 'Diesel',
              badge: 'Premium',
              features: ['Aufstelldach', 'Miniküche', 'Kühlschrank']
            },
            {
              id: 2,
              slug: 'buerstner-lyseo-td690', // Echter Slug aus der DB
              name: 'Bürstner Lyseo TD690',
              description: 'Luxuriöses Reisemobil mit allem Komfort für die ganze Familie.',
              pricePerDay: 159,
              beds: 4,
              driveType: 'Diesel',
              badge: 'Premium',
              features: ['Küche', 'Bad', 'Klimaanlage']
            },
            {
              id: 3,
              slug: 'carado-banff-540', // Echter Slug aus der DB
              name: 'Carado Banff 540',
              description: 'Kompakter und wendiger Kastenwagen für Abenteurer.',
              pricePerDay: 79,
              beds: 2,
              driveType: 'Diesel',
              badge: 'Bestseller',
              features: ['Miniküche', 'Bett', 'Stauraum']
            },
            {
              id: 4,
              slug: 'carthago-c-tourer-i144le', // Echter Slug aus der DB
              name: 'Carthago C-Tourer I144LE',
              description: 'Premium-Wohnmobil mit luxuriöser Ausstattung.',
              pricePerDay: 189,
              beds: 4,
              driveType: 'Diesel',
              badge: 'Premium',
              features: ['Vollküche', 'Bad', 'Solaranlage']
            },
            {
              id: 5,
              slug: 'adria-twin-supreme-640slx', // Echter Slug aus der DB
              name: 'Adria Twin Supreme 640SLX',
              description: 'Modernes Design mit innovativer Raumaufteilung.',
              pricePerDay: 129,
              beds: 3,
              driveType: 'Diesel',
              badge: 'Top',
              features: ['Küche', 'Bad', 'Garage']
            },
            {
              id: 6,
              slug: 'dethleffs-globebus-t6', // Echter Slug aus der DB  
              name: 'Dethleffs Globebus T6',
              description: 'Kompakter Campervan mit cleverer Raumnutzung.',
              pricePerDay: 99,
              beds: 2,
              driveType: 'Diesel',
              badge: 'Bestseller',
              features: ['Miniküche', 'Bett', 'Stauraum']
            }
          ]
          setFeaturedVans(fallbackVans)
        }
      } catch (error) {
        console.error('Error fetching featured campers:', error)
        // Fallback zu Mock-Daten mit echten Slugs bei Fehler
        const fallbackVans = [
          {
            id: 1,
            slug: 'vw-california-ocean', // Echter Slug aus der DB
            name: 'VW California Ocean',
            description: 'Der beliebte VW California Ocean bietet kompakte Luxusausstattung für 4 Personen.',
            pricePerDay: 89,
            beds: 4,
            driveType: 'Diesel',
            badge: 'Premium',
            features: ['Aufstelldach', 'Miniküche', 'Kühlschrank']
          },
          {
            id: 2,
            slug: 'buerstner-lyseo-td690', // Echter Slug aus der DB
            name: 'Bürstner Lyseo TD690',
            description: 'Luxuriöses Reisemobil mit allem Komfort für die ganze Familie.',
            pricePerDay: 159,
            beds: 4,
            driveType: 'Diesel',
            badge: 'Premium',
            features: ['Küche', 'Bad', 'Klimaanlage']
          },
          {
            id: 3,
            slug: 'carado-banff-540', // Echter Slug aus der DB
            name: 'Carado Banff 540',
            description: 'Kompakter und wendiger Kastenwagen für Abenteurer.',
            pricePerDay: 79,
            beds: 2,
            driveType: 'Diesel',
            badge: 'Bestseller',
            features: ['Miniküche', 'Bett', 'Stauraum']
          },
          {
            id: 4,
            slug: 'carthago-c-tourer-i144le', // Echter Slug aus der DB
            name: 'Carthago C-Tourer I144LE',
            description: 'Premium-Wohnmobil mit luxuriöser Ausstattung.',
            pricePerDay: 189,
            beds: 4,
            driveType: 'Diesel',
            badge: 'Premium',
            features: ['Vollküche', 'Bad', 'Solaranlage']
          },
          {
            id: 5,
            slug: 'adria-twin-supreme-640slx', // Echter Slug aus der DB
            name: 'Adria Twin Supreme 640SLX',
            description: 'Modernes Design mit innovativer Raumaufteilung.',
            pricePerDay: 129,
            beds: 3,
            driveType: 'Diesel',
            badge: 'Top',
            features: ['Küche', 'Bad', 'Garage']
          },
          {
            id: 6,
            slug: 'dethleffs-globebus-t6', // Echter Slug aus der DB  
            name: 'Dethleffs Globebus T6',
            description: 'Kompakter Campervan mit cleverer Raumnutzung.',
            pricePerDay: 99,
            beds: 2,
            driveType: 'Diesel',
            badge: 'Bestseller',
            features: ['Miniküche', 'Bett', 'Stauraum']
          }
        ]
        setFeaturedVans(fallbackVans)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCampers()
  }, [])

  if (loading) {
    return (
      <section className="relative py-24 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-teal-50/50 dark:from-zinc-900/80 dark:via-zinc-900/90 dark:to-zinc-800/80 overflow-hidden">
        <Container className="relative z-10">
          <SectionHeader 
            title={t('home.featuredCampers')}
            subtitle="Entdecken Sie unsere beliebtesten und am besten bewerteten Wohnmobile"
          />
          <div className="flex justify-center">
            <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-2xl p-8 shadow-xl border border-white/20 dark:border-zinc-700/50">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-center">Lade Premium-Fahrzeuge...</p>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-teal-50/50 dark:from-zinc-900/80 dark:via-zinc-900/90 dark:to-zinc-800/80 overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1500" />
      
      <Container className="relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-teal-500/25">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM12 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM15.75 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM19.5 10.5h-15A1.5 1.5 0 003 9V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v3a1.5 1.5 0 01-1.5 1.5z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-6">
            {t('home.featuredCampers')}
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Entdecken Sie unsere beliebtesten und am besten bewerteten Wohnmobile
          </p>
        </div>

        {/* Enhanced Featured Vans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredVans.map((van, index) => (
            <CamperCard key={van.id} van={van} index={index} />
          ))}
        </div>

        {/* Enhanced View All Button */}
        <div className="text-center">
          <Button 
            href="/campers" 
            size="lg" 
            className="px-12 py-5 text-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all duration-300"
          >
            <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('home.viewAllCampers')}
          </Button>
        </div>
      </Container>
    </section>
  )
}

// Features Section mit symmetrischem Layout
function FeaturesSection() {
  const { t } = useLanguage()
  const sectionRef = useScrollAnimation()
  
  const features = [
    { 
      icon: '🛡️', 
      title: t('home.feature1'),
      description: t('home.feature1Desc')
    },
    { 
      icon: '🔧', 
      title: t('home.feature2'),
      description: t('home.feature2Desc')
    },
    { 
      icon: '📅', 
      title: t('home.feature3'),
      description: t('home.feature3Desc')
    },
    { 
      icon: '🏕️', 
      title: t('home.feature4'),
      description: t('home.feature4Desc')
    },
    { 
      icon: '✨', 
      title: t('home.feature5'),
      description: t('home.feature5Desc')
    },
    { 
      icon: '📍', 
      title: t('home.feature6'),
      description: t('home.feature6Desc')
    }
  ]

  return (
    <section ref={sectionRef} className="relative py-24 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 opacity-0 translate-y-8 transition-all duration-700 overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-300" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <Container className="relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-teal-500/25">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-6">
            {t('home.whyChooseUs')}
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            {t('home.whyChooseUsSubtitle')}
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const featureRef = useScrollAnimation()
            return (
              <div 
                key={index} 
                ref={featureRef}
                className="text-center group opacity-0 translate-y-8 transition-all duration-700 h-full"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-zinc-700/50 h-full flex flex-col group-hover:bg-white/90 dark:group-hover:bg-zinc-800/90 transform group-hover:-translate-y-2">
                  {/* Enhanced Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:shadow-xl group-hover:shadow-teal-500/40 transition-all duration-300">
                    <span className="text-2xl filter drop-shadow-sm">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                  
                  {/* Subtle accent line */}
                  <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto mt-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

// Stats Section
function StatsSection() {
  const { t } = useLanguage()
  const sectionRef = useScrollAnimation()
  
  const stats = [
    { number: '15,000+', label: t('home.stats.customers') },
    { number: '200+', label: t('home.stats.campers') },
    { number: '50+', label: t('home.stats.locations') },
    { number: '25', label: t('home.stats.countries') }
  ]

  return (
    <section ref={sectionRef} className="relative py-24 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white opacity-0 translate-y-8 transition-all duration-700 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/90 via-teal-500/90 to-cyan-600/90"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => {
            const statRef = useScrollAnimation()
            return (
              <div 
                key={index}
                ref={statRef}
                className="opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-lg text-teal-100 font-medium">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

// Enhanced CTA Section
function CTASection() {
  const { t } = useLanguage()
  const sectionRef = useScrollAnimation()
  
  return (
    <section ref={sectionRef} className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50/60 to-teal-50/80 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 opacity-0 translate-y-8 transition-all duration-700 overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-teal-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <Container className="relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center justify-center px-6 py-3 mb-8 backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-2xl shadow-lg border border-white/20 dark:border-zinc-700/50">
            <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Bereit für Ihr nächstes Abenteuer?
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-6 leading-tight">
            {t('home.ctaTitle')}
          </h2>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('home.ctaSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              href="/campers" 
              size="lg" 
              className="px-12 py-5 text-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all duration-300"
            >
              <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('home.ctaButton1')}
            </Button>
            <Button 
              href="/contact" 
              size="lg" 
              className="px-12 py-5 text-lg backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 border border-white/20 dark:border-zinc-700/50 hover:bg-white/90 dark:hover:bg-zinc-800/90 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {t('home.ctaButton2')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function Home() {
  const { t } = useLanguage()
  const { trackButtonClick } = useAnalytics()
  
  // Auto-track page view, scroll depth und time on page
  usePageViewTracking('homepage')
  useScrollTracking()
  useTimeTracking()

  // Handler für Button Clicks
  const handleCTAClick = (buttonType, href) => {
    trackButtonClick(`homepage_cta_${buttonType}`, { destination: href })
  }

  return (
    <>
      <Head>
        <title>{t('home.seoTitle')}</title>
        <meta name="description" content={t('home.seoDescription')} />
      </Head>
      
      <div className="overflow-hidden">
        <HeroSection onCTAClick={handleCTAClick} />
        <SearchSection />
        <PersonalizedSection />
        <FeaturedCampersSection />
        <StatsSection />
        <FeaturesSection />
        <CTASection onCTAClick={handleCTAClick} />
      </div>
    </>
  )
}
