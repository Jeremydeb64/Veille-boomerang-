import React, { useMemo } from "react";
import { geoPath, type GeoProjection } from "d3-geo";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { type Pt, smoothPath } from "../anim";
import { FlowParticles } from "./FlowParticles";

/* ------------------------------------------------------------------ */
/*  Rotation intégrée : permet de ralentir les vents sans à-coups      */
/* ------------------------------------------------------------------ */

/** Construit angle(t) = ∫ vitesse(t) dt (rad), échantillonné par frame. */
export const useIntegratedAngle = (speedAt: (f: number) => number, frames: number, offset = 600) =>
  useMemo(() => {
    const acc = new Float64Array(frames + offset + 2);
    for (let f = 1; f < acc.length; f++) acc[f] = acc[f - 1] + speedAt(f - offset);
    return (t: number) => {
      const x = Math.max(0, Math.min(acc.length - 2, t + offset));
      const i = Math.floor(x);
      return acc[i] + (acc[i + 1] - acc[i]) * (x - i);
    };
    // la fonction de vitesse est supposée stable pour une scène donnée
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames, offset]);

/* ------------------------------------------------------------------ */
/*  Vue du dessus (projection polaire schématique)                     */
/* ------------------------------------------------------------------ */

export type VortexShape = {
  /** Onde 1 : déplacement / étirement */
  w1: number;
  p1: number;
  /** Onde 2 : élongation en « cacahuète » */
  w2: number;
  p2: number;
  /** 0 → vortex unique, 1 → deux vortex distincts (scénario possible) */
  split: number;
};

export const STABLE: VortexShape = { w1: 0, p1: 0, w2: 0, p2: 0, split: 0 };

const wrap = (a: number) => {
  let x = (a + Math.PI) % (2 * Math.PI);
  if (x < 0) x += 2 * Math.PI;
  return x - Math.PI;
};

export const vortexPoint = (cx: number, cy: number, R: number, s: VortexShape, rho: number, th: number): Pt => {
  const f = 0.35 + 0.65 * rho;
  const r = rho * R * (1 + f * (s.w1 * Math.cos(th - s.p1) + s.w2 * Math.cos(2 * (th - s.p2))));
  const shift = s.w1 * R * 0.22;
  const bx = cx + Math.cos(s.p1) * shift + r * Math.cos(th);
  const by = cy + Math.sin(s.p1) * shift + r * Math.sin(th);
  if (s.split <= 0) return [bx, by];

  const ux = Math.cos(s.p2);
  const uy = Math.sin(s.p2);
  const off = R * 0.48;
  const rr = rho * R * 0.5;
  const d = wrap(th - s.p2);
  let sx: number;
  let sy: number;
  if (Math.abs(d) <= Math.PI / 2) {
    const a = 2 * d + s.p2;
    sx = cx + ux * off + rr * Math.cos(a);
    sy = cy + uy * off + rr * Math.sin(a);
  } else {
    const d2 = wrap(d - Math.PI);
    const a = 2 * d2 + s.p2 + Math.PI;
    sx = cx - ux * off + rr * Math.cos(a);
    sy = cy - uy * off + rr * Math.sin(a);
  }
  const k = s.split;
  return [bx + (sx - bx) * k, by + (sy - by) * k];
};

type PolarVortexProps = {
  cx: number;
  cy: number;
  R: number;
  shape: VortexShape;
  /** angle de rotation intégré (rad) en fonction du temps */
  angleAt: (t: number) => number;
  rings?: number;
  particles?: number;
  seed?: string;
  opacity?: number;
  /** 0 → cyan, 1 → teinte d'alerte orange sur les anneaux externes */
  alert?: number;
  glow?: boolean;
  id: string;
};

const mixColor = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
};

