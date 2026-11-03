import React, { useMemo } from "react";
import { geoCircle, geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoProjection } from "d3-geo";
import { C, H, W } from "../theme";
import { LAND_110, LAND_50 } from "../geo";

export type GlobeOverlay = (
  projection: GeoProjection,
  isVisible: (lon: number, lat: number) => boolean,
) => React.ReactNode;

type Props = {
  id: string;
  cx: number;
  cy: number;
  radius: number;
  /** Rotation d3 [λ, φ, γ] : le centre de la vue est [-λ, -φ] */
  rotate: [number, number, number?];
  detail?: "110" | "50";
  graticuleOpacity?: number;
  atmosphere?: number;
  overlay?: GlobeOverlay;
  opacity?: number;
};

const GRATICULE = geoGraticule10();
const ICE_CAP = geoCircle().center([0, 90]).radius(11)();

/**
 * Globe vectoriel semi-réaliste (projection orthographique d3-geo, Natural Earth).
 * Éclairage, atmosphère et calotte de glace sont simulés par des dégradés SVG.
 */
export const AnimatedGlobe: React.FC<Props> = ({
  id,
  cx,
  cy,
  radius,
  rotate,
  detail = "110",
  graticuleOpacity = 0.09,
  atmosphere = 1,
  overlay,
  opacity = 1,
}) => {
  const rot: [number, number, number] = [rotate[0], rotate[1], rotate[2] ?? 0];
  const projection = useMemo(
    () => geoOrthographic().scale(radius).translate([cx, cy]).rotate(rot).clipAngle(90).precision(0.4),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [radius, cx, cy, rot[0], rot[1], rot[2]],
  );
  const path = geoPath(projection);
  const center: [number, number] = [-rot[0], -rot[1]];
  const isVisible = (lon: number, lat: number) => geoDistance([lon, lat], center) < Math.PI / 2 - 0.02;
  const land = detail === "50" ? LAND_50 : LAND_110;
  const lx = cx - radius * 0.42;
  const ly = cy - radius * 0.48;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, opacity }}>
      <defs>
        <radialGradient id={`${id}-atmo`} cx={cx} cy={cy} r={radius * 1.22} gradientUnits="userSpaceOnUse">
          <stop offset={0.8} stopColor={C.cyan} stopOpacity={0.5 * atmosphere} />
          <stop offset={0.86} stopColor={C.cyan} stopOpacity={0.18 * atmosphere} />
          <stop offset={1} stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-ocean`} cx={lx} cy={ly} r={radius * 1.7} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#2373b0" />
          <stop offset={0.35} stopColor={C.deep} />
          <stop offset={0.8} stopColor="#0a2240" />
          <stop offset={1} stopColor={C.night} />
        </radialGradient>
        <linearGradient id={`${id}-land`} x1={cx - radius} y1={cy - radius} x2={cx + radius} y2={cy + radius} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#3f8fa8" />
          <stop offset={0.5} stopColor="#24607e" />
          <stop offset={1} stopColor="#163e5c" />
        </linearGradient>
        <radialGradient id={`${id}-shade`} cx={lx} cy={ly} r={radius * 1.75} gradientUnits="userSpaceOnUse">
          <stop offset={0.45} stopColor={C.night} stopOpacity={0} />
          <stop offset={0.8} stopColor={C.night} stopOpacity={0.55} />
          <stop offset={1} stopColor="#02060d" stopOpacity={0.88} />
        </radialGradient>
        <radialGradient id={`${id}-spec`} cx={lx} cy={ly} r={radius * 0.7} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={C.white} stopOpacity={0.16} />
          <stop offset={1} stopColor={C.white} stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx={cx} cy={cy} r={radius} />
        </clipPath>
        <filter id={`${id}-rim`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={Math.max(2, radius * 0.012)} />
        </filter>
      </defs>

      {atmosphere > 0 && <circle cx={cx} cy={cy} r={radius * 1.22} fill={`url(#${id}-atmo)`} />}
      <circle cx={cx} cy={cy} r={radius} fill={`url(#${id}-ocean)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <path d={path(GRATICULE) ?? ""} fill="none" stroke={C.cyan} strokeOpacity={graticuleOpacity} strokeWidth={0.8} />
        <path d={path(land) ?? ""} fill={`url(#${id}-land)`} stroke={C.ice} strokeOpacity={0.35} strokeWidth={0.7} />
        <path d={path(ICE_CAP) ?? ""} fill={C.ice} fillOpacity={0.16} />
        <circle cx={cx} cy={cy} r={radius} fill={`url(#${id}-spec)`} />
        <circle cx={cx} cy={cy} r={radius} fill={`url(#${id}-shade)`} />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={C.cyan}
        strokeOpacity={0.55 * atmosphere}
        strokeWidth={Math.max(1.5, radius * 0.006)}
        filter={`url(#${id}-rim)`}
      />
      {overlay?.(projection, isVisible)}
    </svg>
  );
};
