import React from "react";
import { useCurrentFrame } from "remotion";
import { appear } from "../lib";
import { C } from "../theme";

const S = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* ---------------------------------------------- pictogrammes des réflexes */

const Floor = () => <line x1={20} y1={172} x2={180} y2={172} stroke={C.dim} strokeWidth={4} strokeLinecap="round" />;

const Table: React.FC<{ color?: string }> = ({ color = C.ink }) => (
  <g stroke={color} strokeWidth={8} {...S}>
    <line x1={22} y1={86} x2={178} y2={86} />
    <line x1={38} y1={86} x2={38} y2={170} />
    <line x1={162} y1={86} x2={162} y2={170} />
  </g>
);

/** 1 · Se baisser : personne à genoux, mains sur la nuque */
export const PicDrop: React.FC<{ color: string; at: number }> = ({ color, at }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, at, 20);
  const dy = (1 - p) * -34;
  return (
    <svg viewBox="0 0 200 200" width={220} height={220}>
      <Floor />
      <g stroke={color} strokeWidth={10} {...S} transform={`translate(0 ${dy})`}>
        <circle cx={84} cy={78} r={17} fill={color} stroke="none" />
        <path d="M92 98 C108 110 122 122 130 140" />
        <path d="M130 140 L96 152 L82 170" />
        <path d="M130 140 L150 170" />
        <path d="M100 104 L74 70" />
      </g>
    </svg>
  );
};

/** 2 · S'abriter : sous une table solide */
export const PicCover: React.FC<{ color: string; at: number }> = ({ color, at }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, at, 20);
  return (
    <svg viewBox="0 0 200 200" width={220} height={220}>
      <Floor />
      <Table />
      <g stroke={color} strokeWidth={9} {...S} transform={`translate(${(1 - p) * -60} 0)`} opacity={p}>
        <circle cx={78} cy={118} r={14} fill={color} stroke="none" />
        <path d="M88 132 C102 138 114 146 122 156" />
        <path d="M122 156 L92 164 L80 172" />
        <path d="M122 156 L134 172" />
      </g>
    </svg>
  );
};

/** 3 · S'agripper : on tient le pied de la table */
export const PicHold: React.FC<{ color: string; at: number }> = ({ color, at }) => {
  const frame = useCurrentFrame();
  const p = appear(frame, at, 16);
  const wig = Math.sin(frame / 2.2) * 3 * p;
  return (
    <svg viewBox="0 0 200 200" width={220} height={220}>
      <Floor />
      <g transform={`translate(${wig} 0)`}>
        <Table />
      </g>
      <g stroke={color} strokeWidth={9} {...S}>
        <circle cx={78} cy={118} r={14} fill={color} stroke="none" />
        <path d="M88 132 C102 138 114 146 122 156" />
        <path d="M122 156 L92 164 L80 172" />
        <path d="M122 156 L134 172" />
        <path d={`M100 140 L${130 + 26 * p} ${136 - 6 * p}`} />
      </g>
      <circle cx={156 + wig} cy={130} r={10 * p} fill={C.amber} />
    </svg>
  );
};

/* -------------------------------------------------- dangers en montagne */

export const IcoRockfall: React.FC = () => {
  const frame = useCurrentFrame();
  const rocks = [0, 1, 2].map((i) => {
    const t = ((frame + i * 17) % 50) / 50;
    return { x: 70 + i * 22 + t * 60, y: 40 + t * 110, r: 12 - i * 2, o: Math.sin(t * Math.PI) };
  });
  return (
    <svg viewBox="0 0 200 200" width={200} height={200}>
      <path d="M20 180 L20 30 L70 30 L180 180 Z" {...S} fill="rgba(255,255,255,0.06)" stroke={C.mute} strokeWidth={5} />
      {rocks.map((r, i) => (
        <polygon
          key={i}
          points={`${r.x - r.r},${r.y} ${r.x},${r.y - r.r} ${r.x + r.r},${r.y - 2} ${r.x + 2},${r.y + r.r}`}
          fill={C.amber}
          opacity={r.o}
        />
      ))}
    </svg>
  );
};

export const IcoLandslide: React.FC = () => {
  const frame = useCurrentFrame();
  const s = (Math.sin(frame / 14) + 1) * 8;
  return (
    <svg viewBox="0 0 200 200" width={200} height={200}>
      <path d="M10 60 L190 170 L10 170 Z" {...S} fill="rgba(255,255,255,0.06)" stroke={C.mute} strokeWidth={5} />
      <path
        d={`M${30 + s} 82 C${70 + s} 96 ${95 + s} 120 ${130 + s} 140`}
        stroke={C.amber}
        strokeWidth={14}
        {...S}
      />
      <path d={`M${140 + s} 120 L${165 + s} 150 L${128 + s} 152`} stroke={C.amber} strokeWidth={8} {...S} />
    </svg>
  );
};

