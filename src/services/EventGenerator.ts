/**
 * Event Generator Service
 * 
 * This service is responsible for generating realistic user events with proper
 * sequencing and linking to user profiles. It handles both registered and
 * anonymous user events with appropriate business logic.
 * 
 * Extracted from index.ts to improve separation of concerns and maintainability.
 */

import { UserProfile, UserEvent, EventGenerationContext } from '../types/events';
import { EventType } from '../types';
import { Config } from '../types/config';
import { DataGenerationUtils } from '../utils/DataGenerationUtils';

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
    const anonymousUserCount = DataGenerationUtils.generateRandomInt(
      this.config.dataGeneration.anonymousUserCount.min, 
      this.config.dataGeneration.anonymousUserCount.max 
    );
    
    for (let i = 0; i < anonymousUserCount; i++) {
      const { firstName, lastName } = DataGenerationUtils.generateUserName();
      const { email, email_hash } = DataGenerationUtils.generateEmailWithHash(firstName, lastName);
      const { cookieId, maidId } = DataGenerationUtils.generateTrackingIds(
        true, 
        this.config.userProfiles.mobileIdProbability.anonymous
      );
      
      const anonymousProfile: UserProfile = {
        id: DataGenerationUtils.generateId(),
        firstName,
        lastName,
        email,
        email_hash,
        address: DataGenerationUtils.generateAddress(country),
        createdAt: DataGenerationUtils.generatePastDate(),
        profileType: 'anonymous',
        cookieId,
        maidId
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
    const eventCount = DataGenerationUtils.generateRandomInt(
      this.config.dataGeneration.eventCountPerUser.min, 
      this.config.dataGeneration.eventCountPerUser.max 
    );
    
    // Initialize event generation context
    const context: EventGenerationContext = {
      hasAddedToCart: false,
      hasViewedCart: false,
      hasCheckedOut: false,
      cartItems: 0,
      sessionId: DataGenerationUtils.generateId(),
      baseTimestamp: DataGenerationUtils.generateRecentDate()
    };
    
    for (let i = 0; i < eventCount; i++) {
      // Determine event type based on current state and logical progression
      const eventType = this.determineEventType(context, i);
      
      // Update context based on event type
      this.updateContext(context, eventType);
      
      // Create event with realistic data
      const event: UserEvent = {
        id: DataGenerationUtils.generateId(),
        userId: profile.profileType === 'registered' ? profile.id : undefined,
        cookieId: profile.cookieId,
        maidId: profile.maidId,
        eventType,
        eventData: this.generateEventData(eventType, context),
        timestamp: new Date(context.baseTimestamp.getTime() + (i * DataGenerationUtils.generateRandomInt(1000, 300000))),
        country
      };
      
      events.push(event);
      
      // Session continuation based on configuration
      if (i > 0 && DataGenerationUtils.generateRandomBoolean(1 - this.config.eventGeneration.sessionContinuationProbability)) {
        context.sessionId = DataGenerationUtils.generateId();
        context.baseTimestamp = DataGenerationUtils.generateRecentDate();
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
      return DataGenerationUtils.generateRandomElement(['page_view', 'search'] as EventType[]);
    }
    
    // After checkout, can have transaction_complete
    if (context.hasCheckedOut && DataGenerationUtils.generateRandomBoolean(
      this.config.eventGeneration.transactionAfterCheckoutProbability 
    )) {
      return 'transaction_complete';
    }
    
    // After checkout, mostly browsing events
    if (context.hasCheckedOut) {
      return DataGenerationUtils.generateRandomElement([
        'page_view', 'search', 'article_view', 'video_view', 'audio_listen',
        'ad_view', 'ad_click', 'email_open', 'email_click', 'richpush_open', 'richpush_click'
      ] as EventType[]);
    }
    
    // After viewing cart, can checkout
    if (context.hasViewedCart && DataGenerationUtils.generateRandomBoolean(
      this.config.eventGeneration.checkoutAfterViewCartProbability 
    )) {
      return 'checkout';
    }
    
    // After adding to cart, likely to view cart
    if (context.hasAddedToCart && DataGenerationUtils.generateRandomBoolean(
      this.config.eventGeneration.viewCartAfterAddProbability 
    )) {
      return 'view_cart';
    }
    
    // Can remove items from cart
    if (context.hasAddedToCart && DataGenerationUtils.generateRandomBoolean(
      this.config.eventGeneration.removeFromCartProbability 
    )) {
      return 'remove_itemFromCart';
    }
    
    // Chance to add to cart if browsing
    if (DataGenerationUtils.generateRandomBoolean(
      this.config.eventGeneration.addToCartProbability 
    )) {
      return 'add_itemToCart';
    }
    
    // Default to browsing events
    return DataGenerationUtils.generateRandomElement([
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
    const pageViewData = DataGenerationUtils.generateEventData('page_view');
    const baseData = {
      pageUrl: pageViewData['pageUrl'],
      userAgent: pageViewData['userAgent'],
      ipAddress: pageViewData['ipAddress'],
      sessionId: context.sessionId,
      referrer: DataGenerationUtils.generateRandomBoolean(0.7) ? pageViewData['pageUrl'] : undefined,
      deviceType: pageViewData['deviceType'],
      browser: pageViewData['browser'],
      os: pageViewData['os']
    };

    switch (eventType) {
      case 'add_itemToCart':
        const addToCartData = DataGenerationUtils.generateEventData('add_itemtocart');
        return {
          ...baseData,
          productId: addToCartData['productId'],
          productName: addToCartData['productName'],
          quantity: addToCartData['quantity'],
          price: addToCartData['price']
        };
      
      case 'remove_itemFromCart':
        const removeFromCartData = DataGenerationUtils.generateEventData('remove_itemfromcart');
        return {
          ...baseData,
          productId: removeFromCartData['productId'],
          productName: removeFromCartData['productName'],
          quantity: removeFromCartData['quantity']
        };
      
      case 'view_cart':
        return {
          ...baseData,
          itemCount: context.cartItems,
          totalValue: DataGenerationUtils.generateRandomFloat(10, 500)
        };
      
      case 'checkout':
        const transactionData = DataGenerationUtils.generateEventData('transaction_complete');
        return {
          ...baseData,
          itemCount: context.cartItems,
          totalValue: DataGenerationUtils.generateRandomFloat(10, 500),
          paymentMethod: transactionData['paymentMethod']
        };
      
      case 'transaction_complete':
        const completeTransactionData = DataGenerationUtils.generateEventData('transaction_complete');
        return {
          ...baseData,
          orderId: completeTransactionData['orderId'],
          totalValue: completeTransactionData['total'],
          paymentMethod: completeTransactionData['paymentMethod'],
          shippingAddress: DataGenerationUtils.generateAddress().street
        };
      
      case 'search':
        const searchData = DataGenerationUtils.generateEventData('search');
        return {
          ...baseData,
          query: searchData['query'],
          resultsCount: searchData['resultsCount']
        };
      
      case 'email_open':
        const emailOpenData = DataGenerationUtils.generateEventData('email_open');
        return {
          ...baseData,
          emailId: emailOpenData['emailId'],
          subject: emailOpenData['subject'],
          campaignId: emailOpenData['campaignId']
        };
      
      case 'email_click':
        const emailClickData = DataGenerationUtils.generateEventData('email_click');
        return {
          ...baseData,
          emailId: emailClickData['emailId'],
          linkUrl: DataGenerationUtils.generateEventData('page_view')['pageUrl'],
          linkText: DataGenerationUtils.generateRandomElement(['Shop Now', 'Learn More', 'View Details', 'Get Offer'])
        };
      
      case 'richpush_open':
        return {
          ...baseData,
          notificationId: DataGenerationUtils.generateId(),
          title: DataGenerationUtils.generateRandomElement([
            'New arrivals!', 'Flash sale alert', 'Order update', 'Personalized recommendations'
          ]),
          body: DataGenerationUtils.generateRandomSentence()
        };
      
      case 'richpush_click':
        return {
          ...baseData,
          notificationId: DataGenerationUtils.generateId(),
          action: DataGenerationUtils.generateRandomElement(['view_product', 'open_cart', 'browse_category'])
        };
      
      default:
        return baseData;
    }
  }
} 