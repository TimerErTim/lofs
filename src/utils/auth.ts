import { loadEncryptedNotesFromWindow } from './loadNotesClient';
import { decryptNotes } from './decryptNotes';

// Key for sessionStorage
const PASSWORD_KEY = 'daily_lofs_password';

/**
 * Stores the password in sessionStorage
 * @param password - The password to store
 */
export function storePassword(password: string): void {
  // Store the password directly
  sessionStorage.setItem(PASSWORD_KEY, password);
}

/**
 * Gets the stored password from sessionStorage
 * @returns The password or null if not found
 */
export function getStoredPassword(): string | null {
  return sessionStorage.getItem(PASSWORD_KEY);
}

/**
 * Checks if the user is authenticated
 * @returns boolean indicating if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  // Not available during SSR
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check if the password exists
  const password = getStoredPassword();
  if (password === null) {
    return false;
  }
  // Check if the password is correct
  const encyrptedData = loadEncryptedNotesFromWindow();
  if (encyrptedData === null) {
    return false;
  }
  const decryptedNotes = await decryptNotes(encyrptedData, password);
  return decryptedNotes !== null;
}

/**
 * Logs the user out by removing auth data
 * The notes store should be reset separately before calling this
 */
export function logout(): void {
  // Remove the password
  sessionStorage.removeItem(PASSWORD_KEY);
  
  // Reload the page to trigger AuthGuard
  window.location.reload();
} 