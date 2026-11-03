import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, SAFE } from "../theme";
import { clamp, easeInOut, easeOut, tween } from "../anim";
import { AnimatedGlobe } from "../components/AnimatedGlobe";
import { GlobeVortexOverlay } from "../components/PolarVortex";
import { Eyebrow, KineticTitle } from "../components/KineticTitle";
import { Starfield } from "../components/Backdrop";
import { useGlobalAngle } from "./shared";

/** SCÈNE 1 — LE HOOK (0–11 s) : la Terre émerge, travelling vers l'Arctique. */
export const Scene01_Intro: React.FC<{ seqFrom: number }> = ({ seqFrom }) => {
  const frame = useCurrentFrame();
  const angleAt = useGlobalAngle(seqFrom);

  const reveal = tween(frame, [8, 75], [0, 1], easeOut);
  const travel = tween(frame, [20, 330], [0, 1], easeInOut);
  const radius = interpolate(travel, [0, 1], [300, 570]);
  const lat = interpolate(travel, [0, 1], [-18, -64]);
  const lon = 25 - frame * 0.07;
  const cx = interpolate(travel, [0, 1], [1200, 1290]);
  const cy = interpolate(travel, [0, 1], [560, 700]);
  const vortexIn = tween(frame, [60, 170], [0, 1]);
  const callout = interpolate(frame, [40, 60, 140, 160], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#02060d" }}>
      <Starfield opacity={reveal} drift={0.05} />
      {/* Halo de lumière bleue qui « allume » la planète */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${cx}px ${cy}px, ${C.deep}88 0%, rgba(7,20,38,0) ${radius * 1.9}px)`,
          opacity: reveal,
        }}
      />
      <AnimatedGlobe
        id="g1"
        cx={cx}
        cy={cy}
        radius={radius}
        rotate={[lon, lat]}
        opacity={reveal}
        atmosphere={reveal}
        overlay={(projection, isVisible) => {
          const pole = projection([0, 90]);
          return (
            <>
              <GlobeVortexOverlay
                id="g1v"
                projection={projection}
                isVisible={isVisible}
                angleAt={angleAt}
                wave={2.5}
                intensity={vortexIn}
                particles={700}
              />
              {pole && callout > 0 && (
                <g opacity={callout} fontFamily={FONT}>
                  <circle cx={pole[0]} cy={pole[1]} r={7} fill={C.white} />
                  <line x1={pole[0]} y1={pole[1]} x2={pole[0] + 160} y2={pole[1] - 150} stroke={C.white} strokeOpacity={0.7} />
                  <text x={pole[0] + 172} y={pole[1] - 158} fill={C.white} fontSize={24} fontWeight={700} letterSpacing="0.12em">
                    PÔLE NORD
                  </text>
                  <text x={pole[0] + 172} y={pole[1] - 128} fill={C.cyan} fontSize={20}>
                    ≈ 30 km d’altitude : la stratosphère
                  </text>
                </g>
              )}
            </>
          );
        }}
      />

      {/* Voile de lisibilité derrière le titre */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(90deg, rgba(2,6,13,0.78) 0%, rgba(2,6,13,0.45) 38%, rgba(2,6,13,0) 60%)",
          opacity: interpolate(frame, [140, 175, 300, 320], [0, 1, 1, 0], clamp),
        }}
      />
      {/* Titre */}
      <div style={{ position: "absolute", left: SAFE.x + 20, top: 300 }}>
        <Eyebrow text="Novembre 2026" from={150} to={300} color={C.orange} />
        <div style={{ height: 22 }} />
        <KineticTitle text="LE VORTEX" from={160} to={300} size={124} glow />
        <KineticTitle text="POLAIRE" from={172} to={302} size={124} color={C.cyan} glow />
        <div style={{ height: 26 }} />
        <KineticTitle
          text="L’hiver 2026 pourrait-il basculer ?"
          from={212}
          to={304}
          size={42}
          weight={300}
          tracking={0.01}
          mode="words"
          stagger={4}
          color={C.white}
        />
      </div>
    </AbsoluteFill>
  );
};
