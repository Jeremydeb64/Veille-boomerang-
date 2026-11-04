import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { appear, clamp, rise, wf } from "../lib";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { Card, Check, Cross, Kicker, Row, Title } from "../components/ui";
import { Bottle, IcoExit, IcoFlame, IcoPhone, IcoWave, PicCover, PicDrop, PicHold } from "../components/icons";

const PAD = 72;

/* ================================================================ 08 */
export const S08Before: React.FC = () => {
  const id = "s08_avant";
  const frame = useCurrentFrame();
  const waterAt = wf(id, "9 litres");
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0} color={C.mint}>
          Avant · chez soi
        </Kicker>
        <Title at={wf(id, "bonne")} size={88} style={{ marginTop: 12 }}>
          On peut <span style={{ color: C.mint }}>s'y préparer</span>
        </Title>
      </div>
      <div style={{ position: "absolute", top: 520, left: PAD, right: PAD, display: "flex", flexDirection: "column", gap: 40 }}>
        <Row at={wf(id, "fixez")} color={C.mint} icon={<Check at={wf(id, "fixez")} />} title="Fixer les meubles hauts" sub="et les objets lourds" />
        <div>
          <Row
            at={wf(id, "provision")}
            color={C.mint}
            icon={<Check at={wf(id, "provision")} />}
            title="Provision de secours"
            sub="nourriture · lampe · radio à piles"
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, marginLeft: 122, ...rise(frame, waterAt - 4, 20) }}>
            {Array.from({ length: 9 }, (_, i) => (
              <Bottle key={i} fill={appear(frame, waterAt + i * 3, 10)} />
            ))}
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 40, color: C.sky, marginLeft: 16, lineHeight: 1 }}>
              9 L<span style={{ fontSize: 26, color: C.mute }}> / pers.</span>
            </div>
          </div>
        </div>
        <Row at={wf(id, "Convenez")} color={C.mint} icon={<Check at={wf(id, "Convenez")} />} title="Un point de rencontre" sub="décidé en famille" />
        <Row
          at={wf(id, "vérifiez")}
          color={C.amber}
          icon={<Check at={wf(id, "vérifiez")} color={C.amber} />}
          title="Vérifier son assurance"
          sub="les dégâts sismiques sont souvent exclus"
        />
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ 09 */
const Step: React.FC<{ n: number; at: number; label: string; children: React.ReactNode }> = ({ n, at, label, children }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, at - 4, 16);
  const active = interpolate(frame, [at - 4, at + 6], [0, 1], clamp);
  return (
    <div
      style={{
        flex: 1,
        background: C.card,
        border: `3px solid ${active > 0.5 ? C.mint : C.cardLine}`,
        borderRadius: 32,
        padding: "22px 10px 26px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: p,
        translate: `0px ${(1 - p) * 40}px`,
      }}
    >
      <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 40, color: C.mint }}>{n}</div>
      {children}
      <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 40, color: C.ink, textAlign: "center", lineHeight: 1.05 }}>{label}</div>
    </div>
  );
};

const Dont: React.FC<{ at: number; text: string; ok?: boolean }> = ({ at, text, ok }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, ...rise(frame, at, 30, 16) }}>
      {ok ? <Check at={at - 6} size={46} /> : <Cross size={40} />}
      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 38, color: C.ink }}>{text}</div>
    </div>
  );
};

export const S09During: React.FC = () => {
  const id = "s09_pendant";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0} color={C.mint}>
          Pendant la secousse
        </Kicker>
        <Title at={wf(id, "réflexes")} size={92} style={{ marginTop: 12 }}>
          3 réflexes
        </Title>
      </div>
      <div style={{ position: "absolute", top: 500, left: PAD, right: PAD, display: "flex", gap: 18 }}>
        <Step n={1} at={wf(id, "baisser")} label="Se baisser">
          <PicDrop color={C.mint} at={wf(id, "baisser")} />
        </Step>
        <Step n={2} at={wf(id, "abriter")} label="S'abriter">
          <PicCover color={C.mint} at={wf(id, "abriter")} />
        </Step>
        <Step n={3} at={wf(id, "agripper")} label="S'agripper">
          <PicHold color={C.mint} at={wf(id, "agripper")} />
        </Step>
      </div>
      <Card at={wf(id, "Restez")} style={{ position: "absolute", top: 1000, left: PAD, right: PAD, display: "flex", flexDirection: "column", gap: 22 }}>
        <Dont at={wf(id, "fenêtres")} text="Rester loin des fenêtres" ok />
        <Dont at={wf(id, "courez")} text="Ne pas courir dehors" />
        <Dont at={wf(id, "extérieur")} text="Dehors : loin des bâtiments et des pentes" ok />
      </Card>
    </AbsoluteFill>
  );
};

