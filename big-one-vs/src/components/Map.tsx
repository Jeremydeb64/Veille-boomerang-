import React from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import countriesRaw from "world-atlas/countries-50m.json";
import { useCurrentFrame } from "remotion";
import { appear, easeInOut } from "../lib";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { Ripples } from "./ui";

// Frontières Natural Earth (domaine public) via le paquet npm world-atlas.
/* eslint-disable @typescript-eslint/no-explicit-any */
const topo = countriesRaw as unknown as Topology;
const COUNTRIES = feature(topo, topo.objects.countries as any) as unknown as FeatureCollection;
const SWITZERLAND = COUNTRIES.features.find(
  (f) => (f.properties as { name?: string } | null)?.name === "Switzerland",
) as Feature;
const NEIGHBOURS = COUNTRIES.features.filter((f) =>
  ["France", "Italy", "Germany", "Austria", "Liechtenstein"].includes((f.properties as { name?: string }).name ?? ""),
);

type LL = [number, number];

/** Tracé approximatif du Rhône, du glacier au Léman (lon, lat) */
export const RHONE: LL[] = [
  [8.38, 46.57], [8.33, 46.52], [8.24, 46.47], [8.13, 46.4], [8.06, 46.35], [7.99, 46.316],
  [7.88, 46.295], [7.76, 46.305], [7.64, 46.3], [7.535, 46.29], [7.44, 46.255], [7.36, 46.228],
  [7.27, 46.2], [7.2, 46.165], [7.12, 46.12], [7.07, 46.1], [7.03, 46.17], [7.0, 46.215],
  [6.95, 46.26], [6.9, 46.33], [6.86, 46.39],
];

export const PLACES: Record<string, LL> = {
  Sion: [7.36, 46.233],
  Sierre: [7.535, 46.293],
  Martigny: [7.072, 46.1],
  Monthey: [6.955, 46.254],
  Viège: [7.882, 46.294],
  Brigue: [7.988, 46.316],
  Ardon: [7.26, 46.21],
  Ayent: [7.41, 46.283],
  "Saint-Nicolas": [7.803, 46.177],
  Zermatt: [7.749, 46.02],
  Berne: [7.447, 46.948],
  Zurich: [8.541, 47.377],
  Genève: [6.143, 46.204],
};

export type Marker = {
  name: string;
  at: number;
  color?: string;
  ripple?: boolean;
  label?: string;
  side?: "left" | "right" | "top" | "bottom";
};

export const SwissMap: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  /** "ch" : toute la Suisse, "vs" : zoom sur le Valais */
  view: "ch" | "vs";
  drawAt?: number;
  markers?: Marker[];
  valleyGlow?: number;
  rippleMax?: number;
}> = ({ x, y, width, height, view, drawAt = 0, markers = [], valleyGlow = 0, rippleMax = 180 }) => {
  const frame = useCurrentFrame();
  const proj = geoMercator();
  if (view === "ch") {
    proj.fitExtent(
      [
        [0, 0],
        [width, height],
      ],
      SWITZERLAND,
    );
  } else {
    // MultiPoint : pas de problème d'orientation de polygone (d3-geo est sphérique)
    const box: Feature = {
      type: "Feature",
      properties: {},
      geometry: { type: "MultiPoint", coordinates: [[6.75, 45.92], [8.45, 46.62]] },
    };
    proj.fitExtent(
      [
        [0, 0],
        [width, height],
      ],
      box,
    );
  }
  const path = geoPath(proj);
  const draw = appear(frame, drawAt, 40, easeInOut);
  const rhone = RHONE.map((p) => proj(p) as [number, number]);
  const rhoneD = "M" + rhone.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L");
  const chD = path(SWITZERLAND) ?? "";

  return (
    <svg width={width} height={height} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <defs>
        <clipPath id={`clip-${view}`}>
          <rect x={-40} y={-40} width={width + 80} height={height + 80} rx={36} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${view})`}>
        {view === "vs"
          ? NEIGHBOURS.map((f, i) => (
              <path key={i} d={path(f) ?? ""} fill="rgba(255,255,255,0.025)" stroke={C.line} strokeWidth={2} />
            ))
          : null}
        <path
          d={chD}
          fill={`rgba(127,178,255,${0.07 * draw})`}
          stroke={C.sky}
          strokeOpacity={0.75}
          strokeWidth={3}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        {/* vallée du Rhône : halo + rivière */}
        <path
          d={rhoneD}
          fill="none"
          stroke={C.coral}
          strokeOpacity={0.22 * valleyGlow}
          strokeWidth={view === "ch" ? 34 : 60}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={rhoneD}
          fill="none"
          stroke={C.sky}
          strokeWidth={view === "ch" ? 3.5 : 5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - appear(frame, drawAt + 20, 45, easeInOut)}
        />
      </g>
      {markers.map((m) => {
        const [px, py] = proj(PLACES[m.name]) as [number, number];
        const p = appear(frame, m.at, 14);
        const col = m.color ?? C.ink;
        const side = m.side ?? "right";
        const off = { left: [-22, 0], right: [22, 0], top: [0, -30], bottom: [0, 46] }[side];
        const anchor = side === "left" ? "end" : side === "right" ? "start" : "middle";
        return (
          <g key={m.name} opacity={p}>
            {m.ripple ? <Ripples x={px} y={py} at={m.at} color={col} max={rippleMax} /> : <circle cx={px} cy={py} r={9} fill={col} />}
            <text
              x={px + off[0]}
              y={py + off[1] + 11}
              textAnchor={anchor}
              fontFamily={m.label ? FONT_HEAD : FONT_BODY}
              fontWeight={700}
              fontSize={34}
              fill={C.ink}
              style={{ paintOrder: "stroke", stroke: C.bg0, strokeWidth: 8 }}
            >
              {m.label ?? m.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
