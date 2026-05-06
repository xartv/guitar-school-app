import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// No-op when Upstash credentials are not configured (local dev)
const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: false,
    })
  : null

export async function checkRateLimit(identifier: string): Promise<void> {
  if (!ratelimit) return

  const { success } = await ratelimit.limit(identifier)
  if (!success) {
    throw new Error("Too many attempts. Please try again later.")
  }
}
