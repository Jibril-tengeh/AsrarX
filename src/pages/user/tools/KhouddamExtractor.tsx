import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Shield, Compass, Info, Flame, Wind, Droplets, Mountain, Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion } from 'motion/react';
import { applyTashkeel } from '../../../utils/tashkeel';
import { calculateAbjadValue } from '../../../utils/abjad';
import { useFeatures } from '../../../contexts/FeatureContext';

// Abjad mapping
const abjadMap: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  'ء': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ؤ': 6, 'ئ': 10, 'ى': 10, 'ة': 5
};

const numberToLetters = (num: number): string => {
  let result = '';
  let n = num;
  const thousands = Math.floor(n / 1000) * 1000;
  n %= 1000;
  const hundreds = Math.floor(n / 100) * 100;
  n %= 100;
  const tens = Math.floor(n / 10) * 10;
  const units = n % 10;

  const reverseAbjad: Record<number, string> = {};
  Object.keys(abjadMap).forEach(key => {
    reverseAbjad[abjadMap[key]] = key;
  });

  if (units > 0 && reverseAbjad[units]) result += reverseAbjad[units];
  if (tens > 0 && reverseAbjad[tens]) result += reverseAbjad[tens];
  if (hundreds > 0 && reverseAbjad[hundreds]) result += reverseAbjad[hundreds];
  if (thousands > 0 && reverseAbjad[thousands]) result += reverseAbjad[thousands];

  return result;
};

// Transliteration helper for Latin names to Arabic
const transliterateLatinToArabic = (text: string): string => {
  if (/[\u0600-\u06FF]/.test(text)) return text;
  return text
    .toLowerCase()
    .replace(/ou/g, 'و')
    .replace(/ch/g, 'ش')
    .replace(/kh/g, 'خ')
    .replace(/th/g, 'ث')
    .replace(/dh/g, 'ذ')
    .replace(/gh/g, 'غ')
    .replace(/sh/g, 'ش')
    .replace(/a/g, 'ا')
    .replace(/b/g, 'ب')
    .replace(/c/g, 'ك')
    .replace(/d/g, 'د')
    .replace(/e/g, 'ي')
    .replace(/f/g, 'ف')
    .replace(/g/g, 'ج')
    .replace(/h/g, 'ه')
    .replace(/i/g, 'ي')
    .replace(/j/g, 'ج')
    .replace(/k/g, 'ك')
    .replace(/l/g, 'ل')
    .replace(/m/g, 'م')
    .replace(/n/g, 'ن')
    .replace(/o/g, 'و')
    .replace(/p/g, 'ب')
    .replace(/q/g, 'ق')
    .replace(/r/g, 'ر')
    .replace(/s/g, 'س')
    .replace(/t/g, 'ت')
    .replace(/u/g, 'و')
    .replace(/v/g, 'ف')
    .replace(/w/g, 'و')
    .replace(/x/g, 'كس')
    .replace(/y/g, 'ي')
    .replace(/z/g, 'ز')
    .replace(/[^ء-ي]/g, '');
};

