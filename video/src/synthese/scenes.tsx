import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT_BODY } from "../boomerang/theme";
import { chf, CountUp, prog, Reveal, useCue } from "../boomerang/kit";
import { Abs, Avatar, FlowArrow, Headline, Hl, Icon, T } from "./ui";

const PALE_RED = "#E9B9BC";
const PALE_GREY = "#C3CCDD";

// Données du dossier (aucun chiffre ajouté)
const PLAN_PART = [20, 20, 40, 40, 60, 60, 80, 80, 100, 100, 100]; // 2027–2037
const PLAN_DIV = [30, 30, 60, 60, 90, 90, 96, 96, 120, 120, 120]; // k CHF
const PLAN_SOLDE = [-54.5, -54.1, -29.1, -28.7, -5.4, -5.0, -1.0, -0.6, 17.0, 17.4, 97.8];
const PROP_SOLDE = [-2.483, -2.192, -1.9, -1.608, -1.317, -1.025, 15.317, 15.608, 15.9, 16.192, 16.483, 16.775]; // 2027–2038

const fmtK = (v: number) => (v < 0 ? "−" : "") + chf(Math.abs(v) * 1000);

// ===========================================================================
// 1. Ouverture
// ===========================================================================
export const Intro: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const who = cue("Yvan cède");
  const pY = prog(f, who, 18);
  const pJ = prog(f, who + 10, 18);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Abs x={0} y={0} w={1920 * prog(f, 0, 30)} h={14} style={{ background: C.blue }} />
      <Reveal at={4} style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center" }}>
        <T size={26} bold color={C.grey} style={{ letterSpacing: 3 }}>BOOMERANG MARKETING SA</T>
      </Reveal>
      <Reveal at={cue("Voici")} style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center" }}>
        <T title size={88} color={C.blue}>Proposition de reprise</T>
        <T title size={56} color={C.navy}>et plan de financement · la synthèse</T>
      </Reveal>
      <Abs x={560} y={560} style={{ opacity: pY, scale: `${0.6 + 0.4 * pY}` }}>
        <Avatar letter="Y" color={C.navy} size={180} />
        <T size={30} bold style={{ textAlign: "center", marginTop: 16 }}>Yvan</T>
        <T size={22} color={C.grey} style={{ textAlign: "center" }}>cède</T>
      </Abs>
      <Abs x={1180} y={560} style={{ opacity: pJ, scale: `${0.6 + 0.4 * pJ}` }}>
        <Avatar letter="J" color={C.blue} size={180} />
        <T size={30} bold style={{ textAlign: "center", marginTop: 16 }}>Jérémy</T>
        <T size={22} color={C.grey} style={{ textAlign: "center" }}>reprend</T>
      </Abs>
      <FlowArrow d="M 760 650 Q 960 540 1160 650" at={who + 14} color={C.blue} />
      <Reveal at={who + 24} style={{ position: "absolute", left: 0, right: 0, top: 545, textAlign: "center" }}>
        <T size={22} bold color={C.blue}>transmission progressive</T>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. La valeur
