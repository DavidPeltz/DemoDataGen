/**
 * Demo Data Generator - Main Entry Point
 * 
 * This module serves as the main entry point for the Demo Data Generator application.
 * It orchestrates the generation of realistic user data, products, and events for
 * testing and development purposes. The application supports country-specific data
 * generation with proper ID linking between user profiles and events.
 * 
 * The application also supports GraphQL schema-based data generation, allowing
 * automatic data creation based on customer data platform schema definitions.
 * 
 * Configuration is loaded from config.json file, with fallback to defaults.
 */

// Core generator imports for creating different types of data
import { DataGenerator } from './generators/DataGenerator';
import { UserGenerator } from './generators/UserGenerator';
import { ProductGenerator } from './generators/ProductGenerator';

// Service imports for improved separation of concerns
import { ConfigurationService } from './services/ConfigurationService';
import { LoggingService } from './services/LoggingService';
import { DataValidationService } from './services/DataValidationService';
import { EventGenerator } from './services/EventGenerator';
import { FileService } from './services/FileService';
import { UserProfileService } from './services/UserProfileService';





/**
 * Main entry point for the Demo Data Generator application
 * 
 * This function orchestrates the entire data generation process:
 * 1. Loads configuration from config.json file
 * 2. Validates configuration settings
 * 3. Initializes data generators and services
 * 4. Generates users, products, and mixed data
 * 5. Creates user profiles with tracking information
 * 6. Generates user events with proper linking
 * 7. Saves all data to files
 * 
 * Enhanced GraphQL features include:
 * - Custom object generation with recursive nesting
 * - Smart array generation for complex types
 * - Placeholder objects instead of null values
 * - Sophisticated warning system for unsupported fields
 * 
 * @returns Promise<void>
 */
async function main(): Promise<void> {
  console.log('🚀 Demo Data Generator Starting...\n');

  try {
    // Step 1: Initialize services
    const configService = new ConfigurationService();
    const loggingService = new LoggingService(
      configService.getConfig().logging.level,
      configService.getConfig().logging.showProgress,
      configService.getConfig().logging.showSummary
    );
    const validationService = new DataValidationService();
    
    // Step 2: Load and validate configuration
    const config = configService.getConfig();
    const configValidation = validationService.validateConfiguration(config);
    
    if (!configValidation.isValid) {
      loggingService.error('Configuration validation failed');
      configValidation.errors.forEach(error => loggingService.error(error));
      return;
    }
    
    if (configValidation.warnings.length > 0) {
      loggingService.warn('Configuration warnings detected');
      configValidation.warnings.forEach(warning => loggingService.warn(warning));
    }
    
    console.log(`📍 Generating data for country: ${config.dataGeneration.country}`);
    console.log(`👥 Generating ${config.dataGeneration.userCount} users...`);
    console.log(`📊 Events per user: ${config.dataGeneration.eventCountPerUser.min}-${config.dataGeneration.eventCountPerUser.max}\n`);

    // Step 3: Initialize data generators and services
    const userGenerator = new UserGenerator();
    const productGenerator = new ProductGenerator();
    const dataGenerator = new DataGenerator();
    
    // Initialize services for improved separation of concerns
    const userProfileService = new UserProfileService(config);
    const eventGenerator = new EventGenerator(config);
    const fileService = new FileService(config);

    // Step 4: Generate sample data
    if (config.logging.showProgress) {
      console.log('📊 Generating sample data...\n');
    }

    // Generate users for the specified country with country-specific data
    const users = userGenerator.generateUsersForCountry(config.dataGeneration.userCount, config.dataGeneration.country);
    
    // Convert users to profiles with tracking information using the service
    const userProfiles = userProfileService.generateUserProfiles(users);
    
    // Display generated user profiles with visual indicators
    userProfileService.displayUserProfiles(userProfiles);

    // Generate 3 sample products
    const products = productGenerator.generateProducts(3);
    if (config.logging.showSummary) {
      console.log('🛍️  Generated Products:');
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price.toFixed(2)}`);
      });
      console.log('\n');
    }

    // Generate 10 mixed data items (users, products, orders, reviews, anonymous events)
    const mixedData = dataGenerator.generateMixedData(10);
    if (config.logging.showSummary) {
      console.log('🎲 Generated Mixed Data:');
      mixedData.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.type}: ${item.description}`);
      });
      console.log('\n');
    }

    // Generate user events with proper linking to profiles using the service
    const events = eventGenerator.generateUserEvents(userProfiles, config.dataGeneration.country);
    if (config.logging.showSummary) {
      console.log(`📊 Generated ${events.length} User Events (last 30 days)`);
    }
    
    // Save all generated data to files using the service
    fileService.saveDataToFiles(userProfiles, events, config.dataGeneration.country);

    if (config.logging.showSummary) {
      console.log('\n✅ Demo data generation completed successfully!');
    }

  } catch (error) {
    console.error('❌ Error generating demo data:', error);
    process.exit(1);
  }
}

// Run the program if this file is executed directly (not imported as a module)
if (require.main === module) {
  main().catch(console.error);
}

// Export main function for potential use as a module
export { main }; 