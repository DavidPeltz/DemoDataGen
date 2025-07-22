# Demo Data Generator

A TypeScript program for generating realistic demo data for testing and development purposes.

## Features

- **User Generation**: Generate fake user profiles with names, emails, addresses, and contact information
- **Product Generation**: Create fake products with names, descriptions, prices, categories, and tags
- **Mixed Data Generation**: Generate various types of data including users, products, orders, and reviews
- **Interactive Country Selection**: Choose the country for data generation with support for country names and codes
- **Interactive User Count**: Specify the number of users to generate (with smart defaults)
- **Country-Specific Names**: Uses top 50 first names and surnames for selected countries (US, Canada, UK, Germany, France)
- **Country-Appropriate Addresses**: Generates realistic cities and states/regions for each country
- **Gender Distribution**: Automatically generates 53% female and 47% male users
- **Anonymous Events**: Generates anonymous user events without personal information
- **File Output**: Saves data to newline-delimited JSON files for easy processing
- **ID Linking**: Links users and events through cookie IDs and MAID IDs for analytics
- **Custom Email Domain**: All generated users use the mediarithmics.com email domain
- **Logical Event Sequencing**: Events follow realistic user journeys with business logic constraints
- **High Event Volume**: Each user generates 10-20 events for comprehensive testing
- **TypeScript**: Fully typed with modern TypeScript features
- **Faker.js Integration**: Uses the popular Faker.js library for realistic data generation

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DemoDataGen
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Interactive Mode
The program will prompt you for two inputs:

1. **Country Selection**: Enter a country for data generation
2. **User Count**: Specify how many users to generate

```bash
npm run dev
```

#### Country Input
You can enter either:
- **Country name**: "United States", "Canada", "Germany", etc.
- **Country code**: "US", "CA", "DE", etc.

#### User Count Input
- **Valid number**: Any positive integer (e.g., "50", "100", "1000")
- **Invalid input**: Program defaults to 20 users
- **Empty input**: Program defaults to 20 users

Example interaction:
```
🌍 Enter country (name or 2-character code): US
📍 Generating data for country: US

👥 Enter number of users to generate (default: 20): 50
👥 Generating 50 users...
```

### Development Mode
Run the program in development mode with hot reloading:
```bash
npm run dev
```

### Production Build
Build the TypeScript code to JavaScript:
```bash
npm run build
```

### Run Production Build
Run the compiled JavaScript:
```bash
npm start
```

### Watch Mode
Watch for file changes and rebuild automatically:
```bash
npm run watch
```

### Testing
Run the test suite:
```bash
npm test
```

## Project Structure

```
src/
├── index.ts              # Main entry point
├── types/
│   └── index.ts          # TypeScript type definitions
└── generators/
    ├── UserGenerator.ts   # User data generation
    ├── ProductGenerator.ts # Product data generation
    └── DataGenerator.ts   # Mixed data generation
```

## API Reference

### UserGenerator

```typescript
const userGenerator = new UserGenerator();

// Generate a single user
const user = userGenerator.generateUser();

// Generate multiple users
const users = userGenerator.generateUsers(10);

// Generate users for a specific country
const usersForCountry = userGenerator.generateUsersForCountry(10, 'US');

// Generate users with specific criteria
const usersWithCriteria = userGenerator.generateUsersWithCriteria(
  { firstName: 'John' }, 
  5
);
```

### ProductGenerator

```typescript
const productGenerator = new ProductGenerator();

// Generate a single product
const product = productGenerator.generateProduct();

// Generate multiple products
const products = productGenerator.generateProducts(10);

// Generate products by category
const electronics = productGenerator.generateProductsByCategory('Electronics', 5);

// Generate products within price range
const affordableProducts = productGenerator.generateProductsByPriceRange(10, 100, 10);
```

### DataGenerator

```typescript
const dataGenerator = new DataGenerator();

// Generate mixed data
const mixedData = dataGenerator.generateMixedData(20);

// Generate data of specific type
const users = dataGenerator.generateDataByType('user', 10);
const products = dataGenerator.generateDataByType('product', 10);
const orders = dataGenerator.generateDataByType('order', 10);
const reviews = dataGenerator.generateDataByType('review', 10);
```

