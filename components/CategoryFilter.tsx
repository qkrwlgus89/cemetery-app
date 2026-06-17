"use client";

import { Category } from "@/types/resolution";
import { CATEGORIES } from "@/lib/categories";

interface Props {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const all = [{ value: "all" as const, label: "전체", emoji: "🪦" }];
  const cats = (Object.keys(CATEGORIES) as Category[]).map((k) => ({
    value: k,
    label: CATEGORIES[k].label,
    emoji: CATEGORIES[k].emoji,
  }));

  return (
    <div className="flex flex-wrap gap-2">
      {[...all, ...cats].map(({ value, label, emoji }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
            selected === value
              ? "bg-[#534AB7] text-white border-[#534AB7]"
              : "border-stone-200 text-[#888780] hover:border-[#534AB7] hover:text-[#534AB7] bg-white"
          }`}
        >
          {emoji} {label}
        </button>
      ))}
    </div>
  );
}
