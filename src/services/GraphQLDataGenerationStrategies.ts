/**
 * GraphQL Data Generation Strategies Service
 * 
 * This service is responsible for implementing various data generation strategies
 * for GraphQL fields. It provides methods to generate realistic data based on
 * field types, names, and configured strategies.
 * 
 * Extracted from GraphQLDataGenerator.ts to improve separation of concerns
 * and provide focused data generation functionality.
 */

import { faker } from '@faker-js/faker';
import { GraphQLField, DataGenerationStrategy } from '../types/graphql';

/**
 * GraphQL Data Generation Strategies Service
 * 
 * Handles the generation of realistic data for GraphQL fields based on
 * configured strategies and field analysis.
 */
export class GraphQLDataGenerationStrategies {
  /**
   * Generates a value based on the specified strategy
   * 
   * @param strategy - The data generation strategy to use
   * @param field - The GraphQL field being generated
   * @returns any - The generated value
   */
  generateValueByStrategy(strategy: DataGenerationStrategy, field: GraphQLField): any {
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
        return faker.date.past();
      
      case 'datetime':
        return faker.date.recent();
      
      case 'timestamp':
        return new Date().toISOString();
      
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
        return faker.helpers.arrayElements(['electronics', 'clothing', 'books', 'home', 'sports'], { min: 1, max: 3 });
      
      case 'quantity':
        return faker.number.int({ min: 1, max: 10 });
      
      case 'rating':
        return faker.number.float({ min: 1, max: 5, fractionDigits: 1 });
      
      case 'review':
        return faker.lorem.paragraph();
      
      case 'searchQuery':
        return faker.helpers.arrayElement(['laptop', 'phone', 'headphones', 'shoes', 'dress', 'book']);
      
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
   * @param field - The GraphQL field
   * @returns string - The generated enum value
   */
  private generateEnumValue(field: GraphQLField): string {
    // Try to get enum values from the field type
    const fieldType = this.getBaseType(field.type);
    
    if (fieldType && fieldType.enumValues && fieldType.enumValues.length > 0) {
      return faker.helpers.arrayElement(fieldType.enumValues.map((ev: any) => ev.name));
    }
    
    // Fallback to common enum patterns based on field name
    const fieldName = field.name.toLowerCase();
    
    if (fieldName.includes('status')) {
      return faker.helpers.arrayElement(['active', 'inactive', 'pending', 'completed']);
    }
    
    if (fieldName.includes('type')) {
      return faker.helpers.arrayElement(['user', 'admin', 'guest', 'premium']);
    }
    
    if (fieldName.includes('role')) {
      return faker.helpers.arrayElement(['user', 'admin', 'moderator', 'editor']);
    }
    
    return 'default';
  }

  /**
   * Generates a custom value for complex fields
   * 
   * @param field - The GraphQL field
   * @returns any - The generated custom value
   */
  private generateCustomValue(field: GraphQLField): any {
    const fieldType = this.getBaseType(field.type);
    
    if (fieldType.kind === 'OBJECT') {
      return this.generatePlaceholderObject(field);
    }
    
    if (fieldType.kind === 'LIST') {
      return this.generateArrayValue(field);
    }
    
    return this.generateDefaultValue(field);
  }

  /**
   * Generates a placeholder object for complex types
   * 
   * @param field - The GraphQL field
   * @returns any - The generated placeholder object
   */
  private generatePlaceholderObject(field: GraphQLField): any {
    return {
      id: faker.string.uuid(),
      name: `${field.name}_placeholder`,
      description: `Placeholder object for ${field.name}`,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    };
  }

  /**
   * Generates an array value for list types
   * 
   * @param field - The GraphQL field
   * @returns any[] - The generated array
   */
  private generateArrayValue(field: GraphQLField): any[] {
    const arrayLength = faker.number.int({ min: 1, max: 5 });
    const elementType = this.getBaseType(field.type.ofType);
    
    if (elementType.kind === 'SCALAR') {
      switch (elementType.name) {
        case 'String':
          return Array.from({ length: arrayLength }, () => faker.lorem.word());
        case 'Int':
          return Array.from({ length: arrayLength }, () => faker.number.int({ min: 1, max: 100 }));
        case 'Float':
          return Array.from({ length: arrayLength }, () => parseFloat(faker.commerce.price()));
        case 'Boolean':
          return Array.from({ length: arrayLength }, () => faker.datatype.boolean());
        default:
          return Array.from({ length: arrayLength }, () => faker.lorem.word());
      }
    }
    
    // For complex types, generate placeholder objects
    return Array.from({ length: arrayLength }, () => this.generatePlaceholderObject(field));
  }

  /**
   * Generates a default value when no specific strategy is available
   * 
   * @param field - The GraphQL field
   * @returns any - The generated default value
   */
  private generateDefaultValue(field: GraphQLField): any {
    const fieldType = this.getBaseType(field.type);
    
    if (!fieldType) {
      return null;
    }
    
    switch (fieldType.kind) {
      case 'SCALAR':
        switch (fieldType.name) {
          case 'String':
            return faker.lorem.sentence();
          case 'Int':
            return faker.number.int({ min: 1, max: 100 });
          case 'Float':
            return parseFloat(faker.commerce.price());
          case 'Boolean':
            return faker.datatype.boolean();
          case 'ID':
            return faker.string.uuid();
          default:
            return faker.lorem.sentence();
        }
      case 'ENUM':
        return this.generateEnumValue(field);
      case 'OBJECT':
        return this.generatePlaceholderObject(field);
      case 'LIST':
        return this.generateArrayValue(field);
      default:
        return null;
    }
  }

  /**
   * Gets the base type from a GraphQL field type
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
   * Checks if a field is an enum field
   * 
   * @param field - The GraphQL field
   * @returns boolean - True if the field is an enum
   */
  isEnumField(field: GraphQLField): boolean {
    const fieldType = this.getBaseType(field.type);
    return fieldType && fieldType.kind === 'ENUM';
  }

  /**
   * Gets available strategies for a field
   * 
   * @param field - The GraphQL field
   * @returns DataGenerationStrategy[] - Array of available strategies
   */
  getAvailableStrategies(field: GraphQLField): DataGenerationStrategy[] {
    const strategies: DataGenerationStrategy[] = [];
    const fieldType = this.getBaseType(field.type);
    
    if (this.isEnumField(field)) {
      strategies.push('enum');
    }
    
    if (fieldType.kind === 'SCALAR') {
      switch (fieldType.name) {
        case 'String':
          strategies.push('string', 'email', 'fullName', 'address', 'city', 'state', 'country', 'zipCode', 'company', 'jobTitle', 'url', 'ipAddress', 'userAgent', 'productName', 'productDescription', 'category', 'review', 'searchQuery', 'paymentMethod', 'orderStatus');
          break;
        case 'Int':
          strategies.push('integer', 'quantity', 'rating');
          break;
        case 'Float':
          strategies.push('float', 'price', 'rating');
          break;
        case 'Boolean':
          strategies.push('boolean');
          break;
        case 'ID':
          strategies.push('uuid');
          break;
      }
    }
    
    if (fieldType.kind === 'OBJECT') {
      strategies.push('custom');
    }
    
    if (fieldType.kind === 'LIST') {
      strategies.push('custom');
    }
    
    return strategies;
  }
} 