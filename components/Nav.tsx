"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/",       label: "광장" },
  { href: "/my",     label: "내 묘지" },
  { href: "/public", label: "공개 묘지" },
  { href: "/hall",   label: "불명예의 전당" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-stone-200 bg-[#F5F3EE]">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 h-14">
        <Link href="/" className="font-serif text-lg font-bold text-[#2C2C2A] mr-6 tracking-tight">
          🪦 결심묘지
        </Link>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              pathname === href
                ? "bg-[#534AB7] text-white font-medium"
                : "text-[#888780] hover:text-[#2C2C2A] hover:bg-stone-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
