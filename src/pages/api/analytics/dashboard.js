// Analytics API - Dashboard Statistics
// GET /api/analytics/dashboard - Haupt-Dashboard Statistiken

const analyticsService = require('../../../services/analyticsService');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { timeframe = '30days' } = req.query;
      
      console.log('📊 Loading dashboard analytics...', { timeframe });
      
      // Parallel laden für bessere Performance
      const [
        dashboardStats,
        revenueTrends,
        topCampers,
        customerSegments,
        recentActivity
      ] = await Promise.all([
        analyticsService.getDashboardOverview(timeframe),
        analyticsService.getRevenueTrends(12),
        analyticsService.getTopCampers(10, timeframe),
        analyticsService.getCustomerSegments(),
        analyticsService.getRecentActivity(7, 15)
      ]);

      const response = {
        success: true,
        data: {
          dashboard: {
            kpis: {
              totalBookings: dashboardStats.totalBookings,
              totalRevenue: dashboardStats.totalRevenue,
              totalCustomers: dashboardStats.totalCustomers,
              avgBookingValue: dashboardStats.avgBookingValue,
              uniqueCustomers: dashboardStats.totalCustomers,
              bookingGrowth: 0, // Placeholder für Growth Berechnung
              revenueGrowth: 0  // Placeholder für Growth Berechnung
            }
          },
          trends: {
            revenue: revenueTrends
          },
          performance: {
            topCampers: topCampers
          },
          customers: customerSegments,
          activity: recentActivity,
          metadata: {
            generated_at: new Date().toISOString(),
            timeframe: timeframe
          }
        }
      };

      console.log('✅ Dashboard analytics loaded successfully');
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Error loading dashboard analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Fehler beim Laden der Dashboard-Statistiken',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
