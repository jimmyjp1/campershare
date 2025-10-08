import { query } from '@/lib/databaseConnection'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { bookingNumber } = req.query

    if (!bookingNumber) {
      return res.status(400).json({ message: 'Booking number is required' })
    }

    // Get booking with camper van details
    const bookingQuery = `
      SELECT 
        b.id,
        b.booking_number,
        b.start_date,
        b.end_date,
        b.pickup_location,
        b.return_location,
        b.total_days,
        b.base_price,
        b.addon_price,
        b.insurance_price,
        b.total_amount,
        b.status,
        b.payment_status,
        b.addons,
        b.insurance_package,
        b.special_requests,
        b.created_at,
        b.updated_at,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        cv.name as camper_name,
        cv.type as camper_category,
        cv.price_per_day as camper_price_per_day,
        cv.images as camper_images,
        cv.beds as camper_beds,
        cv.transmission as camper_transmission,
        cv.drive_type as camper_fuel_type
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN camper_vans cv ON b.camper_van_id = cv.id
      WHERE b.booking_number = $1
    `

    const result = await query(bookingQuery, [bookingNumber])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const booking = result.rows[0]
    
    // Format the booking for frontend
    const formattedBooking = {
      id: booking.id,
      bookingNumber: booking.booking_number,
      startDate: booking.start_date,
      endDate: booking.end_date,
      pickupLocation: booking.pickup_location,
      returnLocation: booking.return_location,
      totalDays: booking.total_days,
      basePrice: parseFloat(booking.base_price),
      addonPrice: parseFloat(booking.addon_price || 0),
      insurancePrice: parseFloat(booking.insurance_price || 0),
      totalAmount: parseFloat(booking.total_amount),
      status: booking.status,
      paymentStatus: booking.payment_status,
      addons: booking.addons || [],
      insurancePackage: booking.insurance_package,
      specialRequests: booking.special_requests,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      customerData: {
        firstName: booking.first_name,
        lastName: booking.last_name,
        email: booking.email,
        phone: booking.phone
      },
      camper: {
        name: booking.camper_name,
        category: booking.camper_category,
        pricePerDay: parseFloat(booking.camper_price_per_day || 0),
        images: booking.camper_images || [],
        beds: booking.camper_beds,
        transmission: booking.camper_transmission,
        fuelType: booking.camper_fuel_type
      }
    }

    res.status(200).json({ booking: formattedBooking })

  } catch (error) {
    console.error('Error fetching booking by number:', error)
    res.status(500).json({ 
      message: 'Error fetching booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
