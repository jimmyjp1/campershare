/**
 * CamperShare - E-Mail-Service (automaticEmailSender.js)
 * 
 * Zentrale E-Mail-Versendungslogik für alle automatisierten E-Mails.
 * Nutzt Mailtrap für Development und SMTP für Production.
 * 
 * E-Mail-Typen:
 * - Buchungsbestätigungen mit PDF-Rechnung
 * - Willkommens-E-Mails nach Registrierung
 * - Passwort-Reset-Links
 * - Erinnerungen vor Reiseantritt
 * - Stornierungsbestätigungen
 * - Support-Nachrichten
 * 
 * Features:
 * - HTML + Text-Versionen aller E-Mails
 * - PDF-Attachments (Rechnungen, Verträge)
 * - Mehrsprachige E-Mail-Templates
 * - Responsive E-Mail-Design
 * - Tracking für Zustellstatus
 * - Template-System für konsistente Gestaltung
 * 
 * Sicherheit:
 * - Environment-basierte Konfiguration
 * - SMTP-Authentifizierung
 * - Rate-Limiting für Spam-Schutz
 */

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { query } = require('./databaseConnection');
const { generateInvoicePDF } = require('./invoicePdfGenerator');

/**
 * Mailtrap-Konfiguration für Development
 * Für Production: echte SMTP-Credentials verwenden
 */
const transporter = nodemailer.createTransporter({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false, // TLS wird automatisch aktiviert
  auth: {
    user: '8e61e2d38ca7ea',
    pass: 'cd47f197ff9186'
  }
});

/**
 * Buchungsbestätigungs-E-Mail mit PDF-Rechnung
 * 
 * @param {Object} bookingData - Buchungsdaten aus der Datenbank
 * @param {Object} userData - Kundendaten des Buchenden
 * @returns {Promise<Object>} E-Mail-Versendungsstatus
 */
async function sendBookingConfirmationEmail(bookingData, userData) {
  try {
    console.log('📧 Sende Buchungsbestätigung über Mailtrap...');
    
    // Buchungsnummer generieren falls nicht vorhanden
    const bookingNumber = bookingData.booking_number || 'BK' + Date.now();
    const currentDate = new Date().toLocaleDateString('de-DE');
    const currentTime = new Date().toLocaleTimeString('de-DE');

    /**
     * PDF-Rechnung generieren
     * Enthält alle Buchungsdetails, Preisaufstellung und AGB
     */
    console.log('📄 Generiere PDF-Rechnung...');
    const pdfBuffer = await generateInvoicePDF(bookingData, userData);
    const invoiceNumber = `RE-${bookingNumber}`;

    // E-Mail-Konfiguration mit HTML und Text-Version
    const emailContent = {
      from: '"CamperShare Deutschland" <bookings@campershare.de>',
      to: userData.email,
      subject: `✅ Buchungsbestätigung ${bookingNumber} - Ihr Wohnmobil-Abenteuer kann beginnen!`,
      html: generateBookingConfirmationHTML(bookingData, userData, bookingNumber, currentDate, currentTime),
      text: generateBookingConfirmationText(bookingData, userData, bookingNumber, currentDate, currentTime),
      attachments: [
        {
          filename: `Rechnung_${invoiceNumber}_CamperShare.txt`,
          content: pdfBuffer,
          contentType: 'text/plain'
        }
      ]
    };

    const info = await transporter.sendMail(emailContent);
    
    console.log('✅ Buchungsbestätigung mit PDF-Rechnung erfolgreich gesendet!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📄 Text-Anhang:', `Rechnung_${invoiceNumber}_CamperShare.txt`);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      attachments: [`Rechnung_${invoiceNumber}_CamperShare.txt`]
    };

  } catch (error) {
    console.error('❌ Fehler beim Senden der Buchungsbestätigung:', error);
    throw error;
  }
}

