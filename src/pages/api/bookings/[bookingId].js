const { query } = require('../../../lib/databaseConnection');

export default async function handler(req, res) {
  const { bookingId } = req.query;

  if (req.method === 'GET') {
    try {
      // Buchungsdetails aus der Datenbank abrufen
      const bookingResult = await query(
        `SELECT b.*, c.name as camper_name, c.type as category, c.passengers, c.beds, c.images,
                u.first_name, u.last_name, u.email, u.phone
         FROM bookings b
         LEFT JOIN camper_vans c ON b.camper_van_id = c.id
         LEFT JOIN users u ON b.user_id = u.id
         WHERE b.id = $1`,
        [bookingId]
      );

      if (bookingResult.rows.length === 0) {
        return res.status(404).json({ error: 'Buchung nicht gefunden' });
      }

      const booking = bookingResult.rows[0];
      
      // Formatierung der Antwort
      const response = {
        id: booking.id,
        userId: booking.user_id,
        camperId: booking.camper_id,
        startDate: booking.start_date,
        endDate: booking.end_date,
        totalDays: booking.total_days,
        pricePerNight: parseFloat(booking.price_per_night),
        basePrice: parseFloat(booking.base_price),
        serviceFee: parseFloat(booking.service_fee || 0),
        taxes: parseFloat(booking.taxes || 0),
        totalPrice: parseFloat(booking.total_price),
        status: booking.status,
        paymentStatus: booking.payment_status,
        createdAt: booking.created_at,
        cancellationPolicy: booking.cancellation_policy,
        camper: {
          name: booking.camper_name,
          category: booking.category,
          passengers: booking.passengers,
          beds: booking.beds,
          images: booking.images ? JSON.parse(booking.images) : []
        },
        customerData: {
          firstName: booking.first_name,
          lastName: booking.last_name,
          email: booking.email,
          phone: booking.phone,
          address: booking.billing_address,
          postalCode: booking.billing_postal_code,
          city: booking.billing_city
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Fehler beim Abrufen der Buchungsdetails:', error);
      res.status(500).json({ error: 'Serverfehler' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
