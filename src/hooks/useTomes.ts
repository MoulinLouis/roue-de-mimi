import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "roue-de-mimi:tomes:v1";

export type Tome = {
  id: string;
  label: string;
};

function loadInitial(): Tome[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Tome =>
        typeof t === "object" &&
        t !== null &&
        typeof t.id === "string" &&
        typeof t.label === "string",
    );
  } catch {
    return [];
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useTomes() {
  const [tomes, setTomes] = useState<Tome[]>(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tomes));
    } catch {
      // ignore quota / private mode errors
    }
  }, [tomes]);

  const add = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return false;
    setTomes((prev) => {
      if (prev.some((t) => t.label.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, { id: makeId(), label: trimmed }];
    });
    return true;
  }, []);

  const remove = useCallback((id: string) => {
    setTomes((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => {
    setTomes([]);
  }, []);

  const rename = useCallback((id: string, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setTomes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, label: trimmed } : t)),
    );
  }, []);

  return { tomes, add, remove, clear, rename };
}
