interface PerformanceMetrics {
    endpoint: string;
    method: string;
    duration: number;
    statusCode: number;
    timestamp: Date;
    userId?: string;
    cacheHit?: boolean;
    rateLimited?: boolean;
}

interface ErrorMetrics {
    endpoint: string;
    method: string;
    error: string;
    stack?: string;
    timestamp: Date;
    userId?: string;
}

class PerformanceMonitor {
    private metrics: PerformanceMetrics[] = [];
    private errors: ErrorMetrics[] = [];
    private maxMetrics = 1000; // Keep last 1000 metrics
    private maxErrors = 500; // Keep last 500 errors

    logRequest(metrics: PerformanceMetrics): void {
        this.metrics.push(metrics);

        // Keep only recent metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }

        // Log slow requests (> 2 seconds)
        if (metrics.duration > 2000) {
            console.warn(`Slow request detected: ${metrics.method} ${metrics.endpoint} took ${metrics.duration}ms`);
        }
    }

    logError(error: ErrorMetrics): void {
        this.errors.push(error);

        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        console.error(`API Error: ${error.method} ${error.endpoint} - ${error.error}`);
    }

    getMetrics(): {
        totalRequests: number;
        averageResponseTime: number;
        errorRate: number;
        slowRequests: number;
        cacheHitRate: number;
        rateLimitedRequests: number;
    } {
        const totalRequests = this.metrics.length;
        const totalErrors = this.errors.length;

        if (totalRequests === 0) {
            return {
                totalRequests: 0,
                averageResponseTime: 0,
                errorRate: 0,
                slowRequests: 0,
                cacheHitRate: 0,
                rateLimitedRequests: 0
            };
        }

        const averageResponseTime = this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;
        const errorRate = (totalErrors / totalRequests) * 100;
        const slowRequests = this.metrics.filter(m => m.duration > 2000).length;
        const cacheHits = this.metrics.filter(m => m.cacheHit).length;
        const cacheHitRate = (cacheHits / totalRequests) * 100;
        const rateLimitedRequests = this.metrics.filter(m => m.rateLimited).length;

        return {
            totalRequests,
            averageResponseTime: Math.round(averageResponseTime),
            errorRate: Math.round(errorRate * 100) / 100,
            slowRequests,
            cacheHitRate: Math.round(cacheHitRate * 100) / 100,
            rateLimitedRequests
        };
    }

    getRecentErrors(limit: number = 10): ErrorMetrics[] {
        return this.errors.slice(-limit);
    }

    getSlowRequests(limit: number = 10): PerformanceMetrics[] {
        return this.metrics
            .filter(m => m.duration > 2000)
            .sort((a, b) => b.duration - a.duration)
            .slice(0, limit);
    }

    clearMetrics(): void {
        this.metrics = [];
        this.errors = [];
    }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Middleware for performance monitoring
export function withPerformanceMonitoring(
    endpoint: string,
    handler: () => Promise<Response>
): Promise<Response> {
    const startTime = Date.now();
    const method = 'GET'; // You can pass this as parameter if needed

    return handler()
        .then(response => {
            const duration = Date.now() - startTime;

            performanceMonitor.logRequest({
                endpoint,
                method,
                duration,
                statusCode: response.status,
                timestamp: new Date(),
                cacheHit: response.headers.get('X-Cache') === 'HIT',
                rateLimited: response.status === 429
            });

            return response;
        })
        .catch(error => {
            const duration = Date.now() - startTime;

            performanceMonitor.logError({
                endpoint,
                method,
                error: error.message,
                stack: error.stack,
                timestamp: new Date()
            });

            performanceMonitor.logRequest({
                endpoint,
                method,
                duration,
                statusCode: 500,
                timestamp: new Date()
            });

            throw error;
        });
}

// Health check endpoint data
export function getHealthData(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: Date;
    metrics: ReturnType<typeof performanceMonitor.getMetrics>;
    recentErrors: ErrorMetrics[];
    slowRequests: PerformanceMetrics[];
} {
    const metrics = performanceMonitor.getMetrics();
    const recentErrors = performanceMonitor.getRecentErrors(5);
    const slowRequests = performanceMonitor.getSlowRequests(5);

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (metrics.errorRate > 10 || metrics.averageResponseTime > 5000) {
        status = 'unhealthy';
    } else if (metrics.errorRate > 5 || metrics.averageResponseTime > 2000) {
        status = 'degraded';
    }

    return {
        status,
        timestamp: new Date(),
        metrics,
        recentErrors,
        slowRequests
    };
}
