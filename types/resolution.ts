export type Category =
  | "diet"
  | "exercise"
  | "study"
  | "habit"
  | "money"
  | "love"
  | "other";

export type GiveUpReason =
  | "lazy"
  | "busy"
  | "just"
  | "youtube"
  | "weather"
  | "other"
  | "";

export interface Resolution {
  id: string;
  content: string;
  category: Category;
  startedAt: string; // ISO date string YYYY-MM-DD
  endedAt: string;   // ISO date string YYYY-MM-DD
  survivedDays: number;
  giveUpReason: GiveUpReason;
  epitaph: string;
  isPublic: boolean;
  empathyCount: number;
  createdAt: string; // ISO timestamp
  sessionId: string; // for empathy dedup
}
