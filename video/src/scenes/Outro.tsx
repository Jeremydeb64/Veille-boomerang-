import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { Slash } from "./Background";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        color: "white",
        padding: "0 100px",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Slash
        size={160}
        style={{
          marginBottom: 60,
          rotate: interpolate(frame, [0, 0.8 * fps], ["-90deg", "0deg"], {
            ...clamp,
            easing: Easing.spring({ damping: 14 }),
          }),
        }}
      />
      <div
        style={{
          fontSize: 130,
          fontWeight: 900,
          lineHeight: 1.05,
          opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], clamp),
        }}
      >
        Bonne journée !
      </div>
      <div
        style={{
          fontSize: 50,
          fontWeight: 500,
          marginTop: 50,
          color: COLORS.grisTxt,
          opacity: interpolate(frame, [0.7 * fps, 1.3 * fps], [0, 1], clamp),
        }}
      >
        Tous les articles dans Le Pouls
      </div>
    </AbsoluteFill>
  );
};
