import CryptoJS from 'crypto-js';

// Keys for localStorage
const AUTH_TOKEN_KEY = 'daily_lofs_auth_token';
const PASSWORD_KEY = 'daily_lofs_password';
const TOKEN_VALIDITY_DAYS = 30; // How long the token remains valid

/**
 * Stores the password in localStorage
 * @param password - The password to store
 */
export function storePassword(password: string): void {
  // Store the password directly
  localStorage.setItem(PASSWORD_KEY, password);
}

/**
 * Gets the stored password from localStorage
 * @returns The password or null if not found
 */
export function getStoredPassword(): string | null {
  return localStorage.getItem(PASSWORD_KEY);
}

/**
 * Creates an authentication token and stores it in localStorage
 */
export function createAuthToken(): void {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setDate(now.getDate() + TOKEN_VALIDITY_DAYS);
  
  const tokenData = {
    created: now.toISOString(),
    expires: expiry.toISOString(),
  };
  
  // Store token in localStorage
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokenData));
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
  
  const tokenData = localStorage.getItem(AUTH_TOKEN_KEY);
  const password = getStoredPassword();
  
  if (!tokenData || !password) {
    return false;
  }
  
  try {
    const token = JSON.parse(tokenData);
    const now = new Date();
    const expiry = new Date(token.expires);
    
    // Check if token is still valid
    return now < expiry;
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return false;
  }
}

/**
 * Logs the user out by removing auth data
 */
export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(PASSWORD_KEY);
} 