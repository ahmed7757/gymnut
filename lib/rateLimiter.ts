import { NextRequest } from "next/server";

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests per window
    keyGenerator?: (req: NextRequest) => string;
}

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

// In-memory store (for production, use Redis)
const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    });
}, 5 * 60 * 1000);

export class RateLimiter {
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = config;
    }

    private getKey(req: NextRequest): string {
        if (this.config.keyGenerator) {
            return this.config.keyGenerator(req);
        }

        // Default: use IP address + user ID if available
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const userId = req.headers.get('x-user-id') || '';
        return `${ip}:${userId}`;
    }

    async checkLimit(req: NextRequest): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
        retryAfter?: number;
    }> {
        const key = this.getKey(req);
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        // Get or create entry
        let entry = store[key];
        if (!entry || entry.resetTime < now) {
            entry = {
                count: 0,
                resetTime: now + this.config.windowMs
            };
            store[key] = entry;
        }

        // Check if within window
        if (entry.resetTime > now) {
            entry.count++;
        } else {
            // Reset window
            entry.count = 1;
            entry.resetTime = now + this.config.windowMs;
        }

        const allowed = entry.count <= this.config.maxRequests;
        const remaining = Math.max(0, this.config.maxRequests - entry.count);
        const retryAfter = allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000);

        return {
            allowed,
            remaining,
            resetTime: entry.resetTime,
            retryAfter
        };
    }
}

// Pre-configured rate limiters
export const rateLimiters = {
    // AI endpoints - very restrictive
    ai: new RateLimiter({
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5, // 5 requests per minute
        keyGenerator: (req) => {
            const userId = req.headers.get('x-user-id') || 'anonymous';
            return `ai:${userId}`;
        }
    }),

    // Food search - moderate
    foodSearch: new RateLimiter({
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 30, // 30 requests per minute
    }),

    // General API - lenient
    general: new RateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100, // 100 requests per 15 minutes
    }),

    // Authentication - strict
    auth: new RateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5, // 5 attempts per 15 minutes
    })
};

// Middleware function for rate limiting
export async function withRateLimit(
    req: NextRequest,
    limiter: RateLimiter,
    handler: () => Promise<Response>
): Promise<Response> {
    const result = await limiter.checkLimit(req);

    if (!result.allowed) {
        return new Response(
            JSON.stringify({
                error: "Rate limit exceeded",
                message: "Too many requests. Please try again later.",
                retryAfter: result.retryAfter
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': limiter['config'].maxRequests.toString(),
                    'X-RateLimit-Remaining': result.remaining.toString(),
                    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
                    'Retry-After': result.retryAfter?.toString() || '0'
                }
            }
        );
    }

    const response = await handler();

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', limiter['config'].maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

    return response;
}
