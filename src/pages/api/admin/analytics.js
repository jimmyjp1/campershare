// API endpoint for admin analytics data - Mock realistic data for now
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Mock realistic analytics data based on the generated data
    const currentDate = new Date();
    const monthlyRevenue = [];
    
    // Generate 12 months of realistic revenue data
    for (let i = 11; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const baseRevenue = 45000 + Math.random() * 25000; // €45k-70k per month
      const bookings = Math.floor(baseRevenue / 750); // Avg €750 per booking
      
      monthlyRevenue.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: Math.round(baseRevenue),
        bookings: bookings
      });
    }

    // Mock top performing campers
    const topCampers = [
      { vanId: 'vw-california-1', name: 'VW California Ocean', bookings: 28, revenue: 42000 },
      { vanId: 'mb-marco-polo-1', name: 'Mercedes Marco Polo', bookings: 24, revenue: 38500 },
      { vanId: 'fiat-ducato-1', name: 'Fiat Ducato Camper', bookings: 22, revenue: 31200 },
      { vanId: 'ford-transit-1', name: 'Ford Transit Custom', bookings: 19, revenue: 28750 },
      { vanId: 'peugeot-boxer-1', name: 'Peugeot Boxer', bookings: 17, revenue: 25800 },
      { vanId: 'citroen-jumper-1', name: 'Citroën Jumper', bookings: 15, revenue: 23400 },
      { vanId: 'renault-master-1', name: 'Renault Master', bookings: 12, revenue: 19200 },
      { vanId: 'iveco-daily-1', name: 'Iveco Daily', bookings: 10, revenue: 16500 }
    ];

    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    const totalBookings = monthlyRevenue.reduce((sum, m) => sum + m.bookings, 0);

    const adminAnalytics = {
      dashboard: {
        totalRevenue: totalRevenue,
        totalBookings: totalBookings,
        totalCustomers: Math.floor(totalBookings * 0.7), // Some customers book multiple times
        avgBookingValue: Math.round(totalRevenue / totalBookings)
      },
      revenueTrends: monthlyRevenue,
      topCampers: topCampers,
      monthlyStats: monthlyRevenue.map(m => ({
        month: m.month,
        revenue: m.revenue,
        bookings: m.bookings
      })),
      averageBookingValue: Math.round(totalRevenue / totalBookings)
    };

    res.status(200).json(adminAnalytics);
  } catch (error) {
    console.error('Error generating admin analytics:', error);
    res.status(500).json({ 
      message: 'Error fetching analytics data', 
      error: error.message 
    });
  }
}
