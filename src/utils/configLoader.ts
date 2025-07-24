/**
 * Configuration Loader Utility
 * 
 * This module handles loading and validating configuration from the config.json file.
 * It provides fallback to default values and ensures type safety.
 */

import * as fs from 'fs';
import { Config, DEFAULT_CONFIG } from '../types/config';

/**
 * Loads configuration from config.json file
 * 
 * This function reads the configuration file and merges it with default values.
 * If the config file doesn't exist or is invalid, it falls back to defaults.
 * 
 * @param configPath - Path to the configuration file (defaults to 'config.json')
 * @returns Config - Merged configuration object
 */
export function loadConfig(configPath: string = 'config.json'): Config {
  try {
    // Check if config file exists
    if (!fs.existsSync(configPath)) {
      console.log(`⚠️  Configuration file '${configPath}' not found. Using default configuration.`);
      return DEFAULT_CONFIG;
    }

    // Read and parse config file
    const configContent = fs.readFileSync(configPath, 'utf8');
    const userConfig = JSON.parse(configContent) as Partial<Config>;

    // Merge with defaults
    const mergedConfig = mergeConfig(DEFAULT_CONFIG, userConfig);

    console.log(`✅ Configuration loaded from '${configPath}'`);
    
    if (mergedConfig.logging.level === 'debug') {
      console.log('🔧 Configuration:', JSON.stringify(mergedConfig, null, 2));
    }

    return mergedConfig;

  } catch (error) {
    console.error(`❌ Error loading configuration from '${configPath}':`, error);
    console.log('🔄 Falling back to default configuration.');
    return DEFAULT_CONFIG;
  }
}

/**
 * Merges user configuration with default configuration
 * 
 * This function performs a deep merge of the user configuration with the default
 * configuration, ensuring all required fields are present.
 * 
 * @param defaults - Default configuration object
 * @param userConfig - User-provided configuration (partial)
 * @returns Config - Merged configuration object
 */
function mergeConfig(defaults: Config, userConfig: Partial<Config>): Config {
  return {
    dataGeneration: {
      ...defaults.dataGeneration,
      ...userConfig.dataGeneration,
      eventCountPerUser: {
        ...defaults.dataGeneration.eventCountPerUser,
        ...userConfig.dataGeneration?.eventCountPerUser
      },
      anonymousUserCount: {
        ...defaults.dataGeneration.anonymousUserCount,
        ...userConfig.dataGeneration?.anonymousUserCount
      }
    },
    output: {
      ...defaults.output,
      ...userConfig.output
    },
    eventGeneration: {
      ...defaults.eventGeneration,
      ...userConfig.eventGeneration
    },
    userProfiles: {
      ...defaults.userProfiles,
      ...userConfig.userProfiles,
      mobileIdProbability: {
        ...defaults.userProfiles.mobileIdProbability,
        ...userConfig.userProfiles?.mobileIdProbability
      }
    },
    logging: {
      ...defaults.logging,
      ...userConfig.logging
    },
    graphql: {
      ...defaults.graphql,
      ...userConfig.graphql
    },
    cdp: {
      ...defaults.cdp,
      ...userConfig.cdp
    }
  };
}

/**
 * Validates configuration values
 * 
 * This function checks that all configuration values are within valid ranges
 * and provides warnings for potentially problematic settings.
 * 
 * @param config - Configuration object to validate
 * @returns boolean - True if configuration is valid
 */
export function validateConfig(config: Config): boolean {
  const warnings: string[] = [];

  // Validate data generation settings
  if (config.dataGeneration.userCount < 1) {
    warnings.push('User count should be at least 1');
  }
  if (config.dataGeneration.userCount > 10000) {
    warnings.push('User count is very high (>10,000), this may take a long time');
  }
  if (config.dataGeneration.eventCountPerUser.min < 1) {
    warnings.push('Minimum event count per user should be at least 1');
  }
  if (config.dataGeneration.eventCountPerUser.max < config.dataGeneration.eventCountPerUser.min) {
    warnings.push('Maximum event count should be greater than or equal to minimum');
  }

  // Validate probability settings
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
      warnings.push(`${name} should be between 0 and 1 (got ${value})`);
    }
  });

  // Display warnings if any
  if (warnings.length > 0) {
    console.log('⚠️  Configuration warnings:');
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  return warnings.length === 0;
}

/**
 * Creates a sample configuration file
 * 
 * This function creates a sample config.json file with default values
 * and helpful comments for users to customize.
 * 
 * @param outputPath - Path where to create the sample config file
 */
export function createSampleConfig(outputPath: string = 'config.json'): void {
  const sampleConfig = {
    "dataGeneration": {
      "country": "US",
      "userCount": 20,
      "eventCountPerUser": {
        "min": 10,
        "max": 20
      },
      "anonymousUserCount": {
        "min": 5,
        "max": 10
      }
    },
    "output": {
      "format": "ndjson",
      "directory": "output",
      "includeTimestamp": true,
      "compressOutput": false
    },
    "eventGeneration": {
      "sessionContinuationProbability": 0.7,
      "addToCartProbability": 0.3,
      "viewCartAfterAddProbability": 0.6,
      "checkoutAfterViewCartProbability": 0.4,
      "transactionAfterCheckoutProbability": 0.3,
      "removeFromCartProbability": 0.2
    },
    "userProfiles": {
      "registeredUserProbability": 0.7,
      "mobileIdProbability": {
        "registered": 0.3,
        "anonymous": 0.4
      }
    },
    "logging": {
      "level": "info",
      "showProgress": true,
      "showSummary": true
    }
  };

  try {
    fs.writeFileSync(outputPath, JSON.stringify(sampleConfig, null, 2));
    console.log(`✅ Sample configuration created at '${outputPath}'`);
  } catch (error) {
    console.error(`❌ Error creating sample configuration:`, error);
  }
} 