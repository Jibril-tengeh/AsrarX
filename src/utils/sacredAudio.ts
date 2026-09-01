import { get, set, del } from 'idb-keyval';

/**
 * Sacred Audio Engine & Ambient Background Music Manager
 * Features:
 * - Web Audio API Synthesizer (Sacred Frequencies 174Hz-963Hz, Binaural Beats, Procedural Ney Flute, Sacred Drones, Wind, Rain, Singing Bowls)
 * - Curated Ambient Background Music Tracks (Instant streaming)
 * - Custom Uploaded Music Files (Stored in IndexedDB without localStorage quota limits)
 * - Direct Audio URLs (MP3, WAV, AAC, M4A, OGG)
 * - Auto-Unlock on user interaction & state synchronization
 */

export interface CustomUploadedSound {
  id: string;
  name: string;
  url?: string;
  duration?: string;
  size?: number;
  type?: string;
  isPreset?: boolean;
  presetIcon?: string;
  presetDescription?: string;
  createdAt?: number;
}

export type PlaybackMode = 'frequency' | 'soundscape' | 'preset_music' | 'custom' | 'idle';

export interface AudioEngineState {
  isPlaying: boolean;
  mode: PlaybackMode;
  currentFreq: number;
  currentSoundscapeId: string;
  activeTrackId: string;
  activeTrackName: string;
  volume: number;
  timerMinutes: number;
  remainingSeconds: number;
  currentTime: number;
  duration: number;
  errorMessage?: string;
}

type StateListener = (state: AudioEngineState) => void;

// Built-in curated background music tracks (royalty-free ambient meditative streams)
export const PRESET_BACKGROUND_MUSIC: CustomUploadedSound[] = [
  {
    id: 'preset_sufi_ney',
    name: 'Flûte Ney Soufie & Zikr Méditatif',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=meditation-flute-111162.mp3',
    presetIcon: '🎵',
    presetDescription: 'Sérénité profonde, résonance de flûte orientale pour l\'apaisement de l\'âme.',
    isPreset: true
  },
  {
    id: 'preset_healing_432',
    name: 'Harmonies Célestes & Ondes 432Hz',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-light-meditation-ambient-14781.mp3',
    presetIcon: '✨',
    presetDescription: 'Ondes vibratoires pures favorisant la concentration spirituelle et la clarté mentale.',
    isPreset: true
  },
  {
    id: 'preset_peaceful_drone',
    name: 'Bourdonnement Mystique & Oud Andalou',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=deep-meditation-192828.mp3',
    presetIcon: '🧘',
    presetDescription: 'Ambiance contemplative profonde idéale pour le Wird quotidien et la lecture de secrets.',
    isPreset: true
  },
  {
    id: 'preset_celestial_rain',
    name: 'Pluie Douce Nocturne & Brise Apaisante',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_83d3e695d7.mp3?filename=gentle-rain-ambient-10940.mp3',
    presetIcon: '🌧️',
    presetDescription: 'Murmure d\'eau relaxant pour calmer le flux de pensées et favoriser l\'élévation.',
    isPreset: true
  },
  {
    id: 'preset_sahara_wind',
    name: 'Brise du Désert & Nuit Sous les Étoiles',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1e01.mp3?filename=wind-ambient-atmosphere-21396.mp3',
    presetIcon: '🌌',
    presetDescription: 'Immersion dans le silence et la paix des nuits du désert spirituel.',
    isPreset: true
  }
];

class SacredAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private oscDrone: OscillatorNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private noiseNode: AudioNode | null = null;
  
  private customAudioEl: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;

  private isPlaying: boolean = false;
  private currentMode: PlaybackMode = 'idle';
  private currentFreq: number = 432;
  private currentSoundscapeId: string = '';
  private activeTrackId: string = '';
  private activeTrackName: string = '';

  private volume: number = 0.40;
  private timerMinutes: number = 0;
  private timerInterval: any = null;
  private remainingSeconds: number = 0;

  private listeners: Set<StateListener> = new Set();
  private isUnlocked: boolean = false;

  constructor() {
    this.setupGlobalUnlockListener();
  }

  /**
   * Subscribe to reactive state updates
   */
  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(fn => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  public getState(): AudioEngineState {
    let currTime = 0;
    let dur = 0;
    if (this.customAudioEl) {
      currTime = this.customAudioEl.currentTime || 0;
      dur = this.customAudioEl.duration || 0;
    }
    return {
      isPlaying: this.isPlaying,
      mode: this.currentMode,
      currentFreq: this.currentFreq,
      currentSoundscapeId: this.currentSoundscapeId,
      activeTrackId: this.activeTrackId,
      activeTrackName: this.activeTrackName,
      volume: this.volume,
      timerMinutes: this.timerMinutes,
      remainingSeconds: this.remainingSeconds,
      currentTime: currTime,
      duration: isNaN(dur) ? 0 : dur,
    };
  }

  /**
   * Unlock AudioContext on first user touch/click
   */
  private setupGlobalUnlockListener() {
    if (typeof window === 'undefined') return;

    const unlock = async () => {
      if (this.isUnlocked) return;
      try {
        const ctx = this.getOrCreateContext();
        if (ctx && ctx.state === 'suspended') {
          await ctx.resume();
        }
        this.isUnlocked = true;
      } catch (e) {
        console.warn("[SacredAudio] Unlock warning:", e);
      }
    };

    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
  }

  private getOrCreateContext(): AudioContext | null {
    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      return this.ctx;
    } catch (e) {
      console.warn("[SacredAudio] AudioContext creation error:", e);
      return null;
    }
  }

  public async resumeContext(): Promise<AudioContext | null> {
    const ctx = this.getOrCreateContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn("[SacredAudio] resumeContext error:", e);
      }
    }
    return ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      } catch (_) {}
    }
    if (this.customAudioEl) {
      this.customAudioEl.volume = this.volume;
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public setTimer(minutes: number) {
    this.timerMinutes = minutes;
    this.remainingSeconds = minutes * 60;
    this.startTimerCountdown();
    this.notify();
  }

  private startTimerCountdown() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.timerMinutes <= 0) {
      this.remainingSeconds = 0;
      return;
    }

    this.remainingSeconds = this.timerMinutes * 60;
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 1) {
        this.remainingSeconds -= 1;
        this.notify();
      } else {
        this.remainingSeconds = 0;
        this.stop();
      }
    }, 1000);
  }

  /**
   * Immediately stops all oscillators, noise nodes, and custom audio
   */
  public stopImmediate() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Stop synth nodes
    if (this.osc1) {
      try { this.osc1.stop(); this.osc1.disconnect(); } catch (_) {}
      this.osc1 = null;
    }
    if (this.osc2) {
      try { this.osc2.stop(); this.osc2.disconnect(); } catch (_) {}
      this.osc2 = null;
    }
    if (this.oscDrone) {
      try { this.oscDrone.stop(); this.oscDrone.disconnect(); } catch (_) {}
      this.oscDrone = null;
    }
    if (this.lfoNode) {
      try { this.lfoNode.stop(); this.lfoNode.disconnect(); } catch (_) {}
      this.lfoNode = null;
    }
    if (this.noiseNode) {
      try { (this.noiseNode as any).stop?.(); this.noiseNode.disconnect(); } catch (_) {}
      this.noiseNode = null;
    }
    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch (_) {}
      this.masterGain = null;
    }

    // Stop custom/preset audio element
    if (this.customAudioEl) {
      try {
        this.customAudioEl.pause();
        this.customAudioEl.currentTime = 0;
        this.customAudioEl.src = '';
        this.customAudioEl.load();
      } catch (_) {}
      this.customAudioEl = null;
    }

    if (this.currentObjectUrl) {
      try { URL.revokeObjectURL(this.currentObjectUrl); } catch (_) {}
      this.currentObjectUrl = null;
    }

    this.isPlaying = false;
    this.currentMode = 'idle';
    this.activeTrackId = '';
    this.activeTrackName = '';
    this.notify();
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
      } catch (_) {}
    }

    if (this.customAudioEl) {
      try {
        this.customAudioEl.pause();
      } catch (_) {}
    }

    setTimeout(() => {
      this.stopImmediate();
    }, 380);
  }

  /**
   * Start pure Solfeggio frequency with binaural beat and harmonic sub-drone
   */
  public async startFrequency(freq: number = 432, binauralBeat: number = 4, volume: number = 0.40, timerMinutes: number = 0) {
    this.stopImmediate();
    const ctx = await this.resumeContext();
    if (!ctx) return;

    this.currentFreq = freq;
    this.volume = volume;
    this.currentMode = 'frequency';
    this.activeTrackId = `freq_${freq}`;
    this.activeTrackName = `${freq} Hz - Solfège Sacré`;
    this.timerMinutes = timerMinutes;

    try {
      const now = ctx.currentTime;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.25);
      masterGain.connect(ctx.destination);
      this.masterGain = masterGain;

      // 1. Primary pure sine tone (Left / Center)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // 2. Secondary binaural offset tone (Right)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq + binauralBeat, now);

      // 3. Warm sub-harmonic drone (1 octave down, soothing triangle wave)
      const oscDrone = ctx.createOscillator();
      oscDrone.type = 'triangle';
      oscDrone.frequency.setValueAtTime(Math.max(40, freq / 2), now);

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.12, now);
      oscDrone.connect(droneGain);

      osc1.connect(masterGain);
      osc2.connect(masterGain);
      droneGain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      oscDrone.start(now);

      this.osc1 = osc1;
      this.osc2 = osc2;
      this.oscDrone = oscDrone;
      this.isPlaying = true;

      if (timerMinutes > 0) {
        this.startTimerCountdown();
      }

      this.notify();
    } catch (err) {
      console.error("[SacredAudio] Error starting frequency:", err);
      this.stopImmediate();
    }
  }

  /**
   * Start procedural soundscapes (Ney Flute, Sacred Drone, Mystic Wind, Celestial Rain, Singing Bowls)
   */
  public async startSoundscape(soundscapeId: string, volume: number = 0.40, timerMinutes: number = 0) {
    this.stopImmediate();
    const ctx = await this.resumeContext();
    if (!ctx) return;

    this.currentMode = 'soundscape';
    this.currentSoundscapeId = soundscapeId;
    this.volume = volume;
    this.activeTrackId = soundscapeId;
    this.timerMinutes = timerMinutes;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.3);
      masterGain.connect(ctx.destination);
      this.masterGain = masterGain;

      if (soundscapeId === 'ney_flute') {
        this.activeTrackName = 'Flûte Ney Mystique & Harmoniques Soufies';
        // Mystic Ney (D4 293.66Hz with soft LFO vibrato & harmonics)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(293.66, now);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(4.5, now);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(3.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(293.66 * 1.5, now); // 5th harmonic (A4)
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.25, now);
        osc2.connect(g2);
        g2.connect(masterGain);

        osc.connect(masterGain);
        osc.start(now);
        osc2.start(now);

        this.osc1 = osc;
        this.osc2 = osc2;
        this.lfoNode = lfo;

      } else if (soundscapeId === 'sacred_drone') {
        this.activeTrackName = 'Bourdonnement Sacré Hijaz & Sub-Bass';
        // Deep Hijaz Meditation Drone (136.1Hz Om / Hijaz spiritual base)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(136.1, now);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(68.05, now); // Sub-bass

        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(204.15, now); // 5th harmonic

        osc1.connect(masterGain);
        osc2.connect(masterGain);
        osc3.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        this.osc1 = osc1;
        this.osc2 = osc2;
        this.oscDrone = osc3;

      } else if (soundscapeId === 'mystic_wind') {
        this.activeTrackName = 'Souffle du Désert & Brise Spirituelle';
        // Procedural Pink Noise Wind Generator with dynamic low-pass sweep
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, now); // slow breathing sweep
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(220, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start(now);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start(now);

        this.noiseNode = whiteNoise;
        this.lfoNode = lfo;

      } else {
        // Default to 432Hz
        await this.startFrequency(432, 4, volume, timerMinutes);
        return;
      }

      this.isPlaying = true;
      if (timerMinutes > 0) {
        this.startTimerCountdown();
      }
      this.notify();
    } catch (err) {
      console.error("[SacredAudio] Error starting soundscape:", err);
      this.stopImmediate();
    }
  }

  /**
   * Play curated preset ambient audio or custom uploaded track
   */
  public async playAudioTrack(track: CustomUploadedSound, volume: number = 0.40, timerMinutes: number = 0): Promise<boolean> {
    this.stopImmediate();
    this.volume = volume;
    this.currentMode = track.isPreset ? 'preset_music' : 'custom';
    this.activeTrackId = track.id;
    this.activeTrackName = track.name;
    this.timerMinutes = timerMinutes;

    try {
      let resolvedSrc = track.url || '';

      // 1. If this is an uploaded file stored in IndexedDB, fetch the blob
      if (!track.isPreset && (!resolvedSrc || resolvedSrc.startsWith('idb:'))) {
        const storedBlob = await get(`asrarhub_audio_blob_${track.id}`);
        if (storedBlob && (storedBlob instanceof Blob || storedBlob instanceof File)) {
          if (this.currentObjectUrl) {
            URL.revokeObjectURL(this.currentObjectUrl);
          }
          this.currentObjectUrl = URL.createObjectURL(storedBlob);
          resolvedSrc = this.currentObjectUrl;
        }
      }

      // If still empty and has id, try checking IndexedDB anyway
      if (!resolvedSrc && track.id) {
        const storedBlob = await get(`asrarhub_audio_blob_${track.id}`);
        if (storedBlob) {
          this.currentObjectUrl = URL.createObjectURL(storedBlob);
          resolvedSrc = this.currentObjectUrl;
        }
      }

      if (!resolvedSrc) {
        console.warn("[SacredAudio] No playable source URL for track:", track);
        this.stopImmediate();
        return false;
      }

      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = this.volume;
      audio.src = resolvedSrc;

      this.customAudioEl = audio;

      // Event handlers
      audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      audio.addEventListener('pause', () => {
        if (this.customAudioEl === audio) {
          this.isPlaying = false;
          this.notify();
        }
      });

      audio.addEventListener('timeupdate', () => {
        this.notify();
      });

      audio.addEventListener('error', (e) => {
        console.warn("[SacredAudio] Audio playback error:", audio.error, e);
        // If external URL failed, fallback gracefully to procedural synth
        if (track.isPreset) {
          console.log("[SacredAudio] Falling back to procedural soundscape for preset:", track.id);
          if (track.id.includes('ney')) {
            this.startSoundscape('ney_flute', this.volume, timerMinutes);
          } else if (track.id.includes('rain')) {
            this.startSoundscape('mystic_wind', this.volume, timerMinutes);
          } else {
            this.startFrequency(432, 4, this.volume, timerMinutes);
          }
        }
      });

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      this.isPlaying = true;
      if (timerMinutes > 0) {
        this.startTimerCountdown();
      }
      this.notify();
      return true;

    } catch (err: any) {
      console.warn("[SacredAudio] Playback failed:", err);
      // If blocked by browser autoplay policy, notify but keep selected
      this.isPlaying = false;
      this.notify();

      // Fallback to procedural synth if it was a preset
      if (track.isPreset) {
        this.startFrequency(432, 4, volume, timerMinutes);
      }
      return false;
    }
  }

  /**
   * Save an uploaded audio file into IndexedDB (supports large files up to 100MB+)
   */
  public async saveUploadedAudioFile(file: File): Promise<CustomUploadedSound> {
    const id = `custom_audio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanName = file.name.replace(/\.[^/.]+$/, "");

    // 1. Store blob directly in IndexedDB
    await set(`asrarhub_audio_blob_${id}`, file);

    const trackMetadata: CustomUploadedSound = {
      id,
      name: cleanName,
      size: file.size,
      type: file.type,
      isPreset: false,
      createdAt: Date.now()
    };

    // 2. Update metadata list in localStorage (only metadata, NOT the huge binary base64 string)
    const currentList = this.getSavedCustomTracks();
    const updated = [trackMetadata, ...currentList.filter(t => t.id !== id)];
    try {
      localStorage.setItem('asrarhub_custom_bg_audios_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn("[SacredAudio] Metadata save warning:", e);
    }

    return trackMetadata;
  }

  /**
   * Save a direct audio URL
   */
  public saveCustomAudioUrl(name: string, url: string): CustomUploadedSound {
    const id = `custom_url_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const trackMetadata: CustomUploadedSound = {
      id,
      name: name.trim() || 'Musique d\'Ambiance',
      url: url.trim(),
      isPreset: false,
      createdAt: Date.now()
    };

    const currentList = this.getSavedCustomTracks();
    const updated = [trackMetadata, ...currentList.filter(t => t.id !== id)];
    try {
      localStorage.setItem('asrarhub_custom_bg_audios_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn("[SacredAudio] URL track save warning:", e);
    }
    return trackMetadata;
  }

  /**
   * Retrieve all saved custom tracks metadata
   */
  public getSavedCustomTracks(): CustomUploadedSound[] {
    try {
      const saved = localStorage.getItem('asrarhub_custom_bg_audios_v2');
      if (saved) {
        return JSON.parse(saved);
      }
      // Migrate legacy localStorage tracks if present
      const legacy = localStorage.getItem('asrarhub_custom_bg_audios');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({
            id: item.id || `migrated_${Date.now()}`,
            name: item.name || 'Piste audio',
            url: item.url,
            isPreset: false
          }));
        }
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Delete an uploaded custom track
   */
  public async deleteCustomTrack(id: string): Promise<void> {
    if (this.activeTrackId === id && this.isPlaying) {
      this.stop();
    }
    try {
      await del(`asrarhub_audio_blob_${id}`);
    } catch (_) {}

    const list = this.getSavedCustomTracks().filter(t => t.id !== id);
    try {
      localStorage.setItem('asrarhub_custom_bg_audios_v2', JSON.stringify(list));
    } catch (_) {}
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentFreq(): number {
    return this.currentFreq;
  }

  public getCurrentMode(): PlaybackMode {
    return this.currentMode;
  }

  public getCurrentSoundscapeId(): string {
    return this.currentSoundscapeId;
  }

  public getActiveTrackName(): string {
    return this.activeTrackName;
  }
}

export const sacredAudioEngine = new SacredAudioEngine();
