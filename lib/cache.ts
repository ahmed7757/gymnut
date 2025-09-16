interface CacheEntry<T> {
    data: T;
    expiresAt: number;
    createdAt: number;
}

interface CacheConfig {
    defaultTTL: number; // Time to live in milliseconds
    maxSize: number; // Maximum number of entries
}

class MemoryCache<T = any> {
    private cache = new Map<string, CacheEntry<T>>();
    private config: CacheConfig;

    constructor(config: CacheConfig) {
        this.config = config;

        // Clean up expired entries every 5 minutes
        setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expiresAt < now) {
                this.cache.delete(key);
            }
        }
    }

    private evictOldest(): void {
        if (this.cache.size >= this.config.maxSize) {
            let oldestKey = '';
            let oldestTime = Date.now();

            for (const [key, entry] of this.cache.entries()) {
                if (entry.createdAt < oldestTime) {
                    oldestTime = entry.createdAt;
                    oldestKey = key;
                }
            }

            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
    }

    set(key: string, data: T, ttl?: number): void {
        const now = Date.now();
        const expiresAt = now + (ttl || this.config.defaultTTL);

        this.evictOldest();

        this.cache.set(key, {
            data,
            expiresAt,
            createdAt: now
        });
    }

    get(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        if (entry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        return entry ? entry.expiresAt >= Date.now() : false;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }

    // Get cache statistics
    getStats(): {
        size: number;
        maxSize: number;
        hitRate?: number;
    } {
        return {
            size: this.cache.size,
            maxSize: this.config.maxSize
        };
    }
}

// Cache configurations
const cacheConfigs = {
    // AI responses - cache for 1 hour
    ai: {
        defaultTTL: 60 * 60 * 1000, // 1 hour
        maxSize: 100
    },

    // Food search - cache for 30 minutes
    food: {
        defaultTTL: 30 * 60 * 1000, // 30 minutes
        maxSize: 500
    },

    // User data - cache for 5 minutes
    user: {
        defaultTTL: 5 * 60 * 1000, // 5 minutes
        maxSize: 200
    },

    // General data - cache for 10 minutes
    general: {
        defaultTTL: 10 * 60 * 1000, // 10 minutes
        maxSize: 300
    }
};

// Create cache instances
export const caches = {
    ai: new MemoryCache(cacheConfigs.ai),
    food: new MemoryCache(cacheConfigs.food),
    user: new MemoryCache(cacheConfigs.user),
    general: new MemoryCache(cacheConfigs.general)
};

// Cache key generators
export const cacheKeys = {
    // AI cache keys
    mealPlan: (userId: string, dietType: string, mealDays: number) =>
        `meal_plan:${userId}:${dietType}:${mealDays}`,

    workoutPlan: (userId: string, fitnessLevel: string, workoutDays: number, method: string) =>
        `workout_plan:${userId}:${fitnessLevel}:${workoutDays}:${method}`,

    // Food cache keys
    foodSearch: (query: string) => `food_search:${query.toLowerCase()}`,

    // User cache keys
    userProfile: (userId: string) => `user_profile:${userId}`,
    userMeals: (userId: string, date?: string) =>
        date ? `user_meals:${userId}:${date}` : `user_meals:${userId}`,
    userWorkouts: (userId: string) => `user_workouts:${userId}`,

    // General cache keys
    foodItem: (foodId: string) => `food_item:${foodId}`
};

// Cache helper functions
export async function withCache<T>(
    cache: MemoryCache<T>,
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
): Promise<T> {
    // Try to get from cache first
    const cached = cache.get(key);
    if (cached !== null) {
        return cached;
    }

    // Fetch data and cache it
    const data = await fetcher();
    cache.set(key, data, ttl);
    return data;
}

// Cache invalidation helpers
export function invalidateUserCache(userId: string): void {
    // Invalidate all user-related cache entries
    const userKeys = [
        cacheKeys.userProfile(userId),
        cacheKeys.userMeals(userId),
        cacheKeys.userWorkouts(userId)
    ];

    userKeys.forEach(key => {
        caches.user.delete(key);
        caches.general.delete(key);
    });
}

export function invalidateAICache(userId: string): void {
    // Invalidate AI-related cache entries for user
    // This is a simple approach - in production, you might want to track keys more precisely
    caches.ai.clear();
}

// Cache middleware for API routes
export function createCacheMiddleware<T>(
    cache: MemoryCache<T>,
    keyGenerator: (req: Request) => string,
    ttl?: number
) {
    return async (req: Request, handler: () => Promise<Response>): Promise<Response> => {
        const key = keyGenerator(req);
        const cached = cache.get(key);

        if (cached !== null) {
            return new Response(JSON.stringify(cached), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Cache': 'HIT'
                }
            });
        }

        const response = await handler();
        const responseData = await response.clone().json();

        cache.set(key, responseData, ttl);

        // Add cache miss header
        response.headers.set('X-Cache', 'MISS');

        return response;
    };
}
