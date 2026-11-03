import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, clamp, mono, out, sans } from "./theme";

/** Fond chaud avec halo et grille qui dérivent lentement */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.cardBorder}33 1px, transparent 1px), linear-gradient(90deg, ${C.cardBorder}33 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `${frame * 0.4}px ${frame * 0.4}px`,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}38 0%, transparent 65%)`,
          left: 1000 + Math.sin(frame / 40) * 120,
          top: -350 + Math.cos(frame / 50) * 80,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.blue}1F 0%, transparent 65%)`,
          left: -300 + Math.cos(frame / 45) * 100,
          top: 450 + Math.sin(frame / 35) * 60,
        }}
      />
    </AbsoluteFill>
  );
};

/** Entrée : glisse vers le haut + fondu */
export const Rise: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  distance?: number;
}> = ({ delay = 0, children, style, distance = 40 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [delay, delay + 14], [0, 1], clamp),
        translate: interpolate(
          frame,
          [delay, delay + 20],
          [`0px ${distance}px`, "0px 0px"],
          { ...clamp, easing: out },
        ),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Apparition avec rebond */
export const Pop: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [delay, delay + 6], [0, 1], clamp),
        scale: interpolate(frame, [delay, delay + 22], [0.4, 1], {
          ...clamp,
          easing: Easing.spring({ damping: 12 }),
          output: "perceptual-scale",
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Fenêtre de terminal générique */
export const Terminal: React.FC<{
  title: string;
  width: number;
  children: React.ReactNode;
}> = ({ title, width, children }) => (
  <div
    style={{
      width,
      borderRadius: 24,
      background: C.card,
      border: `2px solid ${C.cardBorder}`,
      boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 24px",
        borderBottom: `2px solid ${C.cardBorder}`,
      }}
    >
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div
          key={c}
          style={{ width: 16, height: 16, borderRadius: 8, background: c }}
        />
      ))}
      <div
        style={{
          marginLeft: 16,
          fontFamily: sans,
          fontSize: 22,
          color: C.muted,
        }}
      >
        {title}
      </div>
    </div>
    <div
      style={{
        padding: "36px 40px",
        fontFamily: mono,
        fontSize: 40,
        lineHeight: 1.5,
        color: C.text,
      }}
    >
      {children}
    </div>
  </div>
);

/** Texte tapé au clavier */
export const Typed: React.FC<{
  text: string;
  start: number;
  cps?: number;
  render?: (visible: string) => React.ReactNode;
}> = ({ text, start, cps = 30, render }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.floor(
    interpolate(
      frame,
      [start, start + (text.length / cps) * fps],
      [0, text.length],
      clamp,
    ),
  );
  const visible = text.slice(0, count);
  const typing = count < text.length && frame >= start;
  const blink = typing || Math.floor(frame / 15) % 2 === 0;
  return (
    <span>
      {render ? render(visible) : visible}
      <span
        style={{
          display: "inline-block",
          width: "0.55em",
          height: "1.05em",
          marginLeft: 4,
          verticalAlign: "-0.15em",
          background: C.accent,
          opacity: blink ? 1 : 0,
        }}
      />
    </span>
  );
};

export const Check: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = C.green,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill={color} />
    <path
      d="M7 12.5l3.2 3.2L17 9"
      stroke={C.bg}
      strokeWidth="2.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Colonne gauche d'une étape : gros numéro + consigne */
export const StepHeader: React.FC<{
  n: number;
  title: string;
  hint: string;
}> = ({ n, title, hint }) => (
  <div style={{ width: 620 }}>
    <Pop>
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 40,
          background: C.accent,
          color: C.bg,
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 20px 60px ${C.accent}66`,
        }}
      >
        {n}
      </div>
    </Pop>
    <Rise delay={5}>
      <div
        style={{
          marginTop: 40,
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.05,
          color: C.text,
          letterSpacing: -2,
        }}
      >
        {title}
      </div>
    </Rise>
    <Rise delay={10}>
      <div
        style={{
          marginTop: 22,
          fontFamily: sans,
          fontSize: 34,
          lineHeight: 1.35,
          color: C.muted,
        }}
      >
        {hint}
      </div>
    </Rise>
  </div>
);

export const StepLayout: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = ({ left, right }) => (
  <AbsoluteFill
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 130px 90px",
    }}
  >
    {left}
    {right}
  </AbsoluteFill>
);
