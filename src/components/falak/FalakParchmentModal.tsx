import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Shield,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CalculatedPlanetaryHour,
  ActiveLunarMansionInfo,
  AccurateSolarData,
  CityPreset
} from '../../utils/falakEngine';

interface FalakParchmentModalProps {
  currentHour: CalculatedPlanetaryHour;
  activeMansion: ActiveLunarMansionInfo;
  solarData: AccurateSolarData;
  nowTime: Date;
  selectedCity: CityPreset | null;
  onClose: () => void;
}

export const FalakParchmentModal: React.FC<FalakParchmentModalProps> = ({
  currentHour,
  activeMansion,
  solarData,
  nowTime,
  selectedCity,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const formattedDate = nowTime.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCopyText = () => {
    const text = `📜 CARTE CELESTE ASTRAL & HORLOGE MYSTIQUE (Falak & Manazil)
📅 Date : ${formattedDate}
📍 Repère : ${selectedCity ? selectedCity.nameFr : 'GPS Exact'}

🕒 HEURE PLANÉTAIRE ACTIVE :
- Planète : ${currentHour.planet.nameFr} (${currentHour.planet.arabic})
- Heure : ${currentHour.timeStartStr} - ${currentHour.timeEndStr}
- Ange Régent : ${currentHour.planet.angelFr} (${currentHour.planet.angelAr})
- Roi Terrestre : ${currentHour.planet.jinnKingFr} (${currentHour.planet.jinnKingAr})
- Élément : ${currentHour.planet.element} (${currentHour.planet.temperamentFr})
- Métal : ${currentHour.planet.metalFr}
- Encens : ${currentHour.planet.incenseFr}
- Dhikr : ${currentHour.planet.wird.arabic} (${currentHour.planet.wird.name} - ${currentHour.planet.wird.count}x)

🌙 DEMEURE LUNAIRE ACTIVE :
- Manzil N°${activeMansion.mansionNumber} : ${activeMansion.nameFr} (${activeMansion.nameAr})
- Degré Céleste : ${activeMansion.degreeSpan}
- Ange Gardien : ${activeMansion.angelFr} (${activeMansion.angelAr})
- Encens du Manzil : ${activeMansion.incenseFr}
- Dhikr du Manzil : ${activeMansion.wirdAr} (${activeMansion.wirdCount}x)

✨ ASRAHUB SACRED SCIENCES ENGINE ✨`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-amber-100"
      >
        {/* Actions Top Bar */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wider">
              Parchemin Céleste de l'Instant (Kharīṭat al-Falak)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copier le texte"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copié !' : 'Copier'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Parchment Printable Canvas */}
        <div
          ref={printableRef}
          className="relative bg-gradient-to-br from-[#1c1813] via-[#241f17] to-[#17140f] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden"
        >
          {/* Border Motifs */}
          <div className="absolute top-2 left-2 text-amber-500/40 text-xs font-mono">✦ ۞ ✦</div>
          <div className="absolute top-2 right-2 text-amber-500/40 text-xs font-mono">✦ ۞ ✦</div>
          <div className="absolute bottom-2 left-2 text-amber-500/40 text-xs font-mono">✦ ۞ ✦</div>
          <div className="absolute bottom-2 right-2 text-amber-500/40 text-xs font-mono">✦ ۞ ✦</div>

          {/* Title Header */}
          <div className="text-center space-y-2 border-b border-amber-500/30 pb-5">
            <div className="text-xs font-black uppercase tracking-widest text-amber-400">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-200 font-serif tracking-wide">
              Kharīṭat al-Falak wa Manāzil al-Qamar
            </h2>
            <p className="text-xs text-amber-300/80 font-mono">
              {formattedDate} • Repère : {selectedCity ? selectedCity.nameFr : 'GPS Exact'}
            </p>
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Left: Planetary Hour */}
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Heure Planétaire
                </span>
                <span className="font-mono text-amber-200 font-bold">
                  {currentHour.timeStartStr} - {currentHour.timeEndStr}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">{currentHour.planet.nameFr}</span>
                <span className="text-xl font-arabic font-bold text-amber-400" dir="rtl">
                  {currentHour.planet.arabic}
                </span>
              </div>

              <div className="space-y-1 text-amber-200/90">
                <div>
                  Ange Régent : <strong>{currentHour.planet.angelFr}</strong> ({currentHour.planet.angelAr})
                </div>
                <div>
                  Roi Terrestre : <strong>{currentHour.planet.jinnKingFr}</strong>
                </div>
                <div>
                  Élément & Tempérament : <strong>{currentHour.planet.element}</strong> ({currentHour.planet.temperamentFr})
                </div>
                <div>
                  Encens Spécifique : <strong>{currentHour.planet.incenseFr}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center font-arabic text-amber-200 text-sm" dir="rtl">
                {currentHour.planet.wird.arabic} ({currentHour.planet.wird.count}x)
              </div>
            </div>

            {/* Right: Lunar Mansion */}
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  Demeure Lunaire
                </span>
                <span className="font-mono text-amber-200 font-bold">
                  N°{activeMansion.mansionNumber} / 28
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">{activeMansion.nameFr}</span>
                <span className="text-xl font-arabic font-bold text-amber-400" dir="rtl">
                  {activeMansion.nameAr}
                </span>
              </div>

              <div className="space-y-1 text-amber-200/90">
                <div>
                  Degré Astrologique : <strong>{activeMansion.degreeSpan}</strong>
                </div>
                <div>
                  Ange du Manzil : <strong>{activeMansion.angelFr}</strong> ({activeMansion.angelAr})
                </div>
                <div>
                  Nature : <strong>{activeMansion.nature}</strong> ({activeMansion.element})
                </div>
                <div>
                  Encens : <strong>{activeMansion.incenseFr}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center font-arabic text-amber-200 text-sm" dir="rtl">
                {activeMansion.wirdAr} ({activeMansion.wirdCount}x)
              </div>
            </div>
          </div>

          {/* Footer Seals */}
          <div className="text-center text-[10px] text-amber-400/60 font-mono border-t border-amber-500/20 pt-3">
            ASRARHUB SPIRITUAL SCIENCES • SYNCHRONISATION EXACTE GPS & FALAK
          </div>
        </div>
      </motion.div>
    </div>
  );
};
