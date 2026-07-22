import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Crown, Sun, Moon, Flame, Shield, Download, Feather, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

interface SevenKingData {
  dayId: string;
  dayFr: string;
  dayHa: string;
  dayEn: string;
  dayAr: string;
  celestialAngel: string;
  terrestrialKing: string;
  planet: string;
  metal: string;
  incense: string;
  divineName: string;
  color: string;
  invocation: string;
}

const SEVEN_KINGS_DATA: SevenKingData[] = [
  {
    dayId: "sunday",
    dayFr: "Dimanche",
    dayHa: "Lahadi",
    dayEn: "Sunday",
    dayAr: "الأحد",
    celestialAngel: "Rūqyā'īl (روقيائيل)",
    terrestrialKing: "Al-Mudhib (المذهب)",
    planet: "Soleil (الشمس)",
    metal: "Or (ذهب)",
    incense: "Sandalwood & Frankincense (سندروس و لبان)",
    divineName: "Yā Hayyu Yā Qayyūm (يا حي يا قيوم)",
    color: "from-amber-500 to-yellow-600",
    invocation: "Bismillāh ar-Rahmān ar-Rahīm, ajib yā Rūqyā'īl bi-haqqi ash-Shamsi wa al-Malik Al-Mudhib...",
  },
  {
    dayId: "monday",
    dayFr: "Lundi",
    dayHa: "Litinin",
    dayEn: "Monday",
    dayAr: "الإثنين",
    celestialAngel: "Jibrā'īl (جبرائيل)",
    terrestrialKing: "Murrah (مرة)",
    planet: "Lune (القمر)",
    metal: "Argent (فضة)",
    incense: "Camphor & White Musk (كافور و مسك أبيض)",
    divineName: "Yā Rahmān Yā Rahīm (يا رحمن يا رحيم)",
    color: "from-slate-300 to-cyan-500",
    invocation: "Bismillāh, ajib yā Jibrā'īl bi-haqqi al-Qamari wa al-Malik Murrah...",
  },
  {
    dayId: "tuesday",
    dayFr: "Mardi",
    dayHa: "Talata",
    dayEn: "Tuesday",
    dayAr: "الثلاثاء",
    celestialAngel: "Samsamā'īl (سمسمائيل)",
    terrestrialKing: "Al-Ahmar (الأحمر)",
    planet: "Mars (المريخ)",
    metal: "Fer (حديد)",
    incense: "Clove & Mastic (قرنفل و مصطكى)",
    divineName: "Yā Qawiyyu Yā Matīn (يا قوي يا متين)",
    color: "from-red-600 to-rose-700",
    invocation: "Bismillāh, ajib yā Samsamā'īl bi-haqqi al-Mirrīkh wa al-Malik Al-Ahmar...",
  },
  {
    dayId: "wednesday",
    dayFr: "Mercredi",
    dayHa: "Larabawa",
    dayEn: "Wednesday",
    dayAr: "الأربعاء",
    celestialAngel: "Mīkhā'īl (ميكائيل)",
    terrestrialKing: "Burqān (برقان)",
    planet: "Mercure (عطارد)",
    metal: "Mercure / Vif-argent (زئبق)",
    incense: "Coriander & Anise (كزبرة و أنيسون)",
    divineName: "Yā 'Alīmu Yā Hakīm (يا عليم يا حكيم)",
    color: "from-blue-500 to-cyan-600",
    invocation: "Bismillāh, ajib yā Mīkhā'īl bi-haqqi 'Utārid wa al-Malik Burqān...",
  },
  {
    dayId: "thursday",
    dayFr: "Jeudi",
    dayHa: "Alhamis",
    dayEn: "Thursday",
    dayAr: "الخميس",
    celestialAngel: "Sarfīyā'īl (صرفيائيل)",
    terrestrialKing: "Shamhurish (شمهورش)",
    planet: "Jupiter (المشتري)",
    metal: "Étain (قصدير)",
    incense: "Amber & Pure Oud (عنبر و عود)",
    divineName: "Yā Kabīru Yā Mut'āl (يا كبير يا متعال)",
    color: "from-purple-600 to-indigo-700",
    invocation: "Bismillāh, ajib yā Sarfīyā'īl bi-haqqi al-Mushtarī wa al-Malik Shamhurish...",
  },
  {
    dayId: "friday",
    dayFr: "Vendredi",
    dayHa: "Juma'a",
    dayEn: "Friday",
    dayAr: "الجمعة",
    celestialAngel: "'Anyā'īl (عنيائيل)",
    terrestrialKing: "Zawba'ah (زوبعة)",
    planet: "Vénus (الزهرة)",
    metal: "Cuivre (نحاس)",
    incense: "Saffron & White Rose (زعفران و ورد)",
    divineName: "Yā Wadūdu Yā Latīf (يا ودود يا لطيف)",
    color: "from-emerald-500 to-teal-600",
    invocation: "Bismillāh, ajib yā 'Anyā'īl bi-haqqi az-Zuharah wa al-Malik Zawba'ah...",
  },
  {
    dayId: "saturday",
    dayFr: "Samedi",
    dayHa: "Asabar",
    dayEn: "Saturday",
    dayAr: "السبت",
    celestialAngel: "Kasfīyā'īl (كسفيائيل)",
    terrestrialKing: "Maymūn (ميمون)",
    planet: "Saturne (زحل)",
    metal: "Plomb (رصاص)",
    incense: "Black Myrrh & Asafoetida (مر و حلتيت)",
    divineName: "Yā Fattāhu Yā Razzāq (يا فتاح يا رزاق)",
    color: "from-zinc-700 to-neutral-900",
    invocation: "Bismillāh, ajib yā Kasfīyā'īl bi-haqqi Zuhal wa al-Malik Maymūn...",
  },
];

