async function testSearch() {
  try {
    const resAr = await fetch('https://api.alquran.cloud/v1/surah/2/ar.alafasy');
    const arData = await resAr.json();
    const surahArabic = arData.data;

    const rawQuery = "الله";
    const queryLower = rawQuery.trim().toLowerCase();

    const normalizeAr = (text) => {
      return text
        .replace(/[\u064B-\u0652\u0670\u0653\u0654\u0655]/g, '')
        .replace(/\u0671/g, '\u0627')
        .toLowerCase();
    };

    const isAr = /[\u0600-\u06FF]/.test(rawQuery);
    const cleanQuery = isAr ? normalizeAr(rawQuery) : queryLower;

    console.log(`Query: "${rawQuery}" -> Clean query: "${cleanQuery}"`);
    console.log(`First 10 ayahs text:`);
    for (let i = 0; i < 10; i++) {
      const ayah = surahArabic.ayahs[i];
      const ayahAr = ayah.text || ayah.ar || '';
      const ayahClean = normalizeAr(ayahAr);
      const match = ayahClean.includes(cleanQuery);
      console.log(`Ayah ${ayah.numberInSurah}: Text: "${ayahAr.substring(0, 30)}..." Clean: "${ayahClean.substring(0, 30)}..." Match: ${match}`);
    }

    const matches = surahArabic.ayahs.filter((ayah) => {
      const ayahAr = ayah.text || ayah.ar || '';
      const ayahClean = normalizeAr(ayahAr);
      return ayahClean.includes(cleanQuery);
    });

    console.log(`Total matching ayahs for "${rawQuery}": ${matches.length}`);
  } catch (err) {
    console.error(err);
  }
}

testSearch();
