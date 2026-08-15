import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, Globe, Navigation, X, Check, RotateCw } from 'lucide-react';
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
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Nominatim OpenStreetMap Live Geocoding Search State
  const [nominatimQuery, setNominatimQuery] = useState<string>('');
  const [nominatimResults, setNominatimResults] = useState<any[]>([]);
  const [isSearchingNominatim, setIsSearchingNominatim] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract available countries based on continent
  const availableCountries = useMemo(() => {
    let cities = WORLD_CITIES;
    if (selectedContinent !== 'all') {
      cities = cities.filter((c) => c.continent === selectedContinent);
    }
    const countries = Array.from(
      new Set(cities.map((c) => (language === 'en' ? c.countryEn : c.countryFr)))
    ).sort((a, b) => a.localeCompare(b, language === 'en' ? 'en' : 'fr'));
    return countries;
  }, [selectedContinent, language]);

  // If selectedCountry is not available in the new continent, reset it to 'all'
  useEffect(() => {
    if (selectedCountry !== 'all' && !availableCountries.includes(selectedCountry)) {
      setSelectedCountry('all');
    }
  }, [availableCountries, selectedCountry]);

  // Filtered Cities List for Select Dropdown
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
      return true;
    }).sort((a, b) => {
      const nameA = language === 'en' ? a.nameEn : language === 'ha' ? a.nameHa : a.nameFr;
      const nameB = language === 'en' ? b.nameEn : language === 'ha' ? b.nameHa : b.nameFr;
      return nameA.localeCompare(nameB);
    });
  }, [selectedContinent, selectedCountry, language]);

  // Real-time Instant Search matching across all or filtered cities
  const searchSuggestions = useMemo(() => {
    if (!citySearch.trim()) return [];
    const q = citySearch.trim().toLowerCase();

    // First check inside the current continent/country filter
    let pool = WORLD_CITIES;
    if (selectedContinent !== 'all') {
      pool = pool.filter((c) => c.continent === selectedContinent);
    }
    if (selectedCountry !== 'all') {
      pool = pool.filter((c) => (language === 'en' ? c.countryEn : c.countryFr) === selectedCountry);
    }

    let results = pool.filter((city) => {
      const matchFr = city.nameFr.toLowerCase().includes(q);
      const matchEn = city.nameEn.toLowerCase().includes(q);
      const matchHa = city.nameHa.toLowerCase().includes(q);
      const matchAr = city.arabicName.includes(q);
      const matchCFr = city.countryFr.toLowerCase().includes(q);
      const matchCEn = city.countryEn.toLowerCase().includes(q);
      return matchFr || matchEn || matchHa || matchAr || matchCFr || matchCEn;
    });

    // If no results in subset, search across ALL cities worldwide
    if (results.length === 0 && (selectedContinent !== 'all' || selectedCountry !== 'all')) {
      results = WORLD_CITIES.filter((city) => {
        const matchFr = city.nameFr.toLowerCase().includes(q);
        const matchEn = city.nameEn.toLowerCase().includes(q);
        const matchHa = city.nameHa.toLowerCase().includes(q);
        const matchAr = city.arabicName.includes(q);
        const matchCFr = city.countryFr.toLowerCase().includes(q);
        const matchCEn = city.countryEn.toLowerCase().includes(q);
        return matchFr || matchEn || matchHa || matchAr || matchCFr || matchCEn;
      });
    }

    return results.slice(0, 10);
  }, [citySearch, selectedContinent, selectedCountry, language]);

  // Find currently selected city ID if matched
  const currentCityId = useMemo(() => {
    const found = WORLD_CITIES.find(
      (c) =>
        (c.nameFr.toLowerCase() === cityName.toLowerCase() ||
          c.nameEn.toLowerCase() === cityName.toLowerCase() ||
          c.arabicName === cityName) &&
        Math.abs(c.lat - lat) < 0.01 &&
        Math.abs(c.lng - lng) < 0.01
    );
    return found ? found.id : '';
  }, [cityName, lat, lng]);

  // Handle City Select
  const handleSelectCity = (city: WorldCity) => {
    const name = language === 'en' ? city.nameEn : language === 'ha' ? city.nameHa : city.nameFr;
    setCityName(name);
    setLat(city.lat);
    setLng(city.lng);
    setSelectedContinent(city.continent);
    const country = language === 'en' ? city.countryEn : city.countryFr;
    setSelectedCountry(country);
    setCitySearch('');
    setIsSearchFocused(false);
  };

  // Perform OpenStreetMap Nominatim Live Search
  const handleSearchNominatim = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || nominatimQuery;
    if (!query.trim()) return;

    setIsSearchingNominatim(true);
    setSearchError('');
    setNominatimResults([]);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
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
    const simpleName = displayParts[0] || nominatimQuery || citySearch;
    setCityName(simpleName);
    setLat(parseFloat(parseFloat(item.lat).toFixed(4)));
    setLng(parseFloat(parseFloat(item.lon).toFixed(4)));
    setNominatimResults([]);
    setNominatimQuery('');
    setCitySearch('');
    setIsSearchFocused(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-5">
      {/* Current Selection Header & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-gray-100 dark:border-gray-700 pb-3 sm:pb-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs sm:text-base min-w-0">
          <MapPin size={18} className="text-amber-500 shrink-0" />
          <span className="truncate">
            {cityName} <span className="font-mono text-[11px] sm:text-xs text-gray-500 font-normal">({lat}° N, {lng}° E)</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenMap}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Globe size={15} className="shrink-0" />
            <span className="truncate">
              {language === 'en'
                ? 'Interactive World Map'
                : language === 'ha'
                ? 'Taswirar Duniya'
                : 'Carte Mondiale'}
            </span>
          </button>

          <button
            onClick={onUseMyLocation}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Navigation size={14} className="shrink-0" />
            <span className="truncate">
              {language === 'en' ? 'My GPS' : language === 'ha' ? 'Wurina (GPS)' : 'Ma Position'}
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
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
            {language === 'en' ? '2. Choose Country:' : language === 'ha' ? '2. Zabi Kasa:' : '2. Choisir le Pays:'} ({availableCountries.length})
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="all">
              {language === 'en'
                ? `All Countries (${availableCountries.length})`
                : language === 'ha'
                ? `Dukkan Kasashe (${availableCountries.length})`
                : `Tous les Pays (${availableCountries.length})`}
            </option>
            {availableCountries.map((country, idx) => (
              <option key={idx} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Preset City Search Input with Instant Interactive Autocomplete Dropdown */}
        <div className="relative" ref={searchContainerRef}>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-bold text-gray-700 dark:text-gray-300">
              {language === 'en' ? 'Search City:' : language === 'ha' ? 'Bincika Birni:' : 'Rechercher une ville:'}
            </label>
            {citySearch && (
              <button
                onClick={() => setCitySearch('')}
                className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-0.5 cursor-pointer"
              >
                <X size={12} />
                <span>{language === 'en' ? 'Clear' : 'Effacer'}</span>
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={
                language === 'en'
                  ? 'Type Toronto, Paris, Kano, Makkah...'
                  : language === 'ha'
                  ? 'Shigar da sunan birni...'
                  : 'Tapez Toronto, Paris, Dakar, Montréal...'
              }
              className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-gray-400" />
            {citySearch && (
              <button
                onClick={() => setCitySearch('')}
                className="absolute right-2.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Instant Autocomplete Suggestions Popover */}
          {isSearchFocused && citySearch.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-gray-900 rounded-2xl border border-amber-300 dark:border-amber-700 shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/40 text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>
                  {language === 'en' ? 'Matching Cities' : 'Villes trouvées'} ({searchSuggestions.length})
                </span>
                <span className="text-[10px] font-normal text-gray-500">
                  {language === 'en' ? 'Click to select' : 'Cliquez pour charger'}
                </span>
              </div>

              {searchSuggestions.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {searchSuggestions.map((c) => {
                    const name = language === 'en' ? c.nameEn : language === 'ha' ? c.nameHa : c.nameFr;
                    const country = language === 'en' ? c.countryEn : c.countryFr;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCity(c)}
                        className="w-full text-left px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950/50 flex items-center justify-between gap-2 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">{c.flag}</span>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white text-xs truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                              {name} <span className="font-normal text-gray-400 dir-rtl text-[11px]">({c.arabicName})</span>
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              {country} • {c.lat}° N, {c.lng}° E
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                          {language === 'en' ? 'Select' : 'Choisir'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    {language === 'en' ? 'No preset city matches' : 'Aucune ville pré-enregistrée ne correspond'} "{citySearch}".
                  </p>
                  <button
                    onClick={() => {
                      setNominatimQuery(citySearch);
                      handleSearchNominatim(undefined, citySearch);
                      setIsSearchFocused(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                  >
                    <Globe size={13} />
                    <span>
                      {language === 'en'
                        ? `Search "${citySearch}" on World Map`
                        : `Rechercher "${citySearch}" sur la Carte Mondiale`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preset City Dropdown */}
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en'
              ? '3. Select City from List:'
              : language === 'ha'
              ? '3. Zabi Birni daga Jeri:'
              : '3. Sélectionner la Ville:'} ({filteredCities.length})
          </label>
          <select
            value={currentCityId}
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
              ? 'Live World Geocoding Search (Search any commune, village or district worldwide):'
              : language === 'ha'
              ? 'Binciken Wuri a Kasashen Duniya (OpenStreetMap):'
              : "Recherche Mondiale en Direct (Chercher n'importe quelle commune ou village du monde):"}
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
