import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_TITLE, px } from "./theme";
import {
  Big,
  Body,
  Box,
  Bullet,
  chf,
  CountUp,
  Footer,
  Label,
  prog,
  Reveal,
  SlideFrame,
  useCue,
} from "./kit";

const S1 = "01 · Point de départ";
const S2 = "02 · Le plan proposé et son test";
const S3 = "03 · Notre proposition";
const S4 = "04 · Gouvernance et transition";
const S5 = "05 · Prochaines étapes";

// ===========================================================================
// Couverture
// ===========================================================================
export const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const bar = prog(frame, 0, 30);
  const center: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  };
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div style={{ position: "absolute", top: 0, left: 0, height: px(18), width: `${bar * 100}%`, background: C.blue }} />
      <Reveal at={6} style={{ ...center, top: px(214) }}>
        <Label color={C.grey} size={19} style={{ letterSpacing: 0.5 }}>
          Dossier de discussion
        </Label>
      </Reveal>
      <Reveal at={cue("Proposition de reprise")} style={{ ...center, top: px(262) }}>
        <Big size={62} style={{ letterSpacing: 0.5 }}>PROPOSITION DE REPRISE</Big>
      </Reveal>
      <Reveal at={cue("et plan de financement")} style={{ ...center, top: px(342) }}>
        <Big size={62} style={{ letterSpacing: 0.5 }}>ET PLAN DE FINANCEMENT</Big>
      </Reveal>
      <Reveal at={cue("Une projection")} style={{ ...center, top: px(436) }}>
        <Body size={27}>Boomerang Marketing SA · Projection 2027–2037</Body>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Sommaire
// ===========================================================================
const SOMMAIRE: [string, string, string][] = [
  ["01", "Point de départ", "Le point de départ"],
  ["02", "Le plan proposé et son test", "Le plan proposé"],
  ["03", "Notre proposition", "Notre proposition"],
  ["04", "Gouvernance et transition", "La gouvernance"],
  ["05", "Prochaines étapes", "les prochaines étapes"],
];
export const Sommaire: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Reveal at={2} dx={-30} dy={0}>
        <Box x={104} y={58}>
          <Big size={40}>Sommaire</Big>
        </Box>
      </Reveal>
      <Box x={104} y={164} w={1114 * prog(frame, 6, 30)} h={2} style={{ height: 2, background: C.blue }} />
      {SOMMAIRE.map(([n, t, k], i) => {
        const at = cue(k);
        return (
          <React.Fragment key={n}>
            <Reveal at={at} dx={-24} dy={0}>
              <Box x={104} y={203 + i * 66} style={{ display: "flex", alignItems: "baseline" }}>
                <Big size={30} style={{ width: px(95) }}>{n}</Big>
                <Body size={25}>{t}</Body>
              </Box>
            </Reveal>
            <Box
              x={104}
              y={252 + i * 66}
              w={850 * prog(frame, at, 24)}
              style={{ height: 2, background: C.rule }}
            />
          </React.Fragment>
        );
      })}
      <Footer page={2} section="" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Séparateur de partie
