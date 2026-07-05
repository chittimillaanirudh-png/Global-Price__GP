// src/engine/cache.ts
import { CacheEntry } from "../types";

export const getCache = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(`gp_cache_${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    return entry.data;
  } catch (e) {
    console.error("Cache read failed", e);
    return null;
  }
};

export const isCacheExpired = (key: string): boolean => {
  try {
    const raw = localStorage.getItem(`gp_cache_${key}`);
    if (!raw) return true;

    const entry: CacheEntry<unknown> = JSON.parse(raw);
    const ageMs = Date.now() - entry.timestamp;
    const expiryMs = entry.expires_in_hours * 60 * 60 * 1000;
    return ageMs > expiryMs;
  } catch (e) {
    return true;
  }
};

export const setCache = <T>(key: string, data: T, expiresInHours: number): void => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expires_in_hours: expiresInHours
    };
    localStorage.setItem(`gp_cache_${key}`, JSON.stringify(entry));
  } catch (e) {
    console.error("Cache write failed", e);
  }
};

// Previous GP value cache for EWMA smoothing
export const getPreviousGP = (categoryId: string): number | null => {
  try {
    const val = localStorage.getItem(`gp_prev_${categoryId}`);
    return val ? parseFloat(val) : null;
  } catch (e) {
    return null;
  }
};

export const saveGP = (categoryId: string, gp: number): void => {
  try {
    localStorage.setItem(`gp_prev_${categoryId}`, gp.toString());
  } catch (e) {
    console.error("Previous GP save failed", e);
  }
};
