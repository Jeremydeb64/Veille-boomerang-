import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { RecapProps } from "./data";
import { Background } from "./scenes/Background";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { Section } from "./scenes/Section";
import "./theme";

// Durées en secondes (le total est calculé dans Root.tsx avec les mêmes valeurs)
export const TIMING = { intro: 3.5, section: 6.5, outro: 3, cut: 0.5 };

export const recapDuration = (sectionCount: number, fps: number) =>
  Math.round(
    (TIMING.intro +
      sectionCount * TIMING.section +
      TIMING.outro -
      (sectionCount + 1) * TIMING.cut) *
      fps,
  );

export const RecapVeille: React.FC<RecapProps> = ({
  dateLabel,
  articleCount,
  sourceCount,
  sections,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Intro"
          durationInFrames={TIMING.intro * fps}
        >
          <Intro
            dateLabel={dateLabel}
            articleCount={articleCount}
            sourceCount={sourceCount}
          />
        </TransitionSeries.Sequence>
        {sections.flatMap((section) => [
          <TransitionSeries.Transition
            key={`t-${section.id}`}
            presentation={slide({ direction: "from-right" })}
            timing={linearTiming({ durationInFrames: TIMING.cut * fps })}
          />,
          <TransitionSeries.Sequence
            key={section.id}
            name={section.label}
            durationInFrames={TIMING.section * fps}
          >
            <Section section={section} />
          </TransitionSeries.Sequence>,
        ])}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TIMING.cut * fps })}
        />
        <TransitionSeries.Sequence
          name="Outro"
          durationInFrames={TIMING.outro * fps}
        >
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
