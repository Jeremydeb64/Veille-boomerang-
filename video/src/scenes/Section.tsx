import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SectionData } from "../data";
import { COLORS, FONT } from "../theme";
import { Slash } from "./Background";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const HeadlineCard: React.FC<{
  title: string;
  source: string;
  delay: number;
}> = ({ title, source, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        borderLeft: `8px solid ${COLORS.rose}`,
        paddingLeft: 36,
        opacity: interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], clamp),
        translate: interpolate(
          frame,
          [delay, delay + 0.8 * fps],
          ["60px 0px", "0px 0px"],
          {
            ...clamp,
            easing: ease,
          },
        ),
      }}
    >
      <div
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: COLORS.rose,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 12,
        }}
      >
        {source}
      </div>
      <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.15 }}>
        {title}
      </div>
    </div>
  );
};

export const Section: React.FC<{ section: SectionData }> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        color: "white",
        padding: "180px 100px 160px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], clamp),
          translate: interpolate(
            frame,
            [0, 0.7 * fps],
            ["0px -40px", "0px 0px"],
            {
              ...clamp,
              easing: ease,
            },
          ),
        }}
      >
        <Slash size={110} />
        <div style={{ fontSize: 110, fontWeight: 900, lineHeight: 1 }}>
          {section.label}
        </div>
      </div>
      <div
        style={{
          fontSize: 46,
          fontWeight: 500,
          color: COLORS.grisTxt,
          marginTop: 24,

          opacity: interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], clamp),
        }}
      >
        {section.count} article{section.count > 1 ? "s" : ""} ces dernières 36 h
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 80,
        }}
      >
        {section.headlines.map((h, i) => (
          <HeadlineCard
            key={h.title}
            title={h.title}
            source={h.source}
            delay={(0.7 + i * 0.9) * fps}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
