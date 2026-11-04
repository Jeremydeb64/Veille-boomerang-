import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { appear, clamp, easeOut, rise, shakeAt, wobble } from "../lib";
import { C, FONT_BODY, FONT_HEAD, H, W } from "../theme";

/* ------------------------------------------------------------------ fond */

/** Dégradé nuit + courbes de niveau qui respirent lentement (rappel « montagne ») */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const rings = Array.from({ length: 14 }, (_, i) => i);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 0%, ${C.bg1} 0%, ${C.bg0} 62%)`,
      }}
    >
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {rings.map((i) => {
          const r = 120 + i * 95;
          const pts = Array.from({ length: 73 }, (_, k) => {
            const a = (k / 72) * Math.PI * 2;
            const rr = r + Math.sin(a * 3 + i * 0.6 + t * 0.15) * (14 + i * 2.2) + Math.sin(a * 5 - t * 0.1 + i) * 8;
            return `${(880 + Math.cos(a) * rr * 1.1).toFixed(1)},${(1500 + Math.sin(a) * rr * 0.8).toFixed(1)}`;
          });
          return (
            <polygon
              key={i}
              points={pts.join(" ")}
              fill="none"
              stroke={C.sky}
              strokeOpacity={0.045 + (i % 3 === 0 ? 0.03 : 0)}
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(90% 60% at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- secousse */

/** Applique la secousse globale (repères dans timeline.json) au contenu */
export const Shake: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const a = shakeAt(frame);
  const t = frame * 0.9;
  return (
    <AbsoluteFill
      style={{
        translate: `${(wobble(t, 1) * 22 * a).toFixed(2)}px ${(wobble(t, 4) * 16 * a).toFixed(2)}px`,
        rotate: `${(wobble(t, 9) * 0.6 * a).toFixed(3)}deg`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- en-tête */

const CHAPTERS = ["L'histoire", "Et demain ?", "Se préparer"];

export const Header: React.FC<{ chapter: number; total: number }> = ({ chapter, total }) => {
  const frame = useCurrentFrame();
  const vis = appear(frame, 6, 20);
  return (
    <div style={{ position: "absolute", top: 96, left: 72, right: 72, opacity: vis }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 3,
            color: C.ink,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: C.coral,
              boxShadow: `0 0 ${12 + 10 * Math.sin(frame / 8)}px ${C.coral}`,
            }}
          />
          BIG ONE · VALAIS
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 2,
            color: chapter === 2 ? C.mint : C.mute,
            textTransform: "uppercase",
          }}
        >
          {chapter >= 0 && chapter < 3 ? `${chapter + 1} · ${CHAPTERS[chapter]}` : ""}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        {CHAPTERS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: C.line, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${(i < chapter ? 1 : i === chapter ? total : 0) * 100}%`,
                background: i === 2 ? C.mint : C.amber,
                borderRadius: 3,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------- sismographe */

/** Trace de sismographe qui défile ; s'emballe pendant les secousses */
export const Seismo: React.FC<{
  y: number;
  height: number;
  width?: number;
  x?: number;
  color?: string;
  boost?: number;
  opacity?: number;
}> = ({ y, height, width = W - 144, x = 72, color = C.sky, boost = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const n = 160;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    // l'amplitude dépend de la secousse « à l'instant où ce point a été tracé »
    const fAt = frame - (n - i) * 0.5;
    const a = Math.min(1, 0.06 + shakeAt(fAt) + boost);
    const v = wobble(fAt * 1.9 + i * 0.37, i % 7) * 0.7 + wobble(fAt * 4.3 + i * 1.3, 3) * 0.3;
    pts.push(`${(x + (i / n) * width).toFixed(1)},${(y + v * a * height * 0.5).toFixed(1)}`);
  }
  const a = Math.min(1, shakeAt(frame) + boost);
  const stroke = a > 0.25 ? C.coral : color;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity }}>
      <polyline points={pts.join(" ")} fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={x + width} cy={pts[n].split(",")[1]} r={7} fill={stroke} />
    </svg>
  );
};

