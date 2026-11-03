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
  intro: { from: 0, dur: 130 },
  step1: { from: 130, dur: 74 },
  step2: { from: 204, dur: 74 },
  step3: { from: 278, dur: 75 },
  outro: { from: 353, dur: 102 },
};
export const TOTAL = 455;

export const VOICE = [
  { file: "voix-1.mp3", at: 8, text: "Envie de créer des vidéos qui en jettent ? Avec Claude Code, c'est ultra simple !" },
  { file: "voix-2.mp3", at: 134, text: "Étape 1 : ouvrez une session Claude Code !" },
  { file: "voix-3.mp3", at: 208, text: "2 : tapez npx create-video" },
  { file: "voix-4.mp3", at: 282, text: "3 : décrivez votre idée, et Claude l'anime !" },
  { file: "voix-5.mp3", at: 357, text: "À vous de jouer : un titre animé de 5 secondes. Go !" },
];
