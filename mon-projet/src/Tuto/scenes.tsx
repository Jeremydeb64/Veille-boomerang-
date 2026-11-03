import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, clamp, mono, out, sans } from "./theme";
import {
  Check,
  Pop,
  Rise,
  StepHeader,
  StepLayout,
  Terminal,
  Typed,
} from "./ui";

/* ---------- Intro ---------- */
const words = ["Motion", "design"];

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 90,
        fontFamily: sans,
      }}
    >
      <Pop delay={2}>
        <div
          style={{
            padding: "14px 30px",
            borderRadius: 999,
            border: `2px solid ${C.accent}`,
            color: C.accentSoft,
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Tuto express · 15 secondes
        </div>
      </Pop>
      <div style={{ display: "flex", gap: 36, marginTop: 40 }}>
        {words.map((w, i) => (
          <div
            key={w}
            style={{
              fontSize: 190,
              fontWeight: 800,
              letterSpacing: -6,
              color: C.text,
              opacity: interpolate(frame, [8 + i * 6, 18 + i * 6], [0, 1], clamp),
              translate: interpolate(
                frame,
                [8 + i * 6, 30 + i * 6],
                ["0px 120px", "0px 0px"],
                { ...clamp, easing: out },
              ),
              rotate: interpolate(frame, [8 + i * 6, 30 + i * 6], ["8deg", "0deg"], {
                ...clamp,
                easing: out,
              }),
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <Rise delay={26}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            color: C.text,
            marginTop: -10,
            position: "relative",
          }}
        >
          avec{" "}
          <span style={{ color: C.accent, position: "relative" }}>
            Claude Code
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -8,
                height: 10,
                borderRadius: 5,
                background: C.accent,
                transformOrigin: "left",
                scale: `${interpolate(frame, [40, 62], [0, 1], { ...clamp, easing: out })} 1`,
              }}
            />
          </span>
        </div>
      </Rise>
      <Rise delay={58}>
        <div
          style={{
            marginTop: 50,
            display: "flex",
            gap: 20,
            fontSize: 34,
            color: C.muted,
          }}
        >
          {["Ouvrir", "Lancer", "Décrire"].map((s, i) => (
            <Pop key={s} delay={60 + i * 5}>
              <div
                style={{
                  padding: "12px 26px",
                  borderRadius: 16,
                  background: C.card,
                  border: `2px solid ${C.cardBorder}`,
                }}
              >
                <span style={{ color: C.accent, fontWeight: 800 }}>{i + 1}</span>{" "}
                {s}
              </div>
            </Pop>
          ))}
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

/* ---------- Étape 1 : ouvrir une session ---------- */
export const Step1: React.FC = () => {
  return (
    <StepLayout
      left={
        <StepHeader
          n={1}
          title="Ouvrez une session"
          hint="Dans Claude Code : terminal, appli ou claude.ai/code"
        />
      }
      right={
        <Rise delay={4} distance={80}>
          <Terminal title="Terminal" width={940}>
            <div>
              <span style={{ color: C.accent }}>$ </span>
              <Typed text="claude" start={10} cps={18} />
            </div>
            <Rise delay={30} distance={20}>
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  color: C.green,
                  fontSize: 36,
                }}
              >
                <Check /> Session Claude Code ouverte
              </div>
            </Rise>
            <Rise delay={40} distance={20}>
              <div style={{ marginTop: 14, color: C.muted, fontSize: 32 }}>
                &gt; Que veux-tu créer ?
              </div>
            </Rise>
          </Terminal>
        </Rise>
      }
    />
  );
};

/* ---------- Étape 2 : la commande ---------- */
const CMD = "npx create-video --yes --blank mon-projet";
const colorize = (visible: string) => {
  const parts: [number, number, string][] = [
    [0, 3, C.accent],
    [3, 16, C.text],
    [16, 30, C.blue],
    [30, CMD.length, C.green],
  ];
  return parts.map(([a, b, color]) => (
    <span key={a} style={{ color, whiteSpace: "nowrap" }}>
      {visible.slice(a, b)}
    </span>
  ));
};

export const Step2: React.FC = () => {
  return (
    <StepLayout
      left={
        <StepHeader
          n={2}
          title="Tapez la commande"
          hint="Elle crée un projet vidéo Remotion prêt à l'emploi"
        />
      }
      right={
        <Rise delay={4} distance={80}>
          <Terminal title="mon-dossier" width={980}>
            <div style={{ fontSize: 32, whiteSpace: "nowrap" }}>
              <span style={{ color: C.accent }}>$ </span>
              <Typed text={CMD} start={6} cps={48} render={colorize} />
            </div>
            <Rise delay={40} distance={20}>
              <div
                style={{
                  marginTop: 26,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  color: C.green,
                  fontSize: 34,
                }}
              >
                <Check /> Projet « mon-projet » créé
              </div>
            </Rise>
            <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
              {["src/", "public/", "package.json"].map((f, i) => (
                <Pop key={f} delay={50 + i * 5}>
                  <div
                    style={{
                      fontSize: 26,
                      padding: "8px 18px",
                      borderRadius: 12,
                      background: C.bg,
                      color: C.muted,
                      border: `2px solid ${C.cardBorder}`,
                    }}
                  >
                    {f}
                  </div>
                </Pop>
              ))}
            </div>
          </Terminal>
        </Rise>
      }
    />
  );
};

/* ---------- Étape 3 : décrire, Claude anime ---------- */
const MiniPlayer: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  return (
    <div
      style={{
        width: 620,
        borderRadius: 24,
        overflow: "hidden",
        background: C.card,
        border: `2px solid ${C.cardBorder}`,
        boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
      }}
    >
      <div
        style={{
          height: 300,
          position: "relative",
          background: `linear-gradient(135deg, #2A1D16, ${C.bg})`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 90,
            height: 90,
            borderRadius: 45,
            background: C.accent,
            top: 50,
            left: interpolate(t, [0, 40], [-100, 170], { ...clamp, easing: out }),
            scale: interpolate(t, [30, 40, 50], [1, 1.25, 1], clamp),
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 80,
            height: 80,
            borderRadius: 18,
            background: C.blue,
            top: interpolate(t, [8, 40], [-100, 55], {
              ...clamp,
              easing: Easing.bounce,
            }),
            left: 370,
            rotate: `${interpolate(t, [8, 60], [0, 180], clamp)}deg`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 40,
            textAlign: "center",
            fontFamily: sans,
            fontWeight: 800,
            fontSize: 56,
            color: C.text,
            opacity: interpolate(t, [30, 42], [0, 1], clamp),
            translate: interpolate(t, [30, 46], ["0px 30px", "0px 0px"], {
              ...clamp,
              easing: out,
            }),
          }}
        >
          Waouh
        </div>
      </div>
      <div
        style={{
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24">
          <path d="M6 4l14 8-14 8z" fill={C.text} />
        </svg>
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            background: C.cardBorder,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: C.accent,
              width: `${interpolate(t, [0, 60], [0, 100], clamp)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const Step3: React.FC = () => {
  return (
    <StepLayout
      left={
        <StepHeader
          n={3}
          title="Décrivez votre vidéo"
          hint="Écrivez ce que vous voulez en français : Claude code l'animation"
        />
      }
      right={
        <div
          style={{
            width: 980,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 34,
          }}
        >
          <Rise delay={4} distance={50}>
            <div
              style={{
                maxWidth: 800,
                padding: "26px 34px",
                borderRadius: "30px 30px 6px 30px",
                background: C.accent,
                color: C.bg,
                fontFamily: sans,
                fontWeight: 600,
                fontSize: 38,
                lineHeight: 1.3,
              }}
            >
              <Typed
                text="Fais une intro animée de 10 s pour ma marque"
                start={8}
                cps={45}
              />
            </div>
          </Rise>
          <div style={{ alignSelf: "flex-start" }}>
            <Pop delay={34}>
              <MiniPlayer start={36} />
            </Pop>
          </div>
        </div>
      }
    />
  );
};

/* ---------- Outro : exercice ---------- */
const recap = [
  "Ouvrir une session Claude Code",
  "npx create-video --yes --blank mon-projet",
  "Décrire sa vidéo à Claude",
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 130px 90px",
        fontFamily: sans,
      }}
    >
      <div style={{ width: 760 }}>
        <Pop delay={2}>
          <div
            style={{
              display: "inline-block",
              padding: "12px 28px",
              borderRadius: 999,
              background: C.accent,
              color: C.bg,
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Exercice
          </div>
        </Pop>
        <Rise delay={6}>
          <div
            style={{
              marginTop: 30,
              fontSize: 110,
              fontWeight: 800,
              letterSpacing: -4,
              color: C.text,
            }}
          >
            À vous !
          </div>
        </Rise>
        <Rise delay={14}>
          <div
            style={{
              marginTop: 20,
              padding: "28px 34px",
              borderRadius: 24,
              background: C.card,
              border: `2px dashed ${C.accent}`,
              fontSize: 38,
              lineHeight: 1.35,
              color: C.text,
            }}
          >
            Demandez à Claude :
            <br />
            <span style={{ color: C.accentSoft, fontWeight: 600 }}>
              « Crée un titre animé de 5 secondes avec mon prénom »
            </span>
          </div>
        </Rise>
      </div>
      <Rise delay={20} distance={60}>
        <div
          style={{
            width: 800,
            padding: "40px 44px",
            borderRadius: 28,
            background: C.card,
            border: `2px solid ${C.cardBorder}`,
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: 3,
              fontWeight: 600,
              marginBottom: 26,
            }}
          >
            Récap
          </div>
          {recap.map((r, i) => {
            const d = 28 + i * 10;
            return (
              <div
                key={r}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  marginBottom: 24,
                  opacity: interpolate(frame, [d, d + 8], [0.25, 1], clamp),
                }}
              >
                <Pop delay={d}>
                  <Check size={44} />
                </Pop>
                <div
                  style={{
                    fontSize: i === 1 ? 25 : 36,
                    whiteSpace: "nowrap",
                    fontFamily: i === 1 ? mono : sans,
                    color: i === 1 ? C.accentSoft : C.text,
                  }}
                >
                  {r}
                </div>
              </div>
            );
          })}
          <Rise delay={62} distance={20}>
            <div style={{ marginTop: 10, fontSize: 28, color: C.muted }}>
              Aperçu : <span style={{ fontFamily: mono, color: C.text }}>npm run dev</span>
            </div>
          </Rise>
        </div>
      </Rise>
    </AbsoluteFill>
  );
};
