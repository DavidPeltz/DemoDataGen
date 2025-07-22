/**
 * DataGenerator Class
 * 
 * This class is responsible for generating mixed data types that simulate
 * various business entities and events. It combines user data, product data,
 * orders, reviews, and anonymous events to create realistic datasets for
 * testing and development purposes.
 * 
 * Features:
 * - Mixed data generation (users, products, orders, reviews, anonymous events)
 * - Type-specific data generation
 * - Realistic business scenarios
 * - Anonymous event tracking simulation
 * - Comprehensive data relationships
 */

import { faker } from '@faker-js/faker';
import { MixedDataItem } from '../types';
import { UserGenerator } from './UserGenerator';
import { ProductGenerator } from './ProductGenerator';

export class DataGenerator {
  /**
   * Internal generators for creating specific data types
   * 
   * These generators are used to create users and products that are
   * then incorporated into the mixed data items.
   */
  private userGenerator = new UserGenerator();
  private productGenerator = new ProductGenerator();

  /**
   * Generates mixed data items of various types
   * 
   * This method creates a diverse dataset containing different types of
   * business entities and events. It randomly selects from available types
   * to create realistic mixed data scenarios.
   * 
   * @param count - Number of mixed data items to generate
   * @returns MixedDataItem[] - Array of mixed data items with varied types
   */
  generateMixedData(count: number): MixedDataItem[] {
    // Define all available data types for random selection
    const types: Array<'user' | 'product' | 'order' | 'review' | 'anonymous_event'> = ['user', 'product', 'order', 'review', 'anonymous_event'];
    
    return Array.from({ length: count }, () => {
      // Randomly select a data type for each item
      const type = faker.helpers.arrayElement(types);
      return this.generateMixedDataItem(type);
    });
  }

  /**
   * Generates a single mixed data item of the specified type
   * 
   * This private method handles the creation of individual data items
   * based on the specified type. Each type has its own data structure
   * and generation logic to ensure realistic and varied data.
   * 
   * @param type - The type of data item to generate
   * @returns MixedDataItem - A complete data item of the specified type
   */
  private generateMixedDataItem(type: 'user' | 'product' | 'order' | 'review' | 'anonymous_event'): MixedDataItem {
    const id = faker.string.uuid();
    const createdAt = faker.date.past();

    switch (type) {
      case 'user':
        // Generate a complete user using the UserGenerator
        const user = this.userGenerator.generateUser();
        return {
          id,
          type,
          description: `User: ${user.firstName} ${user.lastName}`,
          data: user,
          createdAt,
        };

      case 'product':
        // Generate a complete product using the ProductGenerator
        const product = this.productGenerator.generateProduct();
        return {
          id,
          type,
          description: `Product: ${product.name}`,
          data: product,
          createdAt,
        };

      case 'order':
        // Generate a realistic e-commerce order with multiple items
        const order = {
          id: faker.string.uuid(),
          customerId: faker.string.uuid(),
          // Generate 1-5 order items with realistic quantities and prices
          items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
            productId: faker.string.uuid(),
            quantity: faker.number.int({ min: 1, max: 10 }),
            price: parseFloat(faker.commerce.price()),
          })),
          total: parseFloat(faker.commerce.price({ min: 50, max: 1000 })),
          status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
        };
        return {
          id,
          type,
          description: `Order: $${order.total.toFixed(2)} - ${order.status}`,
          data: order,
          createdAt,
        };

      case 'review':
        // Generate a product review with rating and content
        const review = {
          id: faker.string.uuid(),
          productId: faker.string.uuid(),
          userId: faker.string.uuid(),
          rating: faker.number.int({ min: 1, max: 5 }),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          helpful: faker.number.int({ min: 0, max: 50 }), // Number of helpful votes
        };
        return {
          id,
          type,
          description: `Review: ${review.rating}/5 stars - ${review.title}`,
          data: review,
          createdAt,
        };

      case 'anonymous_event':
        // Generate anonymous user interaction events (no personal data)
        const anonymousEvent = {
          id: faker.string.uuid(),
          eventType: faker.helpers.arrayElement(['page_view', 'click', 'scroll', 'form_submit', 'download']),
          pageUrl: faker.internet.url(),
          userAgent: faker.internet.userAgent(),
          ipAddress: faker.internet.ip(),
          timestamp: faker.date.recent(),
          sessionId: faker.string.uuid(),
          referrer: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }), // 70% chance of having a referrer
          deviceType: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
          browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
          os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
        };
        return {
          id,
          type,
          description: `Anonymous Event: ${anonymousEvent.eventType} on ${anonymousEvent.pageUrl}`,
          data: anonymousEvent,
          createdAt,
        };

      default:
        throw new Error(`Unknown data type: ${type}`);
    }
  }

  /**
   * Generates multiple data items of a specific type
   * 
   * This method creates a homogeneous dataset containing only items
   * of the specified type. It's useful for testing specific functionality
   * or generating focused datasets.
   * 
   * @param type - The type of data items to generate
   * @param count - Number of data items to generate
   * @returns MixedDataItem[] - Array of data items of the specified type
   */
  generateDataByType(type: 'user' | 'product' | 'order' | 'review' | 'anonymous_event', count: number): MixedDataItem[] {
    return Array.from({ length: count }, () => this.generateMixedDataItem(type));
  }
} 