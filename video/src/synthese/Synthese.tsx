import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { SceneCtx } from "../boomerang/kit";
import { useFonts } from "../boomerang/Proposition";
import { C, FONT_BODY, FPS } from "../boomerang/theme";
import { prog } from "../boomerang/kit";
import { CHAPTER, CHAPTERS, NARRATION } from "./script";
import durations from "./durations.json";
import {
  Calendrier,
  Equilibre,
  Etapes,
  GardeFous,
  Gouvernance,
  Hypotheses,
  Intro,
  Mecanisme,
  PlanInitial,
  Proposition45,
  Valeur,
} from "./scenes";

type Id = keyof typeof durations;
const LEAD = 0.6;
const TAIL: Partial<Record<Id, number>> = { v01: 0.8, v04: 1.6, v07: 1.6, v11: 5 };

const frames = (id: Id) => Math.round((LEAD + durations[id] + (TAIL[id] ?? 1.0)) * FPS);
const ORDER: Id[] = ["v01", "v02", "v03", "v04", "v05", "v06", "v07", "v08", "v09", "v10", "v11"];
const STARTS = ORDER.reduce<number[]>((acc, id, i) => [...acc, i === 0 ? 0 : acc[i - 1] + frames(ORDER[i - 1])], []);
export const SYNTH_FRAMES = STARTS[STARTS.length - 1] + frames("v11");

const scene = (id: Id): React.ReactNode => {
  switch (id) {
    case "v01": return <Intro />;
    case "v02": return <Valeur />;
    case "v03": return <Mecanisme />;
    case "v04": return <PlanInitial />;
    case "v05": return <Hypotheses />;
    case "v06": return <Proposition45 />;
    case "v07": return <Equilibre />;
    case "v08": return <GardeFous />;
    case "v09": return <Gouvernance />;
    case "v10": return <Calendrier />;
    case "v11": return <Etapes endAt={Math.round((LEAD + durations.v11 + 0.6) * FPS)} />;
  }
};

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = interpolate(f, [0, 14], [1.02, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, scale: `${s}` }}>{children}</AbsoluteFill>;
};

/** Repère de chapitre (haut) + progression par chapitre (bas). */
const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  const idx = STARTS.findIndex((s, i) => f >= s && (i === STARTS.length - 1 || f < STARTS[i + 1]));
  const ch = CHAPTER[ORDER[Math.max(0, idx)]];
  const lastEnd = STARTS[10] + Math.round((LEAD + durations.v11 + 0.6) * FPS);
  const hide = ch === 0 || f >= lastEnd ? 0 : 1;
  const sceneStart = STARTS[Math.max(0, idx)];
  const p = prog(f, sceneStart, 14);
  // progression globale par chapitre
  const chStart = (c: number) => STARTS[ORDER.findIndex((id) => CHAPTER[id] === c)];
  const chEnd = (c: number) => (c === 5 ? lastEnd : chStart(c + 1));
  return (
    <AbsoluteFill style={{ opacity: hide, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 120, top: 52, display: "flex", alignItems: "center", gap: 14, opacity: p }}>
        <div style={{ background: C.blue, color: C.white, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 20, padding: "6px 12px", borderRadius: 4 }}>
          0{ch}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 20, color: C.navy }}>{CHAPTERS[ch - 1]}</div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", gap: 10 }}>
        {[1, 2, 3, 4, 5].map((c) => {
          const v = interpolate(f, [chStart(c), chEnd(c)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={c} style={{ flex: chEnd(c) - chStart(c), height: 6, background: C.light, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${v * 100}%`, height: "100%", background: c === ch ? C.blue : C.pale }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Synthese: React.FC = () => {
  useFonts();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.white }}>
      {ORDER.map((id, i) => {
        const dur = frames(id);
        return (
          <Sequence key={id} from={STARTS[i]} durationInFrames={dur} name={id}>
            <SceneCtx.Provider value={{ text: NARRATION[id], voStart: LEAD, voDur: durations[id] }}>
              <Fade dur={dur}>{scene(id)}</Fade>
            </SceneCtx.Provider>
            <Sequence from={Math.round(LEAD * fps)}>
              <Audio src={staticFile(`vo-synthese/${id}.mp3`)} />
            </Sequence>
          </Sequence>
        );
      })}
      <Chrome />
    </AbsoluteFill>
  );
};