// ===========================================================================
export const Valeur: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const S = 800; // px pour 1 M
  const X0 = 560;
  const rows = [
    { l: "Valeur de rendement", s: "bénéfices sur 10 ans, capitalisés à 10 %", v: 1.28, txt: "1,28 M", c: C.mid, w: "", k: "la valeur de rendement" },
    { l: "Valeur substantielle", s: "fonds propres libérés", v: 0.466, txt: "0,466 M", c: C.mid, w: "", k: "la valeur substantielle" },
    { l: "Valorisation", s: "moyenne pondérée des deux", v: 1.25, txt: "1,25 M", c: C.navy, w: "", k: "La valeur fiscale" },
  ];
  const line = cue("Le prix de référence est fixé");
  const pl = prog(f, line, 24);
  const ref = cue("dix mille francs par action");
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="">
        LA VALEUR
      </Headline>
      {rows.map((r, i) => {
        const at = cue(r.k);
        const p = prog(f, at, 30);
        const y = 360 + i * 150;
        return (
          <React.Fragment key={r.l}>
            <Reveal at={at} dx={-30} dy={0} style={{ position: "absolute", left: 120, top: y + 4, width: 420 }}>
              <T size={30} bold>{r.l}</T>
              <T size={21} color={C.grey}>{r.s}</T>
            </Reveal>
            <Abs x={X0} y={y} w={S * r.v * p} h={78} style={{ background: r.c, borderRadius: 4 }} />
            <Abs x={X0 + S * r.v * p + 20} y={y + 12} style={{ opacity: p }}>
              <T title size={48} color={r.c}>
                <CountUp at={at} to={r.v} final={r.txt} format={(v) => `${v.toFixed(r.v < 1 ? 3 : 2).replace(".", ",")} M`} />
              </T>
            </Abs>
          </React.Fragment>
        );
      })}
      {/* repère 1 M */}
      <Abs x={X0 + S - 2} y={340} w={4} h={440 * pl} style={{ background: `repeating-linear-gradient(${C.red} 0 12px, transparent 12px 20px)` }} />
      <Abs x={X0 + S - 160} y={300} w={320} style={{ opacity: pl, textAlign: "center" }}>
        <T size={22} bold color={C.red}>prix de référence 1 M</T>
      </Abs>
      <Abs x={X0 + S - 200} y={786} w={400} style={{ textAlign: "center", opacity: prog(f, cue("soit environ quatre-vingts"), 16) }}>
        <T size={22} bold color={C.red}>≈ 80 % de la valorisation</T>
      </Abs>
      <Reveal at={ref} style={{ position: "absolute", left: 120, top: 850 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", background: C.blue, padding: "22px 36px", borderRadius: 8 }}>
          <T title size={44} color={C.white}>Prix de référence : CHF 1 M</T>
          <T size={30} color={C.pale}>soit CHF 10’000 par action, pour 100 % du capital</T>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3. Le mécanisme
// ===========================================================================
export const Mecanisme: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const pBox = prog(f, cue("Ce prêt est ensuite") - 10, 20);
  const nodes = prog(f, cue("Jérémy achète") - 10, 20);
  const label = (x: number, y: number, at: number, text: string, sub?: string, color: string = C.blue) => (
    <Reveal at={at + 16} style={{ position: "absolute", left: x - 300, top: y, width: 600, textAlign: "center" }}>
      <T size={26} bold color={color}>{text}</T>
      {sub ? <T size={20} color={C.grey}>{sub}</T> : null}
    </Reveal>
  );
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="Le cadre posé à l’été 2026">
        Un prêt vendeur <Hl>remboursé par les dividendes</Hl>
      </Headline>
      {/* acteurs */}
      <Abs x={250} y={620} style={{ opacity: nodes, textAlign: "center", width: 170 }}>
        <Avatar letter="Y" color={C.navy} size={150} style={{ margin: "0 auto" }} />
        <T size={28} bold style={{ marginTop: 10 }}>Yvan</T>
        <T size={20} color={C.grey}>vendeur</T>
      </Abs>
      <Abs x={1500} y={620} style={{ opacity: nodes, textAlign: "center", width: 170 }}>
        <Avatar letter="J" color={C.blue} size={150} style={{ margin: "0 auto" }} />
        <T size={28} bold style={{ marginTop: 10 }}>Jérémy</T>
        <T size={20} color={C.grey}>repreneur</T>
      </Abs>
      <Abs
        x={760}
        y={330}
        w={400}
        h={120}
        style={{ opacity: pBox, scale: `${0.8 + 0.2 * pBox}`, background: C.light, border: `3px solid ${C.blue}`, borderRadius: 12, display: "flex", alignItems: "center", gap: 18, padding: "0 30px", boxSizing: "border-box" }}
      >
        <Icon name="coins" size={64} />
        <div>
          <T size={28} bold>Boomerang</T>
          <T size={20} color={C.grey}>l’agence verse des dividendes</T>
        </div>
      </Abs>
      {/* flux */}
      <FlowArrow d="M 440 660 Q 960 560 1480 660" at={cue("Jérémy achète")} color={C.navy} />
      {label(960, 555, cue("Jérémy achète"), "Actions", "vente directe entre privés", C.navy)}
      <FlowArrow d="M 1480 770 Q 960 860 440 770" at={cue("Il en finance")} color={C.blue} />
      {label(960, 822, cue("Il en finance"), "Cash + prêt vendeur", "à taux préférentiel")}
      <FlowArrow d="M 1160 400 Q 1560 400 1585 600" at={cue("Ce prêt est ensuite")} color={C.mid} />
      {label(1450, 330, cue("Ce prêt est ensuite"), "Dividendes", undefined, C.mid)}
      <FlowArrow d="M 1500 880 Q 960 1010 420 880" at={cue("par les dividendes")} color={C.red} />
      {label(960, 950, cue("par les dividendes"), "Remboursement du prêt", undefined, C.red)}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 4. Le plan initial et son test
// ===========================================================================
export const PlanInitial: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const X0 = 300;
  const STEP = 136;
  const BASE = 600; // ligne de base des dividendes
  const K1 = 2.0; // px par k CHF (dividendes)
  const ZERO = 790; // zéro du solde
  const K2 = 1.15;
  const barsAt = cue("cinq tranches");
  const lineAt = cue("le remboursement est fixe");
  const soldeAt = cue("chaque année est déficitaire");
  const cumAt = cue("Le déficit cumulé");
  const stampAt = cue("En l'état");
  const pl = prog(f, lineAt, 30);
  const yLine = BASE - 80 * K1;
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="Le test du plan initial">
        Plan initial : <Hl>5 tranches de 20 %</Hl>, tous les deux ans
      </Headline>
      <Abs x={120} y={BASE - 150} w={160}>
        <T size={20} bold color={C.grey}>DIVIDENDES PERÇUS</T>
        <T size={18} color={C.grey}>selon la part détenue</T>
      </Abs>
      <Abs x={120} y={ZERO - 30} w={160}>
        <T size={20} bold color={C.grey}>SOLDE ANNUEL</T>
        <T size={18} color={C.grey}>après remboursement, impôts, intérêts</T>
      </Abs>
      {PLAN_DIV.map((v, i) => {
        const p = prog(f, barsAt + i * 5, 16);
        const x = X0 + i * STEP;
        const h = v * K1 * p;
        const sp = prog(f, soldeAt + i * 4, 16);
        const s = PLAN_SOLDE[i];
        const sh = Math.abs(s) * K2 * sp;
        return (
          <React.Fragment key={i}>
            <Abs x={x + 28} y={BASE - h} w={80} h={h} style={{ background: C.blue, borderRadius: "4px 4px 0 0" }} />
            <Abs x={x} y={BASE - h - 34} w={136} style={{ opacity: p, textAlign: "center" }}>
              <T size={19} bold color={C.blue}>{PLAN_PART[i]} %</T>
            </Abs>
            <Abs x={x} y={BASE + 10} w={136} style={{ textAlign: "center", opacity: prog(f, barsAt, 10) }}>
              <T size={20} bold>{2027 + i}</T>
            </Abs>
            <Abs x={x + 28} y={s < 0 ? ZERO : ZERO - sh} w={80} h={sh} style={{ background: s < 0 ? C.red : C.navy }} />
            <Abs x={x} y={s < 0 ? ZERO + sh + 6 : ZERO - sh - 30} w={136} style={{ textAlign: "center", opacity: sp }}>
              <T size={18} bold color={s < 0 ? C.red : C.navy}>{fmtK(s)}</T>
            </Abs>
          </React.Fragment>
        );
      })}
      {/* remboursement fixe 80’000 */}
      <Abs x={X0} y={yLine - 2} w={10 * STEP * pl} h={5} style={{ background: `repeating-linear-gradient(90deg, ${C.red} 0 18px, transparent 18px 28px)` }} />
      <Abs x={X0} y={yLine - 40} w={460} style={{ opacity: pl }}>
        <T size={22} bold color={C.red}>Remboursement fixe : 80’000 / an</T>
      </Abs>
      <Abs x={X0} y={ZERO - 1} w={11 * STEP * prog(f, soldeAt - 10, 20)} h={2} style={{ background: C.navy }} />
      {/* déficit cumulé */}
      <Reveal at={cumAt} style={{ position: "absolute", left: X0, top: 900, width: 8 * STEP, textAlign: "center" }}>
        <div style={{ borderTop: `3px solid ${C.red}`, paddingTop: 10 }}>
          <T title size={50} color={C.red}>
            <CountUp at={cumAt} to={178400} final="−178’400" format={(v) => `−${chf(v)}`} dur={40} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 24, fontWeight: 700 }}> cumulés de 2027 à 2034, malgré 200’000 de fonds privés</span>
          </T>
        </div>
      </Reveal>
      {/* verdict */}
      <Abs
        x={1450}
        y={850}
        style={{
          opacity: prog(f, stampAt, 10),
          scale: `${interpolate(prog(f, stampAt, 12), [0, 1], [1.6, 1])}`,
          rotate: "-6deg",
          border: `5px solid ${C.red}`,
          borderRadius: 10,
          padding: "12px 26px",
          background: "rgba(255,255,255,0.92)",
        }}
      >
        <T title size={46} color={C.red}>NON SOUTENABLE</T>
        <T size={22} bold color={C.red}>en l’état</T>
      </Abs>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 5. Hypothèses prudentes et risques
