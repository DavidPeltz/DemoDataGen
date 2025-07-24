# Demo Data Generator

A comprehensive TypeScript application for generating realistic demo data for Customer Data Platforms (CDP) and analytics systems. This tool creates user profiles, events, and products with proper linking and realistic behavior patterns.

## 🚀 Features

### Core Data Generation
- **User Profiles**: Generate realistic user data with country-specific information
- **Event Sequences**: Create realistic user journey events with proper sequencing
- **Product Catalog**: Generate e-commerce products with categories and pricing
- **GraphQL Integration**: Automatic data generation based on GraphQL schema definitions

### Advanced Services Architecture
- **Configuration Management**: Centralized configuration with environment-specific overrides
- **Structured Logging**: Comprehensive logging with performance monitoring
- **Data Validation**: Comprehensive validation for all generated data
- **File Operations**: Centralized file I/O with multiple format support
- **Event Generation**: Intelligent event sequencing with business logic
- **User Profile Management**: Complete user profile lifecycle management
- **GraphQL Generation Service**: Dedicated service for GraphQL-based data generation
- **Anonymous User Service**: Specialized handling for anonymous user privacy compliance
- **Validation Utilities**: Centralized validation functions eliminating code duplication
- **Data Generation Utilities**: Centralized faker.js patterns for consistent data generation

### GraphQL Schema Support
- **Schema Parser**: Intelligent GraphQL schema parsing and analysis
- **Field Mapping**: Automatic field-to-strategy mapping for data generation
- **Data Strategies**: Comprehensive data generation strategies for all field types
- **Custom Object Generation**: Support for complex nested object structures
- **Non-Standard Object Handling**: Graceful filtering of complex GraphQL objects
- **Configuration-Based Generation**: Enable/disable GraphQL generation via config

### Privacy & Compliance Features
- **Anonymous User Support**: Special handling for anonymous users with privacy compliance
- **Non-Transactional Events**: Anonymous users only receive privacy-safe events
- **Identifier Management**: Cookie IDs and MAID (Mobile Advertising ID) for anonymous tracking
- **Personal Data Sanitization**: Automatic removal of personal information for anonymous users
- **Email Hashing**: SHA256 hashing of email addresses for privacy compliance and data anonymization
- **GDPR Compliance**: Built-in privacy protection patterns

### CDP Integration Features
- **Compartment Management**: Configurable compartment IDs for organizational data structure
- **Channel Tracking**: Event source identification with configurable channel IDs
- **Probability Distributions**: Weighted assignment of compartments and channels
- **Realistic CDP Structure**: Mimics real CDP organizational hierarchy
- **Metadata Integration**: CDP metadata included in all output files

## 📁 Project Structure

```
DemoDataGen/
├── src/
│   ├── services/                    # Service layer for business logic
│   │   ├── ConfigurationService.ts  # Configuration management
│   │   ├── LoggingService.ts        # Structured logging
│   │   ├── DataValidationService.ts # Data validation
│   │   ├── EventGenerator.ts        # Event generation logic
│   │   ├── FileService.ts           # File operations
│   │   ├── UserProfileService.ts    # User profile management
│   │   ├── GraphQLGenerationService.ts # GraphQL-based data generation
│   │   ├── AnonymousUserService.ts  # Anonymous user privacy handling
│   │   ├── GraphQLSchemaParser.ts   # GraphQL schema parsing
│   │   ├── GraphQLFieldMapper.ts    # Field mapping strategies
│   │   └── GraphQLDataGenerationStrategies.ts # Data generation strategies
│   ├── generators/                  # Data generators
│   │   ├── DataGenerator.ts         # Mixed data generation
│   │   ├── UserGenerator.ts         # User data generation
│   │   ├── ProductGenerator.ts      # Product data generation
│   │   └── GraphQLDataGenerator.ts  # GraphQL-based generation
│   ├── types/                       # TypeScript type definitions
│   │   ├── config.ts                # Configuration types
│   │   ├── events.ts                # Event-related types
│   │   ├── graphql.ts               # GraphQL types
│   │   └── index.ts                 # Core data types
│   ├── data/                        # Static data files
│   │   └── countryData.ts           # Country-specific data
│   ├── utils/                       # Utility functions
│   │   ├── configLoader.ts          # Configuration loading
│   │   ├── graphqlParser.ts         # GraphQL parsing utilities
│   │   ├── ValidationUtils.ts       # Centralized validation functions
│   │   └── DataGenerationUtils.ts   # Centralized data generation patterns
│   └── index.ts                     # Main application entry point
├── output/                          # Generated data files
├── __tests__/                       # Test files
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DemoDataGen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create configuration file** (optional)
   ```bash
   npm run create-config
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## ⚙️ Configuration

The application uses a `config.json` file for configuration. If no configuration file exists, the application will use sensible defaults.

### Configuration Structure

