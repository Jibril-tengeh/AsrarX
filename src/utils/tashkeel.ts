/**
 * Global utility to automatically apply Tashkeel (Arabic diacritics / vocalization marks)
 * to Arabic text, names, and Wirds.
 * It uses a dictionary of common words/Wirds and falls back to a smart phonetic diacritics algorithm
 * for dynamically generated letters.
 */

// Dictionary of common terms and Wirds with their perfect Tashkeel representation
const TASHKEEL_DICTIONARY: Record<string, string> = {
  // Common Names of Allah and keywords
  'الله': 'اللَّهُ',
  'الرحمن': 'الرَّحْمَنُ',
  'الرحيم': 'الرَّحِيمُ',
  'الملك': 'الْمَلِكُ',
  'القدوس': 'الْقُدُّوسُ',
  'السلام': 'السَّلَامُ',
  'المؤمن': 'الْمُؤْمِنُ',
  'المهيمن': 'الْمُهَيْمِنُ',
  'العزيز': 'الْعَزِيزُ',
  'الجبار': 'الْجَبَّارُ',
  'المتكber': 'الْمُتَكَبِّرُ',
  'المتكبر': 'الْمُتَكَبِّرُ',
  'الخالق': 'الْخَالِقُ',
  'البارئ': 'الْبَارِئُ',
  'المصور': 'الْمُصَوِّرُ',
  'الغفار': 'الْغَفَّارُ',
  'القهار': 'الْقَهَّارُ',
  'الوهاب': 'الْوَهَّابُ',
  'الرزاق': 'الرَّزَّاقُ',
  'الفتاح': 'الْفَتَّاحُ',
  'العليم': 'الْعَلِيمُ',
  'القابض': 'الْقَابِضُ',
  'الباسط': 'الْبَاسِطُ',
  'الخافض': 'الْخَافِضُ',
  'الرافع': 'الرَّافِعُ',
  'المعز': 'الْمُعِزُّ',
  'المذل': 'الْمُذِلُّ',
  'السميع': 'السَّمِيعُ',
  'البصير': 'الْبَصِيرُ',
  'الحكم': 'الْحَكَمُ',
  'العدل': 'الْعَدْلُ',
  'اللطيف': 'اللَّطِيفُ',
  'الخبير': 'الْخَبِيرُ',
  'الحليم': 'الْحَلِيمُ',
  'العظيم': 'الْعَظِيمُ',
  'الغفور': 'الْغَفُورُ',
  'الشكور': 'الشَّكُورُ',
  'العلي': 'الْعَلِيُّ',
  'الكبير': 'الْكَبِيرُ',
  'الحفيظ': 'الْحَفِيظُ',
  'المقيت': 'الْمُقِيتُ',
  'الحسيب': 'الْحَسِيبُ',
  'الجليل': 'الْجَلِيلُ',
  'الكريم': 'الْكَرِيمُ',
  'الرقيب': 'الرَّقِيبُ',
  'المجيب': 'الْمُجِيبُ',
  'الواسع': 'الْوَاسِعُ',
  'الحكيم': 'الْحَكِيمُ',
  'الودود': 'الْوَدُودُ',
  'المجid': 'الْمَجِيدُ',
  'المجيد': 'الْمَجِيدُ',
  'الباعث': 'الْبَاعِثُ',
  'الشهid': 'الشَّهِيدُ',
  'الشهيد': 'الشَّهِيدُ',
  'الحق': 'الْحَقُّ',
  'الوكيل': 'الْوَكِيلُ',
  'القوي': 'الْقَوِيُّ',
  'المتين': 'الْمَتِينُ',
  'الولي': 'الْوَلِيُّ',
  'الحميد': 'الْحَمِيدُ',
  'المحصي': 'الْمُحْصِي',
  'المبدئ': 'الْمُبْدِئُ',
  'المعيد': 'الْمُعِيدُ',
  'المحيي': 'الْمُحْيِي',
  'المميت': 'الْمُمِيتُ',
  'الحي': 'الْحَيُّ',
  'القيوم': 'الْقَيُّومُ',
  'الواجد': 'الْوَاجِدُ',
  'الماجد': 'الْمَاجِدُ',
  'الواحد': 'الْوَاحِدُ',
  'الأحد': 'الْأَحَدُ',
  'الصمد': 'الصَّمَدُ',
  'القادر': 'الْقَادِرُ',
  'المقتدر': 'الْمُقْتَدِرُ',
  'المقدم': 'الْمُقَدِّمُ',
  'المؤخر': 'الْمُؤَخِّرُ',
  'الأول': 'الْأَوَّلُ',
  'الآخر': 'الْآخِرُ',
  'الظاهر': 'الظَّاهِرُ',
  'الباطن': 'الْبَاطِنُ',
  'الوالي': 'الْوَالِي',
  'المتعالي': 'الْمُتَعَالِي',
  'البر': 'الْبَرُّ',
  'التواب': 'التَّوَّابُ',
  'المنتقم': 'الْمُنْتَقِمُ',
  'العفو': 'العَفُوُّ',
  'الرؤوف': 'الرَّؤُوفُ',
  'مالك الملك': 'مَالِكُ الْمُلْكِ',
  'ذو الجلال والإكرام': 'ذُو الْجَلَالِ وَالْإِكْرَامِ',
  'المقسط': 'الْمُقْسِطُ',
  'الجامع': 'الْجَامِعُ',
  'الغني': 'الْغَنِيُّ',
  'المغني': 'الْمُغْنِي',
  'المانع': 'الْمَانِعُ',
  'الضار': 'الضَّارُّ',
  'النافع': 'النَّافِعُ',
  'النور': 'النُّورُ',
  'الهادي': 'الْهَادِي',
  'البديع': 'الْبَدِيعُ',
  'الباقي': 'الْبَاقِي',
  'الوارث': 'الْوَارِثُ',
  'الرشيد': 'الرَّشِيدُ',
  'الصبور': 'الصَّبُورُ',

  // Common phrases and Wirds
  'بسم الله': 'بِسْمِ اللَّهِ',
  'بسم الله الرحمن الرحيم': 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  'يا لطيف': 'يَا لَطِيفُ',
  'لا إله إلا الله': 'لَا إِلَهَ إِلَّا اللَّهُ',
  'الحمد لله': 'الْحَمْدُ لِلَّهِ',
  'سبحان الله': 'سُبْحَانَ اللَّهِ',
  'الله أكبر': 'اللَّهُ أَكْبَرُ',
  'أستغفر الله': 'أَسْتَغْفِرُ اللَّهَ',
  'لا حول ولا قوة إلا بالله': 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
};

