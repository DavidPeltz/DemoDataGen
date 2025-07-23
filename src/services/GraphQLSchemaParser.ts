/**
 * GraphQL Schema Parser Service
 * 
 * This service is responsible for parsing GraphQL schema files and extracting
 * type definitions, field mappings, and validation information. It provides
 * a clean interface for schema analysis and error handling.
 * 
 * Extracted from GraphQLDataGenerator.ts to improve separation of concerns
 * and reduce the complexity of the main generator class.
 */

import { parseGraphQLSchema } from '../utils/graphqlParser';
import { GraphQLSchema } from '../types/graphql';

/**
 * GraphQL Schema Parser Service
 * 
 * Handles the parsing and analysis of GraphQL schema files, providing
 * clean interfaces for schema validation and field mapping generation.
 */
export class GraphQLSchemaParser {
  private schema: GraphQLSchema | null = null;
  private errors: string[] = [];
  private warnings: string[] = [];

  /**
   * Loads and parses a GraphQL schema file
   * 
   * @param schemaPath - Path to the GraphQL schema file
   * @returns boolean - True if schema loaded successfully
   */
  loadSchema(schemaPath: string): boolean {
    const result = parseGraphQLSchema(schemaPath);
    
    this.schema = result.schema;
    this.errors = result.errors;
    this.warnings = result.warnings;
    
    if (this.errors.length > 0) {
      console.error('❌ Errors loading GraphQL schema:');
      this.errors.forEach(error => console.error(`  - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.warn('⚠️  Warnings loading GraphQL schema:');
      this.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    return this.errors.length === 0;
  }

  /**
   * Gets the parsed schema
   * 
   * @returns GraphQLSchema | null - The parsed schema or null if not loaded
   */
  getSchema(): GraphQLSchema | null {
    return this.schema;
  }

  /**
   * Gets all parsing errors
   * 
   * @returns string[] - Array of error messages
   */
  getErrors(): string[] {
    return this.errors;
  }

  /**
   * Gets all parsing warnings
   * 
   * @returns string[] - Array of warning messages
   */
  getWarnings(): string[] {
    return this.warnings;
  }

  /**
   * Checks if the schema is valid
   * 
   * @returns boolean - True if schema is valid and loaded
   */
  isValid(): boolean {
    return this.schema !== null && this.errors.length === 0;
  }

  /**
   * Gets a specific type from the schema
   * 
   * @param typeName - Name of the type to retrieve
   * @returns GraphQLType | null - The type definition or null if not found
   */
  getType(typeName: string): any {
    if (!this.schema) {
      return null;
    }
    return this.schema.types.find(t => t.name === typeName) || null;
  }

  /**
   * Gets all object types from the schema
   * 
   * @returns GraphQLType[] - Array of object type definitions
   */
  getObjectTypes(): any[] {
    if (!this.schema) {
      return [];
    }
    return this.schema.types.filter(t => t.kind === 'OBJECT');
  }

  /**
   * Validates that a type exists and is an object type
   * 
   * @param typeName - Name of the type to validate
   * @returns boolean - True if type exists and is an object type
   */
  validateObjectType(typeName: string): boolean {
    const type = this.getType(typeName);
    return type !== null && type.kind === 'OBJECT';
  }
} 