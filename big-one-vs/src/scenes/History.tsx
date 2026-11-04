import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { appear, clamp, easeInOut, easeOut, fmt, rise, wf } from "../lib";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { SwissMap } from "../components/Map";
import { Card, Count, Kicker, Seismo, Stat, Title } from "../components/ui";
import { IcoHouse, IcoInfo, IcoRockfall, IcoWave } from "../components/icons";

const PAD = 72;
const Pill: React.FC<{ at: number; color: string; children: React.ReactNode }> = ({ at, color, children }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, at, 16);
  return (
    <div
      style={{
        fontFamily: FONT_HEAD,
        fontWeight: 700,
        fontSize: 46,
        color,
        padding: "16px 30px",
        borderRadius: 999,
        border: `3px solid ${color}`,
        background: `${color}1A`,
        opacity: p,
        scale: String(0.85 + 0.15 * p),
      }}
    >
      {children}
    </div>
  );
};

/* ================================================================ 01 */
export const S01Hook: React.FC = () => {
  const id = "s01_hook";
  const frame = useCurrentFrame();
  const glow = appear(frame, wf(id, "sismique"), 24);
  const big = wf(id, "Big");
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={wf(id, "Valais")}>La région la plus sismique de Suisse</Kicker>
      </div>
      <SwissMap
        view="ch"
        x={PAD}
        y={330}
        width={936}
        height={600}
        drawAt={0}
        valleyGlow={glow}
        rippleMax={150}
        markers={[
          { name: "Sion", at: wf(id, "sismique"), color: C.coral, ripple: true, label: "VALAIS", side: "bottom" },
          { name: "Berne", at: 20, color: C.dim },
          { name: "Zurich", at: 26, color: C.dim },
          { name: "Genève", at: 32, color: C.dim, side: "top" },
        ]}
      />
      <Seismo y={1010} height={110} boost={interpolate(frame, [big - 6, big + 4, big + 40], [0, 0.6, 0], clamp)} />
      <div style={{ position: "absolute", top: 1080, left: PAD, right: PAD }}>
        <Title at={big} size={168} style={{ letterSpacing: -4 }}>
          Le <span style={{ color: C.coral }}>Big One</span>
        </Title>
        <div style={{ display: "flex", gap: 20, marginTop: 30, flexWrap: "wrap" }}>
          <Pill at={wf(id, "magnitude")} color={C.amber}>
            Magnitude 6+
          </Pill>
          <Pill at={wf(id, "siècle")} color={C.sky}>
            ~1 fois par siècle
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ 02 */
const QUAKES = [
  { year: 1524, place: "Ardon", m: "5,8", mag: 5.8 },
  { year: 1755, place: "Brigue", m: "6,1", mag: 6.1 },
  { year: 1855, place: "Viège", m: "6,2", mag: 6.2 },
  { year: 1946, place: "Sierre", m: "5,8", mag: 5.8 },
];
const Y0 = 560;
const Y1 = 1340;
const yr = (y: number) => Y0 + ((y - 1524) / (2026 - 1524)) * (Y1 - Y0);

export const S02Timeline: React.FC = () => {
  const id = "s02_timeline";
  const frame = useCurrentFrame();
  const axis = appear(frame, 10, 60, easeInOut);
  const lineX = 250;
  const rhythm = wf(id, "rythme");
  const now = wf(id, "siècle", 2);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0}>Valais · repères historiques</Kicker>
        <Title at={4} size={84} style={{ marginTop: 14 }}>
          4 séismes majeurs
          <br />
          en 5 siècles
        </Title>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={lineX} y1={Y0} x2={lineX} y2={Y0 + (Y1 - Y0) * axis} stroke={C.line} strokeWidth={6} strokeLinecap="round" />
        {QUAKES.map((q) => {
          const at = wf(id, String(q.year));
          const p = appear(frame, at, 16);
          const r = (q.mag - 5) * 26 * p;
          return (
            <g key={q.year}>
              <circle cx={lineX} cy={yr(q.year)} r={r + 18 * p} fill={C.coral} opacity={0.18} />
              <circle cx={lineX} cy={yr(q.year)} r={Math.max(0, r * 0.55)} fill={C.coral} />
            </g>
          );
        })}
        {/* rythme ~ un siècle */}
        {[
          [1755, 1855, "100 ans"],
          [1855, 1946, "91 ans"],
        ].map(([a, b, label], i) => {
          const p = appear(frame, rhythm + i * 8, 18);
          const ya = yr(a as number);
          const yb = yr(b as number);
          const x = 200;
          return (
            <g key={i} opacity={p}>
              <path d={`M${x + 30} ${ya + 6} L${x} ${ya + 6} L${x} ${yb - 6} L${x + 30} ${yb - 6}`} stroke={C.amber} strokeWidth={4} fill="none" />
              <text x={x - 14} y={(ya + yb) / 2 + 12} textAnchor="end" fontFamily={FONT_HEAD} fontWeight={700} fontSize={34} fill={C.amber}>
                {label}
              </text>
            </g>
          );
        })}
        {/* aujourd'hui */}
        <g opacity={appear(frame, now, 18)}>
          <circle cx={lineX} cy={yr(2026)} r={22} fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray="8 8" />
          <text x={lineX + 50} y={yr(2026) + 14} fontFamily={FONT_HEAD} fontWeight={700} fontSize={44} fill={C.amber}>
            2026 · et maintenant ?
          </text>
        </g>
      </svg>
      {QUAKES.map((q) => {
        const at = wf(id, String(q.year));
        return (
          <div
            key={q.year}
            style={{
              position: "absolute",
              left: lineX + 70,
              top: yr(q.year) - 52,
              display: "flex",
              alignItems: "baseline",
              gap: 22,
              ...rise(frame, at, 30, 16),
            }}
          >
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 76, color: C.ink, letterSpacing: -2 }}>{q.year}</div>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 38, color: C.ink }}>{q.place}</div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 28, color: C.mute }}>Magnitude ~{q.m}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ================================================================ 03 */
const MiniFact: React.FC<{ at: number; icon: React.ReactNode; text: string }> = ({ at, icon, text }) => (
  <Card at={at} style={{ flex: 1, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ height: 70, display: "flex", alignItems: "center" }}>{icon}</div>
    <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 31, lineHeight: 1.2, color: C.ink }}>{text}</div>
  </Card>
);

