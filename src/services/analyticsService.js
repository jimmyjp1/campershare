const { query } = require('../lib/databaseConnection');

class AnalyticsService {
  /**
   * Dashboard Overview
   */
  async getDashboardOverview(timeframe = '30days') {
    try {
      // Konvertiere timeframe zu Tagen
      const days = this.timeframeToDays(timeframe);
      
      // KPI Queries mit Zeitraum-Filter
      const [revenue, bookings, customers, avgBooking] = await Promise.all([
        this.getTotalRevenue(days),
        this.getTotalBookings(days), 
        this.getTotalCustomers(days),
        this.getAverageBookingValue(days)
      ]);

      return {
        totalRevenue: revenue,
        totalBookings: bookings,
        totalCustomers: customers,
        avgBookingValue: avgBooking
      };
    } catch (error) {
      console.error('❌ Error getting dashboard overview:', error);
      throw error;
    }
  }

  /**
   * Konvertiert Timeframe String zu Anzahl Tagen
   */
  timeframeToDays(timeframe) {
    switch(timeframe) {
      case '7days': return 7;
      case '30days': return 30;
      case '90days': return 90;
      case '1year': return 365;
      default: return 30;
    }
  }

  /**
   * Total Revenue
   */
  async getTotalRevenue(days = null) {
    try {
      let whereClause = "WHERE status = 'completed'";
      if (days) {
        whereClause += ` AND start_date >= CURRENT_DATE - INTERVAL '${days} days'`;
      }
      
      const result = await query(`
        SELECT COALESCE(SUM(total_amount), 0) as total_revenue
        FROM bookings 
        ${whereClause}
      `);
      return parseFloat(result.rows[0].total_revenue);
    } catch (error) {
      console.error('❌ Error getting total revenue:', error);
      throw error;
    }
  }

  /**
   * Total Bookings
   */
  async getTotalBookings(days = null) {
    try {
      let whereClause = "WHERE status = 'completed'";
      if (days) {
        whereClause += ` AND start_date >= CURRENT_DATE - INTERVAL '${days} days'`;
      }
      
      const result = await query(`
        SELECT COUNT(*) as total_bookings
        FROM bookings 
        ${whereClause}
      `);
      return parseInt(result.rows[0].total_bookings);
    } catch (error) {
      console.error('❌ Error getting total bookings:', error);
      throw error;
    }
  }

  /**
   * Total Customers
   */
  async getTotalCustomers(days = null) {
    try {
      let whereClause = "WHERE status = 'completed'";
      if (days) {
        whereClause += ` AND start_date >= CURRENT_DATE - INTERVAL '${days} days'`;
      }
      
      const result = await query(`
        SELECT COUNT(DISTINCT user_id) as total_customers
        FROM bookings 
        ${whereClause}
      `);
      return parseInt(result.rows[0].total_customers);
    } catch (error) {
      console.error('❌ Error getting total customers:', error);
      throw error;
    }
  }

  /**
   * Average Booking Value
   */
  async getAverageBookingValue(days = null) {
    try {
      let whereClause = "WHERE status = 'completed'";
      if (days) {
        whereClause += ` AND start_date >= CURRENT_DATE - INTERVAL '${days} days'`;
      }
      
      const result = await query(`
        SELECT COALESCE(AVG(total_amount), 0) as avg_booking
        FROM bookings 
        ${whereClause}
      `);
      return parseFloat(result.rows[0].avg_booking);
    } catch (error) {
      console.error('❌ Error getting average booking value:', error);
      throw error;
    }
  }

  /**
   * Revenue Trends
   */
  async getRevenueTrends(months = 12) {
    try {
      const result = await query(`
        SELECT * FROM revenue_trends 
        WHERE month >= CURRENT_DATE - INTERVAL '${months} months'
        ORDER BY month
      `);

      return result.rows.map(row => ({
        month: row.month,
        bookings: parseInt(row.bookings),
        revenue: parseFloat(row.revenue),
        avgBookingValue: parseFloat(row.avg_booking_value)
      }));
    } catch (error) {
      console.error('❌ Error getting revenue trends:', error);
      throw error;
    }
  }

  /**
   * Top performing Campers
   */
  async getTopCampers(limit = 10, timeframe = null) {
    try {
      let days = null;
      if (timeframe) {
        days = this.timeframeToDays(timeframe);
      }
      
      let whereClause = "WHERE b.status = 'completed'";
      if (days) {
        whereClause += ` AND b.start_date >= CURRENT_DATE - INTERVAL '${days} days'`;
      }
      
      const result = await query(`
        SELECT 
          cv.name,
          COUNT(b.id) as total_bookings,
          COALESCE(SUM(b.total_amount), 0) as total_revenue,
          COALESCE(AVG(b.total_amount), 0) as avg_revenue
        FROM camper_vans cv
        LEFT JOIN bookings b ON cv.id = b.camper_van_id 
          AND b.status = 'completed'
          ${days ? `AND b.start_date >= CURRENT_DATE - INTERVAL '${days} days'` : ''}
        GROUP BY cv.id, cv.name
        HAVING COUNT(b.id) > 0
        ORDER BY total_revenue DESC 
        LIMIT $1
      `, [limit]);

      return result.rows.map(row => ({
        name: row.name,
        totalBookings: parseInt(row.total_bookings),
        totalRevenue: parseFloat(row.total_revenue),
        avgRevenue: parseFloat(row.avg_revenue)
      }));
    } catch (error) {
      console.error('❌ Error getting top campers:', error);
      throw error;
    }
  }

