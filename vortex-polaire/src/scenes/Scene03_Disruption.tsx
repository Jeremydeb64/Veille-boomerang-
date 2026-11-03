import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, OVERLAP, SAFE, W } from "../theme";
import { clamp, easeInOut, easeOut, lerp, type Pt, smoothPath, tween } from "../anim";
import { PolarVortex, STABLE, type VortexShape } from "../components/PolarVortex";
import { Eyebrow, KineticTitle } from "../components/KineticTitle";
import { SourceLabel } from "../components/SourceLabel";
import { Starfield } from "../components/Backdrop";
import { ArcticMap, POLAR, useGlobalAngle } from "./shared";

const PANEL_Y = 500;
const PANEL_R = 175;
const PANELS = [440, 960, 1480];

/** SCÈNE 3 — LA PERTURBATION (26–41 s) */
export const Scene03_Disruption: React.FC<{ seqFrom: number }> = ({ seqFrom }) => {
  const frame = useCurrentFrame();
  const o = OVERLAP;
  const angleAt = useGlobalAngle(seqFrom);

  // Déformation progressive
  const d = tween(frame, [o + 50, o + 260], [0, 1], easeInOut);
  const wob = Math.sin(frame * 0.045);
  const shape: VortexShape = {
    w1: 0.2 * d,
    p1: 0.9 + 0.25 * wob * d,
    w2: 0.32 * d + 0.04 * wob * d,
    p2: 0.5 + 0.15 * Math.sin(frame * 0.03) * d,
    split: 0,
  };

  // Transition caméra vers les trois états
  const cam = tween(frame, [o + 330, o + 385], [0, 1], easeInOut);
  const cx = lerp(POLAR.cx, PANELS[1], cam);
  const cy = lerp(POLAR.cy, PANEL_Y, cam);
  const R = lerp(POLAR.R, PANEL_R, cam);
  const side = tween(frame, [o + 360, o + 400], [0, 1], easeOut);
  const splitP = tween(frame, [o + 380, o + 425], [0, 0.92], easeInOut);
  const shape3: VortexShape = { w1: 0.05, p1: 0.9, w2: 0.5, p2: 0.5, split: splitP };

  // Ondes atmosphériques venant des latitudes tempérées
  const waves = [0, 1, 2, 3, 4].map((j) => {
    const s = o + 40 + j * 48;
    const p = interpolate(frame, [s, s + 110], [0, 1], clamp);
    if (p <= 0 || p >= 1) return null;
    const rr = POLAR.R * lerp(1.95, 1.02, p);
    const pts: Pt[] = [];
    for (let i = 0; i <= 120; i++) {
      const th = (i / 120) * Math.PI * 2;
      const r = rr * (1 + 0.07 * Math.cos(2 * th + j + frame * 0.02) + 0.04 * Math.cos(3 * th - j));
      pts.push([POLAR.cx + r * Math.cos(th), POLAR.cy + r * Math.sin(th)]);
    }
    return { d: smoothPath(pts) + "Z", op: Math.sin(p * Math.PI) * (1 - cam) };
  });

  const titleOut = o + 322;
  const speedBar = tween(frame, [o + 205, o + 315], [1, 0.08], easeInOut);
  const barIn = interpolate(frame, [o + 195, o + 215, titleOut, titleOut + 12], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Starfield drift={0.03} opacity={0.6} />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={7} />
          </filter>
        </defs>
        <ArcticMap cx={cx} cy={cy} R={R} opacity={1 - cam * 0.75} rings={cam < 0.1} />
        {waves.map(
          (w, i) =>
            w && (
              <g key={i} opacity={w.op}>
                <path d={w.d} fill="none" stroke={C.orange} strokeWidth={10} strokeOpacity={0.35} filter="url(#wave-glow)" />
                <path d={w.d} fill="none" stroke={C.orange} strokeWidth={2.2} strokeDasharray="3 9" strokeLinecap="round" />
              </g>
            ),
        )}
        <PolarVortex
          id="pv3"
          cx={cx}
          cy={cy}
          R={R}
          shape={shape}
          angleAt={angleAt}
          particles={560}
          seed="pvA"
          alert={0.85 * d}
        />

        {/* Trois états schématiques */}
        <g opacity={side}>
          <PolarVortex id="pv3a" cx={PANELS[0]} cy={PANEL_Y} R={PANEL_R} shape={STABLE} angleAt={angleAt} particles={200} seed="pvB" />
          <PolarVortex
            id="pv3c"
            cx={PANELS[2]}
            cy={PANEL_Y}
            R={PANEL_R}
            shape={shape3}
            angleAt={angleAt}
            particles={200}
            seed="pvC"
            alert={1}
          />
        </g>
        <g fontFamily={FONT} opacity={cam}>
          {["STABLE", "DÉFORMÉ", "FORTEMENT PERTURBÉ"].map((t, i) => (
            <g key={t} opacity={i === 1 ? 1 : side}>
              <text x={PANELS[i]} y={PANEL_Y + PANEL_R + 92} fill={i === 0 ? C.cyan : C.orange} fontSize={20} fontWeight={700} textAnchor="middle" letterSpacing="0.3em">
                {`0${i + 1}`}
              </text>
              <text x={PANELS[i]} y={PANEL_Y + PANEL_R + 128} fill={C.white} fontSize={30} fontWeight={700} textAnchor="middle" letterSpacing="0.1em">
                {t}
              </text>
            </g>
          ))}
          <text
            x={PANELS[2]}
            y={PANEL_Y + PANEL_R + 166}
            fill={C.muted}
            fontSize={20}
            textAnchor="middle"
            fontStyle="italic"
            opacity={tween(frame, [o + 400, o + 420], [0, 1])}
          >
            Division en deux : une possibilité, pas une certitude
          </text>
        </g>
      </svg>

      {/* Titres */}
      <div style={{ position: "absolute", left: SAFE.x, top: 170 }}>
        <Eyebrow text="Début novembre 2026" from={o + 25} to={titleOut} color={C.orange} />
        <div style={{ height: 22 }} />
        <KineticTitle text="PERTURBATION" from={o + 95} to={titleOut} size={76} />
        <KineticTitle text="PRÉCOCE" from={o + 108} to={titleOut} size={76} color={C.orange} glow />
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT,
            fontSize: 24,
            color: C.muted,
            maxWidth: 470,
            lineHeight: 1.4,
            opacity: interpolate(frame, [o + 70, o + 95, titleOut, titleOut + 12], [0, 1, 1, 0], clamp),
          }}
        >
          Des ondes atmosphériques remontent des latitudes tempérées et déforment le vortex.
        </div>
        {/* Jauge qualitative de vitesse des vents */}
        <div style={{ marginTop: 40, opacity: barIn, fontFamily: FONT }}>
          <div style={{ fontSize: 18, letterSpacing: "0.22em", color: C.cyan, fontWeight: 700 }}>VENTS STRATOSPHÉRIQUES</div>
          <div style={{ marginTop: 12, width: 440, height: 10, borderRadius: 5, background: "rgba(245,248,252,0.12)", overflow: "hidden" }}>
            <div
              style={{
                width: `${speedBar * 100}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${C.orange}, ${C.cyan})`,
                boxShadow: `0 0 16px ${C.cyan}`,
              }}
            />
          </div>
          <div style={{ marginTop: 10, fontSize: 20, color: C.white }}>
            {speedBar > 0.5 ? "Ralentissement prévu…" : "…jusqu’à une inversion possible"}
          </div>
        </div>
      </div>

      <SourceLabel
        text="Prévisions d’ensemble ECMWF relayées par Severe Weather Europe, The Watchers, Fox Weather (26 oct.–2 nov. 2026)"
        from={o + 30}
        to={o + 445}
      />
    </AbsoluteFill>
  );
};

