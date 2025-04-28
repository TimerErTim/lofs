import { useEffect, useState } from "react";

// Cache variable - stores the promise to avoid multiple fetches
let encryptedNotesPromise: Promise<string | null> | null = null;

/**
 * Fetches the encrypted notes data from the static asset endpoint.
 * Caches the result to prevent multiple network requests.
 */
export async function fetchEncryptedNotes(): Promise<string | null> {
    // Client-side only
    if (typeof window === 'undefined') {
        return null;
    }

    // Return cached promise if it exists
    if (encryptedNotesPromise) {
        return encryptedNotesPromise;
    }

    // Otherwise, initiate the fetch and store the promise
    encryptedNotesPromise = (async () => {
        try {
            const response = await fetch('/encrypted_notes.dat');
            if (!response.ok) {
                console.error(`Failed to fetch encrypted notes: ${response.status} ${response.statusText}`);
                encryptedNotesPromise = null; // Clear cache on failure
                return null;
            }
            const encryptedData = await response.text();
            return encryptedData;
        } catch (error) {
            console.error('Error fetching encrypted notes:', error);
            encryptedNotesPromise = null; // Clear cache on error
            return null;
        }
    })();

    return encryptedNotesPromise;
}

export function useEncryptedNotesClientSide(): string | null {
    const [encryptedNotes, setEncryptedNotes] = useState<string | null>(null);
    useEffect(() => {
        fetchEncryptedNotes().then(setEncryptedNotes);
    }, []);
    return encryptedNotes;
}
