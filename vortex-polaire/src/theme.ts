import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import timeline from "./timeline.json";

// Inter (SIL Open Font License), auto-hébergée dans public/fonts
// pour un rendu déterministe et hors-ligne.
const FAMILY = "Inter";
for (const w of ["300", "400", "500", "600", "700", "800"]) {
  loadFont({ family: FAMILY, url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w, style: "normal" });
}
loadFont({ family: FAMILY, url: staticFile("fonts/inter-latin-500-italic.woff2"), weight: "500", style: "italic" });

export const FONT = `${FAMILY}, "Inter Display", system-ui, sans-serif`;

/** Palette imposée par la direction artistique */
export const C = {
  night: "#071426",
  deep: "#123B68",
  cyan: "#45D6F5",
  white: "#F5F8FC",
  orange: "#FF914D",
  ice: "#BFEFFF",
  muted: "rgba(245,248,252,0.62)",
} as const;

export const W = 1920;
export const H = 1080;
export const FPS = timeline.fps;

/** Marges de sécurité titre (≈ 5 % horizontal, 6 % vertical) */
export const SAFE = { x: 110, y: 70 };

export const sec = (s: number) => Math.round(s * FPS);

export type SceneId = (typeof timeline.scenes)[number]["id"];

export const scene = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Scène inconnue : ${id}`);
  return { from: sec(s.start), duration: sec(s.end - s.start), start: s.start };
};

export const TOTAL_FRAMES = sec(timeline.durationSec);

/** Recouvrement entre scènes (fondu entrant de la scène suivante) */
export const OVERLAP = 20;

export { timeline };
