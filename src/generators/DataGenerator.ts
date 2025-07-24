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

import { MixedDataItem, EventType } from '../types';
import { UserGenerator } from './UserGenerator';
import { ProductGenerator } from './ProductGenerator';
import { DataGenerationUtils } from '../utils/DataGenerationUtils';

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
      const type = DataGenerationUtils.generateRandomElement(types);
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
    const id = DataGenerationUtils.generateId();
    const createdAt = DataGenerationUtils.generatePastDate();

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
          id: DataGenerationUtils.generateId(),
          customerId: DataGenerationUtils.generateId(),
          // Generate 1-5 order items with realistic quantities and prices
          items: Array.from({ length: DataGenerationUtils.generateRandomInt(1, 5) }, () => ({
            productId: DataGenerationUtils.generateId(),
            quantity: DataGenerationUtils.generateRandomInt(1, 10),
            price: DataGenerationUtils.generateRandomFloat(10, 100),
          })),
          total: DataGenerationUtils.generateRandomFloat(50, 1000),
          status: DataGenerationUtils.generateRandomElement(['pending', 'processing', 'shipped', 'delivered']),
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
          id: DataGenerationUtils.generateId(),
          productId: DataGenerationUtils.generateId(),
          userId: DataGenerationUtils.generateId(),
          rating: DataGenerationUtils.generateRandomInt(1, 5),
          title: DataGenerationUtils.generateRandomSentence(),
          content: DataGenerationUtils.generateRandomParagraph(),
          helpful: DataGenerationUtils.generateRandomInt(0, 50), // Number of helpful votes
        };
        return {
          id,
          type,
          description: `Review: ${review.rating}/5 stars - ${review.title}`,
          data: review,
          createdAt,
        };

      case 'anonymous_event':
        // Generate anonymous user interaction events with logical sequencing
        
        // Generate a sequence of 10-20 events for this anonymous user
        const eventSequence = [];
        let hasAddedToCart = false;
        let hasViewedCart = false;
        let hasCheckedOut = false;
        let cartItems = 0;
        const sessionId = DataGenerationUtils.generateId();
        const baseTimestamp = DataGenerationUtils.generateRecentDate();
        
        const eventCount = DataGenerationUtils.generateRandomInt(10, 20);
        for (let i = 0; i < eventCount; i++) {
          let eventType: EventType;
          
          // Apply logical constraints
          if (i === 0) {
            eventType = DataGenerationUtils.generateRandomElement(['page_view', 'search'] as EventType[]);
          } else if (hasCheckedOut && DataGenerationUtils.generateRandomBoolean(0.3)) {
            eventType = 'transaction_complete';
          } else if (hasCheckedOut) {
            eventType = DataGenerationUtils.generateRandomElement([
              'page_view', 'search', 'article_view', 'video_view', 'audio_listen',
              'ad_view', 'ad_click', 'email_open', 'email_click', 'richpush_open', 'richpush_click'
            ] as EventType[]);
          } else if (hasViewedCart && DataGenerationUtils.generateRandomBoolean(0.4)) {
            eventType = 'checkout';
            hasCheckedOut = true;
          } else if (hasAddedToCart && DataGenerationUtils.generateRandomBoolean(0.6)) {
            eventType = 'view_cart';
            hasViewedCart = true;
          } else if (hasAddedToCart && DataGenerationUtils.generateRandomBoolean(0.2)) {
            eventType = 'remove_itemFromCart';
            cartItems = Math.max(0, cartItems - 1);
          } else if (DataGenerationUtils.generateRandomBoolean(0.3)) {
            eventType = 'add_itemToCart';
            hasAddedToCart = true;
            cartItems++;
          } else {
            eventType = DataGenerationUtils.generateRandomElement([
              'page_view', 'search', 'article_view', 'video_view', 'audio_listen',
              'ad_view', 'ad_click', 'email_open', 'email_click', 'richpush_open', 'richpush_click'
            ] as EventType[]);
          }
          
          const pageViewData = DataGenerationUtils.generateEventData('page_view');
          eventSequence.push({
            id: DataGenerationUtils.generateId(),
            eventType,
            pageUrl: pageViewData['pageUrl'],
            userAgent: pageViewData['userAgent'],
            ipAddress: pageViewData['ipAddress'],
            timestamp: new Date(baseTimestamp.getTime() + (i * DataGenerationUtils.generateRandomInt(1000, 300000))),
            sessionId,
            referrer: DataGenerationUtils.generateRandomBoolean(0.7) ? pageViewData['pageUrl'] : undefined,
            deviceType: pageViewData['deviceType'],
            browser: pageViewData['browser'],
            os: pageViewData['os'],
            // Add context-specific data
            ...(eventType === 'add_itemToCart' && { 
              productId: DataGenerationUtils.generateId(),
              productName: DataGenerationUtils.generateProductData().name,
              quantity: DataGenerationUtils.generateRandomInt(1, 3),
              price: DataGenerationUtils.generateProductData().price
            }),
            ...(eventType === 'search' && { 
              query: DataGenerationUtils.generateEventData('search')['query'],
              resultsCount: DataGenerationUtils.generateEventData('search')['resultsCount']
            })
          });
        }
        
        const anonymousEvent = {
          id: DataGenerationUtils.generateId(),
          eventSequence,
          sessionId,
          totalEvents: eventCount,
          hasCompletedTransaction: hasCheckedOut,
          finalCartItems: cartItems
        };
        return {
          id,
          type,
          description: `Anonymous Event Sequence: ${eventCount} events with ${hasCheckedOut ? 'completed transaction' : 'no transaction'}`,
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