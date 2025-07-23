/**
 * Country Data Repository
 * 
 * This file contains static data arrays for different countries including
 * names, cities, and states. This data is used by the UserGenerator to
 * create realistic, country-specific user profiles.
 * 
 * Extracted from UserGenerator.ts to improve maintainability and reduce
 * the size of the generator class.
 */

/**
 * Country-specific data structure
 */
export interface CountryData {
  maleNames: string[];
  femaleNames: string[];
  lastNames: string[];
  cities: string[];
  states: string[];
}

/**
 * Repository of country-specific data
 */
export const COUNTRY_DATA: Record<string, CountryData> = {
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
      'Morris', 'Moore', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott',
      'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner',
      'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers'
    ],
    // Top 50 most populous cities in Canada
    cities: [
      'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener',
      'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor', 'Saskatoon', 'St. Catharines', 'Regina', 'Sherbrooke', 'St. John\'s',
      'Barrie', 'Kelowna', 'Abbotsford', 'Greater Sudbury', 'Kingston', 'Saguenay', 'Trois-Rivieres', 'Guelph', 'Moncton', 'Brantford',
      'Thunder Bay', 'Saint John', 'Peterborough', 'Nanaimo', 'Kamloops', 'Belleville', 'Fredericton', 'Chicoutimi', 'Red Deer', 'Prince George',
      'Medicine Hat', 'Lethbridge', 'Saint-Georges', 'Saint-Hyacinthe', 'Drummondville', 'Grande Prairie', 'Saint-Jean-sur-Richelieu', 'Fort St. John', 'Prince Albert', 'Cornwall'
    ],
    // Canadian provinces and territories
    states: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia',
      'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'
    ]
  },
  'United Kingdom': {
    // Top 50 male first names in the UK
    maleNames: [
      'Oliver', 'Harry', 'Jack', 'George', 'Noah', 'Charlie', 'Jacob', 'Oscar', 'Muhammad', 'Leo',
      'Henry', 'Ethan', 'Alexander', 'Daniel', 'William', 'James', 'Lucas', 'Mason', 'Logan', 'Theo',
      'Isaac', 'Benjamin', 'Sebastian', 'Dylan', 'Archie', 'Tyler', 'Jayden', 'Carter', 'Owen', 'Nathan',
      'Ryan', 'Adam', 'Liam', 'Dylan', 'Connor', 'Caleb', 'Hunter', 'Isaac', 'Jackson', 'Luke',
      'Gavin', 'Isaac', 'Mason', 'Evan', 'Logan', 'Cameron', 'Connor', 'Isaac', 'Nathan', 'Ryan'
    ],
    // Top 50 female first names in the UK
    femaleNames: [
      'Olivia', 'Amelia', 'Isla', 'Ava', 'Emily', 'Sophia', 'Grace', 'Lily', 'Evie', 'Rosie',
      'Isabella', 'Poppy', 'Sophie', 'Charlotte', 'Daisy', 'Alice', 'Florence', 'Eva', 'Sienna', 'Chloe',
      'Phoebe', 'Isabella', 'Layla', 'Esme', 'Willow', 'Ella', 'Scarlett', 'Aria', 'Penelope', 'Luna',
      'Harper', 'Maya', 'Thea', 'Violet', 'Aurora', 'Nova', 'Hannah', 'Lucy', 'Zara', 'Ivy',
      'Freya', 'Mila', 'Lola', 'Ruby', 'Ellie', 'Mia', 'Aria', 'Layla', 'Nora', 'Hazel'
    ],
    // Top 50 surnames in the UK
    lastNames: [
      'Smith', 'Jones', 'Williams', 'Taylor', 'Davies', 'Brown', 'Wilson', 'Evans', 'Thomas', 'Roberts',
      'Johnson', 'Lewis', 'Walker', 'Robinson', 'Wood', 'Thompson', 'White', 'Watson', 'Jackson', 'Wright',
      'Green', 'Harris', 'Cooper', 'King', 'Lee', 'Martin', 'Clarke', 'James', 'Morgan', 'Hughes',
      'Edwards', 'Hill', 'Moore', 'Clark', 'Harrison', 'Scott', 'Young', 'Morris', 'Hall', 'Ward',
      'Turner', 'Carter', 'Phillips', 'Mitchell', 'Patel', 'Adams', 'Campbell', 'Anderson', 'Allen', 'Parker'
    ],
    // Top 50 most populous cities in the UK
    cities: [
      'London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Edinburgh', 'Liverpool', 'Manchester', 'Bristol',
      'Wakefield', 'Cardiff', 'Coventry', 'Nottingham', 'Leicester', 'Sunderland', 'Belfast', 'Newcastle upon Tyne', 'Brighton', 'Hull',
      'Plymouth', 'Stoke-on-Trent', 'Wolverhampton', 'Derby', 'Swansea', 'Southampton', 'Aberdeen', 'Westminster', 'Portsmouth', 'York',
      'Peterborough', 'Dundee', 'Lancaster', 'Oxford', 'Newport', 'Preston', 'St Albans', 'Norwich', 'Chester', 'Cambridge',
      'Salisbury', 'Exeter', 'Gloucester', 'Lisburn', 'Chichester', 'Winchester', 'Londonderry', 'Carlisle', 'Worcester', 'Bath'
    ],
    // UK countries and regions
    states: [
      'England', 'Scotland', 'Wales', 'Northern Ireland',
      'Greater London', 'South East', 'South West', 'West Midlands', 'North West', 'Yorkshire and the Humber',
      'East Midlands', 'East of England', 'North East'
    ]
  },
  'Germany': {
    // Top 50 male first names in Germany
    maleNames: [
      'Liam', 'Noah', 'Elias', 'Felix', 'Paul', 'Leon', 'Lukas', 'Maximilian', 'Julian', 'Jonas',
      'Luis', 'Milan', 'Anton', 'Theo', 'Niklas', 'Emil', 'Oskar', 'Mats', 'Luca', 'Nico',
      'Jakob', 'Philipp', 'Jan', 'David', 'Tom', 'Alexander', 'Simon', 'Tim', 'Fabian', 'Lars',
      'Sven', 'Christian', 'Michael', 'Andreas', 'Stefan', 'Thomas', 'Martin', 'Frank', 'Peter', 'Klaus',
      'Wolfgang', 'Hans', 'Dieter', 'Günther', 'Heinz', 'Werner', 'Helmut', 'Jürgen', 'Manfred', 'Rolf'
    ],
    // Top 50 female first names in Germany
    femaleNames: [
      'Emma', 'Mia', 'Hannah', 'Emilia', 'Sofia', 'Anna', 'Lea', 'Lina', 'Nora', 'Lena',
      'Clara', 'Luisa', 'Ella', 'Mila', 'Leonie', 'Sophie', 'Ida', 'Lilly', 'Lara', 'Maya',
      'Nora', 'Eva', 'Frieda', 'Lotte', 'Pia', 'Jana', 'Lisa', 'Sarah', 'Julia', 'Katharina',
      'Sabine', 'Petra', 'Monika', 'Renate', 'Brigitte', 'Ursula', 'Gisela', 'Helga', 'Inge', 'Erika',
      'Gertrud', 'Elisabeth', 'Maria', 'Margarete', 'Anneliese', 'Irmgard', 'Waltraud', 'Hildegard', 'Edeltraud', 'Rosemarie'
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
      'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt am Main', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen',
      'Bremen', 'Dresden', 'Hannover', 'Nürnberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster',
      'Karlsruhe', 'Mannheim', 'Augsburg', 'Wiesbaden', 'Gelsenkirchen', 'Mönchengladbach', 'Braunschweig', 'Chemnitz', 'Kiel', 'Aachen',
      'Halle', 'Magdeburg', 'Freiburg im Breisgau', 'Krefeld', 'Lübeck', 'Oberhausen', 'Erfurt', 'Mainz', 'Rostock', 'Kassel',
      'Potsdam', 'Hagen', 'Paderborn', 'Saarbrücken', 'Hamm', 'Mülheim an der Ruhr', 'Ludwigshafen am Rhein', 'Leverkusen', 'Oldenburg', 'Osnabrück'
    ],
    // German states (Bundesländer)
    states: [
      'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern',
      'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
    ]
  },
  'France': {
    // Top 50 male first names in France
    maleNames: [
      'Liam', 'Lucas', 'Hugo', 'Jules', 'Léo', 'Adam', 'Louis', 'Arthur', 'Paul', 'Raphaël',
      'Antoine', 'Gabriel', 'Nathan', 'Ethan', 'Tom', 'Théo', 'Evan', 'Axel', 'Enzo', 'Liam',
      'Noah', 'Lucas', 'Hugo', 'Jules', 'Léo', 'Adam', 'Louis', 'Arthur', 'Paul', 'Raphaël',
      'Antoine', 'Gabriel', 'Nathan', 'Ethan', 'Tom', 'Théo', 'Evan', 'Axel', 'Enzo', 'Liam',
      'Noah', 'Lucas', 'Hugo', 'Jules', 'Léo', 'Adam', 'Louis', 'Arthur', 'Paul', 'Raphaël'
    ],
    // Top 50 female first names in France
    femaleNames: [
      'Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Mia', 'Lola', 'Agathe', 'Inès',
      'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Mia', 'Lola', 'Agathe', 'Inès', 'Emma',
      'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Mia', 'Lola', 'Agathe', 'Inès', 'Emma',
      'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Mia', 'Lola', 'Agathe', 'Inès', 'Emma',
      'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Mia', 'Lola', 'Agathe', 'Inès', 'Emma'
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
      'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Angers', 'Grenoble', 'Dijon', 'Saint-Denis', 'Le Mans',
      'Aix-en-Provence', 'Brest', 'Nîmes', 'Limoges', 'Clermont-Ferrand', 'Tours', 'Villeurbanne', 'Amiens', 'Metz', 'Besançon',
      'Perpignan', 'Orléans', 'Rouen', 'Mulhouse', 'Caen', 'Boulogne-Billancourt', 'Nancy', 'Argenteuil', 'Saint-Denis', 'Roubaix',
      'Tourcoing', 'Nanterre', 'Avignon', 'Créteil', 'Poitiers', 'Dunkerque', 'Aubervilliers', 'Versailles', 'Aulnay-sous-Bois', 'Saint-Paul'
    ],
    // French regions
    states: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire', 'Corse', 'Grand Est',
      'Hauts-de-France', 'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
    ]
  }
};

/**
 * Gets country data for a specific country
 * 
 * @param country - Country name
 * @returns CountryData - Country-specific data or default data
 */
export function getCountryData(country: string): CountryData {
  const normalizedCountry = Object.keys(COUNTRY_DATA).find(
    key => key.toLowerCase() === country.toLowerCase()
  );
  
  if (normalizedCountry) {
    return COUNTRY_DATA[normalizedCountry]!;
  }
  
  // Return US data as default if country not found
  console.warn(`⚠️  Country data not found for '${country}'. Using US data as default.`);
  return COUNTRY_DATA['United States']!;
}

/**
 * Gets list of supported countries
 * 
 * @returns string[] - Array of supported country names
 */
export function getSupportedCountries(): string[] {
  return Object.keys(COUNTRY_DATA);
} 