// Advanced Availability Service für CamperShare
// Verhindert Doppelbuchungen und bietet Verfügbarkeitsabfragen

const { query } = require('../lib/databaseConnection');

class AvailabilityService {
  
  /**
   * Prüft ob ein Camper für einen Zeitraum verfügbar ist
   */
  async checkCamperAvailability(camperVanId, startDate, endDate, excludeBookingId = null) {
    try {
      console.log(`🔍 Prüfe Verfügbarkeit für Camper ${camperVanId} von ${startDate} bis ${endDate}`);
      
      const result = await query(
        'SELECT is_camper_available($1, $2, $3, $4) as available',
        [camperVanId, startDate, endDate, excludeBookingId]
      );

      const isAvailable = result.rows[0]?.available || false;
      console.log(`✅ Verfügbarkeit: ${isAvailable ? 'VERFÜGBAR' : 'NICHT VERFÜGBAR'}`);
      
      return isAvailable;
    } catch (error) {
      console.error('❌ Fehler bei Verfügbarkeitsprüfung:', error);
      throw new Error('Verfügbarkeitsprüfung fehlgeschlagen');
    }
  }

  /**
   * Holt überlappende Buchungen für einen Camper
   */
  async getOverlappingBookings(camperVanId, startDate, endDate, excludeBookingId = null) {
    try {
      const result = await query(`
        SELECT 
          b.id,
          b.booking_number,
          b.start_date,
          b.end_date,
          b.status,
          u.first_name,
          u.last_name,
          u.email
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        WHERE b.camper_van_id = $1 
        AND b.id != COALESCE($4, '00000000-0000-0000-0000-000000000000'::uuid)
        AND b.status IN ('confirmed', 'pending')
        AND (
          ($2 >= b.start_date AND $2 < b.end_date)
          OR 
          ($3 > b.start_date AND $3 <= b.end_date)
          OR
          ($2 <= b.start_date AND $3 >= b.end_date)
        )
        ORDER BY b.start_date
      `, [camperVanId, startDate, endDate, excludeBookingId]);

      return result.rows;
    } catch (error) {
      console.error('❌ Fehler beim Abrufen überlappender Buchungen:', error);
      throw error;
    }
  }

  /**
   * Sucht verfügbare Camper für einen Zeitraum
   */
  async findAvailableCampers(startDate, endDate, location = null) {
    try {
      console.log(`🔍 Suche verfügbare Camper von ${startDate} bis ${endDate}`);
      
      let whereClause = '';
      const params = [startDate, endDate];
      
      if (location) {
        whereClause = 'AND cv.location ILIKE $3';
        params.push(`%${location}%`);
      }

      const result = await query(`
        SELECT 
          cv.*,
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM bookings b 
              WHERE b.camper_van_id = cv.id 
              AND b.status IN ('confirmed', 'pending')
              AND (
                ($1 >= b.start_date AND $1 < b.end_date)
                OR 
                ($2 > b.start_date AND $2 <= b.end_date)
                OR
                ($1 <= b.start_date AND $2 >= b.end_date)
              )
            ) THEN false
            ELSE true
          END as is_available
        FROM camper_vans cv
        WHERE cv.is_active = true
        ${whereClause}
        ORDER BY cv.name
      `, params);

      const availableCampers = result.rows.filter(camper => camper.is_available);
      
      console.log(`✅ ${availableCampers.length} verfügbare Camper gefunden`);
      return availableCampers;
    } catch (error) {
      console.error('❌ Fehler bei der Suche nach verfügbaren Campern:', error);
      throw error;
    }
  }

