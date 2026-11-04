import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { SceneCtx } from "./kit";
import { NARRATION } from "./script";
import durations from "./durations.json";
import {
  Bonvesting,
  Cadre,
  Calendrier,
  Capital,
  Cover,
  Decider,
  Divider,
  Dividendes,
  Echanges,
  Echelonne,
  Entree45,
  Facteurs,
  Hypotheses,
  PlanPropose,
  Prochaines,
  Sommaire,
  Test,
  Valeur,
} from "./scenes";
import { FPS } from "./theme";

type SceneDef = { id: keyof typeof durations; el: React.ReactNode; tail?: number };

// Ordre : celui du sommaire (01 → 05), slides rangées selon leur numéro de page.
export const SCENES: SceneDef[] = [
  { id: "s01", el: <Cover />, tail: 1.0 },
  { id: "s02", el: <Sommaire />, tail: 1.0 },
  { id: "s03", el: <Divider num="01" title="Point de départ" page={3} /> },
  { id: "s04", el: <Cadre /> },
  { id: "s05", el: <Valeur /> },
  { id: "s06", el: <Divider num="02" title="Le plan proposé et son test" page={6} /> },
  { id: "s07", el: <PlanPropose /> },
  { id: "s08", el: <Hypotheses /> },
  { id: "s09", el: <Test />, tail: 1.8 },
  { id: "s10", el: <Divider num="03" title="Notre proposition" page={11} /> },
  { id: "s11", el: <Bonvesting /> },
  { id: "s12", el: <Facteurs /> },
  { id: "s13", el: <Entree45 />, tail: 1.6 },
  { id: "s14", el: <Echelonne /> },
  { id: "s15", el: <Dividendes />, tail: 1.8 },
  { id: "s16", el: <Divider num="04" title="Gouvernance et transition" page={16} /> },
  { id: "s17", el: <Capital /> },
  { id: "s18", el: <Decider /> },
  { id: "s19", el: <Calendrier />, tail: 1.8 },
  { id: "s20", el: <Divider num="05" title="Prochaines étapes" page={20} /> },
  { id: "s21", el: <Prochaines />, tail: 1.6 },
  { id: "s22", el: <Echanges />, tail: 2.5 },
];

const LEAD = 0.5; // la voix démarre 0,5 s après l'apparition de la scène
const DEFAULT_TAIL = 1.1;

const sceneFrames = (s: SceneDef) =>
  Math.round((LEAD + durations[s.id] + (s.tail ?? DEFAULT_TAIL)) * FPS);

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + sceneFrames(s), 0);

const FadeWrap: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const useFonts = () => {
  const [handle] = useState(() => delayRender("Chargement des polices"));
  useEffect(() => {
    const fonts = [
      new FontFace("Carlito", `url(${staticFile("fonts/Carlito-Bold.ttf")})`, { weight: "700" }),
      new FontFace("Liberation Sans", `url(${staticFile("fonts/LiberationSans-Regular.ttf")})`, { weight: "400" }),
      new FontFace("Liberation Sans", `url(${staticFile("fonts/LiberationSans-Bold.ttf")})`, { weight: "700" }),
    ];
    Promise.all(fonts.map((f) => f.load()))
      .then((loaded) => {
        loaded.forEach((f) => document.fonts.add(f));
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle]);
};

export const Proposition: React.FC = () => {
  useFonts();
  const { fps } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {SCENES.map((s) => {
        const dur = sceneFrames(s);
        const start = from;
        from += dur;
        return (
          <Sequence key={s.id} from={start} durationInFrames={dur} name={s.id}>
            <SceneCtx.Provider value={{ text: NARRATION[s.id], voStart: LEAD, voDur: durations[s.id] }}>
              <FadeWrap dur={dur}>{s.el}</FadeWrap>
            </SceneCtx.Provider>
            <Sequence from={Math.round(LEAD * fps)}>
              <Audio src={staticFile(`vo/${s.id}.mp3`)} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