/* ================================================================ 10 */
export const S10After: React.FC = () => {
  const id = "s10_apres";
  const frame = useCurrentFrame();
  const n112 = wf(id, "112");
  const p = appear(frame, n112, 16);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD }}>
        <Kicker at={0} color={C.mint}>
          Après la secousse
        </Kicker>
        <Title at={4} size={92} style={{ marginTop: 12 }}>
          Garder son calme
        </Title>
      </div>
      <div style={{ position: "absolute", top: 510, left: PAD, right: PAD, display: "flex", flexDirection: "column", gap: 34 }}>
        <Row at={wf(id, "répliques")} color={C.mint} icon={<IcoWave />} title="Des répliques suivent" sub="restez attentifs" />
        <Row at={wf(id, "Sortez")} color={C.mint} icon={<IcoExit />} title="Sortir calmement" sub="sans prendre l'ascenseur" />
        <Row at={wf(id, "gaz")} color={C.mint} icon={<IcoFlame />} title="Odeur de gaz ?" sub="couper le gaz et aérer" />
        <Row at={wf(id, "Alertswiss")} color={C.mint} icon={<IcoPhone />} title="S'informer" sub="application Alertswiss, radio" />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1190,
          left: PAD,
          right: PAD,
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: p,
          scale: String(0.9 + 0.1 * p),
        }}
      >
        <div
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 110,
            color: C.bg0,
            background: C.coral,
            borderRadius: 28,
            padding: "0 30px",
            lineHeight: 1.25,
          }}
        >
          112
        </div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: 1.2 }}>
          pour les vraies
          <br />
          urgences
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ 11 */
export const S11Outro: React.FC = () => {
  const id = "s11_outro";
  const frame = useCurrentFrame();
  const line = (at: number, text: React.ReactNode, color: string, size = 96) => (
    <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, letterSpacing: -2, ...rise(frame, at, 40, 20) }}>
      {text}
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 330, left: PAD, right: PAD, display: "flex", flexDirection: "column", gap: 18 }}>
        {line(wf(id, "Big") - 4, "Pas une prophétie.", C.mute, 92)}
        {line(wf(id, "statistique"), "Une statistique.", C.amber, 110)}
        <div style={{ height: 50 }} />
        {line(wf(id, "quand"), "On ne sait pas quand.", C.ink, 74)}
        {line(wf(id, "comment"), <>On sait <span style={{ color: C.mint }}>comment</span><br />s'y préparer.</>, C.ink, 74)}
      </div>
      <Card at={wf(id, "partagez")} accent={C.mint} style={{ position: "absolute", top: 1050, left: PAD, right: PAD }}>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 52, color: C.ink }}>Partagez ces bons réflexes</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 28, color: C.mute, marginTop: 10 }}>
          Infos officielles : Service sismologique suisse · Alertswiss · Canton du Valais
        </div>
      </Card>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: PAD,
          right: PAD,
          fontFamily: FONT_BODY,
          fontWeight: 400,
          fontSize: 22,
          color: C.dim,
          lineHeight: 1.4,
          opacity: appear(frame, wf(id, "partagez") + 20, 20),
        }}
      >
        Sources : Service sismologique suisse (ETH Zurich), Canton du Valais, Archives de l'État du Valais, Fritsche et al. (2006,
        2012). Magnitudes historiques estimées. Carte : Natural Earth.
      </div>
    </AbsoluteFill>
  );
};
