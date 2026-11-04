import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { appear, easeInOut, wf } from "../lib";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { Card, Kicker, Title } from "../components/ui";
import { IcoAvalanche, IcoLandslide, IcoRoad, IcoRockfall } from "../components/icons";

const PAD = 72;

/* ================================================================ 06 */
/** Coupe schématique de la vallée : roche dure sur les flancs, alluvions dans la plaine */
const ValleySection: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const W0 = 936;
  const Hh = 470;
  const housesAt = wf(id, "habitants");
  const plainAt = wf(id, "plaine");
  const ampAt = wf(id, "amplifient");
  const amp = appear(frame, ampAt - 4, 20);
  const draw = appear(frame, 0, 40, easeInOut);
  // onde : petite dans la roche, amplifiée dans les sédiments
  const wave = (x0: number, x1: number, y: number, a: number, phase: number) => {
    const pts: string[] = [];
    for (let x = x0; x <= x1; x += 6) {
      pts.push(`${x},${(y + Math.sin(x / 18 + frame / 3 + phase) * a).toFixed(1)}`);
    }
    return pts.join(" ");
  };
  const houses = [300, 360, 420, 500, 560, 620];
  return (
    <svg width={W0} height={Hh} style={{ position: "absolute", left: PAD, top: 470, overflow: "visible" }}>
      {/* montagnes */}
      <path
        d={`M0 ${Hh} L0 120 L120 30 L210 150 L270 300 L666 300 L730 160 L820 40 L936 110 L936 ${Hh} Z`}
        fill="rgba(127,178,255,0.10)"
        stroke={C.sky}
        strokeWidth={3}
        opacity={draw}
      />
      {/* sédiments */}
      <path d={`M270 300 L666 300 L610 420 L330 420 Z`} fill={C.amber} opacity={0.28 * appear(frame, plainAt, 20)} />
      <path
        d={`M270 300 L666 300 L610 420 L330 420 Z`}
        fill="none"
        stroke={C.amber}
        strokeWidth={3}
        strokeDasharray="10 8"
        opacity={appear(frame, plainAt, 20)}
      />
      <text x={468} y={392} textAnchor="middle" fontFamily={FONT_BODY} fontWeight={700} fontSize={28} fill={C.amber} opacity={appear(frame, plainAt, 20)}>
        alluvions (sols meubles)
      </text>
      {/* Rhône */}
      <ellipse cx={468} cy={302} rx={46} ry={6} fill={C.sky} opacity={draw} />
      {/* maisons */}
      {houses.map((x, i) => {
        const p = appear(frame, housesAt + i * 3, 12);
        const sway = Math.sin(frame / 2.5 + i) * 5 * amp;
        const h = 34 + (i % 3) * 18;
        return (
          <g key={x} opacity={p} transform={`translate(${sway} ${(1 - p) * 20})`}>
            <rect x={x - 20} y={300 - h} width={40} height={h} rx={4} fill={C.ink} />
            <rect x={x - 10} y={300 - h + 10} width={8} height={8} fill={C.bg0} />
            <rect x={x + 2} y={300 - h + 10} width={8} height={8} fill={C.bg0} />
          </g>
        );
      })}
      {/* ondes */}
      <g opacity={amp}>
        <polyline points={wave(20, 250, 440, 5, 0)} fill="none" stroke={C.sky} strokeWidth={4} />
        <polyline points={wave(690, 916, 440, 5, 0)} fill="none" stroke={C.sky} strokeWidth={4} />
        <polyline points={wave(340, 600, 345, 22, 1)} fill="none" stroke={C.coral} strokeWidth={5} />
      </g>
      <text x={60} y={Hh + 20} fontFamily={FONT_BODY} fontWeight={600} fontSize={26} fill={C.sky} opacity={amp}>
        roche : onde faible
      </text>
      <text x={468} y={Hh + 20} textAnchor="middle" fontFamily={FONT_BODY} fontWeight={700} fontSize={28} fill={C.coral} opacity={amp}>
        plaine : onde amplifiée
      </text>
    </svg>
  );
};

export const S06Projection: React.FC = () => {
  const id = "s06_projection";
  const frame = useCurrentFrame();
  const costAt = wf(id, "4,5");
  const p = appear(frame, costAt, 20);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0}>Scénario · si ça arrivait aujourd'hui</Kicker>
        <Title at={4} size={92} style={{ marginTop: 12 }}>
          Et aujourd'hui ?
        </Title>
      </div>
      <ValleySection id={id} />
      <div style={{ position: "absolute", top: 1010, left: PAD, right: PAD }}>
        <Card at={wf(id, "Service")} accent={C.coral}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 30, color: C.mute, letterSpacing: 1 }}>
            SÉISME DE MAGNITUDE 6 PRÈS DE SION
          </div>
          <div
            style={{
              fontFamily: FONT_HEAD,
              fontWeight: 700,
              fontSize: 104,
              color: C.coral,
              letterSpacing: -3,
              lineHeight: 1.05,
              marginTop: 10,
              opacity: p,
              scale: String(0.9 + 0.1 * p),
              transformOrigin: "left center",
            }}
          >
            4,5 à 10 mrd CHF
          </div>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 30, color: C.ink, marginTop: 8, opacity: p }}>
            de dommages estimés · Service sismologique suisse
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ 07 */
const Hazard: React.FC<{ at: number; icon: React.ReactNode; title: string; sub: string; color?: string }> = ({
  at,
  icon,
  title,
  sub,
  color = C.ink,
}) => (
  <Card at={at} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "26px 22px 30px" }}>
    {icon}
    <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 44, color, lineHeight: 1.08, marginTop: 8 }}>{title}</div>
    <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 28, color: C.mute, marginTop: 8 }}>{sub}</div>
  </Card>
);

export const S07Nature: React.FC = () => {
  const id = "s07_nature";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0}>Effets en cascade</Kicker>
        <Title at={4} size={92} style={{ marginTop: 12 }}>
          En montagne aussi
        </Title>
      </div>
      <div
        style={{
          position: "absolute",
          top: 520,
          left: PAD,
          right: PAD,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 22,
        }}
      >
        <Hazard at={wf(id, "chutes")} icon={<IcoRockfall />} title="Chutes de pierres" sub="flancs instables" />
        <Hazard at={wf(id, "glissements")} icon={<IcoLandslide />} title="Glissements" sub="de terrain" />
        <Hazard at={wf(id, "avalanches")} icon={<IcoAvalanche />} title="Avalanches" sub="en hiver" />
        <Hazard at={wf(id, "routes")} icon={<IcoRoad />} title="Routes coupées" sub="vallées isolées quelques jours" color={C.amber} />
      </div>
    </AbsoluteFill>
  );
};