// ===========================================================================
export const Divider: React.FC<{ num: string; title: string; page: number }> = ({ num, title, page }) => {
  const frame = useCurrentFrame();
  const bar = prog(frame, 0, 22);
  return (
    <AbsoluteFill style={{ background: C.light }}>
      <Box x={104} y={236} w={9} h={215 * bar} style={{ background: C.blue }} />
      <Reveal at={6} dx={-40} dy={0}>
        <Box x={149} y={246}>
          <Big size={70}>{num}</Big>
        </Box>
      </Reveal>
      <Reveal at={12} dx={-40} dy={0}>
        <Box x={149} y={336}>
          <Big size={62} color={C.navy}>{title}</Big>
        </Box>
      </Reveal>
      <Footer page={page} section="" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 01 — Le cadre été 2026
// ===========================================================================
export const Cadre: React.FC = () => {
  const cue = useCue();
  const left: [string, string, string][] = [
    ["Prix de référence", "CHF 10’000 par action, soit 1 M pour 100 %", "Un prix de référence"],
    ["Vente directe", "d’actions entre personnes privées", "Une vente directe"],
    ["Prêt vendeur", "à taux préférentiel", "Un prêt vendeur"],
    ["Remboursement", "par les dividendes", "remboursé par les dividendes"],
    ["Entrée progressive", "majorité visée en 2032", "Et une entrée progressive"],
  ];
  const right: [string, string | undefined, string][] = [
    ["Convention d’actionnaires", "Point à préciser et finaliser", "la convention d'actionnaires"],
    ["Rythme d’entrée", "au capital et financement", "le rythme d'entrée"],
    ["Politique de dividendes", undefined, "la politique de dividendes"],
    ["Rôles et gouvernance", "de la transition", "les rôles et la gouvernance"],
    ["Calendrier", "jusqu’à la transmission", "et le calendrier"],
  ];
  const restent = cue("Restent à préciser");
  return (
    <SlideFrame title="Le cadre été 2026" subtitle="La proposition part de ce qui est déjà posé." page={4} section={S1}>
      <Reveal at={10}>
        <Box x={104} y={225} w={542} h={430} style={{ background: C.light, padding: `${px(30)}px ${px(28)}px`, boxSizing: "border-box" }}>
          <Label size={18} style={{ marginBottom: px(14) }}>Ce qui est posé</Label>
          {left.map(([h, d, k]) => (
            <Reveal key={h} at={cue(k)} dx={-20} dy={0}>
              <Bullet head={h} detail={d} />
            </Reveal>
          ))}
        </Box>
      </Reveal>
      <Reveal at={restent}>
        <Box x={676} y={225} w={542} h={430} style={{ background: C.light, padding: `${px(30)}px ${px(28)}px`, boxSizing: "border-box" }}>
          <Label size={18} style={{ marginBottom: px(14) }}>Ce qui reste à préciser</Label>
          {right.map(([h, d, k]) => (
            <Reveal key={h} at={cue(k)} dx={-20} dy={0}>
              <Bullet head={h} detail={d} />
            </Reveal>
          ))}
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 01 — La valeur de Boomerang
// ===========================================================================
export const Valeur: React.FC = () => {
  const cue = useCue();
  const m = (d: number) => (v: number) => `${v.toFixed(d).replace(".", ",")} M`;
  const cards = [
    { v: 1.28, f: "1,28 M", d: 2, l: "Valeur de rendement", t: "Bénéfices des dix dernières années capitalisés à 10 %.", k: "la valeur de rendement" },
    { v: 0.466, f: "0,466 M", d: 3, l: "Valeur substantielle", t: "Fonds propres libérés, moins le dividende de l’année.", k: "La valeur substantielle" },
    { v: 1.0, f: "1,00 M", d: 2, l: "Valeur fiscale", t: "Moyenne pondérée : deux fois le rendement, une fois la substance.", k: "La valeur fiscale" },
    { v: 1.0, f: "1,00 M", d: 2, l: "Prix de référence", t: "CHF 10’000 par action avant split.", k: "Le prix de référence", fill: true },
  ];
  return (
    <SlideFrame title="La valeur de Boomerang" subtitle="Méthode des praticiens" page={9} section={S1}>
      {cards.map((c, i) => {
        const at = cue(c.k);
        const fg = c.fill ? C.white : C.blue;
        return (
          <Reveal key={c.l} at={at}>
            <Box
              x={104 + i * 284.7}
              y={225}
              w={261}
              h={275}
              style={{
                background: c.fill ? C.blue : C.white,
                border: c.fill ? "none" : `2px solid ${C.blue}`,
                padding: `${px(32)}px ${px(22)}px`,
                boxSizing: "border-box",
              }}
            >
              <Big size={54} color={fg}>
                <CountUp at={at} to={c.v} final={c.f} format={m(c.d)} />
              </Big>
              <Label size={16} color={c.fill ? C.white : C.navy} style={{ marginTop: px(24), marginBottom: px(8) }}>
                {c.l}
              </Label>
              <Body size={15} color={c.fill ? C.white : C.navy}>{c.t}</Body>
            </Box>
          </Reveal>
        );
      })}
      <Reveal at={cue("reste donc la base")}>
        <Box x={104} y={540}>
          <Body size={22} style={{ fontWeight: 700 }}>Le prix de référence de 1M reste la base de discussion.</Body>
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// Tableau générique
// ===========================================================================
type Col = { h: string; w: number; align?: "left" | "right" | "center" };
const Table: React.FC<{
  x: number;
  y: number;
  cols: Col[];
  rows: React.ReactNode[][];
  rowAt: (i: number) => number;
  rowBg: (i: number) => string;
  headH?: number;
  rowH?: number;
  size?: number;
  headAt?: number;
}> = ({ x, y, cols, rows, rowAt, rowBg, headH = 44, rowH = 36, size = 15, headAt = 8 }) => {
  return (
    <Box x={x} y={y}>
      <Reveal at={headAt} dy={0}>
        <div style={{ display: "flex", height: px(headH), gap: 2 }}>
          {cols.map((c) => (
            <div
              key={c.h}
              style={{
                width: px(c.w),
                background: C.blue,
                color: C.white,
                fontFamily: FONT_BODY,
                fontWeight: 700,
                fontSize: px(size),
                display: "flex",
                alignItems: "center",
                justifyContent: c.align === "left" ? "flex-start" : c.align === "center" ? "center" : "flex-end",
                textAlign: c.align ?? "right",
                padding: `0 ${px(10)}px`,
                boxSizing: "border-box",
                lineHeight: 1.1,
              }}
            >
              {c.h}
            </div>
          ))}
        </div>
      </Reveal>
      {rows.map((r, i) => (
        <Reveal key={i} at={rowAt(i)} dx={-16} dy={0} dur={12}>
          <div style={{ display: "flex", height: px(rowH), gap: 2, marginTop: 2 }}>
            {r.map((cell, j) => (
              <div
                key={j}
                style={{
                  width: px(cols[j].w),
                  background: rowBg(i),
                  fontFamily: FONT_BODY,
                  fontSize: px(size),
                  color: C.navy,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    cols[j].align === "left" ? "flex-start" : cols[j].align === "center" ? "center" : "flex-end",
                  padding: `0 ${px(10)}px`,
                  boxSizing: "border-box",
                  fontWeight: j === 0 ? 700 : 400,
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </Box>
  );
};

const spread = (from: number, to: number, n: number) => (i: number) =>
  Math.round(from + ((to - from) * i) / Math.max(1, n - 1));

const Neg: React.FC<{ v: string }> = ({ v }) => (
  <span style={{ color: v.startsWith("−") ? C.red : C.navy, fontWeight: 700 }}>{v}</span>
);
const Small: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: "0.7em", color: C.grey, marginLeft: 4 }}>{children}</span>
);

// ===========================================================================
// 02 — Le plan proposé
// ===========================================================================
export const PlanPropose: React.FC = () => {
  const cue = useCue();
  const years = Array.from({ length: 11 }, (_, i) => 2027 + i);
  const rows = years.map((y, i) => {
    const tranche = i % 2 === 0 && y <= 2035;
    const cum = Math.min(100, (Math.floor(i / 2) + 1) * 20);
    return [
      String(y),
      tranche ? <b>20 %</b> : "—",
      `${cum} %`,
      tranche ? "40’000" : "—",
      tranche ? "160’000" : "—",
      y <= 2036 ? "80’000" : "—",
    ];
  });
  const at = spread(cue("des tranches de vingt"), cue("Résultat"), rows.length);
  const res = cue("Résultat");
  return (
    <SlideFrame title="Le plan proposé" subtitle="Des tranches de 20 % tous les deux ans, au prix de référence." page={6} section={S2}>
      <Table
        x={104}
        y={190}
        cols={[
          { h: "Année", w: 86, align: "left" },
          { h: "Nouvelle part", w: 123, align: "center" },
          { h: "Part cumulée", w: 115, align: "center" },
          { h: "Apport cash", w: 130 },
          { h: "Prêt vendeur", w: 129 },
          { h: "Remb. annuel", w: 136 },
        ]}
        rows={rows}
        rowAt={at}
        rowBg={(i) => (i === 10 ? C.white : i % 2 === 0 ? C.rowAlt : C.light)}
      />
      <Reveal at={res}>
        <Box x={859} y={190} w={359} h={220} style={{ background: C.blue, padding: `${px(28)}px ${px(30)}px`, boxSizing: "border-box" }}>
          <Big size={56} color={C.white}>
            <CountUp at={res} to={80000} final="80’000" format={chf} />
          </Big>
          <Body size={19} color={C.white} style={{ fontWeight: 700, marginTop: px(14) }}>
            à rembourser chaque année,
            <br />
            de 2027 à 2036.
          </Body>
        </Box>
      </Reveal>
      <Reveal at={cue("Cinq tranches")}>
        <Box x={859} y={435} w={359} h={197} style={{ background: C.light, padding: `${px(24)}px ${px(30)}px`, boxSizing: "border-box" }}>
          <Label size={17} style={{ marginBottom: px(10) }}>Le principe</Label>
          <Body size={18}>
            Cinq tranches de CHF 200’000 : 40’000 d’apport cash et 160’000 de prêt vendeur, remboursé sur deux ans.
          </Body>
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 02 — Les hypothèses
// ===========================================================================
export const Hypotheses: React.FC = () => {
  const cue = useCue();
  const cards = [
    { big: "1M", l: "Valeur de référence", t: "Pour 100 % du capital, soit 10’000 par action.", k: "Une valeur de référence" },
    { big: "150’000", l: "Distribués par an 2027–2032", t: "100’000 de bénéfice et 50’000 prélevés sur les réserves.", k: "Cent cinquante mille" },
    { big: "120’000", l: "Distribués par an dès 2033", t: "Le bénéfice annuel seul, une fois les réserves utilisées.", k: "Puis cent vingt mille" },
    { big: "0,5 %", l: "Taux du prêt vendeur", t: "Intérêts calculés sur le solde restant dû.", k: "Le prêt vendeur porte" },
  ];
  const res = cue("Côté réserves");
  const rows: [string, string, boolean][] = [
    ["Bénéfice reporté au moment de la transaction", "363’000", false],
    ["Bénéfices 2027–2032 (6 × 100’000)", "+ 600’000", false],
    ["Dividendes 2027–2032 (6 × 150’000)", "− 900’000", false],
    ["Bénéfice reporté fin 2032", "63’000", true],
  ];
  const others: [string, string][] = [
    ["Tranches suivantes : 20 % d’apport cash, le solde en prêt vendeur.", "Le bénéfice retenu"],
    ["Dividendes partiellement imposés (participation qualifiée), impôts estimés par la fiduciaire.", "Et les dividendes sont partiellement"],
    ["Dividende perçu dès l’année d’acquisition (2027).", "Et les dividendes sont partiellement"],
    ["Bénéfice prudent : 100’000 par an, contre 179’000 en 2025.", "Le bénéfice retenu"],
  ];
  return (
    <SlideFrame title="Les hypothèses" page={7} section={S2}>
      {cards.map((c, i) => (
        <Reveal key={c.l} at={cue(c.k)}>
          <Box x={104 + i * 284.7} y={190} w={261} h={195} style={{ border: `2px solid ${C.blue}`, padding: `${px(22)}px ${px(22)}px`, boxSizing: "border-box", background: C.white }}>
            <Big size={42}>{c.big}</Big>
            <Label size={15} color={C.navy} style={{ marginTop: px(14), marginBottom: px(6) }}>{c.l}</Label>
            <Body size={14}>{c.t}</Body>
          </Box>
        </Reveal>
      ))}
      <Box x={104} y={415} w={639}>
        <Reveal at={res} dy={0}>
          <div style={{ display: "flex", height: px(46), background: C.blue, color: C.white, fontWeight: 700, fontSize: px(16), alignItems: "center", justifyContent: "space-between", padding: `0 ${px(10)}px` }}>
            <span>Évolution du bénéfice reporté</span>
            <span>CHF</span>
          </div>
        </Reveal>
        {rows.map(([a, b, bold], i) => (
          <Reveal key={a} at={res + 8 + i * 14} dx={-16} dy={0} dur={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: px(46),
                marginTop: 2,
                padding: `0 ${px(10)}px`,
                background: i % 2 === 1 || bold ? C.light : C.white,
                fontSize: px(17),
                fontWeight: bold ? 700 : 400,
                color: C.navy,
              }}
            >
              <span>{a}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{b}</span>
            </div>
          </Reveal>
        ))}
      </Box>
      <Reveal at={cue("Le bénéfice retenu")}>
        <Box x={774} y={415} w={444} h={235} style={{ background: C.light, padding: `${px(20)}px ${px(24)}px`, boxSizing: "border-box" }}>
          <Label size={19} style={{ marginBottom: px(10) }}>Autres hypothèses</Label>
          {others.map(([t, k]) => (
            <Reveal key={t} at={cue(k)} dy={10}>
              <div style={{ display: "flex", gap: px(10), marginBottom: px(4) }}>
                <span style={{ color: C.blue, fontSize: px(15) }}>•</span>
                <Body size={15}>{t}</Body>
              </div>
            </Reveal>
          ))}
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 02 — Test de soutenabilité
// ===========================================================================
const TEST: [number, string, string, string, string, string, string, string, string][] = [
  [2027, "20 %", "150’000", "100k + 50k", "30’000", "80’000", "3’700", "800", "−54’500"],
  [2028, "20 %", "150’000", "100k + 50k", "30’000", "80’000", "3’700", "400", "−54’100"],
  [2029, "40 %", "150’000", "100k + 50k", "60’000", "80’000", "8’300", "800", "−29’100"],
  [2030, "40 %", "150’000", "100k + 50k", "60’000", "80’000", "8’300", "400", "−28’700"],
  [2031, "60 %", "150’000", "100k + 50k", "90’000", "80’000", "14’600", "800", "−5’400"],
  [2032, "60 %", "150’000", "100k + 50k", "90’000", "80’000", "14’600", "400", "−5’000"],
  [2033, "80 %", "120’000", "120k + 0", "96’000", "80’000", "16’200", "800", "−1’000"],
  [2034, "80 %", "120’000", "120k + 0", "96’000", "80’000", "16’200", "400", "−600"],
  [2035, "100 %", "120’000", "120k + 0", "120’000", "80’000", "22’200", "800", "17’000"],
  [2036, "100 %", "120’000", "120k + 0", "120’000", "80’000", "22’200", "400", "17’400"],
  [2037, "100 %", "120’000", "120k + 0", "120’000", "—", "22’200", "—", "97’800"],
];
export const Test: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const at = spread(cue("Vient ensuite"), cue("Jusqu'en deux mille trente-quatre"), TEST.length);
  const deficit = cue("Le déficit cumulé");
  const zoneAt = cue("Jusqu'en deux mille trente-quatre");
  const zone = prog(frame, zoneAt, 20);
  return (
    <SlideFrame title="Test de soutenabilité" subtitle="Le plan proposé, avec les dividendes, les impôts et les intérêts." page={8} section={S2}>
      <Table
        x={104}
        y={190}
        cols={[
          { h: "Année", w: 73, align: "left" },
          { h: "Part", w: 74, align: "center" },
          { h: "Distribution totale", w: 170 },
          { h: "Dividendes", w: 108 },
          { h: "Remb. prêt", w: 98 },
          { h: "Impôts", w: 90 },
          { h: "Intérêts", w: 81 },
          { h: "Solde", w: 122 },
        ]}
        rows={TEST.map((r) => [
          String(r[0]),
          r[1],
          <>
            {r[2]}
            <Small>({r[3]})</Small>
          </>,
          r[4],
          r[5],
          r[6],
          r[7],
          <Neg v={r[8]} />,
        ])}
        rowAt={at}
        rowH={33}
        rowBg={(i) => (i % 2 === 0 ? C.white : C.light)}
      />
      {/* Zone 2027–2034 : les dividendes ne couvrent pas le remboursement */}
      <Box
        x={0}
        y={0}
        w={122}
        style={{ left: px(104) + px(816 - 122) + 14, top: px(190 + 44) + 2, height: (px(33) + 2) * 8 * zone, border: `3px solid ${C.red}`, opacity: zone, boxSizing: "border-box", borderRadius: 4 }}
      />
      <Reveal at={cue("Vient ensuite") + 20}>
        <Box x={104} y={632}>
          <Body size={13} color={C.grey}>
            Distribution totale = bénéfice + réserves. Dividendes = part × distribution.
            <br />
            Solde = dividendes − remboursement − impôts − intérêts. Apports couverts par les fonds privés.
          </Body>
        </Box>
      </Reveal>
      <Reveal at={deficit}>
        <Box x={959} y={190} w={259} h={230} style={{ background: C.blue, padding: `${px(24)}px ${px(24)}px`, boxSizing: "border-box" }}>
          <Big size={44} color={C.white}>
            <CountUp at={deficit} to={178400} final="−178’400" format={(v) => `−${chf(v)}`} dur={40} />
          </Big>
          <Body size={19} color={C.white} style={{ fontWeight: 700, marginTop: px(14) }}>
            Déficit cumulé de 2027 à 2034, même avec 200’000 de fonds privés.
          </Body>
        </Box>
      </Reveal>
      <Reveal at={cue("Conclusion")}>
        <Box x={959} y={440} w={259} h={225} style={{ background: C.light, padding: `${px(22)}px ${px(24)}px`, boxSizing: "border-box" }}>
          <Label size={17} style={{ marginBottom: px(10) }}>Conclusion</Label>
          <Body size={18}>
            Jusqu’en 2034, les dividendes ne couvrent pas 80’000 de remboursement par an : le plan n’est pas soutenable en l’état.
          </Body>
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 03 — Analyse complémentaire par Bonvesting
// ===========================================================================
export const Bonvesting: React.FC = () => {
  const cue = useCue();
  const cards = [
    { n: "01", l: "Capacité", t: "Analyse sur dix ans : revenus, impôts et remboursements, avec des hypothèses prudentes.", k: "La capacité" },
    { n: "02", l: "Valorisation", t: "Une approche d’investisseur, qui intègre les risques futurs de l’agence.", k: "La valorisation" },
    { n: "03", l: "Financement", t: "Plusieurs scénarios testés avec les mêmes hypothèses : dividendes, impôts et intérêts.", k: "Et le financement" },
  ];
  const frame = useCurrentFrame();
  // la carte « active » suit la voix
  const active = cards.reduce((acc, c, i) => (frame >= cue(c.k) ? i : acc), 0);
  return (
    <SlideFrame title="Analyse complémentaire par Bonvesting" page={5} section={S3}>
      {cards.map((c, i) => {
        const on = i === active;
        const fg = on ? C.white : C.navy;
        return (
          <Reveal key={c.n} at={cue(c.k)}>
            <Box
              x={104 + i * 381.5}
              y={240}
              w={351}
              h={370}
              style={{ background: on ? C.blue : C.light, padding: `${px(34)}px ${px(30)}px`, boxSizing: "border-box" }}
            >
              <Big size={48} color={on ? C.white : C.blue}>{c.n}</Big>
              <Label size={22} color={fg} style={{ marginTop: px(22), marginBottom: px(10) }}>{c.l}</Label>
              <Body size={19} color={fg}>{c.t}</Body>
            </Box>
          </Reveal>
        );
      })}
    </SlideFrame>
  );
};

// ===========================================================================
// 03 — Les facteurs à prendre en compte
// ===========================================================================
export const Facteurs: React.FC = () => {
  const cue = useCue();
  const rows: [string, string, string][] = [
    ["Déménagement et charges fixes", "Impact du nouveau loyer sur les charges d’exploitation.", "Le déménagement"],
    ["Conjoncture et marché", "Évolution des besoins et des habitudes des clients, y compris avec l’IA, et effets possibles sur la demande et les marges.", "La conjoncture"],
    ["Continuité du réseau", "Après ton départ, une partie du réseau relationnel pourrait ne pas suivre automatiquement, d’où l’importance de la transition.", "La continuité du réseau"],
    ["Qualité du chiffre d’affaires", "Part récurrente et sûre, par rapport à la part variable ou liée à des relations spécifiques.", "La qualité du chiffre"],
    ["Cotisation LPP", "Nouveau taux à 23 % (3 personnes – à confirmer).", "Et la cotisation LPP"],
  ];
  return (
    <SlideFrame title="Les facteurs à prendre en compte" subtitle="Les risques futurs, intégrés à l’analyse." page={10} section={S3}>
      <Box x={104} y={226} w={1114}>
        <Reveal at={8} dy={0}>
          <div style={{ display: "flex", height: px(54), background: C.blue, color: C.white, fontWeight: 700, fontSize: px(18), alignItems: "center" }}>
            <div style={{ width: px(318), padding: `0 ${px(10)}px` }}>Facteur analysé</div>
            <div style={{ padding: `0 ${px(10)}px` }}>Éléments pris en considération</div>
          </div>
        </Reveal>
        {rows.map(([a, b, k], i) => (
          <Reveal key={a} at={cue(k)} dx={-16} dy={0}>
            <div style={{ display: "flex", minHeight: px(62), alignItems: "center", background: i % 2 === 1 ? C.light : C.white, color: C.navy }}>
              <div style={{ width: px(318), padding: `0 ${px(10)}px`, fontWeight: 700, fontSize: px(18) }}>{a}</div>
              <div style={{ flex: 1, padding: `${px(6)}px ${px(10)}px`, fontSize: px(18), lineHeight: 1.3 }}>{b}</div>
            </div>
          </Reveal>
        ))}
      </Box>
    </SlideFrame>
  );
};

// ===========================================================================
// 03 — Une entrée à 45 % en 2027
// ===========================================================================
export const Entree45: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const big = cue("Soit quatre cent cinquante");
  const fonds = cue("Cent mille francs de fonds");
  const pret = cue("Et un prêt vendeur");
  const pF = prog(frame, fonds, 22);
  const pP = prog(frame, pret, 30);
  return (
    <SlideFrame title="Une entrée à 45 % en 2027" subtitle="Financée en partie par des fonds privés." page={12} section={S3}>
      <Reveal at={big}>
        <Box x={104} y={262}>
          <Big size={68} color={C.navy}>
            CHF <CountUp at={big} to={450000} final="450’000" format={chf} />
          </Big>
        </Box>
      </Reveal>
      <Reveal at={cue("Notre proposition")}>
        <Box x={104} y={360} w={520}>
          <Body size={21}>pour 45 % du capital, au 1er janvier 2027, au prix de référence.</Body>
        </Box>
      </Reveal>
      {/* barre de financement 100k / 350k */}
      <Box x={104} y={450} w={112 * pF} h={28} style={{ background: C.blue }} />
      <Box x={222} y={450} w={392 * pP} h={28} style={{ background: C.navy }} />
      <Reveal at={pret}>
        <Box x={104} y={490} style={{ display: "flex", gap: px(28) }}>
          <Body size={15}><span style={{ color: C.blue }}>■</span> Fonds privés</Body>
          <Body size={15}><span style={{ color: C.navy }}>■</span> Prêt vendeur</Body>
        </Box>
      </Reveal>
      <Reveal at={fonds}>
        <Box x={674} y={215} w={544} h={145} style={{ background: C.light, padding: `${px(28)}px ${px(26)}px`, boxSizing: "border-box" }}>
          <Label size={19} style={{ marginBottom: px(10) }}>Fonds privés · CHF 100’000</Label>
          <Body size={19}>Versés directement à la signature.</Body>
        </Box>
      </Reveal>
      <Reveal at={pret}>
        <Box x={674} y={385} w={544} h={145} style={{ background: C.light, padding: `${px(28)}px ${px(26)}px`, boxSizing: "border-box" }}>
          <Label size={19} style={{ marginBottom: px(10) }}>Prêt vendeur · CHF 350’000</Label>
          <Body size={19}>≈ 58’300 par an sur six ans, soldé fin 2032, au taux convenu.</Body>
        </Box>
      </Reveal>
      <Reveal at={cue("Yvan reste majoritaire")}>
        <Box x={104} y={570} w={1114} h={95} style={{ background: C.navy, padding: `${px(20)}px ${px(30)}px`, boxSizing: "border-box" }}>
          <Label size={16} color={C.pale} style={{ marginBottom: px(8) }}>Tu restes majoritaire jusqu’en 2032</Label>
          <Body size={19} color={C.white}>Directeur général et président du CA, avec les grandes décisions prises à deux.</Body>
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 03 — Un financement échelonné
// ===========================================================================
const ECH: [number, string, string, string, string, string, string, string, string, string, string][] = [
  [2027, "45 % · 450’000", "45 %", "150’000", "100k + 50k", "67’500", "100’000", "350’000", "58’333", "11’650", "−2’483"],
  [2028, "—", "45 %", "150’000", "100k + 50k", "67’500", "—", "—", "58’333", "11’358", "−2’192"],
  [2029, "—", "45 %", "150’000", "100k + 50k", "67’500", "—", "—", "58’333", "11’067", "−1’900"],
  [2030, "—", "45 %", "150’000", "100k + 50k", "67’500", "—", "—", "58’333", "10’775", "−1’608"],
  [2031, "—", "45 %", "150’000", "100k + 50k", "67’500", "—", "—", "58’333", "10’483", "−1’317"],
  [2032, "—", "45 %", "150’000", "100k + 50k", "67’500", "—", "—", "58’333", "10’192", "−1’025"],
  [2033, "45 % · 450’000", "90 %", "100’000", "100k + 0", "90’000", "100’000", "350’000", "58’333", "16’350", "15’317"],
  [2034, "—", "90 %", "100’000", "100k + 0", "90’000", "—", "—", "58’333", "16’058", "15’608"],
  [2035, "—", "90 %", "100’000", "100k + 0", "90’000", "—", "—", "58’333", "15’767", "15’900"],
  [2036, "—", "90 %", "100’000", "100k + 0", "90’000", "—", "—", "58’333", "15’475", "16’192"],
  [2037, "—", "90 %", "100’000", "100k + 0", "90’000", "—", "—", "58’333", "15’183", "16’483"],
  [2038, "—", "90 %", "100’000", "100k + 0", "90’000", "—", "—", "58’333", "14’892", "16’775"],
];
export const Echelonne: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const a1 = spread(cue("Le financement"), cue("De deux mille vingt-sept à deux mille trente-deux"), 6);
  const a2 = spread(cue("Au premier janvier deux mille trente-trois"), cue("Le solde devient alors"), 6);
  const at = (i: number) => (i < 6 ? a1(i) : a2(i - 6));
  const hl = prog(frame, cue("Le solde devient alors"), 20);
  return (
    <SlideFrame title="Un financement échelonné" subtitle="Deux tranches de 45 %, financées de la même manière." page={13} section={S3}>
      <Table
        x={110}
        y={202}
        size={14}
        rowH={28}
        headH={42}
        cols={[
          { h: "Année", w: 77, align: "left" },
          { h: "Acquisition", w: 140, align: "left" },
          { h: "Part", w: 72, align: "center" },
          { h: "Distribution totale", w: 150 },
          { h: "Dividendes", w: 105 },
          { h: "Apport cash", w: 100 },
          { h: "Prêt contracté", w: 100 },
          { h: "Remb. annuel", w: 100 },
          { h: "Impôts + intérêts", w: 128 },
          { h: "Solde", w: 128 },
        ]}
        rows={ECH.map((r) => [
          String(r[0]),
          r[1] === "—" ? "—" : <b>{r[1]}</b>,
          r[2],
          <>
            {r[3]}
            <Small>({r[4]})</Small>
          </>,
          r[5],
          r[6],
          r[7],
          r[8],
          r[9],
          <Neg v={r[10]} />,
        ])}
        rowAt={at}
        rowBg={(i) => (i === 0 || i === 6 ? C.rowAlt : i % 2 === 0 ? C.white : C.light)}
      />
      {/* les soldes deviennent positifs dès 2033 */}
      <Box
        x={0}
        y={0}
        w={128}
        style={{ left: px(110) + px(1100 - 128) + 18, top: px(202 + 42) + 2 + (px(28) + 2) * 6, height: (px(28) + 2) * 6 * hl, border: `3px solid ${C.blue}`, opacity: hl, boxSizing: "border-box", borderRadius: 4 }}
      />
      <Reveal at={cue("Le solde devient alors")}>
        <Box x={110} y={636} style={{ display: "flex", gap: px(30) }}>
          <Body size={16}>
            <b style={{ color: C.red }}>2027–2032</b> : solde entre −2’483 et −1’025
          </Body>
          <Body size={16}>
            <b style={{ color: C.blue }}>Dès 2033</b> : solde positif, jusqu’à 16’775 en 2038
          </Body>
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 03 — Dividendes et prudence
// ===========================================================================
export const Dividendes: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const cards = [
    { n: "01", l: "Bénéfice annuel", t: "Le bénéfice de l’année est distribué en dividende.", k: "Le bénéfice de l'année" },
    { n: "02", l: "Réserves", t: "≈ 50’000 par an sur les bénéfices reportés, jusqu’en 2032.", k: "Environ cinquante mille" },
    { n: "03", l: "Prudence", t: "Un niveau de trésorerie minimal, fixé ensemble.", k: "Un niveau de trésorerie" },
    { n: "04", l: "Souplesse", t: "Une année faible décale le remboursement, sans pénalité.", k: "Et une année faible" },
  ];
  const hyp = cue("Hypothèse de travail");
  const yv = cue("Soit environ quatre-vingt-deux");
  const je = cue("et soixante-sept mille");
  const am = cue("face à un amortissement");
  const W = 1050;
  const pY = prog(frame, yv, 24);
  const pJ = prog(frame, je, 24);
  const pA = prog(frame, am, 20);
  return (
    <SlideFrame title="Dividendes et prudence" subtitle="Rembourser par les résultats, sans fragiliser l’agence." page={15} section={S3}>
      {cards.map((c, i) => (
        <Reveal key={c.n} at={cue(c.k)}>
          <Box x={104 + i * 284.7} y={200} w={261} h={210} style={{ background: C.light, padding: `${px(22)}px ${px(24)}px`, boxSizing: "border-box" }}>
            <Big size={38}>{c.n}</Big>
            <Label size={17} color={C.navy} style={{ marginTop: px(12), marginBottom: px(8) }}>{c.l}</Label>
            <Body size={16}>{c.t}</Body>
          </Box>
        </Reveal>
      ))}
      <Reveal at={hyp}>
        <Box x={104} y={432} w={1114} h={200} style={{ border: `2px solid ${C.blue}`, padding: `${px(18)}px ${px(30)}px`, boxSizing: "border-box", background: C.white }}>
          <Label size={16} style={{ marginBottom: px(6) }}>Hypothèse de travail prudente</Label>
          <Body size={19} style={{ fontWeight: 700 }}>
            Environ CHF 150’000 par an de 2027 à 2032, la durée du prêt. Dès 2033 : retour au bénéfice annuel.
          </Body>
          {/* Répartition des 150’000 : 55 % / 45 %, face à l’amortissement */}
          <div style={{ position: "relative", marginTop: px(22), height: px(44), width: px(W) }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: px(W * 0.55) * pY, background: C.blue }} />
            <div style={{ position: "absolute", left: px(W * 0.55) + 3, top: 0, height: "100%", width: (px(W * 0.45) - 3) * pJ, background: C.navy }} />
            <div style={{ position: "absolute", left: px(14), top: 0, height: "100%", display: "flex", alignItems: "center", color: C.white, fontWeight: 700, fontSize: px(16), opacity: pY }}>
              ≈ 82’500 · 55 % (Yvan)
            </div>
            <div style={{ position: "absolute", left: px(W * 0.55) + px(14), top: 0, height: "100%", display: "flex", alignItems: "center", color: C.white, fontWeight: 700, fontSize: px(16), opacity: pJ }}>
              ≈ 67’500 · 45 % (Jérémy)
            </div>
            {/* repère : amortissement ≈ 58’300 sur la part de 45 % */}
            <div
              style={{
                position: "absolute",
                left: px(W * 0.55) + 3 + (px(W * 0.45) - 3) * (58300 / 67500),
                top: -px(8),
                height: px(60) * pA,
                borderLeft: `3px dashed ${C.red}`,
                opacity: pA,
              }}
            />
          </div>
          <div style={{ position: "relative", height: px(30), width: px(W) }}>
            <div
              style={{
                position: "absolute",
                right: px(W) - (px(W * 0.55) + 3 + (px(W * 0.45) - 3) * (58300 / 67500)) - px(4),
                top: px(10),
                opacity: pA,
                fontFamily: FONT_BODY,
                fontSize: px(15),
                fontWeight: 700,
                color: C.red,
                whiteSpace: "nowrap",
              }}
            >
              amortissement ≈ 58’300 ▲
            </div>
          </div>
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 04 — Capital et direction
// ===========================================================================
export const Capital: React.FC = () => {
  const cue = useCue();
  return (
    <SlideFrame title="Capital et direction" subtitle="Deux sujets distincts." page={17} section={S4}>
      <Box x={104} y={214} style={{ display: "flex", gap: px(6) }}>
        <Reveal at={cue("Le capital finance")}>
          <Body size={21} style={{ fontWeight: 700 }}>Le capital finance la transmission.</Body>
        </Reveal>
        <Reveal at={cue("La gouvernance organise")}>
          <Body size={21} color={C.blue} style={{ fontWeight: 700 }}>La gouvernance organise la transition.</Body>
        </Reveal>
      </Box>
      <Reveal at={cue("De deux mille vingt-sept")}>
        <Box x={104} y={285} w={542} h={365} style={{ background: C.light, padding: `${px(30)}px ${px(28)}px`, boxSizing: "border-box" }}>
          <Label size={18} style={{ marginBottom: px(16) }}>2027 – 2032 · 45 %</Label>
          <Reveal at={cue("Yvan reste majoritaire")} dx={-20} dy={0}>
            <Bullet head="Yvan" detail="Majoritaire, directeur général et président du CA" />
          </Reveal>
          <Reveal at={cue("Jérémy est administrateur")} dx={-20} dy={0}>
            <Bullet head="Jérémy" detail="Administrateur et directeur adjoint" />
          </Reveal>
          <Reveal at={cue("Les grandes décisions")} dx={-20} dy={0}>
            <Bullet head="Ensemble" detail="Les grandes décisions se prennent à deux, avec une signature collective" />
          </Reveal>
        </Box>
      </Reveal>
      <Reveal at={cue("Dès deux mille trente-trois")}>
        <Box x={676} y={285} w={542} h={365} style={{ background: C.blue, padding: `${px(30)}px ${px(28)}px`, boxSizing: "border-box" }}>
          <Label size={18} color={C.white} style={{ marginBottom: px(16) }}>Dès 2033 · 90 %</Label>
          <Body size={22} color={C.white} style={{ fontWeight: 700 }}>
            Jérémy devient majoritaire. L’organisation de la direction reste une étape distincte, définie ensemble le moment venu.
          </Body>
          <Reveal at={cue("Piste de travail")}>
            <Label size={15} color={C.white} style={{ marginTop: px(26), marginBottom: px(6) }}>Piste de travail</Label>
            <Body size={19} color={C.white}>
              Jérémy directeur.
              <br />
              Yvan conseiller stratégique et porteur d’affaires.
            </Body>
          </Reveal>
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 04 — Décider ensemble
// ===========================================================================
export const Decider: React.FC = () => {
  const cue = useCue();
  const items: [string, string][] = [
    ["Budget annuel et investissements importants", "le budget annuel"],
    ["Politique RH", "la politique RH"],
    ["Politique de dividendes", "la politique de dividendes"],
    ["Statuts et entrée de nouveaux actionnaires", "les statuts"],
    ["Calendrier de la transmission", "et le calendrier"],
  ];
  return (
    <SlideFrame title="Décider ensemble" subtitle="Les grandes décisions se prennent à deux." page={18} section={S4}>
      <Reveal at={6}>
        <Box x={104} y={268} w={660} h={270} style={{ background: C.light, padding: `${px(28)}px ${px(28)}px`, boxSizing: "border-box" }}>
          <Label size={19} style={{ marginBottom: px(12) }}>Décisions prises d’un commun accord</Label>
          {items.map(([t, k]) => (
            <Reveal key={t} at={cue(k)} dx={-20} dy={0}>
              <div style={{ display: "flex", gap: px(12), marginBottom: px(6) }}>
                <span style={{ color: C.blue, fontSize: px(19) }}>•</span>
                <Body size={19}>{t}</Body>
              </div>
            </Reveal>
          ))}
        </Box>
      </Reveal>
      <Reveal at={cue("Un comité de transition")}>
        <Box x={794} y={268} w={424} h={125} style={{ background: C.light, padding: `${px(24)}px ${px(24)}px`, boxSizing: "border-box" }}>
          <Label size={19} style={{ marginBottom: px(10) }}>Comité de transition</Label>
          <Body size={19}>Un point mensuel à deux, en mode 2D.</Body>
        </Box>
      </Reveal>
      <Reveal at={cue("Et la signature collective")}>
        <Box x={794} y={413} w={424} h={125} style={{ background: C.light, padding: `${px(24)}px ${px(24)}px`, boxSizing: "border-box" }}>
          <Label size={19} style={{ marginBottom: px(10) }}>Signature collective à deux</Label>
          <Body size={19}>Inscrite au Registre du commerce.</Body>
        </Box>
      </Reveal>
    </SlideFrame>
  );
};

// ===========================================================================
// 04 — Calendrier 2026 – 2038
// ===========================================================================
export const Calendrier: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const chev = [
    { t: "ENTRER", bg: C.navy, k: "entrer," },
    { t: "ACCOMPAGNER", bg: C.mid, k: "accompagner," },
    { t: "TRANSMETTRE", bg: C.blue, k: "transmettre." },
  ];
  const cols: { d: string; t: string; hl?: boolean; k: string }[] = [
    { d: "Nov.–déc. 2026", t: "Accord de principe, contrats mis à jour, AG extraordinaire.", k: "Novembre et décembre" },
    { d: "01.01.2027", t: "Entrée à 45 %. Jérémy administrateur et directeur adjoint.", hl: true, k: "Premier janvier deux mille vingt-sept" },
    { d: "2027–2032", t: "Comité de transition en mode 2D. Premier prêt soldé fin 2032.", k: "De deux mille vingt-sept" },
    { d: "2032", t: "Bilan commun de la première étape. Nouvelle organisation préparée.", k: "année du bilan commun" },
    { d: "01.01.2033", t: "+45 %, soit 90 % : 100’000 d’apport, 350’000 de prêt.", hl: true, k: "Premier janvier deux mille trente-trois" },
    { d: "2033–2037", t: "Second prêt remboursé par les dividendes.", k: "Le second prêt" },
    { d: "2037–2038", t: "Retraite d’Yvan. Second prêt soldé fin 2038. 10 % à définir.", k: "avec la retraite" },
  ];
  const w = 1114 / 3;
  return (
    <SlideFrame title="Calendrier 2026 – 2038" subtitle="Trois temps : entrer, accompagner, transmettre." page={19} section={S4}>
      {chev.map((c, i) => {
        const p = prog(frame, cue(c.k), 20);
        const tip = 22;
        const clip =
          i === 0
            ? `polygon(0 0, calc(100% - ${px(tip)}px) 0, 100% 50%, calc(100% - ${px(tip)}px) 100%, 0 100%)`
            : `polygon(0 0, calc(100% - ${px(tip)}px) 0, 100% 50%, calc(100% - ${px(tip)}px) 100%, 0 100%, ${px(tip)}px 50%)`;
        return (
          <Box
            key={c.t}
            x={104 + i * (w - 6)}
            y={220}
            w={w + (i === 2 ? 18 : 0)}
            h={55}
            style={{ background: c.bg, clipPath: clip, opacity: p, translate: `${(1 - p) * -40}px 0` }}
          >
            <div style={{ position: "absolute", left: px(i === 0 ? 30 : 30), top: 0, height: "100%", display: "flex", alignItems: "center", color: C.white, fontWeight: 700, fontSize: px(19), fontFamily: FONT_BODY }}>
              {c.t}
            </div>
          </Box>
        );
      })}
      {cols.map((c, i) => {
        const at = cue(c.k);
        const p = prog(frame, at, 18);
        return (
          <React.Fragment key={c.d}>
            <Box x={104 + i * 161.3} y={309} w={146 * p} h={6} style={{ background: c.hl ? C.blue : C.navy }} />
            <Reveal at={at + 4}>
              <Box x={104 + i * 161.3} y={330} w={148}>
                <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: px(20), color: c.hl ? C.blue : C.navy, marginBottom: px(8), lineHeight: 1.2 }}>
                  {c.d}
                </div>
                <Body size={15}>{c.t}</Body>
              </Box>
            </Reveal>
          </React.Fragment>
        );
      })}
    </SlideFrame>
  );
};

// ===========================================================================
// 05 — Prochaines étapes
// ===========================================================================
export const Prochaines: React.FC = () => {
  const cue = useCue();
  const groups: { h: string; k: string; items: [string, string][] }[] = [
    {
      h: "1.  Aujourd’hui, entre nous",
      k: "Aujourd'hui, entre nous",
      items: [
        ["Retour sur notre proposition à 45 %", "un retour sur"],
        ["La politique de dividendes et la règle de prudence.", "la politique de dividendes et la règle"],
        ["Les décisions communes et la signature collective.", "les décisions communes"],
        ["Le principe du palier 2033", "et le principe du palier"],
      ],
    },
    {
      h: "2.  D’ici fin 2026",
      k: "D'ici fin deux mille vingt-six",
      items: [
        ["Mettre à jour la convention d’actionnaires, la convention de vente et le contrat de prêt.", "mettre à jour"],
        ["Confirmer le niveau des réserves et le dividende sur les comptes 2026.", "Confirmer le niveau"],
        ["Faire relire le tout par la fiduciaire et un notaire.", "Faire relire"],
        ["AG extraordinaire : split d’actions et statuts.", "Et tenir l'assemblée"],
      ],
    },
    {
      h: "3.  1er janvier 2027",
      k: "Puis, le premier janvier",
      items: [["Signature et entrée au capital.", "signature, et entrée"]],
    },
  ];
  let y = 210;
  return (
    <SlideFrame title="Prochaines étapes" subtitle="Objectif : signer avant le 1er janvier 2027." page={24} section={S5}>
      {groups.map((g) => {
        const gy = y;
        y += 38 + g.items.length * 29 + 10;
        return (
          <React.Fragment key={g.h}>
            <Reveal at={cue(g.k)} dx={-20} dy={0}>
              <Box x={114} y={gy}>
                <Label size={19}>{g.h}</Label>
              </Box>
            </Reveal>
            {g.items.map(([t, k], j) => (
              <Reveal key={t} at={cue(k)} dx={-20} dy={0}>
                <Box x={155} y={gy + 36 + j * 29} style={{ display: "flex", gap: px(10) }}>
                  <span style={{ color: C.blue, fontSize: px(18) }}>•</span>
                  <Body size={18}>{t}</Body>
                </Box>
              </Reveal>
            ))}
          </React.Fragment>
        );
      })}
    </SlideFrame>
  );
};

// ===========================================================================
// Échanges et questions
// ===========================================================================
export const Echanges: React.FC = () => {
  const frame = useCurrentFrame();
  const bg = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <AbsoluteFill style={{ background: C.blue, clipPath: `inset(0 ${(1 - bg) * 100}% 0 0)` }} />
      <Reveal at={14} dx={-40} dy={0}>
        <Box x={104} y={272}>
          <div style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: px(62), color: C.white }}>Échanges et questions</div>
        </Box>
      </Reveal>
    </AbsoluteFill>
  );
};
