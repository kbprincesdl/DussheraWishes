/**
 * Festive Audio Synthesizer using Web Audio API
 * Generates auspicious Indian classical scale tones (Bhairav / Bilawal / Hansadhwani),
 * temple brass bell resonant chimes, diya flame ignition sound, and arrow celebration sound!
 */

class FestiveAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlayingLoop = false;
  private loopTimer: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Plays a rich resonant brass temple bell chime with lingering decay
  playTempleBell(freq = 587.33) {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Fundamental and overtone oscillators
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, now); // Bell harmonic

      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(freq * 5.4, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 3.2);
      osc2.stop(now + 3.2);
      osc3.stop(now + 3.2);
    } catch {
      // Audio context might be blocked if no user gesture
    }
  }

  // Plays celebratory Diya lighting sound (warm sweep + sweet chime)
  playDiyaLightingSound() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Warm swoosh / fire spark
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.3);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // Followed by twin harmonious chime bells
      setTimeout(() => {
        this.playTempleBell(659.25); // E5
      }, 120);
      setTimeout(() => {
        this.playTempleBell(880.0); // A5
      }, 280);
    } catch {
      // ignore
    }
  }

  // Plays golden arrow whoosh and firework burst sound
  playArrowShootSound() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Whistle whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);

      // Burst fanfare after 400ms
      setTimeout(() => {
        this.playTempleBell(523.25); // C5
        setTimeout(() => this.playTempleBell(659.25), 100);
        setTimeout(() => this.playTempleBell(783.99), 200);
        setTimeout(() => this.playTempleBell(1046.5), 300);
      }, 420);
    } catch {
      // ignore
    }
  }

  // Ambient festive music melody (melodic flute & tanpura harmonics in Hansadhwani raga)
  startAmbientMusic() {
    if (this.isPlayingLoop) return;
    this.isPlayingLoop = true;
    const ctx = this.initCtx();

    // Hansadhwani raga notes (Sa, Re, Ga, Pa, Ni, Sa' -> C, D, E, G, B, C)
    const notes = [
      261.63, 293.66, 329.63, 392.00, 493.88, 523.25,
      493.88, 392.00, 329.63, 293.66, 261.63, 392.00,
      523.25, 659.25, 523.25, 392.00
    ];

    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isPlayingLoop) return;
      try {
        const now = ctx.currentTime;
        const freq = notes[noteIdx % notes.length];
        noteIdx++;

        // Flute tone with gentle vibrato
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);

        // Schedule next note with varied festive pacing
        const delay = (noteIdx % 4 === 0) ? 900 : 450;
        this.loopTimer = window.setTimeout(playNextNote, delay);
      } catch {
        // Stop if error
        this.stopAmbientMusic();
      }
    };

    playNextNote();
  }

  stopAmbientMusic() {
    this.isPlayingLoop = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
  }

  isMusicPlaying() {
    return this.isPlayingLoop;
  }
}

export const festiveAudio = new FestiveAudioSynthesizer();
