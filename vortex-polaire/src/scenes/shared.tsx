import React from "react";
import { geoAzimuthalEquidistant, geoCircle, geoPath } from "d3-geo";
import { useCurrentFrame } from "remotion";
import { C, FONT, TOTAL_FRAMES, sec } from "../theme";
import { LAND_110 } from "../geo";
import { useIntegratedAngle } from "../components/PolarVortex";
import { tween, easeOut } from "../anim";

/**
 * Vitesse de rotation globale du vortex (rad/frame), en temps ABSOLU.
 * Partagée entre les scènes pour que les particules ne « sautent » pas
 * lors des fondus enchaînés.
 */
const speedAt = (f: number) => {
  const a = sec(28);
  const b = sec(36);
  const c = sec(70);
  if (f < a) return 0.01;
  if (f < b) return 0.01 + ((f - a) / (b - a)) * (0.0028 - 0.01);
  if (f < c) return 0.0028;
  const t = Math.min(1, (f - c) / (TOTAL_FRAMES - c));
  return 0.009 - 0.0065 * t;
};

/** angle(t local) pour une séquence démarrant à `seqFrom` (frame absolue) */
export const useGlobalAngle = (seqFrom: number) => {
  const abs = useIntegratedAngle(speedAt, TOTAL_FRAMES + 700);
  return (t: number) => abs(t + seqFrom);
};

/* Vue polaire : géographie arctique sous le vortex */
export const POLAR = { cx: 1150, cy: 560, R: 380 };

export const ArcticMap: React.FC<{ cx: number; cy: number; R: number; opacity?: number; rings?: boolean }> = ({
  cx,
  cy,
  R,
  opacity = 1,
  rings = true,
}) => {
  // R ≈ 55°N (35° du pôle)
  const proj = geoAzimuthalEquidistant()
    .rotate([-10, -90, 0])
    .scale(R / ((35 * Math.PI) / 180))
    .translate([cx, cy])
    .clipAngle(52);
  const path = geoPath(proj);
  const r60 = proj([0, 60]);
  const lat60 = geoCircle().center([0, 90]).radius(30)();
  const lat75 = geoCircle().center([0, 90]).radius(15)();
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={`arc-fade-${cx}`} cx={cx} cy={cy} r={R * 1.5} gradientUnits="userSpaceOnUse">
          <stop offset={0.7} stopColor={C.night} stopOpacity={0} />
          <stop offset={1} stopColor={C.night} stopOpacity={1} />
        </radialGradient>
      </defs>
      <path d={path({ type: "Sphere" }) ?? ""} fill="#081a30" />
      <path d={path(LAND_110) ?? ""} fill="#173f63" stroke={C.cyan} strokeOpacity={0.3} strokeWidth={1} />
      {rings && (
        <>
          <path d={path(lat60) ?? ""} fill="none" stroke={C.white} strokeOpacity={0.18} strokeDasharray="4 8" />
          <path d={path(lat75) ?? ""} fill="none" stroke={C.white} strokeOpacity={0.12} strokeDasharray="4 8" />
          {r60 && (
            <text x={cx + 8} y={cy + (r60[1] - cy) + 26} fill={C.muted} fontSize={17} fontFamily={FONT}>
              60°N
            </text>
          )}
        </>
      )}
      <circle cx={cx} cy={cy} r={R * 1.5} fill={`url(#arc-fade-${cx})`} />
    </g>
  );
};

/** Étiquette avec filet de rappel animé */
export const Callout: React.FC<{
  x: number;
  y: number;
  tx: number;
  ty: number;
  from: number;
  to?: number;
  title: string;
  sub?: string;
  color?: string;
  anchor?: "start" | "end";
}> = ({ x, y, tx, ty, from, to = 1e9, title, sub, color = C.cyan, anchor = "start" }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [from, from + 22], [0, 1], easeOut);
  const out = tween(frame, [to, to + 12], [0, 1]);
  if (p <= 0 || out >= 1) return null;
  const lx = x + (tx - x) * p;
  const ly = y + (ty - y) * p;
  return (
    <g opacity={1 - out} fontFamily={FONT}>
      <circle cx={x} cy={y} r={6} fill={color} />
      <circle cx={x} cy={y} r={16 * p} fill="none" stroke={color} strokeOpacity={0.5} />
      <line x1={x} y1={y} x2={lx} y2={ly} stroke={color} strokeWidth={1.5} strokeOpacity={0.8} />
      <text
        x={tx + (anchor === "start" ? 12 : -12)}
        y={ty + 8}
        fill={C.white}
        fontSize={26}
        fontWeight={700}
        letterSpacing="0.14em"
        textAnchor={anchor}
        opacity={p}
      >
        {title}
      </text>
      {sub && (
        <text x={tx + (anchor === "start" ? 12 : -12)} y={ty + 38} fill={C.muted} fontSize={19} textAnchor={anchor} opacity={p}>
          {sub}
        </text>
      )}
    </g>
  );
};
