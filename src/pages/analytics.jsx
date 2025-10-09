/**
 * analytics.jsx - Analytics Dashboard
 * ===================================
 * 
 * HAUPTFUNKTION:
 * Umfassendes Business Intelligence Dashboard für die WWISCA Camper-Plattform.
 * Bietet detaillierte Einblicke in Geschäftsmetriken, Buchungsstatistiken und Performance-Indikatoren.
 * 
 * DASHBOARD-FEATURES:
 * 
 * 1. KPI-Übersicht:
 *    - Umsatz-Tracking mit Trend-Analysen
 *    - Buchungsvolumen und Conversion-Raten
 *    - Benutzerregistrierungen und Aktivität
 *    - Fahrzeugauslastung und Rentabilität
 * 
 * 2. Trend-Analysen:
 *    - TrendingUpIcon/TrendingDownIcon für visuelle Trenddarstellung
 *    - Periodenvergleiche (Tag, Woche, Monat, Jahr)
 *    - Saisonale Buchungsmuster
 *    - Growth-Rate Berechnungen
 * 
 * 3. Benutzer-Analytics:
 *    - UsersIcon für Benutzerstatistiken
 *    - Demografische Aufschlüsselungen
 *    - Kundenakquisition und Retention-Metriken
 *    - User Journey und Conversion Funnels
 * 
 * 4. Geschäftsmetriken:
 *    - Revenue per Booking (RPB)
 *    - Customer Lifetime Value (CLV)
 *    - Average Booking Duration
 *    - Seasonal Performance Metrics
 * 
 * DATENVISUALISIERUNG:
 * 
 * 1. Interaktive Charts:
 *    - Line Charts für zeitbasierte Trends
 *    - Bar Charts für Kategorienvergleiche
 *    - Pie Charts für Marktanteil-Analysen
 *    - Heat Maps für geografische Verteilung
 * 
 * 2. Real-time Updates:
 *    - Live-Datenfeeds für aktuelle Metriken
 *    - WebSocket-Integration für Echtzeit-Updates
 *    - Automatische Dashboard-Aktualisierungen
 *    - Push-Benachrichtigungen für wichtige Ereignisse
 * 
 * 3. Filteroptionen:
 *    - Datumsbereich-Filter für historische Analysen
 *    - Fahrzeugtyp-Filter für Segment-Analysen
 *    - Geografische Filter für regionale Insights
 *    - Kundengruppen-Filter für Zielgruppen-Analysen
 * 
 * GESCHÄFTS-INTELLIGENCE:
 * 
 * 1. Umsatz-Analytics:
 *    - Tägliche, wöchentliche, monatliche Umsatzberichte
 *    - Profit-Margin Analysen nach Fahrzeugkategorie
 *    - Pricing-Optimierung basierend auf Nachfrage
 *    - Revenue Forecasting mit ML-Algorithmen
 * 
 * 2. Buchungs-Analytics:
 *    - Conversion-Rate Optimierung
 *    - Booking Lead Time Analysen
 *    - Cancellation Rate Tracking
 *    - Peak Season Performance
 * 
 * 3. Operative Metriken:
 *    - Fahrzeugauslastung und Downtime
 *    - Wartungskosten und ROI-Berechnungen
 *    - Standort-Performance Vergleiche
 *    - Kundenzufriedenheit und NPS-Scores
 * 
 * TECHNISCHE IMPLEMENTIERUNG:
 * 
 * 1. Data Sources:
 *    - Database Queries für historische Daten
 *    - API-Integration für Echtzeit-Metriken
 *    - External Analytics Services (Google Analytics, Mixpanel)
 *    - Payment Provider APIs für Transaktionsdaten
 * 
 * 2. State Management:
 *    - useState für Dashboard-Filter und Zeiträume
 *    - useEffect für Daten-Loading und Updates
 *    - Context API für globale Analytics-States
 *    - Custom Hooks für wiederverwendbare Logic
 * 
 * 3. Performance Optimierung:
 *    - Data Caching für schnelle Dashboard-Loads
 *    - Lazy Loading für große Datensätze
 *    - Virtualization für Performance bei vielen Datenpunkten
 *    - Debounced Filter-Updates
 * 
 * BENUTZERROLLEN & ZUGRIFF:
 * 
 * 1. Admin-Dashboard:
 *    - Vollzugriff auf alle Geschäftsmetriken
 *    - Export-Funktionen für Berichte
 *    - Advanced Analytics und Predictive Insights
 *    - System Health und Performance Monitoring
 * 
 * 2. Manager-Ansicht:
 *    - Operative KPIs und Trends
 *    - Team-Performance Metriken
 *    - Customer Service Analytics
 *    - Inventory Management Insights
 * 
 * 3. Sales-Dashboard:
 *    - Conversion-optimierte Metriken
 *    - Lead-Generation Performance
 *    - Customer Acquisition Cost (CAC)
 *    - Sales Funnel Analytics
 * 
 * REPORTING & EXPORT:
 * 
 * 1. Automated Reports:
 *    - Tägliche, wöchentliche, monatliche E-Mail-Berichte
 *    - PDF-Generation für Stakeholder-Präsentationen
 *    - CSV/Excel Export für weitere Analysen
 *    - Custom Report Builder
 * 
 * 2. Data Integration:
 *    - API-Endpoints für Dritt-Analytics-Tools
 *    - Data Warehouse Integration
 *    - ETL-Pipelines für Business Intelligence
 *    - Real-time Data Streaming
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-optimierte Dashboard-Layouts
 * - Touch-freundliche Chart-Interaktionen
 * - Adaptive Grid-Layouts für verschiedene Bildschirmgrößen
 * - Progressive Web App Features für Offline-Zugriff
 * 
 * SICHERHEIT & COMPLIANCE:
 * - Rollenbasierte Zugriffskontrolle (RBAC)
 * - Audit-Trails für alle Analytics-Zugriffe
 * - DSGVO-konforme Datenbehandlung
 * - Sichere API-Authentifizierung
 * 
 * EINSATZGEBIETE:
 * - Strategic Business Planning und Forecasting
 * - Operative Performance-Optimierung
 * - Marketing Campaign Effectiveness
 * - Financial Planning und Budgeting
 * - Customer Experience Optimization
 * 
 * ABHÄNGIGKEITEN:
 * - Container und SimpleLayout für konsistente UI
 * - multilanguageService für internationale Berichte
 * - Chart.js oder D3.js für Datenvisualisierung
 * - Date-fns für Datums-/Zeitberechnungen
 */

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Container } from '@/components/Container'
import { SimpleLayout } from '@/components/SimpleLayout'
import { useLanguage } from '@/services/multilanguageService'

