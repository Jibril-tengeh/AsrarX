import { generateGraphicSymbol, generateGraphicSymbolV2 } from './mysticCalendarData';

export interface SealVersionInfo {
  version: number;
  title: string;
  symbol: string;
  description: string;
}

export function getSealVersionInfo(dayNum: number, versionNum: number, lang: string = 'fr'): SealVersionInfo {
  const day = Math.max(1, Math.min(30, dayNum));
  const baseVal = day * 111 + 786;

  switch (versionNum) {
    case 1:
      return {
        version: 1,
        title: lang === 'fr' ? "V1 : Wafq Abjad 3x3" : lang === 'ha' ? "V1: Hatimin Wafq" : "V1: Wafq Abjad 3x3",
        description: lang === 'fr' ? "Carré magique 3x3 canonique avec Miftah (Clé) et Mughlaq (Verrou)." : "Canonical 3x3 magic square with Miftah and Mughlaq.",
        symbol: generateGraphicSymbol(day)
      };
    case 2:
      return {
        version: 2,
        title: lang === 'fr' ? "V2 : Khatim An-Nur" : lang === 'ha' ? "V2: Khatim An-Nur" : "V2: Khatim An-Nur",
        description: lang === 'fr' ? "Sceau théurgique rectangulaire de rayonnement et d'illumination lunaire." : "Rectangular theurgic seal of lunar illumination.",
        symbol: generateGraphicSymbolV2(day)
      };
    case 3:
      return {
        version: 3,
        title: lang === 'fr' ? "V3 : Murabba' 4x4 Archangélique" : lang === 'ha' ? "V3: Hatimi 4x4 Mala'iku" : "V3: Murabba' 4x4 Archangelic",
        description: lang === 'fr' ? "Grille 4x4 invoquant les 4 Archanges Majeurs (Jibril, Mikail, Israfil, Azrail)." : "4x4 Grid invoking the 4 Major Archangels.",
        symbol: generateV3(day, baseVal)
      };
    case 4:
      return {
        version: 4,
        title: lang === 'fr' ? "V4 : Musaddas Sulayman (Étoile 6)" : lang === 'ha' ? "V4: Tauraruwar Annabi Sulaiman" : "V4: Musaddas 6-Star Seal",
        description: lang === 'fr' ? "Étoile Sulaymanique à 6 branches de protection et de souveraineté." : "6-pointed Sulaymanic star of protection.",
        symbol: generateV4(day, baseVal)
      };
    case 5:
      return {
        version: 5,
        title: lang === 'fr' ? "V5 : Mukhammas 5x5 Éléments" : lang === 'ha' ? "V5: Hatimi 5x5 Mahangar Element" : "V5: Mukhammas 5x5 Elements",
        description: lang === 'fr' ? "Sceau Pentagonal des 5 Éléments secrets (Feu, Air, Eau, Terre, Éther)." : "Pentagonal seal of the 5 secret elements.",
        symbol: generateV5(day, baseVal)
      };
    case 6:
      return {
        version: 6,
        title: lang === 'fr' ? "V6 : Daira Al-Ihattah (Cercle)" : lang === 'ha' ? "V6: Daira Al-Ihattah" : "V6: Daira Al-Ihattah (Circle)",
        description: lang === 'fr' ? "Cercle d'englobement et de bouclier aurique inviolable." : "Circle of total aura encirclement and protection.",
        symbol: generateV6(day, baseVal)
      };
    case 7:
      return {
        version: 7,
        title: lang === 'fr' ? "V7 : Muthamman Al-Arsh (8 Anges)" : lang === 'ha' ? "V7: Hatimin Mala'iku 8" : "V7: Muthamman 8 Archangels",
        description: lang === 'fr' ? "Étoile à 8 branches des Porteurs du Trône Céleste (Hamalat Al-Arsh)." : "8-pointed star of the Heavenly Throne Bearers.",
        symbol: generateV7(day, baseVal)
      };
    case 8:
      return {
        version: 8,
        title: lang === 'fr' ? "V8 : Sceau des 7 Rois Célestes" : lang === 'ha' ? "V8: Hatimin Sarakuna 7" : "V8: Seal of the 7 Kings",
        description: lang === 'fr' ? "Sceau d'allégeance des 7 Sages et des 7 gouverneurs planétaires." : "Seal of allegiance of the 7 spiritual planetary kings.",
        symbol: generateV8(day, baseVal)
      };
    case 9:
      return {
        version: 9,
        title: lang === 'fr' ? "V9 : Wafq Mutawassi' 5x5" : lang === 'ha' ? "V9: Wafq Mutawassi' 5x5" : "V9: Wafq Mutawassi' 5x5",
        description: lang === 'fr' ? "Matrice d'harmonie majeure 5x5 d'équilibre temporel." : "5x5 Matrix of high elemental balance.",
        symbol: generateV9(day, baseVal)
      };
    case 10:
      return {
        version: 10,
        title: lang === 'fr' ? "V10 : Sceau 7 Symboles Salomon" : lang === 'ha' ? "V10: Hatimin Alama 7" : "V10: 7 Salomon Seals",
        description: lang === 'fr' ? "Les 7 symboles majeurs secrets de l'Ism Allah Al-A'zam." : "The 7 major sacred symbols of the Supreme Divine Name.",
        symbol: generateV10(day, baseVal)
      };
    case 11:
      return {
        version: 11,
        title: lang === 'fr' ? "V11 : Talsam Al-Fath (Ouverture)" : lang === 'ha' ? "V11: Talsam Al-Fath" : "V11: Talsam Al-Fath",
        description: lang === 'fr' ? "Sceau de victoire spirituelle, de déblocage rapide et de succès." : "Talismanic seal of rapid victory and unlocking.",
        symbol: generateV11(day, baseVal)
      };
    case 12:
    default:
      return {
        version: 12,
        title: lang === 'fr' ? "V12 : Grand Sceau Suprême 7x7" : lang === 'ha' ? "V12: Babban Hatimi 7x7" : "V12: Supreme 7x7 Seal",
        description: lang === 'fr' ? "Grand Khatim Al-Jami' 7x7 de synthèses théurgique et d'accomplissement." : "Grand 7x7 Khatim of ultimate spiritual synthesis.",
        symbol: generateV12(day, baseVal)
      };
  }
}

