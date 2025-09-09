"use client";

import { useEffect } from "react";

type UtmValues = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}>;

const STORAGE_KEY = "utmParams";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 90; // 90 days

export function UtmProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const params = new URLSearchParams(window.location.search);
      const incoming: UtmValues = {};
      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ].forEach((k) => {
        const v = params.get(k);
        if (v) (incoming as Record<string, string>)[k] = v;
      });

      const hasIncoming = Object.keys(incoming).length > 0;
      if (!hasIncoming) return;

      const now = Date.now();
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      let merged: UtmValues = incoming;
      if (existingRaw) {
        try {
          const existing = JSON.parse(existingRaw) as {
            ts: number;
            values: UtmValues;
          };
          if (now - existing.ts < MAX_AGE_MS) {
            merged = { ...existing.values, ...incoming };
          }
        } catch {
          // ignore parse errors
        }
      }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ts: now, values: merged })
      );
      // Also expose to window for easy access in analytics handlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__utm = merged;
    } catch {
      // no-op
    }
  }, []);

  return null;
}

export function getPersistedUtm(): UtmValues | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const { ts, values } = JSON.parse(raw) as { ts: number; values: UtmValues };
    if (Date.now() - ts > MAX_AGE_MS) return undefined;
    return values;
  } catch {
    return undefined;
  }
}

export default UtmProvider;
