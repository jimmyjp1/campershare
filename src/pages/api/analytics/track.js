// Analytics API - Event Tracking
// POST /api/analytics/track - Events tracken für Analyse

const { analyticsService } = require('../../../services/analyticsService');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        eventType,
        eventData = {},
        userId = null,
        camperVanId = null,
        sessionId = null
      } = req.body;

      // Validierung
      if (!eventType) {
        return res.status(400).json({
          success: false,
          error: 'EventType ist erforderlich'
        });
      }

      // IP-Adresse extrahieren
      const ipAddress = req.headers['x-forwarded-for'] || 
                       req.headers['x-real-ip'] || 
                       req.connection.remoteAddress || 
                       req.socket.remoteAddress ||
                       (req.connection.socket ? req.connection.socket.remoteAddress : null);

      const userAgent = req.headers['user-agent'];

      // Event tracken
      const eventId = await analyticsService.trackEvent(
        eventType,
        eventData,
        userId,
        camperVanId,
        sessionId,
        ipAddress,
        userAgent
      );

      console.log(`📊 Event tracked: ${eventType}`, { eventId, userId, camperVanId });

      res.status(201).json({
        success: true,
        data: {
          eventId: eventId,
          eventType: eventType,
          tracked_at: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Error tracking event:', error);
      res.status(500).json({
        success: false,
        error: 'Fehler beim Tracken des Events',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
