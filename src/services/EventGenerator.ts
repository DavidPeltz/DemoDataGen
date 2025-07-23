/**
 * Event Generator Service
 * 
 * This service is responsible for generating realistic user events with proper
 * sequencing and linking to user profiles. It handles both registered and
 * anonymous user events with appropriate business logic.
 * 
 * Extracted from index.ts to improve separation of concerns and maintainability.
 */

import { faker } from '@faker-js/faker';
import { UserProfile, UserEvent, EventGenerationContext } from '../types/events';
import { EventType } from '../types';
import { Config } from '../types/config';

/**
 * Event Generator Service
 * 
 * Handles the generation of realistic user events with proper sequencing
 * and business logic constraints.
 */
export class EventGenerator {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Generates user events with proper linking to user profiles
   * 
   * This function creates realistic user interaction events that can be correlated
   * with user profiles through various identifiers. It generates both events for
   * known users and purely anonymous events to simulate real-world scenarios.
   * 
   * @param userProfiles - Array of user profiles to link events to
   * @param country - Country where events occurred
   * @returns UserEvent[] - Array of user events with proper linking
   */
  generateUserEvents(userProfiles: UserProfile[], country: string): UserEvent[] {
    const events: UserEvent[] = [];
    
    // Generate events for known users (both registered and anonymous profiles)
    userProfiles.forEach((profile) => {
      const userEvents = this.generateUserEventSequence(profile, country);
      events.push(...userEvents);
    });
    
    // Generate additional anonymous events (no associated user profile)
    // This simulates users who haven't created profiles but are still tracked
    const anonymousUserCount = faker.number.int({ 
      min: this.config.dataGeneration.anonymousUserCount.min, 
      max: this.config.dataGeneration.anonymousUserCount.max 
    });
    
    for (let i = 0; i < anonymousUserCount; i++) {
      const anonymousProfile: UserProfile = {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email({ 
          firstName: faker.person.firstName(), 
          lastName: faker.person.lastName(), 
          provider: 'mediarithmics.com' 
        }),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          country
        },
        createdAt: faker.date.past(),
        profileType: 'anonymous',
        cookieId: faker.string.uuid(),
        maidId: faker.datatype.boolean({ 
          probability: this.config.userProfiles.mobileIdProbability.anonymous 
        }) ? faker.string.uuid() : undefined
      };
      
      const anonymousEvents = this.generateUserEventSequence(anonymousProfile, country);
      events.push(...anonymousEvents);
    }
    
