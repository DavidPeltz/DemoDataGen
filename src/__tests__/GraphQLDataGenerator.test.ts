/**
 * GraphQL Data Generator Tests
 * 
 * Tests for the GraphQL-based data generation functionality.
 */

import { GraphQLDataGenerator } from '../generators/GraphQLDataGenerator';
import { createSampleGraphQLSchema } from '../utils/graphqlParser';
import * as fs from 'fs';
import * as path from 'path';

describe('GraphQLDataGenerator', () => {
  let generator: GraphQLDataGenerator;
  let sampleSchemaPath: string;

  beforeAll(() => {
    // Create a sample schema file for testing
    sampleSchemaPath = path.join(__dirname, '../../test-schema.graphql');
    createSampleGraphQLSchema(sampleSchemaPath);
  });

  afterAll(() => {
    // Clean up test schema file
    if (fs.existsSync(sampleSchemaPath)) {
      fs.unlinkSync(sampleSchemaPath);
    }
  });

  beforeEach(() => {
    generator = new GraphQLDataGenerator();
  });

  describe('loadSchema', () => {
    it('should load a valid GraphQL schema file', () => {
      const success = generator.loadSchema(sampleSchemaPath);
      expect(success).toBe(true);
      expect(generator.getSchema()).not.toBeNull();
      expect(generator.getFieldMappings().length).toBeGreaterThan(0);
    });

    it('should handle non-existent schema file', () => {
      const success = generator.loadSchema('non-existent-schema.graphql');
      expect(success).toBe(false);
      expect(generator.getErrors().length).toBeGreaterThan(0);
    });

    it('should parse schema and generate field mappings', () => {
      generator.loadSchema(sampleSchemaPath);
      
      const schema = generator.getSchema();
      const mappings = generator.getFieldMappings();
      
      expect(schema).not.toBeNull();
      expect(schema?.types.length).toBeGreaterThan(0);
      
      // Should have mappings for common fields
      const userMappings = mappings.filter(m => m.typeName === 'User');
      expect(userMappings.length).toBeGreaterThan(0);
      
      // Check for specific field mappings
      const emailMapping = userMappings.find(m => m.fieldName === 'email');
      expect(emailMapping?.strategy).toBe('email');
      
      const idMapping = userMappings.find(m => m.fieldName === 'id');
      expect(idMapping?.strategy).toBe('uuid');
    });
  });

  describe('generateDataForType', () => {
    beforeEach(() => {
      generator.loadSchema(sampleSchemaPath);
    });

    it('should generate data for a specific type', () => {
      const userData = generator.generateDataForType('User', 3);
      
      expect(userData).toHaveLength(3);
      expect(userData[0]).toHaveProperty('id');
      expect(userData[0]).toHaveProperty('email');
      expect(userData[0]).toHaveProperty('firstName');
      expect(userData[0]).toHaveProperty('lastName');
      
      // Check that emails use the correct domain
      userData.forEach(user => {
        expect(user['email']).toMatch(/@mediarithmics\.com$/);
      });
    });

    it('should generate data for Product type', () => {
      const productData = generator.generateDataForType('Product', 2);
      
      expect(productData).toHaveLength(2);
      expect(productData[0]).toHaveProperty('id');
      expect(productData[0]).toHaveProperty('name');
      expect(productData[0]).toHaveProperty('price');
      expect(productData[0]).toHaveProperty('category');
      expect(productData[0]).toHaveProperty('inStock');
      
      // Check data types
      expect(typeof productData[0]!['price']).toBe('number');
      expect(typeof productData[0]!['inStock']).toBe('boolean');
    });

    it('should generate data for UserEvent type', () => {
      const eventData = generator.generateDataForType('UserEvent', 2);
      
      expect(eventData).toHaveLength(2);
      expect(eventData[0]).toHaveProperty('id');
      expect(eventData[0]).toHaveProperty('userId');
      expect(eventData[0]).toHaveProperty('eventType');
      expect(eventData[0]).toHaveProperty('timestamp');
      
      // Check that eventType is one of the enum values
      const validEventTypes = ['PAGE_VIEW', 'SEARCH', 'ADD_TO_CART', 'REMOVE_FROM_CART', 'CHECKOUT', 'PURCHASE', 'EMAIL_OPEN', 'EMAIL_CLICK'];
      expect(validEventTypes).toContain(eventData[0]!['eventType']);
    });

    it('should handle array fields correctly', () => {
      const userData = generator.generateDataForType('User', 1);
      const user = userData[0];
      
      // Check that array fields are generated as arrays
      if (user!['events']) {
        expect(Array.isArray(user!['events'])).toBe(true);
      }
      
      if (user!['orders']) {
        expect(Array.isArray(user!['orders'])).toBe(true);
      }
    });

    it('should throw error for non-existent type', () => {
      expect(() => {
        generator.generateDataForType('NonExistentType', 1);
      }).toThrow('Type \'NonExistentType\' not found or is not an object type.');
    });

    it('should throw error when no schema is loaded', () => {
      const emptyGenerator = new GraphQLDataGenerator();
      
      expect(() => {
        emptyGenerator.generateDataForType('User', 1);
      }).toThrow('No GraphQL schema loaded. Call loadSchema() first.');
    });
  });

  describe('generateDataForTypes', () => {
    beforeEach(() => {
      generator.loadSchema(sampleSchemaPath);
    });

    it('should generate data for multiple types', () => {
      const typeCounts = {
        'User': 2,
        'Product': 3,
        'Order': 1
      };
      
      const results = generator.generateDataForTypes(typeCounts);
      
      expect(results).toHaveProperty('User');
      expect(results).toHaveProperty('Product');
      expect(results).toHaveProperty('Order');
      
      expect(results['User']).toHaveLength(2);
      expect(results['Product']).toHaveLength(3);
      expect(results['Order']).toHaveLength(1);
    });

    it('should handle errors gracefully for invalid types', () => {
      const typeCounts = {
        'User': 1,
        'InvalidType': 1
      };
      
      const results = generator.generateDataForTypes(typeCounts);
      
      expect(results).toHaveProperty('User');
      expect(results).toHaveProperty('InvalidType');
      expect(results['User']).toHaveLength(1);
      expect(results['InvalidType']).toHaveLength(0); // Should be empty due to error
    });
  });

  describe('generateDataForAllTypes', () => {
    beforeEach(() => {
      generator.loadSchema(sampleSchemaPath);
    });

    it('should generate data for all object types', () => {
      const results = generator.generateDataForAllTypes(2);
      
      // Should generate data for all object types except Query, Mutation, Subscription
      const expectedTypes = ['User', 'UserProfile', 'Address', 'UserEvent', 'Product', 'Order', 'OrderItem', 'Review'];
      
      expectedTypes.forEach(typeName => {
        expect(results).toHaveProperty(typeName);
        expect(results[typeName]).toHaveLength(2);
      });
      
      // Should not generate data for Query, Mutation, Subscription
      expect(results).not.toHaveProperty('Query');
      expect(results).not.toHaveProperty('Mutation');
      expect(results).not.toHaveProperty('Subscription');
    });
  });

  describe('field mapping strategies', () => {
    beforeEach(() => {
      generator.loadSchema(sampleSchemaPath);
    });

    it('should map common field names to appropriate strategies', () => {
      const mappings = generator.getFieldMappings();
      
      // Check specific field mappings
      const userMappings = mappings.filter(m => m.typeName === 'User');
      
      const emailMapping = userMappings.find(m => m.fieldName === 'email');
      expect(emailMapping?.strategy).toBe('email');
      
      const firstNameMapping = userMappings.find(m => m.fieldName === 'firstName');
      expect(firstNameMapping?.strategy).toBe('firstName');
      
      const lastNameMapping = userMappings.find(m => m.fieldName === 'lastName');
      expect(lastNameMapping?.strategy).toBe('lastName');
      
      const phoneMapping = userMappings.find(m => m.fieldName === 'phone');
      expect(phoneMapping?.strategy).toBe('phone');
      
      const companyMapping = userMappings.find(m => m.fieldName === 'company');
      expect(companyMapping?.strategy).toBe('company');
    });

    it('should handle enum types correctly', () => {
      const eventData = generator.generateDataForType('UserEvent', 5);
      
      eventData.forEach(event => {
        // eventType should be one of the enum values
        const validEventTypes = ['PAGE_VIEW', 'SEARCH', 'ADD_TO_CART', 'REMOVE_FROM_CART', 'CHECKOUT', 'PURCHASE', 'EMAIL_OPEN', 'EMAIL_CLICK'];
        expect(validEventTypes).toContain(event['eventType']);
        
        // deviceType should be one of the enum values
        if (event['deviceType']) {
          const validDeviceTypes = ['DESKTOP', 'MOBILE', 'TABLET'];
          expect(validDeviceTypes).toContain(event['deviceType']);
        }
        
        // browser should be one of the enum values
        if (event['browser']) {
          const validBrowsers = ['CHROME', 'FIREFOX', 'SAFARI', 'EDGE'];
          expect(validBrowsers).toContain(event['browser']);
        }
      });
    });
  });

  describe('data quality', () => {
    beforeEach(() => {
      generator.loadSchema(sampleSchemaPath);
    });

    it('should generate realistic data', () => {
      const userData = generator.generateDataForType('User', 10);
      
      userData.forEach(user => {
        // Check email format
        expect(user['email']).toMatch(/^[^@]+@mediarithmics\.com$/);
        
        // Check names are not empty
        expect(user['firstName']).toBeTruthy();
        expect(user['lastName']).toBeTruthy();
        
        // Check boolean fields
        expect(typeof user['isActive']).toBe('boolean');
        
        // Check date fields
        expect(user['createdAt']).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        expect(user['updatedAt']).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });
    });

    it('should generate unique IDs', () => {
      const userData = generator.generateDataForType('User', 10);
      const productData = generator.generateDataForType('Product', 10);
      
      const userIds = userData.map(u => u['id']);
      const productIds = productData.map(p => p['id']);
      
      // Check uniqueness within each type
      expect(new Set(userIds).size).toBe(10);
      expect(new Set(productIds).size).toBe(10);
      
      // Check no overlap between types
      const allIds = [...userIds, ...productIds];
      expect(new Set(allIds).size).toBe(20);
    });
  });
}); 