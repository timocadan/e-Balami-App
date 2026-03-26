/**
 * Security utilities for the application
 */

/**
 * Sanitizes route parameters to prevent injection attacks
 */
export function sanitizeRouteParam(param: string | string[] | undefined): string {
  if (!param) return '';
  
  const paramString = Array.isArray(param) ? param[0] : param;
  
  if (typeof paramString !== 'string') return '';
  
  // Remove any potentially dangerous characters
  return paramString
    .trim()
    .replace(/[<>'"\\]/g, '')
    .substring(0, 200); // Limit length
}

/**
 * Validates that a string is a valid Firestore document ID
 */
export function isValidFirestoreId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  
  // Firestore IDs can be 1-1500 characters, alphanumeric with some special chars
  // We'll be more restrictive for security
  return /^[a-zA-Z0-9_-]{1,1500}$/.test(id);
}

/**
 * Creates a safe error message that doesn't leak sensitive information
 */
export function getSafeErrorMessage(error: unknown): string {
  // Never expose internal error details to users
  if (error instanceof Error) {
    // Log the actual error for debugging (server-side only)
    console.error('Internal error:', error.message);
  }
  
  // Return generic message
  return 'An error occurred. Please try again later.';
}

/**
 * Rate limiting helper (client-side basic check)
 * Note: Real rate limiting should be done server-side
 */
const requestTimestamps: Map<string, number[]> = new Map();

export function checkRateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = requestTimestamps.get(key) || [];
  
  // Remove timestamps outside the window
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  validTimestamps.push(now);
  requestTimestamps.set(key, validTimestamps);
  
  return true; // Within rate limit
}

/**
 * Clears rate limit data (useful for testing or reset)
 */
export function clearRateLimit(key?: string): void {
  if (key) {
    requestTimestamps.delete(key);
  } else {
    requestTimestamps.clear();
  }
}

