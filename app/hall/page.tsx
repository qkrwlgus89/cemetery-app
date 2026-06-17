"use client";

import { useEffect, useState } from "react";
import { Resolution } from "@/types/resolution";
import { getResolutions } from "@/lib/storage";
import { CATEGORIES } from "@/lib/categories";
import { Category } from "@/types/resolution";

export default function HallPage() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);

  useEffect(() => {
    setResolutions(getResolutions());
  }, []);

  const sorted = [...resolutions].sort((a, b) => a.survivedDays - b.survivedDays);
  const top10 = sorted.slice(0, 10);

  const todayStr = new Date().toISOString().split("T")[0];
  const thisWeek = resolutions.filter((r) => {
    const d = new Date(r.createdAt);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const catRecords: Partial<Record<Category, Resolution>> = {};
  for (const r of sorted) {
    if (!catRecords[r.category]) catRecords[r.category] = r;
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2C2C2A]">🏅 불명예의 전당</h1>
        <p className="text-[#888780] text-sm mt-1">가장 빠르게 포기한 결심들이 여기 영구 전시됩니다.</p>
      </div>

      {/* 0일 달성자 배지 */}
      {resolutions.some((r) => r.survivedDays === 0) && (
        <div className="bg-[#D85A30]/10 border border-[#D85A30]/30 rounded-xl p-5 flex items-center gap-4">
          <span className="text-4xl">⚡</span>
          <div>
            <p className="font-bold text-[#D85A30]">0일 달성</p>
            <p className="text-sm text-[#888780]">결심과 포기가 동시에 일어난 특별한 기록을 보유하고 있습니다.</p>
          </div>
        </div>
      )}

      {/* 전체 랭킹 */}
      {top10.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2C2C2A]">최단 생존 TOP 10</h2>
          <div className="space-y-2">
            {top10.map((r, i) => (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4 shadow-sm"
              >
                <span className="text-2xl w-8 text-center shrink-0">
                  {i < 3 ? medals[i] : <span className="text-[#888780] font-bold text-lg">{i + 1}</span>}
                </span>
                <span className="text-2xl">{CATEGORIES[r.category].emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2C2C2A] truncate">{r.content}</p>
                  <p className="text-xs text-[#888780] mt-0.5 italic">"{r.epitaph}"</p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-xl font-bold ${
                      r.survivedDays === 0 ? "text-[#D85A30]" : "text-[#534AB7]"
                    }`}
                  >
                    {r.survivedDays}일
                  </p>
                  <p className="text-xs text-[#888780]">{CATEGORIES[r.category].label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-20 text-[#888780]">
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-sm">아직 묻힌 결심이 없습니다. 내 묘지에서 첫 결심을 묻어보세요.</p>
        </div>
      )}

      {/* 카테고리별 최단 기록 */}
      {Object.keys(catRecords).length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2C2C2A]">카테고리별 최단 기록</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {(Object.entries(catRecords) as [Category, Resolution][]).map(([cat, r]) => (
              <div
                key={cat}
                className="bg-white border border-stone-200 rounded-xl p-4 text-center shadow-sm"
              >
                <p className="text-3xl mb-1">{CATEGORIES[cat].emoji}</p>
                <p className="text-xs text-[#888780] mb-1">{CATEGORIES[cat].label}</p>
                <p
                  className={`text-2xl font-bold ${
                    r.survivedDays === 0 ? "text-[#D85A30]" : "text-[#534AB7]"
                  }`}
                >
                  {r.survivedDays}일
                </p>
                <p className="text-xs text-[#888780] truncate mt-0.5">{r.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 이번 주 통계 */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-[#2C2C2A] mb-4">이번 주 묘비 통계</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "새로 묻힌 결심", value: thisWeek.length, unit: "개" },
            {
              label: "평균 생존",
              value:
                thisWeek.length > 0
                  ? Math.round(thisWeek.reduce((s, r) => s + r.survivedDays, 0) / thisWeek.length)
                  : 0,
              unit: "일",
            },
            {
              label: "0일 달성",
              value: thisWeek.filter((r) => r.survivedDays === 0).length,
              unit: "개",
            },
          ].map(({ label, value, unit }) => (
            <div key={label}>
              <p className="text-xs text-[#888780] mb-1">{label}</p>
              <p className="text-2xl font-bold text-[#534AB7]">
                {value}
                <span className="text-sm font-normal text-[#888780] ml-0.5">{unit}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
