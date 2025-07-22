/**
 * Demo Data Generator - Main Entry Point
 * 
 * This module serves as the main entry point for the Demo Data Generator application.
 * It orchestrates the generation of realistic user data, products, and events for
 * testing and development purposes. The application supports country-specific data
 * generation with proper ID linking between user profiles and events.
 */

// Core generator imports for creating different types of data
import { DataGenerator } from './generators/DataGenerator';
import { UserGenerator } from './generators/UserGenerator';
import { ProductGenerator } from './generators/ProductGenerator';
import { User } from './types';

// Node.js built-in modules for file system operations and user input
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// Faker.js library for generating realistic fake data
import { faker } from '@faker-js/faker';

/**
 * UserProfile Interface
 * 
 * Extends the base User interface to include profile type information and
 * linking identifiers for tracking user behavior across different platforms.
 * 
 * - profileType: Distinguishes between registered and anonymous users
 * - cookieId: Unique identifier for web-based tracking
 * - maidId: Mobile Advertising ID for app-based tracking (optional)
 */
interface UserProfile extends User {
  profileType: 'registered' | 'anonymous';
  cookieId: string;
  maidId?: string | undefined;
}

/**
 * UserEvent Interface
 * 
 * Represents user interaction events that can be linked to user profiles
 * through various identifiers. Supports both known users and anonymous tracking.
 * 
 * - userId: Links to registered user profiles (optional for anonymous events)
 * - cookieId: Web-based tracking identifier
 * - maidId: Mobile app tracking identifier (optional)
 * - eventType: Type of user interaction (page_view, click, scroll, etc.)
 * - eventData: Detailed event information (URL, user agent, device info, etc.)
 * - timestamp: When the event occurred (within last 30 days)
 * - country: Country where the event occurred
 */
interface UserEvent {
  id: string;
  userId?: string | undefined; // For known users
  cookieId?: string | undefined; // For anonymous web users
  maidId?: string | undefined; // For anonymous mobile app users
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: Date;
  country: string;
}

/**
 * Creates a readline interface for handling user input from the console
 * 
 * @returns readline.Interface - Configured interface for stdin/stdout
 */
function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Prompts the user for country input and returns the response
 * 
 * This function handles the interactive country selection that determines
 * which country-specific data will be generated (names, addresses, etc.)
 * 
 * @param rl - Readline interface for user input
 * @returns Promise<string> - The country name or code entered by the user
 */
