import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { clamp, easeOut, tween } from "../anim";
import { interpolate } from "remotion";

type Props = {
  text: string;
  from: number;
  /** frame de sortie (optionnelle) */
  to?: number;
  size?: number;
  weight?: number;
  color?: string;
  tracking?: number;
  stagger?: number;
  style?: React.CSSProperties;
  /** "letters" : lettre par lettre ; "words" : mot par mot */
  mode?: "letters" | "words";
  glow?: boolean;
};

/**
 * Titre cinétique : chaque glyphe arrive avec un flou de profondeur,
 * un léger décalage vertical et un resserrement de l'interlettrage.
 */
export const KineticTitle: React.FC<Props> = ({
  text,
  from,
  to,
  size = 96,
  weight = 800,
  color = C.white,
  tracking = 0.02,
  stagger = 1.6,
  style,
  mode = "letters",
  glow = false,
}) => {
  const frame = useCurrentFrame();
  const units = mode === "letters" ? Array.from(text) : text.split(/(\s+)/);
  const exit = to === undefined ? 0 : interpolate(frame, [to, to + 14], [0, 1], clamp);
  if (frame < from - 2 || exit >= 1) return null;

  const spacing = interpolate(frame, [from, from + 40], [tracking + 0.12, tracking], { ...clamp, easing: easeOut });

  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: `${spacing}em`,
        lineHeight: 1.02,
        whiteSpace: "pre",
        opacity: 1 - exit,
        filter: exit > 0 ? `blur(${exit * 10}px)` : undefined,
        transform: `translateY(${-exit * 24}px)`,
        textShadow: glow ? `0 0 40px ${C.cyan}66, 0 0 12px ${C.cyan}44` : undefined,
        ...style,
      }}
    >
      {units.map((u, i) => {
        const start = from + i * stagger;
        const p = tween(frame, [start, start + 22], [0, 1], easeOut);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 0.45}em) scale(${0.92 + 0.08 * p})`,
              filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
            }}
          >
            {u === " " ? " " : u}
          </span>
        );
      })}
    </div>
  );
};

/** Petit sur-titre éditorial avec filet animé */
export const Eyebrow: React.FC<{ text: string; from: number; to?: number; color?: string; style?: React.CSSProperties }> = ({
  text,
  from,
  to,
  color = C.cyan,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [from, from + 24], [0, 1], easeOut);
  const exit = to === undefined ? 0 : interpolate(frame, [to, to + 12], [0, 1], clamp);
  if (p <= 0 || exit >= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: p * (1 - exit), fontFamily: FONT, ...style }}>
      <div style={{ width: 56 * p, height: 2, background: color, boxShadow: `0 0 12px ${color}` }} />
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "0.28em",
          color,
          textTransform: "uppercase",
          transform: `translateX(${(1 - p) * -16}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
