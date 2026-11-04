import { Composition } from "remotion";
import { buildRecap } from "./data";
import { RecapVeille, recapDuration } from "./RecapVeille";

const recap = buildRecap();

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="RecapVeille"
      component={RecapVeille}
      durationInFrames={recapDuration(recap.sections.length, 30)}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={recap}
    />
  );
};
