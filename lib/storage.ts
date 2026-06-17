import { Resolution } from "@/types/resolution";

const STORAGE_KEY = "cemetery-graves";
const SESSION_KEY = "cemetery-session-id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getResolutions(): Resolution[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResolution(resolution: Resolution): void {
  const existing = getResolutions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([resolution, ...existing]));
}

export function deleteResolution(id: string): void {
  const existing = getResolutions();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing.filter((r) => r.id !== id))
  );
}

export function toggleEmpathy(resolutionId: string, sessionId: string): Resolution[] {
  const resolutions = getResolutions();
  const EMPATHY_KEY = "cemetery-empathies";
  let empathies: Record<string, boolean> = {};
  try {
    empathies = JSON.parse(localStorage.getItem(EMPATHY_KEY) || "{}");
  } catch { /* empty */ }

  const key = `${resolutionId}:${sessionId}`;
  const alreadyEmpathized = empathies[key];

  const updated = resolutions.map((r) => {
    if (r.id !== resolutionId) return r;
    return {
      ...r,
      empathyCount: alreadyEmpathized
        ? Math.max(0, r.empathyCount - 1)
        : r.empathyCount + 1,
    };
  });

  if (alreadyEmpathized) {
    delete empathies[key];
  } else {
    empathies[key] = true;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  localStorage.setItem(EMPATHY_KEY, JSON.stringify(empathies));
  return updated;
}

export function hasEmpathized(resolutionId: string, sessionId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const empathies = JSON.parse(localStorage.getItem("cemetery-empathies") || "{}");
    return !!empathies[`${resolutionId}:${sessionId}`];
  } catch {
    return false;
  }
}

export function calcSurvivedDays(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}
