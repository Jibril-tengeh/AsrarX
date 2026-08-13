export interface CauriShell {
  id: number;
  isOpen: boolean;
  rotation: number;
  xOffset: number;
  yOffset: number;
}

export function castCauris(count: 4 | 8 | 16): CauriShell[] {
  const shells: CauriShell[] = [];
  for (let i = 0; i < count; i++) {
    // Random boolean for open (aperture up) vs closed (back up)
    const isOpen = Math.random() < 0.52; // slight natural variance
    const rotation = Math.floor(Math.random() * 360);
    
    // Spread shells naturally inside canvas bounds
    const radius = Math.min(count * 8, 120);
    const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
    const distance = Math.random() * radius * 0.8 + radius * 0.2;
    
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;

    shells.push({
      id: i,
      isOpen,
      rotation,
      xOffset,
      yOffset,
    });
  }
  return shells;
}

export function getCauriResultKey(shells: CauriShell[]): string {
  const total = shells.length;
  const openCount = shells.filter((s) => s.isOpen).length;

  if (total === 4) {
    if (openCount === 0) return 'kole';
    if (openCount === 1) return 'afaa';
    if (openCount === 2) return 'eji';
    if (openCount === 3) return 'eta';
    return 'ero'; // 4 open
  }

  // For 8 or 16 cauris
  if (openCount === 0) return 'kole';
  if (openCount === total) return 'ero';
  if (openCount < total / 2) return 'majority_closed';
  if (openCount === total / 2) return 'balanced';
  return 'majority_open';
}

export const AZLAM_3_KEYS = ['amr', 'nahy', 'mutashabih'];
export const AZLAM_7_KEYS = ['amr', 'nahy', 'mutashabih', 'afa', 'mahl', 'rizq', 'safar', 'wafa'];

export function drawAzlamStick(mode: 3 | 7): string {
  const pool = mode === 3 ? AZLAM_3_KEYS : AZLAM_7_KEYS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
