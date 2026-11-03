import React from "react";
import { C, FONT } from "../theme";
import { type Pt, smoothPath } from "../anim";

/**
 * SCHÉMA QUALITATIF.
 * Les sources consultées (articles de presse spécialisée relayant les ensembles
 * ECMWF/GFS, oct.–nov. 2026) ne publient pas de série chiffrée fiable et
 * réutilisable. Les courbes ci-dessous traduisent donc uniquement des tendances :
 *  - climatologie : renforcement saisonnier du vent zonal en automne ;
 *  - prévisions au 3 nov. 2026 : affaiblissement marqué, une partie des membres
 *    d'ensemble simulant une inversion (vent < 0 m/s) vers le 9–12 novembre.
 * Seule la valeur 0 m/s (seuil d'inversion) est positionnée sur l'axe.
 */

export const CH = { x0: 250, x1: 1680, yTop: 290, yBot: 800, days: 91, vMin: -0.32, vMax: 1.0 };
export const FORECAST_DAY = 33; // 3 novembre
export const BAND = [39, 42]; // 9–12 novembre
export const FORECAST_END = 48; // 18 novembre

export const xOf = (d: number) => CH.x0 + (d / CH.days) * (CH.x1 - CH.x0);
export const yOf = (v: number) => CH.yBot - ((v - CH.vMin) / (CH.vMax - CH.vMin)) * (CH.yBot - CH.yTop);

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const clim = (d: number) => 0.3 + 0.52 * (1 - Math.exp(-d / 40));
const analysis = (d: number) => clim(d) + 0.04 * Math.cos(d / 5) - 0.3 * smooth(12, FORECAST_DAY, d);
const knots: Pt[] = [
  [FORECAST_DAY, analysis(FORECAST_DAY)],
  [41, -0.06],
  [FORECAST_END, 0.1],
];
export const forecast = (d: number) => {
  if (d <= FORECAST_DAY) return analysis(d);
  const k = d <= knots[1][0] ? 0 : 1;
  const [a, b] = [knots[k], knots[k + 1]];
  const t = (d - a[0]) / (b[0] - a[0]);
  const e = (1 - Math.cos(Math.PI * t)) / 2;
  return a[1] + (b[1] - a[1]) * e;
};
const spread = (d: number) => 0.24 * Math.pow(Math.max(0, d - FORECAST_DAY) / (FORECAST_END - FORECAST_DAY), 0.85);

export const sample = (fn: (d: number) => number, d0: number, d1: number, n = 80): Pt[] =>
  new Array(n + 1).fill(0).map((_, i) => {
    const d = d0 + ((d1 - d0) * i) / n;
    return [xOf(d), yOf(fn(d))];
  });

const MONTHS = ["oct.", "nov.", "déc."];
export const dayLabel = (d: number) => {
  const day = Math.round(d);
  if (day < 31) return `${day + 1} ${MONTHS[0]}`;
  if (day < 61) return `${day - 30} ${MONTHS[1]}`;
  return `${day - 60} ${MONTHS[2]}`;
};

type Props = {
  grid: number;
  axis: number;
  climP: number;
  obsP: number;
  fcP: number;
  envO: number;
  bandO: number;
  zeroPulse: number;
};