export const PolarVortex: React.FC<PolarVortexProps> = ({
  cx,
  cy,
  R,
  shape,
  angleAt,
  rings = 9,
  particles = 520,
  seed = "pv",
  opacity = 1,
  alert = 0,
  glow = true,
  id,
}) => {
  const frame = useCurrentFrame();
  const ang = angleAt(frame);
  const N = 72;

  const ringPaths: { d: string; color: string; w: number; dash: string; off: number }[] = [];
  for (let k = 0; k < rings; k++) {
    const rho = 0.16 + (0.84 * (k + 1)) / rings;
    const color = mixColor(
      k < rings / 2 ? "#BFEFFF" : C.cyan,
      C.orange,
      alert * Math.max(0, (k - rings * 0.35) / (rings * 0.65)),
    );
    for (const half of [0, 1]) {
      const pts: Pt[] = [];
      const start = shape.p2 - Math.PI / 2 + half * Math.PI;
      for (let i = 0; i <= N; i++) pts.push(vortexPoint(cx, cy, R, shape, rho, start + (Math.PI * i) / N));
      const dashLen = 30 + k * 9;
      ringPaths.push({
        d: smoothPath(pts),
        color,
        w: 1.1 + (k % 3 === 0 ? 0.9 : 0.3),
        dash: `${dashLen} ${dashLen * 0.55}`,
        off: ang * R * rho * 1.0,
      });
    }
  }

  // Bras spiraux lumineux
  const arms: string[] = [];
  for (let a = 0; a < 3; a++) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 60; i++) {
      const s = 0.08 + (0.95 * i) / 60;
      pts.push(vortexPoint(cx, cy, R, shape, s, (a * 2 * Math.PI) / 3 - ang + 3.6 * s));
    }
    arms.push(smoothPath(pts));
  }

  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={`${id}-core`} cx={cx} cy={cy} r={R * 1.05} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={C.ice} stopOpacity={0.32 * (1 - shape.split * 0.7)} />
          <stop offset={0.55} stopColor={C.cyan} stopOpacity={0.1} />
          <stop offset={1} stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={R * 1.05} fill={`url(#${id}-core)`} />
      {glow && (
        <g filter={`url(#${id}-glow)`} opacity={0.75}>
          {ringPaths
            .filter((_, i) => i % 4 < 2)
            .map((r, i) => (
              <path key={i} d={r.d} fill="none" stroke={r.color} strokeWidth={r.w * 3.5} strokeOpacity={0.45} />
            ))}
        </g>
      )}
      {arms.map((d, i) => (
        <path key={`a${i}`} d={d} fill="none" stroke={C.ice} strokeOpacity={0.22} strokeWidth={10} strokeLinecap="round" style={{ filter: "blur(5px)" }} />
      ))}
      {ringPaths.map((r, i) => (
        <path
          key={i}
          d={r.d}
          fill="none"
          stroke={r.color}
          strokeWidth={r.w}
          strokeOpacity={0.85}
          strokeDasharray={r.dash}
          strokeDashoffset={r.off}
          strokeLinecap="round"
        />
      ))}
      {particles > 0 && (
        <FlowParticles
          count={particles}
          seed={seed}
          trail={7}
          width={2}
          color={C.white}
          getPos={(p, t) => {
            const rho = 0.12 + p.r[0] * 0.95;
            const th = p.r[1] * Math.PI * 2 - angleAt(t) * (1.35 - 0.6 * rho);
            const jitter = (p.r[2] - 0.5) * 0.03;
            return vortexPoint(cx, cy, R, shape, rho + jitter, th);
          }}
        />
      )}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/*  Vortex projeté sur le globe 3D                                      */
/* ------------------------------------------------------------------ */

type GlobeVortexProps = {
  projection: GeoProjection;
  isVisible: (lon: number, lat: number) => boolean;
  angleAt: (t: number) => number;
  /** amplitude des ondulations (degrés de latitude) */
  wave?: number;
  intensity?: number;
  particles?: number;
  id: string;
};

const lineLat = (base: number, lon: number, wave: number, ph: number) =>
  base + wave * (0.6 * Math.sin(((lon + ph) * 2 * Math.PI) / 180) + 0.4 * Math.sin(((lon * 3 - ph) * Math.PI) / 180));

export const GlobeVortexOverlay: React.FC<GlobeVortexProps> = ({
  projection,
  isVisible,
  angleAt,
  wave = 3,
  intensity = 1,
  particles = 650,
  id,
}) => {
  const frame = useCurrentFrame();
  const path = geoPath(projection);
  const ang = angleAt(frame);
  const degShift = (ang * 180) / Math.PI;

  const lines = [60, 64, 68, 72, 76, 80].map((lat, k) => {
    const coords: [number, number][] = [];
    for (let lon = -180; lon <= 180; lon += 2) coords.push([lon, lineLat(lat, lon, wave * (1 - k * 0.1), degShift * 0.3 + k * 25)]);
    return { d: path({ type: "LineString", coordinates: coords }) ?? "", k };
  });

  return (
    <g opacity={intensity}>
      <defs>
        <filter id={`${id}-gv`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
      </defs>
      <g filter={`url(#${id}-gv)`}>
        {lines.map((l) => (
          <path key={l.k} d={l.d} fill="none" stroke={C.cyan} strokeWidth={6} strokeOpacity={0.4} />
        ))}
      </g>
      {lines.map((l) => (
        <path
          key={l.k}
          d={l.d}
          fill="none"
          stroke={l.k > 3 ? C.ice : C.cyan}
          strokeWidth={1.6}
          strokeDasharray="46 22"
          strokeDashoffset={-ang * 260 * (1 + l.k * 0.08)}
          strokeLinecap="round"
          strokeOpacity={0.9}
        />
      ))}
      {particles > 0 && (
        <FlowParticles
          count={particles}
          seed={`${id}-gp`}
          trail={8}
          width={1.8}
          color={C.white}
          getPos={(p, t) => {
            const base = 56 + p.r[0] * 28;
            const vel = 1 - Math.min(1, Math.abs(base - 66) / 18);
            const lon = p.r[1] * 360 + ((angleAt(t) * 180) / Math.PI) * (0.6 + 0.9 * vel);
            const lonW = ((lon + 180) % 360) - 180;
            const lat = lineLat(base, lonW, wave, degShift * 0.3);
            if (!isVisible(lonW, lat)) return null;
            return projection([lonW, lat]) as Pt;
          }}
        />
      )}
    </g>
  );
};