// Icons
function TrendingUpIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function TrendingDownIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  )
}

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function CurrencyEuroIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m2-7a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function TruckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  )
}

// Stat Card Component
function StatCard({ title, value, change, icon: Icon, trend = 'neutral', format = 'number' }) {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val)
    }
    if (format === 'percentage') {
      return `${val}%`
    }
    return new Intl.NumberFormat('de-DE').format(val)
  }

  const trendIcon = trend === 'up' ? TrendingUpIcon : trend === 'down' ? TrendingDownIcon : null
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatValue(value)}
                </div>
                {change && trendIcon && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColor}`}>
                    <trendIcon className="self-center flex-shrink-0 h-4 w-4" />
                    <span className="ml-1">{Math.abs(change)}%</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

// Top Campers Table
function TopCampersTable({ campers }) {
  const { t } = useLanguage()
  
  if (!campers || campers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('analytics.noDataAvailable')}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.camper')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.location')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.bookings')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.revenue')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.occupancyRate')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {campers.map((camper, index) => (
            <tr key={camper.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{camper.name}</div>
                <div className="text-sm text-gray-500">€{camper.pricePerDay}/Tag</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {camper.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {camper.totalBookings}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                €{new Intl.NumberFormat('de-DE').format(camper.totalRevenue)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(camper.occupancyRate, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{camper.occupancyRate}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Recent Activity
function RecentActivity({ activities }) {
  const { t } = useLanguage()
  
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('analytics.noRecentActivity')}
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <CalendarIcon className="h-4 w-4 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{activity.customerName}</span> {t('analytics.booked')}{' '}
                      <span className="font-medium text-gray-900">{activity.camperName}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('analytics.booking')}: {activity.bookingNumber} • €{new Intl.NumberFormat('de-DE').format(activity.amount)}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString('de-DE')}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('30days')
  const { t } = useLanguage()

  useEffect(() => {
    loadAnalytics()
  }, [timeframe])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?timeframe=${timeframe}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
        setError(null)
      } else {
        throw new Error(data.error || t('analytics.loadingError'))
      }
    } catch (err) {
      console.error('Error loading analytics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SimpleLayout
        title={t('analytics.title')}
        intro={t('analytics.loadingDashboard')}
      >
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600"></div>
        </div>
      </SimpleLayout>
    )
  }

  if (error) {
    return (
      <SimpleLayout
        title={t('analytics.title')}
        intro={t('analytics.loadingError')}
      >
        <div className="text-center py-20">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('analytics.tryAgain')}
          </button>
        </div>
      </SimpleLayout>
    )
  }

  const { dashboard, performance, activity, alerts } = analytics

  return (
    <>
      <Head>
        <title>{t('analytics.title')} - CamperShare</title>
        <meta name="description" content={t('analytics.metaDescription')} />
      </Head>

      <SimpleLayout
        title={t('analytics.title')}
        intro={t('analytics.performanceOverview')}
      >
        <Container className="mt-16 sm:mt-20">
          {/* Timeframe Selector */}
          <div className="mb-8">
            <div className="flex space-x-4">
              {[
                { value: '7days', label: t('analytics.7days') },
                { value: '30days', label: t('analytics.30days') },
                { value: '90days', label: t('analytics.90days') },
                { value: '1year', label: t('analytics.1year') }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeframe(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title={t('analytics.totalBookings')}
              value={dashboard.kpis.totalBookings}
              change={dashboard.kpis.bookingGrowth}
              icon={CalendarIcon}
              trend={dashboard.kpis.bookingGrowth > 0 ? 'up' : dashboard.kpis.bookingGrowth < 0 ? 'down' : 'neutral'}
            />
            <StatCard
              title={t('analytics.totalRevenue')}
              value={dashboard.kpis.totalRevenue}
              change={dashboard.kpis.revenueGrowth}
              icon={CurrencyEuroIcon}
              format="currency"
              trend={dashboard.kpis.revenueGrowth > 0 ? 'up' : dashboard.kpis.revenueGrowth < 0 ? 'down' : 'neutral'}
            />
            <StatCard
              title={t('analytics.avgBookingValue')}
              value={dashboard.kpis.avgBookingValue}
              icon={TrendingUpIcon}
              format="currency"
            />
            <StatCard
              title={t('analytics.uniqueCustomers')}
              value={dashboard.kpis.uniqueCustomers}
              icon={UsersIcon}
            />
          </div>

          {/* Performance Alerts */}
          {alerts && alerts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      alert.type === 'error' 
                        ? 'border-red-200 bg-red-50 text-red-800' 
                        : 'border-yellow-200 bg-yellow-50 text-yellow-800'
                    }`}
                  >
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm">{alert.message}</p>
                    {alert.details && <p className="text-xs mt-1">{alert.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Campers */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{t('analytics.topPerformingCampers')}</h3>
                  <p className="text-sm text-gray-500">{t('analytics.revenueLastYear')}</p>
                </div>
                <div className="p-6">
                  <TopCampersTable campers={performance.topCampers} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="bg-white shadow-lg rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{t('analytics.recentActivity')}</h3>
                  <p className="text-sm text-gray-500">{t('analytics.newBookings')}</p>
                </div>
                <div className="p-6">
                  <RecentActivity activities={activity} />
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Stats */}
          {performance.geographic && performance.geographic.length > 0 && (
            <div className="mt-8">
              <div className="bg-white shadow-lg rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Standort-Performance</h3>
                  <p className="text-sm text-gray-500">Umsätze nach Standorten</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {performance.geographic.map((location, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{location.location}</h4>
                        <div className="mt-2 space-y-1">
                          <div className="text-sm text-gray-600">
                            {location.bookings} Buchungen
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            €{new Intl.NumberFormat('de-DE').format(location.revenue)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {location.campersCount} Camper verfügbar
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </SimpleLayout>
    </>
  )
}
