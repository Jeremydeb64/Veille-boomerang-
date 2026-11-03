import React, { useMemo } from "react";
import { random, useCurrentFrame } from "remotion";
import type { Pt } from "../anim";

export type ParticleSeed = { r: number[]; i: number };

type Props = {
  count: number;
  seed: string;
  /** Position d'une particule à l'instant t (en frames). null = invisible. */
  getPos: (p: ParticleSeed, t: number) => Pt | null;
  /** Longueur de traînée en frames */
  trail?: number;
  steps?: number;
  color?: string;
  width?: number;
  opacity?: number;
  /** Décalage temporel (pour démarrer en plein mouvement) */
  timeOffset?: number;
  blur?: boolean;
  /** distance (px) au-delà de laquelle la traînée est coupée (bouclage) */
  maxJump?: number;
};

/**
 * Particules déterministes : chaque particule possède des valeurs aléatoires
 * figées (random() de Remotion) et sa position est une fonction pure du temps.
 * Les traînées sont regroupées en 3 chemins SVG pour rester performantes.
 */
export const FlowParticles: React.FC<Props> = ({
  count,
  seed,
  getPos,
  trail = 6,
  steps = 3,
  color = "#45D6F5",
  width = 2.2,
  opacity = 1,
  timeOffset = 0,
  blur = false,
  maxJump = 120,
}) => {
  const frame = useCurrentFrame();
  const seeds = useMemo<ParticleSeed[]>(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        i,
        r: [0, 1, 2, 3, 4, 5].map((k) => random(`${seed}-${i}-${k}`)),
      })),
    [count, seed],
  );

  const t = frame + timeOffset;
  const groups = ["", "", ""];
  for (const p of seeds) {
    let d = "";
    let started = false;
    let prev: Pt | null = null;
    for (let s = steps; s >= 0; s--) {
      const pos = getPos(p, t - (trail * s) / steps);
      if (!pos) {
        started = false;
        prev = null;
        continue;
      }
      if (prev && Math.hypot(pos[0] - prev[0], pos[1] - prev[1]) > maxJump) started = false;
      d += `${started ? "L" : "M"}${pos[0].toFixed(1)},${pos[1].toFixed(1)}`;
      started = true;
      prev = pos;
    }
    if (d) groups[p.i % 3] += d;
  }

  return (
    <g style={blur ? { filter: "blur(0.6px)" } : undefined}>
      {groups.map((d, k) => (
        <path
          key={k}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width * (k === 0 ? 1.25 : k === 1 ? 1 : 0.7)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity * (k === 0 ? 0.95 : k === 1 ? 0.6 : 0.35)}
        />
      ))}
    </g>
  );
};
