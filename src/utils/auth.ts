import CryptoJS from 'crypto-js';

// Key for localStorage
const AUTH_TOKEN_KEY = 'daily_lofs_auth_token';
const TOKEN_VALIDITY_DAYS = 30; // How long the token remains valid

/**
 * Validates the access password
 * @param password - The password to check
 * @returns boolean indicating if password is valid
 */
export function validatePassword(password: string): boolean {
  // Access password is injected at build time
  const hashedPassword = process.env.NEXT_PUBLIC_HASHED_ACCESS_PASSWORD;
  
  if (!hashedPassword) {
    console.error('Hashed access password not set in environment variables');
    return false;
  }
  
  // Hash the provided password with SHA-256
  const passwordHash = CryptoJS.SHA256(password).toString();
  
  // Compare with the stored hash
  return passwordHash === hashedPassword;
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
  
  if (!tokenData) {
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
 * Logs the user out by removing the auth token
 */
export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
} 