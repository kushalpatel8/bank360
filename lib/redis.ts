import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default redis;

// Cache helper
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300
): Promise<T> {
  try {
    const cached = await redis.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  } catch {
    // Fallback to direct fetch if Redis fails
    return fetcher();
  }
}

// Rate limiter
export async function rateLimit(
  identifier: string,
  limit = 10,
  window = 60
): Promise<{ success: boolean; remaining: number }> {
  try {
    const key = `rate_limit:${identifier}`;
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, window);
    }
    return { success: current <= limit, remaining: Math.max(0, limit - current) };
  } catch {
    return { success: true, remaining: limit };
  }
}
