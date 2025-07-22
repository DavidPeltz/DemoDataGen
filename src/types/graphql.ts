/**
 * GraphQL Schema Types for Demo Data Generator
 * 
 * This file contains TypeScript interfaces that define the structure
 * of GraphQL schemas and how they map to generated data fields.
 * These interfaces enable automatic data generation based on CDP schema definitions.
 */

/**
 * GraphQL Type Definition
 * 
 * Represents a GraphQL type definition from a schema file.
 * This includes both object types and scalar types used in the CDP.
 */
export interface GraphQLType {
  /** Name of the GraphQL type */
  name: string;
  /** Kind of GraphQL type (OBJECT, SCALAR, ENUM, etc.) */
  kind: 'OBJECT' | 'SCALAR' | 'ENUM' | 'INPUT_OBJECT' | 'INTERFACE' | 'UNION';
  /** Description of the type */
  description?: string;
  /** Fields for object types */
  fields?: GraphQLField[];
  /** Enum values for enum types */
  enumValues?: GraphQLEnumValue[];
  /** Interfaces this type implements */
  interfaces?: GraphQLType[];
}

/**
 * GraphQL Field Definition
 * 
 * Represents a field within a GraphQL object type.
 * This defines the structure and type of data that should be generated.
 */
export interface GraphQLField {
  /** Name of the field */
  name: string;
  /** Description of the field */
  description?: string;
  /** Type of the field */
  type: GraphQLFieldType;
  /** Whether the field is required (non-nullable) */
  isRequired: boolean;
  /** Whether the field is an array */
  isArray: boolean;
  /** Arguments for the field (if any) */
  args?: GraphQLArgument[];
  /** Custom directives that might affect data generation */
  directives?: GraphQLDirective[];
}

/**
 * GraphQL Field Type
 * 
 * Represents the type of a GraphQL field, including nested types.
 */
export interface GraphQLFieldType {
  /** Name of the type */
  name: string;
  /** Kind of the type */
  kind: 'OBJECT' | 'SCALAR' | 'ENUM' | 'INPUT_OBJECT' | 'INTERFACE' | 'UNION' | 'LIST' | 'NON_NULL';
  /** Nested type (for LIST and NON_NULL types) */
  ofType?: GraphQLFieldType;
}

/**
 * GraphQL Argument Definition
 * 
 * Represents an argument for a GraphQL field.
 */
export interface GraphQLArgument {
  /** Name of the argument */
  name: string;
  /** Description of the argument */
  description?: string;
  /** Type of the argument */
  type: GraphQLFieldType;
  /** Default value for the argument */
  defaultValue?: string;
}

/**
 * GraphQL Directive
 * 
 * Represents a GraphQL directive that might affect data generation.
 */
export interface GraphQLDirective {
  /** Name of the directive */
  name: string;
  /** Arguments for the directive */
  args?: GraphQLDirectiveArgument[];
}

/**
 * GraphQL Directive Argument
 * 
 * Represents an argument for a GraphQL directive.
 */
export interface GraphQLDirectiveArgument {
  /** Name of the argument */
  name: string;
  /** Value of the argument */
  value: string;
}

/**
 * GraphQL Enum Value
 * 
 * Represents a value in a GraphQL enum type.
 */
export interface GraphQLEnumValue {
  /** Name of the enum value */
  name: string;
  /** Description of the enum value */
  description?: string;
  /** Whether this value is deprecated */
  isDeprecated?: boolean;
  /** Deprecation reason if deprecated */
  deprecationReason?: string;
}

/**
 * GraphQL Schema
 * 
 * Complete GraphQL schema definition containing all types.
 */
export interface GraphQLSchema {
  /** Query type definition */
  queryType?: GraphQLType;
  /** Mutation type definition */
  mutationType?: GraphQLType;
  /** Subscription type definition */
  subscriptionType?: GraphQLType;
  /** All types in the schema */
  types: GraphQLType[];
  /** Directives defined in the schema */
  directives?: GraphQLDirective[];
}

/**
 * Data Generation Field Mapping
 * 
 * Maps GraphQL fields to data generation strategies.
 */
export interface DataFieldMapping {
  /** GraphQL field name */
  fieldName: string;
  /** GraphQL type name */
  typeName: string;
  /** Data generation strategy */
  strategy: DataGenerationStrategy;
  /** Custom configuration for the strategy */
  config?: Record<string, any>;
}

/**
 * Data Generation Strategy
 * 
 * Defines how to generate data for a specific field type.
 */