## Data Types

### User
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;  // Optional - not currently generated
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  tags: string[];
  createdAt: Date;
}
```

### MixedDataItem
```typescript
interface MixedDataItem {
  id: string;
  type: 'user' | 'product' | 'order' | 'review' | 'anonymous_event';
  description: string;
  data: User | Product | Record<string, unknown>;
  createdAt: Date;
}
```

## Supported Countries

The program includes country-specific name data for the following countries:

### 🇺🇸 United States (US/USA)
- **First Names**: James, Mary, John, Patricia, Robert, Jennifer, Michael, Linda, William, Elizabeth, etc.
- **Last Names**: Smith, Johnson, Williams, Brown, Jones, Garcia, Miller, Davis, Rodriguez, Martinez, etc.

### 🇨🇦 Canada (CA)
- **First Names**: Liam, Emma, Noah, Olivia, Oliver, Ava, William, Isabella, James, Sophia, etc.
- **Last Names**: Smith, Brown, Tremblay, Martin, Roy, Gagnon, Lee, Wilson, Johnson, MacDonald, etc.

### 🇬🇧 United Kingdom (UK/GB)
- **First Names**: Oliver, Olivia, Harry, Amelia, George, Isla, Noah, Ava, Jack, Emily, etc.
- **Last Names**: Smith, Jones, Williams, Taylor, Davies, Brown, Wilson, Evans, Thomas, Roberts, etc.

### 🇩🇪 Germany (DE)
- **First Names**: Liam, Emma, Noah, Mia, Ben, Hannah, Paul, Lea, Jonas, Leonie, etc.
- **Last Names**: Müller, Schmidt, Schneider, Fischer, Weber, Meyer, Wagner, Becker, Schulz, Hoffmann, etc.

### 🇫🇷 France (FR)
- **First Names**: Liam, Emma, Hugo, Jade, Lucas, Louise, Jules, Alice, Léo, Chloé, etc.
- **Last Names**: Martin, Bernard, Dubois, Thomas, Robert, Richard, Petit, Durand, Leroy, Moreau, etc.

For countries not in this list, the program falls back to faker.js default names.

## Data Types

### Event Types
The program generates user events with comprehensive event types covering various user interactions:

```typescript
type EventType = 
  | 'page_view'           // User viewed a page
  | 'search'              // User performed a search
  | 'article_view'        // User viewed an article
  | 'video_view'          // User viewed a video
  | 'audio_listen'        // User listened to audio content
  | 'ad_view'             // User viewed an advertisement
  | 'ad_click'            // User clicked on an advertisement
  | 'email_open'          // User opened an email
  | 'email_click'         // User clicked a link in an email
  | 'add_itemToCart'      // User added item to shopping cart
  | 'remove_itemFromCart' // User removed item from shopping cart
  | 'transaction_complete' // User completed a transaction
  | 'checkout'            // User initiated checkout process
  | 'view_cart'           // User viewed shopping cart
  | 'richpush_open'       // User opened a rich push notification
  | 'richpush_click';     // User clicked on a rich push notification
