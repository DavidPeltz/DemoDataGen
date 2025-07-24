/**
 * Data Generation Utilities
 * 
 * Centralized data generation functions to eliminate faker.js code duplication
 * across the project. This utility provides common data generation patterns
 * used throughout the application.
 * 
 * Features:
 * - User data generation (names, emails, addresses)
 * - Product data generation
 * - Event data generation
 * - ID generation patterns
 * - Consistent data formats
 * - Email hashing for privacy compliance
 */

import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';

/**
 * Data Generation Utilities
 * 
 * Provides centralized data generation functions to eliminate code duplication
 * and ensure consistent data generation patterns across the application.
 */
export class DataGenerationUtils {
  
  /**
   * Generates a SHA256 hash of the provided string
   * 
   * @param input - String to hash
   * @returns string - SHA256 hash in hexadecimal format
   */
  static generateSHA256Hash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Generates a unique identifier
   * 
   * @returns string - Unique UUID
   */
  static generateId(): string {
    return faker.string.uuid();
  }

  /**
   * Generates a past date within a specified range
   * 
   * @param daysBack - Number of days back from now (default: 365)
   * @returns Date - Past date
   */
  static generatePastDate(daysBack: number = 365): Date {
    return faker.date.past({ years: daysBack / 365 });
  }

  /**
   * Generates a recent date within the last 30 days
   * 
   * @returns Date - Recent date
   */
  static generateRecentDate(): Date {
    return faker.date.recent({ days: 30 });
  }

  /**
   * Generates user name data
   * 
   * @param gender - Optional gender for name generation
   * @returns { firstName: string; lastName: string; fullName: string } - Name data
   */
  static generateUserName(gender?: 'male' | 'female'): { firstName: string; lastName: string; fullName: string } {
    const firstName = gender ? faker.person.firstName(gender) : faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = faker.person.fullName({ firstName, lastName });
    
    return { firstName, lastName, fullName };
  }

  /**
   * Generates email address with optional domain
   * 
   * @param firstName - Optional first name for email
   * @param lastName - Optional last name for email
   * @param domain - Optional domain (default: 'mediarithmics.com')
   * @returns string - Email address
   */
  static generateEmail(
    firstName?: string, 
    lastName?: string, 
    domain: string = 'mediarithmics.com'
  ): string {
    const emailOptions: any = { provider: domain };
    if (firstName) emailOptions.firstName = firstName;
    if (lastName) emailOptions.lastName = lastName;
    return faker.internet.email(emailOptions);
  }

  /**
   * Generates email address with SHA256 hash for privacy compliance
   * 
   * @param firstName - Optional first name for email
   * @param lastName - Optional last name for email
   * @param domain - Optional domain (default: 'mediarithmics.com')
   * @returns { email: string; email_hash: string } - Email address and its SHA256 hash
   */
  static generateEmailWithHash(
    firstName?: string, 
    lastName?: string, 
    domain: string = 'mediarithmics.com'
  ): { email: string; email_hash: string } {
    const email = this.generateEmail(firstName, lastName, domain);
    const email_hash = this.generateSHA256Hash(email);
    return { email, email_hash };
  }

