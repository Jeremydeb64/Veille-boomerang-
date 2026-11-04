import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const W = 1080;
export const H = 1920;

/** Palette : bleu nuit apaisant, corail pour le danger, menthe pour les bons réflexes */
export const C = {
  bg0: "#0B1422",
  bg1: "#122238",
  ink: "#F5F1E8",
  mute: "#9DB0C8",
  dim: "#5E7391",
  line: "rgba(157,176,200,0.18)",
  card: "rgba(255,255,255,0.055)",
  cardLine: "rgba(255,255,255,0.10)",
  coral: "#FF6B4A",
  amber: "#FFB547",
  mint: "#4FD1A5",
  sky: "#7FB2FF",
};

export const FONT_BODY = "Inter";
export const FONT_HEAD = "Space Grotesk";

const fonts: [string, string, string][] = [
  [FONT_BODY, "inter-latin-400-normal.woff2", "400"],
  [FONT_BODY, "inter-latin-600-normal.woff2", "600"],
  [FONT_BODY, "inter-latin-800-normal.woff2", "800"],
  [FONT_HEAD, "space-grotesk-latin-500-normal.woff2", "500"],
  [FONT_HEAD, "space-grotesk-latin-700-normal.woff2", "700"],
];
for (const [family, file, weight] of fonts) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
}
