import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';
const { query } = require('../../../../lib/databaseConnection');
const { sendBookingConfirmationEmail } = require('../../../../lib/automaticEmailSender');

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#1f2937',
    width: '60%',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  priceLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 10,
    color: '#1f2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTop: '1 solid #e5e7eb',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTop: '1 solid #e5e7eb',
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
  },
  cancellationBox: {
    backgroundColor: '#eff6ff',
    border: '1 solid #bfdbfe',
    padding: 15,
    marginTop: 10,
  },
  cancellationText: {
    fontSize: 9,
    color: '#1e40af',
    lineHeight: 1.4,
  },
});

// PDF Document Component
const BookingConfirmationPDF = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Buchungsbestätigung</Text>
        <Text style={styles.subtitle}>CamperShare - Ihr Wohnmobil-Sharing Partner</Text>
      </View>

      {/* Buchungsinformationen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buchungsdetails</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Buchungsnummer:</Text>
          <Text style={styles.value}>#{booking.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Buchungsdatum:</Text>
          <Text style={styles.value}>{new Date(booking.createdAt).toLocaleDateString('de-DE')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>Bestätigt</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mietdauer:</Text>
          <Text style={styles.value}>
            {new Date(booking.startDate).toLocaleDateString('de-DE')} - {new Date(booking.endDate).toLocaleDateString('de-DE')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Anzahl Nächte:</Text>
          <Text style={styles.value}>{booking.totalDays}</Text>
        </View>
      </View>

      {/* Fahrzeugdetails */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fahrzeugdetails</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Fahrzeug:</Text>
          <Text style={styles.value}>{booking.camper?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kategorie:</Text>
          <Text style={styles.value}>{booking.camper?.category}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Personen:</Text>
          <Text style={styles.value}>{booking.camper?.passengers}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Betten:</Text>
          <Text style={styles.value}>{booking.camper?.beds}</Text>
        </View>
      </View>

      {/* Kundendaten */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kundendaten</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {booking.customerData?.firstName} {booking.customerData?.lastName}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-Mail:</Text>
          <Text style={styles.value}>{booking.customerData?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telefon:</Text>
          <Text style={styles.value}>{booking.customerData?.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Adresse:</Text>
          <Text style={styles.value}>
            {booking.customerData?.address}, {booking.customerData?.postalCode} {booking.customerData?.city}
          </Text>
        </View>
      </View>

      {/* Preisaufstellung */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preisaufstellung</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>
            Mietpreis ({booking.totalDays} Nächte à €{booking.pricePerNight})
          </Text>
          <Text style={styles.priceValue}>€{booking.basePrice}</Text>
        </View>
        {booking.serviceFee > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Servicegebühr</Text>
            <Text style={styles.priceValue}>€{booking.serviceFee}</Text>
          </View>
        )}
        {booking.taxes > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Steuern</Text>
            <Text style={styles.priceValue}>€{booking.taxes}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Gesamtpreis</Text>
          <Text style={styles.totalValue}>€{booking.totalPrice}</Text>
        </View>
      </View>

      {/* Stornierungsrichtlinien */}
      {booking.cancellationPolicy && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stornierungsrichtlinien</Text>
          <View style={styles.cancellationBox}>
            <Text style={styles.cancellationText}>{booking.cancellationPolicy}</Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>CamperShare GmbH | Musterstraße 123, 12345 Berlin</Text>
        <Text>Telefon: +49 123 456 789 | E-Mail: support@campershare.com</Text>
        <Text>Geschäftsführer: Max Mustermann | Amtsgericht Berlin HRB 123456</Text>
      </View>
    </Page>
  </Document>
);

export default async function handler(req, res) {
  const { bookingId } = req.query;

  if (req.method === 'POST') {
    try {
      // Buchungsdetails abrufen
      const bookingResult = await query(
        `SELECT b.*, c.name as camper_name, c.category, c.passengers, c.beds, c.images,
                u.first_name, u.last_name, u.email, u.phone
         FROM bookings b
         LEFT JOIN campers c ON b.camper_id = c.id
         LEFT JOIN users u ON b.user_id = u.id
         WHERE b.id = $1`,
        [bookingId]
      );

      if (bookingResult.rows.length === 0) {
        return res.status(404).json({ error: 'Buchung nicht gefunden' });
      }

      const bookingData = bookingResult.rows[0];
      
      // Formatierung der Buchungsdaten
      const booking = {
        id: bookingData.id,
        userId: bookingData.user_id,
        camperId: bookingData.camper_id,
        startDate: bookingData.start_date,
        endDate: bookingData.end_date,
        totalDays: bookingData.total_days,
        pricePerNight: parseFloat(bookingData.price_per_night),
        basePrice: parseFloat(bookingData.base_price),
        serviceFee: parseFloat(bookingData.service_fee || 0),
        taxes: parseFloat(bookingData.taxes || 0),
        totalPrice: parseFloat(bookingData.total_price),
        status: bookingData.status,
        paymentStatus: bookingData.payment_status,
        createdAt: bookingData.created_at,
        cancellationPolicy: bookingData.cancellation_policy || 'Kostenlose Stornierung bis 48 Stunden vor Beginn. Danach erhalten Sie eine vollständige Rückerstattung abzüglich der Servicegebühren.',
        camper: {
          name: bookingData.camper_name,
          category: bookingData.category,
          passengers: bookingData.passengers,
          beds: bookingData.beds,
          images: bookingData.images ? JSON.parse(bookingData.images) : []
        },
        customerData: {
          firstName: bookingData.first_name,
          lastName: bookingData.last_name,
          email: bookingData.email,
          phone: bookingData.phone,
          address: bookingData.billing_address,
          postalCode: bookingData.billing_postal_code,
          city: bookingData.billing_city
        }
      };

      // PDF generieren
      const pdfDoc = <BookingConfirmationPDF booking={booking} />;
      const pdfBuffer = await pdf(pdfDoc).toBuffer();

      // PDF als Download zurückgeben
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Buchungsbestätigung_${booking.id}.pdf"`);
      res.send(pdfBuffer);

    } catch (error) {
      console.error('Fehler bei der PDF-Generierung:', error);
      res.status(500).json({ error: 'Fehler bei der PDF-Generierung' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
