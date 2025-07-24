/**
 * Configuration Service
 * 
 * This service is responsible for managing application configuration including
 * loading, validation, environment-specific settings, and hot-reloading capabilities.
 * It provides a centralized way to handle all configuration-related operations.
 * 
 * This service improves upon the existing configLoader utility by providing
 * more sophisticated configuration management and validation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Config, DEFAULT_CONFIG } from '../types/config';

/**
 * Configuration Service
 * 
 * Handles all configuration-related operations including loading, validation,
 * environment-specific settings, and configuration updates.
 */
export class ConfigurationService {
  private config: Config;
  private configPath: string;
  private environment: string;

  constructor(configPath: string = 'config.json') {
    this.configPath = configPath;
    this.environment = process.env['NODE_ENV'] || 'development';
    this.config = this.loadConfiguration();
  }

  /**
   * Loads configuration from file with fallback to defaults
   * 
   * @returns Config - The loaded configuration
   */
  private loadConfiguration(): Config {
    try {
      // Check if config file exists
      if (!fs.existsSync(this.configPath)) {
        console.log(`⚠️  Configuration file '${this.configPath}' not found. Using default configuration.`);
        return this.createDefaultConfig();
      }

      // Read and parse config file
      const configContent = fs.readFileSync(this.configPath, 'utf8');
      const userConfig = JSON.parse(configContent) as Partial<Config>;

      // Merge with defaults
      const mergedConfig = this.mergeConfig(DEFAULT_CONFIG, userConfig);

      console.log(`✅ Configuration loaded from '${this.configPath}'`);
      
      if (mergedConfig.logging.level === 'debug') {
        console.log('🔧 Configuration:', JSON.stringify(mergedConfig, null, 2));
      }

      return mergedConfig;

    } catch (error) {
      console.error(`❌ Error loading configuration from '${this.configPath}':`, error);
      console.log('🔄 Falling back to default configuration.');
      return this.createDefaultConfig();
    }
  }

  /**
   * Creates a default configuration file
   * 
   * @returns Config - The default configuration
   */
  private createDefaultConfig(): Config {
    const defaultConfig = { ...DEFAULT_CONFIG };
    
    // Apply environment-specific overrides
    this.applyEnvironmentOverrides(defaultConfig);
    
    return defaultConfig;
  }

  /**
   * Applies environment-specific configuration overrides
   * 
   * @param config - The configuration to modify
   */
  private applyEnvironmentOverrides(config: Config): void {
    switch (this.environment) {
      case 'production':
        config.logging.level = 'warn';
        config.logging.showProgress = false;
        config.logging.showSummary = true;
        config.output.compressOutput = true;
        break;
      
      case 'test':
        config.dataGeneration.userCount = 5;
        config.dataGeneration.eventCountPerUser.min = 2;
        config.dataGeneration.eventCountPerUser.max = 5;
        config.logging.level = 'error';
        config.logging.showProgress = false;
        config.logging.showSummary = false;
        break;
      
      case 'development':
      default:
        config.logging.level = 'info';
        config.logging.showProgress = true;
        config.logging.showSummary = true;
        break;
    }
  }