export const SevenKingsSeals: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<SevenKingData>(SEVEN_KINGS_DATA[0]);
  const [showParchment, setShowParchment] = useState(false);
  const sealRef = useRef<HTMLDivElement>(null);

  const handleDownloadSeal = async () => {
    if (!sealRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 800, 800);

      // Gold seal circle
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(400, 400, 360, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Amiri", serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedDay.celestialAngel, 400, 320);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 30px "Amiri", serif';
      ctx.fillText(selectedDay.terrestrialKing, 400, 380);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px "Amiri", serif';
      ctx.fillText(selectedDay.divineName, 400, 440);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px sans-serif';
      ctx.fillText(`Jour: ${selectedDay.dayFr} | Métal: ${selectedDay.metal}`, 400, 520);

      await downloadCanvasImage(canvas, `sceau_7_rois_${selectedDay.dayId}.png`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Sceaux des 7 Rois Célestes</span>
            <Crown className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {language === 'fr'
              ? 'Correspondances Théurgiques quotidiennes des 7 Anges & Rois (Al-Mulūk As-Sab\'ah)'
              : language === 'ha'
              ? 'Hatsimi da Sarakunan Ruhaniya na Ranakun Mako 7'
              : 'Daily Theurgic Correspondences of the 7 Angels & Celestial Kings'}
          </p>
        </div>
        <ToolInfoTooltip toolId="seven-kings" />
      </div>

      {/* Days Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {SEVEN_KINGS_DATA.map((k) => (
          <button
            key={k.dayId}
            onClick={() => setSelectedDay(k)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
              selectedDay.dayId === k.dayId
                ? `bg-gradient-to-r ${k.color} text-white shadow-lg scale-105`
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span>{language === 'fr' ? k.dayFr : language === 'ha' ? k.dayHa : k.dayEn}</span>
            <span className="font-serif text-sm opacity-80">({k.dayAr})</span>
          </button>
        ))}
      </div>

      {/* Main Selected Day Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Specs Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  {selectedDay.dayAr} — {selectedDay.dayFr}
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-serif mt-1">
                  {selectedDay.celestialAngel}
                </h2>
              </div>
              <Crown className="w-8 h-8 text-amber-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 block mb-1">
                  {language === 'fr' ? 'Roi Terrestre (Ardi)' : 'Terrestrial King'}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm font-serif">
                  {selectedDay.terrestrialKing}
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 block mb-1">
                  {language === 'fr' ? 'Planète Gouvernante' : 'Governing Planet'}
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {selectedDay.planet}
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 block mb-1">
                  {language === 'fr' ? 'Métal Sacré' : 'Sacred Metal'}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedDay.metal}
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 block mb-1">
                  {language === 'fr' ? 'Encens / Bakhour' : 'Incense'}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {selectedDay.incense}
                </span>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                {language === 'fr' ? 'Nom Divin Clé (Asma Al-Husna)' : 'Key Divine Name'}
              </span>
              <p className="text-lg font-bold font-serif text-amber-900 dark:text-amber-300">
                {selectedDay.divineName}
              </p>
            </div>

            <div className="p-4 bg-zinc-900 text-white rounded-2xl border border-zinc-800 space-y-1">
              <span className="text-xs font-mono text-amber-400 block">✦ Formule d'Invocation Rituelle ✦</span>
              <p className="text-sm font-serif italic text-zinc-300 leading-relaxed">
                "{selectedDay.invocation}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Seal Preview Canvas & Actions */}
        <div className="lg:col-span-1 space-y-4">
          <div
            ref={sealRef}
            className="bg-zinc-950 p-6 rounded-3xl border border-amber-500/30 text-center flex flex-col items-center justify-center space-y-4 shadow-xl min-h-[320px]"
          >
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center bg-amber-500/10 p-2">
              <span className="text-2xl font-serif text-amber-400 font-bold text-center leading-tight">
                {selectedDay.celestialAngel.split(' ')[0]}
              </span>
            </div>
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-widest font-mono">Sceau du Roi</p>
              <h3 className="text-lg font-bold text-white font-serif mt-1">{selectedDay.terrestrialKing}</h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-xs">
              Sceau Théurgique du {selectedDay.dayFr} scellant la résonance du métal {selectedDay.metal}.
            </p>
          </div>

          <button
            onClick={() => setShowParchment(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Feather className="w-4 h-4" />
            <span>{language === 'fr' ? 'Générer Parchemin Rituel' : 'Generate Ritual Parchment'}</span>
          </button>

          <button
            onClick={handleDownloadSeal}
            className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{language === 'fr' ? 'Télécharger le Sceau PNG' : 'Download Seal PNG'}</span>
          </button>
        </div>
      </div>

      <ParchmentExporterModal
        isOpen={showParchment}
        onClose={() => setShowParchment(false)}
        title={`Sceau du Roi — ${selectedDay.dayFr}`}
        subtitle={`Régence de l'Ange ${selectedDay.celestialAngel} & Roi ${selectedDay.terrestrialKing}`}
        content={
          <div className="space-y-4 text-center">
            <p className="text-2xl font-serif text-amber-900 font-bold">{selectedDay.celestialAngel}</p>
            <p className="text-lg font-serif text-amber-800">{selectedDay.terrestrialKing}</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans text-amber-900 text-left bg-amber-200/40 p-3 rounded-xl border border-amber-600/30">
              <div>Planète: <strong>{selectedDay.planet}</strong></div>
              <div>Métal: <strong>{selectedDay.metal}</strong></div>
              <div>Encens: <strong>{selectedDay.incense}</strong></div>
              <div>Nom Divin: <strong>{selectedDay.divineName}</strong></div>
            </div>
            <p className="text-xs italic font-serif text-amber-950 bg-amber-100 p-3 rounded-xl">
              "{selectedDay.invocation}"
            </p>
          </div>
        }
      />
    </div>
  );
};
