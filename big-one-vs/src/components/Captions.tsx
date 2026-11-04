import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, TIMELINE, appear, wordsOf } from "../lib";
import { C, FONT_BODY } from "../theme";

type CW = { text: string; start: number; end: number };
type Chunk = { words: CW[]; start: number; end: number };

/** Découpe la voix en groupes de 2 à 4 mots, coupés aux pauses naturelles */
const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const s of TIMELINE.scenes) {
    const base = s.from + s.voiceFrom;
    const words = wordsOf(s.id).map((w) => ({
      text: w.w,
      start: base + w.t * FPS,
      end: base + (w.t + w.d) * FPS,
    }));
    let cur: CW[] = [];
    const flush = () => {
      if (cur.length) chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    };
    words.forEach((w, i) => {
      cur.push(w);
      const next = words[i + 1];
      const len = cur.map((x) => x.text).join(" ").length;
      const pause = next ? next.start - w.end > 0.22 * FPS : true;
      if (!next || pause || cur.length >= 4 || len >= 22) flush();
    });
    flush();
  }
  // durée d'affichage : jusqu'au groupe suivant, avec un léger maintien
  return chunks.map((c, i) => {
    const next = chunks[i + 1];
    const hold = c.end + 0.45 * FPS;
    return { ...c, end: next ? Math.min(hold, next.start) : hold };
  });
};

const CHUNKS = buildChunks();

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const c = CHUNKS.find((x) => frame >= x.start && frame < x.end);
  if (!c) return null;
  const p = appear(frame, c.start, 6);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1440,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.18,
          textAlign: "center",
          color: C.ink,
          background: "rgba(8,14,24,0.62)",
          border: `2px solid ${C.cardLine}`,
          borderRadius: 26,
          padding: "16px 34px 20px",
          opacity: p,
          scale: String(0.94 + 0.06 * p),
          maxWidth: 940,
        }}
      >
        {c.words.map((w, i) => {
          const active = frame >= w.start - 1;
          return (
            <span key={i} style={{ color: active ? C.ink : "rgba(245,241,232,0.45)" }}>
              {w.text}
              {i < c.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
