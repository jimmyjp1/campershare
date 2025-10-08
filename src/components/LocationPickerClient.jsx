// Client-Only Location Picker um Hydration Errors zu vermeiden
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import ohne SSR
const SmartLocationPicker = dynamic(
  () => import('./LocationPicker').then(mod => mod.SmartLocationPicker),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg h-20 mb-8">
        <div className="flex items-center justify-center h-full">
          <div className="text-zinc-500 dark:text-zinc-400">📍 Standort wird geladen...</div>
        </div>
      </div>
    )
  }
)

export default function LocationPickerClient({ onLocationDetected, className = "mb-8" }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Render nichts während SSR
  if (!isMounted) {
    return (
      <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg h-20 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-zinc-500 dark:text-zinc-400">📍 Standort wird geladen...</div>
        </div>
      </div>
    )
  }

  return (
    <SmartLocationPicker 
      onLocationSelect={onLocationDetected}
      showNearbyLocations={true}
      className={className}
    />
  )
}
