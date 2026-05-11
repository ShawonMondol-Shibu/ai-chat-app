const stores = new Map<string, { count: number; resetAt: number }>();

export function createRateLimiter(windowMs: number, maxRequests: number) {
  return {
    check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
      const now = Date.now();
      const entry = stores.get(key);

      if (!entry || now > entry.resetAt) {
        stores.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
      }

      if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
      }

      entry.count++;
      return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
    },
  };
}

export const chatRateLimiter = createRateLimiter(60_000, 30);
export const storageRateLimiter = createRateLimiter(60_000, 100);
