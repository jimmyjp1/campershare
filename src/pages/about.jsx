/**
 * CamperShare - Über Uns Seite (about.jsx)
 * 
 * Umfassende Unternehmensdarstellung mit moderner, interaktiver Gestaltung.
 * Erzählt die Geschichte von CamperShare und stellt das Team vor.
 * 
 * Hauptsektionen:
 * - Hero Section: Video-Hintergrund mit Unternehmens-Vision
 * - Story Section: Unternehmensgeschichte mit Timeline
 * - Values Section: Kernwerte mit interaktiven Karten
 * - Team Section: Mitarbeiter-Profile mit Fotos
 * - Stats Section: Vertrauen durch Zahlen
 * - CTA Section: Kontakt-Aufforderung
 * 
 * Design-Features:
 * - Video-Hintergrund (Über_Uns_Video.mp4)
 * - Glassmorphism-Effekte
 * - Scroll-gesteuerte Animationen
 * - Interaktive Value-Cards mit Hover-Effekten
 * - Responsive Team-Grid
 * - Dark Mode Support
 * - Mehrsprachige Inhalte
 * 
 * Technische Highlights:
 * - CSS-in-JS Animationen
 * - Intersection Observer für Performance
 * - Next.js Image-Optimierung
 * - SEO-optimierte Meta-Tags
 */

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useLanguage } from '@/services/multilanguageService'
import { CamperShareIcon, CamperShareBrandIcon } from '@/components/CamperShareIcon'

/**
 * CSS Keyframes für komplexe Animationen
 * Definiert verschiedene Einfade- und Bewegungseffekte
 */
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`

// Simplified hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

function CarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 12h2l3-9h8l3 9h2c1.1 0 2 .9 2 2v3c0 .55-.45 1-1 1h-1c0 1.1-.9 2-2 2s-2-.9-2-2H9c0 1.1-.9 2-2 2s-2-.9-2-2H4c-.55 0-1-.45-1-1v-3c0-1.1.9-2 2-2z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 1l3 3h6v6l-3 3v6l-6 3-6-3v-6l-3-3V4h6l3-3z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function TeamMember({ name, role, description, contact, image }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <div 
      ref={ref}
      className={`group text-center transform transition-all duration-700 h-full ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-zinc-700/50 hover:bg-white/90 dark:hover:bg-zinc-800/90 transform hover:-translate-y-3 h-full flex flex-col">
        {/* Enhanced Profile Image - Einheitliche Größe und ansprechende Gestaltung */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/25 group-hover:shadow-xl group-hover:shadow-teal-500/40 transition-all duration-300 flex items-center justify-center p-1">
            {image ? (
              <img 
                src={`/images/team/${image}`} 
                alt={name}
                className="w-full h-full rounded-2xl object-cover object-center"
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            )}
          </div>
          {/* Decorative Ring */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-200 to-cyan-200 dark:from-teal-800 dark:to-cyan-800 opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
        </div>
        
        {/* Enhanced Content - mit Flex-Grow für einheitliche Höhen */}
        <div className="flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {name}
          </h3>
          <div className="inline-flex items-center justify-center px-3 py-1 mb-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 text-teal-700 dark:text-teal-300 text-sm font-medium rounded-full border border-teal-200/50 dark:border-teal-800/50">
            {role}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed flex-grow">
            {description}
          </p>
          
          {/* Contact und Accent Line am Ende */}
          <div className="mt-auto">
            {contact && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium bg-zinc-50 dark:bg-zinc-700/50 px-3 py-2 rounded-lg mb-6">
                {contact}
              </p>
            )}
            
            {/* Subtle accent line */}
            <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ValueCard({ icon: Icon, title, description }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <div 
      ref={ref}
      className={`backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 border border-white/20 dark:border-zinc-700/50 transform hover:-translate-y-3 hover:bg-white/90 dark:hover:bg-zinc-800/90 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-10 opacity-0'
      }`}
    >
      <dt>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 mb-6 shadow-lg shadow-teal-500/25 group-hover:shadow-xl group-hover:shadow-teal-500/40 transition-all duration-300">
          <Icon className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {title}
        </p>
      </dt>
      <dd className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        {description}
      </dd>
      {/* Subtle accent line */}
      <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

// Revolutionary Interactive Value Card
function InteractiveValueCard({ icon, title, description, gradient, delay }) {
  const [ref, isVisible] = useScrollAnimation()
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      ref={ref}
      className={`group relative transform transition-all duration-700 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 h-full overflow-hidden hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/20">
        {/* Background Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl blur-sm`}></div>
          <div className="absolute inset-[1px] bg-slate-900/80 rounded-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon with Floating Animation */}
          <div className="relative mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 text-4xl transform transition-all duration-500 ${
              isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
            }`}>
              {icon}
            </div>
            
            {/* Floating Particles around Icon */}
            {isHovered && (
              <>
                <div className="absolute top-0 right-0 w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 left-0 w-1 h-1 bg-teal-400/60 rounded-full animate-ping delay-300"></div>
                <div className="absolute top-1/2 right-0 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping delay-500"></div>
              </>
            )}
          </div>
          
          {/* Title */}
          <h3 className={`text-2xl font-bold mb-4 transition-all duration-300 ${
            isHovered 
              ? `bg-gradient-to-r ${gradient} bg-clip-text text-transparent` 
              : 'text-white'
          }`}>
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-blue-100/80 leading-relaxed text-lg group-hover:text-white transition-colors duration-300">
            {description}
          </p>
          
          {/* Interactive Elements */}
          <div className="mt-6 flex items-center space-x-3">
            <div className={`w-8 h-1 bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ${
              isHovered ? 'w-16' : 'w-8'
            }`}></div>
            <div className={`w-2 h-2 bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ${
              isHovered ? 'scale-150 animate-pulse' : 'scale-100'
            }`}></div>
          </div>
        </div>
        
        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-3xl`}></div>
      </div>
    </div>
  )
}

