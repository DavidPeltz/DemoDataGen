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

import { GraphQLField, DataGenerationStrategy } from '../types/graphql';
import { DataGenerationUtils } from '../utils/DataGenerationUtils';

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
        return DataGenerationUtils.generateId();
      
      case 'email':
        return DataGenerationUtils.generateEmail();
      
      case 'firstName':
        return DataGenerationUtils.generateUserName().firstName;
      
      case 'lastName':
        return DataGenerationUtils.generateUserName().lastName;
      
      case 'fullName':
        return DataGenerationUtils.generateUserName().fullName;
      
      case 'phone':
        return DataGenerationUtils.generatePhoneNumber();
      
      case 'address':
        return DataGenerationUtils.generateAddress().street;
      
      case 'city':
        return DataGenerationUtils.generateAddress().city;
      
      case 'state':
        return DataGenerationUtils.generateAddress().state;
      
      case 'country':
        return DataGenerationUtils.generateAddress().country;
      
      case 'zipCode':
        return DataGenerationUtils.generateAddress().zipCode;
      
      case 'company':
        return DataGenerationUtils.generateCompanyData().name;
      
      case 'jobTitle':
        return DataGenerationUtils.generateCompanyData().jobTitle;
      
      case 'date':
        return DataGenerationUtils.generatePastDate();
      
      case 'datetime':
        return DataGenerationUtils.generateRecentDate();
      
      case 'timestamp':
        return new Date().toISOString();
      
      case 'boolean':
        return DataGenerationUtils.generateRandomBoolean();
      
      case 'integer':
        return DataGenerationUtils.generateRandomInt(1, 1000);
      
      case 'float':
        return DataGenerationUtils.generateRandomFloat(1, 1000);
      
      case 'string':
        return DataGenerationUtils.generateRandomSentence();
      
      case 'enum':
        return this.generateEnumValue(field);
      
      case 'url':
        return DataGenerationUtils.generateEventData('page_view')['pageUrl'];
      
      case 'ipAddress':
        return DataGenerationUtils.generateEventData('page_view')['ipAddress'];
      
      case 'userAgent':
        return DataGenerationUtils.generateEventData('page_view')['userAgent'];
      
      case 'deviceType':
        return DataGenerationUtils.generateEventData('page_view')['deviceType'];
      
      case 'browser':
        return DataGenerationUtils.generateEventData('page_view')['browser'];
      
      case 'operatingSystem':
        return DataGenerationUtils.generateEventData('page_view')['os'];
      
      case 'productName':
        return DataGenerationUtils.generateProductData().name;
      
      case 'productDescription':
        return DataGenerationUtils.generateProductData().description;
      
      case 'price':
        return DataGenerationUtils.generateProductData().price;
      
      case 'category':
        return DataGenerationUtils.generateProductData().category;
      
      case 'tags':
        return DataGenerationUtils.generateProductData().tags;
      
      case 'quantity':
        return DataGenerationUtils.generateRandomInt(1, 10);
      
      case 'rating':
        return DataGenerationUtils.generateRandomFloat(1, 5, 1);
      
      case 'review':
        return DataGenerationUtils.generateRandomParagraph();
      
      case 'searchQuery':
        return DataGenerationUtils.generateEventData('search')['query'];
      
      case 'paymentMethod':
        return DataGenerationUtils.generateEventData('transaction_complete')['paymentMethod'];
      
      case 'orderStatus':
        return DataGenerationUtils.generateRandomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
      
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
      return DataGenerationUtils.generateRandomElement(fieldType.enumValues.map((ev: any) => ev.name));
    }
    
    // Fallback to common enum patterns based on field name
    const fieldName = field.name.toLowerCase();
    
    if (fieldName.includes('status')) {
      return DataGenerationUtils.generateRandomElement(['active', 'inactive', 'pending', 'completed']);
    }
    
    if (fieldName.includes('type')) {
      return DataGenerationUtils.generateRandomElement(['user', 'admin', 'guest', 'premium']);
    }
    
    if (fieldName.includes('role')) {
      return DataGenerationUtils.generateRandomElement(['user', 'admin', 'moderator', 'editor']);
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
      id: DataGenerationUtils.generateId(),
      name: `${field.name}_placeholder`,
      description: `Placeholder object for ${field.name}`,
      createdAt: DataGenerationUtils.generatePastDate(),
      updatedAt: DataGenerationUtils.generateRecentDate()
    };
  }

  /**
   * Generates an array value for list types
   * 
   * @param field - The GraphQL field
   * @returns any[] - The generated array
   */
  private generateArrayValue(field: GraphQLField): any[] {
    const arrayLength = DataGenerationUtils.generateRandomInt(1, 5);
    const elementType = this.getBaseType(field.type.ofType);
    
    if (elementType.kind === 'SCALAR') {
      switch (elementType.name) {
        case 'String':
          return Array.from({ length: arrayLength }, () => DataGenerationUtils.generateRandomSentence(1));
        case 'Int':
          return Array.from({ length: arrayLength }, () => DataGenerationUtils.generateRandomInt(1, 100));
        case 'Float':
          return Array.from({ length: arrayLength }, () => DataGenerationUtils.generateRandomFloat(1, 100));
        case 'Boolean':
          return Array.from({ length: arrayLength }, () => DataGenerationUtils.generateRandomBoolean());
        default:
          return Array.from({ length: arrayLength }, () => DataGenerationUtils.generateRandomSentence(1));
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
            return DataGenerationUtils.generateRandomSentence();
          case 'Int':
            return DataGenerationUtils.generateRandomInt(1, 100);
          case 'Float':
            return DataGenerationUtils.generateRandomFloat(1, 100);
          case 'Boolean':
            return DataGenerationUtils.generateRandomBoolean();
          case 'ID':
            return DataGenerationUtils.generateId();
          default:
            return DataGenerationUtils.generateRandomSentence();
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