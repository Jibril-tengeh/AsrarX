const fs = require('fs');

try {
  const content = fs.readFileSync('public/quran.json', 'utf8');
  const quranData = JSON.parse(content);

  const normalizeArabic = (text) => {
    return text
      .replace(/[\u064B-\u0652\u0670\u0653\u0654\u0655]/g, '') // remove harakat / diacritics
      .replace(/\u0671/g, '\u0627') // normalize alif wasla to alif
      .replace(/[\u0622\u0623\u0625]/g, '\u0627') // normalize all kinds of alif to plain alif
      .replace(/\u0629/g, '\u0647') // normalize teh marbuta to heh
      .replace(/\u0649/g, '\u064A') // normalize alef maksura to yeh
      .toLowerCase();
  };

  const searchTerm = "الله";
  const queryStr = searchTerm.trim();
  const isArQuery = /[\u0600-\u06FF]/.test(queryStr);
  const cleanQueryStr = isArQuery ? normalizeArabic(queryStr) : queryStr.toLowerCase();

  console.log(`Searching for "${searchTerm}"...`);
  console.log(`isArQuery: ${isArQuery}, cleanQueryStr: "${cleanQueryStr}"`);

  const matches = [];
  for (const surah of quranData) {
    for (const ayah of surah.ayahs) {
      const ayahAr = ayah.ar || ayah.text_clean || '';
      const ayahClean = normalizeArabic(ayahAr);
      const ayahTr = (ayah.fr || ayah.en || ayah.text || '').toLowerCase();
      
      const isMatch = isArQuery 
        ? ayahClean.includes(cleanQueryStr)
        : ayahTr.includes(cleanQueryStr);

      if (isMatch) {
        matches.push({
          number: ayah.id || ayah.number || (surah.id * 1000 + (ayah.inSurah || ayah.numberInSurah)),
          text: ayahAr,
          translationText: ayah.fr || ayah.en || ayah.text || '',
          numberInSurah: ayah.inSurah || ayah.numberInSurah,
          surah: {
            number: surah.id,
            name: surah.name,
            englishName: surah.transliteration || surah.name_en || '',
            englishNameTranslation: surah.translation || ''
          }
        });
      }
    }
  }

  console.log(`Total matches found: ${matches.length}`);
  if (matches.length > 0) {
    console.log('First match:', matches[0]);
  }
} catch (e) {
  console.error(e);
}
