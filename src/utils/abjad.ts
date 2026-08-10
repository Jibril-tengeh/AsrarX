const abjadMashriqi: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30,
  'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400,
  'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000
};

export function calculateAbjadValue(input: string): number {
  if (!input) return 0;
  let total = 0;
  for (const char of input) {
    total += abjadMashriqi[char] || 0;
  }
  return total;
}

/**
 * Converts a positive number into its Abjad letter equivalent (Wafq al-Huruf / Littéral)
 * Example: 129 -> "قكط" (100 = ق, 20 = ك, 9 = ط)
 */
export function numberToAbjadLetters(num: number): string {
  if (num <= 0 || isNaN(num)) return "٠";
  let n = Math.floor(num);
  let res = "";

  // Thousands (غ = 1000)
  while (n >= 1000) {
    res += "غ";
    n -= 1000;
  }

  // Hundreds
  if (n >= 900) { res += "ظ"; n -= 900; }
  else if (n >= 800) { res += "ض"; n -= 800; }
  else if (n >= 700) { res += "ذ"; n -= 700; }
  else if (n >= 600) { res += "خ"; n -= 600; }
  else if (n >= 500) { res += "ث"; n -= 500; }
  else if (n >= 400) { res += "ت"; n -= 400; }
  else if (n >= 300) { res += "ش"; n -= 300; }
  else if (n >= 200) { res += "ر"; n -= 200; }
  else if (n >= 100) { res += "ق"; n -= 100; }

  // Tens
  if (n >= 90) { res += "ص"; n -= 90; }
  else if (n >= 80) { res += "ف"; n -= 80; }
  else if (n >= 70) { res += "ع"; n -= 70; }
  else if (n >= 60) { res += "س"; n -= 60; }
  else if (n >= 50) { res += "ن"; n -= 50; }
  else if (n >= 40) { res += "م"; n -= 40; }
  else if (n >= 30) { res += "ل"; n -= 30; }
  else if (n >= 20) { res += "ك"; n -= 20; }
  else if (n >= 10) { res += "ي"; n -= 10; }

  // Units
  if (n === 9) res += "ط";
  else if (n === 8) res += "ح";
  else if (n === 7) res += "ز";
  else if (n === 6) res += "و";
  else if (n === 5) res += "هـ";
  else if (n === 4) res += "د";
  else if (n === 3) res += "ج";
  else if (n === 2) res += "ب";
  else if (n === 1) res += "أ";

  return res || "٠";
}
