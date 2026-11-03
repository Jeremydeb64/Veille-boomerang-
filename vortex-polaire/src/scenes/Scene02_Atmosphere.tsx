import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, OVERLAP, SAFE, W } from "../theme";
import { clamp, easeInOut, easeOut, tween } from "../anim";
import { FlowParticles } from "../components/FlowParticles";
import { PolarVortex, STABLE } from "../components/PolarVortex";
import { Eyebrow, KineticTitle } from "../components/KineticTitle";
import { SourceLabel } from "../components/SourceLabel";
import { Starfield } from "../components/Backdrop";
import { ArcticMap, Callout, POLAR, useGlobalAngle } from "./shared";

/* ---------- Géométrie de la coupe verticale (monde 1920 × 2200) ---------- */
const WORLD_H = 2200;
const GROUND = 2050;
const PX_KM = 34;
const kmY = (km: number) => GROUND - km * PX_KM;
const latX = (lat: number) => 230 + ((lat - 30) / 60) * 1560;

const mountains = (() => {
  // silhouette alpine générique, déterministe
  let d = `M0,${GROUND + 40}`;
  for (let x = 0; x <= W; x += 24) {
    const h =
      38 * Math.max(0, Math.sin(x / 70)) +
      26 * Math.abs(Math.sin(x / 33 + 1.3)) +
      80 * Math.exp(-(((x - 560) / 160) ** 2)) +
      40 * Math.exp(-(((x - 1300) / 220) ** 2));
    d += `L${x},${GROUND + 6 - h}`;
  }
  return d + `L${W},${GROUND + 200}L0,${GROUND + 200}Z`;
})();