export const DataChart: React.FC<Props> = ({ grid, axis, climP, obsP, fcP, envO, bandO, zeroPulse }) => {
  const climPts = sample(clim, 0, CH.days, 90);
  const obsPts = sample(forecast, 0, FORECAST_DAY, 60);
  const fcPts = sample(forecast, FORECAST_DAY, FORECAST_END, 40);
  const env: Pt[] = [
    ...sample((d) => forecast(d) + spread(d), FORECAST_DAY, FORECAST_END, 30),
    ...sample((d) => forecast(d) - spread(d), FORECAST_DAY, FORECAST_END, 30).reverse(),
  ];

  const tipDay = obsP < 1 ? FORECAST_DAY * obsP : FORECAST_DAY + (FORECAST_END - FORECAST_DAY) * fcP;
  const tipVisible = obsP > 0.01;
  const tip: Pt = [xOf(tipDay), yOf(forecast(tipDay))];
  const climTipDay = CH.days * climP;

  const monthTicks = [0, 31, 61, 91];
  const y0 = yOf(0);

  return (
    <g fontFamily={FONT}>
      <defs>
        <linearGradient id="chart-env" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.orange} stopOpacity={0.05} />
          <stop offset="1" stopColor={C.orange} stopOpacity={0.28} />
        </linearGradient>
        <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.cyan} stopOpacity={0.22} />
          <stop offset="1" stopColor={C.cyan} stopOpacity={0} />
        </linearGradient>
        <filter id="chart-glow" x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <pattern id="hatch" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" stroke={C.orange} strokeOpacity={0.35} strokeWidth={3} />
        </pattern>
      </defs>

      {/* Grille */}
      <g opacity={grid}>
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <line
            key={v}
            x1={CH.x0}
            x2={CH.x0 + (CH.x1 - CH.x0) * grid}
            y1={yOf(v)}
            y2={yOf(v)}
            stroke={C.white}
            strokeOpacity={0.07}
          />
        ))}
        {monthTicks.map((d) => (
          <line key={d} x1={xOf(d)} x2={xOf(d)} y1={CH.yTop - 10} y2={CH.yBot} stroke={C.white} strokeOpacity={0.08} />
        ))}
      </g>

      {/* Zone d'inversion (< 0 m/s) */}
      <rect x={CH.x0} y={y0} width={(CH.x1 - CH.x0) * grid} height={CH.yBot - y0} fill={C.orange} opacity={0.06 * grid} />

      {/* Axes */}
      <g opacity={axis}>
        <line x1={CH.x0} x2={CH.x1} y1={CH.yBot} y2={CH.yBot} stroke={C.white} strokeOpacity={0.35} />
        <line x1={CH.x0} x2={CH.x0} y1={CH.yTop - 20} y2={CH.yBot} stroke={C.white} strokeOpacity={0.35} />
        {[0, 1, 2].map((m) => (
          <text key={m} x={xOf(monthTicks[m] + 15)} y={CH.yBot + 40} fill={C.muted} fontSize={22} fontWeight={600} textAnchor="middle" letterSpacing="0.2em">
            {["OCTOBRE", "NOVEMBRE", "DÉCEMBRE"][m]}
          </text>
        ))}
        <text x={CH.x0 - 18} y={CH.yTop - 42} fill={C.muted} fontSize={19} fontWeight={500}>
          Vent zonal moyen à 60°N, 10 hPa (≈ 30 km) — en m/s
        </text>
        <text x={CH.x0 - 14} y={CH.yTop + 4} fill={C.muted} fontSize={18} textAnchor="end">
          plus fort
        </text>
        <text x={CH.x0 - 14} y={y0 + 7} fill={C.white} fontSize={22} fontWeight={700} textAnchor="end">
          0 m/s
        </text>
      </g>

      {/* Ligne zéro : seuil d'inversion */}
      <line
        x1={CH.x0}
        x2={CH.x0 + (CH.x1 - CH.x0) * axis}
        y1={y0}
        y2={y0}
        stroke={C.orange}
        strokeWidth={2 + zeroPulse * 2}
        strokeDasharray="10 8"
        opacity={0.75 + 0.25 * zeroPulse}
      />
      <text x={CH.x0 + 16} y={y0 + 34} fill={C.orange} fontSize={20} fontWeight={600} textAnchor="start" opacity={axis}>
        Sous 0 m/s : les vents s’inversent (vents d’est)
      </text>

      {/* Fenêtre d'inversion possible */}
      <g opacity={bandO}>
        <rect x={xOf(BAND[0])} y={CH.yTop - 10} width={xOf(BAND[1]) - xOf(BAND[0])} height={CH.yBot - CH.yTop + 10} fill="url(#hatch)" />
        <text x={(xOf(BAND[0]) + xOf(BAND[1])) / 2} y={CH.yTop - 18} fill={C.orange} fontSize={19} fontWeight={700} textAnchor="middle">
          9–12 nov.
        </text>
      </g>

      {/* Climatologie */}
      <path d={`${smoothPath(climPts)}L${CH.x1},${CH.yBot}L${CH.x0},${CH.yBot}Z`} fill="url(#chart-area)" opacity={climP * 0.8} />
      <path
        d={smoothPath(climPts)}
        fill="none"
        stroke={C.cyan}
        strokeWidth={4}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - climP}
        strokeLinecap="round"
      />
      {climP > 0.02 && climP < 1 && <circle cx={xOf(climTipDay)} cy={yOf(clim(climTipDay))} r={8} fill={C.cyan} />}

      {/* Enveloppe de prévision */}
      <path d={smoothPath(env) + "Z"} fill="url(#chart-env)" opacity={envO} />

      {/* Analyse + prévision */}
      <g filter="url(#chart-glow)" opacity={0.7}>
        <path d={smoothPath(obsPts)} fill="none" stroke={C.white} strokeWidth={7} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - obsP} />
        <path d={smoothPath(fcPts)} fill="none" stroke={C.orange} strokeWidth={8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - fcP} />
      </g>
      <path
        d={smoothPath(obsPts)}
        fill="none"
        stroke={C.white}
        strokeWidth={4}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - obsP}
        strokeLinecap="round"
      />
      <path
        d={smoothPath(fcPts)}
        fill="none"
        stroke={C.orange}
        strokeWidth={4.5}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - fcP}
        strokeLinecap="round"
      />

      {/* Marqueur « prévisions au 3 novembre » */}
      <g opacity={obsP >= 1 ? 1 : 0}>
        <line x1={xOf(FORECAST_DAY)} x2={xOf(FORECAST_DAY)} y1={CH.yTop - 10} y2={CH.yBot} stroke={C.white} strokeOpacity={0.5} strokeDasharray="3 6" />
        <text x={xOf(FORECAST_DAY) - 12} y={CH.yTop + 26} fill={C.white} fontSize={19} fontWeight={600} textAnchor="end">
          Prévisions au 3 nov. 2026 →
        </text>
      </g>

      {/* Tête de courbe + compteur de date */}
      {tipVisible && fcP < 1 && (
        <g>
          <circle cx={tip[0]} cy={tip[1]} r={18} fill={obsP < 1 ? C.white : C.orange} opacity={0.18} />
          <circle cx={tip[0]} cy={tip[1]} r={8} fill={obsP < 1 ? C.white : C.orange} />
          <text x={tip[0]} y={tip[1] - 30} fill={C.white} fontSize={24} fontWeight={700} textAnchor="middle">
            {dayLabel(tipDay)}
          </text>
        </g>
      )}
    </g>
  );
};
