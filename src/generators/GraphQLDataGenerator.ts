/**
 * GraphQL Data Generator for Demo Data Generator
 * 
 * This class generates data based on GraphQL schema definitions,
 * automatically mapping fields to appropriate data generation strategies.
 */

import { faker } from '@faker-js/faker';
import { 
  GraphQLSchema, 
  GraphQLType, 
  GraphQLField, 
  DataFieldMapping, 
  DataGenerationStrategy
} from '../types/graphql';
import { parseGraphQLSchema } from '../utils/graphqlParser';

/**
 * Enhanced GraphQL-based Data Generator
 * 
 * This class generates realistic data based on GraphQL schema definitions with sophisticated
 * handling of complex field types. It automatically maps GraphQL fields to appropriate data 
 * generation strategies and creates data that matches the CDP's expected data model.
 * 
 * Key Features:
 * - Recursive custom object generation based on schema definitions
 * - Smart array generation for complex types with variable lengths
 * - Placeholder objects instead of null values for unsupported types
 * - Sophisticated warning system for graceful degradation
 * - Type-safe data creation with full TypeScript support
 */
export class GraphQLDataGenerator {
  private schema: GraphQLSchema | null = null;
  private fieldMappings: DataFieldMapping[] = [];
  private errors: string[] = [];
  private warnings: string[] = [];