/** SCÈNE 2 — COMPRENDRE LE PHÉNOMÈNE (11–26 s) */
export const Scene02_Atmosphere: React.FC<{ seqFrom: number }> = ({ seqFrom }) => {
  const frame = useCurrentFrame();
  const o = OVERLAP;
  const angleAt = useGlobalAngle(seqFrom);

  // Caméra : montée de la surface vers la stratosphère
  const cam = tween(frame, [o + 10, o + 200], [0, 1], easeInOut);
  const camY = interpolate(cam, [0, 1], [-1290, -330]);
  // Bascule vers la vue du dessus
  const tilt = tween(frame, [o + 245, o + 300], [0, 1], easeInOut);
  const top = tween(frame, [o + 255, o + 310], [0, 1], easeOut);

  const ruler = tween(frame, [o + 10, o + 150], [0, 1]);
  const core = tween(frame, [o + 120, o + 200], [0, 1], easeOut);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08);

  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <Starfield drift={0.03} opacity={0.6} />

      {/* ====================== COUPE ATMOSPHÉRIQUE ====================== */}
      <AbsoluteFill
        style={{
          perspective: 1800,
          opacity: 1 - tilt,
        }}
      >
        <AbsoluteFill
          style={{
            transform: `rotateX(${tilt * 68}deg) scale(${1 - tilt * 0.25}) translateY(${-tilt * 160}px)`,
            transformOrigin: "50% 40%",
          }}
        >
          <svg width={W} height={WORLD_H} style={{ position: "absolute", left: 0, top: camY }}>
            <defs>
              <linearGradient id="tropo" x1="0" y1={kmY(12)} x2="0" y2={GROUND} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor={C.deep} stopOpacity={0.35} />
                <stop offset="1" stopColor="#2a6fa8" stopOpacity={0.75} />
              </linearGradient>
              <linearGradient id="strato" x1="0" y1={kmY(55)} x2="0" y2={kmY(10)} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor={C.night} stopOpacity={0} />
                <stop offset="0.5" stopColor={C.deep} stopOpacity={0.35} />
                <stop offset="1" stopColor={C.deep} stopOpacity={0.5} />
              </linearGradient>
              <radialGradient id="core" cx={latX(63)} cy={kmY(32)} r={480} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor={C.ice} stopOpacity={0.55} />
                <stop offset="0.4" stopColor={C.cyan} stopOpacity={0.28} />
                <stop offset="1" stopColor={C.cyan} stopOpacity={0} />
              </radialGradient>
              <linearGradient id="ground" x1="0" y1={GROUND - 80} x2="0" y2={GROUND + 200} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#1f5b80" />
                <stop offset="1" stopColor="#06111f" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation={18} />
              </filter>
            </defs>

            {/* Couches */}
            <rect x={0} y={kmY(55)} width={W} height={kmY(10) - kmY(55)} fill="url(#strato)" />
            <rect x={0} y={kmY(10)} width={W} height={GROUND - kmY(10)} fill="url(#tropo)" />

            {/* Nuages troposphériques (parallaxe propre) */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const x = ((i * 337 + frame * (0.6 + (i % 3) * 0.3)) % (W + 600)) - 300;
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={kmY(2.5 + (i % 4) * 1.6)}
                  rx={180 + (i % 3) * 60}
                  ry={26 + (i % 2) * 14}
                  fill={C.white}
                  opacity={0.12}
                  filter="url(#soft)"
                />
              );
            })}

            {/* Tropopause / stratopause */}
            <line x1={0} x2={W} y1={kmY(10)} y2={kmY(10)} stroke={C.white} strokeOpacity={0.35} strokeDasharray="6 10" />
            <text x={W - 120} y={kmY(10) - 14} fill={C.muted} fontSize={18} textAnchor="end" letterSpacing="0.18em" fontFamily={FONT}>
              TROPOPAUSE
            </text>
            <line x1={0} x2={W} y1={kmY(50)} y2={kmY(50)} stroke={C.white} strokeOpacity={0.25} strokeDasharray="6 10" />
            <text x={W - 120} y={kmY(50) - 14} fill={C.muted} fontSize={18} textAnchor="end" letterSpacing="0.18em" fontFamily={FONT}>
              STRATOPAUSE
            </text>

            {/* Courant-jet troposphérique */}
            <g opacity={tween(frame, [o + 90, o + 130], [0, 1])}>
              {[1, 0.7, 0.4].map((s) => (
                <ellipse key={s} cx={latX(45)} cy={kmY(10.5)} rx={130 * s} ry={70 * s} fill="none" stroke={C.cyan} strokeOpacity={0.5} />
              ))}
            </g>

            {/* Vortex polaire : isotaches du jet de nuit polaire */}
            <g opacity={core}>
              <ellipse cx={latX(63)} cy={kmY(32)} rx={430} ry={520} fill="url(#core)" opacity={0.7 + 0.3 * pulse} />
              {[1, 0.82, 0.64, 0.46, 0.28].map((s, i) => (
                <ellipse
                  key={s}
                  cx={latX(63)}
                  cy={kmY(32)}
                  rx={330 * s * (0.9 + 0.1 * core)}
                  ry={440 * s * (0.9 + 0.1 * core)}
                  fill="none"
                  stroke={i < 2 ? C.cyan : C.ice}
                  strokeWidth={1.6}
                  strokeOpacity={0.4 + i * 0.12}
                  strokeDasharray="22 12"
                  strokeDashoffset={-frame * (1 + i * 0.4)}
                />
              ))}
              {/* ⊗ : vent d'ouest entrant dans le plan */}
              {[
                [63, 32],
                [58, 26],
                [68, 38],
                [60, 40],
                [67, 24],
              ].map(([la, km], i) => (
                <g key={i} transform={`translate(${latX(la)},${kmY(km)})`} opacity={0.85}>
                  <circle r={15} fill={C.night} fillOpacity={0.4} stroke={C.white} strokeWidth={2} />
                  <path d="M-8,-8L8,8M8,-8L-8,8" stroke={C.white} strokeWidth={2} />
                </g>
              ))}
            </g>

            {/* Particules : brassage stratosphérique */}
            <FlowParticles
              count={260}
              seed="strat"
              trail={14}
              width={1.6}
              color={C.ice}
              opacity={0.55}
              getPos={(p, t) => [((p.r[0] * 2400 + t * (0.8 + p.r[1] * 1.4)) % 2400) - 240, kmY(13 + p.r[2] * 38) + Math.sin(t * 0.02 + p.r[3] * 6) * 10]}
            />

            {/* Sol courbe + montagnes */}
            <path d={mountains} fill="url(#ground)" />
            <path d={`M0,${GROUND + 30} Q${W / 2},${GROUND - 40} ${W},${GROUND + 30}`} fill="none" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} />
            {[40, 60, 90].map((la) => (
              <text key={la} x={latX(la)} y={GROUND + 110} fill={C.muted} fontSize={22} textAnchor="middle" fontFamily={FONT} letterSpacing="0.15em">
                {la === 90 ? "PÔLE NORD" : `${la}°N`}
              </text>
            ))}

            {/* Graduation d'altitude */}
            <g fontFamily={FONT}>
              <line x1={150} x2={150} y1={GROUND} y2={GROUND - (GROUND - kmY(55)) * ruler} stroke={C.white} strokeOpacity={0.6} strokeWidth={2} />
              {new Array(12).fill(0).map((_, i) => {
                const km = i * 5;
                const vis = interpolate(ruler, [i / 12, i / 12 + 0.06], [0, 1], clamp);
                const major = km % 10 === 0;
                return (
                  <g key={km} opacity={vis}>
                    <line x1={150} x2={major ? 176 : 164} y1={kmY(km)} y2={kmY(km)} stroke={C.white} strokeOpacity={0.7} strokeWidth={2} />
                    {major && (
                      <text x={136} y={kmY(km) + 8} fill={C.white} fontSize={24} fontWeight={600} textAnchor="end">
                        {km} km
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Étiquettes dynamiques */}
            <Callout x={latX(36)} y={GROUND - 20} tx={latX(36) + 80} ty={GROUND - 150} from={o + 20} title="SURFACE" sub="là où se joue notre météo" />
            <Callout x={latX(52)} y={kmY(5)} tx={latX(52) + 120} ty={kmY(7.5)} from={o + 45} title="TROPOSPHÈRE" sub="0 à ~10–15 km" />
            <Callout x={latX(45)} y={kmY(10.5)} tx={latX(38)} ty={kmY(16)} from={o + 110} title="COURANT-JET" color={C.cyan} anchor="end" />
            <Callout x={latX(38)} y={kmY(30)} tx={latX(38) + 60} ty={kmY(36)} from={o + 120} title="STRATOSPHÈRE" sub="~10–15 à 50 km" />
            <Callout
              x={latX(63) + 330}
              y={kmY(32)}
              tx={latX(63) + 380}
              ty={kmY(44)}
              from={o + 170}
              title="VORTEX POLAIRE"
              sub="vents d’ouest puissants autour de l’Arctique"
              color={C.ice}
              anchor="end"
            />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Légende du symbole ⊗ (fixe à l'écran) */}
      <div
        style={{
          position: "absolute",
          right: SAFE.x,
          top: SAFE.y + 10,
          fontFamily: FONT,
          fontSize: 19,
          color: C.muted,
          opacity: core * (1 - tilt),
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <svg width={30} height={30}>
          <circle cx={15} cy={15} r={12} fill="none" stroke={C.white} strokeWidth={2} />
          <path d="M8,8L22,22M22,8L8,22" stroke={C.white} strokeWidth={2} />
        </svg>
        Vent d’ouest, perpendiculaire à la coupe
      </div>

      {/* ====================== VUE DU DESSUS ====================== */}
      <AbsoluteFill style={{ perspective: 1800, opacity: top }}>
        <AbsoluteFill
          style={{
            transform: `rotateX(${(1 - top) * 50}deg) scale(${0.8 + 0.2 * top})`,
            transformOrigin: `${POLAR.cx}px ${POLAR.cy}px`,
          }}
        >
          <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
            <ArcticMap cx={POLAR.cx} cy={POLAR.cy} R={POLAR.R} />
            <PolarVortex id="pv2" cx={POLAR.cx} cy={POLAR.cy} R={POLAR.R} shape={STABLE} angleAt={angleAt} particles={560} seed="pvA" />
            <text x={POLAR.cx} y={POLAR.cy + 8} fill={C.white} fontSize={18} fontWeight={700} letterSpacing="0.2em" textAnchor="middle" fontFamily={FONT} opacity={0.85}>
              PÔLE NORD
            </text>
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: SAFE.x, top: 210 }}>
        <Eyebrow text="Vue du dessus" from={o + 285} />
        <div style={{ height: 18 }} />
        <KineticTitle text="Une spirale" from={o + 292} size={64} weight={700} />
        <KineticTitle text="de vents d’ouest" from={o + 300} size={64} weight={700} color={C.cyan} />
        <div
          style={{
            marginTop: 26,
            maxWidth: 520,
            fontFamily: FONT,
            fontSize: 26,
            lineHeight: 1.45,
            color: C.muted,
            opacity: tween(frame, [o + 320, o + 345], [0, 1], easeOut),
          }}
        >
          Elle se renforce normalement à l’automne et piège l’air froid au-dessus de l’Arctique.
        </div>
      </div>

      <SourceLabel text="NOAA Climate.gov · Met Office — structure de l’atmosphère et du vortex polaire" from={o + 150} to={o + 440} />
    </AbsoluteFill>
  );
};
