import { downloadCanvasImage } from './downloadHelper';
import { getApiUrl } from '../lib/api';

/**
 * Safely decodes AudioBuffer across all browsers (handling both callback and Promise APIs)
 */
async function decodeAudioDataSafely(audioCtx: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer | null> {
  const bufferCopy = arrayBuffer.slice(0);
  return new Promise((resolve) => {
    try {
      let resolved = false;
      const res = audioCtx.decodeAudioData(
        bufferCopy,
        (decoded) => {
          if (!resolved) {
            resolved = true;
            resolve(decoded);
          }
        },
        (err) => {
          console.warn("[verseVideoGenerator] decodeAudioData error callback:", err);
          if (!resolved) {
            resolved = true;
            resolve(null);
          }
        }
      );

      if (res && typeof (res as any).then === 'function') {
        (res as any)
          .then((decoded: AudioBuffer) => {
            if (!resolved) {
              resolved = true;
              resolve(decoded);
            }
          })
          .catch((err: any) => {
            console.warn("[verseVideoGenerator] decodeAudioData promise catch:", err);
            if (!resolved) {
              resolved = true;
              resolve(null);
            }
          });
      }
    } catch (e) {
      console.warn("[verseVideoGenerator] decodeAudioData exception:", e);
      resolve(null);
    }
  });
}

/**
 * Fetches and decodes Quran audio buffers reliably using local cache or server proxy
 */
async function fetchQuranAudioBuffer(directUrl: string, audioCtx: AudioContext): Promise<AudioBuffer | null> {
  const proxyUrl = getApiUrl(`/api/quran-audio-proxy?url=${encodeURIComponent(directUrl)}`);

  // 1. Try Cache API first (check proxyUrl first since same-origin cached responses have ok: true)
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await caches.open('quran-audio-cache');
      let cachedResponse = await cache.match(proxyUrl);
      if (!cachedResponse) {
        cachedResponse = await cache.match(directUrl);
      }

      if (cachedResponse) {
        try {
          const arrBuf = await cachedResponse.clone().arrayBuffer();
          if (arrBuf && arrBuf.byteLength > 0) {
            const decodedBuffer = await decodeAudioDataSafely(audioCtx, arrBuf);
            if (decodedBuffer) {
              console.log("[verseVideoGenerator] Successfully loaded audio from Cache API:", directUrl);
              return decodedBuffer;
            }
          }
        } catch (decodeErr) {
          console.warn("[verseVideoGenerator] Error decoding cached audio data:", decodeErr);
        }
      }
    }
  } catch (err) {
    console.warn("[verseVideoGenerator] Cache lookup notice:", err);
  }

  // 2. Fetch via server audio proxy to avoid browser CORS issues during decodeAudioData
  try {
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const arrBuf = await res.arrayBuffer();
      // Cache response for future offline / video generation
      try {
        if (typeof window !== 'undefined' && 'caches' in window) {
          const cache = await caches.open('quran-audio-cache');
          await cache.put(proxyUrl, new Response(arrBuf.slice(0), {
            status: 200,
            headers: { 'Content-Type': 'audio/mpeg' }
          }));
        }
      } catch (_) {}

      const decodedBuffer = await decodeAudioDataSafely(audioCtx, arrBuf);
      if (decodedBuffer) {
        console.log("[verseVideoGenerator] Successfully fetched audio via proxy:", directUrl);
        return decodedBuffer;
      }
    }
  } catch (err) {
    console.warn("[verseVideoGenerator] Proxy fetch notice:", err);
  }

  // 3. Fallback: try direct fetch
  try {
    const res = await fetch(directUrl);
    if (res.ok) {
      const arrBuf = await res.arrayBuffer();
      const decodedBuffer = await decodeAudioDataSafely(audioCtx, arrBuf);
      if (decodedBuffer) {
        console.log("[verseVideoGenerator] Successfully fetched audio directly:", directUrl);
        return decodedBuffer;
      }
    }
  } catch (err) {
    console.warn("[verseVideoGenerator] Direct fetch notice:", err);
  }

  return null;
}

