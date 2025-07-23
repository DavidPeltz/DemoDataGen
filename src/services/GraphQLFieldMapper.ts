/**
 * GraphQL Field Mapper Service
 * 
 * This service is responsible for mapping GraphQL fields to appropriate data
 * generation strategies. It analyzes field types, names, and contexts to
 * determine the best approach for generating realistic data.
 * 
 * Extracted from GraphQLDataGenerator.ts to improve separation of concerns
 * and provide focused field mapping functionality.
 */

import { GraphQLField, DataFieldMapping, DataGenerationStrategy } from '../types/graphql';

/**
 * GraphQL Field Mapper Service
 * 
 * Handles the mapping of GraphQL fields to data generation strategies,
 * providing intelligent field analysis and strategy determination.
 */
export class GraphQLFieldMapper {
  private fieldMappings: DataFieldMapping[] = [];

  /**
   * Generates field mappings for a GraphQL schema
   * 
   * @param schema - The GraphQL schema to analyze
   * @returns DataFieldMapping[] - Array of field mappings
   */
  generateFieldMappings(schema: any): DataFieldMapping[] {
    this.fieldMappings = [];
    
    if (!schema || !schema.types) {
      return this.fieldMappings;
    }

    schema.types.forEach((type: any) => {
      if (type.kind === 'OBJECT' && type.fields) {
        type.fields.forEach((field: GraphQLField) => {
          const mapping = this.createFieldMapping(field, type.name);
          if (mapping) {
            this.fieldMappings.push(mapping);
          }
        });
      }
    });

    return this.fieldMappings;
  }

  /**
   * Creates a field mapping for a specific field
   * 
   * @param field - The GraphQL field to map
   * @param typeName - The name of the parent type
   * @returns DataFieldMapping | null - The field mapping or null if not mappable
   */
  private createFieldMapping(field: GraphQLField, typeName: string): DataFieldMapping | null {
    const strategy = this.determineStrategy(field);
    
    if (!strategy) {
      return null;
    }

    return {
      fieldName: field.name,
      typeName: typeName,
      strategy,
      config: {
        description: this.generateMappingDescription(field, strategy)
      }
    };
  }

  /**
   * Determines the best data generation strategy for a field
   * 
   * @param field - The GraphQL field to analyze
   * @returns DataGenerationStrategy | null - The determined strategy or null
   */
  determineStrategy(field: GraphQLField): DataGenerationStrategy | null {
    // First, try to determine strategy from field name
    const nameBasedStrategy = this.determineStrategyFromFieldName(field.name);
    if (nameBasedStrategy) {
      return nameBasedStrategy;
    }

    // Then, analyze field type
    return this.determineStrategyFromFieldType(field);
  }

  /**
   * Determines strategy based on field name patterns
   * 
   * @param fieldName - The name of the field
   * @returns DataGenerationStrategy | null - The determined strategy or null
   */
  private determineStrategyFromFieldName(fieldName: string): DataGenerationStrategy | null {
    const lowerFieldName = fieldName.toLowerCase();

    // User-related fields
    if (lowerFieldName.includes('name') || lowerFieldName.includes('title')) {
      return 'fullName';
    }
    if (lowerFieldName.includes('email')) {
      return 'email';
    }
    if (lowerFieldName.includes('phone')) {
      return 'phone';
    }
    if (lowerFieldName.includes('address')) {
      return 'address';
    }
    if (lowerFieldName.includes('city')) {
      return 'city';
    }
    if (lowerFieldName.includes('country')) {
      return 'country';
    }
    if (lowerFieldName.includes('zip') || lowerFieldName.includes('postal')) {
      return 'zipCode';
    }
    if (lowerFieldName.includes('state') || lowerFieldName.includes('province')) {
      return 'state';
    }

    // Date/time fields
    if (lowerFieldName.includes('date') || lowerFieldName.includes('time')) {
      return 'date';
    }
    if (lowerFieldName.includes('created') || lowerFieldName.includes('updated')) {
      return 'date';
    }

    // ID fields
    if (lowerFieldName.includes('id')) {
      return 'uuid';
    }

    // URL fields
    if (lowerFieldName.includes('url') || lowerFieldName.includes('link')) {
      return 'url';
    }

    // Price/money fields
    if (lowerFieldName.includes('price') || lowerFieldName.includes('cost') || lowerFieldName.includes('amount')) {
      return 'price';
    }

    // Description fields
    if (lowerFieldName.includes('description') || lowerFieldName.includes('content')) {
      return 'string';
    }

    // Boolean fields
    if (lowerFieldName.includes('is') || lowerFieldName.includes('has') || lowerFieldName.includes('active')) {
      return 'boolean';
    }

    return null;
  }

  /**
   * Determines strategy based on field type analysis
   * 
   * @param field - The GraphQL field to analyze
   * @returns DataGenerationStrategy | null - The determined strategy or null
   */
  private determineStrategyFromFieldType(field: GraphQLField): DataGenerationStrategy | null {
    const fieldType = this.getBaseType(field.type);
    
    if (!fieldType) {
      return null;
    }

    // Handle different GraphQL types
    switch (fieldType.kind) {
      case 'SCALAR':
        return this.getScalarStrategy(fieldType.name);
      case 'ENUM':
        return 'enum';
      case 'OBJECT':
        return 'custom';
      case 'LIST':
        return 'custom';
      default:
        return 'string';
    }
  }

  /**
   * Gets strategy for scalar types
   * 
   * @param scalarName - The name of the scalar type
   * @returns DataGenerationStrategy - The appropriate strategy
   */
  private getScalarStrategy(scalarName: string): DataGenerationStrategy {
    switch (scalarName) {
      case 'String':
        return 'string';
      case 'Int':
        return 'integer';
      case 'Float':
        return 'float';
      case 'Boolean':
        return 'boolean';
      case 'ID':
        return 'uuid';
      case 'DateTime':
        return 'datetime';
      case 'Date':
        return 'date';
      default:
        return 'string';
    }
  }

  /**
   * Gets the base type from a GraphQL type
   * 
   * @param fieldType - The GraphQL field type
   * @returns any - The base type definition
   */
  private getBaseType(fieldType: any): any {
    if (fieldType.kind === 'NON_NULL') {
      return this.getBaseType(fieldType.ofType);
    }
    if (fieldType.kind === 'LIST') {
      return fieldType.ofType;
    }
    return fieldType;
  }

  /**
   * Generates a description for a field mapping
   * 
   * @param field - The GraphQL field
   * @param strategy - The determined strategy
   * @returns string - The mapping description
   */
  private generateMappingDescription(field: GraphQLField, strategy: DataGenerationStrategy): string {
    return `Field '${field.name}' mapped to '${strategy}' strategy`;
  }

  /**
   * Gets all field mappings
   * 
   * @returns DataFieldMapping[] - Array of field mappings
   */
  getFieldMappings(): DataFieldMapping[] {
    return this.fieldMappings;
  }

  /**
   * Gets field mappings for a specific type
   * 
   * @param typeName - The name of the type
   * @returns DataFieldMapping[] - Array of field mappings for the type
   */
  getFieldMappingsForType(typeName: string): DataFieldMapping[] {
    return this.fieldMappings.filter(mapping => mapping.typeName === typeName);
  }

  /**
   * Validates field mappings
   * 
   * @returns boolean - True if all mappings are valid
   */
  validateMappings(): boolean {
    return this.fieldMappings.every(mapping => 
      mapping.fieldName && 
      mapping.strategy && 
      mapping.typeName
    );
  }
} 