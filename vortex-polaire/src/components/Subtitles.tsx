import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FPS, timeline } from "../theme";
import { clamp } from "../anim";

/** Sous-titres incrustés, synchronisés sur les repères de timeline.json */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cue = timeline.cues.find((c) => t >= c.start - 0.05 && t < c.end + 0.25);
  if (!cue) return null;
  const f0 = cue.start * FPS;
  const f1 = (cue.end + 0.25) * FPS;
  const o = interpolate(frame, [f0 - 2, f0 + 4, f1 - 5, f1], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 118,
        display: "flex",
        justifyContent: "center",
        opacity: o,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1340,
          padding: "12px 26px",
          borderRadius: 10,
          background: "rgba(4,12,24,0.62)",
          backdropFilter: "blur(6px)",
          fontFamily: FONT,
          fontSize: 38,
          fontWeight: 500,
          lineHeight: 1.3,
          color: C.white,
          textAlign: "center",
          letterSpacing: "0.005em",
          textShadow: "0 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
