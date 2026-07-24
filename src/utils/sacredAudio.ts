/**
 * Web Audio API Synthesizer for Sacred Frequencies & Binaural Meditation Beats
 * Frequencies: 432 Hz (Universal Harmony), 528 Hz (Miracle & DNA), 639 Hz (Heart & Connection), 852 Hz (Spiritual Intuition)
 */

class SacredAudioEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentFreq: number = 432;

  private volume: number = 0.15;
  private timerId: any = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.setValueAtTime(Math.max(0.001, this.volume), this.ctx.currentTime);
      } catch (e) {
        // Ignore gain set error if node is closing
      }
    }
  }

  public getVolume() {
    return this.volume;
  }

  public startFrequency(freq: number = 432, binauralBeat: number = 4, volume: number = 0.15, timerMinutes: number = 0) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.currentFreq = freq;
    this.volume = volume;

    // Create main oscillator (left ear frequency)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sine';
    this.osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Create secondary oscillator with offset for binaural beat (right ear frequency offset by 4Hz theta wave)
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'sine';
    this.osc2.frequency.setValueAtTime(freq + binauralBeat, this.ctx.currentTime);

    // Gain node for soft volume control
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
    // Smooth ramp in
    this.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), this.ctx.currentTime + 1.5);

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.osc1.start();
    this.osc2.start();
    this.isPlaying = true;

    if (timerMinutes > 0) {
      this.timerId = setTimeout(() => {
        this.stop();
      }, timerMinutes * 60 * 1000);
    }
  }

  public stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.osc1?.stop();
          this.osc2?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.isPlaying = false;
        }, 500);
      } catch (e) {
        this.isPlaying = false;
      }
    } else {
      this.isPlaying = false;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getCurrentFreq() {
    return this.currentFreq;
  }
}

export const sacredAudioEngine = new SacredAudioEngine();
