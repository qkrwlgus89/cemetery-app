"use client";

import { useEffect, useState } from "react";
import { Category, Resolution } from "@/types/resolution";
import { getResolutions, toggleEmpathy, hasEmpathized, getSessionId } from "@/lib/storage";
import { CATEGORIES } from "@/lib/categories";
import GraveStone from "@/components/GraveStone";

type SortKey = "newest" | "empathy" | "shortest";

/* ── Shared scene elements (same as /my) ─────────────── */

function Stars() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    x:  ((i * 137.508) % 100).toFixed(2),
    y:  ((i * 71.319)  % 88).toFixed(2),
    r:  i % 11 === 0 ? 2.2 : i % 5 === 0 ? 1.6 : 1.1,
    op: (0.35 + (i % 8) * 0.08).toFixed(2),
    tw: i % 7 === 0,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.r, height: s.r, opacity: s.op,
            animation: s.tw ? `twinkle ${2 + (i % 4)}s ease-in-out infinite` : undefined,
            animationDelay: s.tw ? `${(i % 6) * 0.7}s` : undefined,
          }} />
      ))}
    </div>
  );
}

function Moon() {
  return (
    <div className="absolute" style={{ top: 28, left: "8%" }}>
      <div className="absolute rounded-full"
        style={{ width: 90, height: 90, top: -13, left: -13,
          background: "radial-gradient(circle, rgba(255,245,200,0.12) 0%, transparent 70%)" }} />
      <div className="rounded-full"
        style={{ width: 56, height: 56,
          background: "radial-gradient(circle at 38% 38%, #fffde0, #f5e89a)",
          animation: "moonGlow 4s ease-in-out infinite" }} />
    </div>
  );
}

function Fog() {
  const wisps = [
    { w: "52%", top: "30%", dur: "22s", delay: "-2s",  op: 0.018 },
    { w: "45%", top: "55%", dur: "28s", delay: "-12s", op: 0.022 },
    { w: "60%", top: "72%", dur: "19s", delay: "-6s",  op: 0.015 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {wisps.map((w, i) => (
        <div key={i} className="absolute animate-fog"
          style={{ width: w.w, height: 28, top: w.top,
            background: "radial-gradient(ellipse at center, white 0%, transparent 70%)",
            filter: "blur(16px)", opacity: w.op,
            animationDuration: w.dur, animationDelay: w.delay }} />
      ))}
    </div>
  );
}

function GrassHorizon() {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 80 }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full">
        <path d="M0,42 C180,18 340,52 540,32 C740,12 920,48 1120,34 C1280,24 1370,40 1440,36 L1440,80 L0,80 Z" fill="#0e2410" />
        <path d="M0,54 C240,36 460,58 680,48 C900,38 1140,56 1440,50 L1440,80 L0,80 Z" fill="#091808" />
        <path d="M0,56 Q8,44 16,56 Q24,44 32,58 Q42,42 52,57 Q65,40 76,56 Q88,43 100,58
           Q120,41 132,57 Q148,43 162,58 Q180,40 194,57 Q210,42 222,58
           Q240,38 252,57 Q268,44 282,58 Q300,40 316,57 Q336,43 352,58
           Q380,38 398,57 Q420,44 440,58 Q468,40 490,57 Q516,43 538,58
           Q570,38 596,57 Q624,44 650,58 Q680,40 708,57 Q738,43 764,58
           Q800,38 830,57 Q860,44 890,58 Q924,40 956,57 Q990,43 1020,58
           Q1060,38 1092,57 Q1126,44 1158,58 Q1196,40 1228,57 Q1264,44 1296,58
           Q1336,38 1370,57 Q1404,44 1440,58 L1440,80 L0,80 Z" fill="#102c10" />
      </svg>
    </div>
  );
}

