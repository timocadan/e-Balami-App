/**
 * Input validation and sanitization utilities
 * Prevents XSS, injection attacks, and data corruption
 */

// Maximum field lengths
export const MAX_LENGTHS = {
  name: 100,
  email: 255,
  phone: 20,
  address: 500,
  city: 100,
  details: 500,
  service: 100,
  location: 100,
  destination: 200,
} as const;

// Minimum field lengths
export const MIN_LENGTHS = {
  name: 2,
  details: 10,
  address: 5,
} as const;

/**
 * Sanitizes a string by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Validates and sanitizes a name field
 */
export function validateName(name: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(name);
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Name is required' };
  }
  
  if (sanitized.length < MIN_LENGTHS.name) {
    return { isValid: false, sanitized, error: `Name must be at least ${MIN_LENGTHS.name} characters` };
  }
  
  if (sanitized.length > MAX_LENGTHS.name) {
    return { isValid: false, sanitized, error: `Name must not exceed ${MAX_LENGTHS.name} characters` };
  }
  
  // Allow letters, spaces, hyphens, apostrophes (for names like O'Connor, Al-Ahmad)
  if (!/^[a-zA-Z\s\-'\.]+$/.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Name contains invalid characters' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes an email address
 */
export function validateEmail(email: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(email).toLowerCase();
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Email is required' };
  }
  
  if (sanitized.length > MAX_LENGTHS.email) {
    return { isValid: false, sanitized, error: `Email must not exceed ${MAX_LENGTHS.email} characters` };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Invalid email format' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes an address field
 */
export function validateAddress(address: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(address);
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Address is required' };
  }
  
  if (sanitized.length < MIN_LENGTHS.address) {
    return { isValid: false, sanitized, error: `Address must be at least ${MIN_LENGTHS.address} characters` };
  }
  
  if (sanitized.length > MAX_LENGTHS.address) {
    return { isValid: false, sanitized, error: `Address must not exceed ${MAX_LENGTHS.address} characters` };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes a city name
 */
export function validateCity(city: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(city);
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'City is required' };
  }
  
  if (sanitized.length > MAX_LENGTHS.city) {
    return { isValid: false, sanitized, error: `City must not exceed ${MAX_LENGTHS.city} characters` };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes details/description field
 */
export function validateDetails(details: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(details);
  
  if (sanitized.length < MIN_LENGTHS.details) {
    return { isValid: false, sanitized, error: `Details must be at least ${MIN_LENGTHS.details} characters` };
  }
  
  if (sanitized.length > MAX_LENGTHS.details) {
    return { isValid: false, sanitized, error: `Details must not exceed ${MAX_LENGTHS.details} characters` };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validates a document ID (Firestore document ID format)
 */
export function validateDocumentId(id: string | string[] | undefined): { isValid: boolean; sanitized: string; error?: string } {
  if (!id) {
    return { isValid: false, sanitized: '', error: 'Document ID is required' };
  }
  
  // Handle array case (from useLocalSearchParams)
  const idString = Array.isArray(id) ? id[0] : id;
  
  if (typeof idString !== 'string' || !idString.trim()) {
    return { isValid: false, sanitized: '', error: 'Invalid document ID format' };
  }
  
  // Firestore document IDs can contain letters, numbers, and some special characters
  // But we'll be strict and only allow alphanumeric and hyphens/underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(idString)) {
    return { isValid: false, sanitized: '', error: 'Document ID contains invalid characters' };
  }
  
  // Firestore document ID max length is 1500, but we'll limit to reasonable size
  if (idString.length > 1500) {
    return { isValid: false, sanitized: '', error: 'Document ID is too long' };
  }
  
  return { isValid: true, sanitized: idString.trim() };
}

/**
 * Validates a service name
 */
export function validateService(service: string | string[] | undefined): { isValid: boolean; sanitized: string; error?: string } {
  if (!service) {
    return { isValid: false, sanitized: '', error: 'Service is required' };
  }
  
  const serviceString = Array.isArray(service) ? service[0] : service;
  
  if (typeof serviceString !== 'string' || !serviceString.trim()) {
    return { isValid: false, sanitized: '', error: 'Invalid service format' };
  }
  
  const sanitized = sanitizeString(serviceString);
  
  if (sanitized.length > MAX_LENGTHS.service) {
    return { isValid: false, sanitized, error: `Service name must not exceed ${MAX_LENGTHS.service} characters` };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validates a location string
 */
export function validateLocation(location: string | string[] | undefined): { isValid: boolean; sanitized: string; error?: string } {
  if (!location) {
    return { isValid: false, sanitized: '', error: 'Location is required' };
  }
  
  const locationString = Array.isArray(location) ? location[0] : location;
  
  if (typeof locationString !== 'string' || !locationString.trim()) {
    return { isValid: false, sanitized: '', error: 'Invalid location format' };
  }
  
  const sanitized = sanitizeString(locationString);
  
  if (sanitized.length > MAX_LENGTHS.location) {
    return { isValid: false, sanitized, error: `Location must not exceed ${MAX_LENGTHS.location} characters` };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validates age (must be between 13 and 120)
 */
export function validateAge(age: number): { isValid: boolean; error?: string } {
  if (typeof age !== 'number' || isNaN(age)) {
    return { isValid: false, error: 'Age must be a valid number' };
  }
  
  if (age < 13 || age > 120) {
    return { isValid: false, error: 'Age must be between 13 and 120' };
  }
  
  return { isValid: true };
}

