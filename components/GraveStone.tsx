"use client";

import { useState } from "react";
import { Resolution } from "@/types/resolution";
import { CATEGORIES, GIVE_UP_REASONS } from "@/lib/categories";

// ── Stone shapes (SVG path, viewBox 0 0 100 148) ──
const SHAPES = {
  arch:    "M 8 148 L 8 50 Q 8 8 50 8 Q 92 8 92 50 L 92 148 Z",
  pointed: "M 20 148 L 20 80 L 50 8 L 80 80 L 80 148 Z",
  round:   "M 8 148 L 8 32 Q 8 8 30 8 L 70 8 Q 92 8 92 32 L 92 148 Z",
};

// paddingTop % so text starts in the flat body of each shape
const SHAPE_TEXT_PT: Record<keyof typeof SHAPES, string> = {
  arch:    "32%",
  pointed: "50%",
  round:   "24%",
};

type ShapeKey = keyof typeof SHAPES;

const CAT_SHAPE: Record<string, ShapeKey> = {
  diet:     "arch",
  exercise: "arch",
  study:    "pointed",
  habit:    "arch",
  money:    "arch",
  love:     "round",
  other:    "arch",
};

// Stone gradient colours — weathered, slightly tinted
const CAT_COLORS: Record<string, { top: string; bot: string }> = {
  diet:     { top: "#3d4a3d", bot: "#1c271c" },
  exercise: { top: "#39405a", bot: "#181e32" },
  study:    { top: "#4a4038", bot: "#251e16" },
  habit:    { top: "#413657", bot: "#1f1430" },
  money:    { top: "#3a4a3a", bot: "#172417" },
  love:     { top: "#4a3848", bot: "#251322" },
  other:    { top: "#404050", bot: "#1c1c28" },
};
const ZERO_COLORS = { top: "#6a2418", bot: "#380c06" };

function clamp(val: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, val));
}

