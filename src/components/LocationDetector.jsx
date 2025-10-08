import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../services/mapIntegrationService';
import { 
  MapPinIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export function LocationDetector({ onLocationDetected, className = '' }) {
  const { 
    location, 
    isLoading, 
    error, 
    permissionStatus, 
    getCurrentLocation, 
    clearLocation 
  } = useGeolocation();

  const [showDetails, setShowDetails] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Verhindere SSR-Probleme
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Callback wenn Location erkannt wurde
  useEffect(() => {
    if (location && onLocationDetected) {
      onLocationDetected(location);
    }
  }, [location, onLocationDetected]);

  const handleGetLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      console.error('Location detection failed:', error);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-600" />;
    }
    if (location) {
      return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    }
    if (error) {
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    }
    return <MapPinIcon className="h-5 w-5 text-gray-600" />;
  };

  const getStatusText = () => {
    if (isLoading) {
      return 'Standort wird ermittelt...';
    }
    if (location) {
      return `Standort erkannt (±${Math.round(location.accuracy)}m)`;
    }
    if (error) {
      return 'Standort konnte nicht ermittelt werden';
    }
    return 'Standort automatisch erkennen';
  };

  const getPermissionHelp = () => {
    switch (permissionStatus) {
      case 'denied':
        return (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Standortzugriff verweigert:</strong><br />
              Bitte erlauben Sie den Standortzugriff in Ihren Browser-Einstellungen und laden Sie die Seite neu.
            </p>
            <details className="mt-2">
              <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                Anleitung anzeigen
              </summary>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Chrome/Edge:</strong> Klicken Sie auf das Schloss-Symbol in der Adressleiste → Standort → Zulassen</p>
                <p><strong>Firefox:</strong> Klicken Sie auf das Schild-Symbol → Berechtigungen → Standort erlauben</p>
                <p><strong>Safari:</strong> Safari → Einstellungen → Websites → Standortdienste</p>
              </div>
            </details>
          </div>
        );
      case 'prompt':
        return (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Ihr Browser wird Sie nach der Erlaubnis für den Standortzugriff fragen. 
              Bitte klicken Sie auf "Zulassen" für die beste Erfahrung.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {getStatusText()}
            </p>
            {location && (
              <p className="text-xs text-gray-500">
                {location.source === 'cached' ? 'Letzte bekannte Position' : 'Aktuelle Position'}
                {location.lat && ` • ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-1">
                {error}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!isLoading && (
            <button
              onClick={handleGetLocation}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {location ? 'Aktualisieren' : 'Erkennen'}
            </button>
          )}
          
          {location && (
            <button
              onClick={clearLocation}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Löschen
            </button>
          )}
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            {showDetails ? 'Weniger' : 'Details'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Standort-Status</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Permission: <span className="font-medium">{permissionStatus}</span></li>
                <li>Browser Support: <span className="font-medium">{isMounted ? (navigator.geolocation ? 'Ja' : 'Nein') : 'Loading...'}</span></li>
                <li>HTTPS: <span className="font-medium">{isMounted ? (window.location.protocol === 'https:' ? 'Ja' : 'Nein') : 'Loading...'}</span></li>
              </ul>
            </div>
            
            {location && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Position Details</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>Latitude: <span className="font-medium">{location.lat?.toFixed(6)}</span></li>
                  <li>Longitude: <span className="font-medium">{location.lng?.toFixed(6)}</span></li>
                  <li>Genauigkeit: <span className="font-medium">±{Math.round(location.accuracy)}m</span></li>
                  <li>Quelle: <span className="font-medium">{location.source || 'GPS'}</span></li>
                </ul>
              </div>
            )}
          </div>
          
          {getPermissionHelp()}
        </div>
      )}
    </div>
  );
}

export default LocationDetector;
