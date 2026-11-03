import React from "react";
import { geoGraticule10, geoOrthographic, geoPath, type GeoProjection } from "d3-geo";
import { useCurrentFrame } from "remotion";
import { C, FONT, H, W } from "../theme";
import { BORDERS_50, LAND_50, SWITZERLAND } from "../geo";
import { tween, easeOut } from "../anim";

export type MapLabel = {
  text: string;
  lon: number;
  lat: number;
  from: number;
  /** décalage du texte par rapport au point (px) */
  dx?: number;
  dy?: number;
  color?: string;
  size?: number;
  dot?: boolean;
  italic?: boolean;
};

type Props = {
  rotate: [number, number];
  scale: number;
  cx?: number;
  cy?: number;
  swissFrom: number;
  labels: MapLabel[];
  under?: (p: GeoProjection) => React.ReactNode;
  over?: (p: GeoProjection) => React.ReactNode;
};

const GRAT = geoGraticule10();

/** Cartographie vectorielle Natural Earth 1:50m, projection orthographique zoomable. */
export const AnimatedMap: React.FC<Props> = ({ rotate, scale, cx = W / 2, cy = H / 2, swissFrom, labels, under, over }) => {
  const frame = useCurrentFrame();
  const projection = geoOrthographic().scale(scale).translate([cx, cy]).rotate([rotate[0], rotate[1], 0]).clipAngle(90).precision(0.3);
  const path = geoPath(projection);
  const sw = tween(frame, [swissFrom, swissFrom + 30], [0, 1], easeOut);
  const swissPulse = 0.5 + 0.5 * Math.sin(frame * 0.12);

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="map-land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b4a72" />
          <stop offset="1" stopColor="#0f2f52" />
        </linearGradient>
        <filter id="map-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={8} />
        </filter>
      </defs>
      <path d={path({ type: "Sphere" }) ?? ""} fill="#06111f" />
      <path d={path(GRAT) ?? ""} fill="none" stroke={C.cyan} strokeOpacity={0.07} strokeWidth={1} />
      {under?.(projection)}
      <path d={path(LAND_50) ?? ""} fill="url(#map-land)" stroke={C.cyan} strokeOpacity={0.45} strokeWidth={1.1} />
      <path d={path(BORDERS_50) ?? ""} fill="none" stroke={C.white} strokeOpacity={0.16} strokeWidth={0.8} />
      {/* Suisse */}
      <g opacity={sw}>
        <path d={path(SWITZERLAND) ?? ""} fill={C.orange} opacity={0.35 + 0.25 * swissPulse} filter="url(#map-glow)" />
        <path d={path(SWITZERLAND) ?? ""} fill={C.orange} fillOpacity={0.55} stroke={C.orange} strokeWidth={2} />
      </g>
      {over?.(projection)}
      {/* Étiquettes */}
      {labels.map((l) => {
        const p = tween(frame, [l.from, l.from + 20], [0, 1], easeOut);
        if (p <= 0) return null;
        const xy = projection([l.lon, l.lat]);
        if (!xy) return null;
        const color = l.color ?? C.white;
        return (
          <g key={l.text} opacity={p} fontFamily={FONT}>
            {l.dot !== false && (
              <>
                <circle cx={xy[0]} cy={xy[1]} r={14 * p} fill={color} opacity={0.15} />
                <circle cx={xy[0]} cy={xy[1]} r={5} fill={color} />
              </>
            )}
            <text
              x={xy[0] + (l.dx ?? 18)}
              y={xy[1] + (l.dy ?? 7) + (1 - p) * 10}
              fill={color}
              fontSize={l.size ?? 24}
              fontWeight={l.italic ? 500 : 700}
              fontStyle={l.italic ? "italic" : undefined}
              letterSpacing={l.italic ? "0.05em" : "0.16em"}
              style={{ paintOrder: "stroke", stroke: "#06111f", strokeWidth: 6, strokeOpacity: 0.7 }}
            >
              {l.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