export const S03Visp: React.FC = () => {
  const id = "s03_1855";
  const frame = useCurrentFrame();
  const magAt = wf(id, "Magnitude");
  const bar = appear(frame, magAt, 30);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0}>25 juillet 1855</Kicker>
        <Title at={4} size={110} style={{ marginTop: 10 }}>
          Viège
        </Title>
      </div>
      <SwissMap
        view="vs"
        x={PAD}
        y={480}
        width={936}
        height={460}
        drawAt={0}
        valleyGlow={0.6}
        rippleMax={200}
        markers={[
          { name: "Sion", at: 20, color: C.dim, side: "bottom" },
          { name: "Viège", at: wf(id, "tremble"), color: C.coral, ripple: true, side: "top" },
          { name: "Saint-Nicolas", at: wf(id, "Saint-Nicolas"), color: C.amber, side: "right" },
        ]}
      />
      <div style={{ position: "absolute", top: 990, left: PAD, right: PAD, display: "flex", flexDirection: "column", gap: 22 }}>
        <Card at={magAt} style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 112, color: C.coral, letterSpacing: -3, lineHeight: 1 }}>
            <Count at={magAt} to={6.2} decimals={1} dur={30} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 34, color: C.ink, lineHeight: 1.2 }}>
              Le plus fort séisme suisse
              <br />
              depuis 300 ans
            </div>
            <div style={{ height: 12, borderRadius: 6, background: C.line, marginTop: 16, overflow: "hidden" }}>
              <div
                style={{
                  width: `${(6.2 / 9) * 100 * bar}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${C.amber}, ${C.coral})`,
                }}
              />
            </div>
          </div>
        </Card>
        <div style={{ display: "flex", gap: 20 }}>
          <MiniFact at={wf(id, "Églises")} icon={<IcoHouse size={64} color={C.amber} />} text="Églises et maisons lézardées" />
          <MiniFact
            at={wf(id, "éboulements")}
            icon={
              <div style={{ width: 70, height: 70, overflow: "hidden" }}>
                <div style={{ scale: "0.35", transformOrigin: "0 0" }}>
                  <IcoRockfall />
                </div>
              </div>
            }
            text="Éboulements vers Saint-Nicolas"
          />
          <MiniFact at={wf(id, "dizaines")} icon={<IcoWave size={64} color={C.amber} />} text="Répliques pendant des mois" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ 04 */