export type DataGenerationStrategy = 
  | 'uuid'                    // Generate UUID
  | 'email'                   // Generate email address
  | 'firstName'               // Generate first name
  | 'lastName'                // Generate last name
  | 'fullName'                // Generate full name
  | 'phone'                   // Generate phone number
  | 'address'                 // Generate address
  | 'city'                    // Generate city
  | 'state'                   // Generate state/region
  | 'country'                 // Generate country
  | 'zipCode'                 // Generate zip/postal code
  | 'company'                 // Generate company name
  | 'jobTitle'                // Generate job title
  | 'date'                    // Generate date
  | 'datetime'                // Generate datetime
  | 'timestamp'               // Generate timestamp
  | 'boolean'                 // Generate boolean
  | 'integer'                 // Generate integer
  | 'float'                   // Generate float
  | 'string'                  // Generate string
  | 'enum'                    // Generate enum value
  | 'url'                     // Generate URL
  | 'ipAddress'               // Generate IP address
  | 'userAgent'               // Generate user agent
  | 'deviceType'              // Generate device type
  | 'browser'                 // Generate browser
  | 'operatingSystem'         // Generate OS
  | 'productName'             // Generate product name
  | 'productDescription'      // Generate product description
  | 'price'                   // Generate price
  | 'category'                // Generate category
  | 'tags'                    // Generate tags
  | 'quantity'                // Generate quantity
  | 'rating'                  // Generate rating
  | 'review'                  // Generate review text
  | 'searchQuery'             // Generate search query
  | 'paymentMethod'           // Generate payment method
  | 'orderStatus'             // Generate order status
  | 'custom';                 // Custom generation strategy

/**
 * GraphQL Schema Parser Result
 * 
 * Result of parsing a GraphQL schema file.
 */
export interface SchemaParseResult {
  /** Parsed GraphQL schema */
  schema: GraphQLSchema;
  /** Data field mappings for generation */
  fieldMappings: DataFieldMapping[];
  /** Errors encountered during parsing */
  errors: string[];
  /** Warnings encountered during parsing */
  warnings: string[];
}

/**
 * Default Field Mappings
 * 
 * Common field name patterns and their corresponding generation strategies.
 */
export const DEFAULT_FIELD_MAPPINGS: Record<string, DataGenerationStrategy> = {
  // User-related fields
  'id': 'uuid',
  'userId': 'uuid',
  'email': 'email',
  'firstName': 'firstName',
  'lastName': 'lastName',
  'fullName': 'fullName',
  'phone': 'phone',
  'phoneNumber': 'phone',
  'mobile': 'phone',
  
  // Address-related fields
  'address': 'address',
  'street': 'string',
  'city': 'city',
  'state': 'state',
  'country': 'country',
  'zipCode': 'zipCode',
  'postalCode': 'zipCode',
  'zip': 'zipCode',
  
  // Company-related fields
  'company': 'company',
  'companyName': 'company',
  'organization': 'company',
  'jobTitle': 'jobTitle',
  'title': 'jobTitle',
  'position': 'jobTitle',
  
  // Date/time fields
  'date': 'date',
  'createdAt': 'datetime',
  'updatedAt': 'datetime',
  'timestamp': 'timestamp',
  'birthDate': 'date',
  'birthday': 'date',
  
  // Product-related fields
  'productId': 'uuid',
  'productName': 'productName',
  'description': 'productDescription',
  'price': 'price',
  'cost': 'price',
  'category': 'category',
  'tags': 'tags',
  'quantity': 'quantity',
  'stock': 'integer',
  
  // Event-related fields
  'eventId': 'uuid',
  'eventType': 'string',
  'pageUrl': 'url',
  'url': 'url',
  'userAgent': 'userAgent',
  'ipAddress': 'ipAddress',
  'deviceType': 'deviceType',
  'browser': 'browser',
  'operatingSystem': 'operatingSystem',
  'os': 'operatingSystem',
  'sessionId': 'uuid',
  'referrer': 'url',
  
  // Review/rating fields
  'rating': 'rating',
  'review': 'review',
  'comment': 'review',
  'feedback': 'review',
  
  // Order/transaction fields
  'orderId': 'uuid',
  'transactionId': 'uuid',
  'paymentMethod': 'paymentMethod',
  'status': 'orderStatus',
  'orderStatus': 'orderStatus',
  
  // Search fields
  'query': 'searchQuery',
  'searchQuery': 'searchQuery',
  'keywords': 'searchQuery',
  
  // Boolean fields
  'isActive': 'boolean',
  'active': 'boolean',
  'enabled': 'boolean',
  'verified': 'boolean',
  'confirmed': 'boolean',
  'inStock': 'boolean',
  'available': 'boolean',
  
  // Numeric fields
  'count': 'integer',
  'total': 'float',
  'amount': 'float',
  'value': 'float',
  'score': 'float',
  'percentage': 'float',
}; 