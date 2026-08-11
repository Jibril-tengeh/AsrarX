import React, { useState, useMemo } from 'react';
import { Star, Sparkles, Info, Compass, RefreshCw, Feather, Shield, Eye } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface TilasimNujumTabProps {
  language: string;
}

interface BehenianStar {
  id: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicName: string;
  modernName: string;
  abjad: number;
  gemFr: string;
  gemEn: string;
  gemHa: string;
  plantFr: string;
  plantEn: string;
  plantHa: string;
  degreeFr: string;
  degreeEn: string;
  degreeHa: string;
  natureFr: string;
  natureEn: string;
  natureHa: string;
  incenseFr: string;
  incenseEn: string;
  incenseHa: string;
  color: string;
}

const BEHENIAN_STARS: BehenianStar[] = [
  {
    id: 'algol',
    nameFr: 'Algol (Râs al-Ghûl)',
    nameEn: 'Algol (Râs al-Ghûl)',
    nameHa: 'Algol (Kanta al-Ghul)',
    arabicName: 'رأس الغول',
    modernName: 'Beta Persei',
    abjad: 1035,
    gemFr: 'Diamant / Quartz Fumé',
    gemEn: 'Diamond / Smoked Quartz',
    gemHa: 'Dutsen Diamond',
    plantFr: 'Hellébore noir',
    plantEn: 'Black Hellebore',
    plantHa: 'Ciyawa al-Ghul',
    degreeFr: '26° Taureau (Froid & Sec)',
    degreeEn: '26° Taurus (Cold & Dry)',
    degreeHa: '26° Al-Thawr (Sanyi & Bushewa)',
    natureFr: 'Protection contre les entités & Banni',
    natureEn: 'Protection against entity & banishing',
    natureHa: 'Cariya daga Aljanu da maita',
    incenseFr: 'Myrrhe & Soufre noble',
    incenseEn: 'Myrrh & Noble Sulphur',
    incenseHa: 'Karanfani da Soufre',
    color: '#ef4444'
  },
  {
    id: 'pleiades',
    nameFr: 'Pléiades (Al-Thurayyâ)',
    nameEn: 'Pleiades (Al-Thurayyâ)',
    nameHa: 'Thurayya (Pléiades)',
    arabicName: 'الثريا',
    modernName: 'Eta Tauri',
    abjad: 1241,
    gemFr: 'Cristal de Roche / Quartz',
    gemEn: 'Rock Crystal / Quartz',
    gemHa: 'Dutsen Quartz Fari',
    plantFr: 'Fennouil & Camomille',
    plantEn: 'Fennel & Chamomile',
    plantHa: 'Fennel da Camomille',
    degreeFr: '00° Gémeaux (Chaud & Humide)',
    degreeEn: '00° Gemini (Hot & Moist)',
    degreeHa: '00° Al-Jawza (Zafi & Dumi)',
    natureFr: 'Abondance, Lumière & Guérison',
    natureEn: 'Abundance, Light & Healing',
    natureHa: 'Arziki, Haske da Magani',
    incenseFr: 'Oliban Mâle & Storax',
    incenseEn: 'Male Frankincense & Storax',
    incenseHa: 'Oliban da Storax',
    color: '#3b82f6'
  },
  {
    id: 'aldebaran',
    nameFr: 'Aldébaran (Al-Dabarân)',
    nameEn: 'Aldebaran (Al-Dabarân)',
    nameHa: 'Aldebaran (Al-Dabaran)',
    arabicName: 'الدبران',
    modernName: 'Alpha Tauri',
    abjad: 257,
    gemFr: 'Escarboucle / Rubis',
    gemEn: 'Carbuncle / Ruby',
    gemHa: 'Dutsen Rubis',
    plantFr: 'Laiteron & Chardon',
    plantEn: 'Milk Thistle',
    plantHa: 'Kaya ciyawa',
    degreeFr: '10° Gémeaux (Chaud & Sec)',
    degreeEn: '10° Gemini (Hot & Dry)',
    degreeHa: '10° Al-Jawza (Zafi & Bushewa)',
    natureFr: 'Éloquence, Victoire & Prestige',
    natureEn: 'Eloquence, Victory & Prestige',
    natureHa: 'Magana ta Basira da Nasara',
    incenseFr: 'Santal Rouge & Benjoin',
    incenseEn: 'Red Sandalwood & Benzoin',
    incenseHa: 'Sandal Jaji',
    color: '#f97316'
  },
  {
    id: 'capella',
    nameFr: 'Capella (Al-ʿAyyûq)',
    nameEn: 'Capella (Al-ʿAyyûq)',
    nameHa: 'Capella (Al-Ayyuq)',
    arabicName: 'العيوق',
    modernName: 'Alpha Aurigae',
    abjad: 217,
    gemFr: 'Saphir Bleu / Topaze',
    gemEn: 'Blue Sapphire / Topaz',
    gemHa: 'Dutsen Sapphire',
    plantFr: 'Thym sauvage & Menthe',
    plantEn: 'Wild Thyme & Mint',
    plantHa: 'Na\'ana da Thym',
    degreeFr: '22° Gémeaux (Chaud & Humide)',
    degreeEn: '22° Gemini (Hot & Moist)',
    degreeHa: '22° Al-Jawza (Zafi & Dumi)',
    natureFr: 'Honneurs, Faveurs des grands & Grâce',
    natureEn: 'Honors, Royal Favors & Grace',
    natureHa: 'Girma da Tagomashi a wajen sarakuna',
    incenseFr: 'Santal Blanc & Mastic',
    incenseEn: 'White Sandalwood & Mastic',
    incenseHa: 'Sandal Fari',
    color: '#f59e0b'
  },
  {
    id: 'sirius',
    nameFr: 'Sirius (Al-Shiʿrâ al-ʿAbûr)',
    nameEn: 'Sirius (Al-Shiʿrâ al-ʿAbûr)',
    nameHa: 'Sirius (Al-Shi\'ra)',
    arabicName: 'الشعرى عبور',
    modernName: 'Alpha Canis Majoris',
    abjad: 845,
    gemFr: 'Béryl / Aigue-Marine',
    gemEn: 'Beryl / Aquamarine',
    gemHa: 'Dutsen Aquamarine',
    plantFr: 'Genévrier & Armoise',
    plantEn: 'Juniper & Wormwood',
    plantHa: 'Genévrier da Armoise',
    degreeFr: '14° Cancer (Froid & Humide)',
    degreeEn: '14° Cancer (Cold & Moist)',
    degreeHa: '14° Al-Saratan (Sanyi & Dumi)',
    natureFr: 'Réconciliation, Paix & Clairvoyance',
    natureEn: 'Reconciliation, Peace & Vision',
    natureHa: 'Sassanci, Zaman lafiya da Hangen nesa',
    incenseFr: 'Musc Ambre & Bois d\'Aloès',
    incenseEn: 'Amber Musk & Agarwood',
    incenseHa: 'Musk da Agarwood',
    color: '#06b6d4'
  },
  {
    id: 'procyon',
    nameFr: 'Procyon (Al-Shiʿrâ al-Ghumaiṣâ)',
    nameEn: 'Procyon (Al-Shiʿrâ al-Ghumaiṣâ)',
    nameHa: 'Procyon (Al-Ghumaisa)',
    arabicName: 'الشعرى غميقاء',
    modernName: 'Alpha Canis Minoris',
    abjad: 1356,
    gemFr: 'Agate / Cornaline',
    gemEn: 'Agate / Carnelian',
    gemHa: 'Dutsen Agate',
    plantFr: 'Héliotrope & Souci',
    plantEn: 'Heliotrope & Marigold',
    plantHa: 'Furannin Héliotrope',
    degreeFr: '25° Cancer (Chaud & Humide)',
    degreeEn: '25° Cancer (Hot & Moist)',
    degreeHa: '25° Al-Saratan (Zafi & Dumi)',
    natureFr: 'Invisibilité aux ennemis & Charme',
    natureEn: 'Protection from enemies & Charm',
    natureHa: 'Kariya daga makiya da Sirrin Kwarjini',
    incenseFr: 'Oliban & Fleur d\'Oranger',
    incenseEn: 'Frankincense & Orange Blossom',
    incenseHa: 'Oliban da Furan Lemun Zaki',
    color: '#10b981'
  },
  {
    id: 'regulus',
    nameFr: 'Régulus (Qalb al-Asad)',
    nameEn: 'Regulus (Qalb al-Asad)',
    nameHa: 'Regulus (Qalb Al-Asad)',
    arabicName: 'قلب الأسد',
    modernName: 'Alpha Leonis',
    abjad: 163,
    gemFr: 'Grenat / Rubis Étoilé',
    gemEn: 'Garnet / Star Ruby',
    gemHa: 'Dutsen Grenat',
    plantFr: 'Armoise noble & Laurier',
    plantEn: 'Mugwort & Laurel',
    plantHa: 'Ganyen Laurier',
    degreeFr: '29° Lion (Chaud & Sec)',
    degreeEn: '29° Leo (Hot & Dry)',
    degreeHa: '29° Al-Asad (Zafi & Bushewa)',
    natureFr: 'Autorité Royale, Commandement & Gloire',
    natureEn: 'Royal Authority, Command & Glory',
    natureHa: 'Sarauta, Mulki da Dauka',
    incenseFr: 'Ambre Gris & Safran',
    incenseEn: 'Ambergris & Saffron',
    incenseHa: 'Ambergris da Safran',
    color: '#eab308'
  },
  {
    id: 'alkaid',
    nameFr: 'Alkaid (Al-Qâʾid)',
    nameEn: 'Alkaid (Al-Qâʾid)',
    nameHa: 'Alkaid (Al-Qa\'id)',
    arabicName: 'القائد',
    modernName: 'Eta Ursae Majoris',
    abjad: 185,
    gemFr: 'Magnétite / Hématite',
    gemEn: 'Magnetite / Hematite',
    gemHa: 'Dutsen Hematite',
    plantFr: 'Chicorée & Suie sacrée',
    plantEn: 'Chicory & Sacred Soot',
    plantHa: 'Chicorée da Ciyawa',
    degreeFr: '27° Vierge (Froid & Sec)',
    degreeEn: '27° Virgo (Cold & Dry)',
    degreeHa: '27° Al-Sunbulah (Sanyi & Bushewa)',
    natureFr: 'Protection contre poisons & Dissolution',
    natureEn: 'Protection from poison & Dissolution',
    natureHa: 'Kariya daga dafi da wargaza maita',
    incenseFr: 'Storax & Lavande',
    incenseEn: 'Storax & Lavender',
    incenseHa: 'Storax da Lavender',
    color: '#64748b'
  },
  {
    id: 'algorab',
    nameFr: 'Algorab (Al-Ghurâb)',
    nameEn: 'Algorab (Al-Ghurâb)',
    nameHa: 'Algorab (Al-Ghurab)',
    arabicName: 'الغراب',
    modernName: 'Delta Corvi',
    abjad: 1203,
    gemFr: 'Onyx Noir / Pierre de Lave',
    gemEn: 'Black Onyx / Lava Stone',
    gemHa: 'Dutsen Onyx Baki',
    plantFr: 'Bardane & Chardons noirs',
    plantEn: 'Burdock & Black Thistle',
    plantHa: 'Burdock da Ciyawar Kaya',
    degreeFr: '13° Balance (Froid & Sec)',
    degreeEn: '13° Libra (Cold & Dry)',
    degreeHa: '13° Al-Mizan (Sanyi & Bushewa)',
    natureFr: 'Répulsion des mauvais esprits & Ancrage',
    natureEn: 'Warding off evil spirits & Grounding',
    natureHa: 'Kora aljannu marasa kyau da daitawa',
    incenseFr: 'Myrrhe & Asafœtida',
    incenseEn: 'Myrrh & Asafoetida',
    incenseHa: 'Myrrhe da Asafœtida',
    color: '#475569'
  },
  {
    id: 'spica',
    nameFr: 'Spica (Al-Simâk al-Aʿzal)',
    nameEn: 'Spica (Al-Simâk al-Aʿzal)',
    nameHa: 'Spica (Al-Simak Al-A\'zal)',
    arabicName: 'السمارك الأعزل',
    modernName: 'Alpha Virginis',
    abjad: 172,
    gemFr: 'Émeraude / Péridot',
    gemEn: 'Emerald / Peridot',
    gemHa: 'Dutsen Emerald',
    plantFr: 'Sauge & Blé vert',
    plantEn: 'Sage & Green Wheat',
    plantHa: 'Ganyen Sage da Alkama',
    degreeFr: '23° Balance (Chaud & Humide)',
    degreeEn: '23° Libra (Hot & Moist)',
    degreeHa: '23° Al-Mizan (Zafi & Dumi)',
    natureFr: 'Richesse durable, Récolte & Sagesse',
    natureEn: 'Lasting Wealth, Harvest & Wisdom',
    natureHa: 'Arziki mai dorewa, Girbi da Hikima',
    incenseFr: 'Oliban Mâle & Musc',
    incenseEn: 'Male Frankincense & Musk',
    incenseHa: 'Oliban da Musk',
    color: '#10b981'
  },
  {
    id: 'arcturus',
    nameFr: 'Arcturus (Al-Simâk al-Râmiḥ)',
    nameEn: 'Arcturus (Al-Simâk al-Râmiḥ)',
    nameHa: 'Arcturus (Al-Simak Al-Ramih)',
    arabicName: 'السمارك الرامح',
    modernName: 'Alpha Boötis',
    abjad: 311,
    gemFr: 'Jaspe Rouge / Cornaline',
    gemEn: 'Red Jasper / Carnelian',
    gemHa: 'Dutsen Jaspe Jaji',
    plantFr: 'Plantain & Verveine',
    plantEn: 'Plantain & Vervain',
    plantHa: 'Ganyen Plantain da Verveine',
    degreeFr: '24° Balance (Chaud & Sec)',
    degreeEn: '24° Libra (Hot & Dry)',
    degreeHa: '24° Al-Mizan (Zafi & Bushewa)',
    natureFr: 'Guérison physique, Force & Justice',
    natureEn: 'Physical Healing, Strength & Justice',
    natureHa: 'Warkarwa daga ciwo, Karfi da Adalci',
    incenseFr: 'Santal Blanc & Aloès',
    incenseEn: 'White Sandalwood & Aloes',
    incenseHa: 'Sandal Fari da Aloes',
    color: '#8b5cf6'
  },
  {
    id: 'alphecca',
    nameFr: 'Alphecca (Al-Fakka / Gemma)',
    nameEn: 'Alphecca (Al-Fakka / Gemma)',
    nameHa: 'Alphecca (Al-Fakka)',
    arabicName: 'الفكة',
    modernName: 'Alpha Coronae Borealis',
    abjad: 205,
    gemFr: 'Topaze Dorée / Citrine',
    gemEn: 'Golden Topaz / Citrine',
    gemHa: 'Dutsen Topaze Zinariya',
    plantFr: 'Romarin & Menthe poivrée',
    plantEn: 'Rosemary & Peppermint',
    plantHa: 'Ganyen Rosemary da Na\'ana',
    degreeFr: '12° Scorpion (Chaud & Humide)',
    degreeEn: '12° Scorpio (Hot & Moist)',
    degreeHa: '12° Al-Aqrab (Zafi & Dumi)',
    natureFr: 'Amour pur, Attraction & Couronne divine',
    natureEn: 'Pure Love, Attraction & Divine Crown',
    natureHa: 'Soyayya ta gaskiya da Tagomashi',
    incenseFr: 'Benjoin Odorant & Musc',
    incenseEn: 'Fragrant Benzoin & Musk',
    incenseHa: 'Benjoin da Musk',
    color: '#ec4899'
  },
  {
    id: 'antares',
    nameFr: 'Antarès (Qalb al-ʿAqrab)',
    nameEn: 'Antares (Qalb al-ʿAqrab)',
    nameHa: 'Antares (Qalb Al-Aqrab)',
    arabicName: 'قلب العقرب',
    modernName: 'Alpha Scorpii',
    abjad: 163,
    gemFr: 'Améthyste / Rubis Sombre',
    gemEn: 'Amethyst / Dark Ruby',
    gemHa: 'Dutsen Amethyst',
    plantFr: 'Aristoloche & Poivre noir',
    plantEn: 'Birthwort & Black Pepper',
    plantHa: 'Ganyen Aristoloche da Barkono',
    degreeFr: '09° Sagittaire (Chaud & Sec)',
    degreeEn: '09° Sagittarius (Hot & Dry)',
    degreeHa: '09° Al-Qaws (Zafi & Bushewa)',
    natureFr: 'Courage guerrier, Victoire sur procès',
    natureEn: 'Warrior Courage, Legal Victory',
    natureHa: 'Jaruntaka a wajen yaki da shari\'a',
    incenseFr: 'Dragon Blood & Soufre',
    incenseEn: 'Dragon\'s Blood & Sulphur',
    incenseHa: 'Jinin Maciji (Dragon Blood)',
    color: '#dc2626'
  },
  {
    id: 'vega',
    nameFr: 'Véga (Al-Nasr al-Wâqiʿ)',
    nameEn: 'Vega (Al-Nasr al-Wâqiʿ)',
    nameHa: 'Vega (Al-Nasr Al-Waqi\')',
    arabicName: 'النسر الواقع',
    modernName: 'Alpha Lyrae',
    abjad: 438,
    gemFr: 'Chrysolite / Péridot Clair',
    gemEn: 'Chrysolite / Light Peridot',
    gemHa: 'Dutsen Chrysolite',
    plantFr: 'Sarriette & Thym',
    plantEn: 'Savory & Thyme',
    plantHa: 'Ganyen Sarriette da Thym',
    degreeFr: '15° Capricorne (Froid & Sec)',
    degreeEn: '15° Capricorn (Cold & Dry)',
    degreeHa: '15° Al-Jady (Sanyi & Bushewa)',
    natureFr: 'Sagesse occulte, Élévation spirituelle',
    natureEn: 'Occult Wisdom, Spiritual Elevation',
    natureHa: 'Ilimin Sirri da Daukakar Ruhu',
    incenseFr: 'Storax & Encens Mâle',
    incenseEn: 'Storax & Male Incense',
    incenseHa: 'Storax da Turaren Oliban',
    color: '#a855f7'
  },
  {
    id: 'denebalgedi',
    nameFr: 'Deneb Algedi (Dhanab al-Jady)',
    nameEn: 'Deneb Algedi (Dhanab al-Jady)',
    nameHa: 'Deneb Algedi (Dhanab Al-Jady)',
    arabicName: 'ذنب الجدي',
    modernName: 'Delta Capricorni',
    abjad: 769,
    gemFr: 'Chalcédoine / Agate Grise',
    gemEn: 'Chalcedony / Grey Agate',
    gemHa: 'Dutsen Chalcedony',
    plantFr: 'Marjolaine & Armoise',
    plantEn: 'Marjoram & Wormwood',
    plantHa: 'Ganyen Marjolaine',
    degreeFr: '23° Verseau (Froid & Humide)',
    degreeEn: '23° Aquarius (Cold & Moist)',
    degreeHa: '23° Al-Dalw (Sanyi & Dumi)',
    natureFr: 'Prostérité durable, Protection de la maison',
    natureEn: 'Lasting Prosperity, Home Protection',
    natureHa: 'Arziki mai dorewa da Kariya ga Gida',
    incenseFr: 'Myrrhe & Santal Blanc',
    incenseEn: 'Myrrh & White Sandalwood',
    incenseHa: 'Myrrhe da Sandal Fari',
    color: '#0284c7'
  }
];