async function getCountryInput(rl: readline.Interface): Promise<string> {
  return new Promise((resolve) => {
    rl.question('🌍 Enter country name or 2-character country code (e.g., "USA" or "US"): ', (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Prompts the user for the number of users to generate
 * 
 * This function handles the user count input with validation and a default value.
 * If the user enters an invalid number or leaves it empty, it defaults to 20 users.
 * 
 * @param rl - Readline interface for user input
 * @returns Promise<number> - The number of users to generate (minimum 1)
 */
async function getUserCountInput(rl: readline.Interface): Promise<number> {
  return new Promise((resolve) => {
    rl.question('👥 Enter number of users to generate (default: 20): ', (answer) => {
      const count = parseInt(answer.trim());
      // Use default of 20 if input is invalid, empty, or less than 1
      resolve(isNaN(count) || count <= 0 ? 20 : count);
    });
  });
}

/**
 * Converts base User objects into UserProfile objects with tracking information
 * 
 * This function adds profile type classification and generates linking identifiers
 * for each user. It creates a realistic mix of registered (70%) and anonymous (30%)
 * users, with appropriate tracking IDs for web and mobile platforms.
 * 
 * @param users - Array of base User objects
 * @returns UserProfile[] - Array of enhanced user profiles with tracking data
 */
function generateUserProfiles(users: User[]): UserProfile[] {
  return users.map((user) => {
    // Determine if user is registered (70% probability) or anonymous (30% probability)
    const isRegistered = faker.datatype.boolean({ probability: 0.7 });
    
    if (isRegistered) {
      return {
        ...user,
        profileType: 'registered' as const,
        cookieId: faker.string.uuid(), // Always generate cookie ID for web tracking
        maidId: faker.datatype.boolean({ probability: 0.3 }) ? faker.string.uuid() : undefined // 30% chance of mobile ID
      };
    } else {
      return {
        ...user,
        profileType: 'anonymous' as const,
        cookieId: faker.string.uuid(), // Always generate cookie ID for web tracking
        maidId: faker.datatype.boolean({ probability: 0.4 }) ? faker.string.uuid() : undefined // 40% chance of mobile ID
      };
    }
  });
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
function generateUserEvents(userProfiles: UserProfile[], country: string): UserEvent[] {
  const events: UserEvent[] = [];
  
  // Generate events for known users (both registered and anonymous profiles)
  userProfiles.forEach((profile) => {
    // Each user gets 1-5 events to simulate realistic usage patterns
    const eventCount = faker.number.int({ min: 1, max: 5 });
    
    for (let i = 0; i < eventCount; i++) {
      const event: UserEvent = {
        id: faker.string.uuid(),
        // Only link userId for registered users (anonymous profiles don't have userId)
        userId: profile.profileType === 'registered' ? profile.id : undefined,
        cookieId: profile.cookieId, // Always include cookie ID for web tracking
        maidId: profile.maidId, // Include mobile ID if available
        eventType: faker.helpers.arrayElement(['page_view', 'click', 'scroll', 'form_submit', 'download', 'purchase']),
        eventData: {
          pageUrl: faker.internet.url(),
          userAgent: faker.internet.userAgent(),
          ipAddress: faker.internet.ip(),
          sessionId: faker.string.uuid(),
          referrer: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }), // 70% chance of referrer
          deviceType: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
          browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
          os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
        },
        timestamp: faker.date.recent({ days: 30 }), // Events within last 30 days
        country
      };
      events.push(event);
    }
  });
  
  // Generate additional anonymous events (no associated user profile)
  // This simulates users who haven't created profiles but are still tracked
  const anonymousEventCount = faker.number.int({ min: 10, max: 20 });
  for (let i = 0; i < anonymousEventCount; i++) {
    const event: UserEvent = {
      id: faker.string.uuid(),
      cookieId: faker.string.uuid(), // Generate new cookie ID for anonymous event
      maidId: faker.datatype.boolean({ probability: 0.3 }) ? faker.string.uuid() : undefined, // 30% chance of mobile ID
      eventType: faker.helpers.arrayElement(['page_view', 'click', 'scroll', 'form_submit', 'download']),
      eventData: {
        pageUrl: faker.internet.url(),
        userAgent: faker.internet.userAgent(),
        ipAddress: faker.internet.ip(),
        sessionId: faker.string.uuid(),
        referrer: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
        deviceType: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
        browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
        os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
      },
      timestamp: faker.date.recent({ days: 30 }),
      country
    };
    events.push(event);
  }
  
  return events;
}

/**
 * Saves generated data to newline-delimited JSON (NDJSON) files
 * 
 * This function creates separate files for user profiles and events, using
 * NDJSON format for easy processing and analysis. Files are named based on
 * the country to keep data organized.
 * 
 * @param userProfiles - Array of user profiles to save
 * @param events - Array of user events to save
 * @param country - Country name used for file naming
 */
function saveDataToFiles(userProfiles: UserProfile[], events: UserEvent[], country: string): void {
  // Create output directory in the current working directory
  const outputDir = path.join(process.cwd(), 'output');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Normalize country name for file naming (lowercase, replace spaces with underscores)
  const normalizedCountry = country.toLowerCase().replace(/\s+/g, '_');
  
  // Save user profiles to NDJSON file
  const userProfilesPath = path.join(outputDir, `user_profiles_${normalizedCountry}.ndjson`);
  const userProfilesContent = userProfiles.map(profile => JSON.stringify(profile)).join('\n');
  fs.writeFileSync(userProfilesPath, userProfilesContent);
  
  // Save events to NDJSON file
  const eventsPath = path.join(outputDir, `user_events_${normalizedCountry}.ndjson`);
  const eventsContent = events.map(event => JSON.stringify(event)).join('\n');
  fs.writeFileSync(eventsPath, eventsContent);
  
  // Display file paths to user
  console.log(`📁 Data saved to:`);
  console.log(`   👥 User profiles: ${userProfilesPath}`);
  console.log(`   📊 User events: ${eventsPath}`);
}

/**
 * Main entry point for the Demo Data Generator application
 * 
 * This function orchestrates the entire data generation process:
 * 1. Gets country input from user
 * 2. Gets user count input from user
 * 3. Initializes data generators
 * 4. Generates users, products, and mixed data
 * 5. Creates user profiles with tracking information
 * 6. Generates user events with proper linking
 * 7. Saves all data to files
 * 
 * @returns Promise<void>
 */
async function main(): Promise<void> {
  console.log('🚀 Demo Data Generator Starting...\n');

  // Create readline interface for user interaction
  const rl = createReadlineInterface();

  try {
    // Step 1: Get country input from user
    const countryInput = await getCountryInput(rl);
    console.log(`📍 Generating data for country: ${countryInput}\n`);

    // Step 2: Get user count input from user
    const userCount = await getUserCountInput(rl);
    console.log(`👥 Generating ${userCount} users...\n`);

    // Step 3: Initialize data generators
    const userGenerator = new UserGenerator();
    const productGenerator = new ProductGenerator();
    const dataGenerator = new DataGenerator();

    // Step 4: Generate sample data
    console.log('📊 Generating sample data...\n');

    // Generate users for the specified country with country-specific data
    const users = userGenerator.generateUsersForCountry(userCount, countryInput);
    
    // Convert users to profiles with tracking information
    const userProfiles = generateUserProfiles(users);
    
    // Display generated user profiles with visual indicators
    console.log('👥 Generated User Profiles:');
    userProfiles.forEach((profile, index) => {
      const profileType = profile.profileType === 'registered' ? '📝' : '👤';
      console.log(`  ${index + 1}. ${profileType} ${profile.firstName} ${profile.lastName} (${profile.email}) - ${profile.address.country} [${profile.profileType}]`);
    });

    console.log('\n');

    // Generate 3 sample products
    const products = productGenerator.generateProducts(3);
    console.log('🛍️  Generated Products:');
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - $${product.price.toFixed(2)}`);
    });

    console.log('\n');

    // Generate 10 mixed data items (users, products, orders, reviews, anonymous events)
    const mixedData = dataGenerator.generateMixedData(10);
    console.log('🎲 Generated Mixed Data:');
    mixedData.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.type}: ${item.description}`);
    });

    console.log('\n');

    // Generate user events with proper linking to profiles
    const events = generateUserEvents(userProfiles, countryInput);
    console.log(`📊 Generated ${events.length} User Events (last 30 days)`);
    
    // Save all generated data to files
    saveDataToFiles(userProfiles, events, countryInput);

    console.log('\n✅ Demo data generation completed successfully!');

  } catch (error) {
    console.error('❌ Error generating demo data:', error);
    process.exit(1);
  } finally {
    // Always close the readline interface to prevent hanging
    rl.close();
  }
}

// Run the program if this file is executed directly (not imported as a module)
if (require.main === module) {
  main().catch(console.error);
}

// Export main function for potential use as a module
export { main }; 