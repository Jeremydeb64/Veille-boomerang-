// Captures de contrôle (2 par scène) : node scripts/stills.mjs [--scale 0.5]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const timeline = JSON.parse(fs.readFileSync("src/timeline.json", "utf8"));
const scale = Number(process.env.STILL_SCALE || 0.5);
const browserExecutable = process.env.REMOTION_BROWSER || undefined;
const only = process.argv.slice(2);
const outDir = "out/stills";
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "BigOneValais", browserExecutable });
for (const s of timeline.scenes) {
  if (only.length && !only.some((o) => s.id.startsWith(o))) continue;
  const frames = { a: s.from + Math.round(s.durationInFrames * 0.45), b: s.from + s.durationInFrames - 12 };
  for (const [k, frame] of Object.entries(frames)) {
    const output = path.join(outDir, `${s.id}_${k}.jpg`);
    await renderStill({ serveUrl, composition, frame, output, browserExecutable, scale, imageFormat: "jpeg" });
    console.log(output);
  }
}
