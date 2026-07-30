import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, Shield, Leaf, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface IncenseItem {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  element: string;
  planet: string;
  badgeColor: string;
  descFr: string;
  descEn: string;
  descHa: string;
  virtuesFr: string[];
  virtuesEn: string[];
  virtuesHa: string[];
  ethicalSubstitutesFr: string;
  ethicalSubstitutesEn: string;
  ethicalSubstitutesHa: string;
}

const SACRED_INCENSES: IncenseItem[] = [
  {
    id: 'incense_luban',
    nameAr: 'اللُّبَان الذَّكَر',
    nameFr: 'Oliban Noble (Luban Dhakar)',
    nameEn: 'Noble Frankincense (Luban Dhakar)',
    nameHa: 'Luban Dankar (Oliban)',
    element: 'Feu / Air',
    planet: 'Soleil (Shams)',
    badgeColor: 'from-amber-500 to-yellow-600',
    descFr: 'Le roi des encens sacrés. Résine dorée récoltée sur l\'arbre Boswellia. Indispensable pour purifier les lieux, élever la vibration spirituelle et sanctifier l\'espace avant la récitation de la Barhatiah.',
    descEn: 'The king of sacred incenses. Golden resin harvested from the Boswellia tree. Essential for purifying spaces, raising spiritual frequencies, and sanctifying rooms prior to Barhatiah recitations.',
    descHa: "Sarkin turaren tsarki. Babban turare na za'afaran da ke wanke gida daga shaidanu da kara karfin addu'a.",
    virtuesFr: ['Purification spatiale absolue', 'Chasse les entités néfastes', 'Amplifie la concentration du zikr'],
    virtuesEn: ['Absolute spatial purification', 'Banishes low entities', 'Amplifies zikr focus'],
    virtuesHa: ['Tsarkake daki da wanke aljanu', 'Kara ingancin addu\'a', 'Samun natsuwa na ciki'],
    ethicalSubstitutesFr: 'Myrrhe naturelle, Copal blanc ou Résine de Pin pur.',
    ethicalSubstitutesEn: 'Natural Myrrh, White Copal, or pure Pine resin.',
    ethicalSubstitutesHa: 'Murr, White Copal ko turaren icce na pine.'
  },
  {
    id: 'incense_mastic',
    nameAr: 'المَسْطَكِي (المصطكى)',
    nameFr: 'Résine de Mastic (Mastaki)',
    nameEn: 'Mastic Resin (Mastaki)',
    nameHa: 'Mastaki (Pistacia)',
    element: 'Air / Eau',
    planet: 'Mercure (Utarid)',
    badgeColor: 'from-yellow-400 to-amber-500',
    descFr: 'Larmes de résine limpide du Pistacia lentiscus. Utilisée pour attirer la clarté mentale, sceller les alliances spirituelles nobles et favoriser la manifestation rapide des prières.',
    descEn: 'Limpid resin tears from Pistacia lentiscus. Used for mental clarity, sealing spiritual alliances, and accelerating prayer manifestation.',
    descHa: 'Tauraron turare fari sol domin samun basira, amsawa ta gaggawa da tsarkake rubutun hatimi.',
    virtuesFr: ['Clarté mentale & inspiration', 'Accélération des vœux', 'Douceur vibratoire'],
    virtuesEn: ['Mental clarity & inspiration', 'Vow acceleration', 'Gentle vibration'],
    virtuesHa: ['Karfin basira', 'Hanzarta amsawa', 'Kamshi mai dadi na aminci'],
    ethicalSubstitutesFr: 'Graines de Coriandre séchées, Résine de Dammar ou Benjoin doux.',
    ethicalSubstitutesEn: 'Dried Coriander seeds, Dammar resin, or sweet Benzoin.',
    ethicalSubstitutesHa: 'Kusbara (Coriander) ko Jawi.'
  },
  {
    id: 'incense_sang_dragon',
    nameAr: 'دَم الأَخَوَيْن',
    nameFr: 'Sang-de-Dragon (Dam al-Akhawayn)',
    nameEn: 'Dragon\'s Blood (Dam al-Akhawayn)',
    nameHa: "Jinin 'Yan Uwa (Dam al-Akhawayn)",
    element: 'Feu (Nar)',
    planet: 'Mars (Mirrikh)',
    badgeColor: 'from-red-600 to-rose-700',
    descFr: 'Résine rouge vif issue du Dracaena cinnabari. Un bouclier d\'une puissance colossale contre le mauvais œil, les sorcelleries agressives et les nœuds karmiques.',
    descEn: 'Vivid red resin from Dracaena cinnabari. A colossal protective shield against evil eye, aggressive sorcery, and karmic knots.',
    descHa: 'Turare mai ja domi garkuwa da karfi a kan sihiri da bakin ido da ruguza makiya.',
    virtuesFr: ['Garkuwa contre la sorcellerie', 'Rupture de malédictions', 'Protection martiale'],
    virtuesEn: ['Sorcery shield', 'Curse breaking', 'Martial protection'],
    virtuesHa: ['Karya ko wane ire sihiri', 'Garkuwa daga bakin ido', 'Kariyar jarumta'],
    ethicalSubstitutesFr: 'Poudre de Storax rouge, Sauge rouge ou Cannelle pure.',
    ethicalSubstitutesEn: 'Red Storax powder, Red Sage, or pure Cinnamon bark.',
    ethicalSubstitutesHa: 'Storax na ja ko Kirfa (Cinnamon).'
  },
  {
    id: 'incense_oudh',
    nameAr: 'العُود القَمَارِي (الألوة)',
    nameFr: 'Bois d\'Aloès Sacré (Oudh / Agalloch)',
    nameEn: 'Sacred Aloeswood (Oudh / Agarwood)',
    nameHa: 'Oudh (Turaren Cewar Icce)',
    element: 'Terre / Éther',
    planet: 'Soleil / Jupiter',
    badgeColor: 'from-amber-800 to-yellow-900',
    descFr: 'Le parfum des rois et des mystiques. Issu du cœur résineux de l\'Aquilaria. Émet une vibration royale captivante qui attire le prestige, la richesse et les rois spirituels.',
    descEn: 'The perfume of kings and mystics. Derived from resinous Aquilaria wood. Emits captivating royal vibrations attracting prestige, wealth, and spiritual guardians.',
    descHa: 'Turaren sarakuna na Oudh mai amfani ga daukaka, kwarjini da budewar arziqi na sarauta.',
    virtuesFr: ['Attraction du prestige & royauté', 'Harmonie des énergies supérieures', 'Parfum de sainteté'],
    virtuesEn: ['Prestige & royalty attraction', 'Higher energy alignment', 'Fragrance of sanctity'],
    virtuesHa: ['Kwarjini na mulki', 'Daukakar arziqi', 'Kamshi na girma'],
    ethicalSubstitutesFr: 'Bois de Santal ambré, Cèdre de l\'Atlas ou Vétiver royal.',
    ethicalSubstitutesEn: 'Ambered Sandalwood, Atlas Cedar, or royal Vetiver.',
    ethicalSubstitutesHa: 'Sandalwood ko Cèdre ko Turaren Jawi.'
  },
  {
    id: 'incense_jawi',
    nameAr: 'الجَاوِي الأَبْيَض',
    nameFr: 'Benjoin Blanc Sacré (Jawi Abiyad)',
    nameEn: 'White Benzoin (Jawi Abiyad)',
    nameHa: 'Jawi Fari (White Benzoin)',
    element: 'Eau / Air',
    planet: 'Vénus / Lune',
    badgeColor: 'from-emerald-600 to-teal-700',
    descFr: 'Résine balsamique issue de Styrax benzoin. Elle procure une atmosphère apaisante, guérit les cœurs anxieux et sert de pont pour les prières d\'amour et de santé.',
    descEn: 'Balsamic resin from Styrax benzoin. Provides soothing atmosphere, heals anxious hearts, and bridge prayers for love and health.',
    descHa: 'Turare fari mai sanya natsuwa da kwantar da hankali, lafiya da soyayya.',
    virtuesFr: ['Apaisement des angoisses', 'Bénédiction du foyer', 'Douceur rituelle'],
    virtuesEn: ['Anxiety relief', 'Home blessing', 'Ritual gentleness'],
    virtuesHa: ['Kwantar da hankali', 'Sanya albarka a gida', 'Makaranta addu\'a'],
    ethicalSubstitutesFr: 'Graines de Nigelle (Habbat al-Baraka), Gomme d\'Acacia ou Camphre doux.',
    ethicalSubstitutesEn: 'Black Seed (Habbat al-Baraka), Acacia Gum, or mild Camphor.',
    ethicalSubstitutesHa: 'Habbatussauda ko Gomme Acacia.'
  },
  {
    id: 'incense_saffron',
    nameAr: 'الزَّعْفَرَان المَلَكِي',
    nameFr: 'Encre de Safran & Musc (Za\'afaran)',
    nameEn: 'Royal Saffron & Musk (Za\'afaran)',
    nameHa: 'Za\'afaran (Saffron & Musk)',
    element: 'Feu / Lumière',
    planet: 'Soleil (Shams)',
    badgeColor: 'from-yellow-500 to-amber-600',
    descFr: 'L\'or rouge de la calligraphie sacrée. Utilisé pour composer l\'encre bénie avec de l\'eau de Zamzam et de l\'eau de rose pour tracer les Wafqs et Khatims de la Barhatiah.',
    descEn: 'The red gold of sacred calligraphy. Used to compose blessed ink with Zamzam and rosewater to draw Barhatiah Wafqs and Seals.',
    descHa: 'Zarar ja domin rubutun hatimi da tawadar za\'afaran tare da ruwan Zamzam da rosewater.',
    virtuesFr: ['Consécration des parchemins', 'Sceau d\'authenticité vibratoire', 'Lumière solaire'],
    virtuesEn: ['Parchment consecration', 'Vibrational authenticity seal', 'Solar light'],
    virtuesHa: ['Makaranta rubutun hatimi', 'Haske mai tsarki', 'Tsarkake tawada'],
    ethicalSubstitutesFr: 'Infusion de Curcuma bio pur mélangée à l\'eau de rose et une goutte de musc.',
    ethicalSubstitutesEn: 'Organic pure Turmeric infusion mixed with rosewater and a drop of musk.',
    ethicalSubstitutesHa: 'Kurkuma da ruwan rosewater da almiski.'
  }
];

