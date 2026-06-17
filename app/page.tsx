"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Resolution } from "@/types/resolution";
import { getResolutions } from "@/lib/storage";
import { CATEGORIES } from "@/lib/categories";
import GraveCard from "@/components/GraveCard";

export default function HomePage() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);

  useEffect(() => {
    setResolutions(getResolutions());
  }, []);

  const publicOnes = resolutions.filter((r) => r.isPublic);
  const recent = publicOnes.slice(0, 10);
  const top3 = [...publicOnes].sort((a, b) => a.survivedDays - b.survivedDays).slice(0, 3);

  const totalCount = resolutions.length;
  const avgDays =
    totalCount > 0
      ? Math.round(resolutions.reduce((s, r) => s + r.survivedDays, 0) / totalCount)
      : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = resolutions.filter((r) => r.createdAt.startsWith(todayStr)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-14">
      {/* Hero */}
      <section className="text-center py-14 space-y-5">
        <p className="text-5xl">🪦</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2C2A] leading-tight">
          결심 묘지
        </h1>
        <p className="text-[#888780] text-lg">포기도 기록이다</p>
        <p className="text-[#888780] text-sm max-w-sm mx-auto leading-relaxed">
          결심을 포기했나요? 여기에 묻어두세요.<br />
          오래될수록 묘지가 풍성해집니다.
        </p>
        <Link
          href="/my"
          className="inline-block bg-[#534AB7] hover:bg-[#4339a0] text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
        >
          ⚰️ 첫 결심 묻기
        </Link>
      </section>

      {/* 통계 배너 */}
      <section>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "총 묻힌 결심", value: totalCount, unit: "개" },
            { label: "평균 생존 기간", value: avgDays, unit: "일" },
            { label: "오늘 새로 묻힘", value: todayCount, unit: "개" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs text-[#888780] mb-1">{label}</p>
              <p className="text-3xl font-bold text-[#534AB7]">
                {value}
                <span className="text-base font-normal text-[#888780] ml-0.5">{unit}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 불명예의 전당 미리보기 */}
      {top3.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#2C2C2A]">🏅 불명예의 전당</h2>
            <Link href="/hall" className="text-sm text-[#534AB7] hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((r, i) => (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex items-start gap-3"
              >
                <span className="text-2xl">{["🥇", "🥈", "🥉"][i]}</span>
                <div className="min-w-0">
                  <p className="font-medium text-[#2C2C2A] text-sm truncate">{r.content}</p>
                  <p className="text-[#888780] text-xs mt-0.5">{CATEGORIES[r.category].label}</p>
                  <p
                    className={`font-bold text-lg mt-1 ${
                      r.survivedDays === 0 ? "text-[#D85A30]" : "text-[#534AB7]"
                    }`}
                  >
                    {r.survivedDays}일
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 최근 묘비 피드 */}
      {recent.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#2C2C2A]">최근 묻힌 결심</h2>
            <Link href="/public" className="text-sm text-[#534AB7] hover:underline">
              공개 묘지 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((r) => (
              <GraveCard key={r.id} resolution={r} />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center py-12 text-[#888780]">
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-sm">
            아직 묻힌 결심이 없습니다.
            <br />
            첫 번째 묘비를 세워보세요.
          </p>
        </section>
      )}
    </div>
  );
}
