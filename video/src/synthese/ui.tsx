import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_TITLE } from "../boomerang/theme";
import { prog } from "../boomerang/kit";

// Coordonnées natives 1920 × 1080.
export const Abs: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>
);

/** Titre de scène : une phrase-clé, le mot important en bleu. */
export const Headline: React.FC<{
  kicker: string;
  children: React.ReactNode;
  at?: number;
  y?: number;
}> = ({ kicker, children, at = 0, y = 128 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 20);
  const p2 = prog(f, at + 6, 22);
  return (
    <>
      <Abs x={120} y={y} style={{ opacity: p, translate: `0 ${(1 - p) * 14}px` }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.blue, textTransform: "uppercase" }}>
          {kicker}
        </div>
      </Abs>
      <Abs x={120} y={y + 36} w={1680} style={{ opacity: p2, translate: `0 ${(1 - p2) * 24}px` }}>
        <div style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 64, lineHeight: 1.08, color: C.navy }}>{children}</div>
      </Abs>
    </>
  );
};

export const Hl: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.blue }) => (
  <span style={{ color }}>{children}</span>
);

export const T: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  bold?: boolean;
  title?: boolean;
  style?: React.CSSProperties;
}> = ({ children, size = 26, color = C.navy, bold, title, style }) => (
  <div
    style={{
      fontFamily: title ? FONT_TITLE : FONT_BODY,
      fontWeight: bold || title ? 700 : 400,
      fontSize: size,
      color,
      lineHeight: 1.25,
      fontVariantNumeric: "tabular-nums",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Pastille ronde avec initiale (Yvan / Jérémy). */
export const Avatar: React.FC<{ letter: string; color: string; size?: number; style?: React.CSSProperties }> = ({
  letter,
  color,
  size = 120,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      color: C.white,
      fontFamily: FONT_TITLE,
      fontWeight: 700,
      fontSize: size * 0.48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {letter}
  </div>
);

// ---------------------------------------------------------------------------
// Pictogrammes (traits simples, couleur unique)
// ---------------------------------------------------------------------------
type IconName = "building" | "chart" | "network" | "pie" | "people" | "shield" | "calendar" | "check" | "doc" | "pen" | "coins" | "handshake";
export const Icon: React.FC<{ name: IconName; size?: number; color?: string }> = ({ name, size = 56, color = C.blue }) => {
  const s = { fill: "none", stroke: color, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    building: (
      <>
        <rect x="10" y="8" width="20" height="34" {...s} />
        <rect x="30" y="20" width="12" height="22" {...s} />
        <path d="M15 15h4M21 15h4M15 22h4M21 22h4M15 29h4M21 29h4M17 42v-6h6v6" {...s} />
      </>
    ),
    chart: (
      <>
        <path d="M6 42h36" {...s} />
        <path d="M8 34l10-10 7 6 14-16" {...s} />
        <path d="M33 14h6v6" {...s} />
      </>
    ),
    network: (
      <>
        <circle cx="24" cy="24" r="5" {...s} />
        <circle cx="9" cy="10" r="4" {...s} />
        <circle cx="39" cy="10" r="4" {...s} />
        <circle cx="9" cy="38" r="4" {...s} />
        <circle cx="39" cy="38" r="4" {...s} />
        <path d="M12 13l8 7M36 13l-8 7M12 35l8-7M36 35l-8-7" {...s} />
      </>
    ),
    pie: (
      <>
        <circle cx="24" cy="24" r="17" {...s} />
        <path d="M24 7v17h17" {...s} />
      </>
    ),
    people: (
      <>
        <circle cx="17" cy="16" r="6" {...s} />
        <circle cx="33" cy="18" r="5" {...s} />
        <path d="M6 40c0-7 5-12 11-12s11 5 11 12M28 40c0-5 2-9 6-10 5 0 8 4 8 10" {...s} />
      </>
    ),
    shield: (
      <>
        <path d="M24 5l15 6v11c0 10-7 17-15 21C16 39 9 32 9 22V11z" {...s} />
        <path d="M17 24l5 5 9-10" {...s} />
      </>
    ),
    calendar: (
      <>
        <rect x="7" y="10" width="34" height="31" rx="3" {...s} />
        <path d="M7 19h34M16 6v8M32 6v8" {...s} />
      </>
    ),
    check: <path d="M10 25l9 9 19-20" {...s} />,
    doc: (
      <>
        <path d="M12 5h17l9 9v29H12z" {...s} />
        <path d="M29 5v9h9M18 24h14M18 31h14" {...s} />
      </>
    ),
    pen: (
      <>
        <path d="M30 8l10 10-20 20H10V28z" {...s} />
        <path d="M8 44h32" {...s} />
      </>
    ),
    coins: (
      <>
        <ellipse cx="20" cy="14" rx="12" ry="5" {...s} />
        <path d="M8 14v8c0 3 5 5 12 5s12-2 12-5v-8M8 22v8c0 3 5 5 12 5" {...s} />
        <ellipse cx="32" cy="32" rx="9" ry="4" {...s} />
        <path d="M23 32v6c0 2 4 4 9 4s9-2 9-4v-6" {...s} />
      </>
    ),
    handshake: (
      <>
        <path d="M4 20l8-6 8 3 6-3 8 1 10 5" {...s} />
        <path d="M12 26l8 8c2 2 4 2 5 0l9-9M18 30l4 4M14 22l-4 6" {...s} />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {paths[name]}
    </svg>
  );
};

/** Flèche SVG animée (tracé progressif) avec point qui circule. */
export const FlowArrow: React.FC<{
  d: string;
  at: number;
  color?: string;
  dur?: number;
  dots?: boolean;
  width?: number;
}> = ({ d, at, color = C.blue, dur = 24, dots = true, width = 1920 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  const id = `m${Math.abs(hash(d))}`;
  const travel = ((f - at) % 60) / 60;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={width} height={1080}>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill={color} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} markerEnd={p > 0.97 ? `url(#${id})` : undefined} />
      {/* point qui circule : position calculée image par image */}
      {dots && p >= 1 ? <DotOnPath d={d} t={travel} color={color} /> : null}
    </svg>
  );
};

const DotOnPath: React.FC<{ d: string; t: number; color: string }> = ({ d, t, color }) => {
  // chemins utilisés : « M x1 y1 Q cx cy x2 y2 » (courbe quadratique)
  const n = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (n.length < 6) return null;
  const [x1, y1, cx, cy, x2, y2] = n;
  const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
  const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
  return <circle cx={x} cy={y} r={9} fill={color} stroke={C.white} strokeWidth={3} />;
};

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
};