  /**
   * Berechnet die nächsten verfügbaren Termine für einen Camper
   */
  async getNextAvailableDates(camperVanId, fromDate = null, daysNeeded = 1) {
    try {
      const startDate = fromDate || new Date().toISOString().split('T')[0];
      
      const result = await query(`
        WITH blocked_periods AS (
          SELECT start_date, end_date
          FROM bookings 
          WHERE camper_van_id = $1 
          AND status IN ('confirmed', 'pending')
          AND end_date >= $2
          ORDER BY start_date
        ),
        date_gaps AS (
          SELECT 
            COALESCE(LAG(end_date) OVER (ORDER BY start_date), $2::date) as gap_start,
            start_date as gap_end
          FROM blocked_periods
          UNION ALL
          SELECT 
            COALESCE(MAX(end_date), $2::date) as gap_start,
            ($2::date + INTERVAL '365 days')::date as gap_end
          FROM blocked_periods
        )
        SELECT 
          gap_start as available_from,
          gap_end as available_until,
          (gap_end - gap_start) as days_available
        FROM date_gaps
        WHERE (gap_end - gap_start) >= $3
        AND gap_start >= $2::date
        ORDER BY gap_start
        LIMIT 5
      `, [camperVanId, startDate, daysNeeded]);

      return result.rows;
    } catch (error) {
      console.error('❌ Fehler beim Berechnen verfügbarer Termine:', error);
      throw error;
    }
  }

  /**
   * Validiert eine Buchungsanfrage vor der Erstellung
   */
  async validateBookingRequest(camperVanId, startDate, endDate, excludeBookingId = null) {
    try {
      // 1. Prüfe ob Camper existiert und aktiv ist (akzeptiert sowohl UUID als auch Slug)
      let camperResult;
      
      // Check if it's a UUID format (8-4-4-4-12 characters pattern)
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (uuidPattern.test(camperVanId)) {
        // It's a UUID
        camperResult = await query(
          'SELECT id, name, is_active FROM camper_vans WHERE id = $1',
          [camperVanId]
        );
      } else {
        // It's a slug, search by slug
        camperResult = await query(
          'SELECT id, name, is_active FROM camper_vans WHERE slug = $1',
          [camperVanId]
        );
      }

      if (camperResult.rows.length === 0) {
        return {
          valid: false,
          error: 'Camper nicht gefunden',
          code: 'CAMPER_NOT_FOUND'
        };
      }

      const camper = camperResult.rows[0];
      if (!camper.is_active) {
        return {
          valid: false,
          error: 'Camper ist nicht verfügbar',
          code: 'CAMPER_INACTIVE'
        };
      }

      // 2. Prüfe Datumsvalidität
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        return {
          valid: false,
          error: 'Startdatum kann nicht in der Vergangenheit liegen',
          code: 'INVALID_START_DATE'
        };
      }

      if (end <= start) {
        return {
          valid: false,
          error: 'Enddatum muss nach dem Startdatum liegen',
          code: 'INVALID_DATE_RANGE'
        };
      }

      // 3. Prüfe Verfügbarkeit (verwende immer die echte camper.id)
      const isAvailable = await this.checkCamperAvailability(
        camper.id, // Use the actual UUID from the database
        startDate, 
        endDate, 
        excludeBookingId
      );

      if (!isAvailable) {
        const overlapping = await this.getOverlappingBookings(
          camper.id, // Use the actual UUID from the database
          startDate, 
          endDate, 
          excludeBookingId
        );
        
        return {
          valid: false,
          error: 'Camper ist für den gewählten Zeitraum bereits gebucht',
          code: 'CAMPER_NOT_AVAILABLE',
          conflictingBookings: overlapping,
          suggestedDates: await this.getNextAvailableDates(camper.id, startDate, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
        };
      }

      return {
        valid: true,
        camper: camper
      };

    } catch (error) {
      console.error('❌ Fehler bei Buchungsvalidierung:', error);
      return {
        valid: false,
        error: 'Validierung fehlgeschlagen',
        code: 'VALIDATION_ERROR'
      };
    }
  }
}

// Singleton-Instanz exportieren
const availabilityService = new AvailabilityService();

module.exports = {
  availabilityService,
  AvailabilityService
};
