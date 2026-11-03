import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { OVERLAP, scene } from "./theme";
import { clamp } from "./anim";
import { Scene01_Intro } from "./scenes/Scene01_Intro";
import { Scene02_Atmosphere } from "./scenes/Scene02_Atmosphere";
import { Scene03_Disruption } from "./scenes/Scene03_Disruption";
import { Scene04_Data } from "./scenes/Scene04_Data";
import { Scene05_Europe } from "./scenes/Scene05_Europe";
import { Scene06_Conclusion } from "./scenes/Scene06_Conclusion";
import { Subtitles } from "./components/Subtitles";
import { CinemaFinish } from "./components/Backdrop";

export const videoSchema = z.object({
  /** Affiche les sous-titres incrustés */
  subtitles: z.boolean(),
  /** Lit public/audio/voiceover.wav (à déposer après enregistrement) */
  voiceover: z.boolean(),
  /** Musique + sound design génératifs */
  music: z.boolean(),
  musicVolume: z.number().min(0).max(1),
});

export type VideoProps = z.infer<typeof videoSchema>;

/** Fondu entrant de la scène suivante par-dessus la précédente */
const FadeIn: React.FC<{ children: React.ReactNode; enabled: boolean }> = ({ children, enabled }) => {
  const frame = useCurrentFrame();
  const o = enabled ? interpolate(frame, [0, OVERLAP], [0, 1], clamp) : 1;
  const blur = enabled ? interpolate(frame, [0, OVERLAP], [8, 0], clamp) : 0;
  return <AbsoluteFill style={{ opacity: o, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>;
};

const SCENES = [
  { id: "Scene01_Intro", C: Scene01_Intro, needsFrom: true },
  { id: "Scene02_Atmosphere", C: Scene02_Atmosphere, needsFrom: true },
  { id: "Scene03_Disruption", C: Scene03_Disruption, needsFrom: true },
  { id: "Scene04_Data", C: Scene04_Data, needsFrom: false },
  { id: "Scene05_Europe", C: Scene05_Europe, needsFrom: false },
  { id: "Scene06_Conclusion", C: Scene06_Conclusion, needsFrom: true },
] as const;

export const VortexPolaire: React.FC<VideoProps> = ({ subtitles, voiceover, music, musicVolume }) => {
  return (
    <AbsoluteFill style={{ background: "#02060d" }}>
      {SCENES.map(({ id, C }, i) => {
        const s = scene(id);
        const from = i === 0 ? 0 : s.from - OVERLAP;
        const dur = s.duration + (i === 0 ? 0 : OVERLAP) + (i === SCENES.length - 1 ? 0 : OVERLAP);
        return (
          <Sequence key={id} name={id} from={from} durationInFrames={dur}>
            <FadeIn enabled={i > 0}>
              <C seqFrom={from} />
            </FadeIn>
          </Sequence>
        );
      })}
      <CinemaFinish />
      {subtitles && <Subtitles />}
      {/* La musique s'efface sous la voix off lorsqu'elle est activée */}
      {music && <Audio src={staticFile("audio/music.mp3")} volume={musicVolume * (voiceover ? 0.55 : 1)} />}
      {music && <Audio src={staticFile("audio/sfx.mp3")} volume={Math.min(1, musicVolume * (voiceover ? 0.8 : 1.2))} />}
      {voiceover && <Audio src={staticFile("audio/voiceover.wav")} />}
    </AbsoluteFill>
  );
};
