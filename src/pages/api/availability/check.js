const { availabilityService } = require('../../../services/camperAvailabilityService');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { camperId, startDate, endDate } = req.body;

      if (!camperId || !startDate || !endDate) {
        return res.status(400).json({ 
          error: 'Camper-ID, Start- und Enddatum sind erforderlich' 
        });
      }

      console.log(`🔍 API: Prüfe Verfügbarkeit für Camper ${camperId} von ${startDate} bis ${endDate}`);

      // Verfügbarkeit prüfen
      const isAvailable = await availabilityService.checkCamperAvailability(
        camperId, 
        startDate, 
        endDate
      );

      let response = {
        available: isAvailable,
        camperId,
        startDate,
        endDate
      };

      // Falls nicht verfügbar, zusätzliche Informationen liefern
      if (!isAvailable) {
        const [conflicts, suggestions] = await Promise.all([
          availabilityService.getOverlappingBookings(camperId, startDate, endDate),
          availabilityService.getNextAvailableDates(camperId, startDate, 
            Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
        ]);

        response.conflicts = conflicts;
        response.suggestedDates = suggestions;
      }

      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Fehler bei Verfügbarkeitsprüfung:', error);
      res.status(500).json({ 
        error: 'Verfügbarkeitsprüfung fehlgeschlagen',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