export const S04Sierre: React.FC = () => {
  const id = "s04_1946";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0}>25 janvier 1946 · 18 h 32</Kicker>
        <Title at={4} size={110} style={{ marginTop: 10 }}>
          Sion – Sierre
        </Title>
      </div>
      <SwissMap
        view="vs"
        x={PAD}
        y={470}
        width={936}
        height={420}
        drawAt={0}
        valleyGlow={0.6}
        rippleMax={190}
        markers={[
          { name: "Sion", at: wf(id, "Sion"), color: C.ink, side: "left" },
          { name: "Sierre", at: wf(id, "Sierre"), color: C.ink, side: "right" },
          { name: "Ayent", at: wf(id, "secouée"), color: C.coral, ripple: true, label: "Épicentre", side: "top" },
        ]}
      />
      <div
        style={{
          position: "absolute",
          top: 930,
          left: PAD,
          right: PAD,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <Stat at={wf(id, "4 morts")} value={<Count at={wf(id, "4 morts")} to={4} dur={14} />} label="morts" color={C.coral} size={110} />
        <Stat
          at={wf(id, "3500")}
          value={<Count at={wf(id, "3500")} to={3500} dur={34} format={(n) => fmt(Math.round(n / 10) * 10) + "+"} />}
          label="bâtiments endommagés"
          size={110}
        />
        <Stat
          at={wf(id, "26 millions")}
          value={
            <span>
              <Count at={wf(id, "26 millions")} to={26} dur={26} />
              <span style={{ fontSize: 56 }}> mio</span>
            </span>
          }
          label="de francs de dégâts (valeur 1946)"
          color={C.amber}
          size={110}
        />
        <Stat
          at={wf(id, "30 mai")}
          value={
            <span>
              ~5<span style={{ fontSize: 56 }}> mio m³</span>
            </span>
          }
          label="de roche effondrée le 30 mai (réplique)"
          size={110}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ 05 */
export const S05Now: React.FC = () => {
  const id = "s05_now";
  const frame = useCurrentFrame();
  const yearsAt = wf(id, "80");
  const axisP = appear(frame, 20, 50, easeInOut);
  const winAt = wf(id, "fenêtre");
  const X0 = PAD + 20;
  const X1 = 1080 - PAD - 20;
  const xy = (y: number) => X0 + ((y - 1840) / (2080 - 1840)) * (X1 - X0);
  const progress = interpolate(frame, [yearsAt - 10, yearsAt + 40], [1946, 2026], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0}>Depuis 1946</Kicker>
      </div>
      <div style={{ position: "absolute", top: 320, left: PAD, right: PAD, display: "flex", alignItems: "baseline", gap: 24 }}>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 330, color: C.ink, letterSpacing: -12, lineHeight: 1, ...rise(frame, yearsAt - 8, 40) }}>
          <Count at={yearsAt - 8} to={80} dur={40} />
        </div>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 90, color: C.amber, ...rise(frame, yearsAt, 30) }}>ans</div>
      </div>
      <div style={{ position: "absolute", top: 700, left: PAD, right: PAD, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 38, color: C.mute, ...rise(frame, 6) }}>
        sans séisme majeur en Valais
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* fenêtre statistique */}
        <defs>
          <linearGradient id="win" x1="0" x2="1">
            <stop offset="0" stopColor={C.amber} stopOpacity={0.05} />
            <stop offset="0.35" stopColor={C.amber} stopOpacity={0.32} />
            <stop offset="1" stopColor={C.amber} stopOpacity={0.08} />
          </linearGradient>
        </defs>
        <rect
          x={xy(2010)}
          y={812}
          width={(xy(2075) - xy(2010)) * appear(frame, winAt - 12, 24)}
          height={120}
          rx={18}
          fill="url(#win)"
        />
        <text x={xy(2042)} y={800} textAnchor="middle" fontFamily={FONT_BODY} fontWeight={700} fontSize={28} fill={C.amber} opacity={appear(frame, winAt - 12, 18)}>
          FENÊTRE STATISTIQUE
        </text>
        <line x1={X0} y1={872} x2={X0 + (X1 - X0) * axisP} y2={872} stroke={C.line} strokeWidth={6} strokeLinecap="round" />
        <line x1={xy(1946)} y1={872} x2={xy(progress)} y2={872} stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
        {[1855, 1946].map((y) => (
          <g key={y} opacity={axisP}>
            <circle cx={xy(y)} cy={872} r={14} fill={C.coral} />
            <text x={xy(y)} y={970} textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={700} fontSize={36} fill={C.ink}>
              {y}
            </text>
          </g>
        ))}
        <g opacity={appear(frame, yearsAt + 30, 14)}>
          <circle cx={xy(2026)} cy={872} r={16} fill={C.bg0} stroke={C.amber} strokeWidth={5} />
          <text x={xy(2026)} y={970} textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={700} fontSize={36} fill={C.amber}>
            2026
          </text>
        </g>
      </svg>
      <div style={{ position: "absolute", top: 1060, left: PAD, right: PAD, display: "flex", flexDirection: "column", gap: 22 }}>
        <Card at={wf(id, "Attention")} accent={C.sky} style={{ display: "flex", gap: 26, alignItems: "center" }}>
          <IcoInfo size={70} />
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 36, color: C.ink, lineHeight: 1.25 }}>
            Pas imminent pour autant :<br />
            <span style={{ color: C.mute }}>personne ne peut prédire la date d'un séisme.</span>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
