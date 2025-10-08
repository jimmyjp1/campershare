const { availabilityService } = require('../../../services/camperAvailabilityService');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { startDate, endDate, location } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ 
          error: 'Start- und Enddatum sind erforderlich' 
        });
      }

      console.log(`🔍 API: Suche verfügbare Camper von ${startDate} bis ${endDate}${location ? ` in ${location}` : ''}`);

      // Verfügbare Camper suchen
      const availableCampers = await availabilityService.findAvailableCampers(
        startDate, 
        endDate, 
        location
      );

      res.status(200).json({
        success: true,
        availableCampers,
        searchCriteria: {
          startDate,
          endDate,
          location: location || null
        },
        totalFound: availableCampers.length
      });

    } catch (error) {
      console.error('❌ Fehler bei der Suche nach verfügbaren Campern:', error);
      res.status(500).json({ 
        error: 'Suche fehlgeschlagen',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
