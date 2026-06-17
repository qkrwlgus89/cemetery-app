import { Category } from "@/types/resolution";

export interface CategoryMeta {
  label: string;
  emoji: string;
  color: string; // tailwind bg class
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  diet:     { label: "다이어트", emoji: "🥗", color: "bg-green-100 text-green-800" },
  exercise: { label: "운동",     emoji: "💪", color: "bg-blue-100 text-blue-800" },
  study:    { label: "공부",     emoji: "📚", color: "bg-yellow-100 text-yellow-800" },
  habit:    { label: "습관",     emoji: "⏰", color: "bg-orange-100 text-orange-800" },
  money:    { label: "금전",     emoji: "💸", color: "bg-emerald-100 text-emerald-800" },
  love:     { label: "연애",     emoji: "❤️", color: "bg-pink-100 text-pink-800" },
  other:    { label: "기타",     emoji: "✨", color: "bg-gray-100 text-gray-700" },
};

export const GIVE_UP_REASONS: Record<string, string> = {
  lazy:    "귀찮아서",
  busy:    "바빠서",
  just:    "그냥",
  youtube: "유튜브 때문에",
  weather: "날씨 때문에",
  other:   "기타",
};

export const CATEGORY_OPTIONS = (Object.keys(CATEGORIES) as Category[]).map((key) => ({
  value: key,
  ...CATEGORIES[key],
}));
