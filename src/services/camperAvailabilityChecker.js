// Frontend-Service für Verfügbarkeitsprüfung
// Integriert sich in das bestehende Buchungsformular

class FrontendAvailabilityService {
  
  /**
   * Prüft Camper-Verfügbarkeit über API
   */
  async checkAvailability(camperId, startDate, endDate) {
    try {
      const response = await fetch('/api/availability/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          camperId,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        })
      });

      const result = await response.json();
      return {
        available: result.available,
        conflicts: result.conflicts || [],
        suggestedDates: result.suggestedDates || []
      };
    } catch (error) {
      console.error('Verfügbarkeitsprüfung fehlgeschlagen:', error);
      return { 
        available: false, 
        error: 'Prüfung fehlgeschlagen' 
      };
    }
  }

  /**
   * Sucht verfügbare Camper für einen Zeitraum
   */
  async findAvailableCampers(startDate, endDate, location = null) {
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });
      
      if (location) {
        params.append('location', location);
      }

      const response = await fetch(`/api/availability/search?${params}`);
      const result = await response.json();
      
      return {
        success: true,
        campers: result.availableCampers || []
      };
    } catch (error) {
      console.error('Verfügbare Camper-Suche fehlgeschlagen:', error);
      return { 
        success: false, 
        error: 'Suche fehlgeschlagen' 
      };
    }
  }

  /**
   * Echtzeit-Validierung während der Datumseingabe
   */
  async validateBookingDates(camperId, startDate, endDate) {
    // Kurze Verzögerung um zu viele API-Calls zu vermeiden
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await this.checkAvailability(camperId, startDate, endDate);
        resolve(result);
      }, 300);
    });
  }
}

// Singleton-Instanz
const frontendAvailabilityService = new FrontendAvailabilityService();

export { frontendAvailabilityService };

// React Hook für Verfügbarkeitsprüfung
import { useState, useEffect } from 'react';

export function useAvailabilityCheck(camperId, startDate, endDate) {
  const [availability, setAvailability] = useState({
    loading: false,
    available: null,
    conflicts: [],
    suggestedDates: [],
    error: null
  });

  useEffect(() => {
    if (!camperId || !startDate || !endDate) {
      setAvailability(prev => ({
        ...prev,
        available: null,
        loading: false
      }));
      return;
    }

    const checkAvailability = async () => {
      setAvailability(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await frontendAvailabilityService.checkAvailability(
          camperId, 
          startDate, 
          endDate
        );

        setAvailability({
          loading: false,
          available: result.available,
          conflicts: result.conflicts || [],
          suggestedDates: result.suggestedDates || [],
          error: result.error || null
        });
      } catch (error) {
        setAvailability({
          loading: false,
          available: false,
          conflicts: [],
          suggestedDates: [],
          error: 'Verfügbarkeitsprüfung fehlgeschlagen'
        });
      }
    };

    // Debouncing für bessere Performance
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
    
  }, [camperId, startDate, endDate]);

  return availability;
}

// Verfügbarkeits-Indikator-Component
export function AvailabilityIndicator({ 
  availability, 
  showDetails = false,
  className = "" 
}) {
  if (availability.loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Prüfe Verfügbarkeit...</span>
      </div>
    );
  }

  if (availability.error) {
    return (
      <div className={`flex items-center space-x-2 text-red-600 ${className}`}>
        <span className="text-sm">⚠️ {availability.error}</span>
      </div>
    );
  }

  if (availability.available === null) {
    return null;
  }

  if (availability.available) {
    return (
      <div className={`flex items-center space-x-2 text-green-600 ${className}`}>
        <span className="text-sm">✅ Verfügbar</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2 text-red-600">
        <span className="text-sm">❌ Nicht verfügbar</span>
      </div>
      
      {showDetails && availability.conflicts.length > 0 && (
        <div className="text-xs text-gray-600 bg-red-50 p-2 rounded">
          <div className="font-semibold mb-1">Konfliktbuchungen:</div>
          {availability.conflicts.map((conflict, index) => (
            <div key={index}>
              {new Date(conflict.start_date).toLocaleDateString()} - {new Date(conflict.end_date).toLocaleDateString()}
            </div>
          ))}
        </div>
      )}
      
      {showDetails && availability.suggestedDates.length > 0 && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
          <div className="font-semibold mb-1">Alternativen:</div>
          {availability.suggestedDates.slice(0, 3).map((suggestion, index) => (
            <div key={index}>
              Ab {new Date(suggestion.available_from).toLocaleDateString()} 
              ({suggestion.days_available} Tage verfügbar)
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
