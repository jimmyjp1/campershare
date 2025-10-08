import { useState } from 'react'
import { useLanguage } from '@/services/multilanguageService'
import { Button } from '@/components/Button'
import { authService } from '@/services/userAuthenticationService'

function EyeIcon({ open = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      {open ? (
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
      {open && <circle cx="12" cy="12" r="3" />}
    </svg>
  )
}

export function LoginForm({ onSuccess, onSwitchToRegister }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const user = await authService.login(formData.email, formData.password)
      if (user) {
        onSuccess?.(user)
      }
    } catch (err) {
      setError(err.message || t('auth.loginError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      const data = await response.json()

      if (data.success) {
        setForgotPasswordSent(true)
      } else {
        setError(data.error || 'Fehler beim Senden der E-Mail')
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show forgot password success
  if (forgotPasswordSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📧 E-Mail versendet
            </h2>
            
            <p className="text-gray-600 mb-6">
              Falls ein Konto mit <strong>{forgotPasswordEmail}</strong> existiert, haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Nächste Schritte:</strong><br/>
                1. Prüfen Sie Ihr E-Mail-Postfach<br/>
                2. Klicken Sie auf den Reset-Link<br/>
                3. Erstellen Sie ein neues Passwort<br/>
                <em>Der Link ist 1 Stunde gültig.</em>
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowForgotPassword(false)
                setForgotPasswordSent(false)
                setForgotPasswordEmail('')
              }}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              ← Zurück zur Anmeldung
            </button>
            
            <p className="text-gray-500 text-sm mt-4">
              E-Mail nicht erhalten? Prüfen Sie auch Ihren Spam-Ordner.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show forgot password form
  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            🔐 Passwort vergessen
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Link zu erhalten
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="forgotEmail" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              E-Mail-Adresse
            </label>
            <input
              id="forgotEmail"
              type="email"
              required
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="ihre-email@example.com"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sende E-Mail...' : '📧 Reset-Link senden'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium"
            >
              ← Zurück zur Anmeldung
            </button>
          </div>
        </form>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError('')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {t('auth.welcomeBack')}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('auth.email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder={t('auth.emailPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('auth.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-10 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder={t('auth.passwordPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <EyeIcon open={showPassword} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
              {t('auth.rememberMe')}
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200"
          >
            {t('auth.forgotPassword')}
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? t('auth.loggingIn') : t('auth.login')}
        </Button>

        <div className="text-center">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {t('auth.noAccount')}{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium"
          >
            {t('auth.signUp')}
          </button>
        </div>
      </form>
    </div>
  )
}

export function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      setIsLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError(t('auth.acceptTermsError'))
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          agreeToTerms: formData.acceptTerms
        }),
      })

      const data = await response.json()

      if (data.success) {
        setRegistrationComplete(true)
        setUserEmail(formData.email)
        // Don't call onSuccess immediately - wait for email verification
      } else {
        setError(data.error || 'Registrierung fehlgeschlagen')
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      })

      const data = await response.json()
      if (data.success) {
        setError('')
        alert('Eine neue Bestätigungs-E-Mail wurde versendet!')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Fehler beim Versenden der E-Mail')
    }
  }

  // Show success message if registration is complete
  if (registrationComplete) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📧 E-Mail bestätigen
            </h2>
            
            <p className="text-gray-600 mb-6">
              Wir haben eine Bestätigungs-E-Mail an <strong>{userEmail}</strong> gesendet.
            </p>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <p className="text-emerald-800 text-sm">
                <strong>Nächste Schritte:</strong><br/>
                1. Öffnen Sie Ihr E-Mail-Postfach<br/>
                2. Klicken Sie auf den Bestätigungslink<br/>
                3. Ihr Konto wird automatisch aktiviert
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={resendVerification}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                📨 E-Mail erneut senden
              </button>
              
              <button
                onClick={onSwitchToLogin}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                ← Zurück zur Anmeldung
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-4">
              E-Mail nicht erhalten? Prüfen Sie auch Ihren Spam-Ordner.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {t('auth.createAccount')}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              {t('auth.firstName')}
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder={t('auth.firstNamePlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              {t('auth.lastName')}
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder={t('auth.lastNamePlaceholder')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('auth.email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder={t('auth.emailPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('auth.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-10 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder={t('auth.passwordPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <EyeIcon open={showPassword} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('auth.confirmPassword')}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-10 bg-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder={t('auth.confirmPasswordPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <EyeIcon open={showConfirmPassword} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            required
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-1 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
          />
          <label htmlFor="acceptTerms" className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">
            {t('auth.acceptTerms')}{' '}
            <a href="/terms" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200">
              {t('auth.termsOfService')}
            </a>{' '}
            {t('auth.and')}{' '}
            <a href="/privacy" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200">
              {t('auth.privacyPolicy')}
            </a>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
        </Button>

        <div className="text-center">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {t('auth.alreadyHaveAccount')}{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium"
          >
            {t('auth.login')}
          </button>
        </div>
      </form>
    </div>
  )
}