function getRotation(id: string) {
  const n = parseInt(id.replace(/-/g, "").slice(0, 6), 16);
  return clamp(((n % 13) - 6) * 0.55, -3.5, 3.5);
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

interface Props {
  resolution: Resolution;
  onDelete?: (id: string) => void;
  animDelay?: number;
  onEmpathy?: (id: string) => void;
  empathized?: boolean;
}

export default function GraveStone({ resolution, onDelete, animDelay = 0, onEmpathy, empathized = false }: Props) {
  const [hovered, setHovered] = useState(false);

  const isZeroDay = resolution.survivedDays === 0;
  const cat       = CATEGORIES[resolution.category];
  const shape     = CAT_SHAPE[resolution.category] ?? "arch";
  const shapePath = SHAPES[shape];
  const textPt    = SHAPE_TEXT_PT[shape];
  const colors    = isZeroDay ? ZERO_COLORS : (CAT_COLORS[resolution.category] ?? CAT_COLORS.other);
  const rotation  = getRotation(resolution.id);

  // unique IDs per stone to avoid SVG defs collision
  const uid = resolution.id.replace(/-/g, "").slice(0, 10);

  return (
    <div
      className="relative group cursor-pointer animate-graveRise"
      style={{
        transform:       `rotate(${rotation}deg)`,
        transformOrigin: "bottom center",
        animationDelay:  `${animDelay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Stone container ── */}
      <div className="relative" style={{ width: 90, height: 132 }}>

        {/* SVG tombstone */}
        <svg
          viewBox="0 0 100 148"
          style={{ width: 90, height: 132, position: "absolute", inset: 0, filter: "drop-shadow(2px 8px 10px rgba(0,0,0,0.75))" }}
        >
          <defs>
            <linearGradient id={`sg-${uid}`} x1="0.25" y1="0" x2="0.75" y2="1">
              <stop offset="0%"   stopColor={colors.top} />
              <stop offset="100%" stopColor={colors.bot} />
            </linearGradient>

            {/* subtle side-light */}
            <linearGradient id={`sl-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.07)" />
              <stop offset="50%"  stopColor="rgba(255,255,255,0.00)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
            </linearGradient>

            {/* moss gradient at base */}
            <linearGradient id={`ms-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#1a3a1a" stopOpacity="0" />
              <stop offset="100%" stopColor="#0c2a0c" stopOpacity="0.55" />
            </linearGradient>

            <clipPath id={`cp-${uid}`}>
              <path d={shapePath} />
            </clipPath>
          </defs>

          {/* Base stone */}
          <path d={shapePath} fill={`url(#sg-${uid})`} />

          {/* Side-light overlay */}
          <path d={shapePath} fill={`url(#sl-${uid})`} />

          {/* Moss at base */}
          <rect x="0" y="110" width="100" height="38"
            fill={`url(#ms-${uid})`}
            clipPath={`url(#cp-${uid})`} />

          {/* Weathering crack */}
          <path
            d="M 38 68 L 41 85 L 39 96"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.8"
            fill="none"
            clipPath={`url(#cp-${uid})`}
          />
          <path
            d="M 58 78 L 60 88"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="0.6"
            fill="none"
            clipPath={`url(#cp-${uid})`}
          />

          {/* Hover glow */}
          {hovered && (
            <path
              d={shapePath}
              fill="rgba(83,74,183,0.12)"
              stroke="rgba(83,74,183,0.5)"
              strokeWidth="1.5"
            />
          )}

          {/* 0-day lightning */}
          {isZeroDay && (
            <text x="50" y="30" textAnchor="middle" fontSize="11" fill="#ff6a50">
              ⚡
            </text>
          )}
        </svg>

        {/* ── Text overlay ── */}
        <div
          className="absolute inset-0 flex flex-col items-center px-1.5 text-center pointer-events-none"
          style={{ paddingTop: textPt }}
        >
          <span className="leading-none text-[15px]">{cat.emoji}</span>
          <p className="text-[7.5px] font-bold text-white/65 leading-tight mt-[3px] w-full">
            {truncate(resolution.content, 14)}
          </p>
          <p className={`text-[13px] font-black leading-none mt-[3px] ${isZeroDay ? "text-red-400" : "text-white/80"}`}>
            {resolution.survivedDays}일
          </p>
          <p className="text-[6px] italic text-white/35 leading-tight mt-[2px] w-full">
            {truncate(resolution.epitaph, 22)}
          </p>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(resolution.id); }}
            className="absolute top-1 right-0.5 w-[18px] h-[18px] rounded-full bg-red-950/80 text-red-400 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Empathy button (below stone) ── */}
      {onEmpathy && (
        <div className="flex justify-center mt-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onEmpathy(resolution.id); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-all"
            style={{
              background: empathized ? "rgba(83,74,183,0.7)" : "rgba(255,255,255,0.08)",
              border: empathized ? "1px solid rgba(140,128,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
              color: empathized ? "rgba(220,215,255,0.95)" : "rgba(255,255,255,0.35)",
            }}
          >
            {empathized ? "💜" : "🤍"}
            {resolution.empathyCount > 0 && (
              <span>{resolution.empathyCount}</span>
            )}
          </button>
        </div>
      )}

      {/* ── Hover tooltip ── */}
      {hovered && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 rounded-2xl p-3.5 text-xs z-50 shadow-2xl pointer-events-none"
          style={{ background: "rgba(8,4,20,0.96)", border: "1px solid rgba(83,74,183,0.35)", backdropFilter: "blur(6px)" }}
        >
          <p className="font-bold text-white text-[13px] leading-snug mb-0.5">
            {resolution.content}
          </p>
          <p className="text-purple-300/70 italic text-[10px] mb-2">"{resolution.epitaph}"</p>

          <div className="space-y-1 text-[11px]">
            {[
              ["카테고리", `${cat.emoji} ${cat.label}`],
              ["결심한 날", resolution.startedAt],
              ["포기한 날", resolution.endedAt],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-white/35">{k}</span>
                <span className="text-white/70">{v}</span>
              </div>
            ))}
            <div className="flex justify-between">
              <span className="text-white/35">생존 기간</span>
              <span className={`font-bold ${isZeroDay ? "text-red-400" : "text-purple-400"}`}>
                {resolution.survivedDays}일{isZeroDay ? " ⚡" : ""}
              </span>
            </div>
            {resolution.giveUpReason && (
              <div className="flex justify-between">
                <span className="text-white/35">포기 사유</span>
                <span className="text-white/70">{GIVE_UP_REASONS[resolution.giveUpReason]}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