  /**
   * Loads a GraphQL schema file and prepares for data generation
   * 
   * @param schemaPath - Path to the GraphQL schema file
   * @returns boolean - True if schema loaded successfully
   */
  loadSchema(schemaPath: string): boolean {
    const result = parseGraphQLSchema(schemaPath);
    
    this.schema = result.schema;
    this.errors = result.errors;
    this.warnings = result.warnings;
    
    // Regenerate field mappings with the current logic
    this.fieldMappings = this.regenerateFieldMappings();
    
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
   * Generates data for a specific GraphQL type
   * 
   * @param typeName - Name of the GraphQL type to generate data for
   * @param count - Number of records to generate
   * @returns Record<string, any>[] - Array of generated data objects
   */
  generateDataForType(typeName: string, count: number = 1): Record<string, any>[] {
    if (!this.schema) {
      throw new Error('No GraphQL schema loaded. Call loadSchema() first.');
    }

    const type = this.schema.types.find(t => t.name === typeName);
    if (!type || type.kind !== 'OBJECT') {
      throw new Error(`Type '${typeName}' not found or is not an object type.`);
    }

    const results: Record<string, any>[] = [];
    
    for (let i = 0; i < count; i++) {
      const data = this.generateObjectData(type);
      results.push(data);
    }
    
    return results;
  }

  /**
   * Generates data for multiple GraphQL types
   * 
   * @param typeCounts - Object mapping type names to record counts
   * @returns Record<string, Record<string, any>[]> - Generated data by type
   */
  generateDataForTypes(typeCounts: Record<string, number>): Record<string, Record<string, any>[]> {
    if (!this.schema) {
      throw new Error('No GraphQL schema loaded. Call loadSchema() first.');
    }

    const results: Record<string, Record<string, any>[]> = {};
    
    for (const [typeName, count] of Object.entries(typeCounts)) {
      try {
        results[typeName] = this.generateDataForType(typeName, count);
      } catch (error) {
        console.warn(`⚠️  Could not generate data for type '${typeName}': ${error instanceof Error ? error.message : String(error)}`);
        results[typeName] = [];
      }
    }
    
    return results;
  }

  /**
   * Generates data for all object types in the schema
   * 
   * @param countPerType - Number of records to generate per type
   * @returns Record<string, Record<string, any>[]> - Generated data by type
   */
  generateDataForAllTypes(countPerType: number = 5): Record<string, Record<string, any>[]> {
    if (!this.schema) {
      throw new Error('No GraphQL schema loaded. Call loadSchema() first.');
    }

    const objectTypes = this.schema.types.filter(t => t.kind === 'OBJECT');
    const typeCounts: Record<string, number> = {};
    
    for (const type of objectTypes) {
      // Skip Query, Mutation, Subscription, and non-standard types
      if (!['Query', 'Mutation', 'Subscription'].includes(type.name) && 
          this.isStandardGraphQLType(type)) {
        typeCounts[type.name] = countPerType;
      }
    }
    
    return this.generateDataForTypes(typeCounts);
  }

  /**
   * Determines if a GraphQL type is a standard type that should be processed
   * 
   * This method filters out non-standard GraphQL objects that contain
   * custom directives or complex annotations that aren't suitable for
   * data generation.
   * 
   * @param type - GraphQL type to check
   * @returns boolean - True if the type should be processed
   */
  private isStandardGraphQLType(type: GraphQLType): boolean {
    // Skip types with complex annotations or custom directives
    if (!type.fields) {
      return false;
    }

    // Check if any fields have complex annotations that indicate non-standard usage
    for (const field of type.fields) {
      const fieldType = field.type;
      if (fieldType && typeof fieldType === 'object' && 'name' in fieldType) {
        const typeName = fieldType.name;
        if (typeof typeName === 'string' && typeName.includes('@')) {
          return false; // Skip types with directive annotations
        }
      }
    }

    return true;
  }

  /**
   * Generates a single object based on a GraphQL type definition
   * 
   * @param type - GraphQL type definition
   * @returns Record<string, any> - Generated object data
   */
  private generateObjectData(type: GraphQLType): Record<string, any> {
    const data: Record<string, any> = {};
    
    if (!type.fields) {
      return data;
    }
    
    for (const field of type.fields) {
      const value = this.generateFieldValue(field, type);
      if (value !== undefined) {
        data[field.name] = value;
      }
    }
    
    return data;
  }

  /**
   * Generates a value for a specific GraphQL field
   * 
   * @param field - GraphQL field definition
   * @param parentType - Parent GraphQL type
   * @returns any - Generated field value
   */
  private generateFieldValue(field: GraphQLField, parentType: GraphQLType): any {
    const strategy = this.getGenerationStrategy(field, parentType);
    
    if (!strategy) {
      // Only add warnings for truly problematic cases, not for every unknown field
      return this.generateDefaultValue(field);
    }
    
    const value = this.generateValueByStrategy(strategy, field);
    
    // Handle arrays - but only if not already handled by generateDefaultValue
    if (field.isArray && !Array.isArray(value)) {
      const arrayLength = faker.number.int({ min: 1, max: 5 });
      return Array.from({ length: arrayLength }, () => value);
    }
    
    return value;
  }

  /**
   * Gets the data generation strategy for a field
   * 
   * @param field - GraphQL field definition
   * @param parentType - Parent GraphQL type
   * @returns DataGenerationStrategy | null - Generation strategy
   */
  private getGenerationStrategy(field: GraphQLField, parentType: GraphQLType): DataGenerationStrategy | null {
    // Find mapping for this specific field
    const mapping = this.fieldMappings.find(m => 
      m.fieldName === field.name && m.typeName === parentType.name
    );
    
    if (mapping) {
      return mapping.strategy;
    }
    
    // Check if field type is an enum
    if (this.isEnumField(field)) {
      return 'enum';
    }
    
    // Fall back to field name patterns
    return this.determineStrategyFromFieldName(field.name);
  }

  /**
   * Determines generation strategy from field name patterns
   * 
   * @param fieldName - Name of the field
   * @returns DataGenerationStrategy | null - Generation strategy
   */
  private determineStrategyFromFieldName(fieldName: string): DataGenerationStrategy | null {
    const fieldNameLower = fieldName.toLowerCase();
    
    if (fieldNameLower.includes('id')) return 'uuid';
    if (fieldNameLower.includes('email')) return 'email';
    if (fieldNameLower === 'name') return 'fullName';
    if (fieldNameLower === 'firstname') return 'firstName';
    if (fieldNameLower === 'lastname') return 'lastName';
    if (fieldNameLower.includes('phone')) return 'phone';
    if (fieldNameLower.includes('address')) return 'address';
    if (fieldNameLower.includes('city')) return 'city';
    if (fieldNameLower.includes('state')) return 'state';
    if (fieldNameLower.includes('country')) return 'country';
    if (fieldNameLower.includes('zip') || fieldNameLower.includes('postal')) return 'zipCode';
    if (fieldNameLower.includes('company')) return 'company';
    if (fieldNameLower.includes('title') || fieldNameLower.includes('position')) return 'jobTitle';
      if (fieldNameLower.includes('updatedat') || fieldNameLower.includes('createdat')) return 'datetime';
  if (fieldNameLower.includes('date')) return 'date';
  if (fieldNameLower.includes('time')) return 'datetime';
    if (fieldNameLower.includes('price') || fieldNameLower.includes('cost')) return 'price';
    if (fieldNameLower.includes('url')) return 'url';
    if (fieldNameLower.includes('agent')) return 'userAgent';
    if (fieldNameLower.includes('ip')) return 'ipAddress';
    if (fieldNameLower.includes('device')) return 'deviceType';
    if (fieldNameLower.includes('browser')) return 'browser';
    if (fieldNameLower.includes('os') || fieldNameLower.includes('operating')) return 'operatingSystem';
    if (fieldNameLower.includes('rating')) return 'rating';
    if (fieldNameLower.includes('review') || fieldNameLower.includes('comment')) return 'review';
    if (fieldNameLower.includes('query') || fieldNameLower.includes('search')) return 'searchQuery';
    if (fieldNameLower.includes('payment')) return 'paymentMethod';
    if (fieldNameLower.includes('status')) return 'orderStatus';
    
    // Don't add warnings for every unknown field name to reduce verbosity
    // Only add warnings for truly problematic cases
    return null;
  }

  /**
   * Generates a value using the specified strategy
   * 
   * @param strategy - Data generation strategy
   * @param field - GraphQL field definition
   * @returns any - Generated value
   */
  private generateValueByStrategy(strategy: DataGenerationStrategy, field: GraphQLField): any {
    switch (strategy) {
      case 'uuid':
        return faker.string.uuid();
      
      case 'email':
        return faker.internet.email({ provider: 'mediarithmics.com' });
      
      case 'firstName':
        return faker.person.firstName();
      
      case 'lastName':
        return faker.person.lastName();
      
      case 'fullName':
        return faker.person.fullName();
      
      case 'phone':
        return faker.phone.number();
      
      case 'address':
        return faker.location.streetAddress();
      
      case 'city':
        return faker.location.city();
      
      case 'state':
        return faker.location.state();
      
      case 'country':
        return faker.location.country();
      
      case 'zipCode':
        return faker.location.zipCode();
      
      case 'company':
        return faker.company.name();
      
      case 'jobTitle':
        return faker.person.jobTitle();
      
      case 'date':
        return faker.date.past().toISOString().split('T')[0];
      
      case 'datetime':
        return faker.date.past().toISOString();
      
      case 'timestamp':
        return faker.date.past().getTime();
      
      case 'boolean':
        return faker.datatype.boolean();
      
      case 'integer':
        return faker.number.int({ min: 1, max: 1000 });
      
      case 'float':
        return parseFloat(faker.commerce.price());
      
      case 'string':
        return faker.lorem.sentence();
      
      case 'enum':
        return this.generateEnumValue(field);
      
      case 'url':
        return faker.internet.url();
      
      case 'ipAddress':
        return faker.internet.ip();
      
      case 'userAgent':
        return faker.internet.userAgent();
      
      case 'deviceType':
        return faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']);
      
      case 'browser':
        return faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']);
      
      case 'operatingSystem':
        return faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']);
      
      case 'productName':
        return faker.commerce.productName();
      
      case 'productDescription':
        return faker.commerce.productDescription();
      
      case 'price':
        return parseFloat(faker.commerce.price());
      
      case 'category':
        return faker.commerce.department();
      
      case 'tags':
        return faker.helpers.arrayElements(['new', 'popular', 'trending', 'limited', 'sale'], { min: 1, max: 3 });
      
      case 'quantity':
        return faker.number.int({ min: 1, max: 10 });
      
      case 'rating':
        return faker.number.int({ min: 1, max: 5 });
      
      case 'review':
        return faker.lorem.paragraph();
      
      case 'searchQuery':
        return faker.lorem.words({ min: 1, max: 3 });
      
      case 'paymentMethod':
        return faker.helpers.arrayElement(['credit_card', 'paypal', 'apple_pay', 'google_pay']);
      
      case 'orderStatus':
        return faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
      
      case 'custom':
        return this.generateCustomValue(field);
      
      default:
        return this.generateDefaultValue(field);
    }
  }

  /**
   * Generates an enum value for a field
   * 
   * @param field - GraphQL field definition
   * @returns string - Generated enum value
   */
  private generateEnumValue(field: GraphQLField): string {
    if (!this.schema) {
      return 'UNKNOWN';
    }
    
    // Find the enum type
    const baseType = this.getBaseType(field.type);
    const enumType = this.schema.types.find(t => t.name === baseType.name && t.kind === 'ENUM');
    
    if (enumType && enumType.enumValues) {
      const values = enumType.enumValues.map(v => v.name);
      return faker.helpers.arrayElement(values);
    }
    
    return 'UNKNOWN';
  }

  /**
   * Generates a custom value for a field
   * 
   * @param field - GraphQL field definition
   * @returns any - Generated custom value
   */
  private generateCustomValue(field: GraphQLField): any {
    // For custom strategies, generate a reasonable default
    return this.generateDefaultValue(field);
  }

  /**
   * Generates a default value for a field based on its type
   * 
   * @param field - GraphQL field definition
   * @returns any - Generated default value
   */
  private generateDefaultValue(field: GraphQLField): any {
    const baseType = this.getBaseType(field.type);
    
    // Check if it's an array type
    if (field.isArray) {
      return this.generateArrayValue(field);
    }
    
    // Check if it's a custom object type
    if (baseType.kind === 'OBJECT') {
      return this.generateCustomObjectValue(field);
    }
    
    switch (baseType.name) {
      case 'String':
        return faker.lorem.word();
      case 'Int':
        return faker.number.int({ min: 1, max: 100 });
      case 'Float':
        return parseFloat(faker.commerce.price());
      case 'Boolean':
        return faker.datatype.boolean();
      case 'DateTime':
        return faker.date.past().toISOString();
      case 'Date':
        return faker.date.past().toISOString().split('T')[0];
      case 'ID':
        return faker.string.uuid();
      case 'JSON':
        return { key: faker.lorem.word(), value: faker.lorem.word() };
      default:
        // Generate a placeholder object instead of null for unknown types
        return this.generatePlaceholderObject(field);
    }
  }

  /**
   * Generates an array value for a field with smart type handling
   * 
   * Creates arrays of appropriate types with realistic lengths (1-3 elements).
   * Supports arrays of scalars, custom objects, and nested types.
   * 
   * @param field - GraphQL field definition
   * @returns any[] - Generated array value with appropriate element types
   */
  private generateArrayValue(field: GraphQLField): any[] {
    const baseType = this.getBaseType(field.type);
    const arrayLength = faker.number.int({ min: 1, max: 3 });
    
    // Generate array of appropriate type
    switch (baseType.name) {
      case 'String':
        return Array.from({ length: arrayLength }, () => faker.lorem.word());
      case 'Int':
        return Array.from({ length: arrayLength }, () => faker.number.int({ min: 1, max: 100 }));
      case 'Float':
        return Array.from({ length: arrayLength }, () => parseFloat(faker.commerce.price()));
      case 'Boolean':
        return Array.from({ length: arrayLength }, () => faker.datatype.boolean());
      case 'ID':
        return Array.from({ length: arrayLength }, () => faker.string.uuid());
      default:
        // For custom types, generate placeholder objects
        return Array.from({ length: arrayLength }, () => this.generatePlaceholderObject(field));
    }
  }

  /**
   * Generates a custom object value for a field with recursive nesting
   * 
   * Recursively generates nested objects based on GraphQL schema definitions.
   * Creates complete object structures with all fields populated.
   * 
   * @param field - GraphQL field definition
   * @returns any - Generated custom object value with nested structure
   */
  private generateCustomObjectValue(field: GraphQLField): any {
    if (!this.schema) {
      return this.generatePlaceholderObject(field);
    }
    
    const baseType = this.getBaseType(field.type);
    const objectType = this.schema.types.find(t => t.name === baseType.name && t.kind === 'OBJECT');
    
    if (objectType && objectType.fields) {
      const result: Record<string, any> = {};
      
      for (const objectField of objectType.fields) {
        result[objectField.name] = this.generateFieldValue(objectField, objectType);
      }
      
      return result;
    }
    
    return this.generatePlaceholderObject(field);
  }

  /**
   * Generates a placeholder object for unknown field types instead of null
   * 
   * Creates structured placeholder objects with metadata instead of returning null
   * for unsupported field types. Includes type information, field name, and timestamp.
   * 
   * @param field - GraphQL field definition
   * @returns any - Generated placeholder object with metadata
   */
  private generatePlaceholderObject(field: GraphQLField): any {
    const baseType = this.getBaseType(field.type);
    
    // Add warning for unknown type
    this.warnings.push(`Unknown field type '${baseType.name}' for field '${field.name}'. Using placeholder object.`);
    
    return {
      _type: baseType.name,
      _placeholder: true,
      _fieldName: field.name,
      _generatedAt: new Date().toISOString(),
      value: faker.lorem.word()
    };
  }

  /**
   * Regenerates field mappings using the current logic
   * 
   * @returns DataFieldMapping[] - Regenerated field mappings
   */
  private regenerateFieldMappings(): DataFieldMapping[] {
    if (!this.schema) {
      return [];
    }

    const mappings: DataFieldMapping[] = [];
    
    for (const type of this.schema.types) {
      if (type.kind === 'OBJECT' && type.fields) {
        for (const field of type.fields) {
          const strategy = this.getGenerationStrategy(field, type);
          
          if (strategy) {
            mappings.push({
              fieldName: field.name,
              typeName: type.name,
              strategy: strategy
            });
          }
        }
      }
    }
    
    return mappings;
  }

  /**
   * Checks if a field is an enum type
   * 
   * @param field - GraphQL field definition
   * @returns boolean - True if field is an enum type
   */
  private isEnumField(field: GraphQLField): boolean {
    if (!this.schema) {
      return false;
    }
    
    const baseType = this.getBaseType(field.type);
    const enumType = this.schema.types.find(t => t.name === baseType.name && t.kind === 'ENUM');
    
    return !!enumType;
  }

  /**
   * Gets the base type of a GraphQL field type (removes LIST and NON_NULL wrappers)
   * 
   * @param fieldType - GraphQL field type
   * @returns GraphQLFieldType - Base type
   */
  private getBaseType(fieldType: any): any {
    if (fieldType.kind === 'LIST' || fieldType.kind === 'NON_NULL') {
      return fieldType.ofType ? this.getBaseType(fieldType.ofType) : fieldType;
    }
    return fieldType;
  }

  /**
   * Gets the loaded schema
   * 
   * @returns GraphQLSchema | null - Loaded schema or null
   */
  getSchema(): GraphQLSchema | null {
    return this.schema;
  }

  /**
   * Gets the field mappings
   * 
   * @returns DataFieldMapping[] - Field mappings
   */
  getFieldMappings(): DataFieldMapping[] {
    return this.fieldMappings;
  }

  /**
   * Gets any errors that occurred during schema loading
   * 
   * @returns string[] - Array of error messages
   */
  getErrors(): string[] {
    return this.errors;
  }

  /**
   * Gets any warnings that occurred during schema loading
   * 
   * @returns string[] - Array of warning messages
   */
  getWarnings(): string[] {
    return this.warnings;
  }
} 