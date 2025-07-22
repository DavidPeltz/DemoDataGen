/**
 * Configuration Types for Demo Data Generator
 * 
 * This file contains TypeScript interfaces that define the structure
 * of the configuration file used by the application. These interfaces
 * ensure type safety and provide clear documentation of all configurable
 * settings.
 */

/**
 * Data Generation Configuration
 * 
 * Controls the core data generation parameters including country,
 * user count, and event generation settings.
 */
export interface DataGenerationConfig {
  /** Country for data generation (name or 2-character code) */
  country: string;
  /** Number of users to generate */
  userCount: number;
  /** Range for events per user */
  eventCountPerUser: {
    min: number;
    max: number;
  };
  /** Range for anonymous user count */
  anonymousUserCount: {
    min: number;
    max: number;
  };
}

/**
 * Output Configuration
 * 
 * Controls how generated data is saved and formatted.
 */
export interface OutputConfig {
  /** Output format (currently only 'ndjson' supported) */
  format: 'ndjson';
  /** Directory to save output files */
  directory: string;
  /** Whether to include timestamps in filenames */
  includeTimestamp: boolean;
  /** Whether to compress output files */
  compressOutput: boolean;
}

/**
 * Event Generation Configuration
 * 
 * Controls the probabilities and logic for event sequencing.
 */
export interface EventGenerationConfig {
  /** Probability of continuing current session vs starting new one */
  sessionContinuationProbability: number;
  /** Probability of adding item to cart during browsing */
  addToCartProbability: number;
  /** Probability of viewing cart after adding item */
  viewCartAfterAddProbability: number;
  /** Probability of checkout after viewing cart */
  checkoutAfterViewCartProbability: number;
  /** Probability of transaction completion after checkout */
  transactionAfterCheckoutProbability: number;
  /** Probability of removing item from cart */
  removeFromCartProbability: number;
}

/**
 * User Profile Configuration
 * 
 * Controls user profile generation settings.
 */
export interface UserProfileConfig {
  /** Probability of user being registered vs anonymous */
  registeredUserProbability: number;
  /** Probability of having mobile ID for different user types */
  mobileIdProbability: {
    registered: number;
    anonymous: number;
  };
}

/**
 * Logging Configuration
 * 
 * Controls logging and progress reporting.
 */
export interface LoggingConfig {
  /** Log level (debug, info, warn, error) */
  level: 'debug' | 'info' | 'warn' | 'error';
  /** Whether to show progress during generation */
  showProgress: boolean;
  /** Whether to show summary after generation */
  showSummary: boolean;
}

/**
 * Main Configuration Interface
 * 
 * Combines all configuration sections into a single interface.
 */
export interface Config {
  dataGeneration: DataGenerationConfig;
  output: OutputConfig;
  eventGeneration: EventGenerationConfig;
  userProfiles: UserProfileConfig;
  logging: LoggingConfig;
}

/**
 * Default Configuration
 * 
 * Provides sensible defaults for all configuration options.
 */
export const DEFAULT_CONFIG: Config = {
  dataGeneration: {
    country: 'US',
    userCount: 20,
    eventCountPerUser: {
      min: 10,
      max: 20
    },
    anonymousUserCount: {
      min: 5,
      max: 10
    }
  },
  output: {
    format: 'ndjson',
    directory: 'output',
    includeTimestamp: true,
    compressOutput: false
  },
  eventGeneration: {
    sessionContinuationProbability: 0.7,
    addToCartProbability: 0.3,
    viewCartAfterAddProbability: 0.6,
    checkoutAfterViewCartProbability: 0.4,
    transactionAfterCheckoutProbability: 0.3,
    removeFromCartProbability: 0.2
  },
  userProfiles: {
    registeredUserProbability: 0.7,
    mobileIdProbability: {
      registered: 0.3,
      anonymous: 0.4
    }
  },
  logging: {
    level: 'info',
    showProgress: true,
    showSummary: true
  }
}; 