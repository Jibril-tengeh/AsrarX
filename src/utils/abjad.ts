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
  else if (n === 5) res += "ه";
  else if (n === 4) res += "د";
  else if (n === 3) res += "ج";
  else if (n === 2) res += "ب";
  else if (n === 1) res += "أ";

  return res || "٠";
}

/**
 * Vocalizes raw Abjad root letters for authentic Angelic name construction with Tashkeel
 */
export function vocalizeAbjadRoot(letters: string): string {
  const clean = letters.replace(/[\u0640\s]/g, '');
  if (!clean) return '';

  const chars = Array.from(clean);
  if (chars.length === 1) {
    return chars[0] === 'ا' || chars[0] === 'أ' ? 'أَ' : `${chars[0]}َ`;
  }

  let result = '';
  chars.forEach((ch, idx) => {
    let baseChar = ch;
    if (baseChar === 'ا' || baseChar === 'إ' || baseChar === 'آ') baseChar = 'أ';

    if (idx === 0) {
      result += `${baseChar}َ`;
    } else if (idx === 1 && chars.length >= 3 && !['أ', 'و', 'ي', 'ا'].includes(baseChar)) {
      result += `${baseChar}ْ`;
    } else {
      result += `${baseChar}َ`;
    }
  });

  return result;
}

export const FIRE_LETTERS = ['ا', 'أ', 'إ', 'آ', 'ه', 'ة', 'ط', 'م', 'ف', 'ش', 'ذ'];
export const AIR_LETTERS = ['ج', 'ز', 'ك', 'س', 'ق', 'ث', 'ظ'];
export const WATER_LETTERS = ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'غ'];
export const EARTH_LETTERS = ['ب', 'و', 'ؤ', 'ي', 'ى', 'ئ', 'ن', 'ص', 'ت', 'ض'];

export const COLD_LETTERS = [...WATER_LETTERS, ...EARTH_LETTERS];

export function getElementalBreakdown(input: string): { fire: number; air: number; water: number; earth: number } {
  if (!input) return { fire: 25, air: 25, water: 25, earth: 25 };

  let fireCount = 0;
  let airCount = 0;
  let waterCount = 0;
  let earthCount = 0;

  for (const char of input) {
    if (FIRE_LETTERS.includes(char)) fireCount++;
    else if (AIR_LETTERS.includes(char)) airCount++;
    else if (WATER_LETTERS.includes(char)) waterCount++;
    else if (EARTH_LETTERS.includes(char)) earthCount++;
  }

  const total = fireCount + airCount + waterCount + earthCount;
  if (total === 0) return { fire: 25, air: 25, water: 25, earth: 25 };

  return {
    fire: Math.round((fireCount / total) * 100),
    air: Math.round((airCount / total) * 100),
    water: Math.round((waterCount / total) * 100),
    earth: Math.round((earthCount / total) * 100),
  };
}
export function extractCelestialKhadimName(val: number): {
  name: string;
  invocation: string;
  displayText: string;
} {
  const rootLetters = numberToAbjadLetters(val);
  const vocalizedRoot = vocalizeAbjadRoot(rootLetters);
  const name = `${vocalizedRoot}ائِيلُ`;
  const invocation = `أَيُّهَا المَلَكُ ${name}`;

  return {
    name,
    invocation,
    displayText: `${name} (${invocation})`
  };
}
