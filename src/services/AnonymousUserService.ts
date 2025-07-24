/**
 * Anonymous User Service
 * 
 * This service handles the specific requirements for anonymous users, ensuring they:
 * - Only have non-transactional events (no purchases, checkouts, etc.)
 * - Only have cookie IDs or MAID (Mobile Advertising ID) identifiers
 * - Never have personal profile data (names, addresses, genders, ages)
 * - Follow proper data privacy and GDPR compliance patterns
 * 
 * Key Features:
 * - Event filtering for anonymous users
 * - Identifier management (cookie/MAID only)
 * - Profile data sanitization
 * - Compliance with privacy regulations
 */

import { UserProfile, UserEvent } from '../types/events';

/**
 * Anonymous User Service
 * 
 * Manages anonymous user data generation and ensures compliance with
 * privacy requirements and data protection regulations.
 */
export class AnonymousUserService {
  
  /**
   * Non-transactional event types that are safe for anonymous users
   * These events don't require personal information and are privacy-compliant
   */
  private readonly NON_TRANSACTIONAL_EVENTS = [
    'page_view',
    'search',
    'product_view',
    'add_to_cart',
    'remove_from_cart',
    'email_open',
    'email_click',
    'ad_view',
    'ad_click',
    'richpush_open',
    'richpush_click'
  ];

  /**
   * Transactional event types that should be excluded for anonymous users
   * These events typically require personal information and should be avoided
   */
  private readonly TRANSACTIONAL_EVENTS = [
    'checkout',
    'purchase',
    'payment',
    'order_confirmation',
    'shipping_update',
    'account_creation',
    'login',
    'logout'
  ];



  /**
   * Determines if a user profile represents an anonymous user
   * 
   * @param profile - The user profile to check
   * @returns boolean - True if the user is anonymous
   */
  isAnonymousUser(profile: UserProfile): boolean {
    return profile.profileType === 'anonymous';
  }

  /**
   * Sanitizes a user profile for anonymous users by removing personal data
   * 
   * This method removes all personal information from anonymous user profiles,
   * ensuring they only contain non-identifying data and appropriate identifiers.
   * 
   * @param profile - The user profile to sanitize
   * @returns UserProfile - Sanitized profile with personal data removed
   */
  sanitizeAnonymousProfile(profile: UserProfile): UserProfile {
    if (!this.isAnonymousUser(profile)) {
      return profile; // Return unchanged for registered users
    }

    // For anonymous users, we need to create a minimal profile with only tracking IDs
    const sanitizedProfile: UserProfile = {
      id: profile.id,
      profileType: 'anonymous',
      cookieId: profile.cookieId,
      maidId: profile.maidId,
      // Remove all personal data - use placeholder values
      firstName: '',
      lastName: '',
      email: '',
      email_hash: '', // Empty hash for anonymous users
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      createdAt: profile.createdAt
    };

    return sanitizedProfile;
  }



  /**
   * Filters events to ensure anonymous users only have non-transactional events
   * 
   * This method removes any transactional events from anonymous user event lists,
   * ensuring they only have privacy-compliant, non-personal events.
   * 
   * @param events - Array of user events to filter
   * @param profile - The user profile to check for anonymous status
   * @returns UserEvent[] - Filtered events with only non-transactional events for anonymous users
   */
  filterAnonymousEvents(events: UserEvent[], profile: UserProfile): UserEvent[] {
    if (!this.isAnonymousUser(profile)) {
      return events; // Return unchanged for registered users
    }

    return events.filter(event => {
      const eventType = event.eventType.toLowerCase();
      
      // Only allow non-transactional events
      const isNonTransactional = this.NON_TRANSACTIONAL_EVENTS.some(
        nonTransactionalType => eventType.includes(nonTransactionalType)
      );

      // Explicitly exclude transactional events
      const isTransactional = this.TRANSACTIONAL_EVENTS.some(
        transactionalType => eventType.includes(transactionalType)
      );

      return isNonTransactional && !isTransactional;
    });
  }

  /**
   * Validates that an anonymous user profile meets privacy requirements
   * 
   * @param profile - The user profile to validate
   * @returns { isValid: boolean; errors: string[] } - Validation result
   */
  validateAnonymousProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isAnonymousUser(profile)) {
      return { isValid: true, errors: [] }; // Not an anonymous user, no validation needed
    }

    // Check for personal data that shouldn't be present
    if (profile.firstName || profile.lastName || profile.email) {
      errors.push('Anonymous user should not have personal data (firstName, lastName, email)');
    }

    // Check that appropriate identifiers are present
    if (!profile.cookieId && !profile.maidId) {
      errors.push('Anonymous user must have either cookieId or maidId identifier');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Gets the list of allowed event types for anonymous users
   * 
   * @returns string[] - Array of allowed event types
   */
  getAllowedAnonymousEventTypes(): string[] {
    return [...this.NON_TRANSACTIONAL_EVENTS];
  }

  /**
   * Gets the list of prohibited event types for anonymous users
   * 
   * @returns string[] - Array of prohibited event types
   */
  getProhibitedAnonymousEventTypes(): string[] {
    return [...this.TRANSACTIONAL_EVENTS];
  }
} 