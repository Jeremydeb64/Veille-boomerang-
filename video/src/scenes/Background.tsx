import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../theme";

// Fond sombre avec halos roses qui dérivent lentement (même esprit que l'extension).
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.noir,
        backgroundImage: `radial-gradient(120% 70% at ${interpolate(
          frame,
          [0, durationInFrames],
          [90, 60],
        )}% ${interpolate(frame, [0, durationInFrames], [0, 15])}%, rgba(237,27,84,.45), transparent 55%), radial-gradient(90% 60% at 0% 100%, rgba(237,27,84,.22), transparent 60%)`,
      }}
    />
  );
};

export const Slash: React.FC<{ size: number; style?: React.CSSProperties }> = ({
  size,
  style,
}) => (
  <div
    style={{
      width: size * 0.62,
      height: size,
      backgroundColor: COLORS.rose,
      clipPath: "polygon(32% 0,100% 0,68% 100%,0 100%)",
      flexShrink: 0,
      ...style,
    }}
  />
);
