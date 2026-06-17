"use client";

import { useState } from "react";
import { Category, GiveUpReason, Resolution } from "@/types/resolution";
import { CATEGORY_OPTIONS, GIVE_UP_REASONS } from "@/lib/categories";
import { getRandomEpitaph } from "@/lib/epitaphs";
import { calcSurvivedDays, getSessionId, saveResolution } from "@/lib/storage";

const today = () => new Date().toISOString().split("T")[0];

interface Props {
  onSaved: (r: Resolution) => void;
}

export default function GraveForm({ onSaved }: Props) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("other");
  const [startedAt, setStartedAt] = useState(today());
  const [endedAt, setEndedAt] = useState(today());
  const [giveUpReason, setGiveUpReason] = useState<GiveUpReason>("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) { setError("결심 내용을 입력하세요."); return; }
    if (endedAt < startedAt) { setError("포기한 날짜가 결심한 날짜보다 빠를 수 없어요."); return; }
    setError("");

    const survivedDays = calcSurvivedDays(startedAt, endedAt);
    const resolution: Resolution = {
      id: crypto.randomUUID(),
      content: content.trim(),
      category,
      startedAt,
      endedAt,
      survivedDays,
      giveUpReason,
      epitaph: getRandomEpitaph(survivedDays),
      isPublic,
      empathyCount: 0,
      createdAt: new Date().toISOString(),
      sessionId: getSessionId(),
    };

    saveResolution(resolution);
    onSaved(resolution);
    setContent("");
    setCategory("other");
    setStartedAt(today());
    setEndedAt(today());
    setGiveUpReason("");
    setIsPublic(true);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-serif text-lg font-bold text-[#2C2C2A]">새 결심 묻기</h2>

      <div>
        <label className="block text-sm text-[#888780] mb-1">결심 내용 <span className="text-[#D85A30]">*</span></label>
        <input
          type="text"
          maxLength={50}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="예: 매일 아침 6시에 일어나기"
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#2C2C2A] placeholder:text-stone-300 focus:outline-none focus:border-[#534AB7] transition-colors"
        />
        <p className="text-xs text-stone-300 text-right mt-0.5">{content.length}/50</p>
      </div>

      <div>
        <label className="block text-sm text-[#888780] mb-1">카테고리 <span className="text-[#D85A30]">*</span></label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCategory(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                category === opt.value
                  ? "bg-[#534AB7] text-white border-[#534AB7]"
                  : "border-stone-200 text-[#888780] hover:border-[#534AB7] hover:text-[#534AB7]"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-[#888780] mb-1">결심한 날짜 <span className="text-[#D85A30]">*</span></label>
          <input
            type="date"
            value={startedAt}
            max={today()}
            onChange={(e) => setStartedAt(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#2C2C2A] focus:outline-none focus:border-[#534AB7] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#888780] mb-1">포기한 날짜 <span className="text-[#D85A30]">*</span></label>
          <input
            type="date"
            value={endedAt}
            max={today()}
            onChange={(e) => setEndedAt(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#2C2C2A] focus:outline-none focus:border-[#534AB7] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#888780] mb-1">포기 사유 (선택)</label>
        <select
          value={giveUpReason}
          onChange={(e) => setGiveUpReason(e.target.value as GiveUpReason)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#2C2C2A] focus:outline-none focus:border-[#534AB7] transition-colors bg-white"
        >
          <option value="">선택 안 함</option>
          {Object.entries(GIVE_UP_REASONS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="accent-[#534AB7]"
        />
        <label htmlFor="isPublic" className="text-sm text-[#888780]">공개 묘지에도 전시하기</label>
      </div>

      {error && <p className="text-sm text-[#D85A30]">{error}</p>}

      <button
        type="submit"
        className="w-full bg-[#534AB7] hover:bg-[#4339a0] text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
      >
        ⚰️ 매장하기
      </button>
    </form>
  );
}
