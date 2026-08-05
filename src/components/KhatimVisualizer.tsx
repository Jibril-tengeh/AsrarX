import React, { useState, useRef } from 'react';
import { Eye, Code, Sparkles, Shield, Star, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { AsrarHubWatermark } from './AsrarHubWatermark';

export interface KhatimGridData {
  version: number;
  title: string;
  header: string;
  footer: string;
  gridSize: number;
  cells: string[][];
  magicSum?: number;
  cornerText?: { topLeft?: string; topRight?: string; bottomLeft?: string; bottomRight?: string };
}

export function getKhatimGridData(version: number, sealTitle?: string, arabicName?: string, formula?: string, sealId?: string): KhatimGridData {
  const isWafq9x9 = sealId === 'seal_wafq_9x9' || sealTitle?.toLowerCase().includes('9x9') || sealTitle?.toLowerCase().includes('9×9');

  switch (version) {
    case 4:
      return {
        version: 4,
        title: "Wafq Al-Ghazali 3×3 (Carré Magique Sacré)",
        header: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
        footer: "فَرْدٌ جَبَّارٌ شَكُورٌ ثَابِتٌ ظَهِيرٌ خَبِيرٌ (Somme = 15)",
        gridSize: 3,
        magicSum: 15,
        cornerText: { topLeft: "ب", topRight: "د", bottomLeft: "و", bottomRight: "ح" },
        cells: [
          ["4", "9", "2"],
          ["3", "5", "7"],
          ["8", "1", "6"]
        ]
      };

    case 1:
      if (isWafq9x9) {
        return {
          version: 1,
          title: "Wafq Qamar Mutassa' 9×9 (81 Cases - Carré Magique Lunaire)",
          header: "خَاتَمُ القَمَرِ المُتَّسِعُ (وفق ٩×٩) • Somme = 369",
          footer: "يَا قَمَرُ يَا زَكِيُّ • الجُمْلَةُ الكُلِّيَّةُ = 3321",
          gridSize: 9,
          magicSum: 369,
          cells: [
            ["47", "58", "69", "80", "01", "12", "23", "34", "45"],
            ["57", "68", "79", "09", "11", "22", "33", "44", "46"],
            ["67", "78", "08", "10", "21", "32", "43", "54", "56"],
            ["77", "07", "18", "20", "31", "42", "53", "55", "66"],
            ["06", "17", "19", "30", "41", "52", "63", "65", "76"],
            ["16", "27", "29", "40", "51", "62", "64", "75", "05"],
            ["26", "28", "39", "50", "61", "72", "74", "04", "15"],
            ["36", "38", "49", "60", "71", "73", "03", "14", "25"],
            ["37", "48", "59", "70", "81", "02", "13", "24", "35"]
          ]
        };
      }
      return {
        version: 1,
        title: "Wafq Abjad 4×4 Classique",
        header: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
        footer: "يَا لَطِيفُ يَا كَرِيمُ - 136",
        gridSize: 4,
        magicSum: 34,
        cells: [
          ["08", "11", "14", "01"],
          ["13", "02", "07", "12"],
          ["03", "16", "09", "06"],
          ["10", "05", "04", "15"]
        ]
      };

    case 2:
      return {
        version: 2,
        title: "Khatim An-Nur 5×5 (Sceau de Lumière)",
        header: "اللَّهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ",
        footer: "نُورٌ عَلَى نُورٍ يَهْدِي اللَّهُ لِنُورِهِ (Somme = 65)",
        gridSize: 5,
        magicSum: 65,
        cells: [
          ["17", "24", "01", "08", "15"],
          ["23", "05", "07", "14", "16"],
          ["04", "06", "13", "20", "22"],
          ["10", "12", "19", "21", "03"],
          ["11", "18", "25", "02", "09"]
        ]
      };

    case 3:
      return {
        version: 3,
        title: "Sirr Al-Huruf 4×4 (Matrice des Lettres Sacrées)",
        header: "سِرُّ الحُرُوفِ وَأَسْرَارُ الأَسْمَاءِ",
        footer: "سِرُّ الأَسْرَارِ وَنُورُ الأَنْوَارِ",
        gridSize: 4,
        cells: [
          ["ا", "ل", "ل", "ه"],
          ["ل", "ط", "ي", "ف"],
          ["ح", "ك", "ي", "م"],
          ["ن", "و", "ر", "✨"]
        ]
      };

    case 5:
      return {
        version: 5,
        title: "As-Sabaa Al-Mawaki' 7×7 (Sept Planètes)",
        header: "الكَوَاكِبُ السَّبْعَةُ المَبْرُورَةُ",
        footer: "شَمْسٌ • قَمَرٌ • عُطَارِدٌ • زُهَرَةٌ • مِرِّيخٌ • مُشْتَرِي • زُحَلٌ",
        gridSize: 7,
        magicSum: 175,
        cells: [
          ["30", "39", "48", "01", "10", "19", "28"],
          ["38", "47", "07", "09", "18", "27", "29"],
          ["46", "06", "08", "17", "26", "35", "37"],
          ["05", "14", "16", "25", "34", "36", "45"],
          ["13", "15", "24", "33", "42", "44", "04"],
          ["21", "23", "32", "41", "43", "03", "12"],
          ["22", "31", "40", "49", "02", "11", "20"]
        ]
      };

    case 6:
      return {
        version: 6,
        title: "Khatim An-Nar wa Al-Hawa 4×4 (Feu & Air)",
        header: "يَا سَرِيعُ يَا مُجِيبُ يَا كَفِيلُ",
        footer: "عَاجِلاً غَيْرَ آَجِلٍ بِحَقِّ الأَسْمَاءِ",
        gridSize: 4,
        cells: [
          ["ف", "ج", "ش", "ث"],
          ["خ", "ذ", "ض", "ظ"],
          ["111", "222", "333", "444"],
          ["سَرِيعٌ", "قَرِيبٌ", "مُجِيبٌ", "كَفِيلٌ"]
        ]
      };

    case 7:
      return {
        version: 7,
        title: "Khatim Al-Ma' wa At-Tin 5×5 (Eau & Terre)",
        header: "وَجَعَلْنَا مِنَ المَاءِ كُلَّ شَيْءٍ حَيٍّ",
        footer: "طَهَارَةٌ وَحِصْنٌ وَشِفَاءٌ دَائِمٌ",
        gridSize: 5,
        cells: [
          ["11", "24", "07", "20", "03"],
          ["04", "12", "25", "08", "16"],
          ["17", "05", "13", "21", "09"],
          ["10", "18", "01", "14", "22"],
          ["23", "06", "19", "02", "15"]
        ]
      };

    case 8:
      return {
        version: 8,
        title: "Al-Hisn Al-Mane' 12×12 (Grande Matrice de Protection)",
        header: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        footer: "حِصْنٌ حَصِينٌ وَدِرْعٌ مَنِيعٌ (12×12 - Somme = 870)",
        gridSize: 12,
        magicSum: 870,
        cells: [
          ["144", "001", "143", "002", "142", "003", "141", "004", "140", "005", "139", "006"],
          ["007", "138", "008", "137", "009", "136", "010", "135", "011", "134", "012", "133"],
          ["132", "013", "131", "014", "130", "015", "129", "016", "128", "017", "127", "018"],
          ["019", "126", "020", "125", "021", "124", "022", "123", "023", "122", "024", "121"],
          ["120", "025", "119", "026", "118", "027", "117", "028", "116", "029", "115", "030"],
          ["031", "114", "032", "113", "033", "112", "034", "111", "035", "110", "036", "109"],
          ["108", "037", "107", "038", "106", "039", "105", "040", "104", "041", "103", "042"],
          ["043", "102", "044", "101", "045", "100", "046", "099", "047", "098", "048", "097"],
          ["096", "049", "095", "050", "094", "051", "093", "052", "092", "053", "091", "054"],
          ["055", "090", "056", "089", "057", "088", "058", "087", "059", "086", "060", "085"],
          ["084", "061", "083", "062", "082", "063", "081", "064", "080", "065", "079", "066"],
          ["067", "078", "068", "077", "069", "076", "070", "075", "071", "074", "072", "073"]
        ]
      };

    case 9:
      return {
        version: 9,
        title: "Talsam Souleymani 7×7 (Les 7 Sceaux de Salomon)",
        header: "فَسَيَكْفِيكَهُمُ اللَّهُ وَهُوَ السَّمِيعُ العَلِيمُ",
        footer: "إِنَّهُ مِنْ سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
        gridSize: 7,
        cells: [
          ["★", "⚔️", "📜", "✦", "🗝️", "🌙", "۞"],
          ["فَرْدٌ", "جَبَّارٌ", "شَكُورٌ", "ثَابِتٌ", "ظَهِيرٌ", "خَبِيرٌ", "زَكِيٌّ"],
          ["77", "88", "99", "111", "222", "333", "777"],
          ["عِزٌّ", "مَلَكُوتٌ", "سُلْطَانٌ", "هَيْبَةٌ", "نَصْرٌ", "فَتْحٌ", "قَبُولٌ"],
          ["3", "7", "12", "19", "21", "28", "33"],
          ["شَمْسٌ", "قَمَرٌ", "زُهَرَةٌ", "عُطَارِدٌ", "مِرِّيخٌ", "مُشْتَرِي", "زُحَلٌ"],
          ["١", "٢", "٣", "٤", "٥", "٦", "٧"]
        ]
      };

    case 10:
      return {
        version: 10,
        title: "At-Tawafuq Ash-Shamsi 6×6 (Soleil & Lune)",
        header: "لاَ الشَّمْسُ يَنْبَغِي لَهَا أَنْ تُدْرِكَ القَمَرَ",
        footer: "وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ (Somme = 111)",
        gridSize: 6,
        magicSum: 111,
        cells: [
          ["06", "32", "03", "34", "35", "01"],
          ["07", "11", "27", "28", "08", "30"],
          ["19", "14", "16", "15", "23", "24"],
          ["18", "20", "22", "21", "17", "13"],
          ["25", "29", "10", "09", "26", "12"],
          ["36", "05", "33", "04", "02", "31"]
        ]
      };

    case 11:
      return {
        version: 11,
        title: "Khatim Ar-Rouhaniyya (4 Archangels)",
        header: "جَبْرَائِيلُ • مِيكَائِيلُ • إِسْرَافِيلُ • عَزْرَائِيلُ",
        footer: "بِحَقِّ المَلاَئِكَةِ المُقَرَّبِينَ وَالأَسْمَاءِ العَلِيَّةِ",
        gridSize: 4,
        cornerText: {
          topLeft: "جَبْرَائِيل",
          topRight: "مِيكَائِيل",
          bottomLeft: "إِسْرَافِيل",
          bottomRight: "عَزْرَائِيل"
        },
        cells: [
          ["نُورٌ", "حِكْمَةٌ", "قُدْرَةٌ", "رَحْمَةٌ"],
          ["256", "512", "1024", "2048"],
          ["حِفْظٌ", "نَصْرٌ", "فَتْحٌ", "عِزُّ"],
          ["777", "999", "333", "111"]
        ]
      };

    case 12:
    default:
      return {
        version: 12,
        title: "Khatim Ism Al-Azam Al-A'zam 9×9 (99 Noms Divins)",
        header: "اللَّهُ لا إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ",
        footer: "لَهُ الأَسْمَاءُ الحُسْنَى يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالأَرْضِ",
        gridSize: 9,
        cells: [
          ["الرَّحْمَنُ", "الرَّحِيمُ", "المَلِكُ", "القُدُّوسُ", "السَّلاَمُ", "المُؤْمِنُ", "المُهَيْمِنُ", "العَزِيزُ", "الجَبَّارُ"],
          ["المُتَكَبِّرُ", "الخَالِقُ", "البَارِئُ", "المُصَوِّرُ", "الغَفَّارُ", "القَهَّارُ", "الوَهَّابُ", "الرَّزَّاقُ", "الفَتَّاحُ"],
          ["العَلِيمُ", "القَابِضُ", "البَاسِطُ", "الخَافِضُ", "الرَّافِعُ", "المُعِزُّ", "المُذِلُّ", "السَّمِيعُ", "البَصِيرُ"],
          ["الحَكَمُ", "العَدْلُ", "اللَّطِيفُ", "الخَبِيرُ", "الحَلِيمُ", "العَظِيمُ", "الغَفُورُ", "الشَّكُورُ", "العَلِيُّ"],
          ["الكَبِيرُ", "الحَفِيظُ", "المُقِيتُ", "الحَسِيبُ", "الجَلِيلُ", "الكَرِيمُ", "الرَّقِيبُ", "المُجِيبُ", "الوَاسِعُ"],
          ["الحَكِيمُ", "الوَدُودُ", "المَجِيدُ", "البَاعِثُ", "الشَّهِيدُ", "الحَقُّ", "الوَكِيلُ", "القَوِيُّ", "المَتِينُ"],
          ["الوَلِيُّ", "الحَمِيدُ", "المُحْصِي", "المُبْدِئُ", "المُعِيدُ", "المُحْيِي", "المُمِيتُ", "الحَيُّ", "القَيُّومُ"],
          ["الوَاجِدُ", "المَاجِدُ", "الوَاحِدُ", "الأَحَدُ", "الصَّمَدُ", "القَادِرُ", "المُقْتَدِرُ", "المُقَدِّمُ", "المُؤَخِّرُ"],
          ["الأَوَّلُ", "الآخِرُ", "الظَّاهِرُ", "البَاطِنُ", "الوَالِي", "المُتَعَالِي", "البَرُّ", "التَّوَّابُ", "المُنْتَقِمُ"]
        ]
      };
  }
}

interface KhatimVisualizerProps {
  version: number;
  sealTitle: string;
  arabicName: string;
  asciiSymbol: string;
  sealId?: string;
  language?: 'fr' | 'en' | 'ha';
  onExpandFullScreen?: () => void;
}

export const KhatimVisualizer: React.FC<KhatimVisualizerProps> = ({
  version,
  sealTitle,
  arabicName,
  asciiSymbol,
  sealId,
  language = 'fr',
  onExpandFullScreen
}) => {
  const [viewMode, setViewMode] = useState<'graphic' | 'ascii'>('graphic');
  const gridScrollRef = useRef<HTMLDivElement>(null);
  const gridData = getKhatimGridData(version, sealTitle, arabicName, undefined, sealId);

  return (
    <div className="space-y-3">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-black/80 p-1.5 rounded-2xl border border-purple-500/30">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('graphic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'graphic'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Sparkles size={14} />
            <span>{language === 'fr' ? 'Khatim Visuel Sacré' : language === 'ha' ? 'Hatimin Zana' : 'Sacred Visual Seal'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('ascii')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'ascii'
                ? 'bg-purple-900 text-amber-300 border border-amber-500/40 shadow-md font-extrabold'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Code size={14} />
            <span>{language === 'fr' ? 'Sceau Parchemin (ASCII)' : language === 'ha' ? 'Rubutun Parchemin' : 'Parchment Text (ASCII)'}</span>
          </button>
        </div>

        {gridData.magicSum && (
          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg hidden sm:inline-block">
            Somme Magique: {gridData.magicSum}
          </span>
        )}
      </div>

      {/* Main Container */}
      {viewMode === 'graphic' ? (
        <div
          onClick={onExpandFullScreen}
          className="group relative cursor-pointer bg-gradient-to-b from-[#180a2b] via-[#0e041d] to-black border-2 border-amber-500/50 hover:border-amber-400 p-3 sm:p-6 rounded-3xl shadow-2xl transition-all duration-300 select-none overflow-hidden"
          title={language === 'fr' ? 'Cliquer pour agrandir en plein écran' : 'Click to view full screen'}
        >
          {/* Inner Decorative Border */}
          <div className="border border-purple-500/30 rounded-2xl p-3 sm:p-5 relative bg-black/40">
            {/* AsrarHub Engraved Watermark */}
            <AsrarHubWatermark variant="dark" opacity={0.14} showCentralSeal={true} />
            {/* Corner Stars */}
            <Star size={14} className="absolute top-2 left-2 text-amber-400" />
            <Star size={14} className="absolute top-2 right-2 text-amber-400" />
            <Star size={14} className="absolute bottom-2 left-2 text-amber-400" />
            <Star size={14} className="absolute bottom-2 right-2 text-amber-400" />

            {/* Corner Texts if available (e.g. Ghazali Baduh or 4 Archangels) */}
            {gridData.cornerText && (
              <>
                <span className="absolute top-1 left-7 text-[10px] font-serif font-bold text-amber-300/90" dir="rtl">
                  {gridData.cornerText.topLeft}
                </span>
                <span className="absolute top-1 right-7 text-[10px] font-serif font-bold text-amber-300/90" dir="rtl">
                  {gridData.cornerText.topRight}
                </span>
                <span className="absolute bottom-1 left-7 text-[10px] font-serif font-bold text-amber-300/90" dir="rtl">
                  {gridData.cornerText.bottomLeft}
                </span>
                <span className="absolute bottom-1 right-7 text-[10px] font-serif font-bold text-amber-300/90" dir="rtl">
                  {gridData.cornerText.bottomRight}
                </span>
              </>
            )}

            {/* Header Title & Calligraphy */}
            <div className="text-center space-y-1 mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                ۞ {gridData.title} ۞
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-mono font-extrabold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-sm">
                  Matrice {gridData.gridSize}×{gridData.gridSize} ({gridData.gridSize * gridData.gridSize} Cases)
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-amber-200 tracking-wide" dir="rtl">
                {gridData.header}
              </h3>
            </div>

            {/* GRID NAVIGATION & TABLE / KHATIM SQUARE */}
            {gridData.gridSize >= 7 && (
              <div className="flex items-center justify-between gap-2 mb-2 px-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    gridScrollRef.current?.scrollBy({ left: -140, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-300 transition-all flex items-center gap-1 text-[11px] font-mono font-bold active:scale-95 cursor-pointer shadow-sm shrink-0"
                  title="Défiler vers la gauche"
                >
                  <ChevronLeft size={15} />
                  <span>{language === 'fr' ? 'Gauche' : 'Left'}</span>
                </button>

                <span className="text-[10px] font-mono font-bold text-amber-300/90 bg-purple-950/90 px-3 py-1 rounded-full border border-purple-500/40 flex items-center gap-1.5 shadow-md truncate">
                  <MoveHorizontal size={13} className="text-amber-400 animate-pulse shrink-0" />
                  <span>{language === 'fr' ? 'Défiler 9×9 (81 cases)' : language === 'ha' ? 'Jan ku za 9×9' : 'Scroll 9×9 matrix'}</span>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    gridScrollRef.current?.scrollBy({ left: 140, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-300 transition-all flex items-center gap-1 text-[11px] font-mono font-bold active:scale-95 cursor-pointer shadow-sm shrink-0"
                  title="Défiler vers la droite"
                >
                  <span>{language === 'fr' ? 'Droite' : 'Right'}</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            )}

            <div 
              ref={gridScrollRef}
              onClick={(e) => e.stopPropagation()}
              className="my-3 w-full overflow-x-auto pb-2 custom-scrollbar touch-pan-x overscroll-x-contain"
            >
              <div className="flex justify-start sm:justify-center min-w-max w-max p-1">
                <div
                  className="grid gap-1 sm:gap-1.5 p-2 bg-purple-950/60 rounded-xl border border-amber-500/40 shadow-inner"
                  style={{
                    gridTemplateColumns: `repeat(${gridData.gridSize}, minmax(max-content, 1fr))`
                  }}
                >
                  {gridData.cells.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`flex items-center justify-center border rounded-lg bg-black/80 text-amber-300 font-mono font-bold shadow-sm transition-transform hover:scale-105 shrink-0 ${
                          gridData.gridSize <= 3
                            ? 'min-w-[56px] min-h-[56px] p-2 text-sm sm:text-base'
                            : gridData.gridSize === 4
                            ? 'min-w-[46px] min-h-[46px] p-1.5 text-xs sm:text-sm'
                            : gridData.gridSize === 5
                            ? 'min-w-[38px] min-h-[38px] p-1 text-[11px] sm:text-xs'
                            : gridData.gridSize === 6
                            ? 'min-w-[34px] min-h-[34px] p-1 text-[10px] sm:text-xs'
                            : gridData.gridSize === 7
                            ? 'min-w-[32px] min-h-[32px] p-0.5 text-[10px] sm:text-xs'
                            : gridData.gridSize === 12
                            ? 'min-w-[32px] min-h-[28px] p-0.5 text-[9px] sm:text-[10px]'
                            : 'min-w-[48px] sm:min-w-[60px] min-h-[34px] sm:min-h-[38px] p-0.5 sm:p-1 text-[10px] sm:text-xs' /* Default 9x9 Divine Names */
                        } ${
                          (rIdx + cIdx) % 2 === 0
                            ? 'border-amber-500/40 bg-purple-950/40'
                            : 'border-purple-500/30 bg-black/90'
                        }`}
                      >
                        <span className="whitespace-nowrap text-center font-bold px-0.5" dir="rtl">
                          {cell}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer Invocation */}
            <div className="text-center mt-3 pt-2 border-t border-purple-500/20">
              <p className="text-xs font-serif font-bold text-amber-300" dir="rtl">
                ۞ {gridData.footer} ۞
              </p>
              <p className="text-[10px] font-mono text-purple-300/80 mt-0.5">
                ✦ Khatim Lunar {sealTitle} ✦
              </p>
            </div>
          </div>

          {/* Full Screen Hover Overlay */}
          <div className="absolute inset-0 bg-purple-950/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-purple-950/90 text-amber-300 text-xs font-extrabold px-4 py-2 rounded-xl border border-amber-500/40 shadow-2xl flex items-center gap-2 uppercase tracking-wider">
              <Eye size={16} className="animate-pulse" />
              {language === 'fr' ? 'Agrandir Plein Écran' : 'Full Screen'}
            </span>
          </div>
        </div>
      ) : (
        /* ASCII Parchment View */
        <div
          onClick={onExpandFullScreen}
          className="group relative cursor-pointer w-full bg-black/95 border border-purple-500/40 hover:border-amber-400 p-4 sm:p-6 rounded-3xl shadow-2xl select-none min-h-[260px] flex flex-col items-center justify-center transition-all duration-300 overflow-x-auto"
          title={language === 'fr' ? 'Cliquer pour agrandir en plein écran' : 'Click to view full screen'}
        >
          <pre className="text-purple-300 font-mono text-xs sm:text-sm leading-relaxed py-2 tracking-tight text-center whitespace-pre max-w-full overflow-x-auto select-all">
            {asciiSymbol}
          </pre>

          <div className="absolute inset-0 bg-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-purple-950/90 text-amber-300 text-xs font-extrabold px-4 py-2 rounded-xl border border-amber-500/40 shadow-2xl flex items-center gap-2 uppercase tracking-wider">
              <Eye size={16} className="animate-pulse" />
              {language === 'fr' ? 'Agrandir Plein Écran' : 'Full Screen'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
