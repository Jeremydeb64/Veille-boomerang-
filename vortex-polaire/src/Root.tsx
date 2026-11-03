import React from "react";
import { Composition } from "remotion";
import { VortexPolaire, videoSchema } from "./Video";
import { FPS, H, TOTAL_FRAMES, W } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VortexPolaire2026"
      component={VortexPolaire}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
      schema={videoSchema}
      defaultProps={{ subtitles: true, voiceover: false, music: true, musicVolume: 0.8 }}
    />
  );
};
