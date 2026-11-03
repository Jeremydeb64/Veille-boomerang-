import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Background } from "./ui";
import { Intro, Outro, Step1, Step2, Step3 } from "./scenes";
import { C, clamp, out, sans, SCENES, TOTAL, VOICE } from "./theme";

/** Fondu enchaîné à l'entrée et à la sortie de chaque scène */
const SceneFade: React.FC<{ dur: number; children: React.ReactNode }> = ({
  dur,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp),
        scale: interpolate(frame, [dur - 8, dur], [1, 0.97], clamp),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Barre de progression des 3 étapes */
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [SCENES.step1, SCENES.step2, SCENES.step3];
  const visible = interpolate(
    frame,
    [SCENES.step1.from - 4, SCENES.step1.from + 8, SCENES.outro.from - 6, SCENES.outro.from],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 130,
        right: 130,
        display: "flex",
        gap: 18,
        opacity: visible,
      }}
    >
      {steps.map((s, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 10,
            borderRadius: 5,
            background: C.cardBorder,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: C.accent,
              width: `${interpolate(frame, [s.from, s.from + s.dur], [0, 100], clamp)}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

/** Sous-titre de la voix off */
const Caption: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          marginBottom: 56,
          padding: "14px 30px",
          borderRadius: 16,
          background: "rgba(0,0,0,0.55)",
          color: C.text,
          fontFamily: sans,
          fontSize: 34,
          fontWeight: 600,
          opacity: interpolate(frame, [0, 6, dur - 4, dur], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [0, 10], ["0px 16px", "0px 0px"], {
            ...clamp,
            easing: out,
          }),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const sceneList = [
  { ...SCENES.intro, C: Intro, name: "Intro" },
  { ...SCENES.step1, C: Step1, name: "Étape 1" },
  { ...SCENES.step2, C: Step2, name: "Étape 2" },
  { ...SCENES.step3, C: Step3, name: "Étape 3" },
  { ...SCENES.outro, C: Outro, name: "Exercice" },
];

export const TutoClaudeCode: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {sceneList.map(({ from, dur, C: Scene, name }) => (
        <Sequence key={name} name={name} from={from} durationInFrames={dur}>
          <SceneFade dur={dur}>
            <Scene />
          </SceneFade>
        </Sequence>
      ))}
      <Progress />
      <Audio
        src={staticFile("musique.mp3")}
        volume={(f) =>
          interpolate(f, [0, 10, TOTAL - 20, TOTAL], [0, 0.3, 0.3, 0], clamp)
        }
      />
      {VOICE.map((v, i) => {
        const next = VOICE[i + 1]?.at ?? TOTAL;
        return (
          <Sequence
            key={v.file}
            name={`Voix ${i + 1}`}
            from={v.at}
            durationInFrames={next - v.at}
          >
            <Audio src={staticFile(v.file)} />
            <Caption text={v.text} dur={next - v.at} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
