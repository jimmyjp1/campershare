const { query } = require('../../../../lib/databaseConnection')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    // Get user's bookings with camper van details
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
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `

    const result = await query(bookingQuery, [userId])
    
    // Format the bookings for frontend
    const formattedBookings = result.rows.map(booking => {
      const calculatedPrice = booking.total_days * parseFloat(booking.camper_price_per_day || 89)
      
      // Ensure we have a valid total amount
      let totalAmount = calculatedPrice // fallback to calculated price
      if (booking.total_amount && !isNaN(parseFloat(booking.total_amount))) {
        totalAmount = parseFloat(booking.total_amount)
      } else if (booking.base_price && !isNaN(parseFloat(booking.base_price))) {
        totalAmount = parseFloat(booking.base_price)
      }
      
      return {
        id: booking.id,
        bookingNumber: booking.booking_number,
        startDate: booking.start_date,
        endDate: booking.end_date,
        pickupLocation: booking.pickup_location || 'Standard Abholort',
        returnLocation: booking.return_location || 'Standard Rückgabeort',
        totalDays: booking.total_days,
        basePrice: booking.base_price ? parseFloat(booking.base_price) : calculatedPrice,
        addonPrice: parseFloat(booking.addon_price || 0),
        insurancePrice: parseFloat(booking.insurance_price || 0),
        totalAmount: totalAmount,
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
    })

    res.status(200).json({ 
      bookings: formattedBookings,
      total: formattedBookings.length
    })

  } catch (error) {
    console.error('Error fetching user bookings:', error)
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
