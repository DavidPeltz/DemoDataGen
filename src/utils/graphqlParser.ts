/**
 * Enhanced GraphQL Schema Parser for Demo Data Generator
 * 
 * This module parses GraphQL schema files and extracts field definitions
 * to automatically generate appropriate data fields for the CDP.
 * 
 * Enhanced Features:
 * - Improved array type detection for complex types like [UserEvent!]!
 * - Better field parsing with multiline support
 * - Robust enum value extraction
 * - Enhanced error handling and validation
 */

import * as fs from 'fs';
import { 
  GraphQLSchema, 
  GraphQLType, 
  GraphQLField, 
  GraphQLFieldType, 
  GraphQLEnumValue,
  DataFieldMapping,
  DataGenerationStrategy,
  SchemaParseResult,
  DEFAULT_FIELD_MAPPINGS
} from '../types/graphql';

/**
 * Parses a GraphQL schema file and extracts field mappings for data generation
 * 
 * This function reads a GraphQL schema file (either .graphql or .gql format)
 * and parses it to extract object types and their fields. It then maps these
 * fields to appropriate data generation strategies based on field names and types.
 * 
 * @param schemaPath - Path to the GraphQL schema file
 * @returns SchemaParseResult - Parsed schema with field mappings and any errors/warnings
 */
