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

export class UserGenerator {
  /**
   * Country-specific data repository
   * 
   * This private property contains curated lists of names, cities, and states
   * for supported countries. Each country has separate arrays for male names,
   * female names, surnames, cities, and states/regions to ensure realistic
   * and geographically appropriate data generation.
   * 
   * Supported countries: United States, Canada, United Kingdom, Germany, France
   */
  private countryData: Record<string, { 
    maleNames: string[], 
    femaleNames: string[], 
    lastNames: string[],
    cities: string[],
    states: string[]
  }> = {
    'United States': {
      // Top 50 male first names in the United States
      maleNames: [
        'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher',
        'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
        'Kenneth', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan',
        'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
        'Benjamin', 'Frank', 'Gregory', 'Raymond', 'Samuel', 'Patrick', 'Alexander', 'Jack', 'Dennis', 'Jerry'
      ],
      // Top 50 female first names in the United States
      femaleNames: [
        'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
        'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle',
        'Laura', 'Emily', 'Kimberly', 'Deborah', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen',
        'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Emily', 'Kimberly', 'Deborah',
        'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth'
      ],
      // Top 50 surnames in the United States
      lastNames: [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
        'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
        'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
      ],
      // Top 50 most populous cities in the United States
      cities: [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
        'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington',
        'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore',
        'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Mesa', 'Kansas City', 'Atlanta', 'Long Beach', 'Colorado Springs',
        'Raleigh', 'Miami', 'Virginia Beach', 'Omaha', 'Oakland', 'Minneapolis', 'Tampa', 'Tulsa', 'Arlington', 'New Orleans'
      ],
      // All 50 US states
      states: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
        'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
      ]
    },
    'Canada': {
      // Top 50 male first names in Canada
      maleNames: [
        'Liam', 'Noah', 'Oliver', 'William', 'James', 'Benjamin', 'Lucas', 'Mason', 'Ethan', 'Alexander',
        'Henry', 'Jacob', 'Michael', 'Daniel', 'Logan', 'Jackson', 'Sebastian', 'Jack', 'Owen', 'Dylan',
        'Nathan', 'Isaac', 'Kyle', 'Hunter', 'Levi', 'Ryan', 'Jacob', 'Michael', 'Daniel', 'Logan',
        'Jackson', 'Sebastian', 'Jack', 'Owen', 'Dylan', 'Nathan', 'Isaac', 'Kyle', 'Hunter', 'Levi',
        'Ryan', 'Jacob', 'Michael', 'Daniel', 'Logan', 'Jackson', 'Sebastian', 'Jack', 'Owen', 'Dylan'
      ],
      // Top 50 female first names in Canada
      femaleNames: [
        'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn',
        'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery', 'Ella', 'Madison', 'Scarlett', 'Victoria', 'Luna',
        'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoe', 'Hannah', 'Lily', 'Ellie', 'Lillian',
        'Addison', 'Aubrey', 'Lucy', 'Audrey', 'Bella', 'Savannah', 'Paisley', 'Skylar', 'Violet', 'Claire',
        'Bella', 'Savannah', 'Paisley', 'Skylar', 'Violet', 'Claire', 'Bella', 'Savannah', 'Paisley', 'Skylar'
      ],
      // Top 50 surnames in Canada
      lastNames: [
        'Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Gagnon', 'Lee', 'Wilson', 'Johnson', 'MacDonald',
        'White', 'Taylor', 'Clark', 'Anderson', 'Wright', 'Campbell', 'Roberts', 'Thompson', 'Cook', 'Mitchell',
        'Bailey', 'Turner', 'Parker', 'Morris', 'Edwards', 'Morgan', 'Peterson', 'Gray', 'Rogers', 'James',
        'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long',
        'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander'
      ],
      // Top 50 most populous cities in Canada
      cities: [
        'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener',
        'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor', 'Saskatoon', 'St. Catharines', 'Regina', 'St. John\'s', 'Kelowna',
        'Barrie', 'Sherbrooke', 'Guelph', 'Abbotsford', 'Kingston', 'Kanata', 'Trois-Rivières', 'Moncton', 'Chicoutimi', 'Milton',
        'Red Deer', 'Brantford', 'Thunder Bay', 'Whitehorse', 'Yellowknife', 'Iqaluit', 'Fredericton', 'Charlottetown', 'Saint John', 'Dartmouth',
        'Surrey', 'Brampton', 'Mississauga', 'Markham', 'Vaughan', 'Richmond Hill', 'Oakville', 'Burlington', 'Ajax', 'Whitby'
      ],
      // All 13 Canadian provinces and territories
      states: [
        'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
        'Quebec', 'Saskatchewan', 'Yukon'
      ]
    },
    'United Kingdom': {
      // Top 50 male first names in the United Kingdom
      maleNames: [
        'Oliver', 'Harry', 'George', 'Noah', 'Jack', 'Charlie', 'Muhammad', 'Leo', 'Henry', 'Oscar',
        'Archie', 'Ethan', 'Isaac', 'Jacob', 'William', 'Alexander', 'James', 'Lucas', 'Mason', 'Logan',
        'Daniel', 'Sebastian', 'Arthur', 'Adam', 'Dylan', 'Nathan', 'Isaac', 'Kyle', 'Hunter', 'Levi',
        'Ryan', 'Jacob', 'Michael', 'Daniel', 'Logan', 'Jackson', 'Sebastian', 'Jack', 'Owen', 'Dylan',
        'Nathan', 'Isaac', 'Kyle', 'Hunter', 'Levi', 'Ryan', 'Jacob', 'Michael', 'Daniel', 'Logan'
      ],
      // Top 50 female first names in the United Kingdom
      femaleNames: [
        'Olivia', 'Amelia', 'Isla', 'Ava', 'Emily', 'Sophia', 'Grace', 'Lily', 'Freya', 'Chloe',
        'Mia', 'Sophie', 'Isabella', 'Daisy', 'Poppy', 'Evie', 'Rosie', 'Alice', 'Ivy', 'Florence',
        'Sienna', 'Willow', 'Phoebe', 'Elsie', 'Charlotte', 'Zoe', 'Hannah', 'Lily', 'Ellie', 'Lillian',
        'Addison', 'Aubrey', 'Lucy', 'Audrey', 'Bella', 'Savannah', 'Paisley', 'Skylar', 'Violet', 'Claire',
        'Bella', 'Savannah', 'Paisley', 'Skylar', 'Violet', 'Claire', 'Bella', 'Savannah', 'Paisley', 'Skylar'
      ],
      // Top 50 surnames in the United Kingdom
      lastNames: [
        'Smith', 'Jones', 'Williams', 'Taylor', 'Davies', 'Brown', 'Wilson', 'Evans', 'Thomas', 'Roberts',
        'Johnson', 'Lewis', 'Walker', 'Robinson', 'Wood', 'Thompson', 'White', 'Watson', 'Jackson', 'Wright',
        'Green', 'Harris', 'Cooper', 'King', 'Lee', 'Martin', 'Clarke', 'James', 'Morgan', 'Hughes',
        'Edwards', 'Hill', 'Moore', 'Clark', 'Harrison', 'Scott', 'Young', 'Morris', 'Hall', 'Ward',
        'Turner', 'Carter', 'Phillips', 'Mitchell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez'
      ],
      // Top 50 most populous cities in the United Kingdom
      cities: [
        'London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Edinburgh', 'Liverpool', 'Manchester', 'Bristol',
        'Wakefield', 'Cardiff', 'Coventry', 'Nottingham', 'Leicester', 'Sunderland', 'Belfast', 'Newcastle', 'Brighton', 'Hull',
        'Plymouth', 'Stoke-on-Trent', 'Wolverhampton', 'Derby', 'Swansea', 'Southampton', 'Salford', 'Aberdeen', 'Westminster', 'Portsmouth',
        'York', 'Peterborough', 'Bournemouth', 'Southend-on-Sea', 'Middlesbrough', 'Stockton-on-Tees', 'Oxford', 'Cambridge', 'Reading', 'Slough',
        'Blackpool', 'Dudley', 'Northampton', 'Milton Keynes', 'Luton', 'Warrington', 'Preston', 'Norwich', 'Plymouth', 'Worcester'
      ],
      // The four countries of the United Kingdom
      states: [
        'England', 'Scotland', 'Wales', 'Northern Ireland'
      ]
    },
    'Germany': {
      // Top 50 male first names in Germany
      maleNames: [
        'Liam', 'Noah', 'Ben', 'Paul', 'Jonas', 'Felix', 'Leon', 'Luis', 'Maximilian', 'Julian',
        'Elias', 'Lukas', 'Luca', 'Anton', 'Theo', 'Niklas', 'Emil', 'Milan', 'Oskar', 'Moritz',
        'Max', 'Jakob', 'Philipp', 'Tom', 'Alexander', 'David', 'Simon', 'Tim', 'Fabian', 'Finn',
        'Linus', 'Nico', 'Jan', 'Marcel', 'Tobias', 'Kevin', 'Christian', 'Andreas', 'Stefan', 'Michael',
        'Matthias', 'Thomas', 'Frank', 'Wolfgang', 'Klaus', 'Hans', 'Peter', 'Manfred', 'Dieter', 'Günther'
      ],
      // Top 50 female first names in Germany
      femaleNames: [
        'Emma', 'Mia', 'Hannah', 'Lea', 'Leonie', 'Leni', 'Lina', 'Nele', 'Mila', 'Jana',
        'Marie', 'Sophie', 'Lara', 'Nora', 'Ella', 'Maya', 'Clara', 'Luna', 'Lia', 'Anna',
        'Luisa', 'Lena', 'Sarah', 'Lisa', 'Laura', 'Julia', 'Katharina', 'Nina', 'Sandra', 'Petra',
        'Monika', 'Andrea', 'Brigitte', 'Renate', 'Ursula', 'Gisela', 'Helga', 'Ingrid', 'Elke', 'Karin',
        'Sabine', 'Angelika', 'Gabriele', 'Christine', 'Martina', 'Silke', 'Doris', 'Anke', 'Heike', 'Birgit'
      ],
      // Top 50 surnames in Germany
      lastNames: [
        'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
        'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann',
        'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
        'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber',
        'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Möller', 'Weiß', 'Jung', 'Hahn', 'Schubert'
      ],
      // Top 50 most populous cities in Germany
      cities: [
        'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen',
        'Bremen', 'Dresden', 'Hannover', 'Nürnberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster',
        'Karlsruhe', 'Mannheim', 'Augsburg', 'Wiesbaden', 'Gelsenkirchen', 'Mönchengladbach', 'Braunschweig', 'Chemnitz', 'Kiel', 'Aachen',
        'Halle', 'Magdeburg', 'Freiburg', 'Krefeld', 'Lübeck', 'Oberhausen', 'Erfurt', 'Mainz', 'Rostock', 'Kassel',
        'Potsdam', 'Hagen', 'Potsdam', 'Saarbrücken', 'Hamm', 'Mülheim', 'Ludwigshafen', 'Leverkusen', 'Oldenburg', 'Osnabrück'
      ],
      // All 16 German federal states
      states: [
        'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen',
        'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
      ]
    },
    'France': {
      // Top 50 male first names in France
      maleNames: [
        'Liam', 'Hugo', 'Lucas', 'Jules', 'Léo', 'Arthur', 'Adam', 'Louis', 'Raphael', 'Paul',
        'Antoine', 'Victor', 'Gabriel', 'Nathan', 'Ethan', 'Tom', 'Théo', 'Alexandre', 'Maxime', 'Enzo',
        'Baptiste', 'Valentin', 'Evan', 'Nolan', 'Romain', 'Mathis', 'Clément', 'Axel', 'Eliott', 'Jérémy',
        'Pierre', 'François', 'Jean', 'Michel', 'Philippe', 'Alain', 'Patrick', 'Christian', 'Daniel', 'Bernard',
        'André', 'Claude', 'Jacques', 'Marcel', 'Henri', 'Robert', 'Gérard', 'Roger', 'Maurice', 'Georges'
      ],
      // Top 50 female first names in France
      femaleNames: [
        'Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Inès', 'Lola', 'Manon', 'Eva',
        'Camille', 'Sarah', 'Zoé', 'Agathe', 'Clara', 'Léna', 'Nina', 'Julia', 'Lola', 'Emy',
        'Léonie', 'Romane', 'Maëlys', 'Louna', 'Anaïs', 'Léa', 'Sarah', 'Camille', 'Julie', 'Marine',
        'Sophie', 'Céline', 'Isabelle', 'Stéphanie', 'Valérie', 'Sandrine', 'Nathalie', 'Caroline', 'Aurélie', 'Delphine',
        'Catherine', 'Marie', 'Anne', 'Françoise', 'Monique', 'Nicole', 'Danielle', 'Sylvie', 'Martine', 'Brigitte'
      ],
      // Top 50 surnames in France
      lastNames: [
        'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
        'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier',
        'Morel', 'Girard', 'André', 'Lefèvre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez',
        'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas',
        'Perrin', 'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin'
      ],
      // Top 50 most populous cities in France
      cities: [
        'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille',
        'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Angers', 'Grenoble', 'Dijon', 'Nîmes', 'Saint-Denis',
        'Villeurbanne', 'Le Mans', 'Aix-en-Provence', 'Brest', 'Nantes', 'Limoges', 'Clermont-Ferrand', 'Tours', 'Amiens', 'Perpignan',
        'Metz', 'Besançon', 'Boulogne-Billancourt', 'Orléans', 'Mulhouse', 'Rouen', 'Saint-Denis', 'Caen', 'Argenteuil', 'Saint-Paul',
        'Montreuil', 'Nancy', 'Roubaix', 'Tourcoing', 'Nanterre', 'Avignon', 'Vitry-sur-Seine', 'Créteil', 'Dunkerque', 'Poitiers'
      ],
      // All 13 French administrative regions
      states: [
        'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine',
        'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
      ]
    }
  };

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
    return this.countryData[country] || {
      maleNames: [],
      femaleNames: [],
      lastNames: [],
      cities: [],
      states: []
    };
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