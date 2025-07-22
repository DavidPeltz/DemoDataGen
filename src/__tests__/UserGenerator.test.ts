/**
 * UserGenerator Test Suite
 * 
 * This test suite validates the functionality of the UserGenerator class,
 * ensuring that it correctly generates user data with proper structure,
 * unique identifiers, and country-specific information.
 * 
 * Test Coverage:
 * - Basic user generation with required properties
 * - Address structure validation
 * - Multiple user generation with uniqueness
 * - Criteria-based user generation
 */

import { UserGenerator } from '../generators/UserGenerator';

describe('UserGenerator', () => {
  let userGenerator: UserGenerator;

  /**
   * Set up a fresh UserGenerator instance before each test
   * to ensure test isolation and prevent state leakage between tests.
   */
  beforeEach(() => {
    userGenerator = new UserGenerator();
  });

  /**
   * Test suite for the generateUser method
   * 
   * These tests validate that individual user generation works correctly
   * and produces users with all required properties and proper data types.
   */
  describe('generateUser', () => {
    /**
     * Validates that a generated user has all required properties
     * and that each property has the correct data type.
     */
    it('should generate a user with all required properties', () => {
      const user = userGenerator.generateUser();

      // Verify all required properties exist
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('address');
      expect(user).toHaveProperty('createdAt');

      // Verify data types are correct
      expect(typeof user.id).toBe('string');
      expect(typeof user.firstName).toBe('string');
      expect(typeof user.lastName).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.createdAt).toBe('object');
      expect(user.createdAt instanceof Date).toBe(true);
      
      // Phone is optional, so we don't test for its presence or type
    });

    /**
     * Validates that the address object has the correct structure
     * and contains all required address fields with proper data types.
     */
    it('should generate a user with valid address structure', () => {
      const user = userGenerator.generateUser();

      // Verify address object has all required properties
      expect(user.address).toHaveProperty('street');
      expect(user.address).toHaveProperty('city');
      expect(user.address).toHaveProperty('state');
      expect(user.address).toHaveProperty('zipCode');
      expect(user.address).toHaveProperty('country');

      // Verify address field data types
      expect(typeof user.address.street).toBe('string');
      expect(typeof user.address.city).toBe('string');
      expect(typeof user.address.state).toBe('string');
      expect(typeof user.address.zipCode).toBe('string');
      expect(typeof user.address.country).toBe('string');
    });
  });

  /**
   * Test suite for the generateUsers method
   * 
   * These tests validate that multiple user generation works correctly,
   * produces the requested number of users, and ensures uniqueness.
   */
  describe('generateUsers', () => {
    /**
     * Validates that the correct number of users is generated
     * and that each user is a valid object.
     */
    it('should generate the specified number of users', () => {
      const count = 5;
      const users = userGenerator.generateUsers(count);

      // Verify the correct number of users is generated
      expect(users).toHaveLength(count);
      // Verify each item is a valid user object
      expect(users.every(user => user instanceof Object)).toBe(true);
    });

    /**
     * Validates that generated users have unique IDs,
     * ensuring no duplicate users are created.
     */
    it('should generate unique users', () => {
      const users = userGenerator.generateUsers(10);
      const ids = users.map(user => user.id);
      const uniqueIds = new Set(ids);

      // Verify all IDs are unique by comparing set size to array length
      expect(uniqueIds.size).toBe(users.length);
    });
  });

  /**
   * Test suite for the generateUsersWithCriteria method
   * 
   * These tests validate that users can be generated with specific
   * criteria overrides while maintaining other generated properties.
   */
  describe('generateUsersWithCriteria', () => {
    /**
     * Validates that users are generated with the specified criteria
     * while other properties are still generated normally.
     */
    it('should generate users with specified criteria', () => {
      const criteria = { 
        firstName: 'John',
        lastName: 'Doe'
      };
      const count = 3;
      const users = userGenerator.generateUsersWithCriteria(criteria, count);

      // Verify the correct number of users is generated
      expect(users).toHaveLength(count);
      
      // Verify each user has the specified criteria applied
      users.forEach(user => {
        expect(user.firstName).toBe('John');
        expect(user.lastName).toBe('Doe');
      });
    });
  });
}); 