// Story Content mit Animationen
function StoryContent() {
  const { t } = useLanguage()
  const [textRef, textVisible] = useScrollAnimation()
  const [imageRef, imageVisible] = useScrollAnimation()
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div 
        ref={textRef}
        className={`space-y-6 text-zinc-600 dark:text-zinc-400 transform transition-all duration-700 ${
          textVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}
        style={{ transitionDelay: textVisible ? '0.3s' : '0' }}
      >
        <p className="text-lg leading-relaxed">
          {t('about.story.content')}
        </p>
      </div>
      <div 
        ref={imageRef}
        className={`relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 ${
          imageVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
        style={{ transitionDelay: imageVisible ? '0.5s' : '0' }}
      >
        {/* Video Container */}
        <div className="relative aspect-video bg-gradient-to-br from-teal-900/20 via-blue-900/20 to-indigo-900/20 rounded-2xl overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/Über_Uns_Video.mp4" type="video/mp4" />
            {/* Fallback für Browser ohne Video-Support */}
            <div className="w-full h-full bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
              <div className="text-center text-zinc-600 dark:text-zinc-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <p>Video wird geladen...</p>
              </div>
            </div>
          </video>
          
          {/* Video Overlay für bessere Text-Lesbarkeit */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {/* Optional: Play-Button Overlay für bessere UX */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Hero Section für About-Seite
function AboutHeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative overflow-hidden py-32 sm:py-40 bg-gradient-to-br from-slate-50 via-blue-50/60 to-teal-50/80 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Video Background - now as overlay */}
      <div className="absolute inset-0 opacity-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/BackgroundVideo3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-blue-900/20 to-cyan-900/20"></div>
      </div>
      
      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          {/* Enhanced Premium Badge - Exakt wie Homepage */}
          <div className="group inline-flex items-center justify-center px-8 py-4 mb-8 backdrop-blur-xl bg-gradient-to-r from-white/90 via-white/95 to-white/90 dark:from-zinc-800/90 dark:via-zinc-800/95 dark:to-zinc-800/90 rounded-3xl shadow-2xl border border-white/30 dark:border-zinc-700/50 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            {/* Background Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            {/* Trust Indicator */}
            <div className="relative flex items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-base font-bold bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-wide">
                  Ihre vertrauensvolle Wohnmobil-Vermietung
                </span>
                <div className="ml-2 px-2 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full">
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">✓ Seit 2018</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Haupttitel */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            <span className="block bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
              {t('about.title')}
            </span>
          </h1>
          
          {/* Enhanced Beschreibung */}
          <p className="mx-auto max-w-3xl text-xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
            {t('about.subtitle')}
          </p>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">6+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Jahre Erfahrung</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">200+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Premium Fahrzeuge</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">15K+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Zufriedene Kunden</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function About() {
  const { t } = useLanguage()
  
  return (
    <>
      <Head>
        <title>CamperShare</title>
        <meta
          name="description"
          content={t('about.subtitle')}
        />
        <style jsx>{animationStyles}</style>
      </Head>
      
      <div className="overflow-hidden">
        <AboutHeroSection />

        {/* Enhanced Our Story Section */}
        <section className="relative py-24 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 overflow-hidden">
          {/* Floating Orbs */}
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-300" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <Container className="relative z-10">
            <div className="mx-auto max-w-6xl">
              {/* Enhanced Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-teal-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-6">
                  {t('about.story.title')}
                </h2>
              </div>
              <StoryContent />
            </div>
          </Container>
        </section>

        {/* Revolutionary Interactive Values Section */}
        <section className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 overflow-hidden">
          {/* Dynamic Background Elements */}
          <div className="absolute inset-0">
            {/* Floating Particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400/60 rounded-full animate-ping delay-1000" />
            <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-400/60 rounded-full animate-ping delay-2000" />
            <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-cyan-400/60 rounded-full animate-ping delay-3000" />
            
            {/* Large Moving Orbs */}
            <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          {/* Video Background Overlay */}
          <div className="absolute inset-0 opacity-20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/BackgroundVideo1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/50 to-teal-900/50"></div>
          </div>
          
          <Container className="relative z-10">
            <div className="mx-auto max-w-7xl">
              {/* Spectacular Section Header */}
              <div className="text-center mb-20">
                <div className="group relative inline-flex items-center justify-center w-20 h-20 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-teal-400 to-cyan-400 rounded-3xl p-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-200 bg-clip-text text-transparent mb-6 leading-tight">
                  {t('about.values.title')}
                </h2>
                <p className="text-2xl text-blue-100/90 max-w-4xl mx-auto leading-relaxed">
                  Diese Werte sind das Herzstück unserer Mission - sie leiten jeden Schritt unserer Reise
                </p>
              </div>
              
              {/* Interactive Values Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <InteractiveValueCard
                  icon="🛡️"
                  title={t('about.values.quality.title')}
                  description={t('about.values.quality.description')}
                  gradient="from-emerald-500 to-teal-500"
                  delay="0"
                />
                <InteractiveValueCard
                  icon="❤️"
                  title={t('about.values.service.title')}
                  description={t('about.values.service.description')}
                  gradient="from-rose-500 to-pink-500"
                  delay="200"
                />
                <InteractiveValueCard
                  icon="🌱"
                  title={t('about.values.sustainability.title')}
                  description={t('about.values.sustainability.description')}
                  gradient="from-green-500 to-emerald-500"
                  delay="400"
                />
                <InteractiveValueCard
                  icon="⚡"
                  title={t('about.values.adventure.title')}
                  description={t('about.values.adventure.description')}
                  gradient="from-yellow-500 to-orange-500"
                  delay="600"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Enhanced Meet Our Team Section */}
        <section className="relative py-24 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 overflow-hidden">
          {/* Floating Orbs */}
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-300" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <Container className="relative z-10">
            <div className="mx-auto max-w-6xl">
              {/* Enhanced Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-teal-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-6">
                  {t('about.team.title')}
                </h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                  {t('about.team.subtitle')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                <TeamMember
                  name={t('about.team.ceo2.name')}
                  role={t('about.team.ceo2.role')}
                  description={t('about.team.ceo2.description')}
                  contact="philipp@campershare.de"
                  image="Philipp Weissgerber.jpeg"
                />
                <TeamMember
                  name={t('about.team.ceo3.name')}
                  role={t('about.team.ceo3.role')}
                  description={t('about.team.ceo3.description')}
                  contact="zxhim@campershare.de"
                  image="Zxhim Pollomi.jpeg"
                />
                <TeamMember
                  name={t('about.team.sales.name')}
                  role={t('about.team.sales.role')}
                  description={t('about.team.sales.description')}
                  contact="oskar@campershare.de"
                  image="Oskar Prophet.jpeg"
                />
                <TeamMember
                  name={t('about.team.operations.name')}
                  role={t('about.team.operations.role')}
                  description={t('about.team.operations.description')}
                  contact="damian@campershare.de"
                  image="Damian.jpeg"
                />
                <TeamMember
                  name={t('about.team.tech.name')}
                  role={t('about.team.tech.role')}
                  description={t('about.team.tech.description')}
                  contact="hai@campershare.de"
                  image="Hai Viet Vu.jpeg"
                />
                <TeamMember
                  name={t('about.team.service.name')}
                  role={t('about.team.service.role')}
                  description={t('about.team.service.description')}
                  contact="bennie@campershare.de"
                  image="Bennie Rettling.jpeg"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Enhanced Company Stats */}
        <section className="relative py-24 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/90 via-teal-500/90 to-cyan-600/90"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <Container className="relative z-10">
            <div className="mx-auto max-w-6xl">
              {/* Enhanced Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 shadow-lg backdrop-blur-xl border border-white/20">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  {t('about.stats.title')}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">200+</div>
                  <div className="text-lg text-teal-100 font-medium">{t('about.stats.vehicles')}</div>
                </div>
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">15,000+</div>
                  <div className="text-lg text-teal-100 font-medium">{t('about.stats.customers')}</div>
                </div>
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">25</div>
                  <div className="text-lg text-teal-100 font-medium">{t('about.stats.countries')}</div>
                </div>
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">6</div>
                  <div className="text-lg text-teal-100 font-medium">{t('about.stats.experience')}</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Enhanced Call to Action */}
        <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50/60 to-teal-50/80 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 overflow-hidden">
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-teal-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <Container className="relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Enhanced Premium Badge - Exakt wie Homepage */}
              <div className="group inline-flex items-center justify-center px-8 py-4 mb-8 backdrop-blur-xl bg-gradient-to-r from-white/90 via-white/95 to-white/90 dark:from-zinc-800/90 dark:via-zinc-800/95 dark:to-zinc-800/90 rounded-3xl shadow-2xl border border-white/30 dark:border-zinc-700/50 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                {/* Background Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                {/* Adventure Indicator */}
                <div className="relative flex items-center">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-bold bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-wide">
                      Bereit für Ihr nächstes Abenteuer?
                    </span>
                    <div className="ml-2 px-2 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full">
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">🚐 Los geht's</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent mb-6 leading-tight">
                {t('about.cta.title')}
              </h2>
              
              <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t('about.cta.subtitle')}
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
                  {t('about.cta.button1')}
                </Button>
                <Button 
                  href="/contact" 
                  size="lg" 
                  className="px-12 py-5 text-lg backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 border border-white/20 dark:border-zinc-700/50 hover:bg-white/90 dark:hover:bg-zinc-800/90 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  {t('about.cta.button2')}
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}
