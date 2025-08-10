type Bucket = { count: number; resetAt: number };

const globalBuckets = (globalThis as any).__rate_limit_buckets__ as
  | Map<string, Bucket>
  | undefined;

const buckets: Map<string, Bucket> = globalBuckets ?? new Map();
(globalThis as any).__rate_limit_buckets__ = buckets;

export interface RateLimitOptions {
  limit: number; // max requests in window
  windowMs: number; // window length in ms
  keyPrefix?: string; // logical name per endpoint
}

export async function rateLimit(
  request: Request,
  { limit, windowMs, keyPrefix = "rl" }: RateLimitOptions
): Promise<void> {
  const ipHeader = request.headers.get("x-forwarded-for") || "";
  const ip = ipHeader.split(",")[0]?.trim() || "unknown";
  const path = new URL(request.url).pathname;
  const key = `${keyPrefix}:${path}:${ip}`;

  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    const error: any = new Error("Too Many Requests");
    error.status = 429;
    throw error;
  }

  bucket.count += 1;
}
