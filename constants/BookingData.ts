/**
 * Canonical booking destinations and medical services (Caafimaad).
 * UI labels come from translations; these values are stable for Firestore.
 */

export const LOCATIONS_BY_COUNTRY: Record<string, readonly string[]> = {
  Ethiopia: ['Addis Ababa', 'Jigjiga', 'Dire Dawa', 'Harer'],
  India: ['Hyderabad', 'New Delhi', 'Mumbai'],
  Egypt: ['Cairo', 'Alexandria'],
};

/** Maps LOCATIONS_BY_COUNTRY keys to `caafimaad.location.countries.*` JSON keys */
export const COUNTRY_TRANSLATION_SLUG: Record<string, string> = {
  Ethiopia: 'ethiopia',
  India: 'india',
  Egypt: 'egypt',
};

/** Maps city label → `caafimaad.location.cities.*` JSON keys */
export const CITY_TRANSLATION_SLUG: Record<string, string> = {
  'Addis Ababa': 'addisAbaba',
  Jigjiga: 'jigjiga',
  'Dire Dawa': 'direDawa',
  Harer: 'harer',
  Hyderabad: 'hyderabad',
  'New Delhi': 'newDelhi',
  Mumbai: 'mumbai',
  Cairo: 'cairo',
  Alexandria: 'alexandria',
};

/** Spacing: back control sits above the progress strip (see medical flow screens). */
export const MEDICAL_FLOW_BACK_TOP = 12;
export const MEDICAL_FLOW_PROGRESS_MARGIN_TOP = 96;

/** English reference list (same order as MEDICAL_SERVICE_KEYS) */
export const MEDICAL_SERVICES: readonly string[] = [
  'Hotel Booking',
  'Hospital Booking',
  'Translator',
  'Airport Taxi',
  'Flight Ticket',
];

export const MEDICAL_SERVICE_KEYS = [
  'hotelBooking',
  'hospitalBooking',
  'translator',
  'airportTaxi',
  'flightTicket',
] as const;

export type MedicalServiceKey = (typeof MEDICAL_SERVICE_KEYS)[number];
