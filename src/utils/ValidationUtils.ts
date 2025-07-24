/**
 * Validation Utilities
 * 
 * Centralized validation functions to eliminate code duplication across the project.
 * This utility provides common validation patterns used throughout the application.
 * 
 * Features:
 * - Email validation with domain checking
 * - Country and state validation
 * - Phone number and zip code validation
 * - Reusable validation patterns
 */

/**
 * Validation Utilities
 * 
 * Provides centralized validation functions to eliminate code duplication
 * and ensure consistent validation logic across the application.
 */
export class ValidationUtils {
  
  /**
   * Validates email format and optionally checks domain
   * 
   * @param email - Email address to validate
   * @param expectedDomain - Optional expected domain (e.g., 'mediarithmics.com')
   * @returns boolean - True if email is valid
   */
  static isValidEmail(email: string, expectedDomain?: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (expectedDomain && isValid) {
      return email.toLowerCase().endsWith(`@${expectedDomain.toLowerCase()}`);
    }
    
    return isValid;
  }

  /**
   * Validates if a country name is supported
   * 
   * @param country - Country name to validate
   * @returns boolean - True if country is supported
   */
  static isValidCountry(country: string): boolean {
    const supportedCountries = [
      'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
      'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland',
      'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea',
      'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'South Africa'
    ];
    
    return supportedCountries.includes(country);
  }

  /**
   * Validates US state names
   * 
   * @param state - State name to validate
   * @returns boolean - True if state is valid
   */
  static isValidUSState(state: string): boolean {
    const usStates = [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming'
    ];
    
    return usStates.includes(state);
  }

  /**
   * Validates zip code format
   * 
   * @param zipCode - Zip code to validate
   * @returns boolean - True if zip code format is valid
   */
  static isValidZipCode(zipCode: string): boolean {
    // Supports both 5-digit and 9-digit (ZIP+4) formats
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    return zipCodeRegex.test(zipCode);
  }

  /**
   * Validates phone number format
   * 
   * @param phone - Phone number to validate
   * @returns boolean - True if phone number format is valid
   */
  static isValidPhone(phone: string): boolean {
    // Supports various phone number formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Validates UUID format
   * 
   * @param uuid - UUID string to validate
   * @returns boolean - True if UUID format is valid
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validates date is not in the future
   * 
   * @param date - Date to validate
   * @returns boolean - True if date is not in the future
   */
  static isValidPastDate(date: Date): boolean {
    return date <= new Date();
  }

  /**
   * Validates probability value is between 0 and 1
   * 
   * @param probability - Probability value to validate
   * @returns boolean - True if probability is valid
   */
  static isValidProbability(probability: number): boolean {
    return probability >= 0 && probability <= 1;
  }

  /**
   * Validates required string field
   * 
   * @param value - String value to validate
   * @param fieldName - Name of the field for error messages
   * @returns { isValid: boolean; error?: string } - Validation result
   */
  static validateRequiredString(value: string, fieldName: string): { isValid: boolean; error?: string } {
    if (!value || value.trim().length === 0) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  }

  /**
   * Validates required number field
   * 
   * @param value - Number value to validate
   * @param fieldName - Name of the field for error messages
   * @param minValue - Optional minimum value
   * @param maxValue - Optional maximum value
   * @returns { isValid: boolean; error?: string } - Validation result
   */
  static validateRequiredNumber(
    value: number, 
    fieldName: string, 
    minValue?: number, 
    maxValue?: number
  ): { isValid: boolean; error?: string } {
    if (typeof value !== 'number' || isNaN(value)) {
      return { isValid: false, error: `${fieldName} must be a valid number` };
    }
    
    if (minValue !== undefined && value < minValue) {
      return { isValid: false, error: `${fieldName} must be at least ${minValue}` };
    }
    
    if (maxValue !== undefined && value > maxValue) {
      return { isValid: false, error: `${fieldName} must be at most ${maxValue}` };
    }
    
    return { isValid: true };
  }

  /**
   * Validates array field
   * 
   * @param value - Array value to validate
   * @param fieldName - Name of the field for error messages
   * @param minLength - Optional minimum length
   * @param maxLength - Optional maximum length
   * @returns { isValid: boolean; error?: string } - Validation result
   */
  static validateArray(
    value: any[], 
    fieldName: string, 
    minLength?: number, 
    maxLength?: number
  ): { isValid: boolean; error?: string } {
    if (!Array.isArray(value)) {
      return { isValid: false, error: `${fieldName} must be an array` };
    }
    
    if (minLength !== undefined && value.length < minLength) {
      return { isValid: false, error: `${fieldName} must have at least ${minLength} items` };
    }
    
    if (maxLength !== undefined && value.length > maxLength) {
      return { isValid: false, error: `${fieldName} must have at most ${maxLength} items` };
    }
    
    return { isValid: true };
  }
} 