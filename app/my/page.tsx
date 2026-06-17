"use client";

import { useEffect, useState } from "react";
import { Resolution } from "@/types/resolution";
import { getResolutions, deleteResolution } from "@/lib/storage";
import GraveStone from "@/components/GraveStone";
import GraveForm from "@/components/GraveForm";

/* ── Decorative sub-components ─────────────────────────── */

function Stars() {
  // deterministic positions — no hydration mismatch
  const stars = Array.from({ length: 120 }, (_, i) => ({
    x:    ((i * 137.508) % 100).toFixed(2),
    y:    ((i * 71.319)  % 88).toFixed(2),
    r:    i % 11 === 0 ? 2.2 : i % 5 === 0 ? 1.6 : 1.1,
    op:   (0.35 + (i % 8) * 0.08).toFixed(2),
    twinkle: i % 7 === 0,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left:    `${s.x}%`,
            top:     `${s.y}%`,
            width:   s.r,
            height:  s.r,
            opacity: s.op,
            animation: s.twinkle ? `twinkle ${2 + (i % 4)}s ease-in-out infinite` : undefined,
            animationDelay: s.twinkle ? `${(i % 6) * 0.7}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

function Moon() {
  return (
    <div
      className="absolute"
      style={{ top: 28, right: "8%" }}
    >
      {/* outer halo */}
      <div
        className="absolute rounded-full"
        style={{
          width:  90,
          height: 90,
          top:    -13,
          left:   -13,
          background: "radial-gradient(circle, rgba(255,245,200,0.12) 0%, transparent 70%)",
        }}
      />
      {/* moon disc */}
      <div
        className="rounded-full"
        style={{
          width:  64,
          height: 64,
          background: "radial-gradient(circle at 35% 35%, #fffde0, #f5e89a)",
          animation: "moonGlow 4s ease-in-out infinite",
        }}
      />
      {/* crater details */}
      <div
        className="absolute rounded-full"
        style={{ width: 10, height: 10, top: 18, left: 30, background: "rgba(180,160,60,0.25)" }}
      />
      <div
        className="absolute rounded-full"
        style={{ width: 6, height: 6, top: 36, left: 16, background: "rgba(180,160,60,0.18)" }}
      />
    </div>
  );
}

function Fog() {
  const wisps = [
    { w: "55%", top: "32%", dur: "22s", delay: "0s",   opacity: 0.018 },
    { w: "48%", top: "56%", dur: "28s", delay: "-11s", opacity: 0.022 },
    { w: "62%", top: "72%", dur: "19s", delay: "-6s",  opacity: 0.015 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {wisps.map((w, i) => (
        <div
          key={i}
          className="absolute animate-fog"
          style={{
            width:            w.w,
            height:           28,
            top:              w.top,
            background:       "radial-gradient(ellipse at center, white 0%, transparent 70%)",
            filter:           "blur(16px)",
            opacity:          w.opacity,
            animationDuration: w.dur,
            animationDelay:   w.delay,
          }}
        />
      ))}
    </div>
  );
}

function GrassHorizon() {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 80 }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full">
        {/* back hill */}
        <path
          d="M0,42 C180,18 340,52 540,32 C740,12 920,48 1120,34 C1280,24 1370,40 1440,36 L1440,80 L0,80 Z"
          fill="#0e2410"
        />
        {/* front ground */}
        <path
          d="M0,54 C240,36 460,58 680,48 C900,38 1140,56 1440,50 L1440,80 L0,80 Z"
          fill="#091808"
        />
        {/* grass blades silhouette */}
        <path
          d="M0,56 Q8,44 16,56 Q24,44 32,58 Q42,42 52,57 Q65,40 76,56 Q88,43 100,58
             Q120,41 132,57 Q148,43 162,58 Q180,40 194,57 Q210,42 222,58
             Q240,38 252,57 Q268,44 282,58 Q300,40 316,57 Q336,43 352,58
             Q380,38 398,57 Q420,44 440,58 Q468,40 490,57 Q516,43 538,58
             Q570,38 596,57 Q624,44 650,58 Q680,40 708,57 Q738,43 764,58
             Q800,38 830,57 Q860,44 890,58 Q924,40 956,57 Q990,43 1020,58
             Q1060,38 1092,57 Q1126,44 1158,58 Q1196,40 1228,57 Q1264,44 1296,58
             Q1336,38 1370,57 Q1404,44 1440,58 L1440,80 L0,80 Z"
          fill="#102c10"
        />
      </svg>
    </div>
  );
}

function DeadTrees() {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: 200 }}>
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
        {/* left tall tree */}
        <g opacity="0.55" stroke="#0b1e09" fill="none">
          <line x1="40"  y1="195" x2="40"  y2="55"  strokeWidth="6"/>
          <line x1="40"  y1="88"  x2="8"   y2="62"  strokeWidth="3"/>
          <line x1="40"  y1="78"  x2="68"  y2="52"  strokeWidth="2.5"/>
          <line x1="40"  y1="100" x2="10"  y2="82"  strokeWidth="2"/>
          <line x1="40"  y1="112" x2="72"  y2="92"  strokeWidth="2"/>
          <line x1="40"  y1="125" x2="14"  y2="112" strokeWidth="1.5"/>
          <line x1="8"   y1="62"  x2="0"   y2="48"  strokeWidth="1.5"/>
          <line x1="68"  y1="52"  x2="80"  y2="38"  strokeWidth="1.5"/>
        </g>
        {/* left small tree */}
        <g opacity="0.4" stroke="#0b1e09" fill="none">
          <line x1="130" y1="195" x2="130" y2="90"  strokeWidth="4"/>
          <line x1="130" y1="112" x2="106" y2="95"  strokeWidth="2"/>
          <line x1="130" y1="104" x2="152" y2="90"  strokeWidth="2"/>
          <line x1="130" y1="124" x2="108" y2="112" strokeWidth="1.5"/>
          <line x1="130" y1="135" x2="154" y2="122" strokeWidth="1.5"/>
        </g>
        {/* right tall tree */}
        <g opacity="0.55" stroke="#0b1e09" fill="none">
          <line x1="1400" y1="195" x2="1400" y2="45"  strokeWidth="6"/>
          <line x1="1400" y1="78"  x2="1368" y2="52"  strokeWidth="3"/>
          <line x1="1400" y1="68"  x2="1432" y2="44"  strokeWidth="2.5"/>
          <line x1="1400" y1="92"  x2="1370" y2="74"  strokeWidth="2"/>
          <line x1="1400" y1="108" x2="1434" y2="88"  strokeWidth="2"/>
          <line x1="1400" y1="122" x2="1372" y2="108" strokeWidth="1.5"/>
          <line x1="1368" y1="52"  x2="1354" y2="36"  strokeWidth="1.5"/>
          <line x1="1432" y1="44"  x2="1444" y2="30"  strokeWidth="1.5"/>
        </g>
        {/* right small tree */}
        <g opacity="0.4" stroke="#0b1e09" fill="none">
          <line x1="1308" y1="195" x2="1308" y2="98"  strokeWidth="4"/>
          <line x1="1308" y1="118" x2="1284" y2="100" strokeWidth="2"/>
          <line x1="1308" y1="110" x2="1332" y2="96"  strokeWidth="2"/>
          <line x1="1308" y1="132" x2="1286" y2="118" strokeWidth="1.5"/>
        </g>
      </svg>
    </div>
  );
}

function OrnamentalGate() {
  return (
    <div className="flex justify-center pt-3 pb-1 relative z-10 pointer-events-none">
      <svg viewBox="0 0 320 55" className="w-64 sm:w-80" style={{ opacity: 0.45 }}>
        {/* posts */}
        <rect x="10"  y="10" width="10" height="45" fill="#1a3018" rx="2"/>
        <rect x="300" y="10" width="10" height="45" fill="#1a3018" rx="2"/>
        {/* arch bar */}
        <path d="M 20 20 Q 160 0 300 20" stroke="#1a3018" strokeWidth="4" fill="none"/>
        {/* verticals on arch */}
        {[60, 100, 140, 180, 220, 260].map((x) => (
          <line key={x} x1={x} y1="12" x2={x} y2="30" stroke="#1a3018" strokeWidth="2"/>
        ))}
        {/* finials */}
        <polygon points="15,10 20,3 25,10" fill="#1a3018"/>
        <polygon points="305,10 310,3 315,10" fill="#1a3018"/>
        {/* centre finial */}
        <polygon points="157,3 162,-4 167,3" fill="#1a3018"/>
      </svg>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */

export default function MyPage() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [showForm,    setShowForm]    = useState(false);

  useEffect(() => {
    setResolutions(getResolutions());
  }, []);

  function handleSaved(r: Resolution) {
    setResolutions((prev) => [r, ...prev]);
    setShowForm(false);
  }
  function handleDelete(id: string) {
    deleteResolution(id);
    setResolutions((prev) => prev.filter((r) => r.id !== id));
  }

  const total  = resolutions.length;
  const avg    = total > 0 ? Math.round(resolutions.reduce((s, r) => s + r.survivedDays, 0) / total) : 0;
  const zeroes = resolutions.filter((r) => r.survivedDays === 0).length;

  return (
    /* full-bleed: escape the layout's flex-1 wrapper */
    <div style={{ background: "#04020e", minHeight: "calc(100vh - 56px)" }}>

      {/* ══════════════ SKY ══════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 230,
          background: "linear-gradient(to bottom, #020008 0%, #0e0520 35%, #1c0b38 65%, #0d200d 100%)",
        }}
      >
        <Stars />
        <Moon />

        {/* Page heading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
          <h1
            className="font-serif text-3xl font-bold tracking-[0.2em] text-white/90"
            style={{ textShadow: "0 0 30px rgba(150,120,255,0.4)" }}
          >
            내 묘지
          </h1>
          {total > 0 && (
            <p className="text-white/30 text-xs tracking-[0.15em] uppercase">
              {total}개의 결심이 영면 중
            </p>
          )}
        </div>
      </div>

      {/* ══════════════ GROUND ══════════════ */}
      <div
        className="relative"
        style={{
          background: "linear-gradient(to bottom, #0d2010 0%, #071008 40%, #040a04 100%)",
          minHeight: "calc(100vh - 230px - 56px)",
        }}
      >
        {/* grass horizon */}
        <GrassHorizon />

        {/* dead trees */}
        <DeadTrees />

        {/* fog */}
        <Fog />

        {/* ornamental gate */}
        <OrnamentalGate />

        {/* ── stats ── */}
        {total > 0 && (
          <div className="relative z-20 flex justify-center gap-8 pt-2 pb-1">
            {[
              { label: "묻힌 결심", val: total,   unit: "개",  color: "text-purple-400" },
              { label: "평균 생존", val: avg,      unit: "일",  color: "text-purple-400" },
              ...(zeroes > 0 ? [{ label: "0일 기록", val: zeroes, unit: "개", color: "text-red-400" }] : []),
            ].map(({ label, val, unit, color }) => (
              <div key={label} className="text-center">
                <p className="text-white/25 text-[9px] tracking-widest uppercase">{label}</p>
                <p className={`${color} text-lg font-bold leading-tight`}>
                  {val}<span className="text-xs font-normal text-white/30 ml-0.5">{unit}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── gravestones field ── */}
        <div className="relative z-10 flex flex-wrap justify-center items-end gap-y-4 gap-x-3 sm:gap-x-5 px-6 pb-32 pt-6 min-h-48">
          {total === 0 ? (
            <div className="text-center py-20 w-full">
              <p className="text-4xl mb-4" style={{ opacity: 0.2 }}>🌿</p>
              <p className="text-white/20 text-sm tracking-wider">아직 조용한 묘지입니다</p>
              <p className="text-white/12 text-xs mt-1">첫 결심을 묻어보세요</p>
            </div>
          ) : (
            resolutions.map((r, i) => (
              <GraveStone
                key={r.id}
                resolution={r}
                onDelete={handleDelete}
                animDelay={Math.min(i * 60, 600)}
              />
            ))
          )}
        </div>

        {/* bottom ground fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #020608)" }}
        />
      </div>

      {/* ══════════════ FLOATING BUTTON ══════════════ */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold shadow-2xl transition-transform hover:scale-105 active:scale-95"
        style={{
          background:    "linear-gradient(135deg, rgba(83,74,183,0.92), rgba(60,50,140,0.95))",
          border:        "1px solid rgba(140,128,255,0.4)",
          color:         "rgba(230,225,255,0.95)",
          backdropFilter: "blur(8px)",
          boxShadow:     "0 0 24px rgba(83,74,183,0.45), 0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        ⚰️ 결심 묻기
      </button>

      {/* ══════════════ FORM MODAL ══════════════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="w-full max-w-md animate-fadeIn">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowForm(false)}
                className="text-white/40 hover:text-white/80 text-sm transition-colors"
              >
                ✕ 닫기
              </button>
            </div>
            <GraveForm onSaved={handleSaved} />
          </div>
        </div>
      )}
    </div>
  );
}