export const IncenseEncyclopediaWidget: React.FC = () => {
  const { language } = useLanguage();
  const [selectedIncense, setSelectedIncense] = useState<IncenseItem>(SACRED_INCENSES[0]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 sm:p-7 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-bold">
            <Flame size={22} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-amber-300 flex items-center gap-2">
              {language === 'ha'
                ? 'Encyclopédie ta Turaren Tsarki da Substituts'
                : language === 'en'
                ? 'Sacred Incenses Encyclopedia & Ethical Substitutes'
                : 'Encyclopédie Visuelle des Encens & Matières Rituelles'}
              <span className="text-xs font-arabic px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                البَخُورُ المَقْدَسُ
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ha'
                ? 'Bayanan turaren zikiri da sauran madadin turare mai saukin samun'
                : language === 'en'
                ? 'Detailed guide on sacred resins, ritual virtues, and ethical accessible substitutes'
                : 'Guide complet des résines sacrées, leurs vertus et leurs substituts accessibles'}
            </p>
          </div>
        </div>
      </div>

      {/* Incense Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {SACRED_INCENSES.map((inc) => {
          const isSelected = inc.id === selectedIncense.id;
          return (
            <button
              key={inc.id}
              onClick={() => setSelectedIncense(inc)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg scale-105'
                  : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:border-gray-750'
              }`}
            >
              <span className={`w-8 h-8 rounded-full bg-gradient-to-r ${inc.badgeColor} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                🔥
              </span>
              <span className="text-xs font-bold line-clamp-1 dir-rtl font-arabic">
                {inc.nameAr.split(' ')[0]}
              </span>
              <span className="text-[10px] text-gray-300 line-clamp-1 font-medium">
                {language === 'ha' ? inc.nameHa.split(' ')[0] : language === 'en' ? inc.nameEn.split(' ')[0] : inc.nameFr.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Incense View */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-gray-950 via-amber-950/30 to-black border-2 border-amber-500/50 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
          <div className="space-y-1">
            <h4 className="text-xl font-extrabold text-amber-300 flex items-center gap-2">
              <span className="font-arabic">{selectedIncense.nameAr}</span>
              <span className="text-sm font-sans text-gray-300">
                ({language === 'ha' ? selectedIncense.nameHa : language === 'en' ? selectedIncense.nameEn : selectedIncense.nameFr})
              </span>
            </h4>
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                Element: {selectedIncense.element}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                Planet: {selectedIncense.planet}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-200 leading-relaxed bg-black/60 p-3.5 rounded-xl border border-gray-800">
          {language === 'ha' ? selectedIncense.descHa : language === 'en' ? selectedIncense.descEn : selectedIncense.descFr}
        </p>

        {/* Virtues Grid */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            {language === 'ha' ? 'Amfani da Tasiri na Ruhani:' : language === 'en' ? 'Sacred Ritual Virtues:' : 'Vertus & Propriétés Rituelles :'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(language === 'ha' ? selectedIncense.virtuesHa : language === 'en' ? selectedIncense.virtuesEn : selectedIncense.virtuesFr).map((v, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-gray-900 border border-amber-500/20 text-xs font-semibold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Substitutes Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-black border border-emerald-500/40 space-y-1.5">
          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <Leaf size={15} className="text-emerald-400" />
            {language === 'ha' ? 'Madadi Mai Saukin Samu (Substitut Éthique):' : language === 'en' ? 'Ethical & Accessible Substitute:' : 'Guide des Substituts Éthiques & Accessibles :'}
          </span>
          <p className="text-xs text-emerald-100 font-medium">
            {language === 'ha' ? selectedIncense.ethicalSubstitutesHa : language === 'en' ? selectedIncense.ethicalSubstitutesEn : selectedIncense.ethicalSubstitutesFr}
          </p>
        </div>
      </div>
    </div>
  );
};
