import React, { createContext, useContext } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT_BODY, FONT_TITLE, px } from "./theme";

// ---------------------------------------------------------------------------
// Calage sur la voix : chaque scène connaît son texte et la durée de l'audio.
// ---------------------------------------------------------------------------
type SceneInfo = { text: string; voStart: number; voDur: number };
export const SceneCtx = createContext<SceneInfo>({
  text: "",
  voStart: 0,
  voDur: 1,
});

/** Frame (dans la scène) à laquelle la voix prononce `phrase`. */
export const useCue = () => {
  const { text, voStart, voDur } = useContext(SceneCtx);
  const { fps } = useVideoConfig();
  return (phrase: string, offsetSec = -0.25) => {
    const i = text.indexOf(phrase);
    if (i < 0) throw new Error(`Repère introuvable : « ${phrase} »`);
    const t = voStart + (voDur * i) / text.length + offsetSec;
    return Math.max(0, Math.round(t * fps));
  };
};

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const prog = (frame: number, start: number, dur = 18) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

// ---------------------------------------------------------------------------
// Apparitions
// ---------------------------------------------------------------------------
export const Reveal: React.FC<{
  at: number;
  dy?: number;
  dx?: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, dy = 24, dx = 0, dur = 18, style, children }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur);
  return (
    <div
      style={{
        opacity: p,
        translate: `${(1 - p) * dx}px ${(1 - p) * dy}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Nombre qui défile jusqu'à sa valeur, puis affiche le libellé exact du PDF. */
export const CountUp: React.FC<{
  at: number;
  to: number;
  final: string;
  format: (v: number) => string;
  dur?: number;
}> = ({ at, to, final, format, dur = 30 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur);
  if (p >= 1) return <>{final}</>;
  return <>{format(to * p)}</>;
};

/** Format suisse : 450’000 */
export const chf = (v: number) =>
  Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "’");

// ---------------------------------------------------------------------------
// Gabarit de slide (titre bleu, sous-titre, filet, pied de page)
// ---------------------------------------------------------------------------
export const SlideFrame: React.FC<{
  title: string;
  subtitle?: string;
  page: number;
  section: string;
  children: React.ReactNode;
}> = ({ title, subtitle, page, section, children }) => {
  const frame = useCurrentFrame();
  const pTitle = prog(frame, 2, 20);
  const pLine = prog(frame, 8, 30);
  const pSub = prog(frame, 10, 18);
  return (
    <AbsoluteFill style={{ background: C.white, fontFamily: FONT_BODY }}>
      <div
        style={{
          position: "absolute",
          left: px(104),
          top: px(subtitle ? 58 : 76),
          fontFamily: FONT_TITLE,
          fontWeight: 700,
          fontSize: px(40),
          color: C.blue,
          opacity: pTitle,
          translate: `${(1 - pTitle) * -30}px 0`,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            position: "absolute",
            left: px(104),
            top: px(119),
            fontSize: px(19),
            color: C.navy,
            opacity: pSub,
          }}
        >
          {subtitle}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: px(104),
          top: px(164),
          height: 2,
          width: px(1114) * pLine,
          background: C.blue,
        }}
      />
      <AbsoluteFill>{children}</AbsoluteFill>
      <Footer page={page} section={section} />
    </AbsoluteFill>
  );
};

export const Footer: React.FC<{ page: number; section: string; dark?: boolean }> = ({
  page,
  section,
}) => (
  <>
    <div
      style={{
        position: "absolute",
        left: px(104),
        top: px(697),
        width: px(1114),
        height: 1,
        background: C.rule,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: px(104),
        top: px(706),
        fontSize: px(13),
        color: C.grey,
        fontFamily: FONT_BODY,
      }}
    >
      Proposition de reprise · Document de discussion – Confidentiel
    </div>
    <div
      style={{
        position: "absolute",
        right: px(1333 - 1218),
        top: px(706),
        fontSize: px(13),
        color: C.grey,
        fontFamily: FONT_BODY,
        display: "flex",
        gap: 18,
      }}
    >
      <span style={{ color: C.blue, fontWeight: 700 }}>{section}</span>
      <span>{page}</span>
    </div>
  </>
);

// Positionnement en coordonnées du PDF (1333 × 750), converties à l'échelle vidéo.
export const Box: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ x, y, w, h, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: px(x),
      top: px(y),
      width: w !== undefined ? px(w) : undefined,
      height: h !== undefined ? px(h) : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.blue, size = 17, style }) => (
  <div
    style={{
      fontFamily: FONT_BODY,
      fontWeight: 700,
      fontSize: px(size),
      color,
      textTransform: "uppercase",
      letterSpacing: 0.3,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.navy, size = 16, style }) => (
  <div
    style={{
      fontFamily: FONT_BODY,
      fontSize: px(size),
      lineHeight: 1.35,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Big: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.blue, size = 52, style }) => (
  <div
    style={{
      fontFamily: FONT_TITLE,
      fontWeight: 700,
      fontSize: px(size),
      lineHeight: 1.05,
      color,
      fontVariantNumeric: "tabular-nums",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Puce bleue + titre gras + détail, comme dans « Le cadre été 2026 ». */
export const Bullet: React.FC<{ head: string; detail?: string; size?: number }> = ({
  head,
  detail,
  size = 18,
}) => (
  <div style={{ display: "flex", gap: px(12), marginBottom: px(10) }}>
    <div style={{ color: C.blue, fontSize: px(size), lineHeight: 1.3 }}>•</div>
    <div>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: px(size),
          color: C.blue,
          lineHeight: 1.3,
        }}
      >
        {head}
      </div>
      {detail ? (
        <div style={{ fontFamily: FONT_BODY, fontSize: px(size), color: C.navy, lineHeight: 1.3 }}>
          {detail}
        </div>
      ) : null}
    </div>
  </div>
);