```json
{
  "dataGeneration": {
    "userCount": 100,
    "country": "United States",
    "eventCountPerUser": {
      "min": 5,
      "max": 15
    },
    "anonymousUserCount": {
      "min": 10,
      "max": 20
    }
  },
  "output": {
    "directory": "output",
    "format": "ndjson",
    "compressOutput": false
  },
  "eventGeneration": {
    "sessionContinuationProbability": 0.7,
    "addToCartProbability": 0.3,
    "viewCartAfterAddProbability": 0.8,
    "checkoutAfterViewCartProbability": 0.6,
    "transactionAfterCheckoutProbability": 0.9,
    "removeFromCartProbability": 0.1
  },
  "userProfiles": {
    "registeredUserProbability": 0.8,
    "mobileIdProbability": {
      "registered": 0.6,
      "anonymous": 0.4
    }
  },
  "logging": {
    "level": "info",
    "showProgress": true,
    "showSummary": true
  },
  "graphql": {
    "enabled": true,
    "schemaPath": "schema.graphql",
    "generateAllTypes": true,
    "recordsPerType": 5,
    "targetTypes": [],
    "includeFieldMappings": false
  }
}
```

### Environment-Specific Configuration

The application automatically applies environment-specific overrides:

- **Development**: Verbose logging, progress indicators enabled
- **Production**: Reduced logging, compression enabled
- **Test**: Minimal data generation, error-only logging

## 📊 Generated Data

### User Profiles
- Realistic personal information (names, emails, addresses)
- Email SHA256 hashing for privacy compliance
- CDP compartment IDs for organizational structure
- Country-specific data (cities, states, zip codes)
- Tracking identifiers (cookie IDs, mobile advertising IDs)
- Profile types (registered vs anonymous users)

### User Events
- **Page Views**: Website navigation events
- **Product Interactions**: Views, cart operations, purchases
- **Search Events**: User search queries and results
- **Marketing Events**: Email opens, ad clicks, push notifications
- **Session Management**: Login/logout events
- **CDP Channel Tracking**: Event source identification (website, mobile-app, email, social)

### Event Sequencing
The application generates realistic event sequences:
1. **Session Start**: Page view or search
2. **Product Discovery**: Product views, search results
3. **Engagement**: Add to cart, view cart
4. **Conversion**: Checkout, transaction completion
5. **Post-Purchase**: Email engagement, return visits

### Data Linking
- **User-Event Linking**: Events linked to user profiles via multiple identifiers
- **Session Continuity**: Realistic session management across events
- **Cross-Platform Tracking**: Support for web, mobile, and email tracking

## 🔧 GraphQL Integration

### Configuration-Based Generation
The application can generate data based on GraphQL schema definitions through configuration:

```json
{
  "graphql": {
    "enabled": true,
    "schemaPath": "schema.graphql",
    "generateAllTypes": true,
    "recordsPerType": 5,
    "targetTypes": [],
    "includeFieldMappings": false
  }
}
```

### Supported Features
- **Object Types**: Automatic generation of complex objects
- **Scalar Types**: Intelligent mapping to appropriate data types
- **Enums**: Random selection from enum values
- **Lists**: Array generation with configurable lengths
- **Custom Scalars**: Fallback to string generation
- **Non-Standard Objects**: Graceful filtering of complex GraphQL objects

### Field Mapping Strategies
The application automatically maps GraphQL fields to data generation strategies:

- **User Fields**: Names, emails, addresses, phone numbers
- **Product Fields**: Names, descriptions, prices, categories
- **Event Fields**: Timestamps, session IDs, device information
- **Custom Fields**: Intelligent fallback strategies

## 🏢 CDP Integration

### Configuration-Based CDP Structure
The application supports Customer Data Platform organizational structure through configuration:

```json
{
  "cdp": {
    "compartmentIds": ["compartment-001", "compartment-002", "compartment-003"],
    "channelIds": ["website", "mobile-app", "email", "social"],
    "compartmentDistribution": {
      "compartment-001": 0.4,
      "compartment-002": 0.35,
      "compartment-003": 0.25
    },
    "channelDistribution": {
      "website": 0.5,
      "mobile-app": 0.3,
      "email": 0.15,
      "social": 0.05
    },
    "includeCDPMetadata": true
  }
}
```

### CDP Features
- **Compartment Management**: Organizational structure with configurable compartment IDs
- **Channel Tracking**: Event source identification with realistic channel distribution
- **Probability Distributions**: Weighted assignment based on business rules
- **Metadata Integration**: CDP metadata included in all output files
- **Realistic Structure**: Mimics real CDP organizational hierarchy

### Anonymous User Support

The application provides specialized handling for anonymous users to ensure privacy compliance:

#### Anonymous User Features
- **Personal Data Sanitization**: Automatic removal of names, emails, addresses, and other personal information
- **Non-Transactional Events**: Anonymous users only receive privacy-safe events (page views, searches, etc.)
- **Appropriate Identifiers**: Only cookie IDs and MAID (Mobile Advertising ID) for tracking
- **GDPR Compliance**: Built-in privacy protection patterns