function DeadTrees() {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: 200 }}>
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
        <g opacity="0.5" stroke="#0b1e09" fill="none">
          <line x1="40"  y1="195" x2="40"  y2="55"  strokeWidth="6"/>
          <line x1="40"  y1="88"  x2="8"   y2="62"  strokeWidth="3"/>
          <line x1="40"  y1="78"  x2="68"  y2="52"  strokeWidth="2.5"/>
          <line x1="40"  y1="100" x2="10"  y2="82"  strokeWidth="2"/>
          <line x1="40"  y1="112" x2="72"  y2="92"  strokeWidth="2"/>
          <line x1="8"   y1="62"  x2="0"   y2="48"  strokeWidth="1.5"/>
          <line x1="68"  y1="52"  x2="80"  y2="38"  strokeWidth="1.5"/>
        </g>
        <g opacity="0.38" stroke="#0b1e09" fill="none">
          <line x1="130" y1="195" x2="130" y2="90"  strokeWidth="4"/>
          <line x1="130" y1="112" x2="106" y2="95"  strokeWidth="2"/>
          <line x1="130" y1="104" x2="152" y2="90"  strokeWidth="2"/>
          <line x1="130" y1="125" x2="108" y2="112" strokeWidth="1.5"/>
        </g>
        <g opacity="0.5" stroke="#0b1e09" fill="none">
          <line x1="1400" y1="195" x2="1400" y2="45"  strokeWidth="6"/>
          <line x1="1400" y1="78"  x2="1368" y2="52"  strokeWidth="3"/>
          <line x1="1400" y1="68"  x2="1432" y2="44"  strokeWidth="2.5"/>
          <line x1="1400" y1="92"  x2="1370" y2="74"  strokeWidth="2"/>
          <line x1="1400" y1="108" x2="1434" y2="88"  strokeWidth="2"/>
          <line x1="1368" y1="52"  x2="1354" y2="36"  strokeWidth="1.5"/>
          <line x1="1432" y1="44"  x2="1444" y2="30"  strokeWidth="1.5"/>
        </g>
        <g opacity="0.38" stroke="#0b1e09" fill="none">
          <line x1="1308" y1="195" x2="1308" y2="98"  strokeWidth="4"/>
          <line x1="1308" y1="118" x2="1284" y2="100" strokeWidth="2"/>
          <line x1="1308" y1="110" x2="1332" y2="96"  strokeWidth="2"/>
          <line x1="1308" y1="132" x2="1286" y2="118" strokeWidth="1.5"/>
        </g>
      </svg>
    </div>
  );
}

/* ── Filter bar ──────────────────────────────────────── */

const CAT_FILTERS: { value: Category | "all"; label: string; emoji: string }[] = [
  { value: "all",      label: "전체",    emoji: "🪦" },
  { value: "diet",     label: "다이어트", emoji: "🥗" },
  { value: "exercise", label: "운동",    emoji: "💪" },
  { value: "study",    label: "공부",    emoji: "📚" },
  { value: "habit",    label: "습관",    emoji: "⏰" },
  { value: "money",    label: "금전",    emoji: "💸" },
  { value: "love",     label: "연애",    emoji: "❤️" },
  { value: "other",    label: "기타",    emoji: "✨" },
];

interface FilterBarProps {
  filter: Category | "all";
  sort: SortKey;
  onFilter: (c: Category | "all") => void;
  onSort: (s: SortKey) => void;
}

