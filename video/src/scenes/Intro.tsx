import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { Slash } from "./Background";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Intro: React.FC<{
  dateLabel: string;
  articleCount: number;
  sourceCount: number;
}> = ({ dateLabel, articleCount, sourceCount }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        color: "white",
        padding: "0 100px",
        justifyContent: "center",
      }}
    >
      <Slash
        size={220}
        style={{
          marginBottom: 60,
          scale: interpolate(frame, [0, 0.6 * fps], [0, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
        }}
      />
      <div
        style={{
          fontSize: 64,
          fontWeight: 500,
          color: COLORS.rose,
          letterSpacing: 2,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0.3 * fps, 0.9 * fps], [0, 1], clamp),
        }}
      >
        La veille du jour
      </div>
      <div
        style={{
          fontSize: 150,
          fontWeight: 900,
          lineHeight: 1,
          marginTop: 20,
          opacity: interpolate(frame, [0.4 * fps, 1 * fps], [0, 1], clamp),
          translate: interpolate(
            frame,
            [0.4 * fps, 1.2 * fps],
            ["0px 80px", "0px 0px"],
            {
              ...clamp,
              easing: ease,
            },
          ),
        }}
      >
        Boomerang
      </div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 400,
          marginTop: 50,
          opacity: interpolate(frame, [0.9 * fps, 1.5 * fps], [0, 1], clamp),
        }}
      >
        {dateLabel}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 500,
          marginTop: 24,
          color: COLORS.grisTxt,
          opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], clamp),
        }}
      >
        {articleCount} articles · {sourceCount} sources
      </div>
    </AbsoluteFill>
  );
};