export const KhouddamExtractor: React.FC = () => {
  const { t } = useLanguage();
  const { isPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;

  // Personal inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [customValue, setCustomValue] = useState('');

  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    userArabic: string;
    motherArabic: string;
    userAdad: number;
    motherAdad: number;
    totalAdad: number;
    angelicName: string;
    angelicAdad: number;
    terrestrialName: string;
    terrestrialAdad: number;
    element: { name: string; icon: any; color: string; incense: string; direction: string; ruler: string };
    azimaText: string;
  } | null>(null);

  const calculateKhouddam = () => {
    let userAr = '';
    let motherAr = '';
    let userSum = 0;
    let motherSum = 0;
    let total = 0;

    if (customValue.trim() && /^\d+$/.test(customValue.trim())) {
      total = parseInt(customValue.trim(), 10);
      userAr = "Valeur Directe";
      motherAr = "-";
    } else {
      userAr = transliterateLatinToArabic(`${firstName} ${lastName}`);
      motherAr = transliterateLatinToArabic(motherName);

      userSum = calculateAbjadValue(userAr);
      motherSum = calculateAbjadValue(motherAr);
      total = userSum + motherSum;
    }

    if (total <= 51) {
      alert("La valeur totale doit être supérieure à 51 (Poids du suffixe A'il). Veuillez vérifier vos saisies.");
      return;
    }

    // Angelic extraction (-51 for A'il - إيل / 51)
    const angelicVal = total - 51;
    const angelicLetters = numberToLetters(angelicVal);
    const angelicNameFormatted = angelicLetters ? applyTashkeel(angelicLetters) + 'َائِيلُ' : 'عَزْرَائِيلُ';

    // Terrestrial servant (-316 for Yush - يوش / 316)
    const terrestrialVal = total > 316 ? total - 316 : total;
    const terrestrialLetters = numberToLetters(terrestrialVal);
    const terrestrialNameFormatted = terrestrialLetters ? applyTashkeel(terrestrialLetters) + 'يُوشُ' : 'طَوْشٌ';

    // Elemental attribution (Modulo 4)
    const remMod4 = total % 4;
    const elementsData = [
      { name: 'Feu (Nari - 🌿)', icon: Flame, color: 'text-rose-500', incense: 'Luban Mâle, Jawi', direction: 'Est', ruler: 'Dimanche (Soleil / Rofyail)' },
      { name: 'Air (Hawai - 🌬️)', icon: Wind, color: 'text-amber-500', incense: 'Santal Blanc, Oud', direction: 'Sud', ruler: 'Mercredi (Mercure / Mikail)' },
      { name: 'Eau (Ma\'i - 💧)', icon: Droplets, color: 'text-blue-500', incense: 'Eau de Rose, Musc Blanc', direction: 'Nord', ruler: 'Lundi (Lune / Jibrail)' },
      { name: 'Terre (Turabi - ⛰️)', icon: Mountain, color: 'text-emerald-500', incense: 'Santal Rouge, Myrrhe', direction: 'Ouest', ruler: 'Samedi (Saturne / Kaspyail)' }
    ];
    const element = elementsData[remMod4];

    // Personal Azima
    const azimaText = `أَقْسَمْتُ عَلَيْكُمْ يَا ${angelicNameFormatted} وَيَا ${terrestrialNameFormatted} بِحَقِّ اسْمِ اللَّهِ الْعَظِيمِ الأَعْظَمِ أَنْ تَكُونُوا عَوْنًا وَحَافِظًا لِي.`;

    setResult({
      userArabic: userAr,
      motherArabic: motherAr,
      userAdad: userSum,
      motherAdad: motherSum,
      totalAdad: total,
      angelicName: angelicNameFormatted,
      angelicAdad: angelicVal,
      terrestrialName: terrestrialNameFormatted,
      terrestrialAdad: terrestrialVal,
      element,
      azimaText
    });
  };

  const copyResultDetails = () => {
    if (disableDuaCopy || !result) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const details = `ALIGNEMENT ANGÉLIQUE & KHOUDDAM PERSONNELS
Poids Total (Adad Jummal) : ${result.totalAdad}
Gardien Céleste (Mala'ika) : ${result.angelicName} (Adad: ${result.angelicAdad})
Serviteur Terrestre (Khadim Ardi) : ${result.terrestrialName} (Adad: ${result.terrestrialAdad})
Élément Dominant : ${result.element.name}
Encens : ${result.element.incense}
Jour & Régent : ${result.element.ruler}
Invocation : ${result.azimaText}`;

    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-amber-500" />
            {t("khouddamPage.title", "Détecteur de Khouddam & Alignement Angélique")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("khouddamPage.subtitle", "Extraction du Gardien Céleste et du Serviteur Terrestre selon la méthode classique du Sirr (Nom + Mère).")}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8 space-y-6">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t("khouddamPage.spiritualFiliation", "Informations de Filiation Spirituelle (Hisab al-Um)")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t("khouddamPage.firstName", "Prénom")}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex: Ibrahim"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-gray-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t("khouddamPage.lastName", "Nom de Famille")}
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ex: Al-Hassan"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-gray-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t("khouddamPage.motherName", "Prénom de la Mère")}
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Ex: Maryam"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            {t("khouddamPage.orDirectInput", "Ou Saisie Directe par Nombre / Valeur Numérique (PM)")}
          </label>
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Ex: 129 ou 1000"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-sm font-mono text-gray-900 dark:text-white focus:outline-none"
          />
        </div>

        <button
          onClick={calculateKhouddam}
          className="w-full h-[54px] rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles size={18} />
          <span>{t("khouddamPage.extractBtn", "Extraire le Khadim & l'Ange Gardien")}</span>
        </button>
      </div>

      <div className="mb-8">
        <ToolInfoTooltip toolId="khouddam" />
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Main Entities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Angelic Entity */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full"></div>
              <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold block mb-1">
                {t("khouddamPage.celestialGuardian", "Le Gardien Céleste (Al-Malak Al-Ulwi)")}
              </span>
              <p className="text-indigo-200 text-xs mb-4">Adad : {result.totalAdad} - 51 = {result.angelicAdad}</p>
              
              <div className="text-4xl sm:text-5xl font-bold font-arabic my-4 text-amber-200" dir="rtl">
                {result.angelicName}
              </div>
              <p className="text-xs text-indigo-100/80 italic mt-2">
                Entité angélique lumineuse associée au poids mystique de votre âme.
              </p>
            </div>

            {/* Earthly Entity */}
            <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full"></div>
              <span className="text-xs uppercase tracking-widest text-amber-200 font-bold block mb-1">
                {t("khouddamPage.earthlyServant", "Le Serviteur Terrestre (Al-Khadim Al-Ardi)")}
              </span>
              <p className="text-amber-200 text-xs mb-4">Adad : {result.terrestrialAdad}</p>
              
              <div className="text-4xl sm:text-5xl font-bold font-arabic my-4 text-amber-100" dir="rtl">
                {result.terrestrialName}
              </div>
              <p className="text-xs text-amber-100/80 italic mt-2">
                Esprit de la sphère terrestre servant de relais d'exécution.
              </p>
            </div>
          </div>

          {/* Elemental & Spiritual Guidance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Compass className="text-amber-500" />
              {t("khouddamPage.celestialAlignments", "Correspondances & Alignement Céleste")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 block mb-1">{t("khouddamPage.dominantElement", "Élément Dominant")}</span>
                <span className={`font-bold flex items-center gap-2 ${result.element.color}`}>
                  <result.element.icon size={18} />
                  {result.element.name}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 block mb-1">{t("khouddamPage.incenseToBurn", "Encens à Brûler (Bakhour)")}</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{result.element.incense}</span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 block mb-1">{t("khouddamPage.dayAndRuler", "Jour & Régent Planétaire")}</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{result.element.ruler}</span>
              </div>
            </div>

            {/* Personal Invocation Box */}
            <div className="bg-amber-950/90 text-amber-100 rounded-2xl p-6 border border-amber-800/50 text-center space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                Invocation de Sollicitation (Azima al-Khadim)
              </span>
              <p className="text-xl sm:text-2xl font-quran leading-relaxed" dir="rtl">
                {result.azimaText}
              </p>
            </div>

            {!disableDuaCopy && (
              <div className="flex justify-end">
                <button
                  onClick={copyResultDetails}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  {copied ? <Check size={16} className="text-amber-200" /> : <Copy size={16} />}
                  <span>{copied ? "Copié !" : "Copier la Fiche d'Alignement"}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