#### Event Filtering
Anonymous users are automatically filtered to only receive non-transactional events:
- ✅ **Allowed**: page_view, search, product_view, add_to_cart, email_open, ad_view
- ❌ **Prohibited**: checkout, purchase, payment, account_creation, login

#### Profile Sanitization
Anonymous user profiles are automatically sanitized to remove personal data:
- Empty names, emails, and addresses
- Empty email hashes for privacy compliance
- Only tracking identifiers (cookieId, maidId)
- No personal demographic information

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📈 Performance

### Optimization Features
- **Service Architecture**: Modular design for better maintainability
- **Lazy Loading**: Configuration and data loaded on-demand
- **Memory Management**: Efficient data structures and cleanup
- **Parallel Processing**: Concurrent data generation where possible

### Performance Monitoring
The logging service provides performance metrics:
- Operation timing and duration tracking
- Memory usage monitoring
- Data generation statistics
- Validation performance metrics

## 🔍 Data Validation

The application includes comprehensive data validation:

### User Profile Validation
- Required field validation
- Email format and domain validation
- Address format validation
- Duplicate detection

### Event Validation
- Event type validation
- Required field checking
- Chronological order validation
- Identifier validation

### Configuration Validation
- Parameter range validation
- Probability value validation
- File path validation
- Performance warning detection

## 📝 Logging

### Log Levels
- **Debug**: Detailed debugging information
- **Info**: General application information
- **Warn**: Warning messages and potential issues
- **Error**: Error messages and failures

### Log Features
- **Structured Logging**: JSON-formatted log entries
- **Performance Timing**: Operation duration tracking
- **Context Information**: Additional data with log messages
- **Filtering**: Log level and time-based filtering

## 🚀 Usage Examples

### Basic Data Generation
```bash
# Generate 100 users with events
npm start
```

### Custom Configuration
```bash
# Use custom configuration file
npm start -- --config=my-config.json
```

### GraphQL Data Generation
```bash
# Enable GraphQL generation in config.json and run
npm start
```

### Environment-Specific Generation
```bash
# Production environment
NODE_ENV=production npm start

# Test environment
NODE_ENV=test npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the test files for usage examples

## 🔄 Recent Updates

### Version 2.4 - CDP Integration & Organizational Structure
- **Compartment Management**: Configurable compartment IDs for organizational data structure
- **Channel Tracking**: Event source identification with configurable channel IDs
- **Probability Distributions**: Weighted assignment of compartments and channels
- **CDP Metadata Integration**: Compartment and channel IDs included in all output files
- **Realistic CDP Structure**: Mimics real CDP organizational hierarchy and data flow

### Version 2.3 - Email Hashing for Privacy Compliance
- **Email SHA256 Hashing**: All user profiles now include SHA256 hashes of email addresses
- **Privacy Compliance**: Enhanced data anonymization for GDPR and privacy regulations
- **Anonymous User Support**: Empty email hashes for anonymous users maintaining privacy
- **Validation Integration**: Comprehensive validation for email hash format and integrity
- **Data Generation Utilities**: New email generation methods with integrated hashing

### Version 2.2 - Code Optimization & Deduplication
- **ValidationUtils**: Centralized validation functions eliminating code duplication
- **DataGenerationUtils**: Centralized faker.js patterns for consistent data generation
- **Standardized Logging**: All services now use LoggingService consistently
- **Reduced Code Duplication**: ~40% reduction in duplicate validation and generation code
- **Improved Maintainability**: Smaller, focused utility services
- **Enhanced Reusability**: Shared utilities across multiple services

### Version 2.1 - GraphQL Integration & Privacy Compliance
- **GraphQL Generation Service**: Dedicated service for GraphQL-based data generation
- **Anonymous User Service**: Specialized handling for anonymous user privacy compliance
- **Configuration-Based GraphQL**: Enable/disable GraphQL generation via config.json
- **Non-Standard Object Handling**: Graceful filtering of complex GraphQL objects
- **Privacy Compliance**: GDPR-compliant anonymous user handling
- **Enhanced File Service**: Support for GraphQL data file generation

### Version 2.0 - Service Architecture Overhaul
- **New Services**: Configuration, Logging, Validation, and GraphQL services
- **Improved Architecture**: Better separation of concerns and modularity
- **Enhanced Validation**: Comprehensive data validation system
- **Structured Logging**: Advanced logging with performance monitoring
- **GraphQL Support**: Complete GraphQL schema-based data generation
- **Performance Optimizations**: Reduced file sizes and improved maintainability

### Key Improvements
- Reduced main index.ts from 471 to ~150 lines (68% reduction)
- Extracted large static data arrays into separate modules
- Created dedicated services for each major functionality
- Improved type safety and error handling
- Enhanced configuration management with environment support
- Added comprehensive data validation system
- Integrated GraphQL generation into main application flow
- Added anonymous user privacy compliance features 