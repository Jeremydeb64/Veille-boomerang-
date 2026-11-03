import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";

/** Fond spatial : dégradé nuit, champ d'étoiles scintillant, parallaxe légère. */
export const Starfield: React.FC<{ drift?: number; opacity?: number; count?: number }> = ({
  drift = 0.08,
  opacity = 1,
  count = 260,
}) => {
  const frame = useCurrentFrame();
  const stars = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`sx${i}`) * W,
        y: random(`sy${i}`) * H,
        r: 0.4 + random(`sr${i}`) ** 3 * 1.8,
        ph: random(`sp${i}`) * Math.PI * 2,
        depth: 0.3 + random(`sd${i}`) * 0.7,
      })),
    [count],
  );
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity }}>
      {stars.map((s, i) => {
        const x = (s.x - frame * drift * s.depth + W * 10) % W;
        const tw = 0.45 + 0.55 * Math.sin(frame * 0.05 * (0.5 + s.depth) + s.ph) ** 2;
        return <circle key={i} cx={x} cy={s.y} r={s.r} fill={C.white} opacity={tw * 0.75 * s.depth} />;
      })}
    </svg>
  );
};

export const NightGradient: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 80% 70% at 55% 45%, #0d2544 0%, ${C.night} 55%, #030a14 100%)`,
    }}
  />
);

/** Vignettage + grain déterministe (seed = frame) pour une texture cinéma. */
export const CinemaFinish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(1,4,10,0.6) 100%)",
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "screen" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
