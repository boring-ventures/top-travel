// Minimal server-side sanitizers to mitigate XSS in stored content.
// For production-hardening, consider a dedicated library like DOMPurify with JSDOM.

const SCRIPT_TAG_REGEX = /<\s*\/??\s*script[^>]*>/gi;
const STYLE_TAG_REGEX = /<\s*\/??\s*style[^>]*>/gi;
const EVENT_HANDLER_ATTR_REGEX = /on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_REGEX = /href\s*=\s*("|')\s*javascript:[^"']*(\1)/gi;

export function sanitizeHtmlString(input?: string | null): string | undefined {
  if (typeof input !== "string") return input ?? undefined;
  let safe = input;
  safe = safe.replace(SCRIPT_TAG_REGEX, "");
  safe = safe.replace(STYLE_TAG_REGEX, "");
  safe = safe.replace(EVENT_HANDLER_ATTR_REGEX, "");
  safe = safe.replace(JAVASCRIPT_URL_REGEX, 'href="#"');
  return safe;
}

export function sanitizeRichJson<T = unknown>(value: T): T {
  if (value == null) return value;
  if (typeof value === "string") {
    return sanitizeHtmlString(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeRichJson(v)) as unknown as T;
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeRichJson(v);
    }
    return out as unknown as T;
  }
  return value;
}