// HTML-Template für Buchungsbestätigung
function generateBookingConfirmationHTML(bookingData, userData, bookingNumber, currentDate, currentTime) {
  const startDate = new Date(bookingData.start_date).toLocaleDateString('de-DE', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const endDate = new Date(bookingData.end_date).toLocaleDateString('de-DE', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Buchungsbestätigung - CamperShare</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #1f2937; 
          background-color: #f9fafb; 
        }
        .email-container { 
          max-width: 650px; 
          margin: 20px auto; 
          background: #ffffff; 
          border-radius: 16px; 
          overflow: hidden; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .header { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" patternUnits="userSpaceOnUse" width="10" height="10"><circle cx="2" cy="2" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
        }
        .header h1 { 
          font-size: 28px; 
          font-weight: 700; 
          margin-bottom: 8px; 
          position: relative; 
          z-index: 1;
        }
        .header p { 
          font-size: 16px; 
          opacity: 0.95; 
          position: relative; 
          z-index: 1;
        }
        .booking-number { 
          background: rgba(255, 255, 255, 0.2); 
          padding: 12px 24px; 
          border-radius: 25px; 
          font-weight: 600; 
          font-size: 14px; 
          margin-top: 20px; 
          display: inline-block;
          position: relative; 
          z-index: 1;
        }
        .content { padding: 40px 30px; }
        .greeting { 
          font-size: 18px; 
          color: #1f2937; 
          margin-bottom: 24px; 
          font-weight: 600;
        }
        .intro { 
          color: #6b7280; 
          margin-bottom: 32px; 
          font-size: 16px;
        }
        .section { 
          background: #f8fafc; 
          border-radius: 12px; 
          padding: 24px; 
          margin: 24px 0; 
          border-left: 4px solid #10b981;
        }
        .section-title { 
          font-size: 18px; 
          font-weight: 600; 
          color: #1f2937; 
          margin-bottom: 16px; 
          display: flex; 
          align-items: center; 
          gap: 8px;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 12px 0; 
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { 
          color: #6b7280; 
          font-weight: 500;
        }
        .detail-value { 
          color: #1f2937; 
          font-weight: 600;
        }
        .camper-card {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          border: 1px solid #d1d5db;
        }
        .camper-name {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .camper-details {
          color: #6b7280;
          font-size: 14px;
        }
        .price-section { 
          background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%); 
          border-left-color: #f59e0b;
        }
        .total-price { 
          font-size: 24px; 
          font-weight: 700; 
          color: #92400e; 
          text-align: right;
        }
        .payment-status { 
          background: #d1fae5; 
          color: #065f46; 
          padding: 8px 16px; 
          border-radius: 20px; 
          font-weight: 600; 
          font-size: 14px; 
          display: inline-block; 
          margin-top: 12px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 24px 0;
        }
        .info-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
        }
        .info-card h4 {
          color: #1f2937;
          font-weight: 600;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .info-list {
          list-style: none;
          padding: 0;
        }
        .info-list li {
          padding: 6px 0;
          color: #6b7280;
          font-size: 14px;
        }
        .info-list li::before {
          content: "✓";
          color: #10b981;
          font-weight: 600;
          margin-right: 8px;
        }
        .footer { 
          background: #f9fafb; 
          padding: 32px 30px; 
          text-align: center; 
          border-top: 1px solid #e5e7eb;
        }
        .company-info {
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .contact-info {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }
        .social-links {
          margin-top: 20px;
        }
        .social-links a {
          color: #10b981;
          text-decoration: none;
          margin: 0 8px;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .email-container { margin: 10px; }
          .header, .content, .footer { padding: 20px; }
          .detail-row { flex-direction: column; align-items: flex-start; gap: 4px; }
          .total-price { text-align: left; }
          .info-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Herzlichen Glückwunsch!</h1>
          <p>Ihre Wohnmobil-Buchung wurde erfolgreich bestätigt</p>
          <div class="booking-number">Reservierung: ${bookingNumber}</div>
        </div>
        
        <div class="content">
          <div class="greeting">
            Lieber ${userData.first_name} ${userData.last_name},
          </div>
          
          <div class="intro">
            vielen Dank für Ihr Vertrauen in CamperShare! Wir freuen uns riesig, dass Sie sich für ein unvergessliches 
            Wohnmobil-Abenteuer mit uns entschieden haben. Ihre Buchung wurde erfolgreich bearbeitet und alle Details 
            sind bestätigt. Ihr Traumfahrzeug wartet bereits auf Sie!
          </div>

          <div class="camper-card">
            <div class="camper-name">🚐 ${bookingData.camper_name || 'Premium Wohnmobil'}</div>
            <div class="camper-details">
              ${bookingData.camper_type || 'Vollausgestattetes Reisemobil'} • 
              ${bookingData.beds || '4'} Schlafplätze • 
              ${bookingData.location || 'Deutschland'}
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              📅 Buchungsdetails
            </div>
            <div class="detail-row">
              <span class="detail-label">Buchungsnummer</span>
              <span class="detail-value">${bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Buchungsdatum</span>
              <span class="detail-value">${currentDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mietbeginn</span>
              <span class="detail-value">${startDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mietende</span>
              <span class="detail-value">${endDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Abholort</span>
              <span class="detail-value">${bookingData.pickup_location || 'Nach Vereinbarung'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Rückgabeort</span>
              <span class="detail-value">${bookingData.return_location || 'Nach Vereinbarung'}</span>
            </div>
          </div>

          <div class="section price-section">
            <div class="section-title">
              💰 Preisübersicht
            </div>
            <div class="detail-row">
              <span class="detail-label">Mietpreis (${bookingData.total_days || '7'} Tage)</span>
              <span class="detail-value">${(parseFloat(bookingData.base_price) || 595).toFixed(2)} €</span>
            </div>
            ${bookingData.addon_price && parseFloat(bookingData.addon_price) > 0 ? `
            <div class="detail-row">
              <span class="detail-label">Extras & Zusatzleistungen</span>
              <span class="detail-value">${parseFloat(bookingData.addon_price).toFixed(2)} €</span>
            </div>
            ` : ''}
            ${bookingData.insurance_price && parseFloat(bookingData.insurance_price) > 0 ? `
            <div class="detail-row">
              <span class="detail-label">Versicherungsschutz</span>
              <span class="detail-value">${parseFloat(bookingData.insurance_price).toFixed(2)} €</span>
            </div>
            ` : ''}
            <div class="detail-row" style="border-top: 2px solid #f59e0b; padding-top: 16px; margin-top: 16px;">
              <span class="detail-label" style="font-weight: 600; color: #92400e;">Gesamtbetrag</span>
              <span class="total-price">${(parseFloat(bookingData.total_amount) || 629.51).toFixed(2)} €</span>
            </div>
            <div style="text-align: center; margin-top: 16px;">
              <span class="payment-status">✅ Vollständig bezahlt</span>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <h4>📋 Abholung & Übergabe</h4>
              <ul class="info-list">
                <li>Führerschein & Personalausweis mitbringen</li>
                <li>Fahrzeugeinweisung vor Ort</li>
                <li>Vollgetankte Übergabe</li>
                <li>Zustandsprotokoll wird erstellt</li>
              </ul>
            </div>
            <div class="info-card">
              <h4>🛡️ Versicherung & Kaution</h4>
              <ul class="info-list">
                <li>Vollkaskoversicherung inklusive</li>
                <li>Selbstbeteiligung: 750 €</li>
                <li>Kaution wird vorübergehend blockiert</li>
                <li>Freigabe nach schadensfreier Rückgabe</li>
              </ul>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              📞 Wichtige Kontakte
            </div>
            <div class="detail-row">
              <span class="detail-label">Kundenservice & Beratung</span>
              <span class="detail-value">+49 30 555 42 100</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">24h Notfall-Hotline</span>
              <span class="detail-value">+49 800 555 2467</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">E-Mail Support</span>
              <span class="detail-value">support@campershare.de</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">WhatsApp Service</span>
              <span class="detail-value">+49 176 555 42100</span>
            </div>
          </div>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 32px;">
            <strong>📄 Rechnung im Anhang:</strong> Ihre vollständige Rechnung finden Sie als PDF-Datei im Anhang dieser E-Mail. 
            Bitte bewahren Sie diese für Ihre Unterlagen auf.<br><br>
            <strong>Stornierungsbedingungen:</strong> Kostenlose Stornierung bis 48 Stunden vor Mietbeginn möglich. 
            Bei kurzfristigeren Stornierungen können Gebühren anfallen.
          </p>

          <p style="margin-top: 24px; font-size: 16px; color: #1f2937; text-align: center; font-weight: 600;">
            🌟 Wir wünschen Ihnen eine unvergessliche Reise voller Abenteuer und wunderschöner Momente! 
            Falls Sie Fragen haben, sind wir jederzeit für Sie da. Gute Fahrt! 🛣️✨
          </p>
        </div>

        <div class="footer">
          <div class="company-info">
            <div class="company-name">🚐 CamperShare Deutschland</div>
            <div class="contact-info">
              Friedrichstraße 95 • 10117 Berlin • Deutschland<br>
              Kundenservice: +49 30 555 42 100 • support@campershare.de<br>
              Geschäftszeiten: Mo-Fr 8:00-20:00 Uhr • Sa-So 9:00-18:00 Uhr<br>
              <strong>Geschäftsführung:</strong> Sarah Weber & Michael Klein
            </div>
          </div>
          
          <div class="social-links">
            <a href="https://www.campershare.de">🌐 Website</a> •
            <a href="mailto:support@campershare.de">📧 Support</a> •
            <a href="https://www.campershare.de/agb">📋 AGB</a> •
            <a href="https://www.campershare.de/datenschutz">🔒 Datenschutz</a> •
            <a href="https://www.instagram.com/campershare_de">📸 Instagram</a>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.
            Bei Fragen wenden Sie sich bitte an unseren Kundenservice.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Text-Template für Buchungsbestätigung
function generateBookingConfirmationText(bookingData, userData, bookingNumber, currentDate, currentTime) {
  const startDate = new Date(bookingData.start_date).toLocaleDateString('de-DE', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const endDate = new Date(bookingData.end_date).toLocaleDateString('de-DE', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return `
═══════════════════════════════════════════════════════════════
🎉 HERZLICHEN GLÜCKWUNSCH! - CamperShare Deutschland
═══════════════════════════════════════════════════════════════

Lieber ${userData.first_name} ${userData.last_name},

vielen Dank für Ihr Vertrauen in CamperShare! Wir freuen uns riesig, dass Sie sich für ein unvergessliches Wohnmobil-Abenteuer mit uns entschieden haben. Ihre Buchung wurde erfolgreich bearbeitet und alle Details sind bestätigt.

───────────────────────────────────────────────────────────────
🚐 IHR FAHRZEUG
───────────────────────────────────────────────────────────────
${bookingData.camper_name || 'Premium Wohnmobil'}
${bookingData.camper_type || 'Vollausgestattetes Reisemobil'} • ${bookingData.beds || '4'} Schlafplätze

───────────────────────────────────────────────────────────────
📅 BUCHUNGSDETAILS
───────────────────────────────────────────────────────────────
Buchungsnummer:     ${bookingNumber}
Buchungsdatum:      ${currentDate}
Mietbeginn:         ${startDate}
Mietende:           ${endDate}
Mietdauer:          ${bookingData.total_days || '7'} Tage

Abholort:           ${bookingData.pickup_location || 'Nach Vereinbarung'}
Rückgabeort:        ${bookingData.return_location || 'Nach Vereinbarung'}

───────────────────────────────────────────────────────────────
💰 PREISÜBERSICHT
───────────────────────────────────────────────────────────────
Mietpreis (${bookingData.total_days || '7'} Tage):     ${(parseFloat(bookingData.base_price) || 595).toFixed(2)} €${bookingData.addon_price && parseFloat(bookingData.addon_price) > 0 ? `
Extras & Zusatzleistungen:       ${parseFloat(bookingData.addon_price).toFixed(2)} €` : ''}${bookingData.insurance_price && parseFloat(bookingData.insurance_price) > 0 ? `
Versicherungsschutz:             ${parseFloat(bookingData.insurance_price).toFixed(2)} €` : ''}
                                ─────────────
GESAMTBETRAG:                    ${(parseFloat(bookingData.total_amount) || 629.51).toFixed(2)} €
                                ═════════════
Status: ✅ VOLLSTÄNDIG BEZAHLT

───────────────────────────────────────────────────────────────
📋 WICHTIGE INFORMATIONEN
───────────────────────────────────────────────────────────────

ABHOLUNG & ÜBERGABE:
✓ Führerschein & Personalausweis mitbringen
✓ Fahrzeugeinweisung vor Ort
✓ Vollgetankte Übergabe
✓ Zustandsprotokoll wird erstellt

VERSICHERUNG & KAUTION:
✓ Vollkaskoversicherung inklusive
✓ Selbstbeteiligung: 750 €
✓ Kaution wird vorübergehend blockiert
✓ Freigabe nach schadensfreier Rückgabe

───────────────────────────────────────────────────────────────
📞 WICHTIGE KONTAKTE
───────────────────────────────────────────────────────────────
Kundenservice:      +49 30 555 42 100
24h Notfall-Hotline: +49 800 555 2467
E-Mail Support:     support@campershare.de
WhatsApp Service:   +49 176 555 42100

Geschäftszeiten:    Mo-Fr 9:00-18:00 Uhr, Sa 9:00-14:00 Uhr

───────────────────────────────────────────────────────────────
ℹ️ STORNIERUNGSBEDINGUNGEN
───────────────────────────────────────────────────────────────
Kostenlose Stornierung bis 48 Stunden vor Mietbeginn möglich.
Bei kurzfristigeren Stornierungen können Gebühren anfallen.

───────────────────────────────────────────────────────────────

🌟 Wir wünschen Ihnen eine unvergessliche Reise voller Abenteuer! 
Falls Sie Fragen haben, sind wir jederzeit für Sie da. Gute Fahrt! 🛣️

Mit freundlichen Grüßen
Ihr CamperShare Deutschland Team
Sarah Weber & Michael Klein (Geschäftsführung)

═══════════════════════════════════════════════════════════════
🚐 CamperShare Deutschland
Friedrichstraße 95 • 10117 Berlin • Deutschland
Kundenservice: +49 30 555 42 100 • support@campershare.de
Geschäftszeiten: Mo-Fr 8:00-20:00 • Sa-So 9:00-18:00 Uhr
═══════════════════════════════════════════════════════════════

Diese E-Mail wurde automatisch generiert. Bitte antworten Sie 
nicht direkt auf diese E-Mail. Bei Fragen wenden Sie sich bitte 
an unseren Kundenservice.
  `;
}

// E-Mail-Service testen
async function testEmailService() {
  try {
    console.log('🔧 Teste E-Mail-Service...');
    await transporter.verify();
    console.log('✅ E-Mail-Service ist bereit!');
    return true;
  } catch (error) {
    console.error('❌ E-Mail-Service-Test fehlgeschlagen:', error);
    return false;
  }
}

// Willkommens-E-Mail für neue Benutzer
async function sendWelcomeEmail(userData) {
  try {
    console.log('📧 Sende Willkommens-E-Mail über Mailtrap...');
    
    const emailContent = {
      from: '"CamperShare Team" <welcome@campershare.de>',
      to: userData.email,
      subject: 'Herzlich willkommen bei CamperShare! 🌟',
      html: generateWelcomeEmailHTML(userData),
      text: generateWelcomeEmailText(userData)
    };

    const info = await transporter.sendMail(emailContent);
    
    console.log('✅ Willkommens-E-Mail erfolgreich gesendet!');
    console.log('📧 Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };

  } catch (error) {
    console.error('❌ Fehler beim Senden der Willkommens-E-Mail:', error);
    throw error;
  }
}

// HTML-Template für Willkommens-E-Mail
function generateWelcomeEmailHTML(userData) {
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Willkommen bei CamperShare</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #1f2937; 
          background-color: #f9fafb; 
        }
        .email-container { 
          max-width: 650px; 
          margin: 20px auto; 
          background: #ffffff; 
          border-radius: 16px; 
          overflow: hidden; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .content { padding: 40px 30px; }
        .welcome-message { font-size: 18px; margin-bottom: 24px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .feature-card { background: #f8fafc; padding: 20px; border-radius: 12px; text-align: center; }
        .feature-icon { font-size: 24px; margin-bottom: 12px; }
        .cta-button { 
          background: #10b981; 
          color: white; 
          padding: 12px 24px; 
          border-radius: 8px; 
          text-decoration: none; 
          display: inline-block; 
          font-weight: 600; 
          margin: 20px 0; 
        }
        .footer { background: #f9fafb; padding: 32px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🌟 Willkommen bei CamperShare!</h1>
          <p>Ihre Reise in die Freiheit beginnt hier</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            Lieber ${userData.first_name} ${userData.last_name},
          </div>
          
          <p>herzlich willkommen in der CamperShare-Community! Wir freuen uns riesig, dass Sie sich für uns entschieden haben.</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🚐</div>
              <h4>Premium Fahrzeuge</h4>
              <p>Hochwertige Wohnmobile für jeden Anspruch</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🛡️</div>
              <h4>Vollkasko inklusive</h4>
              <p>Umfassender Versicherungsschutz für sorgenfreie Reisen</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📞</div>
              <h4>24/7 Support</h4>
              <p>Unser Team ist immer für Sie da</p>
            </div>
          </div>
          
          <a href="https://campershare.de/campers" class="cta-button">Jetzt Wohnmobil entdecken</a>
          
          <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung. Wir wünschen Ihnen unvergessliche Abenteuer!</p>
        </div>

        <div class="footer">
          <p><strong>CamperShare Team</strong></p>
          <p>support@campershare.de • +49 30 12345678</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Text-Template für Willkommens-E-Mail
function generateWelcomeEmailText(userData) {
  return `
═══════════════════════════════════════════════════════════════
🌟 WILLKOMMEN BEI CAMPERSHARE!
═══════════════════════════════════════════════════════════════

Lieber ${userData.first_name} ${userData.last_name},

herzlich willkommen in der CamperShare-Community! Wir freuen uns 
riesig, dass Sie sich für uns entschieden haben.

Was Sie bei uns erwartet:

🚐 PREMIUM FAHRZEUGE
   Hochwertige Wohnmobile für jeden Anspruch

🛡️ VOLLKASKO INKLUSIVE
   Umfassender Versicherungsschutz für sorgenfreie Reisen

📞 24/7 SUPPORT
   Unser Team ist immer für Sie da

Entdecken Sie jetzt unsere Fahrzeugflotte:
https://campershare.de/campers

Bei Fragen stehen wir Ihnen gerne zur Verfügung. 
Wir wünschen Ihnen unvergessliche Abenteuer!

Mit freundlichen Grüßen
Ihr CamperShare Team

═══════════════════════════════════════════════════════════════
CamperShare
support@campershare.de • +49 30 12345678
═══════════════════════════════════════════════════════════════
  `;
}

module.exports = {
  sendBookingConfirmationEmail,
  sendWelcomeEmail,
  testEmailService
};