function FilterBar({ filter, sort, onFilter, onSort }: FilterBarProps) {
  return (
    <div
      className="relative z-30 flex flex-wrap items-center gap-2 px-4 py-3"
      style={{ background: "rgba(4,2,14,0.75)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex flex-wrap gap-1.5 flex-1">
        {CAT_FILTERS.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => onFilter(value)}
            className="px-2.5 py-1 rounded-full text-[11px] transition-all"
            style={{
              background: filter === value ? "rgba(83,74,183,0.75)" : "rgba(255,255,255,0.06)",
              border:     filter === value ? "1px solid rgba(140,128,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
              color:      filter === value ? "rgba(230,225,255,0.95)" : "rgba(255,255,255,0.4)",
            }}
          >
            {emoji} {label}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value as SortKey)}
        className="text-[11px] rounded-full px-3 py-1 outline-none"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
      >
        <option value="newest">최신순</option>
        <option value="empathy">공감 많은 순</option>
        <option value="shortest">생존 짧은 순</option>
      </select>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────── */

export default function PublicPage() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [sessionId,   setSessionId]   = useState("");
  const [empathized,  setEmpathized]  = useState<Record<string, boolean>>({});
  const [filter,      setFilter]      = useState<Category | "all">("all");
  const [sort,        setSort]        = useState<SortKey>("newest");

  useEffect(() => {
    const sid = getSessionId();
    setSessionId(sid);
    const all = getResolutions().filter((r) => r.isPublic);
    setResolutions(all);
    const map: Record<string, boolean> = {};
    for (const r of all) map[r.id] = hasEmpathized(r.id, sid);
    setEmpathized(map);
  }, []);

  function handleEmpathy(id: string) {
    const updated = toggleEmpathy(id, sessionId).filter((r) => r.isPublic);
    setResolutions(updated);
    setEmpathized((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const filtered = resolutions.filter((r) => filter === "all" || r.category === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "empathy")  return b.empathyCount - a.empathyCount;
    if (sort === "shortest") return a.survivedDays - b.survivedDays;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const total   = resolutions.length;
  const empTotal = resolutions.reduce((s, r) => s + r.empathyCount, 0);

  return (
    <div style={{ background: "#04020e", minHeight: "calc(100vh - 56px)" }}>

      {/* ══════════════ SKY ══════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ height: 200, background: "linear-gradient(to bottom, #020008 0%, #0e0520 35%, #1c0b38 65%, #0d200d 100%)" }}
      >
        <Stars />
        <Moon />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
          <h1
            className="font-serif text-3xl font-bold tracking-[0.2em] text-white/90"
            style={{ textShadow: "0 0 30px rgba(150,120,255,0.4)" }}
          >
            공개 묘지
          </h1>
          {total > 0 && (
            <div className="flex gap-5 text-center">
              <span className="text-white/30 text-xs tracking-wider">{total}개의 묘비</span>
              {empTotal > 0 && <span className="text-white/30 text-xs tracking-wider">공감 {empTotal}회</span>}
            </div>
          )}
        </div>
      </div>

      {/* ── filter bar (between sky and ground) ── */}
      <FilterBar filter={filter} sort={sort} onFilter={setFilter} onSort={setSort} />

      {/* ══════════════ GROUND ══════════════ */}
      <div
        className="relative"
        style={{ background: "linear-gradient(to bottom, #0d2010 0%, #071008 40%, #040a04 100%)", minHeight: "calc(100vh - 200px - 56px - 56px)" }}
      >
        <GrassHorizon />
        <DeadTrees />
        <Fog />

        {/* gravestones */}
        <div className="relative z-10 flex flex-wrap justify-center items-end gap-y-6 gap-x-3 sm:gap-x-5 px-6 pb-24 pt-8 min-h-64">
          {sorted.length === 0 ? (
            <div className="text-center py-20 w-full">
              <p className="text-4xl mb-4" style={{ opacity: 0.2 }}>🌿</p>
              <p className="text-white/20 text-sm tracking-wider">
                {total === 0 ? "공개된 결심이 없습니다" : "해당 카테고리의 묘비가 없습니다"}
              </p>
            </div>
          ) : (
            sorted.map((r, i) => (
              <GraveStone
                key={r.id}
                resolution={r}
                animDelay={Math.min(i * 50, 500)}
                onEmpathy={handleEmpathy}
                empathized={empathized[r.id]}
              />
            ))
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #020608)" }}
        />
      </div>
    </div>
  );
}
