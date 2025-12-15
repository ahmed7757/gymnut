import { NextResponse } from 'next/server';
import { generateSwaggerJSON } from '@/lib/swagger';

export async function GET() {
    const swaggerJSON = generateSwaggerJSON();

    return new NextResponse(swaggerJSON, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
