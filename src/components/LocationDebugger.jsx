/**
 * LocationDebugger.jsx
 * ====================
 * 
 * HAUPTFUNKTION:
 * Entwicklungs- und Debug-Komponente zur Analyse und Überprüfung der Geolocation-Funktionalität.
 * Testet GPS-Koordinaten, Google Maps Reverse Geocoding und Standorterkennungsdienste.
 * 
 * ENTWICKLUNGS-FEATURES:
 * 
 * 1. GPS-Koordinaten Debugging:
 *    - Echzeit-Anzeige der aktuellen GPS-Position
 *    - Latitude/Longitude Koordinaten mit hoher Präzision
 *    - Fehlerbehandlung für Geolocation-Probleme
 *    - Browser-Kompatibilitätstests
 * 
 * 2. Google Maps Reverse Geocoding Test:
 *    - Umwandlung von Koordinaten in lesbare Adressen
 *    - Extraktion von Stadt und Region aus Address Components
 *    - Validation der Google Maps API Integration
 *    - Debugging der Geocoder-Antworten
 * 
 * 3. Debug-Informationsanzeige:
 *    - Strukturierte Darstellung aller Standortdaten
 *    - Raw GPS Coordinates für technische Analyse
 *    - Formatierte Google Maps Adressergebnisse
 *    - Detaillierte Address Components Aufschlüsselung
 * 
 * TECHNISCHE INTEGRATION:
 * 
 * 1. Geolocation Service:
 *    - Verwendet useGeolocation Hook aus mapIntegrationService
 *    - Asynchrone Koordinatenabfrage mit getCurrentLocation
 *    - Automatische Fehlerbehandlung und Retry-Logik
 * 
 * 2. Google Maps API:
 *    - Direkter Zugriff auf window.google.maps.Geocoder
 *    - Reverse Geocoding für Koordinaten-zu-Adresse Konvertierung
 *    - Address Components Parsing für Stadt-Extraktion
 *    - Status-Code Überprüfung für API-Antworten
 * 
 * 3. Debug-Datenstruktur:
 *    - rawCoords: Original GPS-Koordinaten (lat, lng)
 *    - googleResult: Formatierte Adresse von Google Maps
 *    - detectedCity: Extrahierte Stadt aus Address Components
 *    - allComponents: Vollständige Address Components Array
 * 
 * VERWENDUNG (NUR FÜR ENTWICKLUNG):
 * 
 * Integration in Entwicklungsumgebung:
 * {process.env.NODE_ENV === 'development' && <LocationDebugger />}
 * 
 * Temporäre Debug-Einbindung:
 * <LocationDebugger />
 * 
 * DEBUGGING-WORKFLOW:
 * 
 * 1. Komponente rendern
 * 2. "Test Location" Button klicken
 * 3. GPS-Permission gewähren
 * 4. Debug-Informationen analysieren
 * 5. Console-Logs für detaillierte Daten prüfen
 * 
 * EINSATZGEBIETE:
 * - Entwicklungsphase für Standortfunktionen
 * - Qualitätssicherung der GPS-Integration
 * - Debugging von Geolocation-Problemen
 * - Testing auf verschiedenen Geräten und Browsern
 * - Validierung der Google Maps API Konfiguration
 * 
 * SICHERHEITSHINWEISE:
 * - NUR in Entwicklungsumgebung verwenden
 * - Sensible Koordinatendaten nicht in Produktion loggen
 * - Component vor Production Build entfernen
 * - Debug-Informationen können persönliche Daten enthalten
 * 
 * ABHÄNGIGKEITEN:
 * - mapIntegrationService: Geolocation Hooks und Services
 * - Google Maps JavaScript API: Reverse Geocoding
 * - React Hooks: useState, useEffect für Zustandsverwaltung
 */

import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../services/mapIntegrationService';

export function LocationDebugger() {
  const { location, getCurrentLocation } = useGeolocation();
  const [debugInfo, setDebugInfo] = useState(null);

  const testLocation = async () => {
    try {
      const coords = await getCurrentLocation();
      console.log('Raw GPS Coordinates:', coords);
      
      // Test Google Maps Reverse Geocoding
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: coords.lat, lng: coords.lng } }, 
          (results, status) => {
            if (status === 'OK' && results[0]) {
              const result = results[0];
              const addressComponents = result.address_components;
              
              const city = addressComponents.find(comp => 
                comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
              );
              
              setDebugInfo({
                rawCoords: coords,
                googleResult: result.formatted_address,
                detectedCity: city ? city.long_name : 'Unknown',
                allComponents: addressComponents
              });
              
              console.log('Google Maps Result:', result);
              console.log('Detected City:', city);
            }
          }
        );
      }
      
      // Test mit OpenStreetMap als Alternative
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
        );
        const osmResult = await response.json();
        
        setDebugInfo(prev => ({
          ...prev,
          osmResult: osmResult.display_name,
          osmCity: osmResult.address?.city || osmResult.address?.town || osmResult.address?.village
        }));
        
        console.log('OpenStreetMap Result:', osmResult);
      } catch (error) {
        console.error('OSM Geocoding failed:', error);
      }
      
    } catch (error) {
      console.error('Location test failed:', error);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔍 Location Debug Tool
      </h3>
      
      <button
        onClick={testLocation}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Test Current Location
      </button>
      
      {debugInfo && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Raw GPS Coordinates:</h4>
            <p className="text-sm text-gray-700">
              Lat: {debugInfo.rawCoords.lat.toFixed(6)}<br />
              Lng: {debugInfo.rawCoords.lng.toFixed(6)}<br />
              Accuracy: ±{Math.round(debugInfo.rawCoords.accuracy)}m
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Google Maps Geocoding:</h4>
            <p className="text-sm text-blue-800">
              <strong>Address:</strong> {debugInfo.googleResult}<br />
              <strong>Detected City:</strong> {debugInfo.detectedCity}
            </p>
          </div>
          
          {debugInfo.osmResult && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">OpenStreetMap Geocoding:</h4>
              <p className="text-sm text-green-800">
                <strong>Address:</strong> {debugInfo.osmResult}<br />
                <strong>Detected City:</strong> {debugInfo.osmCity}
              </p>
            </div>
          )}
          
          <details className="p-4 bg-gray-50 rounded-lg">
            <summary className="font-medium text-gray-900 cursor-pointer">
              Address Components (Google Maps)
            </summary>
            <pre className="mt-2 text-xs text-gray-600 overflow-auto">
              {JSON.stringify(debugInfo.allComponents, null, 2)}
            </pre>
          </details>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Expected Results:</h4>
        <p className="text-sm text-yellow-800">
          Wenn du in <strong>Mannheim</strong> bist, sollten beide Services "Mannheim" als Stadt erkennen.<br />
          Falls "Heidelberg" angezeigt wird, liegt das an der Logik in unserem LocationService.
        </p>
      </div>
    </div>
  );
}

export default LocationDebugger;
