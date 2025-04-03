/**
 * Custom hook to access the encrypted notes embedded in the HTML
 * Uses memoization to prevent unnecessary recomputations
 */
export function loadEncryptedNotesFromWindow(): string | null {
    // Default state
    const defaultResult = null;

    // Client-side only
    if (typeof window === 'undefined') {
        return defaultResult;
    }

    // Get data from global variable
    if (window.__ENCRYPTED_NOTES_DATA__) {
        return window.__ENCRYPTED_NOTES_DATA__;
    } else {
        console.error('Encrypted notes data not found in HTML');
        return defaultResult;
    }
}
 