export interface VerseVideoOptions {
  verseTitle: string;
  arabicText: string;
  phoneticText?: string;
  translationText: string;
  language?: string; // 'fr' | 'en' | 'ha'
  theme?: 'starlight' | 'emerald' | 'amber' | 'parchment' | 'cosmic';
  verseNumber?: string; // e.g. "6:101", "2:189", "55:7-9"
  reciterApiId?: string;
  reciterName?: string;
  translationReciterApiId?: string;
  onProgress?: (progress: number, statusText: string) => void;
}

/**
 * Calculates global Quran Ayah index from surah:ayah string (e.g., "6:101" -> 890)
 */
export function getGlobalAyahNumber(verseNumberStr?: string): number | null {
  if (!verseNumberStr) return null;
  const match = verseNumberStr.match(/(\d+):(\d+)/);
  if (!match) return null;
  const surah = parseInt(match[1], 10);
  const ayah = parseInt(match[2], 10);

  // Cumulative ayah counts for surahs 1 through 114
  const ayahCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, // 1-10
    123, 111, 43, 52, 99, 128, 111, 110, 98, 135, // 11-20
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60, // 21-30
    34, 30, 73, 54, 45, 83, 182, 88, 75, 85, // 31-40
    54, 53, 89, 59, 37, 35, 38, 29, 18, 45, // 41-50
    60, 49, 62, 55, 78, 96, 29, 22, 24, 13, // 51-60
    14, 11, 11, 18, 12, 12, 30, 52, 52, 44, // 61-70
    28, 28, 20, 56, 40, 31, 50, 40, 46, 42, // 71-80
    29, 19, 36, 25, 22, 17, 19, 26, 30, 20, // 81-90
    15, 21, 11, 8, 8, 19, 5, 8, 8, 11, // 91-100
    11, 8, 3, 9, 5, 4, 7, 3, 6, 3, // 101-110
    6, 5, 6, 6 // 111-114
  ];

  if (surah < 1 || surah > 114) return null;
  let cumulative = 0;
  for (let i = 0; i < surah - 1; i++) {
    cumulative += ayahCounts[i];
  }
  return cumulative + ayah;
}

/**
 * Renders a high-resolution verse card on canvas for image or video rendering
 */
