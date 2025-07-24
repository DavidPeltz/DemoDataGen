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

import { User } from '../types';
import { getCountryData } from '../data/countryData';
import { DataGenerationUtils } from '../utils/DataGenerationUtils';

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
    const { firstName, lastName } = DataGenerationUtils.generateUserName();

    return {
      id: DataGenerationUtils.generateId(),
      firstName,
      lastName,
      email: DataGenerationUtils.generateEmail(firstName, lastName),
      address: DataGenerationUtils.generateAddress(),
      createdAt: DataGenerationUtils.generatePastDate(),
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
      const isFemale = DataGenerationUtils.generateRandomFloat(0, 1) < 0.53;
      
      // Select first name based on gender and country availability
      let firstName: string;
      if (isFemale && countryData.femaleNames.length > 0) {
        // Use country-specific female name if available
        firstName = DataGenerationUtils.generateRandomElement(countryData.femaleNames);
      } else if (!isFemale && countryData.maleNames.length > 0) {
        // Use country-specific male name if available
        firstName = DataGenerationUtils.generateRandomElement(countryData.maleNames);
      } else {
        // Fall back to gender-specific names
        const { firstName: genFirstName } = DataGenerationUtils.generateUserName(isFemale ? 'female' : 'male');
        firstName = genFirstName;
      }
      
      // Select last name from country-specific list or fall back to default
      const lastName = countryData.lastNames.length > 0 
        ? DataGenerationUtils.generateRandomElement(countryData.lastNames)
        : DataGenerationUtils.generateUserName().lastName;

      // Select city from country-specific list or fall back to default
      const city = countryData.cities.length > 0 
        ? DataGenerationUtils.generateRandomElement(countryData.cities)
        : DataGenerationUtils.generateAddress().city;
      
      // Select state/region from country-specific list or fall back to default
      const state = countryData.states.length > 0 
        ? DataGenerationUtils.generateRandomElement(countryData.states)
        : DataGenerationUtils.generateAddress().state;

      // Create and return the complete user object
      return {
        id: DataGenerationUtils.generateId(),
        firstName,
        lastName,
        email: DataGenerationUtils.generateEmail(firstName, lastName),
        address: {
          street: DataGenerationUtils.generateAddress().street,
          city,
          state,
          zipCode: DataGenerationUtils.generateAddress().zipCode,
          country: countryName,
        },
        createdAt: DataGenerationUtils.generatePastDate(),
      };
    });
  }
} 