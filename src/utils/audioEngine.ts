/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class VolcanicAudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  
  // Synthesizer Nodes
  private windGain: GainNode | null = null;
  private tremorGain: GainNode | null = null;
  private tremorOsc: OscillatorNode | null = null;
  private isRunning: boolean = false;

  public toggle(): boolean {
    if (!this.isEnabled) {
      this.start();
      this.isEnabled = true;
    } else {
      this.stop();
      this.isEnabled = false;
    }
    return this.isEnabled;
  }

  public getStatus(): boolean {
    return this.isEnabled;
  }

  private initContext() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtxClass();
  }

  public start() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isRunning) return;

    try {
      // 1. Ambient Mountain Wind (Filtered Pink-like Noise)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.05;
        b2 = 0.85 * b2 + white * 0.05;
        output[i] = (b0 + b1 + b2) * 0.12;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.value = 320;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.25;

      noiseSource.connect(windFilter);
      windFilter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);
      noiseSource.start();

      // 2. Sub-bass Volcanic Tremor Rumble
      this.tremorOsc = this.ctx.createOscillator();
      this.tremorOsc.type = 'sawtooth';
      this.tremorOsc.frequency.value = 42; // Hz

      const tremorFilter = this.ctx.createBiquadFilter();
      tremorFilter.type = 'lowpass';
      tremorFilter.frequency.value = 75;

      this.tremorGain = this.ctx.createGain();
      this.tremorGain.gain.value = 0.0; // Inaudible in normal state

      this.tremorOsc.connect(tremorFilter);
      tremorFilter.connect(this.tremorGain);
      this.tremorGain.connect(this.ctx.destination);
      this.tremorOsc.start();

      this.isRunning = true;
    } catch (err) {
      console.warn("Could not start procedural audio:", err);
    }
  }

  public stop() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  public setState(state: string) {
    if (!this.ctx || !this.tremorGain || !this.windGain) return;
    const now = this.ctx.currentTime;

    if (state === 'NORMAL') {
      this.tremorGain.gain.setTargetAtTime(0.0, now, 0.5);
      this.windGain.gain.setTargetAtTime(0.2, now, 0.5);
    } else if (state === 'WASPADA' || state === 'WARNING') {
      this.tremorGain.gain.setTargetAtTime(0.18, now, 0.5);
      this.windGain.gain.setTargetAtTime(0.32, now, 0.5);
      if (this.tremorOsc) this.tremorOsc.frequency.setValueAtTime(40, now);
    } else if (state === 'SIAGA') {
      this.tremorGain.gain.setTargetAtTime(0.42, now, 0.5);
      this.windGain.gain.setTargetAtTime(0.45, now, 0.5);
      if (this.tremorOsc) this.tremorOsc.frequency.setValueAtTime(32, now);
    } else if (state === 'ERUPTION' || state === 'ERUPSI') {
      this.tremorGain.gain.setTargetAtTime(0.75, now, 0.5);
      this.windGain.gain.setTargetAtTime(0.55, now, 0.5);
      this.triggerExplosionSound();
    }
  }

  public triggerExplosionSound() {
    if (!this.ctx || !this.isEnabled) return;
    try {
      // Create a short explosive roar burst
      const now = this.ctx.currentTime;
      const blastOsc = this.ctx.createOscillator();
      const blastGain = this.ctx.createGain();
      blastOsc.type = 'triangle';
      blastOsc.frequency.setValueAtTime(110, now);
      blastOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

      blastGain.gain.setValueAtTime(0.6, now);
      blastGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

      blastOsc.connect(blastGain);
      blastGain.connect(this.ctx.destination);
      blastOsc.start(now);
      blastOsc.stop(now + 1.5);
    } catch {
      // Ignore transient audio error
    }
  }
}

export const audioEngine = new VolcanicAudioEngine();
