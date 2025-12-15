import { NextResponse } from 'next/server';
import { getHealthData } from '@/lib/monitoring';
import { caches } from '@/lib/cache';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;

        // Get health data
        const healthData = getHealthData();

        // Add cache statistics
        const cacheStats = {
            ai: caches.ai.getStats(),
            food: caches.food.getStats(),
            user: caches.user.getStats(),
            general: caches.general.getStats()
        };

        const response = {
            ...healthData,
            cache: cacheStats,
            database: 'connected',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response, {
            status: healthData.status === 'unhealthy' ? 503 : 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.error('Health check failed:', error);

        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            database: 'disconnected'
        }, {
            status: 503,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    }
}
