import { Easing, interpolate } from "remotion";
import timeline from "./timeline.json";
import voice from "./voice.json";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const FPS = timeline.fps;
export const TIMELINE = timeline;

export type SceneId = (typeof timeline.scenes)[number]["id"];

export const sceneOf = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Scène inconnue : ${id}`);
  return s;
};

export type Word = { t: number; d: number; w: string };
export const wordsOf = (id: string): Word[] => {
  const v = voice.find((x) => x.id === id);
  if (!v) throw new Error(`Voix inconnue : ${id}`);
  return v.words;
};

/**
 * Frame (relative à la scène) où la voix prononce le mot `needle`.
 * `nth` = 1 pour la première occurrence. Sert à synchroniser l'image sur la voix.
 */
export const wf = (id: string, needle: string, nth = 1): number => {
  const s = sceneOf(id);
  let seen = 0;
  for (const w of wordsOf(id)) {
    if (w.w.toLowerCase().includes(needle.toLowerCase())) {
      seen++;
      if (seen === nth) return Math.round(s.voiceFrom + w.t * FPS);
    }
  }
  throw new Error(`Mot « ${needle} » (#${nth}) absent de ${id}`);
};

/** 0 → 1 sur `dur` frames à partir de `at`, avec easing doux */
export const appear = (frame: number, at: number, dur = 18, easing = easeOut) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing });

/** Style d'apparition standard : fondu + montée */
export const rise = (frame: number, at: number, dist = 40, dur = 18) => {
  const p = appear(frame, at, dur);
  return { opacity: p, translate: `0px ${(1 - p) * dist}px` };
};

/** Nombre formaté à la suisse (apostrophe pour les milliers) */
export const fmt = (n: number, decimals = 0) => {
  const [i, d] = n.toFixed(decimals).split(".");
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return d ? `${int},${d}` : int;
};

/** Bruit déterministe lisse (somme de sinus) */
export const wobble = (t: number, seed = 0) =>
  Math.sin(t * 1.7 + seed) * 0.5 + Math.sin(t * 3.1 + seed * 2.3) * 0.3 + Math.sin(t * 5.3 + seed * 0.7) * 0.2;

/** Intensité de secousse globale (0-1) à la frame absolue `f` */
export const shakeAt = (f: number) => {
  let a = 0;
  for (const s of timeline.shakes) {
    const x = f - s.frame;
    if (x < 0 || x > s.durationInFrames) continue;
    const env = Math.min(x / 4, 1) * Math.pow(1 - x / s.durationInFrames, 1.6);
    a = Math.max(a, env * s.amp);
  }
  return a;
};