function generateV3(day: number, baseVal: number): string {
  const v1 = baseVal + 1;
  const v2 = baseVal + 2;
  const v3 = baseVal + 3;
  const v4 = baseVal + 4;
  return `    🌟  Murabba' Al-Azam  🌟

         ☆   جِبْرَائِيلُ   ☆

جبرائيل ┌──────────────────────┐ ميكائيل
│ ${v1}   ${v2+12}   ${v3+3}   ${v4+5} │
│ ${v4+2}   ${v3+7}   ${v2+1}   ${v1+14} │
│ ${v2+6}   ${v1+9}   ${v4+11}  ${v3+4} │
│ ${v3+15}  ${v4+4}   ${v1+8}   ${v2+10} │
إسرافيل └──────────────────────┘ عزرائيل

         ☆   مِيكَائِيلُ  ☆

   ✦ MURABBA' AL-AZAM 4X4 - FORCES ARCHANGÉLIQUES ✦`;
}

function generateV4(day: number, baseVal: number): string {
  const s = day * 7;
  return `    ⚡  Musaddas Sulayman  ⚡

         ۞   خَاتَمُ سُلَيْمَانَ   ۞

ف ┌──────────────────────┐ ط
│ ${s+7}   ${s+14}   ${s+21}   ${s+28}  │
│ ${s+35}  ${s+42}   ${s+49}   ${s+56}  │
│ ${s+63}  ${s+70}   ${s+77}   ${s+84}  │
ح └──────────────────────┘ ن

         ۞   نَصْرٌ مِنَ اللَّهِ   ۞

   ✦ MUSADDAS SULAYMAN - ÉTOILE DE DOMINATION ✦`;
}

function generateV5(day: number, baseVal: number): string {
  const n = day * 15 + 100;
  return `    🔥  Mukhammas Al-Haykal 5x5  🔥

         ☆   نَارٌ هَوَاءٌ مَاءٌ تُرَابٌ   ☆

نار ┌───────────────────────────┐ تراب
│ ${n}   ${n+5}   ${n+10}  ${n+15}  ${n+20} │
│ ${n+20}  ${n}    ${n+5}   ${n+10}  ${n+15} │
│ ${n+15}  ${n+20}  ${n}    ${n+5}   ${n+10} │
│ ${n+10}  ${n+15}  ${n+20}  ${n}    ${n+5}  │
│ ${n+5}   ${n+10}  ${n+15}  ${n+20}  ${n}   │
ماء └───────────────────────────┘ هواء

         ☆   عَنَاصِرُ ٥   ☆

   ✦ MUKHAMMAS AL-HAYKAL 5X5 - ÉQUILIBRE ÉLÉMENTAIRE ✦`;
}

function generateV6(day: number, baseVal: number): string {
  const d = day * 11;
  return `    🛡️  Daira Al-Ihattah  🛡️

         ۞   دَائِرَةُ الْإِحَاطَةِ   ۞

ح ┌──────────────────────┐ ف
│ ${d+111}  ${d+222}  ${d+333}  ${d+444} │
│ ${d+555}  ${d+666}  ${d+777}  ${d+888} │
│ ${d+999}  ${d+786}  ${d+114}  ${d+666} │
ظ └──────────────────────┘ ظ

         ۞   اللَّهُ حَفِيظٌ   ۞

   ✦ DAIRA AL-IHATTAH - BOUCLIER CONCENTRIQUE ✦`;
}

