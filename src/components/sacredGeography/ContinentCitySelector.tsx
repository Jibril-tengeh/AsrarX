import React, { useState, useMemo } from 'react';
import { Search, MapPin, Globe, Compass, Navigation, Crosshair, Check, RotateCw } from 'lucide-react';
import { WORLD_CITIES, CONTINENTS, WorldCity } from '../../data/worldCities';

interface ContinentCitySelectorProps {
  language: string;
  cityName: string;
  setCityName: (name: string) => void;
  lat: number;
  setLat: (lat: number) => void;
  lng: number;
  setLng: (lng: number) => void;
  onUseMyLocation: () => void;
  onOpenMap: () => void;
}

export default function ContinentCitySelector({
  language,
  cityName,
  setCityName,
  lat,
  setLat,
  lng,
  setLng,
  onUseMyLocation,
  onOpenMap,
}: ContinentCitySelectorProps) {
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [citySearch, setCitySearch] = useState<string>('');

  // Nominatim OpenStreetMap Live Geocoding Search State
  const [nominatimQuery, setNominatimQuery] = useState<string>('');
  const [nominatimResults, setNominatimResults] = useState<any[]>([]);
  const [isSearchingNominatim, setIsSearchingNominatim] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');

  // Extract available countries based on continent
  const availableCountries = useMemo(() => {
    let cities = WORLD_CITIES;
    if (selectedContinent !== 'all') {
      cities = cities.filter((c) => c.continent === selectedContinent);
    }
    const countries = Array.from(
      new Set(cities.map((c) => (language === 'en' ? c.countryEn : c.countryFr)))
    ).sort();
    return countries;
  }, [selectedContinent, language]);

  // Filtered Cities List
  const filteredCities = useMemo(() => {
    return WORLD_CITIES.filter((city) => {
      // Continent match
      if (selectedContinent !== 'all' && city.continent !== selectedContinent) {
        return false;
      }
      // Country match
      if (selectedCountry !== 'all') {
        const cCountry = language === 'en' ? city.countryEn : city.countryFr;
        if (cCountry !== selectedCountry) return false;
      }
      // Text Search
      if (citySearch.trim()) {
        const q = citySearch.toLowerCase();
        const matchFr = city.nameFr.toLowerCase().includes(q);
        const matchEn = city.nameEn.toLowerCase().includes(q);
        const matchHa = city.nameHa.toLowerCase().includes(q);
        const matchAr = city.arabicName.includes(q);
        const matchCFr = city.countryFr.toLowerCase().includes(q);
        const matchCEn = city.countryEn.toLowerCase().includes(q);
        return matchFr || matchEn || matchHa || matchAr || matchCFr || matchCEn;
      }
      return true;
    });
  }, [selectedContinent, selectedCountry, citySearch, language]);

  // Handle City Select
  const handleSelectCity = (city: WorldCity) => {
    const name = language === 'en' ? city.nameEn : language === 'ha' ? city.nameHa : city.nameFr;
    setCityName(name);
    setLat(city.lat);
    setLng(city.lng);
  };

  // Perform OpenStreetMap Nominatim Live Search
  const handleSearchNominatim = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nominatimQuery.trim()) return;

    setIsSearchingNominatim(true);
    setSearchError('');
    setNominatimResults([]);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        nominatimQuery
      )}&limit=6&accept-language=${language === 'ha' ? 'en' : language}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data && data.length > 0) {
        setNominatimResults(data);
      } else {
        setSearchError(
          language === 'en'
            ? 'No location found. Please try another search.'
            : language === 'ha'
            ? 'Babu wurin da aka samu.'
            : 'Aucun lieu trouvé. Veuillez essayer une autre recherche.'
        );
      }
    } catch (err) {
      setSearchError(
        language === 'en'
          ? 'Error searching location.'
          : language === 'ha'
          ? 'Kuskure yayin bincike.'
          : 'Erreur lors de la recherche du lieu.'
      );
    } finally {
      setIsSearchingNominatim(false);
    }
  };

  const handlePickNominatim = (item: any) => {
    const displayParts = item.display_name.split(',');
    const simpleName = displayParts[0] || nominatimQuery;
    setCityName(simpleName);
    setLat(parseFloat(parseFloat(item.lat).toFixed(4)));
    setLng(parseFloat(parseFloat(item.lon).toFixed(4)));
    setNominatimResults([]);
    setNominatimQuery('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-5">
      {/* Current Selection Header & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm sm:text-base">
          <MapPin size={20} className="text-amber-500 animate-bounce" />
          <span>
            {cityName} <span className="font-mono text-xs text-gray-500">({lat}° N, {lng}° E)</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenMap}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Globe size={16} />
            <span>
              {language === 'en'
                ? 'Interactive World Map'
                : language === 'ha'
                ? 'Taswirar Duniya'
                : 'Carte Mondiale Interactive'}
            </span>
          </button>

          <button
            onClick={onUseMyLocation}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Navigation size={14} />
            <span>
              {language === 'en' ? 'My Location (GPS)' : language === 'ha' ? 'Wurina (GPS)' : 'Ma Position (GPS)'}
            </span>
          </button>
        </div>
      </div>

      {/* 1. CONTINENT FILTER BADGES */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          {language === 'en'
            ? '1. Filter by Continent:'
            : language === 'ha'
            ? '1. Tace ta Nahiyoyi:'
            : '1. Classer / Filtrer par Continent:'}
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTINENTS.map((c) => {
            const isSelected = selectedContinent === c.id;
            const label = language === 'en' ? c.nameEn : language === 'ha' ? c.nameHa : c.nameFr;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedContinent(c.id);
                  setSelectedCountry('all');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-500/40'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{c.icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. COUNTRY & PRESET CITY SELECTOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Country Filter Dropdown */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? '2. Filter by Country:' : language === 'ha' ? '2. Tace ta Kasa:' : '2. Choisir le Pays:'}
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="all">
              {language === 'en'
                ? 'All Countries'
                : language === 'ha'
                ? 'Dukkan Kasashe'
                : 'Tous les Pays'}
            </option>
            {availableCountries.map((country, idx) => (
              <option key={idx} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Preset City Search Input */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Search Preset Cities:' : language === 'ha' ? 'Bincika Birni:' : 'Rechercher une ville:'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder={
                language === 'en' ? 'Type city name...' : language === 'ha' ? 'Shigar da birni...' : 'Dakar, Fès, Kano, Paris...'
              }
              className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-gray-400" />
          </div>
        </div>

        {/* Preset City Dropdown */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en'
              ? 'Select City from List:'
              : language === 'ha'
              ? 'Zabi Birni daga Jeri:'
              : 'Sélectionner la Ville:'} ({filteredCities.length})
          </label>
          <select
            onChange={(e) => {
              const found = WORLD_CITIES.find((c) => c.id === e.target.value);
              if (found) handleSelectCity(found);
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="">
              -- {language === 'en' ? 'Choose a city' : language === 'ha' ? 'Zabi birni' : 'Choisir une ville'} --
            </option>
            {filteredCities.map((c) => {
              const name = language === 'en' ? c.nameEn : language === 'ha' ? c.nameHa : c.nameFr;
              const country = language === 'en' ? c.countryEn : c.countryFr;
              return (
                <option key={c.id} value={c.id}>
                  {c.flag} {name} ({c.arabicName}) - {country}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* 3. WORLD LIVE SEARCH VIA OPENSTREETMAP NOMINATIM */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Globe size={14} className="text-amber-500" />
          <span>
            {language === 'en'
              ? 'Live World Geocoding Search (Search any city, village or place worldwide):'
              : language === 'ha'
              ? 'Binciken Wuri a Kasashen Duniya (OpenStreetMap):'
              : 'Recherche Mondiale en Direct (Chercher n\'importe quelle ville ou commune du monde):'}
          </span>
        </label>

        <form onSubmit={handleSearchNominatim} className="flex gap-2">
          <input
            type="text"
            value={nominatimQuery}
            onChange={(e) => setNominatimQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'e.g. Kankan, Agadez, Djerba, Medellin, Kyoto...'
                : language === 'ha'
                ? 'Kamar: Kankan, Agadez, Djerba, Medellin...'
                : 'Ex: Kankan, Agadez, Djerba, Medellín, Kyoto...'
            }
            className="flex-1 px-3.5 py-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <button
            type="submit"
            disabled={isSearchingNominatim}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSearchingNominatim ? <RotateCw size={14} className="animate-spin" /> : <Search size={14} />}
            <span>
              {language === 'en' ? 'Search' : language === 'ha' ? 'Bincika' : 'Trouver sur Carte'}
            </span>
          </button>
        </form>

        {/* Search Results Dropdown */}
        {nominatimResults.length > 0 && (
          <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-amber-300 dark:border-amber-700 shadow-xl space-y-2">
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              {language === 'en'
                ? 'Select matching location:'
                : language === 'ha'
                ? 'Zabi sakamakon da ya dace:'
                : 'Sélectionner le lieu correspondant:'}
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {nominatimResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickNominatim(item)}
                  className="w-full text-left p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/50 text-xs font-medium text-gray-800 dark:text-gray-200 flex items-start gap-2 transition-all cursor-pointer border border-transparent hover:border-amber-200"
                >
                  <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{item.display_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {searchError && <p className="text-xs text-red-500 font-medium">{searchError}</p>}
      </div>

      {/* Manual Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'City Name (Manual):' : language === 'ha' ? 'Sunan Birni:' : 'Nom de la Ville (Manuel):'}
          </label>
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Latitude (°N):' : language === 'ha' ? 'Arewaci (°N):' : 'Latitude (°N):'}
          </label>
          <input
            type="number"
            step="0.0001"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-center focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Longitude (°E):' : language === 'ha' ? 'Gabasci (°E):' : 'Longitude (°E):'}
          </label>
          <input
            type="number"
            step="0.0001"
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-center focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
