import { Resolution } from "@/types/resolution";
import { CATEGORIES } from "@/lib/categories";

interface Props {
  resolutions: Resolution[];
  variant?: "full" | "mini";
}

export default function StatsBar({ resolutions, variant = "full" }: Props) {
  const count = resolutions.length;
  const avg = count > 0 ? Math.round(resolutions.reduce((s, r) => s + r.survivedDays, 0) / count) : 0;
  const sorted = [...resolutions].sort((a, b) => a.survivedDays - b.survivedDays);
  const shortest = sorted[0];
  const longest = sorted[sorted.length - 1];

  if (variant === "mini") {
    return (
      <div className="flex flex-wrap gap-4 text-sm text-[#888780]">
        <span>묻힌 결심 <strong className="text-[#534AB7]">{count}개</strong></span>
        <span>평균 생존 <strong className="text-[#534AB7]">{avg}일</strong></span>
        {shortest && (
          <span>최단 <strong className="text-[#D85A30]">{shortest.survivedDays}일</strong></span>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "총 묻힌 결심", value: `${count}개`, sub: "", accent: false },
        { label: "평균 생존 기간", value: `${avg}일`, sub: "", accent: false },
        {
          label: "최단 생존 기록",
          value: shortest ? `${shortest.survivedDays}일` : "-",
          sub: shortest ? CATEGORIES[shortest.category].label : "",
          accent: true,
        },
        {
          label: "최장 생존 기록",
          value: longest ? `${longest.survivedDays}일` : "-",
          sub: longest ? CATEGORIES[longest.category].label : "",
          accent: false,
        },
      ].map(({ label, value, sub, accent }) => (
        <div key={label} className="bg-white border border-stone-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs text-[#888780] mb-1">{label}</p>
          <p className={`text-2xl font-bold ${accent ? "text-[#D85A30]" : "text-[#534AB7]"}`}>{value}</p>
          {sub && <p className="text-xs text-[#888780] mt-0.5">{sub}</p>}
        </div>
      ))}
    </div>
  );
}
