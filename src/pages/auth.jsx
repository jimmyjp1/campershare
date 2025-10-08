import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Container } from '@/components/Container'
import { LoginForm, RegisterForm } from '@/components/AuthForms'
import { useLanguage } from '@/services/multilanguageService'
import { authService } from '@/services/userAuthenticationService'
import { CamperShareIcon } from '@/components/CamperShareIcon'

export default function Auth() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        // Redirect to dashboard or home
        router.push('/')
        return
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleAuthSuccess = (user) => {
    // Redirect based on user role or to intended destination
    const returnUrl = router.query.returnUrl || '/'
    router.push(returnUrl)
  }

  const switchToRegister = () => setIsLogin(false)
  const switchToLogin = () => setIsLogin(true)

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>CamperShare</title>
        <meta
          name="description"
          content={isLogin 
            ? t('auth.loginSubtitle') 
            : t('auth.registerSubtitle')
          }
        />
      </Head>

      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Container>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Auth Forms */}
            <div className="bg-white dark:bg-zinc-800 py-8 px-4 shadow-xl rounded-lg sm:px-10">
              {isLogin ? (
                <LoginForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToRegister={switchToRegister}
                />
              ) : (
                <RegisterForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToLogin={switchToLogin}
                />
              )}
            </div>

            {/* Demo Credentials (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                  Demo-Zugangsdaten (Entwicklung):
                </h3>
                <div className="space-y-2 text-xs text-yellow-700 dark:text-yellow-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Kunde:</strong><br />
                      max@example.com<br />
                      password123
                    </div>
                    <div>
                      <strong>Anbieter:</strong><br />
                      anna@provider.com<br />
                      provider123
                    </div>
                  </div>
                  <div className="pt-2 border-t border-yellow-200 dark:border-yellow-700">
                    <strong>Admin:</strong> admin@campervan.com / admin123
                  </div>
                </div>
              </div>
            )}

            {/* Additional Links */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-6 text-sm">
                <a
                  href="/terms"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t('auth.termsOfService')}
                </a>
                <a
                  href="/privacy"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t('auth.privacyPolicy')}
                </a>
                <a
                  href="/help"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Hilfe
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
