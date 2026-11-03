import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, OVERLAP, SAFE, W } from "../theme";
import { clamp, easeInOut, easeOut, type Pt, tween } from "../anim";
import { CH, clim, DataChart, forecast, xOf, yOf } from "../components/DataChart";
import { Badge, SourceLabel } from "../components/SourceLabel";
import { Eyebrow, KineticTitle } from "../components/KineticTitle";

/** Zoom final sur l'écart entre les courbes (réutilisé par la scène 5) */
export const ZOOM = { s: 1.35, ox: xOf(41), oy: yOf(0.22), tx: 1060, ty: 500 };
export const zoomPt = (p: Pt, z: number): Pt => {
  const s = 1 + (ZOOM.s - 1) * z;
  return [ZOOM.ox + (p[0] - ZOOM.ox) * s + (ZOOM.tx - ZOOM.ox) * z, ZOOM.oy + (p[1] - ZOOM.oy) * s + (ZOOM.ty - ZOOM.oy) * z];
};

/** SCÈNE 4 — LES DONNÉES (41–54 s) */
export const Scene04_Data: React.FC = () => {
  const frame = useCurrentFrame();
  const o = OVERLAP;

  const grid = tween(frame, [o, o + 45], [0, 1], easeOut);
  const axis = tween(frame, [o + 10, o + 55], [0, 1], easeOut);
  const obsP = tween(frame, [o + 30, o + 125], [0, 1], easeInOut);
  const climP = tween(frame, [o + 130, o + 245], [0, 1], easeInOut);
  const fcP = tween(frame, [o + 262, o + 330], [0, 1], easeInOut);
  const envO = tween(frame, [o + 280, o + 330], [0, 1]);
  const bandO = tween(frame, [o + 300, o + 330], [0, 1]);
  const zeroPulse = frame > o + 300 ? 0.5 + 0.5 * Math.sin((frame - o - 300) * 0.25) : 0;
  const z = tween(frame, [o + 330, o + 380], [0, 1], easeInOut);
  const s = 1 + (ZOOM.s - 1) * z;
  const headerOut = interpolate(frame, [o + 325, o + 345], [1, 0], clamp);

  const gapIn = tween(frame, [o + 350, o + 372], [0, 1], easeOut);
  const climLbl = tween(frame, [o + 200, o + 225], [0, 1], easeOut);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #081a30 0%, ${C.night} 70%)` }}>
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g
          transform={`translate(${ZOOM.ox + (ZOOM.tx - ZOOM.ox) * z},${ZOOM.oy + (ZOOM.ty - ZOOM.oy) * z}) scale(${s}) translate(${-ZOOM.ox},${-ZOOM.oy})`}
        >
          <DataChart grid={grid} axis={axis} climP={climP} obsP={obsP} fcP={fcP} envO={envO} bandO={bandO} zeroPulse={zeroPulse} />

          {/* Annotation « se renforce » */}
          <g opacity={climLbl * headerOut} fontFamily={FONT}>
            <text x={xOf(78)} y={yOf(clim(78)) - 34} fill={C.cyan} fontSize={22} fontWeight={700} textAnchor="middle">
              Habituellement : renforcement ↗
            </text>
          </g>

          {/* Écart inhabituel */}
          <g opacity={gapIn} fontFamily={FONT}>
            <line x1={xOf(41)} x2={xOf(41)} y1={yOf(clim(41))} y2={yOf(forecast(41))} stroke={C.white} strokeWidth={2 / s} />
            {[clim(41), forecast(41)].map((v, i) => (
              <line key={i} x1={xOf(41) - 10} x2={xOf(41) + 10} y1={yOf(v)} y2={yOf(v)} stroke={C.white} strokeWidth={2 / s} />
            ))}
            <text x={xOf(41) + 20} y={(yOf(clim(41)) + yOf(forecast(41))) / 2 + 6} fill={C.white} fontSize={22 / s * 1.25} fontWeight={700}>
              Écart inhabituel
            </text>
            <text x={xOf(41) + 20} y={(yOf(clim(41)) + yOf(forecast(41))) / 2 + 32} fill={C.muted} fontSize={16 / s * 1.25}>
              pour la saison
            </text>
          </g>
        </g>
      </svg>

      {/* En-tête */}
      <div style={{ position: "absolute", left: SAFE.x, top: SAFE.y + 6, opacity: headerOut }}>
        <Eyebrow text="Les données" from={o + 5} />
        <div style={{ height: 14 }} />
        <KineticTitle text="Un calendrier inhabituel" from={o + 12} size={52} weight={700} tracking={0} />
      </div>
      <Badge text="Schéma qualitatif · valeurs non à l’échelle" from={o + 40} to={o + 395} style={{ right: SAFE.x, top: SAFE.y + 14 }} />

      {/* Légende */}
      <div
        style={{
          position: "absolute",
          left: CH.x0,
          top: 168,
          display: "flex",
          gap: 38,
          fontFamily: FONT,
          fontSize: 20,
          color: C.white,
          opacity: axis * headerOut,
        }}
      >
        {[
          { c: C.cyan, t: "Évolution saisonnière habituelle", dash: false },
          { c: C.white, t: "Tendance jusqu’au 3 nov.", dash: false },
          { c: C.orange, t: "Prévisions au 3 nov. 2026 (± dispersion des scénarios)", dash: false },
        ].map((l) => (
          <div key={l.t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 4, borderRadius: 2, background: l.c, boxShadow: `0 0 10px ${l.c}` }} />
            {l.t}
          </div>
        ))}
      </div>

      <SourceLabel
        text="Tendances d’après les ensembles ECMWF relayés par Severe Weather Europe, The Watchers, Fox Weather · climatologie : NOAA / Met Office"
        from={o + 40}
        to={o + 395}
      />
    </AbsoluteFill>
  );
};
