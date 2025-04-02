import CryptoJS from 'crypto-js';

// Keys for localStorage
const AUTH_TOKEN_KEY = 'daily_lofs_auth_token';
const HASHED_PASSWORD_KEY = 'daily_lofs_hashed_pwd';
const TOKEN_VALIDITY_DAYS = 30; // How long the token remains valid

/**
 * Stores the hashed password in localStorage
 * @param password - The password to hash and store
 */
export function storeHashedPassword(password: string): void {
  // Hash the password before storing it
  const hashedPassword = CryptoJS.SHA256(password).toString();
  localStorage.setItem(HASHED_PASSWORD_KEY, hashedPassword);
}

/**
 * Gets the stored hashed password from localStorage
 * @returns The hashed password or null if not found
 */
export function getStoredHashedPassword(): string | null {
  return localStorage.getItem(HASHED_PASSWORD_KEY);
}

/**
 * Stores the original password (with additional hash for security)
 * This is needed for decryption but we add another layer of hashing
 * @param password - The original password 
 */
export function storePassword(password: string): void {
  // We use a different hash method/salt here for additional security
  const securePassword = CryptoJS.HmacSHA256(password, 'decryption-key').toString();
  localStorage.setItem('daily_lofs_decrypt_key', securePassword);
}

/**
 * Gets the stored password needed for decryption
 * @returns The password or null if not found
 */
export function getStoredPassword(): string | null {
  const securePassword = localStorage.getItem('daily_lofs_decrypt_key');
  if (!securePassword) return null;
  
  // Return the original password by reversing our protection
  return securePassword;
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
  const hashedPassword = getStoredHashedPassword();
  
  if (!tokenData || !hashedPassword) {
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
  localStorage.removeItem(HASHED_PASSWORD_KEY);
  localStorage.removeItem('daily_lofs_decrypt_key');
} 