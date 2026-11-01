// Web Audio API Retro Sound Effects Synthesizer

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Windows 98 Startup Chord Progression
  public playStartup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Fs - Cs - Fs - Gs - Cs chord progression synthesized
    const notes = [
      { f: 185.0, start: 0.0, dur: 3.5, gain: 0.15 },
      { f: 277.18, start: 0.2, dur: 3.3, gain: 0.2 },
      { f: 369.99, start: 0.4, dur: 3.1, gain: 0.25 },
      { f: 415.3, start: 0.6, dur: 3.0, gain: 0.2 },
      { f: 554.37, start: 0.8, dur: 2.8, gain: 0.2 },
      { f: 739.99, start: 1.0, dur: 3.0, gain: 0.15 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.start);

      gain.gain.setValueAtTime(0, now + n.start);
      gain.gain.linearRampToValueAtTime(n.gain, now + n.start + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    });
  }

  // Windows 98 Classic Ding / Warning Sound
  public playDing() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Windows Error Chord (Thud/Chord)
  public playError() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    [150, 180, 220].forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  // ICQ "Uh-Oh!" Sound
  public playICQ() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // "Uh"
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(320, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // "Oh!"
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(560, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(680, now + 0.35);
    gain2.gain.setValueAtTime(0.35, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.4);
  }

  // Dial-Up Handshake Synthesizer
  public playDialUp(): () => void {
    if (this.isMuted) return () => {};
    this.initCtx();
    if (!this.ctx) return () => {};

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.connect(ctx.destination);

    // Dial tones (DTMF Simulation)
    const dtmf = [697, 770, 852, 941, 1209, 1336, 1477];
    for (let i = 0; i < 7; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(dtmf[i % dtmf.length], now + i * 0.15);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, now + i * 0.15);
      g.gain.setValueAtTime(0.001, now + i * 0.15 + 0.1);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.1);
    }

    // Calling ring
    const ringOsc = ctx.createOscillator();
    ringOsc.frequency.setValueAtTime(440, now + 1.2);
    const ringGain = ctx.createGain();
    ringGain.gain.setValueAtTime(0.1, now + 1.2);
    ringGain.gain.setValueAtTime(0, now + 2.2);
    ringOsc.connect(ringGain);
    ringGain.connect(masterGain);
    ringOsc.start(now + 1.2);
    ringOsc.stop(now + 2.2);

    // Screeching carrier frequencies & white noise
    const screech = ctx.createOscillator();
    screech.type = 'sawtooth';
    screech.frequency.setValueAtTime(2100, now + 2.4);
    screech.frequency.linearRampToValueAtTime(1200, now + 3.5);
    screech.frequency.linearRampToValueAtTime(2800, now + 5.0);

    const screechGain = ctx.createGain();
    screechGain.gain.setValueAtTime(0.12, now + 2.4);
    screechGain.gain.exponentialRampToValueAtTime(0.001, now + 6.0);
    screech.connect(screechGain);
    screechGain.connect(masterGain);
    screech.start(now + 2.4);
    screech.stop(now + 6.0);

    // Return stop callback
    return () => {
      try {
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      } catch (e) {}
    };
  }

  // Click / Selection
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const soundService = new SoundService();