```

### Event Sequencing Logic
The program generates realistic user journeys with proper event sequencing and business logic:

#### Logical Constraints
- **Transaction Flow**: `transaction_complete` events only occur after `add_itemToCart` and `checkout` events
- **Cart Management**: `view_cart` events typically follow `add_itemToCart` events
- **Checkout Process**: `checkout` events follow `view_cart` events
- **Session Management**: Events are grouped into logical sessions with consistent session IDs
- **Event Count**: Each user (registered or anonymous) generates 10-20 events

#### Event Sequences
The generator creates realistic user journeys such as:
1. `page_view` → `search` → `page_view` → `add_itemToCart` → `view_cart` → `checkout` → `transaction_complete`
2. `page_view` → `article_view` → `video_view` → `ad_view` → `ad_click` → `add_itemToCart` → `view_cart`
3. `email_open` → `email_click` → `page_view` → `search` → `add_itemToCart` → `remove_itemFromCart`

### Anonymous Events
The program generates anonymous user events that don't contain personal information:

```typescript
interface AnonymousEvent {
  id: string;
  eventType: EventType;   // Uses the comprehensive event type list above
  pageUrl: string;
  userAgent: string;
  ipAddress: string;
  timestamp: Date;
  sessionId: string;
  referrer?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: 'Chrome' | 'Firefox' | 'Safari' | 'Edge';
  os: 'Windows' | 'macOS' | 'Linux' | 'iOS' | 'Android';
  // Context-specific data based on event type
  productId?: string;           // For add_itemToCart, remove_itemFromCart
  productName?: string;         // For add_itemToCart, remove_itemFromCart
  quantity?: number;            // For add_itemToCart, remove_itemFromCart
  price?: number;               // For add_itemToCart
  itemCount?: number;           // For view_cart, checkout
  totalValue?: number;          // For view_cart, checkout, transaction_complete
  paymentMethod?: string;       // For checkout, transaction_complete
  orderId?: string;             // For transaction_complete
  shippingAddress?: string;     // For transaction_complete
  query?: string;               // For search
  resultsCount?: number;        // For search
  emailId?: string;             // For email_open, email_click
  subject?: string;             // For email_open
  campaignId?: string;          // For email_open
  linkUrl?: string;             // For email_click
  linkText?: string;            // For email_click
  notificationId?: string;      // For richpush_open, richpush_click
  title?: string;               // For richpush_open
  body?: string;                // For richpush_open
  action?: string;              // For richpush_click
}
```

### Gender Distribution
Users are automatically generated with a 53% female and 47% male distribution, using gender-appropriate names for each country.

### Country-Appropriate Addresses
The program generates realistic addresses with country-specific cities and states/regions:

- **United States**: 50 major cities (New York, Los Angeles, Chicago, etc.) and all 50 states
- **Canada**: 50 major cities (Toronto, Montreal, Vancouver, etc.) and all 13 provinces/territories
- **United Kingdom**: 50 major cities (London, Birmingham, Leeds, etc.) and 4 countries
- **Germany**: 50 major cities (Berlin, Hamburg, München, etc.) and all 16 federal states
- **France**: 50 major cities (Paris, Marseille, Lyon, etc.) and all 13 administrative regions

For countries not in this list, the program falls back to faker.js default locations.

### File Output
The program generates two newline-delimited JSON files:

1. **User Profiles** (`user_profiles_{country}.ndjson`): Contains user information with linking IDs
2. **User Events** (`user_events_{country}.ndjson`): Contains event data with timestamps from the last 30 days

#### User Profile Structure
```typescript
interface UserProfile extends User {
  profileType: 'registered' | 'anonymous';
  cookieId: string;        // Web tracking ID
  maidId?: string;         // Mobile app tracking ID
}
```

#### User Event Structure
```typescript
interface UserEvent {
  id: string;
  userId?: string;         // For known users
  cookieId?: string;       // For anonymous web users
  maidId?: string;         // For anonymous mobile app users
  eventType: EventType;    // Comprehensive list of event types (see Event Types section above)
  eventData: Record<string, unknown>;
  timestamp: Date;         // Within last 30 days
  country: string;
}
```

#### ID Linking
- **Registered Users**: Events include both `userId` and `cookieId` for complete tracking
- **Anonymous Users**: Events include `cookieId` (web) and/or `maidId` (mobile) for cross-device tracking
- **Anonymous Events**: Events with only `cookieId`/`maidId` for users without profiles

#### Output Directory
Files are saved to the `output/` directory with country-specific naming:
```
output/
├── user_profiles_us.ndjson
├── user_events_us.ndjson
├── user_profiles_germany.ndjson
├── user_events_germany.ndjson
└── ...
```

## Configuration

The project uses TypeScript with strict type checking enabled. Key configuration files:

- `tsconfig.json`: TypeScript compiler configuration
- `package.json`: Project dependencies and scripts
- `jest.config.js`: Testing configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 