// Captures de contrôle : node scripts/stills.mjs [sec1 sec2 ...] [--out dir]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outDir = outIdx >= 0 ? args[outIdx + 1] : "out/stills";
const secs = (outIdx >= 0 ? args.slice(0, outIdx) : args).map(Number);
const times = secs.length ? secs : [2, 8, 14, 19, 24, 30, 36, 40, 45, 50, 53, 58, 64, 69, 76, 82, 86];
const browserExecutable = process.env.REMOTION_BROWSER || undefined;
const scale = Number(process.env.STILL_SCALE || 0.5);

fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "VortexPolaire2026", browserExecutable });
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * composition.fps));
  const output = path.join(outDir, `t${String(t).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable, scale });
  console.log("still", t, "s →", output);
}
