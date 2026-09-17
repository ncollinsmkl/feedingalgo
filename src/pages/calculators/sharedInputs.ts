import { SHARED_STORAGE_KEY, type SharedInputs } from "./types";

/**
 * Persists the given fields to localStorage so the other calculator can
 * pick them up. Mirrors the original saveSharedInputs() — silently no-ops
 * if localStorage is unavailable (e.g. private browsing).
 */
export function saveSharedInputs(data: SharedInputs): void {
  try {
    // Only persist non-empty values, matching the original's behaviour.
    const filtered: SharedInputs = {};
    (Object.keys(data) as (keyof SharedInputs)[]).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== "") {
        filtered[key] = value;
      }
    });
    localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Ignore storage errors (private browsing, quota, etc.)
  }
}

/**
 * Reads whatever the other calculator last saved. Returns null if nothing
 * is stored or the value can't be parsed.
 */
export function loadSharedInputs(): SharedInputs | null {
  try {
    const raw = localStorage.getItem(SHARED_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SharedInputs;
    return Object.keys(parsed).length > 0 ? parsed : null;
  } catch {
    return null;
  }
}