  /**
   * Merges user configuration with default configuration
   * 
   * @param defaults - Default configuration object
   * @param userConfig - User-provided configuration (partial)
   * @returns Config - Merged configuration object
   */
  private mergeConfig(defaults: Config, userConfig: Partial<Config>): Config {
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
   * Gets the current configuration
   * 
   * @returns Config - The current configuration
   */
  getConfig(): Config {
    return this.config;
  }

  /**
   * Updates the configuration
   * 
   * @param updates - Partial configuration updates
   * @returns boolean - True if update was successful
   */
  updateConfig(updates: Partial<Config>): boolean {
    try {
      this.config = this.mergeConfig(this.config, updates);
      this.saveConfig();
      return true;
    } catch (error) {
      console.error('❌ Error updating configuration:', error);
      return false;
    }
  }

  /**
   * Saves the current configuration to file
   * 
   * @returns boolean - True if save was successful
   */
  saveConfig(): boolean {
    try {
      const configDir = path.dirname(this.configPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      console.log(`✅ Configuration saved to '${this.configPath}'`);
      return true;
    } catch (error) {
      console.error('❌ Error saving configuration:', error);
      return false;
    }
  }

  /**
   * Reloads configuration from file
   * 
   * @returns boolean - True if reload was successful
   */
  reloadConfig(): boolean {
    try {
      this.config = this.loadConfiguration();
      return true;
    } catch (error) {
      console.error('❌ Error reloading configuration:', error);
      return false;
    }
  }

  /**
   * Validates the current configuration
   * 
   * @returns boolean - True if configuration is valid
   */
  validateConfig(): boolean {
    try {
      // Validate data generation settings
      if (this.config.dataGeneration.userCount < 1) {
        console.error('❌ userCount must be at least 1');
        return false;
      }

      if (this.config.dataGeneration.eventCountPerUser.min < 1) {
        console.error('❌ eventCountPerUser.min must be at least 1');
        return false;
      }

      if (this.config.dataGeneration.eventCountPerUser.max < this.config.dataGeneration.eventCountPerUser.min) {
        console.error('❌ eventCountPerUser.max must be greater than or equal to min');
        return false;
      }

      if (this.config.dataGeneration.anonymousUserCount.min < 0) {
        console.error('❌ anonymousUserCount.min must be at least 0');
        return false;
      }

      if (this.config.dataGeneration.anonymousUserCount.max < this.config.dataGeneration.anonymousUserCount.min) {
        console.error('❌ anonymousUserCount.max must be greater than or equal to min');
        return false;
      }

      // Validate probability settings
      const probabilities = [
        this.config.eventGeneration.sessionContinuationProbability,
        this.config.eventGeneration.addToCartProbability,
        this.config.eventGeneration.viewCartAfterAddProbability,
        this.config.eventGeneration.checkoutAfterViewCartProbability,
        this.config.eventGeneration.transactionAfterCheckoutProbability,
        this.config.eventGeneration.removeFromCartProbability,
        this.config.userProfiles.registeredUserProbability,
        this.config.userProfiles.mobileIdProbability.registered,
        this.config.userProfiles.mobileIdProbability.anonymous
      ];

      for (const prob of probabilities) {
        if (prob < 0 || prob > 1) {
          console.error('❌ All probability values must be between 0 and 1');
          return false;
        }
      }

      // Validate output settings
      if (!this.config.output.directory) {
        console.error('❌ output.directory is required');
        return false;
      }

      // Validate logging settings
      const validLogLevels = ['debug', 'info', 'warn', 'error'];
      if (!validLogLevels.includes(this.config.logging.level)) {
        console.error('❌ logging.level must be one of: debug, info, warn, error');
        return false;
      }

      console.log('✅ Configuration validation passed');
      return true;
    } catch (error) {
      console.error('❌ Configuration validation failed:', error);
      return false;
    }
  }

  /**
   * Gets environment-specific configuration
   * 
   * @returns Config - Environment-specific configuration
   */
  getEnvironmentConfig(): Config {
    const envConfig = { ...this.config };
    this.applyEnvironmentOverrides(envConfig);
    return envConfig;
  }

  /**
   * Gets the current environment
   * 
   * @returns string - The current environment
   */
  getEnvironment(): string {
    return this.environment;
  }

  /**
   * Creates a sample configuration file
   * 
   * @param outputPath - Path where to save the sample config
   * @returns boolean - True if creation was successful
   */
  createSampleConfig(outputPath: string = 'config.sample.json'): boolean {
    try {
      const sampleConfig = {
        ...DEFAULT_CONFIG,
        dataGeneration: {
          ...DEFAULT_CONFIG.dataGeneration,
          userCount: 10,
          eventCountPerUser: { min: 5, max: 10 }
        },
        logging: {
          ...DEFAULT_CONFIG.logging,
          level: 'info',
          showProgress: true,
          showSummary: true
        }
      };

      fs.writeFileSync(outputPath, JSON.stringify(sampleConfig, null, 2));
      console.log(`✅ Sample configuration created at '${outputPath}'`);
      return true;
    } catch (error) {
      console.error('❌ Error creating sample configuration:', error);
      return false;
    }
  }

  /**
   * Gets configuration statistics
   * 
   * @returns object - Configuration statistics
   */
  getConfigStats(): {
    environment: string;
    userCount: number;
    totalEvents: number;
    outputFormat: string;
    logLevel: string;
  } {
    const totalEvents = this.config.dataGeneration.userCount * 
      ((this.config.dataGeneration.eventCountPerUser.min + this.config.dataGeneration.eventCountPerUser.max) / 2);

    return {
      environment: this.environment,
      userCount: this.config.dataGeneration.userCount,
      totalEvents: Math.round(totalEvents),
      outputFormat: this.config.output.format,
      logLevel: this.config.logging.level
    };
  }
} 