    return events;
  }

  /**
   * Generates a logical sequence of events for a single user
   * 
   * This function creates realistic user journeys with proper event sequencing.
   * It ensures business logic is followed (e.g., transaction_complete requires
   * add_itemToCart and checkout events to precede it).
   * 
   * @param profile - User profile to generate events for
   * @param country - Country where events occurred
   * @returns UserEvent[] - Array of logically sequenced events for the user
   */
  private generateUserEventSequence(profile: UserProfile, country: string): UserEvent[] {
    const events: UserEvent[] = [];
    const eventCount = faker.number.int({ 
      min: this.config.dataGeneration.eventCountPerUser.min, 
      max: this.config.dataGeneration.eventCountPerUser.max 
    });
    
    // Initialize event generation context
    const context: EventGenerationContext = {
      hasAddedToCart: false,
      hasViewedCart: false,
      hasCheckedOut: false,
      cartItems: 0,
      sessionId: faker.string.uuid(),
      baseTimestamp: faker.date.recent({ days: 30 })
    };
    
    for (let i = 0; i < eventCount; i++) {
      // Determine event type based on current state and logical progression
      const eventType = this.determineEventType(context, i);
      
      // Update context based on event type
      this.updateContext(context, eventType);
      
      // Create event with realistic data
      const event: UserEvent = {
        id: faker.string.uuid(),
        userId: profile.profileType === 'registered' ? profile.id : undefined,
        cookieId: profile.cookieId,
        maidId: profile.maidId,
        eventType,
        eventData: this.generateEventData(eventType, context),
        timestamp: new Date(context.baseTimestamp.getTime() + (i * faker.number.int({ min: 1000, max: 300000 }))),
        country
      };
      
      events.push(event);
      
      // Session continuation based on configuration
      if (i > 0 && faker.datatype.boolean({ 
        probability: 1 - this.config.eventGeneration.sessionContinuationProbability 
      })) {
        context.sessionId = faker.string.uuid();
        context.baseTimestamp = faker.date.recent({ days: 30 });
      }
    }
    
    return events;
  }

  /**
   * Determines the next event type based on current context and business logic
   * 
   * @param context - Current event generation context
   * @param eventIndex - Index of the current event
   * @returns EventType - The determined event type
   */
  private determineEventType(context: EventGenerationContext, eventIndex: number): EventType {
    // First event is always page_view or search
    if (eventIndex === 0) {
      return faker.helpers.arrayElement(['page_view', 'search'] as EventType[]);
    }
    
    // After checkout, can have transaction_complete
    if (context.hasCheckedOut && faker.datatype.boolean({ 
      probability: this.config.eventGeneration.transactionAfterCheckoutProbability 
    })) {
      return 'transaction_complete';
    }
    
    // After checkout, mostly browsing events
    if (context.hasCheckedOut) {
      return faker.helpers.arrayElement([
        'page_view', 'search', 'article_view', 'video_view', 'audio_listen',
        'ad_view', 'ad_click', 'email_open', 'email_click', 'richpush_open', 'richpush_click'
      ] as EventType[]);
    }
    
    // After viewing cart, can checkout
    if (context.hasViewedCart && faker.datatype.boolean({ 
      probability: this.config.eventGeneration.checkoutAfterViewCartProbability 
    })) {
      return 'checkout';
    }
    
    // After adding to cart, likely to view cart
    if (context.hasAddedToCart && faker.datatype.boolean({ 
      probability: this.config.eventGeneration.viewCartAfterAddProbability 
    })) {
      return 'view_cart';
    }
    
    // Can remove items from cart
    if (context.hasAddedToCart && faker.datatype.boolean({ 
      probability: this.config.eventGeneration.removeFromCartProbability 
    })) {
      return 'remove_itemFromCart';
    }
    
    // Chance to add to cart if browsing
    if (faker.datatype.boolean({ 
      probability: this.config.eventGeneration.addToCartProbability 
    })) {
      return 'add_itemToCart';
    }
    
    // Default to browsing events
    return faker.helpers.arrayElement([
      'page_view', 'search', 'article_view', 'video_view', 'audio_listen',
      'ad_view', 'ad_click', 'email_open', 'email_click', 'richpush_open', 'richpush_click'
    ] as EventType[]);
  }

  /**
   * Updates the event generation context based on the event type
   * 
   * @param context - Current event generation context
   * @param eventType - The event type that was generated
   */
  private updateContext(context: EventGenerationContext, eventType: EventType): void {
    switch (eventType) {
      case 'add_itemToCart':
        context.hasAddedToCart = true;
        context.cartItems++;
        break;
      case 'remove_itemFromCart':
        context.cartItems = Math.max(0, context.cartItems - 1);
        break;
      case 'view_cart':
        context.hasViewedCart = true;
        break;
      case 'checkout':
        context.hasCheckedOut = true;
        break;
    }
  }

  /**
   * Generates event-specific data based on the event type
   * 
   * @param eventType - The type of event
   * @param context - Current event generation context
   * @returns Record<string, unknown> - Event-specific data
   */
  private generateEventData(eventType: EventType, context: EventGenerationContext): Record<string, unknown> {
    const baseData = {
      pageUrl: faker.internet.url(),
      userAgent: faker.internet.userAgent(),
      ipAddress: faker.internet.ip(),
      sessionId: context.sessionId,
      referrer: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
      deviceType: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
      browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
      os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android'])
    };

    switch (eventType) {
      case 'add_itemToCart':
        return {
          ...baseData,
          productId: faker.string.uuid(),
          productName: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 3 }),
          price: parseFloat(faker.commerce.price())
        };
      
      case 'remove_itemFromCart':
        return {
          ...baseData,
          productId: faker.string.uuid(),
          productName: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 2 })
        };
      
      case 'view_cart':
        return {
          ...baseData,
          itemCount: context.cartItems,
          totalValue: parseFloat(faker.commerce.price({ min: 10, max: 500 }))
        };
      
      case 'checkout':
        return {
          ...baseData,
          itemCount: context.cartItems,
          totalValue: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
          paymentMethod: faker.helpers.arrayElement(['credit_card', 'paypal', 'apple_pay', 'google_pay'])
        };
      
      case 'transaction_complete':
        return {
          ...baseData,
          orderId: faker.string.uuid(),
          totalValue: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
          paymentMethod: faker.helpers.arrayElement(['credit_card', 'paypal', 'apple_pay', 'google_pay']),
          shippingAddress: faker.location.streetAddress()
        };
      
      case 'search':
        return {
          ...baseData,
          query: faker.helpers.arrayElement([
            'laptop', 'phone', 'headphones', 'shoes', 'dress', 'book', 'camera', 'watch'
          ]),
          resultsCount: faker.number.int({ min: 10, max: 1000 })
        };
      
      case 'email_open':
        return {
          ...baseData,
          emailId: faker.string.uuid(),
          subject: faker.helpers.arrayElement([
            'Your order confirmation', 'New products available', 'Special offer just for you',
            'Welcome to our store', 'Flash sale - 50% off!'
          ]),
          campaignId: faker.string.uuid()
        };
      
      case 'email_click':
        return {
          ...baseData,
          emailId: faker.string.uuid(),
          linkUrl: faker.internet.url(),
          linkText: faker.helpers.arrayElement(['Shop Now', 'Learn More', 'View Details', 'Get Offer'])
        };
      
      case 'richpush_open':
        return {
          ...baseData,
          notificationId: faker.string.uuid(),
          title: faker.helpers.arrayElement([
            'New arrivals!', 'Flash sale alert', 'Order update', 'Personalized recommendations'
          ]),
          body: faker.lorem.sentence()
        };
      
      case 'richpush_click':
        return {
          ...baseData,
          notificationId: faker.string.uuid(),
          action: faker.helpers.arrayElement(['view_product', 'open_cart', 'browse_category'])
        };
      
      default:
        return baseData;
    }
  }
} 