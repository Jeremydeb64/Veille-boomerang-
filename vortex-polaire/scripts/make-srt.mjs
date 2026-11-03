// Génère voiceover/vortex-polaire.fr.srt depuis src/timeline.json
import fs from "node:fs";
const tl = JSON.parse(fs.readFileSync("src/timeline.json", "utf8"));
const ts = (s) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, "0")}`;
};
const srt = tl.cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join("\n");
fs.mkdirSync("voiceover", { recursive: true });
fs.writeFileSync("voiceover/vortex-polaire.fr.srt", srt);
console.log(`SRT : ${tl.cues.length} sous-titres → voiceover/vortex-polaire.fr.srt`);
