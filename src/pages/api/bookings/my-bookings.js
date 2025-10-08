import { query } from '@/lib/databaseConnection'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Extract and verify JWT token
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid authorization token provided' })
    }

    const token = authHeader.substring(7)
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    const userId = decoded.userId

    // Get user's bookings with camper van details
    const bookingsQuery = `
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
        cv.name as camper_name,
        cv.category as camper_category,
        cv.price_per_day as camper_price_per_day,
        cv.images as camper_images,
        cv.passengers as camper_passengers,
        cv.beds as camper_beds,
        cv.transmission as camper_transmission,
        cv.fuel_type as camper_fuel_type
      FROM bookings b
      LEFT JOIN camper_vans cv ON b.camper_van_id = cv.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `

    const result = await query(bookingsQuery, [userId])
    
    // Format the bookings for frontend
    const bookings = result.rows.map(booking => ({
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
      camper: {
        name: booking.camper_name,
        category: booking.camper_category,
        pricePerDay: parseFloat(booking.camper_price_per_day || 0),
        images: booking.camper_images || [],
        passengers: booking.camper_passengers,
        beds: booking.camper_beds,
        transmission: booking.camper_transmission,
        fuelType: booking.camper_fuel_type
      }
    }))

    res.status(200).json({ bookings })

  } catch (error) {
    console.error('Error fetching user bookings:', error)
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