export function drawVerseCardOnCanvas(
  canvas: HTMLCanvasElement,
  options: VerseVideoOptions,
  animTimeSec: number = 0,
  audioLevel: number = 0.5
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const theme = options.theme || 'starlight';
  const isParchment = theme === 'parchment';

  ctx.save();
  ctx.clearRect(0, 0, w, h);

  // --- 1. BACKGROUND ---
  if (isParchment) {
    // Vintage Parchment texture background
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, w, h);

    // Subtle grain pattern
    ctx.fillStyle = 'rgba(217, 119, 6, 0.04)';
    for (let i = 0; i < 3000; i++) {
      const rx = (Math.sin(i * 12.9898) * 43758.5453) % 1 * w;
      const ry = (Math.cos(i * 78.233) * 43758.5453) % 1 * h;
      ctx.fillRect(Math.abs(rx), Math.abs(ry), 2, 2);
    }
  } else if (theme === 'emerald') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#022c22');
    grad.addColorStop(0.5, '#064e3b');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (theme === 'amber') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1c1917');
    grad.addColorStop(0.5, '#451a03');
    grad.addColorStop(1, '#1c1917');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (theme === 'cosmic') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#090514');
    grad.addColorStop(0.5, '#2e1065');
    grad.addColorStop(1, '#090514');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else {
    // Starlight (default)
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // --- 2. ANIMATED GLOWING AURA ---
  if (animTimeSec > 0) {
    const cx = w / 2;
    const cy = h / 2 - 20;
    const pulseRadius = 260 + Math.sin(animTimeSec * 2) * 20 + audioLevel * 40;
    const auraGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, pulseRadius);

    if (isParchment) {
      auraGrad.addColorStop(0, 'rgba(217, 119, 6, 0.18)');
      auraGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
    } else {
      auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
      auraGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    }
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 3. BORDERS & ISLAMIC FRAME ---
  const inset = 40;
  ctx.lineWidth = isParchment ? 4 : 3;
  ctx.strokeStyle = isParchment ? '#78350f' : 'rgba(251, 191, 36, 0.6)';
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

  const innerInset = 52;
  ctx.lineWidth = 1;
  ctx.strokeStyle = isParchment ? 'rgba(120, 53, 15, 0.4)' : 'rgba(251, 191, 36, 0.3)';
  ctx.strokeRect(innerInset, innerInset, w - innerInset * 2, h - innerInset * 2);

  // Corner Accents
  const cornerSize = 24;
  const corners = [
    [inset + 8, inset + 8],
    [w - inset - 8, inset + 8],
    [inset + 8, h - inset - 8],
    [w - inset - 8, h - inset - 8]
  ];
  ctx.fillStyle = isParchment ? '#78350f' : '#fbbf24';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // --- 4. HEADER: BISMILLAH & ASRARHUB ---
  ctx.textAlign = 'center';

  // Bismillah Calligraphy
  ctx.font = '32px "Uthmani", "KFGQPC Uthmanic Script HAFS", "Amiri Quran", "Amiri", serif';
  ctx.fillStyle = isParchment ? '#451a03' : '#fef3c7';
  ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', w / 2, 120);

  // Divider Line
  ctx.beginPath();
  ctx.moveTo(w / 2 - 140, 145);
  ctx.lineTo(w / 2 + 140, 145);
  ctx.strokeStyle = isParchment ? 'rgba(120, 53, 15, 0.3)' : 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Verse Reference Title
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = isParchment ? '#92400e' : '#fcd34d';
  ctx.fillText(options.verseTitle.toUpperCase(), w / 2, 180);

  // --- 5. MAIN ARABIC TEXT ---
  // Use pure Uthmani script font stack without fake 'bold' synthesis to preserve delicate calligraphic ligatures (matches Image 2)
  ctx.font = '38px "Uthmani", "KFGQPC Uthmanic Script HAFS", "Amiri Quran", "Scheherazade New", "Amiri", serif';
  ctx.fillStyle = isParchment ? '#27272a' : '#ffffff';
  ctx.direction = 'rtl';

  // Multi-line text wrapping for Arabic
  const maxArabicWidth = w - 160;
  const arabicWords = options.arabicText.split(' ');
  let arabicLine = '';
  const arabicLines: string[] = [];

  for (let i = 0; i < arabicWords.length; i++) {
    const testLine = arabicLine ? `${arabicLine} ${arabicWords[i]}` : arabicWords[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxArabicWidth && i > 0) {
      arabicLines.push(arabicLine);
      arabicLine = arabicWords[i];
    } else {
      arabicLine = testLine;
    }
  }
  if (arabicLine) arabicLines.push(arabicLine);

  let arabicStartY = 250;
  const lineSpacing = 68;
  arabicLines.forEach((line) => {
    ctx.fillText(line, w / 2, arabicStartY);
    arabicStartY += lineSpacing;
  });

  ctx.direction = 'ltr';

  // --- 6. PHONETIC TEXT ---
  let currY = arabicStartY + 20;
  if (options.phoneticText) {
    ctx.font = 'italic 20px serif';
    ctx.fillStyle = isParchment ? '#78350f' : '#cbd5e1';

    // Wrap phonetic text
    const words = options.phoneticText.split(' ');
    let pLine = '';
    const pLines: string[] = [];
    for (let wIdx = 0; wIdx < words.length; wIdx++) {
      const testLine = pLine ? `${pLine} ${words[wIdx]}` : words[wIdx];
      if (ctx.measureText(testLine).width > w - 200) {
        pLines.push(pLine);
        pLine = words[wIdx];
      } else {
        pLine = testLine;
      }
    }
    if (pLine) pLines.push(pLine);

    pLines.slice(0, 2).forEach((l) => {
      ctx.fillText(`"${l}"`, w / 2, currY);
      currY += 30;
    });
    currY += 10;
  }

  // --- 7. TRANSLATION TEXT ---
  ctx.font = '22px sans-serif';
  ctx.fillStyle = isParchment ? '#451a03' : '#fef08a';

  const transWords = options.translationText.split(' ');
  let tLine = '';
  const tLines: string[] = [];
  for (let tIdx = 0; tIdx < transWords.length; tIdx++) {
    const testLine = tLine ? `${tLine} ${transWords[tIdx]}` : transWords[tIdx];
    if (ctx.measureText(testLine).width > w - 180) {
      tLines.push(tLine);
      tLine = transWords[tIdx];
    } else {
      tLine = testLine;
    }
  }
  if (tLine) tLines.push(tLine);

  tLines.slice(0, 4).forEach((l) => {
    ctx.fillText(`« ${l} »`, w / 2, currY);
    currY += 34;
  });

  // --- 8. AUDIO SPECTRUM VISUALIZER WAVE ---
  if (animTimeSec > 0) {
    const specY = h - 140;
    const barCount = 32;
    const barWidth = 12;
    const barGap = 6;
    const totalSpecWidth = barCount * (barWidth + barGap);
    const startX = (w - totalSpecWidth) / 2;

    ctx.fillStyle = isParchment ? 'rgba(180, 83, 9, 0.7)' : 'rgba(251, 191, 36, 0.85)';

    for (let b = 0; b < barCount; b++) {
      const waveVal = Math.sin(animTimeSec * 6 + b * 0.4) * 0.5 + 0.5;
      const bh = 8 + waveVal * 40 * (audioLevel + 0.3);
      const bx = startX + b * (barWidth + barGap);
      ctx.beginPath();
      ctx.roundRect(bx, specY - bh / 2, barWidth, bh, 4);
      ctx.fill();
    }
  }

  // --- 9. FOOTER & WATERMARK ---
  const lang = options.language || 'fr';
  const footerText = lang === 'en'
    ? '✦ ASRARHUB • WISDOM & CONTEMPLATION ✦'
    : lang === 'ha'
    ? '✦ ASRARHUB • HIKIMA DA TUNANI ✦'
    : '✦ ASRARHUB • SAGESSE & CONTEMPLATION ✦';

  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = isParchment ? 'rgba(120, 53, 15, 0.8)' : 'rgba(251, 191, 36, 0.9)';
  ctx.fillText(footerText, w / 2, h - 65);

  ctx.font = '13px sans-serif';
  ctx.fillStyle = isParchment ? 'rgba(120, 53, 15, 0.6)' : 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('asrarhub.com', w / 2, h - 42);

  ctx.restore();
}

