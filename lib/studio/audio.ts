import type { StudioViewId } from "@/types/portfolio";

export type RoomSound =
  | "step"
  | "door"
  | "click"
  | "keys"
  | "tick"
  | "lift"
  | "setdown"
  | "page"
  | "bookOpen"
  | "bookClose"
  | "spine"
  | "paper"
  | "glass"
  | "frame";

const MASTER_LEVEL = 0.8;
const FADE = 0.4;

interface Beds {
  room: GainNode;
  outside: GainNode;
  outsideFilter: BiquadFilterNode;
  fan: GainNode;
  hum: GainNode;
}

type AudioContextConstructor = typeof AudioContext;

function vary(amount: number) {
  return 1 + (Math.random() * 2 - 1) * amount;
}

/**
 * Procedural room sound: one Web Audio graph with a small-room reverb and a limiter,
 * quiet ambience beds that follow the camera, and soft object foley. Only objects and
 * the room make sound; interface controls stay silent.
 */
class RoomAudio {
  private ctx: AudioContext | null = null;
  private input: GainNode | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private beds: Beds | null = null;
  private enabled = false;
  private inRoom = false;
  private area: StudioViewId = "room";
  private listening = false;

  /** Must run inside a user gesture the first time so browsers (including iOS) allow audio. */
  private ensure(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const Ctor: AudioContextConstructor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
    if (!Ctor) return null;

    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -12;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.25;

    const input = ctx.createGain();
    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(ctx, 0.7);
    const wet = ctx.createGain();
    wet.gain.value = 0.22;

    input.connect(limiter);
    input.connect(reverb).connect(wet).connect(limiter);
    limiter.connect(master).connect(ctx.destination);

    this.ctx = ctx;
    this.input = input;
    this.master = master;
    this.noise = this.noiseBuffer(ctx, 2, "white");

    if (!this.listening) {
      document.addEventListener("visibilitychange", this.onVisibility);
      this.listening = true;
    }
    return ctx;
  }

  private onVisibility = () => this.applyLevel();

