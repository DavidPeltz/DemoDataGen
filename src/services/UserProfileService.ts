/**
 * User Profile Service
 * 
 * This service handles the conversion of base User objects into UserProfile objects
 * with tracking information. It manages the creation of registered and anonymous
 * user profiles with appropriate linking identifiers.
 * 
 * Extracted from index.ts to improve separation of concerns and maintainability.
 */

import { User } from '../types';
import { UserProfile } from '../types/events';
import { Config } from '../types/config';
import { DataGenerationUtils } from '../utils/DataGenerationUtils';

/**
 * User Profile Service
 * 
 * Handles the generation and management of user profiles with tracking
 * information for both registered and anonymous users.
 */
export class UserProfileService {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Converts base User objects into UserProfile objects with tracking information
   * 
   * This function adds profile type classification and generates linking identifiers
   * for each user. It creates a realistic mix of registered and anonymous users,
   * with appropriate tracking IDs for web and mobile platforms.
   * 
   * @param users - Array of base User objects
   * @returns UserProfile[] - Array of enhanced user profiles with tracking data
   */
  generateUserProfiles(users: User[]): UserProfile[] {
    return users.map((user) => {
      // Determine if user is registered or anonymous based on configuration
      const isRegistered = DataGenerationUtils.generateRandomBoolean(
        this.config.userProfiles.registeredUserProbability
      );
      
      if (isRegistered) {
        return this.createRegisteredProfile(user);
      } else {
        return this.createAnonymousProfile(user);
      }
    });
  }

  /**
   * Creates a registered user profile with tracking information
   * 
   * @param user - Base user object
   * @returns UserProfile - Registered user profile
   */
  private createRegisteredProfile(user: User): UserProfile {
    const { cookieId, maidId } = DataGenerationUtils.generateTrackingIds(
      true, 
      this.config.userProfiles.mobileIdProbability.registered
    );
    
    return {
      ...user,
      profileType: 'registered' as const,
      cookieId,
      maidId
    };
  }

  /**
   * Creates an anonymous user profile with tracking information
   * 
   * @param user - Base user object
   * @returns UserProfile - Anonymous user profile
   */
  private createAnonymousProfile(user: User): UserProfile {
    const { cookieId, maidId } = DataGenerationUtils.generateTrackingIds(
      true, 
      this.config.userProfiles.mobileIdProbability.anonymous
    );
    
    return {
      ...user,
      profileType: 'anonymous' as const,
      cookieId,
      maidId
    };
  }

  /**
   * Gets statistics about the generated user profiles
   * 
   * @param userProfiles - Array of user profiles
   * @returns Object containing profile statistics
   */
  getProfileStatistics(userProfiles: UserProfile[]): {
    total: number;
    registered: number;
    anonymous: number;
    withMobileId: number;
    withoutMobileId: number;
  } {
    const total = userProfiles.length;
    const registered = userProfiles.filter(p => p.profileType === 'registered').length;
    const anonymous = userProfiles.filter(p => p.profileType === 'anonymous').length;
    const withMobileId = userProfiles.filter(p => p.maidId).length;
    const withoutMobileId = userProfiles.filter(p => !p.maidId).length;

    return {
      total,
      registered,
      anonymous,
      withMobileId,
      withoutMobileId
    };
  }

  /**
   * Displays user profile summary information
   * 
   * @param userProfiles - Array of user profiles to display
   */
  displayUserProfiles(userProfiles: UserProfile[]): void {
    if (!this.config.logging.showSummary) {
      return;
    }

    console.log('👥 Generated User Profiles:');
    userProfiles.forEach((profile, index) => {
      const profileType = profile.profileType === 'registered' ? '📝' : '👤';
      const mobileIndicator = profile.maidId ? '📱' : '';
      console.log(`  ${index + 1}. ${profileType} ${profile.firstName} ${profile.lastName} (${profile.email}) - ${profile.address.country} [${profile.profileType}] ${mobileIndicator}`);
    });
    console.log('\n');
  }

  /**
   * Validates that all user profiles have required tracking information
   * 
   * @param userProfiles - Array of user profiles to validate
   * @returns boolean - True if all profiles are valid
   */
  validateUserProfiles(userProfiles: UserProfile[]): boolean {
    for (const profile of userProfiles) {
      if (!profile.cookieId) {
        console.error(`❌ User profile ${profile.id} is missing cookieId`);
        return false;
      }
      
      if (profile.profileType === 'registered' && !profile.id) {
        console.error(`❌ Registered user profile ${profile.id} is missing userId`);
        return false;
      }
    }
    
    return true;
  }
} 