/* ------------------------------------------------------------ éléments */

export const Kicker: React.FC<{ at: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  color = C.amber,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT_BODY,
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: 4,
        textTransform: "uppercase",
        color,
        ...rise(frame, at, 24),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Title: React.FC<{ at: number; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  size = 96,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT_HEAD,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: -1,
        color: C.ink,
        ...rise(frame, at, 50, 22),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}> = ({ at, children, style, accent }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, at, 20);
  return (
    <div
      style={{
        background: C.card,
        border: `2px solid ${C.cardLine}`,
        borderRadius: 32,
        padding: "30px 36px",
        opacity: p,
        translate: `0px ${(1 - p) * 50}px`,
        scale: String(0.94 + 0.06 * p),
        borderLeft: accent ? `8px solid ${accent}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Compteur animé (ex. 0 → 3500) */
export const Count: React.FC<{
  at: number;
  to: number;
  dur?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
}> = ({ at, to, dur = 30, decimals = 0, prefix = "", suffix = "", format }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [0, to], { ...clamp, easing: easeOut });
  const s = format ? format(v) : v.toFixed(decimals).replace(".", ",");
  return (
    <span>
      {prefix}
      {s}
      {suffix}
    </span>
  );
};

/** Grande statistique : chiffre + légende */
export const Stat: React.FC<{
  at: number;
  value: React.ReactNode;
  label: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ at, value, label, color = C.ink, size = 120, style }) => (
  <Card at={at} style={style}>
    <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: size, lineHeight: 1, color, letterSpacing: -2 }}>
      {value}
    </div>
    <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 32, color: C.mute, marginTop: 14, lineHeight: 1.25 }}>
      {label}
    </div>
  </Card>
);

/** Pastille ronde (icône ou chiffre) */
export const Badge: React.FC<{ color: string; size?: number; children: React.ReactNode }> = ({
  color,
  size = 92,
  children,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: `${color}22`,
      border: `3px solid ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color,
      fontFamily: FONT_HEAD,
      fontWeight: 700,
      fontSize: size * 0.44,
    }}
  >
    {children}
  </div>
);

export const Row: React.FC<{ at: number; icon: React.ReactNode; color: string; title: string; sub?: string }> = ({
  at,
  icon,
  color,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, at, 18);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30,
        opacity: p,
        translate: `${(1 - p) * -60}px 0px`,
      }}
    >
      <Badge color={color}>{icon}</Badge>
      <div>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 50, color: C.ink, lineHeight: 1.08 }}>{title}</div>
        {sub ? (
          <div style={{ fontFamily: FONT_BODY, fontWeight: 400, fontSize: 32, color: C.mute, marginTop: 6, lineHeight: 1.25 }}>
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Coche qui se dessine */
export const Check: React.FC<{ at: number; color?: string; size?: number }> = ({ at, color = C.mint, size = 46 }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, at + 6, 14);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M5 12.5 L10 17 L19 7"
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={24}
        strokeDashoffset={24 * (1 - p)}
      />
    </svg>
  );
};

export const Cross: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = C.coral }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M6 6 L18 18 M18 6 L6 18" stroke={color} strokeWidth={3.2} strokeLinecap="round" />
  </svg>
);

/** Anneaux d'onde sismique qui se propagent depuis un point */
export const Ripples: React.FC<{ x: number; y: number; at: number; color?: string; max?: number; count?: number }> = ({
  x,
  y,
  at,
  color = C.coral,
  max = 220,
  count = 3,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const period = 54;
        const local = (frame - at + i * (period / count)) % period;
        const p = local / period;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={10 + p * max}
            fill="none"
            stroke={color}
            strokeWidth={3}
            opacity={(1 - p) * 0.8 * appear(frame, at, 10)}
          />
        );
      })}
      <circle cx={x} cy={y} r={11 * appear(frame, at, 10, easeOut)} fill={color} />
    </g>
  );
};
