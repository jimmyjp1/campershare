import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { BookingsTab } from '@/components/BookingsTab'
import { useLanguage } from '@/services/multilanguageService'
import { authService } from '@/services/userAuthenticationService'

function ProfileTab({ user, onUpdate }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: user?.first_name || user?.firstName || '',
    lastName: user?.last_name || user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : (user?.dateOfBirth || '')
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const updatedUser = await authService.updateProfile(formData)
      onUpdate(updatedUser)
      setMessage('Profil erfolgreich aktualisiert!')
    } catch (error) {
      setMessage(error.message || 'Fehler beim Aktualisieren des Profils')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Persönliche Informationen
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Aktualisieren Sie Ihre Kontoinformationen
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('erfolgreich') 
            ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400'
            : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Vorname
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Nachname
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            E-Mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Geburtsdatum
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Speichern...' : 'Änderungen speichern'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function SecurityTab({ user }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Neue Passwörter stimmen nicht überein')
      setIsLoading(false)
      return
    }

    try {
      await authService.changePassword(formData.currentPassword, formData.newPassword)
      setMessage('Passwort erfolgreich geändert!')
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage(error.message || 'Fehler beim Ändern des Passworts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Passwort ändern
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Aktualisieren Sie Ihr Passwort für mehr Sicherheit
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('erfolgreich') 
            ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400'
            : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Aktuelles Passwort
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Neues Passwort
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Neues Passwort bestätigen
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Ändern...' : 'Passwort ändern'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function Profile() {
  const { t } = useLanguage()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Demo-Lösung: Verwende echten Benutzer Jimmi Pollomi
      const mockUser = {
        id: '427c4a4b-b5a2-4cd7-838d-197dbb512982',
        firstName: 'Jimmi',
        lastName: 'Pollomi',
        email: 'jimmi.pollomi@hotmail.de',
        phone: ''
      }
      
      setUser(mockUser)
      setIsLoading(false)
      
      // In Produktion würde hier die echte Authentifizierung verwendet:
      // const currentUser = authService.getCurrentUser()
      // if (!currentUser) {
      //   router.push('/auth?returnUrl=/profile')
      //   return
      // }
      // setUser(currentUser)
      // setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'profile', name: 'Profil' },
    { id: 'security', name: 'Sicherheit' },
    { id: 'bookings', name: 'Buchungen' },
    { id: 'preferences', name: 'Einstellungen' }
  ]

  return (
    <>
            <Head>
        <title>CamperShare</title>
        <meta name="description" content="Verwalten Sie Ihr CamperShare Profil" />
      </Head>

      <Container className="mt-16 sm:mt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="pb-8 border-b border-zinc-200 dark:border-zinc-700">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Mein Profil
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Verwalten Sie Ihre Kontoinformationen und Einstellungen
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="border-b border-zinc-200 dark:border-zinc-700">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === 'profile' && (
                <ProfileTab user={user} onUpdate={handleUserUpdate} />
              )}
              {activeTab === 'security' && (
                <SecurityTab user={user} />
              )}
              {activeTab === 'bookings' && (
                <BookingsTab />
              )}
              {activeTab === 'preferences' && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                    Einstellungen
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Benutzereinstellungen werden hier angezeigt (in Entwicklung)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