/**
 * Downloads the verse card directly as an HD PNG image (Modern or Parchment style)
 */
export async function downloadVerseImage(options: VerseVideoOptions, filenamePrefix: string = 'verset'): Promise<boolean> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;

  drawVerseCardOnCanvas(canvas, options, 0, 0);

  const cleanTitle = options.verseTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const themeName = options.theme === 'parchment' ? 'parchemin' : 'image';
  const fileName = `${filenamePrefix}_${themeName}_${cleanTitle}.png`;

  return await downloadCanvasImage(canvas, fileName, true);
}

/**
 * Generates an animated Video clip (.webm or .mp4) with Arabic verse recitation audio + vocal translation narration
 */
export async function generateVerseVideo(options: VerseVideoOptions): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      options.onProgress?.(5, 'Initialisation du moteur vidéo & audio...');

      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;

      // Create Web Audio Context
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const audioDest = audioCtx.createMediaStreamDestination();

      options.onProgress?.(20, `Chargement de la récitation (${options.reciterName || 'Récitateur en cours'})...`);

      // --- FETCH ARABIC QURAN RECITATION AUDIO + TRANSLATION RECITATION AUDIO ---
      let arabicAudioBuffer: AudioBuffer | null = null;
      let translationAudioBuffer: AudioBuffer | null = null;
      const globalAyahNum = getGlobalAyahNumber(options.verseNumber);

      const reciterApiId = options.reciterApiId || 'ar.alafasy';
      const transEdition = options.translationReciterApiId || (options.language === 'en' ? 'en.walk' : 'fr.leclerc');

      if (globalAyahNum) {
        // Fetch current reciter's Arabic audio via proxy / cache
        const arabicAudioUrl = `https://cdn.islamic.network/quran/audio/128/${reciterApiId}/${globalAyahNum}.mp3`;
        arabicAudioBuffer = await fetchQuranAudioBuffer(arabicAudioUrl, audioCtx);

        // Fallback to ar.alafasy if primary reciter fetch failed
        if (!arabicAudioBuffer && reciterApiId !== 'ar.alafasy') {
          const fallbackArabicUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNum}.mp3`;
          arabicAudioBuffer = await fetchQuranAudioBuffer(fallbackArabicUrl, audioCtx);
        }

        // Fetch Translation audio recitation (e.g. Youssouf Leclerc fr.leclerc for French)
        options.onProgress?.(35, 'Chargement de la récitation de la traduction...');
        const transAudioUrl = `https://cdn.islamic.network/quran/audio/128/${transEdition}/${globalAyahNum}.mp3`;
        translationAudioBuffer = await fetchQuranAudioBuffer(transAudioUrl, audioCtx);

        // Fallback for French translation if initial fetch failed
        if (!translationAudioBuffer && options.language !== 'en' && transEdition !== 'fr.leclerc') {
          const fallbackFrUrl = `https://cdn.islamic.network/quran/audio/128/fr.leclerc/${globalAyahNum}.mp3`;
          translationAudioBuffer = await fetchQuranAudioBuffer(fallbackFrUrl, audioCtx);
        }
      }


      // Determine precise durations from actual audio buffers
      const arabicDuration = arabicAudioBuffer ? arabicAudioBuffer.duration : 6;
      const translationDuration = translationAudioBuffer ? translationAudioBuffer.duration : 0;
      
      // Total video duration: Arabic recitation + Translation recitation + smooth trailing gap
      const totalVideoDurationSec = arabicDuration + (translationDuration > 0 ? translationDuration + 0.8 : 0) + 1.8;

      options.onProgress?.(45, 'Préparation du flux audio & vidéo...');

      // --- STREAM RECORDING SETUP ---
      const canvasStream = canvas.captureStream(30); // 30 FPS
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDest.stream.getAudioTracks()
      ]);

      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 3500000 // 3.5 Mbps HD quality
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        try {
          audioCtx.close();
        } catch (_) {}

        const finalBlob = new Blob(chunks, { type: mimeType });
        options.onProgress?.(100, 'Vidéo générée avec succès !');
        resolve(finalBlob);
      };

      // Start Recording
      recorder.start(100);
      options.onProgress?.(55, 'Enregistrement de la séquence vidéo...');

      // --- PLAY ARABIC AUDIO RECITATION & TRANSLATION AUDIO ---
      const now = audioCtx.currentTime;

      // 1. Play Arabic Recitation (Selected Reciter)
      if (arabicAudioBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = arabicAudioBuffer;
        const verseGain = audioCtx.createGain();
        verseGain.gain.setValueAtTime(1.0, now + 0.3);
        source.connect(verseGain);
        verseGain.connect(audioDest);
        source.start(now + 0.3);
      }

      // 2. Play Translation Recitation (e.g. Youssouf Leclerc for French)
      if (translationAudioBuffer) {
        const transStartTime = now + 0.3 + arabicDuration + 0.5;
        const transSource = audioCtx.createBufferSource();
        transSource.buffer = translationAudioBuffer;
        const transGain = audioCtx.createGain();
        transGain.gain.setValueAtTime(1.0, transStartTime);
        transSource.connect(transGain);
        transGain.connect(audioDest);
        transSource.start(transStartTime);
      }

      // --- 5. ANIMATION LOOP ---
      let startTime = performance.now();

      const renderFrame = () => {
        const elapsedSec = (performance.now() - startTime) / 1000;
        const progressPercent = Math.min(99, Math.round((elapsedSec / totalVideoDurationSec) * 100));

        // Calculate audio level simulation
        const currentAudioLevel = elapsedSec < arabicDuration
          ? Math.abs(Math.sin(elapsedSec * 8)) * 0.7 + 0.3
          : elapsedSec < (arabicDuration + translationDuration)
          ? Math.abs(Math.cos(elapsedSec * 6)) * 0.5 + 0.2
          : 0.1;

        drawVerseCardOnCanvas(canvas, options, elapsedSec, currentAudioLevel);

        options.onProgress?.(
          progressPercent,
          elapsedSec < arabicDuration
            ? 'Récitation Arabe en cours...'
            : 'Vocalisation de la Traduction...'
        );

        if (elapsedSec < totalVideoDurationSec && recorder.state === 'recording') {
          requestAnimationFrame(renderFrame);
        } else {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      };

      renderFrame();

    } catch (err) {
      console.error('Error generating verse video:', err);
      reject(err);
    }
  });
}
