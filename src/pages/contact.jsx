import Head from 'next/head'
import { useState } from 'react'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useLanguage } from '@/services/multilanguageService'

function MapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
      <polyline
        points="22,6 12,13 2,6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
      <polyline
        points="12,6 12,12 16,14"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ContactCard({ icon: Icon, title, content, action }) {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center">
          <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="ml-4 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          {title}
        </h3>
      </div>
      <div className="text-zinc-600 dark:text-zinc-400 mb-4">
        {content}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

function ContactForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          {t('contact.form.success')}
        </h3>
        <p className="text-green-600 dark:text-green-300">
          {t('contact.form.successMessage')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="inquiryType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('contact.form.inquiryType')}
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleChange}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="general">{t('contact.form.inquiryTypes.general')}</option>
          <option value="booking">{t('contact.form.inquiryTypes.booking')}</option>
          <option value="support">{t('contact.form.inquiryTypes.support')}</option>
          <option value="feedback">{t('contact.form.inquiryTypes.feedback')}</option>
          <option value="complaint">{t('contact.form.inquiryTypes.complaint')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('contact.form.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder={t('contact.form.placeholders.name')}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('contact.form.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder={t('contact.form.placeholders.email')}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('contact.form.phone')}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder={t('contact.form.placeholders.phone')}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('contact.form.subject')}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder={t('contact.form.placeholders.subject')}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('contact.form.message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder={t('contact.form.placeholders.message')}
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
      </Button>
    </form>
  )
}

export default function Contact() {
  const { t } = useLanguage()
  
  return (
    <>
      <Head>
        <title>CamperShare</title>
        <meta
          name="description"
          content={t('contact.subtitle')}
        />
      </Head>
      <Container className="mt-16 sm:mt-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              {t('contact.title')}
            </h1>
            <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                {t('contact.contactInfo')}
              </h2>
              
              <div className="space-y-6">
                <ContactCard
                  icon={PhoneIcon}
                  title={t('contact.phone')}
                  content={
                    <div>
                      <p>Hauptnummer: +49 89 12345678</p>
                      <p>Notfall: +49 89 12345679</p>
                      <p className="text-sm mt-1">{t('contact.emergencyNote')}</p>
                    </div>
                  }
                />
                
                <ContactCard
                  icon={MailIcon}
                  title={t('contact.email')}
                  content={
                    <div>
                      <p>Allgemein: info@campershare.de</p>
                      <p>Buchungen: buchungen@campershare.de</p>
                      <p>Support: support@campershare.de</p>
                    </div>
                  }
                />
                
                <ContactCard
                  icon={ClockIcon}
                  title={t('contact.businessHours')}
                  content={
                    <div>
                      <p>{t('contact.monday')} - {t('contact.friday')}: 8:00 - 20:00</p>
                      <p>{t('contact.saturday')}: 9:00 - 18:00</p>
                      <p>{t('contact.sunday')}: 10:00 - 16:00</p>
                      <p className="text-sm mt-1">Erweiterte Öffnungszeiten in der Hochsaison</p>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-8">
                {t('contact.form.title')}
              </h2>
              <div className="rounded-2xl border border-zinc-100 p-8 dark:border-zinc-700/40">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-8 text-center">
              {t('contact.locations')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ContactCard
                icon={MapIcon}
                title="München"
                content={
                  <div>
                    <p>Wohnmobil-Straße 123</p>
                    <p>80331 München</p>
                    <p className="text-sm mt-1">+49 89 12345680</p>
                  </div>
                }
              />
              
              <ContactCard
                icon={MapIcon}
                title="Berlin"
                content={
                  <div>
                    <p>Abenteuer-Allee 456</p>
                    <p>10115 Berlin</p>
                    <p className="text-sm mt-1">+49 30 12345681</p>
                  </div>
                }
              />
              
              <ContactCard
                icon={MapIcon}
                title="Hamburg"
                content={
                  <div>
                    <p>Entdecker-Weg 789</p>
                    <p>20095 Hamburg</p>
                    <p className="text-sm mt-1">+49 40 12345682</p>
                  </div>
                }
              />
              
              <ContactCard
                icon={MapIcon}
                title="Köln"
                content={
                  <div>
                    <p>Reise-Ring 321</p>
                    <p>50667 Köln</p>
                    <p className="text-sm mt-1">+49 221 12345683</p>
                  </div>
                }
              />
            </div>
          </div>

          {/* FAQ Link */}
          <div className="mt-16 text-center">
            <div className="rounded-2xl bg-teal-50 dark:bg-teal-900/10 p-8">
              <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
                Häufig gestellte Fragen
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Suchen Sie schnelle Antworten? Schauen Sie in unseren FAQ-Bereich für häufige Fragen zu 
                Vermietungen, Preisen, Richtlinien und mehr.
              </p>
              <Button href="/faq" variant="secondary">
                FAQ ansehen
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
