import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audioCtx: AudioContext | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  public soundEnabled = signal<boolean>(false);

  // Mapping theme character styles to corresponding MP3 music tracks in public/audio/
  private themeMusicMap: Record<string, string> = {
    'style-ninja': 'audio/ninja.mp3',
    'style-robot': 'audio/robot.mp3',
    'style-quantum': 'audio/hight-tech.mp3',
    'style-quan-van-truong': 'audio/quan-van-truong.mp3',
    'style-cosmic': 'audio/hight-tech.mp3',
    'style-sports': 'audio/the-thao.mp3',
    'style-horror': 'audio/kinh-di.mp3',
    'style-cyberpunk': 'audio/hight-tech.mp3',
  };

  private currentStyle = 'style-cyberpunk';

  public toggleSound(): boolean {
    const nextState = !this.soundEnabled();
    this.soundEnabled.set(nextState);
    if (nextState) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
    return nextState;
  }

  public setStyle(style: string) {
    if (this.currentStyle === style) return;
    this.currentStyle = style;
    if (this.soundEnabled()) {
      this.playBackgroundMusic();
    }
  }

  private playBackgroundMusic() {
    const audioPath = this.themeMusicMap[this.currentStyle] || 'audio/hight-tech.mp3';

    if (!this.bgAudio) {
      this.bgAudio = new Audio();
      this.bgAudio.loop = true; // Built-in loop
      this.bgAudio.volume = 0.4;
      
      // Fallback loop event listener
      this.bgAudio.addEventListener('ended', () => {
        if (this.bgAudio && this.soundEnabled()) {
          this.bgAudio.currentTime = 0;
          this.bgAudio.play().catch(e => console.warn(e));
        }
      });
    }

    const currentSrc = this.bgAudio.getAttribute('src');
    if (currentSrc !== audioPath) {
      this.bgAudio.src = audioPath;
      this.bgAudio.load();
    }

    this.bgAudio.play().catch((err) => {
      console.warn('Background music playback notice:', err);
    });
  }

  private stopBackgroundMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
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

  public playWheelTickSound() {
    if (!this.soundEnabled()) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.03);
  }

  public playWinFanfareSound() {
    if (!this.soundEnabled()) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.15, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  }

  // --- NEW THEME SFX ---
  
  public playNinjaDartSound() {
    if (!this.soundEnabled()) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  public playGhostJumpscareSound() {
    if (!this.soundEnabled()) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc2.type = 'square';
    
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc2.frequency.setValueAtTime(160, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc2.start();
    osc.stop(this.audioCtx.currentTime + 1.2);
    osc2.stop(this.audioCtx.currentTime + 1.2);
  }

  public playSlashSound() {
    if (!this.soundEnabled()) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const bufferSize = this.audioCtx.sampleRate * 0.2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, this.audioCtx.currentTime + 0.15);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    noise.start();
  }

  public playRobotBeepSound() {
    if (!this.soundEnabled()) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
    osc.frequency.setValueAtTime(1800, this.audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime + 0.15);
    gain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.2);
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
}


