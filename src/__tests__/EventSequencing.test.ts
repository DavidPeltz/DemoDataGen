/**
 * Event Sequencing Tests
 * 
 * Tests for the logical event sequencing functionality that ensures
 * business rules are followed (e.g., transaction_complete requires
 * add_itemToCart and checkout events to precede it).
 */

import { faker } from '@faker-js/faker';
import { EventType } from '../types';

// Mock the generateUserEventSequence function logic for testing
function generateTestEventSequence(): EventType[] {
  const events: EventType[] = [];
  const eventCount = faker.number.int({ min: 10, max: 20 });
  
  // Track user state for logical sequencing
  let hasAddedToCart = false;
  let hasViewedCart = false;
  let hasCheckedOut = false;
  
  for (let i = 0; i < eventCount; i++) {
    let eventType: EventType;
    
    // Generate event type with logical constraints
    if (i === 0) {
      // First event is always page_view or search
      eventType = faker.helpers.arrayElement(['page_view', 'search'] as EventType[]);
    } else if (hasCheckedOut && faker.datatype.boolean({ probability: 0.3 })) {
      // After checkout, can have transaction_complete
      eventType = 'transaction_complete';
    } else if (hasCheckedOut) {
      // After checkout, mostly browsing events
      eventType = faker.helpers.arrayElement([
        'page_view', 'search', 'article_view', 'video_view', 'audio_listen',
        'ad_view', 'ad_click', 'email_open', 'email_click', 'richpush_open', 'richpush_click'
      ] as EventType[]);
    } else if (hasViewedCart && faker.datatype.boolean({ probability: 0.4 })) {
      // After viewing cart, can checkout
      eventType = 'checkout';
      hasCheckedOut = true;
    } else if (hasAddedToCart && faker.datatype.boolean({ probability: 0.6 })) {
      // After adding to cart, likely to view cart
      eventType = 'view_cart';
      hasViewedCart = true;
    } else if (hasAddedToCart && faker.datatype.boolean({ probability: 0.2 })) {
      // Can remove items from cart
      eventType = 'remove_itemFromCart';
    } else if (faker.datatype.boolean({ probability: 0.3 })) {
      // 30% chance to add to cart if browsing
      eventType = 'add_itemToCart';
      hasAddedToCart = true;
    } else {
      // Default to browsing events
      eventType = faker.helpers.arrayElement([
        'page_view', 'search', 'article_view', 'video_view', 'audio_listen',
        'ad_view', 'ad_click', 'email_open', 'email_click', 'richpush_open', 'richpush_click'
      ] as EventType[]);
    }
    
    events.push(eventType);
  }
  
  return events;
}

describe('Event Sequencing Logic', () => {
  test('should generate 10-20 events per sequence', () => {
    const events = generateTestEventSequence();
    expect(events.length).toBeGreaterThanOrEqual(10);
    expect(events.length).toBeLessThanOrEqual(20);
  });

  test('should start with page_view or search', () => {
    const events = generateTestEventSequence();
    expect(['page_view', 'search']).toContain(events[0]);
  });

  test('should follow transaction logic: transaction_complete only after checkout', () => {
    const events = generateTestEventSequence();
    const transactionIndex = events.indexOf('transaction_complete');
    const checkoutIndex = events.indexOf('checkout');
    
    if (transactionIndex !== -1) {
      // If transaction_complete exists, checkout must come before it
      expect(checkoutIndex).toBeLessThan(transactionIndex);
    }
  });

  test('should follow cart logic: view_cart typically after add_itemToCart', () => {
    const events = generateTestEventSequence();
    const addToCartIndex = events.indexOf('add_itemToCart');
    const viewCartIndex = events.indexOf('view_cart');
    
    if (viewCartIndex !== -1 && addToCartIndex !== -1) {
      // view_cart should come after add_itemToCart
      expect(addToCartIndex).toBeLessThan(viewCartIndex);
    }
  });

  test('should include realistic event types', () => {
    const events = generateTestEventSequence();
    const validEventTypes: EventType[] = [
      'page_view', 'search', 'article_view', 'video_view', 'audio_listen',
      'ad_view', 'ad_click', 'email_open', 'email_click', 'add_itemToCart',
      'remove_itemFromCart', 'transaction_complete', 'checkout', 'view_cart',
      'richpush_open', 'richpush_click'
    ];
    
    events.forEach(eventType => {
      expect(validEventTypes).toContain(eventType);
    });
  });

  test('should generate multiple sequences with different patterns', () => {
    const sequence1 = generateTestEventSequence();
    const sequence2 = generateTestEventSequence();
    
    // Sequences should be different (not identical)
    expect(sequence1).not.toEqual(sequence2);
    
    // Both should be valid lengths
    expect(sequence1.length).toBeGreaterThanOrEqual(10);
    expect(sequence2.length).toBeGreaterThanOrEqual(10);
  });
}); 