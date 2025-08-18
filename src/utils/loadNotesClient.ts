import { useEffect, useState } from "react";

// Cache variable - stores the promise to avoid multiple fetches
let encryptedNotesPromise: Promise<string | null> | null = null;

/**
 * Fetches the encrypted notes data from the static asset endpoint.
 * Caches the result to prevent multiple network requests.
 * Accepts a progress callback for download progress.
 */
export async function fetchEncryptedNotes(onProgress: (progress: number) => void = () => {}): Promise<string | null> {
    if (typeof window === 'undefined') {
        return null;
    }

    if (encryptedNotesPromise) {
        const value = await encryptedNotesPromise;
        onProgress(100);
        return value;
    }

    encryptedNotesPromise = (async () => {
        try {
            const response = await fetch('/encrypted_notes.dat');
            if (!response.ok) {
                console.error(`Failed to fetch encrypted notes: ${response.status} ${response.statusText}`);
                onProgress(100);
                return null;
            }
    
            // Try to get the content length
            const contentEncoding = response.headers.get('content-encoding');
            const contentLengthHeader = contentEncoding ? (
                // Fallback to content-length if x-file-size is not present (better inaccurate than nothing)
                response.headers.get('x-file-size') ?? response.headers.get('content-length')
            ) : response.headers.get('content-length');
            const total = contentLengthHeader ? parseInt(contentLengthHeader, 10) : null;
            if (!response.body || total == null) {
                // No stream support
                const encryptedData = await response.text();
                return encryptedData;
            }
    
            const reader = response.body.getReader();
            let received = 0;
            const chunks: Uint8Array[] = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    chunks.push(value);
                    received += value.length;
                    onProgress(Math.min(100, Math.round((received / total) * 100)));
                }
            }
    
            onProgress(100);
            // Concatenate all chunks
            const body = new Uint8Array(received);
            let position = 0;
            for (const chunk of chunks) {
                body.set(chunk, position);
                position += chunk.length;
            }
            const encryptedData = new TextDecoder('utf-8').decode(body);
            return encryptedData;
        } catch (error) {
            console.error('Error fetching encrypted notes:', error);
            onProgress(100);
            return null;
        }
    })();

    return encryptedNotesPromise;
}

export function useEncryptedNotesClientSide(): { encryptedNotes: string | null, progress: number | null } {
    const [encryptedNotes, setEncryptedNotes] = useState<string | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    useEffect(() => {
        fetchEncryptedNotes((p) => setProgress(p)).then(data => setEncryptedNotes(data));
    }, []);
    return { encryptedNotes, progress };
}