// Check if a character is an Arabic letter
const isArabicLetter = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return code >= 0x0621 && code <= 0x064A;
};

// Check if character is a Tashkeel mark
const isTashkeel = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return code >= 0x064B && code <= 0x0652;
};

export function applyTashkeel(text: string): string {
  if (!text) return '';

  // 1. If text is entirely or partially in TASHKEEL_DICTIONARY, replace those parts
  let result = text;
  Object.keys(TASHKEEL_DICTIONARY).forEach(key => {
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedKey, 'g');
    result = result.replace(regex, TASHKEEL_DICTIONARY[key]);
  });

  // 2. Dynamic phonetic Tashkeel logic for untreated Arabic words
  const words = result.split(' ');
  const processedWords = words.map(word => {
    // If the word already contains Tashkeel diacritics, skip dynamic application to avoid duplicates
    const hasExistingTashkeel = word.split('').some(isTashkeel);
    if (hasExistingTashkeel) {
      return word;
    }

    const chars = word.split('');
    const newChars: string[] = [];

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      newChars.push(char);

      if (isArabicLetter(char)) {
        const nextChar = chars[i + 1];

        // Do not add diacritics if this letter is acting as a long vowel itself
        if (['ا', 'و', 'ي', 'ى', 'أ', 'إ', 'آ', 'ؤ', 'ئ'].includes(char)) {
          continue;
        }

        // Apply diacritic rules based on phonetic combination
        if (nextChar === 'ا') {
          newChars.push('َ'); // Fatha
        } else if (nextChar === 'و') {
          newChars.push('ُ'); // Damma
        } else if (nextChar === 'ي') {
          newChars.push('ِ'); // Kasra
        } else if (nextChar === 'ّ') {
          // Shadda is handled explicitly, do nothing
        } else if (nextChar && isArabicLetter(nextChar)) {
          // Alternating Fatha and Sukun for consonants
          if (i % 2 === 0) {
            newChars.push('َ'); // Fatha
          } else {
            newChars.push('ْ'); // Sukun
          }
        } else {
          // Last letter gets a default Damma
          newChars.push('ُ'); 
        }
      }
    }

    return newChars.join('');
  });

  return processedWords.join(' ');
}
