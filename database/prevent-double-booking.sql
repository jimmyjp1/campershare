-- Doppelbuchungs-Prävention für Camper
-- Migration: Verhindert überlappende Buchungen für denselben Camper

-- 1. Erstelle einen Index für bessere Performance bei Datumsabfragen
CREATE INDEX IF NOT EXISTS idx_bookings_camper_dates 
ON bookings (camper_van_id, start_date, end_date) 
WHERE status IN ('confirmed', 'pending');

-- 2. Erstelle eine Funktion zur Überprüfung von Datumsüberschneidungen
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Prüfe nur bei bestätigten oder pendenten Buchungen
    IF NEW.status IN ('confirmed', 'pending') THEN
        -- Prüfe auf überlappende Buchungen für denselben Camper
        IF EXISTS (
            SELECT 1 FROM bookings 
            WHERE camper_van_id = NEW.camper_van_id 
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
            AND status IN ('confirmed', 'pending')
            AND (
                -- Neue Buchung startet während einer bestehenden Buchung
                (NEW.start_date >= start_date AND NEW.start_date < end_date)
                OR 
                -- Neue Buchung endet während einer bestehenden Buchung  
                (NEW.end_date > start_date AND NEW.end_date <= end_date)
                OR
                -- Neue Buchung umschließt eine bestehende Buchung
                (NEW.start_date <= start_date AND NEW.end_date >= end_date)
            )
        ) THEN
            RAISE EXCEPTION 'Camper ist bereits für den gewählten Zeitraum gebucht. Bitte wählen Sie andere Daten.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Erstelle Trigger für INSERT und UPDATE
DROP TRIGGER IF EXISTS trigger_prevent_booking_overlap ON bookings;
CREATE TRIGGER trigger_prevent_booking_overlap
    BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION check_booking_overlap();

-- 4. Erstelle eine Hilfsfunktion zur Verfügbarkeitsabfrage
CREATE OR REPLACE FUNCTION is_camper_available(
    p_camper_van_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_exclude_booking_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM bookings 
        WHERE camper_van_id = p_camper_van_id 
        AND id != COALESCE(p_exclude_booking_id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND status IN ('confirmed', 'pending')
        AND (
            (p_start_date >= start_date AND p_start_date < end_date)
            OR 
            (p_end_date > start_date AND p_end_date <= end_date)
            OR
            (p_start_date <= start_date AND p_end_date >= end_date)
        )
    );
END;
$$ LANGUAGE plpgsql;

-- 5. Erstelle View für verfügbare Camper in einem Zeitraum
CREATE OR REPLACE VIEW available_campers AS
SELECT 
    cv.*,
    CASE 
        WHEN cv.is_active = false THEN 'inactive'
        ELSE 'available'
    END as availability_status
FROM camper_vans cv
WHERE cv.is_active = true;

-- 6. Kommentare für bessere Dokumentation
COMMENT ON FUNCTION check_booking_overlap() IS 'Verhindert überlappende Buchungen für denselben Camper';
COMMENT ON FUNCTION is_camper_available(UUID, DATE, DATE, UUID) IS 'Prüft ob ein Camper für einen Zeitraum verfügbar ist';
COMMENT ON INDEX idx_bookings_camper_dates IS 'Index für bessere Performance bei Verfügbarkeitsabfragen';
COMMENT ON TRIGGER trigger_prevent_booking_overlap ON bookings IS 'Trigger zur Verhinderung von Doppelbuchungen';
