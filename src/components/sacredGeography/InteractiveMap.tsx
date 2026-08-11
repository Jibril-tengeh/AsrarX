import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Compass, Navigation } from 'lucide-react';

interface SacredCenter {
  id: string;
  flag: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicName: string;
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  language: string;
  cityName: string;
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  sacredCenters: SacredCenter[];
  selectedCenter: SacredCenter;
  qiblaDistanceKm: number;
  qiblaAzimuthDeg: number;
}

export default function InteractiveMap({
  language,
  cityName,
  lat,
  lng,
  setLat,
  setLng,
  sacredCenters,
  selectedCenter,
  qiblaDistanceKm,
  qiblaAzimuthDeg,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const qiblaPolylineRef = useRef<L.Polyline | null>(null);
  const centerPolylineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [tileStyle, setTileStyle] = useState<'streets' | 'satellite' | 'dark' | 'topo'>('streets');

  const TILE_URLS = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 4,
        zoomControl: true,
      });

      const initialTile = L.tileLayer(TILE_URLS[tileStyle], {
        attribution: '&copy; OpenStreetMap / Esri / CartoDB',
      }).addTo(map);

      tileLayerRef.current = initialTile;

      // User Draggable Marker Icon
      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `<div style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; font-size: 18px;">📍</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const userMarker = L.marker([lat, lng], { draggable: true, icon: userIcon }).addTo(map);
      userMarker.bindPopup(`<b>${cityName}</b><br/>${lat}° N, ${lng}° E`);

      userMarker.on('dragend', () => {
        const pos = userMarker.getLatLng();
        const nLat = parseFloat(pos.lat.toFixed(4));
        const nLng = parseFloat(pos.lng.toFixed(4));
        setLat(nLat);
        setLng(nLng);
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        const nLat = parseFloat(e.latlng.lat.toFixed(4));
        const nLng = parseFloat(e.latlng.lng.toFixed(4));
        setLat(nLat);
        setLng(nLng);
        userMarker.setLatLng(e.latlng);
      });

      mapInstanceRef.current = map;
      userMarkerRef.current = userMarker;
    }

    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  }, []);

  // Update Tile Layer when tileStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = L.tileLayer(TILE_URLS[tileStyle], {
      attribution: '&copy; OpenStreetMap / Esri / CartoDB',
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [tileStyle]);

  // Update Markers and Polylines when location or selected center changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Update user marker position
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
      userMarkerRef.current.setPopupContent(`<b>${cityName}</b><br/>${lat}° N, ${lng}° E`);
    }

    // Makkah (Qibla) Coordinates
    const makkahLat = 21.4225;
    const makkahLng = 39.8262;

    // Remove old polylines
    if (qiblaPolylineRef.current) map.removeLayer(qiblaPolylineRef.current);
    if (centerPolylineRef.current) map.removeLayer(centerPolylineRef.current);

    // Qibla Line (Red / Gold Dotted)
    const qiblaLine = L.polyline(
      [
        [lat, lng],
        [makkahLat, makkahLng],
      ],
      {
        color: '#ef4444',
        weight: 3,
        dashArray: '8, 8',
        opacity: 0.9,
      }
    ).addTo(map);

    qiblaLine.bindPopup(
      `<b>${
        language === 'en' ? 'Qibla Direction to Mecca' : language === 'ha' ? 'Alkibla zuwa Makkah' : 'Ligne de Qibla vers La Mecque'
      }</b><br/>${language === 'en' ? 'Distance' : 'Distance'}: <b>${qiblaDistanceKm.toFixed(
        0
      )} km</b><br/>${language === 'en' ? 'Azimuth' : 'Angle'}: <b>${qiblaAzimuthDeg.toFixed(1)}°</b>`
    );

    qiblaPolylineRef.current = qiblaLine;

    // Selected Sacred Center Polyline (Emerald)
    if (selectedCenter.id !== 'makkah') {
      const centerLine = L.polyline(
        [
          [lat, lng],
          [selectedCenter.lat, selectedCenter.lng],
        ],
        {
          color: '#10b981',
          weight: 3,
          opacity: 0.8,
        }
      ).addTo(map);

      const centerName =
        language === 'en'
          ? selectedCenter.nameEn
          : language === 'ha'
          ? selectedCenter.nameHa
          : selectedCenter.nameFr;

      centerLine.bindPopup(`<b>${centerName} (${selectedCenter.arabicName})</b>`);
      centerPolylineRef.current = centerLine;
    }

    // Render Sacred Centers Pins
    sacredCenters.forEach((sc) => {
      const isMakkah = sc.id === 'makkah';
      const isSelected = sc.id === selectedCenter.id;

      const scIcon = L.divIcon({
        className: 'custom-sc-pin',
        html: `<div style="background: ${
          isMakkah ? '#dc2626' : isSelected ? '#10b981' : '#3b82f6'
        }; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 14px;">${
          sc.flag
        }</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const scMarker = L.marker([sc.lat, sc.lng], { icon: scIcon }).addTo(map);
      const scName = language === 'en' ? sc.nameEn : language === 'ha' ? sc.nameHa : sc.nameFr;
      scMarker.bindPopup(`<b>${sc.flag} ${scName}</b><br/>${sc.arabicName}`);
    });
  }, [lat, lng, cityName, selectedCenter, sacredCenters, qiblaDistanceKm, qiblaAzimuthDeg, language]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-5 shadow-xl border border-gray-200 dark:border-gray-700 space-y-3">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
          <Compass size={16} />
          <span>
            {language === 'en'
              ? 'Interactive World Map & Qibla Rays'
              : language === 'ha'
              ? 'Taswira da Rayukan Alkibla'
              : 'Carte Mondiale Interactive & Rayons de Qibla'}
          </span>
        </div>

        {/* Tile Layer Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
          <span className="text-[10px] font-bold text-gray-500 px-2 flex items-center gap-1">
            <Layers size={12} /> Tile:
          </span>
          {[
            { id: 'streets', name: 'Rues' },
            { id: 'satellite', name: 'Satellite' },
            { id: 'dark', name: 'Sombre' },
            { id: 'topo', name: 'Relief' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTileStyle(t.id as any)}
              className={`px-2.5 py-1 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer ${
                tileStyle === t.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 bg-slate-900">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />
      </div>

      {/* Map Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-300 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-amber-500" />
          <span>
            {language === 'en' ? 'Click anywhere on map to set position' : 'Cliquer n\'importe où pour placer le repère'}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono font-bold text-amber-800 dark:text-amber-300">
          <span>Qibla Mecca: {qiblaDistanceKm.toFixed(0)} km</span>
          <span>Angle: {qiblaAzimuthDeg.toFixed(1)}°</span>
        </div>
      </div>
    </div>
  );
}
