import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TIMELINE, clamp } from "./lib";
import { Background, Header, Seismo, Shake } from "./components/ui";
import { Captions } from "./components/Captions";
import { S01Hook, S02Timeline, S03Visp, S04Sierre, S05Now } from "./scenes/History";
import { S06Projection, S07Nature } from "./scenes/Future";
import { S08Before, S09During, S10After, S11Outro } from "./scenes/Prepare";
import "./theme";

const SCENES: Record<string, { C: React.FC; chapter: number }> = {
  s01_hook: { C: S01Hook, chapter: -1 },
  s02_timeline: { C: S02Timeline, chapter: 0 },
  s03_1855: { C: S03Visp, chapter: 0 },
  s04_1946: { C: S04Sierre, chapter: 0 },
  s05_now: { C: S05Now, chapter: 1 },
  s06_projection: { C: S06Projection, chapter: 1 },
  s07_nature: { C: S07Nature, chapter: 1 },
  s08_avant: { C: S08Before, chapter: 2 },
  s09_pendant: { C: S09During, chapter: 2 },
  s10_apres: { C: S10After, chapter: 2 },
  s11_outro: { C: S11Outro, chapter: 3 },
};

/** Fondu d'entrée / sortie de chaque scène */
const SceneFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, dur - 8, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o, translate: `0px ${(1 - Math.min(1, frame / 10)) * 24}px` }}>{children}</AbsoluteFill>;
};

/** En-tête : chapitre courant + progression dans le chapitre */
const ChapterHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const cur = [...TIMELINE.scenes].reverse().find((s) => frame >= s.from) ?? TIMELINE.scenes[0];
  const chapter = SCENES[cur.id].chapter;
  const inChapter = TIMELINE.scenes.filter((s) => SCENES[s.id].chapter === chapter);
  let progress = 1;
  if (inChapter.length) {
    const a = inChapter[0].from;
    const last = inChapter[inChapter.length - 1];
    const b = last.from + last.durationInFrames;
    progress = interpolate(frame, [a, b], [0, 1], clamp);
  }
  return <Header chapter={chapter} total={progress} />;
};

export const BigOneVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1422" }}>
      <Background />
      <Shake>
        {TIMELINE.scenes.map((s) => {
          const { C: Scene } = SCENES[s.id];
          return (
            <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.durationInFrames} premountFor={fps}>
              <SceneFade dur={s.durationInFrames}>
                <Scene />
              </SceneFade>
            </Sequence>
          );
        })}
      </Shake>
      <ChapterHeader />
      <Seismo y={208} height={26} opacity={0.55} />
      <Captions />
      <Audio src={staticFile("audio/mix.m4a")} />
    </AbsoluteFill>
  );
};
