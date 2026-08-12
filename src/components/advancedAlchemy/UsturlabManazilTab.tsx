import React, { useState, useMemo } from 'react';
import { Compass, Sparkles, RefreshCw, Eye, Layers, RotateCcw } from 'lucide-react';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface UsturlabManazilTabProps {
  language: string;
}

interface LunarMansion {
  id: number;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicName: string;
  zodiacFr: string;
  zodiacEn: string;
  zodiacHa: string;
  declinationDeg: number;
  rightAscensionHours: number;
  angelFr: string;
  angelEn: string;
  angelHa: string;
  elementFr: string;
  elementEn: string;
  elementHa: string;
  incenseFr: string;
  incenseEn: string;
  incenseHa: string;
}

const MANAZIL_LIST: LunarMansion[] = [
  { id: 1, nameFr: "Al-Sharatain (Les Cornes)", nameEn: "Al-Sharatain (The Horns)", nameHa: "Al-Sharatain (Makafo)", arabicName: "الشرطين", zodiacFr: "00° Bélier - 12°51' Bélier", zodiacEn: "00° Aries - 12°51' Aries", zodiacHa: "00° Al-Hamal", declinationDeg: 15, rightAscensionHours: 1.2, angelFr: "Jibra'il", angelEn: "Gabriel", angelHa: "Jibril", elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", incenseFr: "Oliban Mâle", incenseEn: "Frankincense", incenseHa: "Oliban" },
  { id: 2, nameFr: "Al-Butain (Le Ventre)", nameEn: "Al-Butain (The Belly)", nameHa: "Al-Butain (Ciki)", arabicName: "البطين", zodiacFr: "12°51' Bélier - 25°42' Bélier", zodiacEn: "12°51' Aries - 25°42' Aries", zodiacHa: "12° Al-Hamal", declinationDeg: 21, rightAscensionHours: 2.8, angelFr: "Amwa'il", angelEn: "Amwail", angelHa: "Amwa'il", elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", incenseFr: "Benjoin Rouge", incenseEn: "Red Benzoin", incenseHa: "Benjoin Jaji" },
  { id: 3, nameFr: "Al-Thurayya (Les Pléiades)", nameEn: "Al-Thurayya (Pleiades)", nameHa: "Al-Thurayya (Taurari)", arabicName: "الثريا", zodiacFr: "25°42' Bélier - 08°34' Taureau", zodiacEn: "25°42' Aries - 08°34' Taurus", zodiacHa: "25° Al-Hamal", declinationDeg: 24, rightAscensionHours: 3.8, angelFr: "Sharfa'il", angelEn: "Sharfail", angelHa: "Sharfa'il", elementFr: "Air", elementEn: "Air", elementHa: "Iska", incenseFr: "Santal Blanc", incenseEn: "White Sandalwood", incenseHa: "Sandal Fari" },
  { id: 4, nameFr: "Al-Dabaran (L'Oeil du Taureau)", nameEn: "Al-Dabaran (Bull's Eye)", nameHa: "Al-Dabaran (Iton Sa'a)", arabicName: "الدبران", zodiacFr: "08°34' Taureau - 21°25' Taureau", zodiacEn: "08°34' Taurus - 21°25' Taurus", zodiacHa: "08° Al-Thawr", declinationDeg: 16, rightAscensionHours: 4.6, angelFr: "Samsama'il", angelEn: "Samsamail", angelHa: "Samsama'il", elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", incenseFr: "Myrrhe & Musc", incenseEn: "Myrrh & Musk", incenseHa: "Myrrhe da Musk" },
  { id: 5, nameFr: "Al-Haq'ah (La Tache Blanche)", nameEn: "Al-Haq'ah (White Spot)", nameHa: "Al-Haq'ah (Maka)", arabicName: "الهقعة", zodiacFr: "21°25' Taureau - 04°17' Gémeaux", zodiacEn: "21°25' Taurus - 04°17' Gemini", zodiacHa: "21° Al-Thawr", declinationDeg: 10, rightAscensionHours: 5.4, angelFr: "Kashfiya'il", angelEn: "Kashfiyail", angelHa: "Kashfiya'il", elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", incenseFr: "Camphre", incenseEn: "Camphor", incenseHa: "Camphre" },
  { id: 6, nameFr: "Al-Han'ah (La Marque)", nameEn: "Al-Han'ah (The Mark)", nameHa: "Al-Han'ah (Alama)", arabicName: "الهنعة", zodiacFr: "04°17' Gémeaux - 17°08' Gémeaux", zodiacEn: "04°17' Gemini - 17°08' Gemini", zodiacHa: "04° Al-Jawza", declinationDeg: 22, rightAscensionHours: 6.2, angelFr: "Jardya'il", angelEn: "Jardyail", angelHa: "Jardya'il", elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", incenseFr: "Storax", incenseEn: "Storax", incenseHa: "Storax" },
  { id: 7, nameFr: "Al-Dhira' (Le Bras)", nameEn: "Al-Dhira' (The Arm)", nameHa: "Al-Dhira' (Hannu)", arabicName: "الذراع", zodiacFr: "17°08' Gémeaux - 00° Cancer", zodiacEn: "17°08' Gemini - 00° Cancer", zodiacHa: "17° Al-Jawza", declinationDeg: 28, rightAscensionHours: 7.5, angelFr: "Azra'il", angelEn: "Azrael", angelHa: "Azra'il", elementFr: "Air", elementEn: "Air", elementHa: "Iska", incenseFr: "Santal Rouge", incenseEn: "Red Sandalwood", incenseHa: "Sandal Jaji" },
  { id: 8, nameFr: "Al-Nathrah (Le Nez du Lion)", nameEn: "Al-Nathrah (Lion's Nose)", nameHa: "Al-Nathrah (Hanci)", arabicName: "النثرة", zodiacFr: "00° Cancer - 12°51' Cancer", zodiacEn: "00° Cancer - 12°51' Cancer", zodiacHa: "00° Al-Saratan", declinationDeg: 18, rightAscensionHours: 8.7, angelFr: "Mika'il", angelEn: "Michael", angelHa: "Mikail", elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", incenseFr: "Oliban & Musc", incenseEn: "Frankincense & Musk", incenseHa: "Oliban da Musk" },
  { id: 9, nameFr: "Al-Tarf (Le Regard)", nameEn: "Al-Tarf (The Glance)", nameHa: "Al-Tarf (Kallo)", arabicName: "الطرف", zodiacFr: "12°51' Cancer - 25°42' Cancer", zodiacEn: "12°51' Cancer - 25°42' Cancer", zodiacHa: "12° Al-Saratan", declinationDeg: 12, rightAscensionHours: 9.3, angelFr: "Sarfya'il", angelEn: "Sarfyail", angelHa: "Sarfya'il", elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", incenseFr: "Mastique", incenseEn: "Mastic", incenseHa: "Mastique" },
  { id: 10, nameFr: "Al-Jabhah (Le Front)", nameEn: "Al-Jabhah (The Forehead)", nameHa: "Al-Jabhah (Goshi)", arabicName: "الجبهة", zodiacFr: "25°42' Cancer - 08°34' Lion", zodiacEn: "25°42' Cancer - 08°34' Leo", zodiacHa: "25° Al-Saratan", declinationDeg: 14, rightAscensionHours: 10.1, angelFr: "Anya'il", angelEn: "Anyail", angelHa: "Anya'il", elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", incenseFr: "Aloès", incenseEn: "Aloes", incenseHa: "Aloes" },
  { id: 11, nameFr: "Al-Zubrah (La Crinière)", nameEn: "Al-Zubrah (Mane)", nameHa: "Al-Zubrah (Gashin Zaki)", arabicName: "الزبرة", zodiacFr: "08°34' Lion - 21°25' Lion", zodiacEn: "08°34' Leo - 21°25' Leo", zodiacHa: "08° Al-Asad", declinationDeg: 20, rightAscensionHours: 11.2, angelFr: "Rukya'il", angelEn: "Rukyail", angelHa: "Rukya'il", elementFr: "Air", elementEn: "Air", elementHa: "Iska", incenseFr: "Safran", incenseEn: "Saffron", incenseHa: "Safran" },
  { id: 12, nameFr: "Al-Sarfah (Le Changement)", nameEn: "Al-Sarfah (The Turn)", nameHa: "Al-Sarfah (Juya)", arabicName: "الصرفة", zodiacFr: "21°25' Lion - 04°17' Vierge", zodiacEn: "21°25' Leo - 04°17' Virgo", zodiacHa: "21° Al-Asad", declinationDeg: 14, rightAscensionHours: 11.8, angelFr: "Tawya'il", angelEn: "Tawyail", angelHa: "Tawya'il", elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", incenseFr: "Ambre Gris", incenseEn: "Ambergris", incenseHa: "Ambergris" },
  { id: 13, nameFr: "Al-Awwa (Le Chien)", nameEn: "Al-Awwa (The Dog)", nameHa: "Al-Awwa (Kare)", arabicName: "العواء", zodiacFr: "04°17' Vierge - 17°08' Vierge", zodiacEn: "04°17' Virgo - 17°08' Virgo", zodiacHa: "04° Al-Sunbulah", declinationDeg: -1, rightAscensionHours: 12.3, angelFr: "Hamwa'il", angelEn: "Hamwail", angelHa: "Hamwa'il", elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", incenseFr: "Santal Blanc", incenseEn: "White Sandalwood", incenseHa: "Sandal Fari" },
  { id: 14, nameFr: "Al-Simak (L'Élevé)", nameEn: "Al-Simak (Unarmed)", nameHa: "Al-Simak (Daukaka)", arabicName: "السمارك", zodiacFr: "17°08' Vierge - 00° Balance", zodiacEn: "17°08' Virgo - 00° Libra", zodiacHa: "17° Al-Sunbulah", declinationDeg: -11, rightAscensionHours: 13.4, angelFr: "Israfil", angelEn: "Israfil", angelHa: "Israfil", elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", incenseFr: "Oliban", incenseEn: "Frankincense", incenseHa: "Oliban" },
  { id: 15, nameFr: "Al-Ghafr (Le Voile)", nameEn: "Al-Ghafr (The Veil)", nameHa: "Al-Ghafr (Lullobi)", arabicName: "الغفر", zodiacFr: "00° Balance - 12°51' Balance", zodiacEn: "00° Libra - 12°51' Libra", zodiacHa: "00° Al-Mizan", declinationDeg: -16, rightAscensionHours: 14.1, angelFr: "Luma'il", angelEn: "Lumail", angelHa: "Luma'il", elementFr: "Air", elementEn: "Air", elementHa: "Iska", incenseFr: "Musc Baki", incenseEn: "Black Musk", incenseHa: "Musk Baki" },
  { id: 16, nameFr: "Al-Zubana (Les Serres)", nameEn: "Al-Zubana (The Claws)", nameHa: "Al-Zubana (Kusu)", arabicName: "الزبانا", zodiacFr: "12°51' Balance - 25°42' Balance", zodiacEn: "12°51' Libra - 25°42' Libra", zodiacHa: "12° Al-Mizan", declinationDeg: -16, rightAscensionHours: 14.8, angelFr: "Sarha'il", angelEn: "Sarhail", angelHa: "Sarha'il", elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", incenseFr: "Myrrhe", incenseEn: "Myrrh", incenseHa: "Myrrhe" },
  { id: 17, nameFr: "Al-Iklil (La Couronne)", nameEn: "Al-Iklil (Crown)", nameHa: "Al-Iklil (Rawani)", arabicName: "الإكليل", zodiacFr: "25°42' Balance - 08°34' Scorpion", zodiacEn: "25°42' Libra - 08°34' Scorpio", zodiacHa: "25° Al-Mizan", declinationDeg: -22, rightAscensionHours: 15.9, angelFr: "Tatamya'il", angelEn: "Tatomyail", angelHa: "Tatamya'il", elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", incenseFr: "Benjoin", incenseEn: "Benzoin", incenseHa: "Benjoin" },
  { id: 18, nameFr: "Al-Qalb (Le Coeur)", nameEn: "Al-Qalb (The Heart)", nameHa: "Al-Qalb (Zuciya)", arabicName: "القلب", zodiacFr: "08°34' Scorpion - 21°25' Scorpion", zodiacEn: "08°34' Scorpio - 21°25' Scorpio", zodiacHa: "08° Al-Aqrab", declinationDeg: -26, rightAscensionHours: 16.5, angelFr: "Azra'il", angelEn: "Azrael", angelHa: "Azra'il", elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", incenseFr: "Storax & Oliban", incenseEn: "Storax & Incense", incenseHa: "Storax" },
  { id: 19, nameFr: "Al-Shaulah (L'Aiguillon)", nameEn: "Al-Shaulah (The Sting)", nameHa: "Al-Shaulah (Mashi)", arabicName: "الشولة", zodiacFr: "21°25' Scorpion - 04°17' Sagittaire", zodiacEn: "21°25' Scorpio - 04°17' Sagittarius", zodiacHa: "21° Al-Aqrab", declinationDeg: -37, rightAscensionHours: 17.5, angelFr: "Samsama'il", angelEn: "Samsamail", angelHa: "Samsama'il", elementFr: "Air", elementEn: "Air", elementHa: "Iska", incenseFr: "Santal Rouge", incenseEn: "Red Sandalwood", incenseHa: "Sandal Jaji" },
  { id: 20, nameFr: "Al-Na'am (Les Autruches)", nameEn: "Al-Na'am (The Ostriches)", nameHa: "Al-Na'am (Gurunku)", arabicName: "النعائم", zodiacFr: "04°17' Sagittaire - 17°08' Sagittaire", zodiacEn: "04°17' Sagittarius - 17°08' Sagittarius", zodiacHa: "04° Al-Qaws", declinationDeg: -21, rightAscensionHours: 18.2, angelFr: "Kashfiya'il", angelEn: "Kashfiyail", angelHa: "Kashfiya'il", elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", incenseFr: "Aloès", incenseEn: "Aloes", incenseHa: "Aloes" },
  { id: 21, nameFr: "Al-Baldah (La Cité)", nameEn: "Al-Baldah (The City)", nameHa: "Al-Baldah (Gari)", arabicName: "البلدة", zodiacFr: "17°08' Sagittaire - 00° Capricorne", zodiacEn: "17°08' Sagittarius - 00° Capricorn", zodiacHa: "17° Al-Qaws", declinationDeg: -22, rightAscensionHours: 19.1, angelFr: "Jibra'il", angelEn: "Gabriel", angelHa: "Jibril", elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", incenseFr: "Musc", incenseEn: "Musk", incenseHa: "Musk" },
  { id: 22, nameFr: "Sa'd al-Dhabih (L'Égorgeur)", nameEn: "Sa'd al-Dhabih (Slayer)", nameHa: "Sa'd al-Dhabih (Sanyi)", arabicName: "سعد الذابح", zodiacFr: "00° Capricorne - 12°51' Capricorne", zodiacEn: "00° Capricorn - 12°51' Capricorn", zodiacHa: "00° Al-Jady", declinationDeg: -15, rightAscensionHours: 20.3, angelFr: "Mika'il", angelEn: "Michael", angelHa: "Mikail", elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", incenseFr: "Oliban", incenseEn: "Frankincense", incenseHa: "Oliban" },
  { id: 23, nameFr: "Sa'd Bula' (L'Avaleur)", nameEn: "Sa'd Bula' (Devourer)", nameHa: "Sa'd Bula' (Hadiye)", arabicName: "سعد بلع", zodiacFr: "12°51' Capricorne - 25°42' Capricorne", zodiacEn: "12°51' Capricorn - 25°42' Capricorn", zodiacHa: "12° Al-Jady", declinationDeg: -11, rightAscensionHours: 21.0, angelFr: "Rukya'il", angelEn: "Rukyail", angelHa: "Rukya'il", elementFr: "Air", elementEn: "Air", elementHa: "Iska", incenseFr: "Camphre", incenseEn: "Camphor", incenseHa: "Camphre" },
  { id: 24, nameFr: "Sa'd al-Su'ud (Fortune des Fortunes)", nameEn: "Sa'd al-Su'ud (Luck of Lucks)", nameHa: "Sa me Sa'id (Alheri)", arabicName: "سعد السعود", zodiacFr: "25°42' Capricorne - 08°34' Verseau", zodiacEn: "25°42' Capricorn - 08°34' Aquarius", zodiacHa: "25° Al-Jady", declinationDeg: -5, rightAscensionHours: 21.8, angelFr: "Israfil", angelEn: "Israfil", angelHa: "Israfil", elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", incenseFr: "Santal Blanc", incenseEn: "White Sandalwood", incenseHa: "Sandal Fari" },
  { id: 25, nameFr: "Sa'd al-Akhbiyah (Les Tentes)", nameEn: "Sa'd al-Akhbiyah (Tents)", nameHa: "Sa'd al-Akhbiyah (Tents)", arabicName: "سعد الأخبية", zodiacFr: "08°34' Verseau - 21°25' Verseau", zodiacEn: "08°34' Aquarius - 21°25' Aquarius", zodiacHa: "08° Al-Dalw", declinationDeg: -1, rightAscensionHours: 22.5, angelFr: "Anya'il", angelEn: "Anyail", angelHa: "Anya'il", elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", incenseFr: "Safran", incenseEn: "Saffron", incenseHa: "Safran" },
  { id: 26, nameFr: "Al-Fargh al-Muqdim (Bec Antérieur)", nameEn: "Al-Fargh al-Muqdim (First Spout)", nameHa: "Al-Fargh (Mawaya 1)", arabicName: "الفرغ المقدم", zodiacFr: "21°25' Verseau - 04°17' Poissons", zodiacEn: "21°25' Aquarius - 04°17' Pisces", zodiacHa: "21° Al-Dalw", declinationDeg: 15, rightAscensionHours: 23.1, angelFr: "Sarfya'il", angelEn: "Sarfyail", angelHa: "Sarfya'il", elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", incenseFr: "Myrrhe", incenseEn: "Myrrh", incenseHa: "Myrrhe" },
  { id: 27, nameFr: "Al-Fargh al-Mu'akhar (Bec Postérieur)", nameEn: "Al-Fargh al-Mu'akhar (Second Spout)", nameHa: "Al-Fargh (Mawaya 2)", arabicName: "الفرغ المؤخر", zodiacFr: "04°17' Poissons - 17°08' Poissons", zodiacEn: "04°17' Pisces - 17°08' Pisces", zodiacHa: "04° Al-Hut", declinationDeg: 28, rightAscensionHours: 0.1, angelFr: "Jardya'il", angelEn: "Jardyail", angelHa: "Jardya'il", elementFr: "Air", elementEn: "Air", elementHa: "Iska", incenseFr: "Benjoin", incenseEn: "Benzoin", incenseHa: "Benjoin" },
  { id: 28, nameFr: "Al-Risha (Le Poisson / La Corde)", nameEn: "Al-Risha (The Cord)", nameHa: "Al-Risha (Sarkuta)", arabicName: "الرشاء", zodiacFr: "17°08' Poissons - 00° Bélier", zodiacEn: "17°08' Pisces - 00° Aries", zodiacHa: "17° Al-Hut", declinationDeg: 15, rightAscensionHours: 1.0, angelFr: "Azra'il", angelEn: "Azrael", angelHa: "Azra'il", elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", incenseFr: "Oliban & Storax", incenseEn: "Frankincense & Storax", incenseHa: "Oliban" }
];

export default function UsturlabManazilTab({ language }: UsturlabManazilTabProps) {
  const [selectedMansionId, setSelectedMansionId] = useState<number>(3);
  const [observerLat, setObserverLat] = useState<number>(33.5); // Latitude (e.g. Fès/Casablanca)
  const [viewAngle, setViewAngle] = useState<number>(45); // 3D rotation angle

  const mansion = useMemo(() => {
    return MANAZIL_LIST.find((m) => m.id === selectedMansionId) || MANAZIL_LIST[2];
  }, [selectedMansionId]);

  // Calculate Altitude and Azimuth in 3D relative to horizon
  const coordinates3D = useMemo(() => {
    // Altitude angle above horizon = 90 - latitude + declination
    let alt = 90 - Math.abs(observerLat) + mansion.declinationDeg;
    if (alt > 90) alt = 180 - alt;
    if (alt < 0) alt = Math.abs(alt);

    // Azimuth = rightAscension * 15 degrees
    const az = (mansion.rightAscensionHours * 15 + viewAngle) % 360;

    // Convert to 3D Cartesian coordinates on sphere radius 120
    const radAlt = (alt * Math.PI) / 180;
    const radAz = (az * Math.PI) / 180;

    const x = 160 + 120 * Math.cos(radAlt) * Math.sin(radAz);
    const y = 160 - 120 * Math.sin(radAlt);
    const z = 120 * Math.cos(radAlt) * Math.cos(radAz);

    return {
      altitudeDeg: Math.round(alt),
      azimuthDeg: Math.round(az),
      x,
      y,
      z,
    };
  }, [mansion, observerLat, viewAngle]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('usturlab-3d-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usturlab_manazil_${mansion.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
          <Compass size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Usturlab al-Manazil (3D Lunar Mansion Astrolabe)'
              : language === 'ha'
              ? 'Usturlab al-Manazil (Awon Manazil 3D na Wata)'
              : 'Usturlab al-Manazil (Astrolabe 3D des Demeures Lunaires)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Calculates 3D elevation altitude and azimuth of the 28 lunar mansions above the observer\'s horizon.'
              : language === 'ha'
              ? 'Auna tsawo (altitude) da alkibla (azimuth) na gidajen wata 28 bisa fuskar 3D.'
              : 'Calcul 3D de l\'altitude au-dessus de l\'horizon et de l\'azimut pour les 28 demeures lunaires (Manâzil al-Qamar).'}
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Select Lunar Mansion (1 to 28):' : language === 'ha' ? 'Zabi Gidan Wata (1-28):' : 'Choisir la Demeure Lunaire (1 à 28) :'}
          </label>
          <select
            value={selectedMansionId}
            onChange={(e) => setSelectedMansionId(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {MANAZIL_LIST.map((m) => (
              <option key={m.id} value={m.id}>
                #{m.id} {language === 'en' ? m.nameEn : language === 'ha' ? m.nameHa : m.nameFr} ({m.arabicName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Observer Latitude (°N):' : language === 'ha' ? 'Nisa daga Equatorial (°N):' : 'Latitude de l\'Observateur (°N) :'}
          </label>
          <input
            type="number"
            value={observerLat}
            onChange={(e) => setObserverLat(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? '3D Astrolabe Perspective Rotation:' : language === 'ha' ? 'Karkatar Usturlab 3D:' : 'Rotation 3D de l\'Astrolabe (°):'}
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={viewAngle}
            onChange={(e) => setViewAngle(Number(e.target.value))}
            className="w-full accent-indigo-600 mt-2"
          />
        </div>
      </div>

      {/* 3D Visual Astrolabe + Mansion Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Astrolabe SVG Container (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 rounded-3xl border border-indigo-500/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{mansion.arabicName} (#{mansion.id})</span>
          </div>

          <svg id="usturlab-3d-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="320" fill="#090d16" rx="20" />
            {/* Outer Astrolabe Brass Frame */}
            <circle cx="160" cy="160" r="150" fill="none" stroke="#818cf8" strokeWidth="3" />
            <circle cx="160" cy="160" r="140" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />

            {/* Horizon Plane Ellipse */}
            <ellipse cx="160" cy="160" rx="120" ry="40" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
            <text x="285" y="165" fill="#38bdf8" fontSize="10" fontFamily="sans-serif">Horizon</text>

            {/* Meridian Vertical Line */}
            <line x1="160" y1="20" x2="160" y2="300" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" />
            <text x="160" y="15" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="bold">Zenith (Z)</text>

            {/* Altitude Arc to Mansion Position */}
            <path d={`M 160 160 L ${coordinates3D.x} ${coordinates3D.y}`} stroke="#f59e0b" strokeWidth="3" />

            {/* Mansion Vector Star Node */}
            <circle cx={coordinates3D.x} cy={coordinates3D.y} r="8" fill="#f59e0b" stroke="#fef3c7" strokeWidth="2" />
            <circle cx={coordinates3D.x} cy={coordinates3D.y} r="14" fill="none" stroke="#f59e0b" opacity="0.5" />

            {/* Mansion Arabic Label */}
            <text x={coordinates3D.x} y={coordinates3D.y - 15} textAnchor="middle" fill="#fde68a" fontSize="13" fontFamily="serif" fontWeight="bold">
              {mansion.arabicName}
            </text>

            {/* Altitude Text */}
            <text x="160" y="280" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontFamily="monospace">
              Alt: {coordinates3D.altitudeDeg}° | Az: {coordinates3D.azimuthDeg}°
            </text>
          </svg>

          <ExportFormatButtons
            svgId="usturlab-3d-svg"
            filename={`usturlab_manazil_${mansion.id}`}
            title={language === 'en' ? `Astrolabe - ${mansion.nameEn}` : `Astrolabe - ${mansion.nameFr}`}
            subtitle={`Maison Lunaire #${mansion.id} (${mansion.arabicName})`}
            language={language}
          />
        </div>

        {/* Spiritual Correspondences (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <Eye size={16} />
              <span>{language === 'en' ? 'Mansion Astrological & Angelic Parameters:' : 'Paramètres Astrologiques & Angéliques :'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Zodiac Range:' : 'Secteur Zodiacal :'}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {language === 'en' ? mansion.zodiacEn : language === 'ha' ? mansion.zodiacHa : mansion.zodiacFr}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Ruling Angel:' : 'Ange Gouverneur :'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {language === 'en' ? mansion.angelEn : language === 'ha' ? mansion.angelHa : mansion.angelFr}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Element & Nature:' : 'Élément & Nature :'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {language === 'en' ? mansion.elementEn : language === 'ha' ? mansion.elementHa : mansion.elementFr}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Incense / Fumigation:' : 'Fumigation Recommandée :'}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {language === 'en' ? mansion.incenseEn : language === 'ha' ? mansion.incenseHa : mansion.incenseFr}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
