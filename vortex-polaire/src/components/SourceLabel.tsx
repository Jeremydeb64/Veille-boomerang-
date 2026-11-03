import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, SAFE } from "../theme";
import { fadeInOut } from "../anim";

type Props = {
  text: string;
  from: number;
  to: number;
  /** position : bas-gauche (défaut) ou haut-droite */
  corner?: "bl" | "tr" | "br";
};

/** Mention de source discrète, toujours dans la zone de sécurité. */
export const SourceLabel: React.FC<Props> = ({ text, from, to, corner = "bl" }) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, from, from + 15, to - 15, to);
  if (o <= 0) return null;
  const pos: React.CSSProperties =
    corner === "bl"
      ? { left: SAFE.x, bottom: SAFE.y - 22 }
      : corner === "br"
        ? { right: SAFE.x, bottom: SAFE.y - 22, textAlign: "right" }
        : { right: SAFE.x, top: SAFE.y, textAlign: "right" };
  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        maxWidth: 760,
        fontFamily: FONT,
        fontSize: 17,
        lineHeight: 1.35,
        color: C.muted,
        opacity: o * 0.9,
        letterSpacing: "0.02em",
      }}
    >
      <span style={{ color: C.cyan, fontWeight: 700, letterSpacing: "0.18em", marginRight: 10 }}>SOURCE</span>
      {text}
    </div>
  );
};

/** Badge d'avertissement (ex. « Schéma qualitatif », « Illustration pédagogique ») */
export const Badge: React.FC<{ text: string; from: number; to?: number; color?: string; style?: React.CSSProperties }> = ({
  text,
  from,
  to = 1e9,
  color = C.orange,
  style,
}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, from, from + 15, to - 12, to);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: FONT,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        border: `1.5px solid ${color}99`,
        background: `${C.night}cc`,
        borderRadius: 6,
        padding: "9px 16px",
        opacity: o,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
