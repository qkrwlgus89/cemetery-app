import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "결심 묘지 — 포기도 기록이다",
  description: "당신이 포기한 결심들을 묘지에 잠들게 하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F5F3EE]">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <footer className="text-center text-xs text-[#888780] py-6 border-t border-stone-200">
          여기 잠들다, 한때의 의지 🪦
        </footer>
      </body>
    </html>
  );
}