  private impulse(ctx: AudioContext, seconds: number) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3.2;
    }
    return buffer;
  }

  private noiseBuffer(ctx: AudioContext, seconds: number, color: "white" | "brown") {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (color === "white") {
        data[i] = white;
      } else {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    }
    return buffer;
  }

  /** Long, offset-length loops so the beds never audibly repeat. */
  private startBeds(ctx: AudioContext) {
    if (this.beds || !this.input) return;
    const loop = (buffer: AudioBuffer) => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.start(0, Math.random() * buffer.duration);
      return source;
    };

    const roomFilter = ctx.createBiquadFilter();
    roomFilter.type = "lowpass";
    roomFilter.frequency.value = 320;
    const room = ctx.createGain();
    room.gain.value = 0.05;
    loop(this.noiseBuffer(ctx, 9.7, "brown")).connect(roomFilter).connect(room).connect(this.input);

    const outsideBand = ctx.createBiquadFilter();
    outsideBand.type = "bandpass";
    outsideBand.frequency.value = 380;
    outsideBand.Q.value = 0.5;
    const outsideFilter = ctx.createBiquadFilter();
    outsideFilter.type = "lowpass";
    outsideFilter.frequency.value = 900;
    const outside = ctx.createGain();
    outside.gain.value = 0.014;
    loop(this.noiseBuffer(ctx, 13.3, "white")).connect(outsideBand).connect(outsideFilter).connect(outside).connect(this.input);

    const gust = ctx.createOscillator();
    gust.frequency.value = 0.07;
    const gustDepth = ctx.createGain();
    gustDepth.gain.value = 0.006;
    gust.connect(gustDepth).connect(outside.gain);
    gust.start();

    const fanHigh = ctx.createBiquadFilter();
    fanHigh.type = "highpass";
    fanHigh.frequency.value = 700;
    const fanLow = ctx.createBiquadFilter();
    fanLow.type = "lowpass";
    fanLow.frequency.value = 2400;
    const fan = ctx.createGain();
    fan.gain.value = 0;
    loop(this.noiseBuffer(ctx, 7.1, "white")).connect(fanHigh).connect(fanLow).connect(fan).connect(this.input);

    const humOsc = ctx.createOscillator();
    humOsc.frequency.value = 118;
    const hum = ctx.createGain();
    hum.gain.value = 0;
    humOsc.connect(hum).connect(this.input);
    humOsc.start();

    this.beds = { room, outside, outsideFilter, fan, hum };
    this.applyArea();
  }

  private applyArea() {
    const { ctx, beds } = this;
    if (!ctx || !beds) return;
    const now = ctx.currentTime;
    const atDesk = this.area === "desk";
    beds.fan.gain.setTargetAtTime(atDesk ? 0.007 : 0.0015, now, 0.6);
    beds.hum.gain.setTargetAtTime(atDesk ? 0.0025 : 0, now, 0.6);
    beds.outsideFilter.frequency.setTargetAtTime(this.area === "reading" ? 1500 : 900, now, 0.8);
    beds.outside.gain.setTargetAtTime(this.area === "reading" ? 0.02 : 0.014, now, 0.8);
  }

  private applyLevel() {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    const audible = this.enabled && this.inRoom && document.visibilityState === "visible";
    if (audible && ctx.state === "suspended") void ctx.resume();
    master.gain.setTargetAtTime(audible ? MASTER_LEVEL : 0, ctx.currentTime, FADE / 3);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled && this.inRoom) {
      const ctx = this.ensure();
      if (ctx) this.startBeds(ctx);
    }
    this.applyLevel();
  }

  /** Call from the gesture that opens the studio. */
  enterRoom(enabled: boolean) {
    this.enabled = enabled;
    this.inRoom = true;
    if (!enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    this.startBeds(ctx);
    this.applyLevel();
  }

  /** Marks the studio open without creating audio (for deep links, which have no gesture yet). */
  markInRoom() {
    this.inRoom = true;
    this.applyLevel();
  }

  leaveRoom() {
    this.inRoom = false;
    this.applyLevel();
  }

  setArea(area: StudioViewId) {
    this.area = area;
    this.applyArea();
  }

  play(sound: RoomSound, delay = 0) {
    const { ctx } = this;
    if (!ctx || !this.enabled || !this.inRoom) return;
    const t = ctx.currentTime + delay;
    const p = vary(0.06);
    const v = vary(0.2);

    switch (sound) {
      case "step":
        this.burst(t, { dur: 0.11, type: "lowpass", freq: 380 * p, gain: 0.22 * v });
        this.tone(t, { freq: 75 * p, freqEnd: 55, dur: 0.09, gain: 0.12 * v });
        break;
      case "door":
        this.burst(t, { dur: 1.1, type: "bandpass", freq: 500 * p, freqEnd: 1400 * p, q: 1.2, gain: 0.05 * v, attack: 0.25 });
        this.tone(t, { freq: 60, dur: 1, gain: 0.03 * v, attack: 0.2 });
        this.tone(t + 0.95, { freq: 92 * p, freqEnd: 70, dur: 0.14, gain: 0.08 * v });
        break;
      case "click":
        this.burst(t, { dur: 0.016, type: "bandpass", freq: 3200 * p, q: 3, gain: 0.14 * v });
        break;
      case "keys":
        this.burst(t, { dur: 0.02, type: "bandpass", freq: 2400 * p, q: 2, gain: 0.07 * v });
        this.burst(t + 0.07, { dur: 0.02, type: "bandpass", freq: 2200 * p, q: 2, gain: 0.05 * v });
        break;
      case "tick":
        this.tone(t, { freq: 2600 * p, dur: 0.025, gain: 0.025 * v });
        break;
      case "lift":
        this.burst(t, { dur: 0.18, type: "lowpass", freq: 900 * p, freqEnd: 300, gain: 0.08 * v, attack: 0.03 });
        this.tone(t, { freq: 160 * p, freqEnd: 110, dur: 0.12, gain: 0.05 * v });
        break;
      case "setdown":
        this.tone(t, { freq: 130 * p, freqEnd: 70, dur: 0.1, gain: 0.12 * v });
        this.burst(t, { dur: 0.06, type: "lowpass", freq: 600 * p, gain: 0.1 * v });
        break;
      case "page":
        this.burst(t, { dur: 0.38, type: "bandpass", freq: 1800 * p, freqEnd: 4200 * p, q: 0.8, gain: 0.09 * v, attack: 0.06 });
        this.burst(t + 0.22, { dur: 0.12, type: "highpass", freq: 5000 * p, gain: 0.03 * v });
        break;
      case "bookOpen":
        this.burst(t, { dur: 0.3, type: "lowpass", freq: 1500 * p, freqEnd: 600, gain: 0.08 * v, attack: 0.02 });
        this.tone(t, { freq: 110 * p, dur: 0.08, gain: 0.05 * v });
        break;
      case "bookClose":
        this.tone(t, { freq: 120 * p, freqEnd: 80, dur: 0.09, gain: 0.14 * v });
        this.burst(t, { dur: 0.08, type: "lowpass", freq: 900 * p, gain: 0.1 * v });
        break;
      case "spine":
        this.burst(t, { dur: 0.32, type: "bandpass", freq: 900 * p, freqEnd: 1600 * p, q: 1.5, gain: 0.06 * v, attack: 0.08 });
        break;
      case "paper":
        this.burst(t, { dur: 0.25, type: "highpass", freq: 2500 * p, gain: 0.05 * v, attack: 0.03 });
        this.burst(t + 0.1, { dur: 0.1, type: "bandpass", freq: 4000 * p, gain: 0.03 * v });
        break;
      case "glass":
        this.tone(t, { freq: 1760 * p, dur: 1.2, gain: 0.02 * v });
        this.tone(t, { freq: 2640 * p, dur: 0.8, gain: 0.012 * v });
        this.tone(t, { freq: 3520 * p, dur: 0.5, gain: 0.008 * v });
        break;
      case "frame":
        this.tone(t, { freq: 900 * p, dur: 0.03, gain: 0.03 * v });
        this.burst(t, { dur: 0.06, type: "lowpass", freq: 700 * p, gain: 0.06 * v });
        break;
    }
  }

  private envelope(gain: GainNode, t: number, peak: number, attack: number, dur: number) {
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  private burst(
    t: number,
    opts: { dur: number; type: BiquadFilterType; freq: number; freqEnd?: number; q?: number; gain: number; attack?: number },
  ) {
    const { ctx, input, noise } = this;
    if (!ctx || !input || !noise) return;
    const source = ctx.createBufferSource();
    source.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = opts.type;
    filter.frequency.setValueAtTime(opts.freq, t);
    if (opts.freqEnd) filter.frequency.exponentialRampToValueAtTime(opts.freqEnd, t + opts.dur);
    filter.Q.value = opts.q ?? 0.7;
    const gain = ctx.createGain();
    this.envelope(gain, t, opts.gain, opts.attack ?? 0.004, opts.dur);
    source.connect(filter).connect(gain).connect(input);
    source.start(t, Math.random() * (noise.duration - opts.dur - 0.05));
    source.stop(t + opts.dur + 0.05);
  }

  private tone(t: number, opts: { freq: number; freqEnd?: number; dur: number; gain: number; attack?: number }) {
    const { ctx, input } = this;
    if (!ctx || !input) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(opts.freq, t);
    if (opts.freqEnd) osc.frequency.exponentialRampToValueAtTime(opts.freqEnd, t + opts.dur);
    const gain = ctx.createGain();
    this.envelope(gain, t, opts.gain, opts.attack ?? 0.004, opts.dur);
    osc.connect(gain).connect(input);
    osc.start(t);
    osc.stop(t + opts.dur + 0.05);
  }
}

export const roomAudio = new RoomAudio();
