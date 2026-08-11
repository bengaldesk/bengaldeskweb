import { Redis } from '@upstash/redis'

let redis: Redis | null = null

export function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required')
    }
    redis = new Redis({ url, token })
  }
  return redis
}

/**
 * Rate limiter using Upstash Redis sliding window.
 * Returns { success, remaining, reset } 
 */
export async function rateLimit(
  identifier: string,
  opts?: { limit?: number; window?: number }
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const redis = getRedis()
  const limit = opts?.limit ?? 60
  const windowSeconds = opts?.window ?? 60

  const key = `ratelimit:${identifier}`
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - windowSeconds

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(key, 0, windowStart)
  pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` })
  pipeline.zcard(key)
  pipeline.expire(key, windowSeconds + 1)

  const results = await pipeline.exec()
  const count = results?.[2] ?? 0

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: now + windowSeconds,
  }
}

/**
 * Simple cache helpers
 */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const redis = getRedis()
    const data = await redis.get<string>(key)
    return data ? (JSON.parse(data) as T) : null
  },

  async set(key: string, value: unknown, ttlSeconds: number = 300): Promise<void> {
    const redis = getRedis()
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds })
  },

  async del(key: string): Promise<void> {
    const redis = getRedis()
    await redis.del(key)
  },

  async incr(key: string): Promise<number> {
    const redis = getRedis()
    return redis.incr(key)
  },
}
