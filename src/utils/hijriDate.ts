export interface HijriDateResult {
  day: number;
  monthIndex: number; // 0-based: 0 = Muharram, 1 = Safar, ...
  monthNameFr: string;
  monthNameEn: string;
  monthNameHa: string;
  monthNameAr: string;
  year: number;
}

export const HIJRI_MONTHS_FR = [
  'Muḥarram', 'Ṣafar', 'Rabīʿ al-Awwal', 'Rabīʿ ath-Thānī',
  'Jumādā al-Ūlā', 'Jumādā ath-Thāniyah', 'Rajab', 'Shaʿbān',
  'Ramaḍān', 'Shawwāl', 'Dhū al-Qaʿdah', 'Dhū al-Ḥijjah'
];

export const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
];

export const HIJRI_MONTHS_HA = [
  'Al-Muharram', 'Safar', 'Rabi\'ul Awwal', 'Rabi\'uth Thani',
  'Jumadal Awwal', 'Jumadath Thani', 'Rajab', 'Sha\'ban',
  'Ramadana', 'Shawwal', 'Dhul Qa\'ada', 'Dhul Hijja'
];

export const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

export function calculateHijriDate(date: Date, offsetDays: number = 0): HijriDateResult {
  try {
    const offsetMs = Number(offsetDays || 0) * 86400000;
    const adjustedDate = new Date(date.getTime() + offsetMs);
    
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(adjustedDate);
    let day = 1;
    let monthIndex = 0;
    let year = 1448;
    
    parts.forEach(p => {
      if (p.type === 'day') day = parseInt(p.value, 10);
      if (p.type === 'month') monthIndex = (parseInt(p.value, 10) - 1 + 12) % 12;
      if (p.type === 'year') {
        const cleaned = parseInt(p.value.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(cleaned)) year = cleaned;
      }
    });

    return {
      day,
      monthIndex,
      monthNameFr: HIJRI_MONTHS_FR[monthIndex] || 'Ṣafar',
      monthNameEn: HIJRI_MONTHS_EN[monthIndex] || 'Safar',
      monthNameHa: HIJRI_MONTHS_HA[monthIndex] || 'Safar',
      monthNameAr: HIJRI_MONTHS_AR[monthIndex] || 'صفر',
      year
    };
  } catch (e) {
    console.error("Hijri calculation error:", e);
    return {
      day: 10,
      monthIndex: 1,
      monthNameFr: 'Ṣafar',
      monthNameEn: 'Safar',
      monthNameHa: 'Safar',
      monthNameAr: 'صفر',
      year: 1448
    };
  }
}
