/**
 * UserGenerator Class
 * 
 * This class is responsible for generating realistic user data with country-specific
 * information including names, addresses, and demographic details. It supports
 * gender distribution, country-specific naming conventions, and realistic address
 * generation for multiple countries.
 * 
 * Features:
 * - Country-specific first names (male/female) and surnames
 * - Country-appropriate cities and states/regions
 * - Gender distribution (53% female, 47% male)
 * - Realistic address generation
 * - Email generation with custom domain (mediarithmics.com)
 */

import { faker } from '@faker-js/faker';
import { User } from '../types';
import { getCountryData } from '../data/countryData';

export class UserGenerator {

  /**
   * Retrieves country-specific data or returns empty arrays for unsupported countries
   * 
   * This method provides access to the country-specific data repository. If the
   * requested country is not supported, it returns empty arrays, which will cause
   * the generator to fall back to faker.js default data.
   * 
   * @param country - The country name to get data for
   * @returns Object containing arrays of male names, female names, surnames, cities, and states
   */
  private getCountryData(country: string): { 
    maleNames: string[], 
    femaleNames: string[], 
    lastNames: string[],
    cities: string[],
    states: string[]
  } {
    return getCountryData(country);
  }

  /**
   * Generates a single user with generic data
   * 
   * This method creates a basic user object using faker.js defaults.
   * It's used as a fallback when country-specific data is not available
   * or when generating users without country constraints.
   * 
   * @returns User - A complete user object with all required fields
   */
  generateUser(): User {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    return {
      id: faker.string.uuid(),
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName, provider: 'mediarithmics.com' }),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      createdAt: faker.date.past(),
    };
  }

  /**
   * Generates multiple users with generic data
   * 
   * @param count - Number of users to generate
   * @returns User[] - Array of generated users
   */
  generateUsers(count: number): User[] {
    return Array.from({ length: count }, () => this.generateUser());
  }

  /**
   * Generates users that match specific criteria
   * 
   * This method allows for targeted user generation by applying
   * specific criteria to override default values.
   * 
   * @param criteria - Partial user object with criteria to match
   * @param count - Number of users to generate
   * @returns User[] - Array of users matching the criteria
   */
  generateUsersWithCriteria(criteria: Partial<User>, count: number): User[] {
    return Array.from({ length: count }, () => ({
      ...this.generateUser(),
      ...criteria,
    }));
  }

  /**
   * Generates users with country-specific data and gender distribution
   * 
   * This is the main method for generating realistic users. It:
   * 1. Maps country codes to full country names
   * 2. Retrieves country-specific name and address data
   * 3. Applies gender distribution (53% female, 47% male)
   * 4. Uses country-specific names when available, falls back to faker.js
   * 5. Generates country-appropriate addresses
   * 6. Creates emails with the mediarithmics.com domain
   * 
   * @param count - Number of users to generate
   * @param countryInput - Country name or 2-character country code
   * @returns User[] - Array of country-specific users
   */
  generateUsersForCountry(count: number, countryInput: string): User[] {
    // Map common country codes to full country names for easier input
    const countryMap: Record<string, string> = {
      'US': 'United States',
      'USA': 'United States',
      'CA': 'Canada',
      'CAN': 'Canada',
      'UK': 'United Kingdom',
      'GB': 'United Kingdom',
      'DE': 'Germany',
      'GER': 'Germany',
      'FR': 'France',
      'FRA': 'France'
    };
    
    // Determine the full country name from input
    const countryName = countryMap[countryInput.toUpperCase()] || countryInput;
    
    // Get country-specific data (names, cities, states)
    const countryData = this.getCountryData(countryName);

    // Generate the specified number of users
    return Array.from({ length: count }, () => {
      // Apply gender distribution: 53% female, 47% male
      const isFemale = faker.number.float({ min: 0, max: 1 }) < 0.53;
      
      // Select first name based on gender and country availability
      let firstName: string;
      if (isFemale && countryData.femaleNames.length > 0) {
        // Use country-specific female name if available
        firstName = faker.helpers.arrayElement(countryData.femaleNames);
      } else if (!isFemale && countryData.maleNames.length > 0) {
        // Use country-specific male name if available
        firstName = faker.helpers.arrayElement(countryData.maleNames);
      } else {
        // Fall back to faker.js gender-specific names
        firstName = isFemale ? faker.person.firstName('female') : faker.person.firstName('male');
      }
      
      // Select last name from country-specific list or fall back to faker.js
      const lastName = countryData.lastNames.length > 0 
        ? faker.helpers.arrayElement(countryData.lastNames)
        : faker.person.lastName();

      // Select city from country-specific list or fall back to faker.js
      const city = countryData.cities.length > 0 
        ? faker.helpers.arrayElement(countryData.cities)
        : faker.location.city();
      
      // Select state/region from country-specific list or fall back to faker.js
      const state = countryData.states.length > 0 
        ? faker.helpers.arrayElement(countryData.states)
        : faker.location.state();

      // Create and return the complete user object
      return {
        id: faker.string.uuid(),
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName, provider: 'mediarithmics.com' }),
        address: {
          street: faker.location.streetAddress(),
          city,
          state,
          zipCode: faker.location.zipCode(),
          country: countryName,
        },
        createdAt: faker.date.past(),
      };
    });
  }
} 