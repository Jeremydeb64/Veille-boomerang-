import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, OVERLAP, SAFE } from "../theme";
import { clamp, easeInOut, easeOut, lerp, tween } from "../anim";
import { AnimatedGlobe } from "../components/AnimatedGlobe";
import { GlobeVortexOverlay } from "../components/PolarVortex";
import { KineticTitle } from "../components/KineticTitle";
import { Starfield } from "../components/Backdrop";
import { useGlobalAngle } from "./shared";

const QUESTION = "M20,48 C20,16 44,2 64,2 C88,2 106,20 106,44 C106,68 86,78 72,88 C61,96 60,104 60,122";

const CREDITS: [string, string][] = [
  ["Sources scientifiques", "NOAA Climate.gov — Understanding the Arctic polar vortex · Met Office — Sudden stratospheric warming"],
  [
    "Actualité et prévisions (au 3 nov. 2026)",
    "Prévisions d’ensemble ECMWF relayées par Severe Weather Europe, The Watchers, Fox Weather, Capital Weather Gang, Sortiraparis",
  ],
  ["Cartographie", "Natural Earth (domaine public), via world-atlas"],
  ["Musique et sons", "Composition générative originale, créée pour cette vidéo"],
  ["Avertissement", "Les schémas illustrent des tendances qualitatives. Ils ne constituent pas une prévision météorologique."],
];

/** SCÈNE 6 — CONCLUSION (70–88 s) */
export const Scene06_Conclusion: React.FC<{ seqFrom: number }> = ({ seqFrom }) => {
  const frame = useCurrentFrame();
  const o = OVERLAP;
  const angleAt = useGlobalAngle(seqFrom);

  const back = tween(frame, [0, o + 330], [0, 1], easeInOut);
  const radius = lerp(1700, 330, Math.pow(back, 0.7));
  const rot: [number, number] = [lerp(-10, -30, back), lerp(-50, -66, back)];
  const cx = lerp(960, 1300, back);
  const cy = lerp(540, 580, back);
  const vortexIn = tween(frame, [o + 30, o + 180], [0, 1]);
  const credits = tween(frame, [o + 445, o + 470], [0, 1], easeOut);
  const fadeBlack = interpolate(frame, [o + 515, o + 540], [0, 1], clamp);

  const q = tween(frame, [o + 222, o + 290], [0, 1], easeInOut);
  const qDot = tween(frame, [o + 285, o + 300], [0, 1], easeOut);
  const qOut = interpolate(frame, [o + 372, o + 386], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#02060d" }}>
      <Starfield drift={0.02} opacity={back} />
      <AbsoluteFill style={{ opacity: 1 - credits * 0.7 }}>
        <AnimatedGlobe
          id="g6"
          cx={cx}
          cy={cy}
          radius={radius}
          rotate={rot}
          detail="50"
          overlay={(projection, isVisible) => (
            <GlobeVortexOverlay
              id="g6v"
              projection={projection}
              isVisible={isVisible}
              angleAt={angleAt}
              wave={6}
              intensity={vortexIn}
              particles={650}
            />
          )}
        />
      </AbsoluteFill>

      <div style={{ position: "absolute", left: SAFE.x + 10, top: 330 }}>
        <KineticTitle text="UN VORTEX" from={o + 85} to={o + 200} size={92} />
        <KineticTitle text="PERTURBÉ" from={o + 95} to={o + 202} size={92} color={C.orange} glow />
      </div>

      <div style={{ position: "absolute", left: SAFE.x + 10, top: 330, opacity: qOut }}>
        <KineticTitle text="UN HIVER" from={o + 205} to={o + 372} size={92} />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
          <KineticTitle text="GLACIAL" from={o + 213} to={o + 372} size={92} color={C.ice} glow />
          {frame > o + 218 && (
            <svg width={78} height={102} viewBox="0 0 130 170" style={{ marginBottom: 12, overflow: "visible" }}>
              <path d={QUESTION} fill="none" stroke={C.orange} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - q} style={{ filter: `drop-shadow(0 0 14px ${C.orange})` }} />
              <circle cx={60} cy={156} r={12 * qDot} fill={C.orange} />
            </svg>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", left: SAFE.x + 10, top: 360, opacity: 1 - credits }}>
        <KineticTitle text="LA SCIENCE OBSERVE." from={o + 392} size={66} weight={800} mode="words" stagger={5} />
        <div style={{ height: 10 }} />
        <KineticTitle text="LA MÉTÉO RESTE INCERTAINE." from={o + 408} size={66} weight={800} color={C.cyan} mode="words" stagger={5} />
      </div>

      {/* Crédits */}
      {credits > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: credits, fontFamily: FONT }}>
          <div style={{ width: 1280, transform: `translateY(${(1 - credits) * 20}px)` }}>
            <div style={{ fontSize: 22, letterSpacing: "0.32em", color: C.cyan, fontWeight: 700, marginBottom: 30 }}>
              VORTEX POLAIRE : L’HIVER 2026 POURRAIT-IL BASCULER ?
            </div>
            {CREDITS.map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 30, marginBottom: 18, alignItems: "baseline" }}>
                <div style={{ width: 330, flexShrink: 0, fontSize: 17, letterSpacing: "0.18em", textTransform: "uppercase", color: C.orange, fontWeight: 700 }}>
                  {k}
                </div>
                <div style={{ fontSize: 22, color: C.white, lineHeight: 1.4 }}>{v}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      <AbsoluteFill style={{ background: "#000", opacity: fadeBlack }} />
    </AbsoluteFill>
  );
};