  /**
   * Generates complete address data
   * 
   * @param country - Optional country for address generation
   * @returns Address object with all fields
   */
  static generateAddress(country?: string): {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: country || faker.location.country()
    };
  }

  /**
   * Generates phone number
   * 
   * @returns string - Phone number
   */
  static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generates product data
   * 
   * @returns { name: string; description: string; price: number; category: string; tags: string[] } - Product data
   */
  static generateProductData(): {
    name: string;
    description: string;
    price: number;
    category: string;
    tags: string[];
  } {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => 
        faker.commerce.productAdjective()
      )
    };
  }

  /**
   * Generates company data
   * 
   * @returns { name: string; jobTitle: string } - Company data
   */
  static generateCompanyData(): { name: string; jobTitle: string } {
    return {
      name: faker.company.name(),
      jobTitle: faker.person.jobTitle()
    };
  }

  /**
   * Generates event data for different event types
   * 
   * @param eventType - Type of event to generate data for
   * @returns Record<string, unknown> - Event-specific data
   */
  static generateEventData(eventType: string): Record<string, unknown> {
    switch (eventType.toLowerCase()) {
      case 'page_view':
        return {
          pageUrl: faker.internet.url(),
          userAgent: faker.internet.userAgent(),
          ipAddress: faker.internet.ip(),
          referrer: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
          deviceType: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
          browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
          os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android'])
        };

      case 'search':
        return {
          query: faker.helpers.arrayElement([
            'laptop', 'smartphone', 'headphones', 'camera', 'tablet',
            'wireless earbuds', 'gaming console', 'fitness tracker'
          ]),
          resultsCount: faker.number.int({ min: 10, max: 1000 })
        };

      case 'add_itemtocart':
      case 'remove_itemfromcart':
        return {
          productId: faker.string.uuid(),
          productName: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 3 }),
          price: parseFloat(faker.commerce.price())
        };

      case 'transaction_complete':
        return {
          orderId: faker.string.uuid(),
          total: parseFloat(faker.commerce.price({ min: 50, max: 1000 })),
          currency: 'USD',
          paymentMethod: faker.helpers.arrayElement(['credit_card', 'paypal', 'apple_pay'])
        };

      case 'email_open':
      case 'email_click':
        return {
          emailId: faker.string.uuid(),
          campaignId: faker.string.uuid(),
          subject: faker.lorem.sentence(),
          template: faker.helpers.arrayElement(['welcome', 'promotion', 'newsletter', 'abandoned_cart'])
        };

      case 'ad_view':
      case 'ad_click':
        return {
          adId: faker.string.uuid(),
          campaignId: faker.string.uuid(),
          placement: faker.helpers.arrayElement(['header', 'sidebar', 'footer', 'popup']),
          creativeType: faker.helpers.arrayElement(['banner', 'video', 'native'])
        };

      default:
        return {
          timestamp: new Date().toISOString(),
          sessionId: faker.string.uuid()
        };
    }
  }

  /**
   * Generates tracking identifiers
   * 
   * @param includeMaid - Whether to include Mobile Advertising ID
   * @param maidProbability - Probability of including MAID (default: 0.4)
   * @returns { cookieId: string; maidId?: string } - Tracking identifiers
   */
  static generateTrackingIds(includeMaid: boolean = true, maidProbability: number = 0.4): {
    cookieId: string;
    maidId?: string;
  } {
    const cookieId = faker.string.uuid();
    const result: { cookieId: string; maidId?: string } = { cookieId };
    
    if (includeMaid && faker.datatype.boolean({ probability: maidProbability })) {
      result.maidId = faker.string.uuid();
    }

    return result;
  }

  /**
   * Generates a random integer within a range
   * 
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns number - Random integer
   */
  static generateRandomInt(min: number, max: number): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generates a random float within a range
   * 
   * @param min - Minimum value
   * @param max - Maximum value
   * @param precision - Number of decimal places (default: 2)
   * @returns number - Random float
   */
  static generateRandomFloat(min: number, max: number, precision: number = 2): number {
    return parseFloat(faker.number.float({ min, max, fractionDigits: precision }).toFixed(precision));
  }

  /**
   * Generates a random boolean with specified probability
   * 
   * @param probability - Probability of true (default: 0.5)
   * @returns boolean - Random boolean
   */
  static generateRandomBoolean(probability: number = 0.5): boolean {
    return faker.datatype.boolean({ probability });
  }

  /**
   * Generates a random element from an array
   * 
   * @param array - Array to select from
   * @returns T - Random element
   */
  static generateRandomElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }

  /**
   * Generates a random subset of an array
   * 
   * @param array - Array to select from
   * @param count - Number of elements to select
   * @returns T[] - Random subset
   */
  static generateRandomSubset<T>(array: T[], count: number): T[] {
    return faker.helpers.arrayElements(array, count);
  }

  /**
   * Generates a random sentence
   * 
   * @param wordCount - Number of words (default: 5-10)
   * @returns string - Random sentence
   */
  static generateRandomSentence(wordCount?: number): string {
    return wordCount 
      ? faker.lorem.sentence(wordCount)
      : faker.lorem.sentence();
  }

  /**
   * Generates a random paragraph
   * 
   * @param sentenceCount - Number of sentences (default: 3-5)
   * @returns string - Random paragraph
   */
  static generateRandomParagraph(sentenceCount?: number): string {
    return sentenceCount 
      ? faker.lorem.paragraph(sentenceCount)
      : faker.lorem.paragraph();
  }
} 