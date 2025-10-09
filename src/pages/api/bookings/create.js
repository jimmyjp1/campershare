/**
 * CamperShare - Buchungs-API (create.js)
 * 
 * Diese API-Route erstellt neue Buchungen mit vollständiger Validierung.
 * Sie prüft Verfügbarkeit, erstellt Datenbankeinträge, sendet E-Mails
 * und gewährleistet Datenkonsistenz.
 * 
 * POST /api/bookings/create
 * 
 * Body:
 * - camperId: ID des zu buchenden Wohnmobils
 * - startDate/endDate: Buchungszeitraum
 * - totalDays/totalPrice: Berechnete Werte
 * - customerData: Kundendaten (Name, E-Mail, etc.)
 * - paymentData: Zahlungsinformationen
 * - cancellationPolicy: Stornobedingungen
 * 
 * Response: 
 * - Buchungsnummer und Bestätigungs-E-Mail
 */

const { query } = require('../../../lib/databaseConnection');
const { sendBookingConfirmationEmail } = require('../../../lib/automaticEmailSender');
const { availabilityService } = require('../../../services/camperAvailabilityService');

export default async function handler(req, res) {
  // Nur POST-Requests erlaubt
  if (req.method === 'POST') {
    try {
      // Request-Body destructuring für bessere Lesbarkeit
      const {
        camperId,
        startDate,
        endDate,
        totalDays,
        totalPrice,
        customerData,
        paymentData,
        cancellationPolicy
      } = req.body;

      // Debug-Logging für Troubleshooting
      console.log('📋 Booking API Request:', {
        camperId,
        startDate,
        endDate,
        totalDays,
        totalPrice,
        customerEmail: customerData?.email
      });

      /**
       * 1. VALIDIERUNG
       * Prüfung aller erforderlichen Buchungsdaten
       */
      if (!camperId || !startDate || !endDate || !totalPrice || !customerData) {
        console.error('❌ Unvollständige Buchungsdaten:', {
          camperId: !!camperId,
          startDate: !!startDate,
          endDate: !!endDate,
          totalPrice: !!totalPrice,
          customerData: !!customerData
        });
        return res.status(400).json({ error: 'Unvollständige Buchungsdaten' });
      }

      /**
       * 2. VERFÜGBARKEITSPRÜFUNG
       * Doppelte Buchungen verhindern
       */
      console.log(`🛡️ Prüfe Verfügbarkeit für Camper ${camperId} von ${startDate} bis ${endDate}`);
      
      // 🎯 VERFÜGBARKEITSPRÜFUNG - KRITISCHER PUNKT!
      const validation = await availabilityService.validateBookingRequest(
        camperId, 
        startDate, 
        endDate
      );

      if (!validation.valid) {
        console.error(`❌ Buchung abgelehnt: ${validation.error}`);
        
        let responseData = {
          error: validation.error,
          code: validation.code
        };

        // Zusätzliche Informationen bei Konflikten hinzufügen
        if (validation.conflictingBookings) {
          responseData.conflictingBookings = validation.conflictingBookings;
        }
        
        if (validation.suggestedDates) {
          responseData.suggestedDates = validation.suggestedDates;
        }

        return res.status(409).json(responseData); // 409 = Conflict
      }

      console.log(`✅ Camper verfügbar - Buchung wird erstellt`);

      // Vollständige Camper-Details für E-Mail laden
      const camperDetailsResult = await query(
        'SELECT * FROM camper_vans WHERE id = $1',
        [validation.camper.id]
      );
      
      if (camperDetailsResult.rows.length === 0) {
        console.error('❌ Camper-Details nicht gefunden');
        return res.status(500).json({ error: 'Camper-Details nicht gefunden' });
      }
      
      const camper = camperDetailsResult.rows[0];
      const pricePerNight = parseFloat(camper.price_per_day);
      const basePrice = pricePerNight * totalDays;
      const serviceFee = Math.round(basePrice * 0.12); // 12% Servicegebühr
      const taxes = Math.round((basePrice + serviceFee) * 0.19); // 19% MwSt
      const calculatedTotal = basePrice + serviceFee + taxes;

      // Benutzer erstellen oder finden
      let userId;
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1',
        [customerData.email]
      );

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id;
        
        // Benutzerdaten aktualisieren
        await query(
          `UPDATE users SET 
           first_name = $1, last_name = $2, phone = $3, 
           updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          [customerData.firstName, customerData.lastName, customerData.phone, userId]
        );
      } else {
        // Neuen Benutzer erstellen mit einem temporären Passwort-Hash
        const crypto = require('crypto');
        const tempPassword = crypto.randomBytes(16).toString('hex');
        const simpleHash = crypto.createHash('sha256').update(tempPassword).digest('hex');
        
        const newUser = await query(
          `INSERT INTO users 
           (first_name, last_name, email, phone, password_hash, role, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
           RETURNING id`,
          [customerData.firstName, customerData.lastName, customerData.email, customerData.phone, simpleHash]
        );
        userId = newUser.rows[0].id;
      }

      // Buchungsnummer generieren (einheitliches Format: CS-YYYY-XXXX)
      const currentYear = new Date().getFullYear();
      
      // Finde die höchste Buchungsnummer des aktuellen Jahres
      const lastBookingQuery = await query(
        `SELECT booking_number FROM bookings 
         WHERE booking_number LIKE $1 
         ORDER BY booking_number DESC 
         LIMIT 1`,
        [`CS-${currentYear}-%`]
      );
      
      let nextNumber = 1001; // Startnummer für neue Jahre
      if (lastBookingQuery.rows.length > 0) {
        const lastNumber = lastBookingQuery.rows[0].booking_number;
        console.log('🔍 Letzte Buchungsnummer:', lastNumber);
        try {
          const parts = lastNumber.split('-');
          console.log('🔍 Buchungsnummer-Teile:', parts);
          if (parts.length >= 3) {
            const lastSequence = parseInt(parts[2]);
            console.log('🔍 Letzte Sequenz:', lastSequence);
            if (!isNaN(lastSequence)) {
              nextNumber = lastSequence + 1;
            }
          }
        } catch (error) {
          console.error('❌ Fehler beim Parsen der Buchungsnummer:', error);
        }
      }
      
      const bookingNumber = `CS-${currentYear}-${nextNumber}`;

      // Buchung in der Datenbank erstellen
      const bookingResult = await query(
        `INSERT INTO bookings 
         (booking_number, user_id, camper_van_id, start_date, end_date, total_days, 
          base_price, addon_price, insurance_price, total_amount, 
          status, payment_status, pickup_location, return_location, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'confirmed', 'paid', $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
         RETURNING id`,
        [
          bookingNumber, userId, camperId, startDate, endDate, totalDays,
          basePrice, 0, 0, calculatedTotal,
          'Standard Abholort', 'Standard Rückgabeort'
        ]
      );

      const bookingId = bookingResult.rows[0].id;

      // Booking-Objekt für E-Mail zusammenstellen
      const booking = {
        id: bookingId,
        bookingNumber: bookingNumber,
        userId: userId,
        camperId: camperId,
        startDate: startDate,
        endDate: endDate,
        totalDays: totalDays,
        pricePerNight: pricePerNight,
        basePrice: basePrice,
        serviceFee: serviceFee,
        taxes: taxes,
        totalPrice: calculatedTotal,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
        cancellationPolicy: cancellationPolicy || 'Kostenlose Stornierung bis 48 Stunden vor Beginn. Danach erhalten Sie eine vollständige Rückerstattung abzüglich der Servicegebühren.',
        camper: {
          name: camper.name,
          category: camper.type || camper.category,
          passengers: camper.passengers,
          beds: camper.beds,
          images: []  // Vereinfacht für jetzt, um den JSON Parse Fehler zu vermeiden
        },
        customerData: customerData
      };

      // E-Mail senden (ohne PDF für jetzt)
      try {
        await sendBookingConfirmationEmail(booking, customerData);
        console.log('✅ Buchungsbestätigung per E-Mail versendet');
      } catch (emailError) {
        console.error('⚠️ Fehler beim E-Mail-Versand (Buchung trotzdem erstellt):', emailError);
      }

      // Erfolgreiche Antwort
      res.status(201).json({
        success: true,
        bookingId: bookingId,
        bookingNumber: bookingNumber,
        message: 'Buchung erfolgreich erstellt',
        booking: booking
      });

    } catch (error) {
      console.error('Fehler bei der Buchungserstellung:', error);
      res.status(500).json({ 
        error: 'Fehler bei der Buchungserstellung',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