export default function TilasimNujumTab({ language }: TilasimNujumTabProps) {
  const [selectedStarId, setSelectedStarId] = useState<string>('sirius');
  const [intentionText, setIntentionText] = useState<string>('Sagesse et Protection');

  const selectedStar = useMemo(() => {
    return BEHENIAN_STARS.find((s) => s.id === selectedStarId) || BEHENIAN_STARS[4];
  }, [selectedStarId]);

  const intentionAbjad = useMemo(() => calculateAbjadValue(intentionText) || 100, [intentionText]);
  const combinedTotal = useMemo(() => selectedStar.abjad + intentionAbjad, [selectedStar, intentionAbjad]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('behenian-sigil-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tilasim_nujum_${selectedStar.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400">
          <Star size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Tilasim al-Nujum (15 Behenian Fixed Stars)'
              : language === 'ha'
              ? 'Tilasim al-Nujum (Taurari 15 na Hermétisme)'
              : 'Tilasim al-Nujum (Sceaux des 15 Étoiles Béhéniennes)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Generates authentic hermetic sigils and talismanic parameters for the 15 Behenian fixed stars.'
              : language === 'ha'
              ? 'Siffofi da hatimai na musamman na taurari 15 na ilimin Hermetisme.'
              : 'Génère les sigils hermétiques traditionnels des 15 étoiles fixes avec pierres, plantes, encens et calcul d\'intention.'}
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Select Behenian Star:' : language === 'ha' ? 'Zabi Tauraro:' : 'Choisir l\'Étoile Béhénienne :'}
          </label>
          <select
            value={selectedStarId}
            onChange={(e) => setSelectedStarId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {BEHENIAN_STARS.map((s) => (
              <option key={s.id} value={s.id}>
                {language === 'en' ? s.nameEn : language === 'ha' ? s.nameHa : s.nameFr} ({s.arabicName} - {s.modernName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Personal Intention / Name:' : language === 'ha' ? 'Niyya / Sunan Mutum:' : 'Intention Spirituelle / Nom :'}
          </label>
          <input
            type="text"
            value={intentionText}
            onChange={(e) => setIntentionText(e.target.value)}
            placeholder="ex: Sagesse et Protection..."
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Main Sigil Visualizer & Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Sigil Display (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-950 via-slate-950 to-purple-950 rounded-3xl border border-amber-500/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{selectedStar.arabicName} ({selectedStar.modernName})</span>
          </div>

          <svg id="behenian-sigil-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="320" fill="#0b0f19" rx="20" />
            {/* Outer Protective Gold Ring */}
            <circle cx="160" cy="160" r="145" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,4" />
            <circle cx="160" cy="160" r="135" fill="#0f172a" stroke="#d97706" strokeWidth="2" />

            {/* Inner Sacred Geometry (8-pointed Star base) */}
            {[0, 45, 90, 135].map((angle) => (
              <line
                key={angle}
                x1="160"
                y1="30"
                x2="160"
                y2="290"
                stroke="#d97706"
                strokeWidth="1"
                opacity="0.3"
                transform={`rotate(${angle} 160 160)`}
              />
            ))}

            {/* Star Specific Traditional Sigil Glyphs */}
            <g stroke="#fef3c7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Central Sigil Line Sequence */}
              <path d="M 90 160 L 130 110 L 190 210 L 230 160" />
              <circle cx="90" cy="160" r="6" fill="#f59e0b" stroke="#fef3c7" />
              <circle cx="230" cy="160" r="6" fill="#f59e0b" stroke="#fef3c7" />

              {/* Crossbar Hooks (Tilasim Loops) */}
              <path d="M 130 110 L 130 85 M 120 85 L 140 85" />
              <circle cx="130" cy="75" r="5" fill="#f59e0b" stroke="#fef3c7" />
              <path d="M 190 210 L 190 235 M 180 235 L 200 235" />
              <circle cx="190" cy="245" r="5" fill="#f59e0b" stroke="#fef3c7" />

              {/* Center Star Glyph */}
              <polygon points="160,135 168,152 186,152 171,163 177,180 160,170 143,180 149,163 134,152 152,152" fill="#f59e0b" opacity="0.8" />
            </g>

            {/* Arabic Script Ring */}
            <text x="160" y="55" textAnchor="middle" fill="#fde68a" fontSize="16" fontFamily="serif" fontWeight="bold">
              {selectedStar.arabicName}
            </text>
            <text x="160" y="280" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily="monospace">
              {selectedStar.abjad} + {intentionAbjad} = {combinedTotal}
            </text>
          </svg>

          <div className="text-xs text-amber-200 font-mono">
            {language === 'en' ? 'Combined Sigil Abjad:' : 'Valeur Abjad Combinée :'} <span className="font-bold text-amber-400">{combinedTotal}</span>
          </div>

          <button
            onClick={handleDownloadSVG}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Download size={14} />
            <span>{language === 'en' ? 'Download Star Sigil (SVG)' : 'Télécharger le Sceau (SVG)'}</span>
          </button>
        </div>

        {/* Hermetic Correspondences & Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3">
            <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Compass size={16} />
              <span>
                {language === 'en' ? 'Hermetic Correspondences & Attributes' : 'Correspondances Hermétiques & Attributs'}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-amber-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Talismans Stone:' : 'Pierre Talismanique :'}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {language === 'en' ? selectedStar.gemEn : language === 'ha' ? selectedStar.gemHa : selectedStar.gemFr}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-amber-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Sacred Herb/Plant:' : 'Plante Sacrée :'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {language === 'en' ? selectedStar.plantEn : language === 'ha' ? selectedStar.plantHa : selectedStar.plantFr}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-amber-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Incense / Fumigation:' : 'Encens / Fumigation :'}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {language === 'en' ? selectedStar.incenseEn : language === 'ha' ? selectedStar.incenseHa : selectedStar.incenseFr}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-amber-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Zodiac Degree & Temperament:' : 'Degré Zodiaque & Tempérament :'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {language === 'en' ? selectedStar.degreeEn : language === 'ha' ? selectedStar.degreeHa : selectedStar.degreeFr}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Shield size={14} className="text-amber-500" />
              <span>{language === 'en' ? 'Spiritual Efficacy & Operation:' : 'Efficacité Spirituelle & Utilisation :'}</span>
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              {language === 'en' ? selectedStar.natureEn : language === 'ha' ? selectedStar.natureHa : selectedStar.natureFr}
            </p>
            <div className="pt-2 text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              {language === 'en'
                ? 'Engrave this seal on a silver plate or parchment while burning the star\'s incense during its exact astronomical transit.'
                : 'Zana wannan hatimi akan karfe ko takarda tare da kona turaren tauraro a daidai lokacin da tauraron ke haskawa.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