export const IcoAvalanche: React.FC = () => {
  const frame = useCurrentFrame();
  const flakes = Array.from({ length: 9 }, (_, i) => {
    const t = ((frame * 1.2 + i * 11) % 60) / 60;
    return { x: 40 + ((i * 37) % 130) + t * 30, y: 30 + t * 140, o: Math.sin(t * Math.PI) };
  });
  return (
    <svg viewBox="0 0 200 200" width={200} height={200}>
      <path d="M10 180 L80 40 L120 100 L145 70 L195 180 Z" {...S} fill="rgba(255,255,255,0.06)" stroke={C.mute} strokeWidth={5} />
      <path d="M58 84 L80 40 L102 72 L90 66 L80 78 L70 70 Z" fill={C.ink} />
      {flakes.map((f, i) => (
        <circle key={i} cx={f.x} cy={f.y} r={5} fill={C.sky} opacity={f.o} />
      ))}
    </svg>
  );
};

export const IcoRoad: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = Math.sin(frame / 6) > 0 ? 1 : 0.35;
  return (
    <svg viewBox="0 0 200 200" width={200} height={200}>
      <path d="M80 30 L120 30 L175 185 L25 185 Z" {...S} fill="rgba(255,255,255,0.06)" stroke={C.mute} strokeWidth={5} />
      <path d="M100 40 L100 70 M100 90 L100 120" stroke={C.dim} strokeWidth={6} {...S} />
      <rect x={40} y={128} width={120} height={26} rx={6} fill={C.ink} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${52 + i * 30} 154 L${70 + i * 30} 128`} stroke={C.coral} strokeWidth={10} />
      ))}
      <circle cx={46} cy={118} r={8} fill={C.amber} opacity={blink} />
      <circle cx={154} cy={118} r={8} fill={C.amber} opacity={1.35 - blink} />
    </svg>
  );
};

/* ------------------------------------------------------ petites icônes */

export const IcoWave: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = C.mint }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M2 12 L6 12 L8 6 L11 18 L14 4 L16 15 L18 12 L22 12" stroke={color} strokeWidth={2.2} {...S} />
  </svg>
);
export const IcoExit: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = C.mint }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M14 4 H5 V20 H14" stroke={color} strokeWidth={2.2} {...S} />
    <path d="M10 12 H21 M17 8 L21 12 L17 16" stroke={color} strokeWidth={2.2} {...S} />
  </svg>
);
export const IcoFlame: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = C.mint }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 3 C14 7 18 9 18 14 A6 6 0 0 1 6 14 C6 11 8 9 9 7 C10 9 11 10 12 10 C12 7 11 5 12 3 Z" stroke={color} strokeWidth={2.2} {...S} />
  </svg>
);
export const IcoPhone: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = C.mint }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect x={6} y={2.5} width={12} height={19} rx={2.5} stroke={color} strokeWidth={2.2} fill="none" />
    <path d="M10 18.5 H14" stroke={color} strokeWidth={2.2} {...S} />
    <path d="M9 9 L12 6 L15 9 M12 6 V13" stroke={color} strokeWidth={2} {...S} />
  </svg>
);
export const IcoInfo: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = C.sky }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <circle cx={12} cy={12} r={9.5} stroke={color} strokeWidth={2.2} fill="none" />
    <path d="M12 11 V17 M12 7.2 V7.4" stroke={color} strokeWidth={2.6} {...S} />
  </svg>
);
export const IcoHouse: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = C.ink }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M3 11 L12 4 L21 11 V20 H3 Z" stroke={color} strokeWidth={2.2} {...S} />
    <path d="M10 20 V14 H14 V20" stroke={color} strokeWidth={2.2} {...S} />
  </svg>
);

/** Bouteille d'eau (provision de secours) */
export const Bottle: React.FC<{ fill: number }> = ({ fill }) => (
  <svg viewBox="0 0 24 48" width={36} height={72}>
    <defs>
      <clipPath id="btl">
        <path d="M9 2 H15 V7 C19 9 20 12 20 15 V44 A2 2 0 0 1 18 46 H6 A2 2 0 0 1 4 44 V15 C4 12 5 9 9 7 Z" />
      </clipPath>
    </defs>
    <rect x={0} y={48 - 40 * fill} width={24} height={48} fill={C.sky} clipPath="url(#btl)" opacity={0.85} />
    <path
      d="M9 2 H15 V7 C19 9 20 12 20 15 V44 A2 2 0 0 1 18 46 H6 A2 2 0 0 1 4 44 V15 C4 12 5 9 9 7 Z"
      stroke={C.ink}
      strokeWidth={2}
      fill="none"
    />
  </svg>
);
