/**
 * GraphQL Generation Service
 * 
 * This service handles GraphQL schema-based data generation, providing a clean interface
 * for generating data based on GraphQL schema definitions. It integrates with the main
 * application flow and handles configuration-based generation decisions.
 * 
 * Key Features:
 * - Schema parsing and validation
 * - Intelligent field mapping for data generation
 * - Graceful handling of non-standard GraphQL objects
 * - Integration with main application configuration
 * - Comprehensive error handling and logging
 */

import { GraphQLDataGenerator } from '../generators/GraphQLDataGenerator';
import { GraphQLConfig } from '../types/config';
import { LoggingService } from './LoggingService';

/**
 * GraphQL Generation Service
 * 
 * Handles the generation of data based on GraphQL schema definitions,
 * providing integration with the main application configuration and
 * graceful handling of complex schema structures.
 */
export class GraphQLGenerationService {
  private generator: GraphQLDataGenerator;
  private loggingService: LoggingService;
  private config: GraphQLConfig;

  /**
   * Creates a new GraphQL Generation Service instance
   * 
   * @param config - GraphQL configuration settings
   * @param loggingService - Logging service for output and error handling
   */
  constructor(config: GraphQLConfig, loggingService: LoggingService) {
    this.config = config;
    this.loggingService = loggingService;
    this.generator = new GraphQLDataGenerator();
  }

  /**
   * Determines if GraphQL generation should be performed based on configuration
   * 
   * @returns boolean - True if GraphQL generation is enabled and configured
   */
  isGraphQLEnabled(): boolean {
    return this.config.enabled && !!this.config.schemaPath;
  }

  /**
   * Generates data based on GraphQL schema if enabled
   * 
   * This method checks if GraphQL generation is enabled in the configuration
   * and if so, loads the schema, generates data, and returns the results.
   * Non-standard GraphQL objects are handled gracefully by being ignored.
   * 
   * @returns Promise<Record<string, any[]> | null> - Generated data or null if not enabled
   */
  async generateGraphQLData(): Promise<Record<string, any[]> | null> {
    if (!this.isGraphQLEnabled()) {
      this.loggingService.info('GraphQL generation is disabled in configuration');
      return null;
    }

    try {
      this.loggingService.info('🔍 Starting GraphQL-based data generation');
      this.loggingService.info(`📋 Using schema file: ${this.config.schemaPath}`);

      // Load and parse the GraphQL schema
      const schemaLoaded = await this.loadSchema();
      if (!schemaLoaded) {
        this.loggingService.error('Failed to load GraphQL schema');
        return null;
      }

      // Generate data based on configuration
      const generatedData = await this.generateData();
      
      this.loggingService.info(`✅ GraphQL generation completed: ${Object.keys(generatedData).length} types`);
      return generatedData;

    } catch (error) {
      this.loggingService.error(`GraphQL generation failed: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Loads and validates the GraphQL schema file
   * 
   * This method loads the schema file specified in the configuration,
   * parses it, and validates that it contains usable object types.
   * Non-standard GraphQL objects are filtered out gracefully.
   * 
   * @returns Promise<boolean> - True if schema loaded successfully
   */
  private async loadSchema(): Promise<boolean> {
    try {
      const schemaLoaded = this.generator.loadSchema(this.config.schemaPath!);
      
      if (!schemaLoaded) {
        const errors = this.generator.getErrors();
        this.loggingService.error('GraphQL schema loading failed');
        errors.forEach(error => this.loggingService.error(`  - ${error}`));
        return false;
      }

      // Log schema analysis
      const schema = this.generator.getSchema();
      if (schema) {
        const objectTypes = schema.types.filter(t => t.kind === 'OBJECT');
        this.loggingService.info(`📊 Found ${objectTypes.length} object types in schema`);
        
        // Log warnings about non-standard objects
        const warnings = this.generator.getWarnings();
        if (warnings.length > 0) {
          this.loggingService.warn(`⚠️  ${warnings.length} schema parsing warnings (non-standard objects handled gracefully)`);
          // Show detailed warnings only in debug mode
          if (this.config.includeFieldMappings) {
            warnings.slice(0, 5).forEach(warning => this.loggingService.warn(`  - ${warning}`));
          }
        }
      }

      return true;

    } catch (error) {
      this.loggingService.error(`Schema loading error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Generates data for all types in the schema based on configuration
   * 
   * This method generates data according to the configuration settings:
   * - If generateAllTypes is true, generates data for all object types
   * - If targetTypes is specified, generates data only for those types
   * - Uses the specified recordsPerType count
   * 
   * @returns Promise<Record<string, any[]>> - Generated data organized by type
   */
  private async generateData(): Promise<Record<string, any[]>> {
    try {
      if (this.config.generateAllTypes) {
        this.loggingService.info(`📊 Generating data for all types (${this.config.recordsPerType} records each)`);
        return this.generator.generateDataForAllTypes(this.config.recordsPerType);
      } else if (this.config.targetTypes && this.config.targetTypes.length > 0) {
        this.loggingService.info(`📊 Generating data for specific types: ${this.config.targetTypes.join(', ')}`);
        const typeCounts: Record<string, number> = {};
        this.config.targetTypes.forEach(typeName => {
          typeCounts[typeName] = this.config.recordsPerType;
        });
        return this.generator.generateDataForTypes(typeCounts);
      } else {
        this.loggingService.warn('No GraphQL types specified for generation');
        return {};
      }

    } catch (error) {
      this.loggingService.error(`Data generation error: ${error instanceof Error ? error.message : String(error)}`);
      return {};
    }
  }

  /**
   * Gets field mapping information for debugging and analysis
   * 
   * @returns Array of field mappings with type and strategy information
   */
  getFieldMappings(): any[] {
    return this.generator.getFieldMappings();
  }

  /**
   * Gets schema information for analysis and debugging
   * 
   * @returns GraphQL schema object or null if not loaded
   */
  getSchema(): any {
    return this.generator.getSchema();
  }

  /**
   * Gets any errors that occurred during schema loading or data generation
   * 
   * @returns Array of error messages
   */
  getErrors(): string[] {
    return this.generator.getErrors();
  }

  /**
   * Gets any warnings that occurred during schema loading or data generation
   * 
   * @returns Array of warning messages
   */
  getWarnings(): string[] {
    return this.generator.getWarnings();
  }
} 