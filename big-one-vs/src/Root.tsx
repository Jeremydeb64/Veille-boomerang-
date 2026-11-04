import { Composition } from "remotion";
import { BigOneVideo } from "./Video";
import { TIMELINE } from "./lib";
import { H, W } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BigOneValais"
      component={BigOneVideo}
      durationInFrames={TIMELINE.durationInFrames}
      fps={TIMELINE.fps}
      width={W}
      height={H}
    />
  );
};
