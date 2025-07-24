/**
 * Data Validation Service
 * 
 * This service is responsible for validating generated data, user profiles,
 * events, and configuration settings. It provides comprehensive validation
 * rules and error reporting to ensure data quality and consistency.
 * 
 * Features:
 * - User profile validation
 * - Event data validation
 * - Configuration validation
 * - Data format validation
 * - Custom validation rules
 */

import { UserProfile, UserEvent } from '../types/events';
import { Config } from '../types/config';
import { ValidationUtils } from '../utils/ValidationUtils';

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Data Validation Service
 * 
 * Provides comprehensive validation for all generated data and configuration.
 */
export class DataValidationService {
  /**
   * Validates a user profile
   * 
   * @param profile - The user profile to validate
   * @returns ValidationResult - Validation result with errors and warnings
   */
  validateUserProfile(profile: UserProfile): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!profile.id) {
      errors.push('User profile must have an id');
    }

    if (!profile.email) {
      errors.push('User profile must have an email address');
    } else if (!ValidationUtils.isValidEmail(profile.email)) {
      errors.push('User profile email must be a valid email address');
    }

    // Email hash validation
    if (!profile.email_hash) {
      errors.push('User profile must have an email_hash');
    } else if (!ValidationUtils.isValidSHA256Hash(profile.email_hash)) {
      errors.push('Email hash must be a valid SHA256 hash');
    }

    if (!profile.firstName) {
      errors.push('User profile must have a firstName');
    }

    if (!profile.lastName) {
      errors.push('User profile must have a lastName');
    }

    // Email domain validation (should use mediarithmics.com)
    if (profile.email && !ValidationUtils.isValidEmail(profile.email, 'mediarithmics.com')) {
      warnings.push('User email should use mediarithmics.com domain');
    }

    // Country validation
    if (profile.address.country && !ValidationUtils.isValidCountry(profile.address.country)) {
      warnings.push(`Country '${profile.address.country}' may not be supported`);
    }

    // State validation (if country is US)
    if (profile.address.country === 'United States' && profile.address.state && !ValidationUtils.isValidUSState(profile.address.state)) {
      warnings.push(`State '${profile.address.state}' may not be a valid US state`);
    }

    // Zip code validation
    if (profile.address.zipCode && !ValidationUtils.isValidZipCode(profile.address.zipCode)) {
      warnings.push(`Zip code '${profile.address.zipCode}' format may be invalid`);
    }

    // Phone validation
    if (profile.phone && !ValidationUtils.isValidPhone(profile.phone)) {
      warnings.push(`Phone number '${profile.phone}' format may be invalid`);
    }

    // Registration date validation (using createdAt)
    if (profile.createdAt && !ValidationUtils.isValidPastDate(profile.createdAt)) {
      errors.push('User creation date cannot be in the future');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates a user event
   * 
   * @param event - The user event to validate
   * @returns ValidationResult - Validation result with errors and warnings
   */
  validateUserEvent(event: UserEvent): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!event.userId) {
      errors.push('Event must have a userId');
    }

    if (!event.eventType) {
      errors.push('Event must have an eventType');
    }

    if (!event.timestamp) {
      errors.push('Event must have a timestamp');
    } else if (event.timestamp > new Date()) {
      errors.push('Event timestamp cannot be in the future');
    }

    // Event type validation
    const validEventTypes = [
      'page_view', 'product_view', 'add_to_cart', 'remove_from_cart',
      'view_cart', 'checkout', 'transaction', 'search', 'login', 'logout'
    ];

    if (event.eventType && !validEventTypes.includes(event.eventType)) {
      warnings.push(`Event type '${event.eventType}' is not in the standard list`);
    }

    // Event data validation
    if (!event.eventData || Object.keys(event.eventData).length === 0) {
      warnings.push('Event should have eventData');
    }

    // Country validation
    if (!event.country) {
      errors.push('Event must have a country');
    } else if (!ValidationUtils.isValidCountry(event.country)) {
      warnings.push(`Country '${event.country}' may not be supported`);
    }

    // Identifier validation (at least one identifier should be present)
    if (!event.userId && !event.cookieId && !event.maidId) {
      warnings.push('Event should have at least one identifier (userId, cookieId, or maidId)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }



  /**
   * Validates configuration settings
   * 
   * @param config - The configuration to validate
   * @returns ValidationResult - Validation result
   */
  validateConfiguration(config: Config): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Data generation validation
    if (config.dataGeneration.userCount < 1) {
      errors.push('userCount must be at least 1');
    }

    if (config.dataGeneration.eventCountPerUser.min < 1) {
      errors.push('eventCountPerUser.min must be at least 1');
    }

    if (config.dataGeneration.eventCountPerUser.max < config.dataGeneration.eventCountPerUser.min) {
      errors.push('eventCountPerUser.max must be greater than or equal to min');
    }

    if (config.dataGeneration.anonymousUserCount.min < 0) {
      errors.push('anonymousUserCount.min must be at least 0');
    }

    if (config.dataGeneration.anonymousUserCount.max < config.dataGeneration.anonymousUserCount.min) {
      errors.push('anonymousUserCount.max must be greater than or equal to min');
    }

    // Probability validation
    const probabilities = [
      { name: 'sessionContinuationProbability', value: config.eventGeneration.sessionContinuationProbability },
      { name: 'addToCartProbability', value: config.eventGeneration.addToCartProbability },
      { name: 'viewCartAfterAddProbability', value: config.eventGeneration.viewCartAfterAddProbability },
      { name: 'checkoutAfterViewCartProbability', value: config.eventGeneration.checkoutAfterViewCartProbability },
      { name: 'transactionAfterCheckoutProbability', value: config.eventGeneration.transactionAfterCheckoutProbability },
      { name: 'removeFromCartProbability', value: config.eventGeneration.removeFromCartProbability },
      { name: 'registeredUserProbability', value: config.userProfiles.registeredUserProbability },
      { name: 'mobileIdProbability.registered', value: config.userProfiles.mobileIdProbability.registered },
      { name: 'mobileIdProbability.anonymous', value: config.userProfiles.mobileIdProbability.anonymous }
    ];

    probabilities.forEach(({ name, value }) => {
      if (value < 0 || value > 1) {
        errors.push(`${name} must be between 0 and 1`);
      }
    });

    // Output validation
    if (!config.output.directory) {
      errors.push('output.directory is required');
    }

    const validFormats = ['ndjson', 'json', 'csv'];
    if (!validFormats.includes(config.output.format)) {
      errors.push(`output.format must be one of: ${validFormats.join(', ')}`);
    }

    // Logging validation
    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(config.logging.level)) {
      errors.push(`logging.level must be one of: ${validLogLevels.join(', ')}`);
    }

    // Performance warnings
    if (config.dataGeneration.userCount > 10000) {
      warnings.push('Large user count may impact performance');
    }

    if (config.dataGeneration.eventCountPerUser.max > 100) {
      warnings.push('High event count per user may impact performance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates an array of user profiles
   * 
   * @param profiles - Array of user profiles to validate
   * @returns ValidationResult - Validation result
   */
  validateUserProfiles(profiles: UserProfile[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (profiles.length === 0) {
      errors.push('No user profiles provided for validation');
      return { isValid: false, errors, warnings };
    }

    // Validate each profile
    profiles.forEach((profile, index) => {
      const result = this.validateUserProfile(profile);
      result.errors.forEach(error => errors.push(`Profile ${index + 1}: ${error}`));
      result.warnings.forEach(warning => warnings.push(`Profile ${index + 1}: ${warning}`));
    });

    // Check for duplicate user IDs
    const userIds = profiles.map(p => p.id).filter(Boolean);
    const uniqueUserIds = new Set(userIds);
    if (userIds.length !== uniqueUserIds.size) {
      errors.push('Duplicate user IDs found in profiles');
    }

    // Check for duplicate emails
    const emails = profiles.map(p => p.email).filter(Boolean);
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      errors.push('Duplicate email addresses found in profiles');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates an array of user events
   * 
   * @param events - Array of user events to validate
   * @returns ValidationResult - Validation result
   */
  validateUserEvents(events: UserEvent[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (events.length === 0) {
      errors.push('No user events provided for validation');
      return { isValid: false, errors, warnings };
    }

    // Validate each event
    events.forEach((event, index) => {
      const result = this.validateUserEvent(event);
      result.errors.forEach(error => errors.push(`Event ${index + 1}: ${error}`));
      result.warnings.forEach(warning => warnings.push(`Event ${index + 1}: ${warning}`));
    });

    // Check for chronological order
    const sortedEvents = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const isChronological = events.every((event, index) => 
      event.timestamp.getTime() === sortedEvents[index]?.timestamp.getTime()
    );

    if (!isChronological) {
      warnings.push('Events are not in chronological order');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }





  /**
   * Gets validation statistics
   * 
   * @param results - Array of validation results
   * @returns object - Validation statistics
   */
  getValidationStats(results: ValidationResult[]): {
    totalValidations: number;
    validCount: number;
    invalidCount: number;
    totalErrors: number;
    totalWarnings: number;
  } {
    const totalValidations = results.length;
    const validCount = results.filter(r => r.isValid).length;
    const invalidCount = totalValidations - validCount;
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

    return {
      totalValidations,
      validCount,
      invalidCount,
      totalErrors,
      totalWarnings
    };
  }
} 