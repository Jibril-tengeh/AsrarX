import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import {
  Map as MapIcon,
  X,
  Crosshair,
  Search,
  Layers,
  Compass,
  Navigation,
  Sparkles,
  MapPin,
  Check,
  RotateCw,
  Globe2,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';

// Coordinate DMS helper
function toDMS(deg: number, isLat: boolean) {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.round((minutesNotTruncated - minutes) * 60);
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return `${degrees}° ${minutes}' ${seconds}" ${dir}`;
}

// Great circle distance & azimuth to Kaaba (Makkah)
const MAKKAH_LAT = 21.4225;
const MAKKAH_LNG = 39.8262;

function getGeodesicToMakkah(lat: number, lng: number) {
  const R = 6371; // km
  const dLat = ((MAKKAH_LAT - lat) * Math.PI) / 180;
  const dLon = ((MAKKAH_LNG - lng) * Math.PI) / 180;
  const radLat1 = (lat * Math.PI) / 180;
  const radLat2 = (MAKKAH_LAT * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const y = Math.sin(dLon) * Math.cos(radLat2);
  const x =
    Math.cos(radLat1) * Math.sin(radLat2) -
    Math.sin(radLat1) * Math.cos(radLat2) * Math.cos(dLon);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360;

  return { distanceKm, azimuthDeg: brng };
}

// Major Sacred Sanctuaries
const SACRED_SANCTUARIES = [
  { id: 'makkah', nameFr: 'La Mecque (Al-Kaaba)', nameEn: 'Mecca (Kaaba)', nameHa: 'Makkah', lat: 21.4225, lng: 39.8262, icon: '🕋' },
  { id: 'madinah', nameFr: 'Médine (Al-Masjid an-Nabawi)', nameEn: 'Medina (Prophet Mosque)', nameHa: 'Madinah', lat: 24.4672, lng: 39.6111, icon: '🕌' },
  { id: 'quds', nameFr: 'Jérusalem (Al-Aqsa)', nameEn: 'Jerusalem (Al-Aqsa)', nameHa: 'Al-Quds', lat: 31.7780, lng: 35.2354, icon: '🕌' },
  { id: 'timbuktu', nameFr: 'Tombouctou (Sankoré)', nameEn: 'Timbuktu (Sankore)', nameHa: 'Timbuktu', lat: 16.7666, lng: -3.0072, icon: '🏛️' },
  { id: 'djenne', nameFr: 'Djenné (Grande Mosquée)', nameEn: 'Djenne Great Mosque', nameHa: 'Djenne', lat: 13.9061, lng: -4.5533, icon: '🏛️' },
  { id: 'touba', nameFr: 'Touba (Grande Mosquée)', nameEn: 'Touba Great Mosque', nameHa: 'Touba', lat: 14.8667, lng: -15.8833, icon: '🕌' },
  { id: 'fez', nameFr: 'Fès (Al-Qarawiyyin)', nameEn: 'Fez (Al-Qarawiyyin)', nameHa: 'Fas', lat: 34.0333, lng: -5.0000, icon: '🏛️' },
  { id: 'kairouan', nameFr: 'Kairouan (Mosquée Uqba)', nameEn: 'Kairouan (Mosque of Uqba)', nameHa: 'Kairouan', lat: 35.6781, lng: 10.0963, icon: '🕌' },
  { id: 'cairo', nameFr: 'Le Caire (Al-Azhar)', nameEn: 'Cairo (Al-Azhar)', nameHa: 'Al-Azhar', lat: 30.0444, lng: 31.2357, icon: '🏛️' },
  { id: 'najaf', nameFr: 'Najaf (Imam Ali)', nameEn: 'Najaf (Imam Ali)', nameHa: 'Najaf', lat: 32.0000, lng: 44.3333, icon: '🕌' },
  { id: 'istanbul', nameFr: 'Istanbul (Sultanahmet)', nameEn: 'Istanbul (Blue Mosque)', nameHa: 'Istanbul', lat: 41.0082, lng: 28.9784, icon: '🕌' }
];

export interface SacredMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  currentCityName: string;
  currentLat: number;
  currentLng: number;
  onConfirmLocation: (cityName: string, lat: number, lng: number) => void;
}

export default function SacredMapModal({
  isOpen,
  onClose,
  language,
  currentCityName,
  currentLat,
  currentLng,
  onConfirmLocation
}: SacredMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const qiblaLineRef = useRef<L.Polyline | null>(null);
  const sanctuaryMarkersRef = useRef<L.LayerGroup | null>(null);

  // Selected Pin State
  const [selectedLat, setSelectedLat] = useState<number>(currentLat || 14.7167);
  const [selectedLng, setSelectedLng] = useState<number>(currentLng || -17.4677);
  const [selectedCityName, setSelectedCityName] = useState<string>(currentCityName || 'Dakar');
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);

  // Search in Map State
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [mapSearchResults, setMapSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Map Layer Style
  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite' | 'dark' | 'topo'>('osm');
  const [showSanctuaries, setShowSanctuaries] = useState<boolean>(true);
  const [showQiblaRay, setShowQiblaRay] = useState<boolean>(true);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Synchronize initial coordinates when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedLat(currentLat);
      setSelectedLng(currentLng);
      setSelectedCityName(currentCityName);
    }
  }, [isOpen, currentLat, currentLng, currentCityName]);

  // Geodesy calculations
  const geodesy = useMemo(() => {
    return getGeodesicToMakkah(selectedLat, selectedLng);
  }, [selectedLat, selectedLng]);

  // Abjad value of detected city
  const cityAbjad = useMemo(() => {
    return calculateAbjadValue(selectedCityName) || 0;
  }, [selectedCityName]);

  // Reverse Geocoding Helper
  const performReverseGeocoding = async (lat: number, lon: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12&addressdetails=1`,
        { headers: { 'Accept-Language': language === 'en' ? 'en' : 'fr' } }
      );
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const detectedCity =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county ||
          address.state ||
          data.name ||
          'Emplacement Personnalisé';

        const detectedCountry = address.country || '';
        setSelectedCityName(detectedCity);
        setSelectedCountryName(detectedCountry);
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Search places via Nominatim
  const handleMapSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          mapSearchQuery.trim()
        )}&limit=7&addressdetails=1`,
        { headers: { 'Accept-Language': language === 'en' ? 'en' : 'fr' } }
      );
      if (res.ok) {
        const data = await res.json();
        setMapSearchResults(data);
      }
    } catch (err) {
      console.warn('Search geocoding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Selection from Search Results
  const handleSelectSearchResult = (item: any) => {
    const lat = parseFloat(parseFloat(item.lat).toFixed(4));
    const lng = parseFloat(parseFloat(item.lon).toFixed(4));
    const address = item.address || {};
    const name =
      address.city ||
      address.town ||
      address.village ||
      item.name ||
      item.display_name.split(',')[0];
    const country = address.country || '';

    setSelectedLat(lat);
    setSelectedLng(lng);
    setSelectedCityName(name);
    setSelectedCountryName(country);
    setShowSearchResults(false);
    setMapSearchQuery('');

    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 10, { duration: 1.2 });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  };

  // Quick Fly to Region / Sanctuary
  const flyToCoords = (lat: number, lng: number, zoom = 7, name?: string) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    if (name) setSelectedCityName(name);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
    performReverseGeocoding(lat, lng);
  };

  // Geolocation trigger
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          flyToCoords(lat, lng, 12);
        },
        (err) => console.log('Geolocation error:', err),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  // Switch Tile Layer
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (activeLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri & Maxar';
    } else if (activeLayer === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO';
    } else if (activeLayer === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenTopoMap';
    }

    tileLayerRef.current = L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(mapRef.current);
  }, [activeLayer]);

  // Update Qibla Ray Line
  useEffect(() => {
    if (!mapRef.current) return;

    if (qiblaLineRef.current) {
      mapRef.current.removeLayer(qiblaLineRef.current);
      qiblaLineRef.current = null;
    }

    if (showQiblaRay) {
      const latlngs: [number, number][] = [
        [selectedLat, selectedLng],
        [MAKKAH_LAT, MAKKAH_LNG]
      ];

      qiblaLineRef.current = L.polyline(latlngs, {
        color: '#f59e0b',
        weight: 3,
        dashArray: '8, 8',
        opacity: 0.85
      }).addTo(mapRef.current);
    }
  }, [selectedLat, selectedLng, showQiblaRay]);

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedLat, selectedLng],
        zoom: 6,
        zoomControl: true
      });

      // Custom User Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-sacred-pin',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
            <div class="absolute w-8 h-8 rounded-full bg-amber-500/30 animate-ping"></div>
            <div class="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 border-2 border-white dark:border-gray-900 shadow-2xl flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-amber-600 rotate-45"></div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const marker = L.marker([selectedLat, selectedLng], {
        icon: customIcon,
        draggable: true
      }).addTo(map);

      // Drag handler
      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        const lat = parseFloat(pos.lat.toFixed(4));
        const lng = parseFloat(pos.lng.toFixed(4));
        setSelectedLat(lat);
        setSelectedLng(lng);
        performReverseGeocoding(lat, lng);
      });

      // Map click handler
      map.on('click', (e) => {
        const lat = parseFloat(e.latlng.lat.toFixed(4));
        const lng = parseFloat(e.latlng.lng.toFixed(4));
        setSelectedLat(lat);
        setSelectedLng(lng);
        marker.setLatLng([lat, lng]);
        performReverseGeocoding(lat, lng);
      });

      mapRef.current = map;
      markerRef.current = marker;

      // Sanctuary layer group
      sanctuaryMarkersRef.current = L.layerGroup().addTo(map);
    } else {
      mapRef.current.setView([selectedLat, selectedLng]);
      if (markerRef.current) {
        markerRef.current.setLatLng([selectedLat, selectedLng]);
      }
    }

    // Refresh Sanctuary markers
    if (sanctuaryMarkersRef.current && mapRef.current) {
      sanctuaryMarkersRef.current.clearLayers();
      if (showSanctuaries) {
        SACRED_SANCTUARIES.forEach((s) => {
          const sIcon = L.divIcon({
            className: 'sanctuary-pin',
            html: `
              <div class="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-900/90 border border-amber-400 shadow-lg text-sm hover:scale-125 transition-transform cursor-pointer">
                <span>${s.icon}</span>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const m = L.marker([s.lat, s.lng], { icon: sIcon });
          const name = language === 'en' ? s.nameEn : s.nameFr;
          m.bindTooltip(`<strong>${name}</strong>`, { direction: 'top', className: 'sanctuary-tooltip' });
          m.on('click', () => {
            flyToCoords(s.lat, s.lng, 11, name);
          });
          sanctuaryMarkersRef.current?.addLayer(m);
        });
      }
    }

    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 250);
  }, [isOpen, showSanctuaries]);

  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[92vh] max-h-[850px]"
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/90 dark:bg-gray-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Globe2 size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{language === 'en' ? 'Interactive Sacred World Map' : language === 'ha' ? 'Taswirar Duniya Mai Tsarki' : 'Carte du Monde & Géographie Sacrée'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                  GPS & Qibla Live
                </span>
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {language === 'en'
                  ? 'Click anywhere or drag the pin to pinpoint any city or sanctuary with live astronomical alignment'
                  : 'Cliquez ou glissez le curseur pour explorer n’importe quelle ville ou sanctuaire avec alignement astronomique'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Map Workspace Body */}
        <div className="relative flex-1 w-full bg-slate-900 overflow-hidden">
          {/* Leaflet Map Canvas */}
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

          {/* Floating Search Bar Overlay */}
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-96 z-20 space-y-1">
            <form onSubmit={handleMapSearch} className="relative shadow-2xl">
              <input
                type="text"
                value={mapSearchQuery}
                onChange={(e) => setMapSearchQuery(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search any city, village, sanctuary...'
                    : 'Rechercher ville, village, sanctuaire...'
                }
                className="w-full pl-9 pr-20 py-2.5 text-xs font-medium rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <Search size={15} className="absolute left-3 top-3 text-gray-400" />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isSearching ? <RotateCw size={11} className="animate-spin" /> : <Search size={11} />}
                <span>{language === 'en' ? 'Search' : 'Chercher'}</span>
              </button>
            </form>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSearchResults && mapSearchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-60 overflow-y-auto"
                >
                  <div className="p-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-gray-400 font-bold px-3">
                    <span>{language === 'en' ? 'Search Results' : 'Résultats de recherche'}</span>
                    <button onClick={() => setShowSearchResults(false)} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </div>
                  {mapSearchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 dark:hover:bg-amber-950/40 border-b border-gray-100 dark:border-gray-800/40 flex items-start gap-2 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="truncate">
                        <p className="font-bold truncate">{res.display_name.split(',')[0]}</p>
                        <p className="text-[10px] text-gray-400 truncate">{res.display_name}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Map Controls (Top-Right) */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            {/* My GPS Location Button */}
            <button
              onClick={handleUseMyLocation}
              title={language === 'en' ? 'My Location' : 'Ma position GPS'}
              className="p-2.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white shadow-xl transition-all cursor-pointer flex items-center justify-center"
            >
              <Crosshair size={18} />
            </button>

            {/* Layer Switcher */}
            <div className="flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 p-1 shadow-xl space-y-1">
              {[
                { id: 'osm', label: 'OSM' },
                { id: 'satellite', label: 'Sat' },
                { id: 'dark', label: 'Nuit' },
                { id: 'topo', label: 'Relief' }
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    activeLayer === layer.id
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            {/* Qibla & Sanctuaries Toggles */}
            <div className="flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 p-1 shadow-xl space-y-1">
              <button
                onClick={() => setShowQiblaRay(!showQiblaRay)}
                title="Rayon Qibla vers La Mecque"
                className={`p-1.5 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  showQiblaRay
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Compass size={14} />
              </button>

              <button
                onClick={() => setShowSanctuaries(!showSanctuaries)}
                title="Sanctuaires Sacrés"
                className={`p-1.5 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  showSanctuaries
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Sparkles size={14} />
              </button>
            </div>
          </div>

          {/* Quick-Jump Region Pills (Bottom of map) */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { label: '🕋 La Mecque', lat: 21.4225, lng: 39.8262, zoom: 12, name: 'La Mecque (Al-Makkah)' },
              { label: '🌍 Ouest Afrique', lat: 12.0, lng: -2.0, zoom: 5, name: 'Afrique de l’Ouest' },
              { label: '🏜️ Maghreb', lat: 31.0, lng: -2.0, zoom: 5, name: 'Maghreb' },
              { label: '🕌 Moyen-Orient', lat: 26.0, lng: 44.0, zoom: 5, name: 'Moyen-Orient' },
              { label: '🏰 Europe', lat: 48.0, lng: 4.0, zoom: 5, name: 'Europe' },
              { label: '🌏 Asie', lat: 30.0, lng: 75.0, zoom: 4, name: 'Asie' },
              { label: '🗽 Amériques', lat: 20.0, lng: -75.0, zoom: 4, name: 'Amériques' }
            ].map((reg, idx) => (
              <button
                key={idx}
                onClick={() => flyToCoords(reg.lat, reg.lng, reg.zoom, reg.name)}
                className="px-2.5 py-1 rounded-xl bg-slate-900/85 hover:bg-amber-600 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow-lg whitespace-nowrap transition-colors cursor-pointer"
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal HUD Footer with Coordinates & Confirmation */}
        <div className="p-3 sm:p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50/95 dark:bg-gray-900/95 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Target Info Summary */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <MapPin size={16} />
              </div>
              <div>
                <p className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>{selectedCityName}</span>
                  {selectedCountryName && (
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">({selectedCountryName})</span>
                  )}
                  {isReverseGeocoding && <RotateCw size={11} className="animate-spin text-amber-500" />}
                </p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                  {toDMS(selectedLat, true)} • {toDMS(selectedLng, false)}
                </p>
              </div>
            </div>

            {/* Qibla & Kaaba Distance Badge */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px]">
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <Compass size={13} />
                <span>Qibla: {geodesy.azimuthDeg.toFixed(1)}°</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                <span>Vers Kaaba: <strong>{geodesy.distanceKm.toFixed(0)} km</strong></span>
              </div>
              {cityAbjad > 0 && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Abjad: {cityAbjad}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </button>
            <button
              onClick={() => {
                onConfirmLocation(selectedCityName, selectedLat, selectedLng);
                onClose();
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>{language === 'en' ? 'Confirm & Apply Location' : 'Valider & Appliquer cet Emplacement'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
