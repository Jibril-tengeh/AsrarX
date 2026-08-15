import { AFRICA_CITIES } from './cities/africa';
import { ASIA_CITIES } from './cities/asia';
import { EUROPE_CITIES } from './cities/europe';
import { AMERICAS_CITIES } from './cities/americas';
import { OCEANIA_CITIES } from './cities/oceania';

export interface WorldCity {
  id: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicName: string;
  countryFr: string;
  countryEn: string;
  continent: 'africa' | 'asia' | 'europe' | 'americas' | 'oceania';
  flag: string;
  lat: number;
  lng: number;
  abjadVal?: number;
}

export const CONTINENTS = [
  { id: 'all', nameFr: 'Tous les Continents (195 Pays)', nameEn: 'All Continents (195 Countries)', nameHa: 'Dukkan Nahiyoyi (Kasashe 195)', icon: '🌍' },
  { id: 'africa', nameFr: 'Afrique (54 Pays)', nameEn: 'Africa (54 Countries)', nameHa: 'Afirka (Kasashe 54)', icon: '🌍' },
  { id: 'asia', nameFr: 'Asie & Moyen-Orient (48 Pays)', nameEn: 'Asia & Middle East (48 Countries)', nameHa: 'Asiya da Gabas Ta Tsakiya', icon: '🕌' },
  { id: 'europe', nameFr: 'Europe (44 Pays)', nameEn: 'Europe (44 Countries)', nameHa: 'Turai (Kasashe 44)', icon: '🏰' },
  { id: 'americas', nameFr: 'Amériques (35 Pays)', nameEn: 'Americas (35 Countries)', nameHa: 'Amirka (Kasashe 35)', icon: '🗽' },
  { id: 'oceania', nameFr: 'Océanie (14 Pays)', nameEn: 'Oceania (14 Countries)', nameHa: 'Oshiniya (Kasashe 14)', icon: '🌊' }
] as const;

// Combined world cities covering all 195 UN-recognized sovereign countries + special territories
export const WORLD_CITIES: WorldCity[] = [
  ...AFRICA_CITIES,
  ...ASIA_CITIES,
  ...EUROPE_CITIES,
  ...AMERICAS_CITIES,
  ...OCEANIA_CITIES
];

// Helper functions for easy filtering and lookup
export function getCitiesByContinent(continent: string): WorldCity[] {
  if (continent === 'all') return WORLD_CITIES;
  return WORLD_CITIES.filter(c => c.continent === continent);
}

export function getCitiesByCountry(countryFrOrEn: string): WorldCity[] {
  const query = countryFrOrEn.toLowerCase();
  return WORLD_CITIES.filter(
    c => c.countryFr.toLowerCase() === query || c.countryEn.toLowerCase() === query
  );
}

export function searchWorldCities(query: string): WorldCity[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return WORLD_CITIES;
  return WORLD_CITIES.filter(city => 
    city.nameFr.toLowerCase().includes(cleanQuery) ||
    city.nameEn.toLowerCase().includes(cleanQuery) ||
    city.nameHa.toLowerCase().includes(cleanQuery) ||
    city.arabicName.includes(cleanQuery) ||
    city.countryFr.toLowerCase().includes(cleanQuery) ||
    city.countryEn.toLowerCase().includes(cleanQuery)
  );
}

export const TOTAL_COUNTRIES_COUNT = 195;
export const TOTAL_CITIES_COUNT = WORLD_CITIES.length;
