import React from "react";
import { geoOrthographic, geoPath, type GeoProjection } from "d3-geo";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, H, OVERLAP, SAFE, W } from "../theme";
import { clamp, easeInOut, easeOut, lerp, type Pt, smoothPath, tween } from "../anim";
import { AnimatedMap, type MapLabel } from "../components/AnimatedMap";
import { FlowParticles } from "../components/FlowParticles";
import { Badge, SourceLabel } from "../components/SourceLabel";
import { KineticTitle } from "../components/KineticTitle";
import { forecast, sample } from "../components/DataChart";
import { zoomPt } from "./Scene04_Data";

/* Courant-jet schématique (illustration pédagogique, pas une prévision) */
const jetA = (lon: number) => 56 + 2.5 * Math.sin(((lon + 10) / 14) * 1.0);
const jetB = (lon: number) => 54 + 10 * Math.cos(((lon + 15) * 2 * Math.PI) / 60);
const LON0 = -45;
const LON1 = 60;
const N = 100;

/** SCÈNE 5 — L'EUROPE ET LA SUISSE (54–70 s) */
export const Scene05_Europe: React.FC = () => {
  const frame = useCurrentFrame();
  const o = OVERLAP;

  // Caméra cartographique : plongée vers les Alpes
  const cam = tween(frame, [o - 10, o + 210], [0, 1], easeInOut);
  const rot: [number, number] = [lerp(5, -10, cam), lerp(-60, -50.5, cam)];
  const scale = lerp(950, 2250, cam);
  const mapIn = tween(frame, [0, o + 25], [0, 1]);

  const morphChart = tween(frame, [o - 10, o + 45], [0, 1], easeInOut);
  const toB = tween(frame, [o + 240, o + 300], [0, 1], easeInOut);
  const jet = (lon: number) => lerp(jetA(lon), jetB(lon), toB);
  const cold = tween(frame, [o + 285, o + 360], [0, 1], easeOut);

  const projection: GeoProjection = geoOrthographic().scale(scale).translate([W / 2, H / 2]).rotate([rot[0], rot[1], 0]).clipAngle(90);

  // Courbe du graphique (coordonnées écran de la scène 4, zoomée) → ligne de courant
  const chartPts = sample(forecast, 0, 48, N).map((p) => zoomPt(p, 1));
  const jetPts: Pt[] = new Array(N + 1).fill(0).map((_, i) => {
    const lon = LON0 + ((LON1 - LON0) * i) / N;
    return (projection([lon, jet(lon)]) as Pt) ?? [0, 0];
  });
  const morphPts: Pt[] = jetPts.map((p, i) => [lerp(chartPts[i][0], p[0], morphChart), lerp(chartPts[i][1], p[1], morphChart)]);

  const labels: MapLabel[] = [
    { text: "SCANDINAVIE", lon: 15.5, lat: 64.5, from: o + 95, dot: false, size: 26, dx: -90 },
    { text: "EUROPE CENTRALE", lon: 21, lat: 48.6, from: o + 115, dot: false, size: 22, dx: -60, dy: 34 },
    { text: "Alpes", lon: 11.5, lat: 46.9, from: o + 135, italic: true, size: 22, dx: 16, dy: 24, color: C.ice },
    { text: "SUISSE", lon: 8.2, lat: 46.8, from: o + 150, color: C.orange, size: 24, dx: -150, dy: 36, dot: false },
  ];

  const tagA = interpolate(frame, [o + 60, o + 80, o + 238, o + 252], [0, 1, 1, 0], clamp);
  const tagB = tween(frame, [o + 262, o + 285], [0, 1], easeOut);
  const lag = interpolate(frame, [o + 150, o + 170, o + 240, o + 255], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#06111f" }}>
      <AbsoluteFill style={{ opacity: mapIn }}>
        <AnimatedMap
          rotate={rot}
          scale={scale}
          swissFrom={o + 150}
          labels={labels}
          under={(p) => {
            const path = geoPath(p);
            const c = p([16, 52]);
            const w = p([-14, 60]);
            return (
              <g>
                <defs>
                  <radialGradient id="cold-air" gradientUnits="userSpaceOnUse" cx={c?.[0] ?? 0} cy={c?.[1] ?? 0} r={scale * 0.16}>
                    <stop offset={0} stopColor={C.ice} stopOpacity={0.55} />
                    <stop offset={1} stopColor={C.cyan} stopOpacity={0} />
                  </radialGradient>
                  <radialGradient id="mild-air" gradientUnits="userSpaceOnUse" cx={w?.[0] ?? 0} cy={w?.[1] ?? 0} r={scale * 0.14}>
                    <stop offset={0} stopColor={C.orange} stopOpacity={0.35} />
                    <stop offset={1} stopColor={C.orange} stopOpacity={0} />
                  </radialGradient>
                </defs>
                <path d={path({ type: "Sphere" }) ?? ""} fill="url(#cold-air)" opacity={cold} />
                <path d={path({ type: "Sphere" }) ?? ""} fill="url(#mild-air)" opacity={cold} />
              </g>
            );
          }}
          over={(p) => {
            const path = geoPath(p);
            const lines = [-3, 0, 3].map((dl) => {
              const coords: [number, number][] = [];
              for (let i = 0; i <= N; i++) {
                const lon = LON0 + ((LON1 - LON0) * i) / N;
                coords.push([lon, jet(lon) + dl]);
              }
              return path({ type: "LineString", coordinates: coords }) ?? "";
            });
            const arrowCoords: [number, number][] = [];
            for (let i = 0; i <= 30; i++) {
              const t = i / 30;
              arrowCoords.push([lerp(40, 14, t) + 4 * Math.sin(t * Math.PI), lerp(65, 50.4, t)]);
            }
            const arrowPath = path({ type: "LineString", coordinates: arrowCoords }) ?? "";
            const tipA = p(arrowCoords[29]);
            const tipB = p(arrowCoords[30]);
            const ang = tipA && tipB ? Math.atan2(tipB[1] - tipA[1], tipB[0] - tipA[0]) : 0;
            const morphing = morphChart < 1;
            return (
              <g>
                <defs>
                  <filter id="jet-glow" x="-10%" y="-30%" width="120%" height="160%">
                    <feGaussianBlur stdDeviation={9} />
                  </filter>
                </defs>
                {morphing ? (
                  <path d={smoothPath(morphPts)} fill="none" stroke={morphChart < 0.5 ? C.orange : C.cyan} strokeWidth={5} strokeLinecap="round" />
                ) : (
                  <g>
                    <path d={lines[1]} fill="none" stroke={C.cyan} strokeWidth={26} strokeOpacity={0.35} filter="url(#jet-glow)" />
                    {lines.map((d, i) => (
                      <path
                        key={i}
                        d={d}
                        fill="none"
                        stroke={i === 1 ? C.cyan : C.ice}
                        strokeWidth={i === 1 ? 3.5 : 1.5}
                        strokeOpacity={i === 1 ? 0.95 : 0.5}
                        strokeDasharray={i === 1 ? "60 18" : "20 16"}
                        strokeDashoffset={-frame * 4}
                        strokeLinecap="round"
                      />
                    ))}
                    <FlowParticles
                      count={260}
                      seed="jet"
                      trail={10}
                      width={2.4}
                      color={C.white}
                      getPos={(pp, t) => {
                        const span = LON1 - LON0;
                        const lon = LON0 + ((pp.r[0] * span + t * 0.22 * (0.8 + 0.5 * pp.r[1])) % span);
                        const xy = p([lon, jet(lon) + (pp.r[2] - 0.5) * 6]);
                        return xy as Pt | null;
                      }}
                    />
                  </g>
                )}
                {/* Descente d'air froid (scénario B) */}
                <g opacity={cold}>
                  <path
                    d={arrowPath}
                    fill="none"
                    stroke={C.ice}
                    strokeWidth={7}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - cold}
                  />
                  {tipB && cold > 0.95 && (
                    <path
                      d="M0,0 L-26,-14 L-20,0 L-26,14 Z"
                      fill={C.ice}
                      transform={`translate(${tipB[0]},${tipB[1]}) rotate(${(ang * 180) / Math.PI})`}
                    />
                  )}
                  {(() => {
                    const lp = p([31, 58.5]);
                    return (
                      lp && (
                        <text x={lp[0] + 20} y={lp[1]} fill={C.ice} fontFamily={FONT} fontSize={24} fontWeight={700} fontStyle="italic" style={{ paintOrder: "stroke", stroke: "#06111f", strokeWidth: 6 }}>
                          air froid
                        </text>
                      )
                    );
                  })()}
                </g>
              </g>
            );
          }}
        />
      </AbsoluteFill>

      {/* Scénarios */}
      <div style={{ position: "absolute", left: SAFE.x, top: SAFE.y + 6, fontFamily: FONT }}>
        <KineticTitle text="Et pour l’Europe ?" from={o + 5} to={o + 230} size={56} weight={700} style={{ textShadow: "0 2px 18px rgba(2,6,13,0.95), 0 0 6px rgba(2,6,13,0.9)" }} />
      </div>
      <ScenarioCard
        opacity={tagA}
        letter="A"
        title="Circulation relativement stable"
        body="Un courant-jet peu ondulant, d’ouest en est."
        color={C.cyan}
      />
      <ScenarioCard
        opacity={tagB}
        letter="B"
        title="Circulation plus ondulante"
        body="Elle peut favoriser certaines descentes d’air froid vers l’Europe."
        color={C.ice}
      />

      {/* Décalage temporel */}
      <div
        style={{
          position: "absolute",
          right: SAFE.x,
          bottom: 250,
          opacity: lag,
          fontFamily: FONT,
          textAlign: "right",
          padding: "18px 24px",
          borderRadius: 14,
          background: "rgba(7,20,38,0.8)",
          border: `1px solid ${C.cyan}44`,
          transform: `translateY(${(1 - lag) * 14}px)`,
        }}
      >
        <div style={{ fontSize: 18, letterSpacing: "0.22em", color: C.cyan, fontWeight: 700 }}>EFFETS ÉVENTUELS AU SOL</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: C.white, marginTop: 6 }}>plusieurs semaines</div>
        <div style={{ fontSize: 20, color: C.muted, marginTop: 4 }}>après la perturbation en altitude</div>
      </div>

      <Badge text="Illustrations pédagogiques · pas une prévision localisée" from={o + 40} to={o + 495} style={{ right: SAFE.x, top: SAFE.y + 14 }} />
      <SourceLabel text="Met Office · NOAA Climate.gov — délai et incertitude des effets en surface · Natural Earth" from={o + 60} to={o + 490} />
    </AbsoluteFill>
  );
};

const ScenarioCard: React.FC<{ opacity: number; letter: string; title: string; body: string; color: string }> = ({
  opacity,
  letter,
  title,
  body,
  color,
}) => {
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.x,
        top: 200,
        width: 500,
        padding: "22px 26px",
        borderRadius: 14,
        background: "rgba(7,20,38,0.78)",
        border: `1px solid ${color}55`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.35)`,
        fontFamily: FONT,
        opacity,
        transform: `translateX(${(1 - opacity) * -30}px)`,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.3em", color }}>{`SCÉNARIO ${letter}`}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: C.white, marginTop: 8, lineHeight: 1.15 }}>{title}</div>
      <div style={{ fontSize: 22, color: C.muted, marginTop: 10, lineHeight: 1.4 }}>{body}</div>
    </div>
  );
};
