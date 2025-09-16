'use client';

import { useSession } from 'next-auth/react';

export function SessionDebug() {
    const { data: session, status } = useSession();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
            <h3 className="font-bold mb-2">Session Debug</h3>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Session:</strong> {session ? 'exists' : 'null'}</p>
            {session && (
                <>
                    <p><strong>User:</strong> {session.user?.email}</p>
                    <p><strong>Expires:</strong> {session.expires}</p>
                </>
            )}
        </div>
    );
}