export function parseGraphQLSchema(schemaPath: string): SchemaParseResult {
  const result: SchemaParseResult = {
    schema: { types: [] },
    fieldMappings: [],
    errors: [],
    warnings: []
  };

  try {
    // Check if file exists
    if (!fs.existsSync(schemaPath)) {
      result.errors.push(`Schema file not found: ${schemaPath}`);
      return result;
    }

    // Read and parse the schema file
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const parsedSchema = parseSchemaContent(schemaContent, result);
    
    if (parsedSchema) {
      result.schema = parsedSchema;
      result.fieldMappings = generateFieldMappings(parsedSchema, result);
    }

  } catch (error) {
    result.errors.push(`Error parsing schema file: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

/**
 * Parses GraphQL schema content and extracts type definitions
 * 
 * This function uses a simple regex-based parser to extract GraphQL types
 * and their fields. For production use, consider using a proper GraphQL parser
 * like graphql-js or similar.
 * 
 * @param content - GraphQL schema content
 * @param result - SchemaParseResult to collect errors and warnings
 * @returns GraphQLSchema - Parsed schema object
 */
function parseSchemaContent(content: string, result: SchemaParseResult): GraphQLSchema | null {
  const schema: GraphQLSchema = { types: [] };
  
  try {
    // Extract type definitions using regex - handle multiline content
    const typeRegex = /type\s+(\w+)\s*\{([^}]+)\}/gs;
    const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/gs;
    const inputRegex = /input\s+(\w+)\s*\{([^}]+)\}/gs;
    
    let match;
    
    // Parse object types
    while ((match = typeRegex.exec(content)) !== null) {
      const typeName = match[1];
      const fieldsContent = match[2];
      
      if (typeName && fieldsContent) {
        const type: GraphQLType = {
          name: typeName,
          kind: 'OBJECT',
          fields: parseFields(fieldsContent, result)
        };
        
        schema.types.push(type);
      }
    }
    
    // Parse enum types
    while ((match = enumRegex.exec(content)) !== null) {
      const enumName = match[1];
      const valuesContent = match[2];
      
      if (enumName && valuesContent) {
        const enumType: GraphQLType = {
          name: enumName,
          kind: 'ENUM',
          enumValues: parseEnumValues(valuesContent, result)
        };
        
        schema.types.push(enumType);
      }
    }
    
    // Parse input types
    while ((match = inputRegex.exec(content)) !== null) {
      const inputName = match[1];
      const fieldsContent = match[2];
      
      if (inputName && fieldsContent) {
        const inputType: GraphQLType = {
          name: inputName,
          kind: 'INPUT_OBJECT',
          fields: parseFields(fieldsContent, result)
        };
        
        schema.types.push(inputType);
      }
    }
    
    if (schema.types.length === 0) {
      result.warnings.push('No GraphQL types found in schema file');
    }
    
    return schema;
    
  } catch (error) {
    result.errors.push(`Error parsing schema content: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Parses field definitions from a GraphQL type
 * 
 * @param fieldsContent - Content of the fields section
 * @param result - SchemaParseResult to collect errors and warnings
 * @returns GraphQLField[] - Array of parsed fields
 */
function parseFields(fieldsContent: string, result: SchemaParseResult): GraphQLField[] {
  const fields: GraphQLField[] = [];
  
  try {
    // Split fields by lines and parse each field
    const fieldLines = fieldsContent.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    for (const line of fieldLines) {
      const field = parseField(line, result);
      if (field) {
        fields.push(field);
      }
    }
    
  } catch (error) {
    result.errors.push(`Error parsing fields: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return fields;
}

/**
 * Parses a single field definition
 * 
 * @param fieldLine - Single field definition line
 * @param result - SchemaParseResult to collect errors and warnings
 * @returns GraphQLField | null - Parsed field or null if parsing failed
 */
function parseField(fieldLine: string, result: SchemaParseResult): GraphQLField | null {
  try {
    // Improved regex to extract field name and type, handling complex types
    const fieldRegex = /(\w+)\s*:\s*([^#\n\r]+)/;
    const match = fieldLine.match(fieldRegex);
    
    if (!match) {
      result.warnings.push(`Could not parse field: ${fieldLine}`);
      return null;
    }
    
    const fieldName = match[1];
    const typeString = match[2];
    
    if (fieldName && typeString) {
      // Parse the type (handle arrays and non-null types)
      const fieldType = parseFieldType(typeString);
      
      const field: GraphQLField = {
        name: fieldName,
        type: fieldType,
        isRequired: typeString.endsWith('!'),
        isArray: typeString.includes('[') && typeString.includes(']')
      };
      
          return field;
  }
  
  return null;
    
  } catch (error) {
    result.errors.push(`Error parsing field '${fieldLine}': ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Parses a GraphQL field type string
 * 
 * @param typeString - Type string from GraphQL schema
 * @returns GraphQLFieldType - Parsed field type
 */
function parseFieldType(typeString: string): GraphQLFieldType {
  // Remove array brackets and non-null indicators for base type
  const baseType = typeString.replace(/[\[\]!]/g, '');
  
  const fieldType: GraphQLFieldType = {
    name: baseType,
    kind: getTypeKind(baseType)
  };
  
  // Handle arrays
  if (typeString.startsWith('[') && typeString.endsWith(']')) {
    const innerType = parseFieldType(typeString.slice(1, -1));
    return {
      name: 'List',
      kind: 'LIST',
      ofType: innerType
    };
  }
  
  // Handle non-null types
  if (typeString.endsWith('!')) {
    const innerType = parseFieldType(typeString.slice(0, -1));
    return {
      name: 'NonNull',
      kind: 'NON_NULL',
      ofType: innerType
    };
  }
  
  return fieldType;
}

/**
 * Determines the GraphQL type kind based on the type name
 * 
 * @param typeName - Name of the GraphQL type
 * @returns string - Type kind
 */
function getTypeKind(typeName: string): 'OBJECT' | 'SCALAR' | 'ENUM' | 'INPUT_OBJECT' | 'INTERFACE' | 'UNION' | 'LIST' | 'NON_NULL' {
  const scalarTypes = ['String', 'Int', 'Float', 'Boolean', 'ID', 'DateTime', 'Date', 'Time', 'JSON'];
  
  if (scalarTypes.includes(typeName)) {
    return 'SCALAR';
  }
  
  return 'OBJECT'; // Default to OBJECT for unknown types
}

/**
 * Parses enum values from a GraphQL enum type
 * 
 * @param valuesContent - Content of the enum values section
 * @param result - SchemaParseResult to collect errors and warnings
 * @returns GraphQLEnumValue[] - Array of parsed enum values
 */
function parseEnumValues(valuesContent: string, result: SchemaParseResult): GraphQLEnumValue[] {
  const values: GraphQLEnumValue[] = [];
  
  try {
    // Split by lines and clean up
    const valueLines = valuesContent.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    for (const line of valueLines) {
      // Remove commas and extra whitespace
      const valueName = line.replace(/[,;\s]/g, '').trim();
      if (valueName) {
        values.push({
          name: valueName,
          description: `Enum value: ${valueName}`
        });
      }
    }
    
  } catch (error) {
    result.errors.push(`Error parsing enum values: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return values;
}

/**
 * Generates field mappings for data generation based on the parsed schema
 * 
 * @param schema - Parsed GraphQL schema
 * @param result - SchemaParseResult to collect errors and warnings
 * @returns DataFieldMapping[] - Array of field mappings
 */
function generateFieldMappings(schema: GraphQLSchema, result: SchemaParseResult): DataFieldMapping[] {
  const mappings: DataFieldMapping[] = [];
  
  try {
    for (const type of schema.types) {
      if (type.kind === 'OBJECT' && type.fields) {
        for (const field of type.fields) {
          const strategy = determineGenerationStrategy(field, schema);
          
          if (strategy) {
            mappings.push({
              fieldName: field.name,
              typeName: type.name,
              strategy: strategy
            });
          }
        }
      }
    }
    
    if (mappings.length === 0) {
      result.warnings.push('No field mappings generated from schema');
    }
    
  } catch (error) {
    result.errors.push(`Error generating field mappings: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return mappings;
}

/**
 * Determines the appropriate data generation strategy for a field
 * 
 * @param field - GraphQL field definition
 * @param type - GraphQL type containing the field
 * @param schema - Complete GraphQL schema
 * @returns DataGenerationStrategy | null - Generation strategy or null if not determined
 */
function determineGenerationStrategy(
  field: GraphQLField, 
  schema: GraphQLSchema
): DataGenerationStrategy | null {
  
  // Check default field mappings first
  const defaultStrategy = DEFAULT_FIELD_MAPPINGS[field.name];
  if (defaultStrategy) {
    return defaultStrategy;
  }
  
  // Check if it's an enum type FIRST (before field name patterns)
  const baseType = getBaseType(field.type);
  const enumType = schema.types.find(t => t.name === baseType.name && t.kind === 'ENUM');
  if (enumType) {
    return 'enum';
  }
  
  // Check field name patterns
  const fieldNameLower = field.name.toLowerCase();
  
  if (fieldNameLower.includes('id')) return 'uuid';
  if (fieldNameLower.includes('email')) return 'email';
  if (fieldNameLower === 'name') return 'fullName';
  if (fieldNameLower === 'firstname') return 'firstName';
  if (fieldNameLower === 'lastname') return 'lastName';
  if (fieldNameLower.includes('phone')) return 'phone';
  if (fieldNameLower.includes('address')) return 'address';
  if (fieldNameLower.includes('city')) return 'city';
  if (fieldNameLower.includes('state')) return 'state';
  if (fieldNameLower.includes('country')) return 'country';
  if (fieldNameLower.includes('zip') || fieldNameLower.includes('postal')) return 'zipCode';
  if (fieldNameLower.includes('company')) return 'company';
  if (fieldNameLower.includes('title') || fieldNameLower.includes('position')) return 'jobTitle';
  if (fieldNameLower.includes('updatedat') || fieldNameLower.includes('createdat')) return 'datetime';
  if (fieldNameLower.includes('date')) return 'date';
  if (fieldNameLower.includes('time')) return 'datetime';
  if (fieldNameLower.includes('price') || fieldNameLower.includes('cost') || fieldNameLower.includes('amount')) return 'price';
  if (fieldNameLower.includes('url')) return 'url';
  if (fieldNameLower.includes('agent')) return 'userAgent';
  if (fieldNameLower.includes('ip')) return 'ipAddress';
  if (fieldNameLower.includes('device')) return 'deviceType';
  if (fieldNameLower.includes('browser')) return 'browser';
  if (fieldNameLower.includes('os') || fieldNameLower.includes('operating')) return 'operatingSystem';
  if (fieldNameLower.includes('rating')) return 'rating';
  if (fieldNameLower.includes('review') || fieldNameLower.includes('comment')) return 'review';
  if (fieldNameLower.includes('query') || fieldNameLower.includes('search')) return 'searchQuery';
  if (fieldNameLower.includes('payment')) return 'paymentMethod';
  if (fieldNameLower.includes('status')) return 'orderStatus';
  
  // Check GraphQL type
  switch (baseType.name) {
    case 'String':
      return 'string';
    case 'Int':
      return 'integer';
    case 'Float':
      return 'float';
    case 'Boolean':
      return 'boolean';
    case 'DateTime':
      return 'datetime';
    case 'Date':
      return 'date';
    case 'ID':
      return 'uuid';
    default:
      return 'string'; // Default to string for unknown types
  }
}

/**
 * Gets the base type of a GraphQL field type (removes LIST and NON_NULL wrappers)
 * 
 * @param fieldType - GraphQL field type
 * @returns GraphQLFieldType - Base type
 */
function getBaseType(fieldType: GraphQLFieldType): GraphQLFieldType {
  if (fieldType.kind === 'LIST' || fieldType.kind === 'NON_NULL') {
    return fieldType.ofType ? getBaseType(fieldType.ofType) : fieldType;
  }
  return fieldType;
}

/**
 * Creates a sample GraphQL schema file for testing
 * 
 * @param outputPath - Path where to create the sample schema file
 */
export function createSampleGraphQLSchema(outputPath: string = 'sample-schema.graphql'): void {
  const sampleSchema = `
# Sample GraphQL Schema for Customer Data Platform
# This schema defines the data model for a typical CDP

type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  phone: String
  company: String
  jobTitle: String
  createdAt: DateTime!
  updatedAt: DateTime!
  isActive: Boolean!
  profile: UserProfile
  events: [UserEvent!]!
  orders: [Order!]!
}

type UserProfile {
  id: ID!
  userId: ID!
  address: Address
  preferences: JSON
  tags: [String!]
  score: Float
  lastLoginAt: DateTime
}

type Address {
  id: ID!
  street: String!
  city: String!
  state: String!
  country: String!
  zipCode: String!
}

type UserEvent {
  id: ID!
  userId: ID!
  eventType: EventType!
  pageUrl: String
  userAgent: String
  ipAddress: String
  deviceType: DeviceType
  browser: Browser
  operatingSystem: OperatingSystem
  sessionId: String!
  timestamp: DateTime!
  metadata: JSON
}

type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  category: String!
  tags: [String!]
  inStock: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Order {
  id: ID!
  userId: ID!
  items: [OrderItem!]!
  total: Float!
  status: OrderStatus!
  paymentMethod: PaymentMethod
  createdAt: DateTime!
  updatedAt: DateTime!
}

type OrderItem {
  id: ID!
  orderId: ID!
  productId: ID!
  quantity: Int!
  price: Float!
}

type Review {
  id: ID!
  userId: ID!
  productId: ID!
  rating: Int!
  comment: String
  createdAt: DateTime!
}

# Enums
enum EventType {
  PAGE_VIEW
  SEARCH
  ADD_TO_CART
  REMOVE_FROM_CART
  CHECKOUT
  PURCHASE
  EMAIL_OPEN
  EMAIL_CLICK
}

enum DeviceType {
  DESKTOP
  MOBILE
  TABLET
}

enum Browser {
  CHROME
  FIREFOX
  SAFARI
  EDGE
}

enum OperatingSystem {
  WINDOWS
  MACOS
  LINUX
  IOS
  ANDROID
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  CREDIT_CARD
  PAYPAL
  APPLE_PAY
  GOOGLE_PAY
}

# Scalars
scalar DateTime
scalar JSON

# Query type
type Query {
  user(id: ID!): User
  users: [User!]!
  product(id: ID!): Product
  products: [Product!]!
  order(id: ID!): Order
  orders: [Order!]!
}

# Mutation type
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  createEvent(input: CreateEventInput!): UserEvent!
}

# Input types
input CreateUserInput {
  email: String!
  firstName: String!
  lastName: String!
  phone: String
  company: String
  jobTitle: String
}

input UpdateUserInput {
  email: String
  firstName: String
  lastName: String
  phone: String
  company: String
  jobTitle: String
}

input CreateEventInput {
  userId: ID!
  eventType: EventType!
  pageUrl: String
  userAgent: String
  ipAddress: String
  deviceType: DeviceType
  browser: Browser
  operatingSystem: OperatingSystem
  sessionId: String!
  metadata: JSON
}
`;

  try {
    fs.writeFileSync(outputPath, sampleSchema.trim());
    console.log(`✅ Sample GraphQL schema created at '${outputPath}'`);
  } catch (error) {
    console.error(`❌ Error creating sample GraphQL schema:`, error);
  }
} 