function generateV7(day: number, baseVal: number): string {
  const b = day * 18 + 70;
  return `    👑  Muthamman Al-Arsh  👑

         ☆   حَمَلَةُ الْعَرْشِ   ☆

عرش ┌──────────────────────┐ نور
│ ${b}   ${b+8}   ${b+16}  ${b+24} │
│ ${b+24}  ${b+16}  ${b+8}   ${b}   │
│ ${b+8}   ${b}    ${b+24}  ${b+16} │
│ ${b+16}  ${b+24}  ${b}    ${b+8}  │
قدس └──────────────────────┘ عز

         ☆   ٨ مَلَائِكَةٍ   ☆

   ✦ MUTHAMMAN AL-ARSH - LES 8 ANGES DU TRÔNE ✦`;
}

function generateV8(day: number, baseVal: number): string {
  return `    👑  Khatim Al-Muluk As-Sab'ah  👑

         ۞   الملوك السبعة   ۞

روق ┌──────────────────────────────────────┐ كشف
│ روقيائيل  جبرائيل  سمسماييل  ميكاييل │
│ صرفيائيل  عنيائيل   كسفيائيل   مُحْرِزٌ │
صرف └──────────────────────────────────────┘ عني

         ۞   الْكَوَاكِبُ السَّبْعَةُ   ۞

   ✦ KHATIM AL-MULUK AS-SAB'AH - LES 7 ROIS CÉLESTES ✦`;
}

function generateV9(day: number, baseVal: number): string {
  const val = day * 9 + 50;
  return `    ⚖️  Wafq Mutawassi' 5x5  ⚖️

         ☆   وَفْقٌ مُتَوَسِّطٌ   ☆

عدل ┌───────────────────────────┐ حق
│ ${val+10}  ${val+15}  ${val+2}   ${val+8}   ${val+25} │
│ ${val+3}   ${val+9}   ${val+24}  ${val+11}  ${val+14} │
│ ${val+23}  ${val+12}  ${val+13}  ${val+16}  ${val+1}  │
│ ${val+17}  ${val+20}  ${val+7}   ${val+4}   ${val+22} │
│ ${val+6}   ${val+5}   ${val+21}  ${val+18}  ${val+19} │
رحمة └───────────────────────────┘ نور

         ☆   مُتَوَاسِعٌ ٥×٥   ☆

   ✦ WAFQ MUTAWASSI' 5X5 - ÉQUILIBRE PARFAIT ✦`;
}

function generateV10(day: number, baseVal: number): string {
  return `    🗝️  Ism Al-A'zam 7 Symboles  🗝️

         ۞   الْإِسْمُ الْأَعْظَمُ   ۞

اسم ┌─────────────────────────┐ اعظم
│  ⭐   ❚   ☤   ⬡   ✂   ⌘   𪞞 │
│  7    8   6   1   1   4   9  │
سر └─────────────────────────┘ نور

         ۞   الرَّمْزُ السَّبْعِيُّ   ۞

   ✦ KHATIM ISM AL-A'ZAM - LES 7 SYMBOLES SALOMONIQUES ✦`;
}

function generateV11(day: number, baseVal: number): string {
  const f = day * 19 + 284;
  return `    🔓  Talsam Al-Fath  🔓

         ☆   إِنَّا فَتَحْنَا لَكَ فَتْحًا   ☆

فتح ┌──────────────────────┐ نصر
│ ${f}   ${f+100}  ${f+50} │
│ ${f+50}  ${f}     ${f+100}│
│ ${f+100} ${f+50}   ${f}   │
عز └──────────────────────┘ خير

         ☆   فَتَّاحُ يَا عَلِيمُ   ☆

   ✦ TALSAM AL-FATH - OUVERTURE ET SUCCÈS FULGURANT ✦`;
}

function generateV12(day: number, baseVal: number): string {
  const z = day * 5 + 10;
  return `    👑  Al-Wafq Al-Jami' Akbar 7x7  👑

         ۞   الْوَفْقُ الْجَامِعُ الْأَكْبَرُ   ۞

جامع ┌─────────────────────────────────────────┐ أكبر
│ ${z+1}  ${z+2}  ${z+3}  ${z+4}  ${z+5}  ${z+6}  ${z+7}  │
│ ${z+8}  ${z+9}  ${z+10} ${z+11} ${z+12} ${z+13} ${z+14} │
│ ${z+15} ${z+16} ${z+17} ${z+18} ${z+19} ${z+20} ${z+21} │
│ ${z+22} ${z+23} ${z+24} ${z+25} ${z+26} ${z+27} ${z+28} │
│ ${z+29} ${z+30} ${z+31} ${z+32} ${z+33} ${z+34} ${z+35} │
│ ${z+36} ${z+37} ${z+38} ${z+39} ${z+40} ${z+41} ${z+42} │
│ ${z+43} ${z+44} ${z+45} ${z+46} ${z+47} ${z+48} ${z+49} │
محيط └─────────────────────────────────────────┘ نور

         ۞   حُرُوفُ ٢٨ + ٧   ۞

   ✦ AL-WAFQ AL-JAMI' AL-AKBAR 7X7 - APOGÉE SPIRITUELLE ✦`;
}