  /**
   * Customer Segmentation
   */
  async getCustomerSegments() {
    try {
      const result = await query(`
        SELECT 
          segment as customer_segment,
          customer_count,
          avg_value as avg_spent,
          (customer_count * avg_value) as segment_revenue
        FROM customer_segments
        ORDER BY segment_revenue DESC
      `);

      return result.rows.map(row => ({
        segment: row.customer_segment,
        customerCount: parseInt(row.customer_count),
        avgSpent: parseFloat(row.avg_spent),
        segmentRevenue: parseFloat(row.segment_revenue)
      }));
    } catch (error) {
      console.error('❌ Error getting customer segments:', error);
      throw error;
    }
  }

  /**
   * Monthly Statistics
   */
  async getMonthlyStats(months = 12) {
    try {
      const result = await query(`
        SELECT * FROM monthly_stats 
        WHERE month >= CURRENT_DATE - INTERVAL '${months} months'
        ORDER BY month DESC
      `);

      return result.rows.map(row => ({
        month: row.month,
        bookings: parseInt(row.bookings),
        revenue: parseFloat(row.revenue),
        uniqueCustomers: parseInt(row.unique_customers)
      }));
    } catch (error) {
      console.error('❌ Error getting monthly stats:', error);
      throw error;
    }
  }

  /**
   * Camper Occupancy
   */
  async getCamperOccupancy() {
    try {
      const result = await query(`
        SELECT * FROM camper_occupancy 
        ORDER BY total_bookings DESC
      `);

      return result.rows.map(row => ({
        name: row.name,
        totalBookings: parseInt(row.total_bookings),
        occupancyRate: parseFloat(row.occupancy_rate)
      }));
    } catch (error) {
      console.error('❌ Error getting camper occupancy:', error);
      throw error;
    }
  }

  /**
   * Daily Statistics
   */
  async getDailyStats(days = 30) {
    try {
      const result = await query(`
        SELECT * FROM daily_stats 
        WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY date DESC
      `);

      return result.rows.map(row => ({
        date: row.date,
        bookings: parseInt(row.bookings),
        revenue: parseFloat(row.revenue)
      }));
    } catch (error) {
      console.error('❌ Error getting daily stats:', error);
      throw error;
    }
  }

  /**
   * Year-over-Year Comparison
   */
  async getYearComparison() {
    try {
      const result = await query(`
        SELECT 
          EXTRACT(YEAR FROM start_date) as year,
          COUNT(*) as bookings,
          ROUND(SUM(total_amount), 2) as revenue,
          ROUND(AVG(total_amount), 2) as avg_value
        FROM bookings 
        WHERE status = 'completed'
        GROUP BY EXTRACT(YEAR FROM start_date)
        ORDER BY year DESC
      `);

      return result.rows.map(row => ({
        year: parseInt(row.year),
        bookings: parseInt(row.bookings),
        revenue: parseFloat(row.revenue),
        avgValue: parseFloat(row.avg_value)
      }));
    } catch (error) {
      console.error('❌ Error getting year comparison:', error);
      throw error;
    }
  }

  /**
   * Recent Activity - Neueste Buchungen
   */
  async getRecentActivity(days = 7, limit = 15) {
    try {
      // Da unsere generierten Daten alle gleichzeitig erstellt wurden,
      // verwenden wir start_date für realistischere "Recent Activity"
      const result = await query(`
        SELECT 
          b.id,
          b.booking_number,
          b.total_amount,
          b.start_date,
          b.end_date,
          b.created_at,
          b.status,
          u.first_name,
          u.last_name,
          u.email,
          cv.name as camper_name,
          cv.location as camper_location
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN camper_vans cv ON b.camper_van_id = cv.id
        WHERE b.start_date >= CURRENT_DATE - INTERVAL '${days + 30} days'
          AND b.start_date <= CURRENT_DATE + INTERVAL '${days} days'
          AND b.status IN ('completed', 'confirmed')
        ORDER BY b.start_date DESC, b.created_at DESC
        LIMIT $1
      `, [limit]);

      return result.rows.map(row => ({
        id: row.id,
        bookingNumber: row.booking_number,
        customerName: `${row.first_name} ${row.last_name}`,
        customerEmail: row.email,
        camperName: row.camper_name,
        camperLocation: row.camper_location,
        amount: parseFloat(row.total_amount),
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: row.created_at,
        status: row.status,
        timeAgo: this.getTimeAgoFromStartDate(row.start_date)
      }));
    } catch (error) {
      console.error('❌ Error getting recent activity:', error);
      throw error;
    }
  }

  /**
   * Hilfsfunktion für "vor X Zeit" basierend auf start_date
   */
  getTimeAgoFromStartDate(startDate) {
    const now = new Date();
    const start = new Date(startDate);
    const diffInMs = now - start;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      return `vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`;
    } else if (diffInDays === 0) {
      return 'heute';
    } else {
      const futureDays = Math.abs(diffInDays);
      return `in ${futureDays} Tag${futureDays > 1 ? 'en' : ''}`;
    }
  }
}

module.exports = new AnalyticsService();
