import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: any = null;
  public soundEnabled = signal<boolean>(false);

  // Scales for character themes
  private themeScales: Record<string, number[]> = {
    'style-ninja': [220, 247.5, 293.66, 330, 392, 440], // Hirajoshi / Pentatonic
    'style-robot': [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // Sci-Fi Major
    'style-quantum': [329.63, 349.23, 392.00, 493.88, 523.25, 659.25], // Lydian synth
    'style-quan-van-truong': [146.83, 164.81, 196.00, 220.00, 293.66], // Deep War Drums / Pentatonic Low
    'style-cosmic': [261.63, 329.63, 392.00, 493.88, 587.33, 659.25], // Ethereal 9th Chord
    'style-sports': [329.63, 392.00, 440.00, 493.88, 587.33, 659.25], // Dynamic Energetic Pulse
    'style-horror': [110.00, 116.54, 138.59, 155.56, 164.81, 220.00, 233.08] // Sinister Diminished Tritone Sub-Bass
  };

  private currentStyle = 'style-cyberpunk';

  public toggleSound(): boolean {
    const nextState = !this.soundEnabled();
    this.soundEnabled.set(nextState);
    if (nextState) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return nextState;
  }

  public setStyle(style: string) {
    this.currentStyle = style;
  }

  public playClickSound() {
    if (!this.soundEnabled()) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = this.currentStyle === 'style-horror' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(this.currentStyle === 'style-horror' ? 220 : 600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(this.currentStyle === 'style-horror' ? 80 : 150, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  private ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private startAmbient() {
    this.ensureAudioContext();
    if (!this.audioCtx) return;
    this.isPlaying = true;
    this.scheduleNextNote();
  }

  private stopAmbient() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying || !this.soundEnabled()) return;
    this.playThemeTone();
    const delay = Math.random() * 800 + 400; // random rhythm 400ms - 1200ms
    this.timerId = setTimeout(this.scheduleNextNote, delay);
  };

  private playThemeTone() {
    if (!this.audioCtx) return;
    const scale = this.themeScales[this.currentStyle] || this.themeScales['style-robot'];
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Sound character based on style
    if (this.currentStyle === 'style-ninja') {
      osc.type = 'triangle';
    } else if (this.currentStyle === 'style-robot') {
      osc.type = 'sawtooth';
    } else if (this.currentStyle === 'style-quan-van-truong') {
      osc.type = 'sine';
    } else if (this.currentStyle === 'style-horror') {
      osc.type = 'sawtooth';
    } else {
      osc.type = 'sine';
    }

    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }
}
