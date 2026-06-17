"use client";

import { Resolution } from "@/types/resolution";
import { CATEGORIES, GIVE_UP_REASONS } from "@/lib/categories";

interface Props {
  resolution: Resolution;
  onDelete?: (id: string) => void;
  showEmpathy?: boolean;
  onEmpathy?: (id: string) => void;
  empathized?: boolean;
}

export default function GraveCard({
  resolution,
  onDelete,
  showEmpathy,
  onEmpathy,
  empathized,
}: Props) {
  const cat = CATEGORIES[resolution.category];
  const isZeroDay = resolution.survivedDays === 0;

  return (
    <div className="grave-card bg-white rounded-xl border border-stone-200 shadow-sm p-5 flex flex-col gap-3 relative group animate-fadeIn">
      {onDelete && (
        <button
          onClick={() => onDelete(resolution.id)}
          className="absolute top-3 right-3 w-6 h-6 rounded-full text-stone-300 hover:text-[#D85A30] hover:bg-red-50 flex items-center justify-center text-xs transition-colors opacity-0 group-hover:opacity-100"
          title="삭제"
        >
          ✕
        </button>
      )}

      <div className="text-4xl text-center">{cat.emoji}</div>

      <div className="text-center">
        <p className="font-semibold text-[#2C2C2A] text-base leading-snug">{resolution.content}</p>
        <p className="text-[#888780] text-xs italic mt-1">"{resolution.epitaph}"</p>
      </div>

      <div className="text-center">
        {isZeroDay ? (
          <span className="inline-block bg-[#D85A30] text-white text-xs font-bold px-2 py-0.5 rounded mb-1">
            0일 달성
          </span>
        ) : null}
        <p className={`font-bold text-2xl ${isZeroDay ? "text-[#D85A30]" : "text-[#534AB7]"}`}>
          {resolution.survivedDays}일
        </p>
        <p className="text-[#888780] text-xs">생존</p>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>
          {cat.label}
        </span>
        {resolution.giveUpReason && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-[#888780]">
            {GIVE_UP_REASONS[resolution.giveUpReason] ?? resolution.giveUpReason}
          </span>
        )}
      </div>

      <div className="text-center text-[#888780] text-xs">
        {resolution.startedAt} → {resolution.endedAt}
      </div>

      {showEmpathy && onEmpathy && (
        <button
          onClick={() => onEmpathy(resolution.id)}
          className={`mt-1 w-full py-1.5 rounded-lg text-sm transition-colors ${
            empathized
              ? "bg-[#534AB7] text-white"
              : "bg-stone-50 text-[#888780] hover:bg-[#534AB7]/10 hover:text-[#534AB7]"
          }`}
        >
          나도 이거 포기했어요 {resolution.empathyCount > 0 ? `· ${resolution.empathyCount}` : ""}
        </button>
      )}
    </div>
  );
}