// ===========================================================================
export const Hypotheses: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const BASE = 720;
  const K = 1.75;
  const a1 = cue("Un bénéfice");
  const a2 = cue("Cent cinquante mille");
  const a3 = cue("qui passent de");
  const p1 = prog(f, a1, 24);
  const p1b = prog(f, cue("contre cent septante-neuf"), 24);
  const p2 = prog(f, a2, 24);
  const p2b = prog(f, cue("dont cinquante mille"), 24);
  const p3 = prog(f, a3 - 12, 16);
  const drain = prog(f, a3, 70);
  const TANK = 330;
  const lvl = interpolate(drain, [0, 1], [363, 63]);
  const risks: [Parameters<typeof Icon>[0]["name"], string, string][] = [
    ["building", "Nouveau loyer", "le nouveau loyer"],
    ["chart", "Marché et IA", "le marché et l'IA"],
    ["network", "Continuité du réseau", "la continuité du réseau"],
    ["pie", "Qualité du chiffre d’affaires", "la qualité du chiffre"],
    ["people", "Cotisation LPP (23 %, à confirmer)", "la cotisation LPP"],
  ];
  const bar = (x: number, v: number, p: number, color: string, label: string, sub: string) => (
    <>
      <Abs x={x} y={BASE - v * K * p} w={130} h={v * K * p} style={{ background: color, borderRadius: "4px 4px 0 0" }} />
      <Abs x={x - 30} y={BASE - v * K * p - 44} w={190} style={{ textAlign: "center", opacity: p }}>
        <T title size={34} color={color === PALE_GREY ? C.grey : color}>{label}</T>
      </Abs>
      <Abs x={x - 30} y={BASE + 10} w={190} style={{ textAlign: "center", opacity: p }}>
        <T size={20} color={C.grey}>{sub}</T>
      </Abs>
    </>
  );
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="Analyse complémentaire Bonvesting">
        Des hypothèses <Hl>prudentes</Hl>
      </Headline>
      {/* 1. bénéfice */}
      <Reveal at={a1} style={{ position: "absolute", left: 120, top: 300 }}>
        <T size={26} bold>Bénéfice annuel retenu</T>
      </Reveal>
      {bar(150, 179, p1b, PALE_GREY, "179’000", "réalisé 2025")}
      {bar(340, 100, p1, C.blue, "100’000", "hypothèse")}
      {/* 2. distribution */}
      <Reveal at={a2} style={{ position: "absolute", left: 700, top: 300 }}>
        <T size={26} bold>Distribué par an, 2027–2032</T>
      </Reveal>
      <Abs x={820} y={BASE - 100 * K * p2} w={150} h={100 * K * p2} style={{ background: C.blue }} />
      <Abs x={820} y={BASE - 100 * K - 50 * K * p2b} w={150} h={50 * K * p2b} style={{ background: C.mid, borderRadius: "4px 4px 0 0", opacity: p2b > 0 ? 1 : 0 }} />
      <Abs x={990} y={BASE - 60} style={{ opacity: p2 }}>
        <T size={22} bold color={C.blue}>100’000 de bénéfice</T>
      </Abs>
      <Abs x={990} y={BASE - 100 * K - 50} style={{ opacity: p2b }}>
        <T size={22} bold color={C.mid}>+ 50’000 de réserves</T>
      </Abs>
      <Abs x={760} y={BASE - 150 * K - 54} w={270} style={{ textAlign: "center", opacity: p2b }}>
        <T title size={40} color={C.navy}>150’000</T>
      </Abs>
      <Abs x={760} y={BASE + 10} w={270} style={{ textAlign: "center", opacity: p2 }}>
        <T size={20} color={C.grey}>dès 2033 : bénéfice annuel seul</T>
      </Abs>
      {/* 3. réserves */}
      <Reveal at={a3 - 12} style={{ position: "absolute", left: 1300, top: 300 }}>
        <T size={26} bold>Bénéfice reporté (réserves)</T>
      </Reveal>
      <Abs x={1330} y={BASE - TANK} w={170} h={TANK} style={{ opacity: p3, border: `3px solid ${C.navy}`, borderTop: "none", boxSizing: "border-box" }} />
      <Abs x={1333} y={BASE - (TANK * lvl) / 380} w={164} h={(TANK * lvl) / 380} style={{ opacity: p3, background: C.mid }} />
      <Abs x={1530} y={BASE - (TANK * lvl) / 380 - 26} style={{ opacity: p3 }}>
        <T title size={44} color={C.navy}>{chf(Math.round(lvl / 1) * 1000)}</T>
        <T size={20} color={C.grey}>{drain < 1 ? "à la transaction" : "fin 2032"}</T>
      </Abs>
      {/* risques */}
      <Reveal at={cue("Et cinq risques")} style={{ position: "absolute", left: 120, top: 800 }}>
        <T size={22} bold color={C.blue} style={{ letterSpacing: 2 }}>5 RISQUES INTÉGRÉS À L’ANALYSE</T>
      </Reveal>
      {risks.map(([icon, label, k], i) => (
        <Reveal key={label} at={cue(k)} style={{ position: "absolute", left: 120 + i * 340, top: 845 }}>
          <div style={{ width: 320, height: 120, background: C.light, borderRadius: 10, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box" }}>
            <Icon name={icon} size={54} />
            <T size={22} bold>{label}</T>
          </div>
        </Reveal>
      ))}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 6. La proposition : 2 × 45 %
// ===========================================================================
export const Proposition45: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const X0 = 200;
  const STEP = 72;
  const BASE = 760;
  const H = 380; // 100 %
  const gAt = cue("deux grandes étapes");
  const t1 = cue("Le premier janvier deux mille vingt-sept");
  const t2 = cue("Le premier janvier deux mille trente-trois");
  const rest = cue("Les dix pour cent");
  const pg = prog(f, gAt, 30);
  const p1 = prog(f, t1, 30);
  const p2 = prog(f, t2, 30);
  const pr = prog(f, rest, 20);
  const plan = [...PLAN_PART, 100];
  const fin = cue("cent mille de fonds privés");
  const loan = cue("et trois cent cinquante mille");
  const six = cue("sur six ans");
  const pF = prog(f, fin, 20);
  const pL = prog(f, loan, 28);
  const BW = 600;
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="Le cœur de la proposition">
        <Hl>Deux étapes</Hl> au lieu de cinq
      </Headline>
      {/* graphique de la part détenue par Jérémy */}
      <Abs x={120} y={300}>
        <T size={22} bold color={C.grey}>PART DÉTENUE PAR JÉRÉMY</T>
      </Abs>
      {[0, 50, 100].map((v) => (
        <React.Fragment key={v}>
          <Abs x={X0} y={BASE - (v * H) / 100} w={12 * STEP} h={1} style={{ background: C.rule }} />
          <Abs x={120} y={BASE - (v * H) / 100 - 14} w={70} style={{ textAlign: "right" }}>
            <T size={18} color={C.grey}>{v} %</T>
          </Abs>
        </React.Fragment>
      ))}
      {plan.map((v, i) => {
        const vis = prog(f, gAt + i * 3, 10);
        return (
          <Abs key={`p${i}`} x={X0 + i * STEP} y={BASE - (v * H) / 100 - 2} w={STEP} h={4} style={{ zIndex: 2, background: `repeating-linear-gradient(90deg, ${C.red} 0 10px, transparent 10px 16px)`, opacity: vis * pg }} />
        );
      })}
      <Abs x={520} y={302} style={{ opacity: pg, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 4, background: `repeating-linear-gradient(90deg, ${C.red} 0 10px, transparent 10px 16px)` }} />
        <T size={20} bold color={C.red}>plan initial : 5 × 20 %</T>
      </Abs>
      {Array.from({ length: 12 }, (_, i) => {
        const second = i >= 6;
        const pp = second ? p2 : p1;
        const v = second ? 45 + 45 * p2 : 45 * p1;
        return (
          <React.Fragment key={`b${i}`}>
            <Abs x={X0 + i * STEP + 4} y={BASE - (v * H) / 100} w={STEP - 8} h={(v * H) / 100} style={{ background: second ? C.blue : C.mid, opacity: second && p2 === 0 ? 0 : 1 }} />
            <Abs x={X0 + i * STEP} y={BASE + 8} w={STEP} style={{ textAlign: "center", opacity: pp > 0 || i < 6 ? 1 : 0.4 }}>
              <T size={16} bold>{2027 + i}</T>
            </Abs>
          </React.Fragment>
        );
      })}
      <Abs x={X0 + 2 * STEP} y={BASE - (45 * H) / 100 - 56} style={{ opacity: p1 }}>
        <T title size={48} color={C.mid}>45 %</T>
      </Abs>
      <Abs x={X0 + 8 * STEP} y={BASE - (90 * H) / 100 + 20} style={{ opacity: p2 }}>
        <T title size={48} color={C.white}>90 %</T>
      </Abs>
      <Abs
        x={X0 + 6 * STEP + 4}
        y={BASE - H}
        w={6 * STEP - 8}
        h={(10 * H) / 100}
        style={{ opacity: pr, border: `2px dashed ${C.grey}`, boxSizing: "border-box", background: `repeating-linear-gradient(45deg, ${C.light} 0 8px, #fff 8px 16px)` }}
      />
      <Abs x={X0 + 6 * STEP} y={BASE - H + 6} w={6 * STEP} style={{ opacity: pr, textAlign: "center" }}>
        <T size={20} bold color={C.navy}>10 % à définir</T>
      </Abs>
      {/* financement d’une tranche */}
      <Abs x={1210} y={300} w={600}>
        <Reveal at={t1}>
          <T size={22} bold color={C.grey}>CHAQUE TRANCHE DE 45 %</T>
          <T title size={64} color={C.navy}>
            CHF <CountUp at={t1} to={450000} final="450’000" format={chf} />
          </T>
        </Reveal>
      </Abs>
      <Abs x={1210} y={430} w={(BW * 100) / 450 * pF} h={64} style={{ background: C.blue }} />
      <Abs x={1210 + (BW * 100) / 450 + 4} y={430} w={((BW * 350) / 450 - 4) * pL} h={64} style={{ background: C.navy }} />
      <Abs x={1210} y={505} w={600} style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ opacity: pF }}>
          <T size={22} bold color={C.blue}>100’000</T>
          <T size={18} color={C.grey}>fonds privés, à la signature</T>
        </div>
        <div style={{ opacity: pL, textAlign: "right" }}>
          <T size={22} bold color={C.navy}>350’000</T>
          <T size={18} color={C.grey}>prêt vendeur</T>
        </div>
      </Abs>
      <Reveal at={six - 20} style={{ position: "absolute", left: 1210, top: 600 }}>
        <T size={24} bold>Prêt vendeur : ≈ 58’300 par an, sur 6 ans</T>
      </Reveal>
      {Array.from({ length: 6 }, (_, i) => (
        <Abs key={i} x={1210 + i * 100} y={650} w={88} h={70} style={{ opacity: prog(f, six + i * 4, 10), background: C.light, border: `2px solid ${C.navy}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <T size={18} bold>an {i + 1}</T>
        </Abs>
      ))}
      <Reveal at={t2} style={{ position: "absolute", left: 1210, top: 760, width: 600 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ background: C.mid, color: C.white, padding: "10px 16px", borderRadius: 6, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 20 }}>2027 · prêt soldé fin 2032</div>
          <div style={{ background: C.blue, color: C.white, padding: "10px 16px", borderRadius: 6, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 20 }}>2033 · même financement</div>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 7. Pourquoi ça tient : comparaison des soldes
// ===========================================================================
export const Equilibre: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const W = 1680;
  const y1 = cue("Yvan perçoit");
  const j1 = cue("et Jérémy");
  const am = cue("de quoi couvrir");
  const pY = prog(f, y1, 24);
  const pJ = prog(f, j1, 24);
  const pA = prog(f, am, 20);
  const xJ = 120 + W * 0.55 + 4;
  const wJ = W * 0.45 - 4;
  const xA = xJ + (wJ * 58300) / 67500;
  // graphique : années du premier prêt (2027–2032)
  const X0 = 300;
  const N = 6;
  const STEP = 246;
  const ZERO = 600;
  const K = 3.6;
  const planAt = cue("Après impôts");
  const propAt = cue("le solde reste proche");
  const negLbl = cue("entre moins");
  const vsAt = cue("Là où le plan initial");
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="Pourquoi cela tient">
        Un solde <Hl>proche de l’équilibre</Hl>
      </Headline>
      {/* partage des 150’000 */}
      <Abs x={120} y={290}>
        <T size={20} bold color={C.grey}>150’000 DISTRIBUÉS PAR AN (2027–2032)</T>
      </Abs>
      <Abs x={120} y={325} w={W * 0.55 * pY} h={62} style={{ background: C.navy }} />
      <Abs x={xJ} y={325} w={wJ * pJ} h={62} style={{ background: C.blue }} />
      <Abs x={140} y={340} style={{ opacity: pY }}>
        <T size={24} bold color={C.white}>Yvan · 55 % · ≈ 82’500</T>
      </Abs>
      <Abs x={xJ + 20} y={340} style={{ opacity: pJ }}>
        <T size={24} bold color={C.white}>Jérémy · 45 % · ≈ 67’500</T>
      </Abs>
      <Abs x={xA - 2} y={315} w={5} h={84 * pA} style={{ background: C.red }} />
      <Abs x={xA - 420} y={398} w={420} style={{ opacity: pA, textAlign: "right" }}>
        <T size={21} bold color={C.red}>amortissement du prêt ≈ 58’300 ▲</T>
      </Abs>
      {/* comparaison des soldes */}
      <Abs x={120} y={455}>
        <T size={20} bold color={C.grey}>SOLDE ANNUEL POUR JÉRÉMY · 2027–2032, DURÉE DU PREMIER PRÊT</T>
      </Abs>
      <Abs x={1240} y={455} style={{ display: "flex", gap: 28, opacity: prog(f, planAt, 16) }}>
        <T size={20} bold color={C.grey}>
          <span style={{ display: "inline-block", width: 18, height: 18, background: PALE_RED, marginRight: 8 }} />
          plan initial
        </T>
        <T size={20} bold>
          <span style={{ display: "inline-block", width: 18, height: 18, background: C.blue, marginRight: 8 }} />
          notre proposition
        </T>
      </Abs>
      <Abs x={X0} y={ZERO} w={N * STEP * prog(f, planAt - 6, 16)} h={2} style={{ background: C.navy }} />
      {Array.from({ length: N }, (_, i) => {
        const x = X0 + i * STEP;
        const pp = prog(f, planAt + i * 3, 14);
        const pq = prog(f, propAt + i * 3, 14);
        const s1 = PLAN_SOLDE[i];
        const s2 = PROP_SOLDE[i];
        const h1 = s1 === undefined ? 0 : Math.abs(s1) * K * pp;
        const h2 = Math.max(3, Math.abs(s2) * K) * pq;
        return (
          <React.Fragment key={i}>
            {s1 !== undefined ? (
              <Abs x={x + 30} y={s1 < 0 ? ZERO : ZERO - h1} w={86} h={h1} style={{ background: s1 < 0 ? PALE_RED : PALE_GREY }} />
            ) : null}
            <Abs x={x + 126} y={s2 < 0 ? ZERO : ZERO - h2} w={86} h={h2} style={{ background: s2 < 0 ? C.red : C.blue }} />
            <Abs x={x} y={ZERO - 34} w={STEP} style={{ textAlign: "center", opacity: prog(f, planAt, 12) }}>
              <T size={20} bold color={C.grey}>{2027 + i}</T>
            </Abs>
            {s1 !== undefined ? (
              <Abs x={x + 10} y={ZERO + h1 + 6} w={126} style={{ textAlign: "center", opacity: pp }}>
                <T size={18} bold color={C.red} style={{ opacity: 0.6 }}>{fmtK(s1)}</T>
              </Abs>
            ) : null}
            <Abs x={x + 106} y={ZERO + h2 + 6} w={126} style={{ textAlign: "center", opacity: pq }}>
              <T size={18} bold color={C.red}>{fmtK(s2)}</T>
            </Abs>
          </React.Fragment>
        );
      })}
      <Reveal at={negLbl} style={{ position: "absolute", left: X0, top: ZERO - 110, width: N * STEP, textAlign: "center" }}>
        <T size={26} bold color={C.red}>notre proposition : entre −2’483 et −1’025 par an</T>
      </Reveal>
      <Reveal at={vsAt} style={{ position: "absolute", left: X0, top: ZERO + 250, width: N * STEP, textAlign: "center" }}>
        <div style={{ borderTop: `3px solid ${PALE_RED}`, paddingTop: 8 }}>
          <T size={24} bold color={C.red}>plan initial : −178’400 cumulés de 2027 à 2034</T>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 8. Garde-fous
// ===========================================================================
export const GardeFous: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const a = cue("un niveau de trésorerie");
  const b = cue("et une année faible");
  // trésorerie qui fluctue au-dessus d’un plancher
  const level = (i: number) => 150 + 60 * Math.sin((f / 18 + i) * 0.9);
  const weak = prog(f, b + 20, 20);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="La règle de prudence">
        <Hl>Deux garde-fous</Hl> pour l’agence
      </Headline>
      <Reveal at={a} style={{ position: "absolute", left: 120, top: 320 }}>
        <div style={{ width: 800, height: 600, background: C.light, borderRadius: 14, padding: 40, boxSizing: "border-box", position: "relative" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Icon name="shield" size={64} />
            <T title size={40}>Trésorerie minimale</T>
          </div>
          <T size={24} color={C.grey} style={{ marginTop: 10 }}>un plancher fixé ensemble, jamais entamé</T>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 60 + i * 86, bottom: 50, width: 60, height: level(i), background: C.blue, borderRadius: "4px 4px 0 0" }} />
          ))}
          <div style={{ position: "absolute", left: 40, right: 40, bottom: 50 + 80, height: 4, background: `repeating-linear-gradient(90deg, ${C.red} 0 16px, transparent 16px 26px)` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
            <div style={{ width: 40, height: 4, background: `repeating-linear-gradient(90deg, ${C.red} 0 10px, transparent 10px 16px)` }} />
            <T size={20} bold color={C.red}>plancher de trésorerie</T>
          </div>
        </div>
      </Reveal>
      <Reveal at={b} style={{ position: "absolute", left: 1000, top: 320 }}>
        <div style={{ width: 800, height: 600, background: C.light, borderRadius: 14, padding: 40, boxSizing: "border-box", position: "relative" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Icon name="calendar" size={64} />
            <T title size={40}>Souplesse</T>
          </div>
          <T size={24} color={C.grey} style={{ marginTop: 10 }}>une année faible décale le remboursement, sans pénalité</T>
          {Array.from({ length: 6 }, (_, i) => {
            const shift = i >= 2 ? weak * 100 : 0;
            const isWeak = i === 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 50 + i * 100 + shift,
                  top: 300,
                  width: 86,
                  height: 86,
                  borderRadius: 8,
                  background: isWeak ? C.white : C.navy,
                  border: `3px ${isWeak ? "dashed" : "solid"} ${isWeak ? C.red : C.navy}`,
                  opacity: isWeak ? 1 - weak * 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isWeak ? C.red : C.white,
                  fontFamily: FONT_BODY,
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {isWeak ? "faible" : "remb."}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 50, top: 420, opacity: weak, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 22, color: C.blue }}>
            → le remboursement glisse d’un an, sans frais
          </div>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 9. Gouvernance
// ===========================================================================
export const Gouvernance: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const chips: [string, string][] = [
    ["Budget", "Budget"],
    ["RH", "ressources humaines"],
    ["Dividendes", "dividendes, statuts"],
    ["Statuts", "statuts et calendrier"],
    ["Calendrier", "et calendrier"],
  ];
  const dès = cue("Dès deux mille trente-trois");
  const piste = cue("Une première piste");
  const person = (letter: string, color: string, name: string, roles: string, size = 110) => (
    <div style={{ display: "flex", gap: 22, alignItems: "center", marginBottom: 22 }}>
      <Avatar letter={letter} color={color} size={size} />
      <div>
        <T size={30} bold>{name}</T>
        <T size={22} color={C.grey}>{roles}</T>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="Qui décide quoi">
        Capital et direction : <Hl>deux sujets distincts</Hl>
      </Headline>
      <Reveal at={cue("Jusqu'en deux mille trente-deux")} style={{ position: "absolute", left: 120, top: 300 }}>
        <div style={{ width: 960, height: 690, background: C.light, borderRadius: 14, padding: 40, boxSizing: "border-box" }}>
          <T size={24} bold color={C.blue} style={{ letterSpacing: 2, marginBottom: 24 }}>2027 – 2032 · ACCOMPAGNER</T>
          <Reveal at={cue("Yvan reste majoritaire")} dx={-20} dy={0}>
            {person("Y", C.navy, "Yvan · 55 % · majoritaire", "Directeur général · Président du CA")}
          </Reveal>
          <Reveal at={cue("Jérémy est administrateur")} dx={-20} dy={0}>
            {person("J", C.blue, "Jérémy · 45 %", "Administrateur · Directeur adjoint")}
          </Reveal>
          <Reveal at={cue("Budget")}>
            <T size={22} bold color={C.navy} style={{ marginTop: 12, marginBottom: 14 }}>DÉCIDÉ À DEUX</T>
          </Reveal>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {chips.map(([c, k]) => (
              <div key={c} style={{ opacity: prog(f, cue(k), 12), scale: `${0.8 + 0.2 * prog(f, cue(k), 12)}`, background: C.blue, color: C.white, borderRadius: 30, padding: "10px 22px", fontFamily: FONT_BODY, fontWeight: 700, fontSize: 22 }}>
                {c}
              </div>
            ))}
          </div>
          <Reveal at={cue("avec un comité")} style={{ marginTop: 22 }}>
            <div style={{ display: "flex", gap: 30 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Icon name="calendar" size={40} />
                <T size={22} bold>Comité de transition mensuel</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", opacity: prog(f, cue("et une signature"), 12) }}>
                <Icon name="pen" size={40} />
                <T size={22} bold>Signature collective à deux</T>
              </div>
            </div>
          </Reveal>
        </div>
      </Reveal>
      <Reveal at={dès} style={{ position: "absolute", left: 1120, top: 300 }}>
        <div style={{ width: 680, height: 690, background: C.blue, borderRadius: 14, padding: 40, boxSizing: "border-box" }}>
          <T size={24} bold color={C.pale} style={{ letterSpacing: 2, marginBottom: 24 }}>DÈS 2033 · TRANSMETTRE</T>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <Avatar letter="J" color={C.white} size={130} style={{ color: C.blue }} />
            <div>
              <T title size={56} color={C.white}>90 %</T>
              <T size={26} bold color={C.white}>Jérémy majoritaire</T>
            </div>
          </div>
          <Reveal at={piste}>
            <T size={22} bold color={C.pale} style={{ marginTop: 50, letterSpacing: 2 }}>UNE PREMIÈRE PISTE DE TRAVAIL</T>
            <T size={28} bold color={C.white} style={{ marginTop: 12 }}>Jérémy à la direction</T>
            <T size={28} bold color={C.white} style={{ marginTop: 8 }}>Yvan, conseiller stratégique et porteur d’affaires</T>
            <T size={20} color={C.pale} style={{ marginTop: 20 }}>organisation à définir ensemble, le moment venu</T>
          </Reveal>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 10. Calendrier
// ===========================================================================
export const Calendrier: React.FC = () => {
  const cue = useCue();
  const f = useCurrentFrame();
  const X0 = 200;
  const W26 = 260; // 2026 élargie : la phase « Entrer » a besoin de place
  const YW = (1760 - X0 - W26) / 12; // px par année ensuite
  const yx = (y: number) => (y <= 2027 ? X0 + (y - 2026) * W26 : X0 + W26 + (y - 2027) * YW);
  const e = cue("Entrer");
  const a = cue("Accompagner");
  const t = cue("Transmettre");
  const phases = [
    { l: "ENTRER", from: 2026, to: 2027, c: C.navy, at: e },
    { l: "ACCOMPAGNER", from: 2027, to: 2033, c: C.mid, at: a },
    { l: "TRANSMETTRE", from: 2033, to: 2039, c: C.blue, at: t },
  ];
  const head = prog(f, e, 330);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="En résumé">
        Trois temps : <Hl>entrer, accompagner, transmettre</Hl>
      </Headline>
      {phases.map((p) => {
        const pp = prog(f, p.at, 20);
        return (
          <Abs key={p.l} x={yx(p.from)} y={320} w={(yx(p.to) - yx(p.from)) * pp} h={64} style={{ background: p.c, overflow: "hidden", borderRight: `3px solid ${C.white}` }}>
            <div style={{ padding: "16px 24px", fontFamily: FONT_BODY, fontWeight: 700, fontSize: 24, color: C.white, whiteSpace: "nowrap" }}>{p.l}</div>
          </Abs>
        );
      })}
      {/* axe des années */}
      <Abs x={X0} y={420} w={yx(2039) - X0} h={2} style={{ background: C.navy }} />
      {Array.from({ length: 13 }, (_, i) => (
        <Abs key={i} x={yx(2026 + i)} y={430} w={yx(2027 + i) - yx(2026 + i)} style={{ textAlign: "center" }}>
          <T size={19} bold color={C.grey}>{2026 + i}</T>
        </Abs>
      ))}
      {/* part de Jérémy */}
      <Abs x={60} y={505} w={130}>
        <T size={18} bold color={C.grey}>PART DE JÉRÉMY</T>
      </Abs>
      <Abs x={yx(2027)} y={545 - 45 * 0.7} w={6 * YW * prog(f, a - 20, 24)} h={45 * 0.7} style={{ background: C.mid }} />
      <Abs x={yx(2033)} y={545 - 90 * 0.7} w={6 * YW * prog(f, t, 24)} h={90 * 0.7} style={{ background: C.blue }} />
      <Abs x={yx(2027) + 12} y={490} style={{ opacity: prog(f, a - 20, 20) }}>
        <T size={22} bold color={C.mid}>45 %</T>
      </Abs>
      <Abs x={yx(2033) + 12} y={455} style={{ opacity: prog(f, t, 20) }}>
        <T size={22} bold color={C.blue}>90 %</T>
      </Abs>
      {/* prêts */}
      <Abs x={60} y={600} w={130}>
        <T size={18} bold color={C.grey}>PRÊTS VENDEUR</T>
      </Abs>
      <Abs x={yx(2027)} y={600} w={6 * YW * prog(f, cue("premier prêt soldé"), 30)} h={54} style={{ background: C.navy, borderRadius: 6 }} />
      <Abs x={yx(2027) + 16} y={612} style={{ opacity: prog(f, cue("premier prêt soldé"), 20) }}>
        <T size={21} bold color={C.white}>Prêt 1 · 350’000 · soldé fin 2032</T>
      </Abs>
      <Abs x={yx(2033)} y={670} w={6 * YW * prog(f, cue("second prêt soldé"), 30)} h={54} style={{ background: C.blue, borderRadius: 6 }} />
      <Abs x={yx(2033) + 16} y={682} style={{ opacity: prog(f, cue("second prêt soldé"), 20) }}>
        <T size={21} bold color={C.white}>Prêt 2 · 350’000 · soldé fin 2038</T>
      </Abs>
      {/* jalons */}
      {[
        { y: 2026.85, l: "Accord, contrats, AG", at: e },
        { y: 2027, l: "01.01.2027 · entrée 45 %", at: e + 10 },
        { y: 2032.5, l: "2032 · bilan commun", at: cue("premier prêt soldé") + 10 },
        { y: 2033, l: "01.01.2033 · 90 %", at: t },
        { y: 2038.9, l: "Retraite d’Yvan", at: cue("avec la retraite") },
      ].map((m, i) => {
        const p = prog(f, m.at, 16);
        const top = 770 + (i % 2) * 90;
        return (
          <React.Fragment key={m.l}>
            <Abs x={yx(m.y) - 1} y={420} w={2} h={(top - 420) * p} style={{ background: C.rule }} />
            <Abs x={yx(m.y) - 10} y={top - 10} w={20} h={20} style={{ borderRadius: 10, background: C.blue, opacity: p }} />
            <Abs x={Math.min(yx(m.y) + 18, 1560)} y={top - 16} style={{ opacity: p }}>
              <T size={22} bold>{m.l}</T>
            </Abs>
          </React.Fragment>
        );
      })}
      {/* tête de lecture */}
      <Abs x={X0 + (yx(2039) - X0) * head - 2} y={300} w={4} h={460} style={{ background: C.red, opacity: head > 0 && head < 1 ? 0.6 : 0 }} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 11. Prochaines étapes + carte de fin
// ===========================================================================
export const Etapes: React.FC<{ endAt: number }> = ({ endAt }) => {
  const cue = useCue();
  const f = useCurrentFrame();
  const steps: [Parameters<typeof Icon>[0]["name"], string, string, string][] = [
    ["handshake", "Valider ensemble les principes", "aujourd’hui", "valider ensemble"],
    ["doc", "Mettre à jour convention d’actionnaires, convention de vente et contrat de prêt", "d’ici fin 2026", "mettre à jour"],
    ["check", "Relecture par la fiduciaire et un notaire", "d’ici fin 2026", "les faire relire"],
    ["people", "AG extraordinaire : split d’actions et statuts", "d’ici fin 2026", "et tenir l'assemblée"],
    ["pen", "Signature et entrée au capital", "1er janvier 2027", "L'objectif"],
  ];
  const end = prog(f, endAt, 24);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Headline kicker="Pour conclure">
        Objectif : <Hl>signer avant le 1er janvier 2027</Hl>
      </Headline>
      <Abs x={163} y={330} w={4} h={560 * prog(f, cue("valider ensemble"), 120)} style={{ background: C.rule }} />
      {steps.map(([icon, label, when, k], i) => {
        const at = cue(k);
        const last = i === steps.length - 1;
        return (
          <Reveal key={label} at={at} dx={-30} dy={0} style={{ position: "absolute", left: 120, top: 320 + i * 120 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ width: 90, height: 90, borderRadius: 45, background: last ? C.blue : C.light, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={icon} size={50} color={last ? C.white : C.blue} />
              </div>
              <div>
                <T size={20} bold color={C.blue} style={{ letterSpacing: 1.5 }}>{when.toUpperCase()}</T>
                <T size={30} bold={last} style={{ maxWidth: 1000 }}>{label}</T>
              </div>
            </div>
          </Reveal>
        );
      })}
      <Reveal at={cue("L'objectif")} style={{ position: "absolute", left: 1350, top: 400 }}>
        <div style={{ width: 450, height: 420, borderRadius: 16, background: C.blue, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Icon name="calendar" size={90} color={C.white} />
          <T title size={84} color={C.white}>01.01.2027</T>
          <T size={26} bold color={C.pale}>signature et entrée au capital</T>
        </div>
      </Reveal>
      {/* carte de fin */}
      <AbsoluteFill style={{ background: C.blue, clipPath: `inset(0 ${(1 - end) * 100}% 0 0)` }}>
        <Abs x={120} y={380} style={{ opacity: prog(f, endAt + 12, 20) }}>
          <T size={26} bold color={C.pale} style={{ letterSpacing: 3 }}>BOOMERANG MARKETING SA · PROPOSITION DE REPRISE</T>
          <T title size={96} color={C.white} style={{ marginTop: 16 }}>Échanges et questions</T>
        </Abs>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
