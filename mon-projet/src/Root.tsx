import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TutoClaudeCode } from "./Tuto/TutoClaudeCode";
import { TOTAL } from "./Tuto/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TutoClaudeCode"
        component={TutoClaudeCode}
        durationInFrames={TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
      <MyComposition />
    </>
  );
};
