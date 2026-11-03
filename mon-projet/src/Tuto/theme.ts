import { Easing } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const sans = loadInter("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
}).fontFamily;

export const C = {
  bg: "#12100E",
  card: "#1E1A17",
  cardBorder: "#3A332D",
  text: "#F7F1E8",
  muted: "#A39889",
  accent: "#E8794A",
  accentSoft: "#F3B08C",
  green: "#7BD88F",
  blue: "#8AB4F8",
};

export const out = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Découpage (30 fps) — calé sur la voix off
export const SCENES = {
  intro: { from: 0, dur: 96 },
  step1: { from: 96, dur: 69 },
  step2: { from: 165, dur: 86 },
  step3: { from: 251, dur: 103 },
  outro: { from: 354, dur: 96 },
};
export const TOTAL = 450;

export const VOICE = [
  { file: "voix-1.mp3", at: 6, text: "Faire du motion design avec Claude Code ? C'est simple !" },
  { file: "voix-2.mp3", at: 100, text: "1 · Ouvrez une session Claude Code." },
  { file: "voix-3.mp3", at: 169, text: "2 · Tapez : npx create-video" },
  { file: "voix-4.mp3", at: 255, text: "3 · Décrivez votre vidéo. Claude l'anime pour vous." },
  { file: "voix-5.mp3", at: 358, text: "À vous ! Demandez un titre animé de 5 secondes." },
];
