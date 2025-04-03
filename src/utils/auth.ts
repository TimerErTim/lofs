import CryptoJS from 'crypto-js';

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
export function isAuthenticated(): boolean {
  // Not available during SSR
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Simply check if the password exists
  const password = getStoredPassword();
  return password !== null;
}

/**
 * Logs the user out by removing auth data
 */
export function logout(): void {
  sessionStorage.removeItem(PASSWORD_KEY);
  window.location.reload();
} 