/**
 * File Service
 * 
 * This service handles all file operations including saving data to files,
 * creating output directories, and managing file paths. It provides a
 * centralized way to handle file I/O operations.
 * 
 * Extracted from index.ts to improve separation of concerns and maintainability.
 */

import * as fs from 'fs';
import * as path from 'path';
import { UserProfile, UserEvent } from '../types/events';
import { Config } from '../types/config';
import { LoggingService } from './LoggingService';

/**
 * File Service
 * 
 * Handles file operations for the Demo Data Generator including
 * saving data to files and managing output directories.
 */
export class FileService {
  private config: Config;
  private loggingService: LoggingService;

  constructor(config: Config) {
    this.config = config;
    this.loggingService = new LoggingService(config.logging.level);
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
   * @returns Object containing the file paths where data was saved
   */
  saveDataToFiles(userProfiles: UserProfile[], events: UserEvent[], country: string): { userProfilesPath: string; eventsPath: string } {
    // Create output directory based on configuration
    const outputDir = this.createOutputDirectory();
    
    // Normalize country name for file naming (lowercase, replace spaces with underscores)
    const normalizedCountry = this.normalizeCountryName(country);
    
    // Add timestamp to filename if configured
    const timestamp = this.config.output.includeTimestamp ? `_${new Date().toISOString().replace(/[:.]/g, '-')}` : '';
    
    // Save user profiles to NDJSON file
    const userProfilesPath = path.join(outputDir, `user_profiles_${normalizedCountry}${timestamp}.ndjson`);
    this.saveToNDJSON(userProfilesPath, userProfiles);
    
    // Save events to NDJSON file
    const eventsPath = path.join(outputDir, `user_events_${normalizedCountry}${timestamp}.ndjson`);
    this.saveToNDJSON(eventsPath, events);
    
    // Display file paths to user if summary is enabled
    if (this.config.logging.showSummary) {
      this.loggingService.info(`📁 Data saved to:`);
      this.loggingService.info(`   👥 User profiles: ${userProfilesPath}`);
      this.loggingService.info(`   📊 User events: ${eventsPath}`);
    }
    
    return { userProfilesPath, eventsPath };
  }

  /**
   * Saves GraphQL-generated data to separate files for each type
   * 
   * This function creates individual NDJSON files for each GraphQL type,
   * making it easy to work with specific data types. Files are organized
   * by type name and include timestamps for versioning.
   * 
   * @param graphqlData - Object containing data organized by GraphQL type
   * @param country - Country name used for file naming
   * @returns Promise<void> - Resolves when all files are saved
   */
  async saveGraphQLData(graphqlData: Record<string, any[]>, country: string): Promise<void> {
    // Create output directory based on configuration
    const outputDir = this.createOutputDirectory();
    
    // Normalize country name for file naming
    const normalizedCountry = this.normalizeCountryName(country);
    
    // Add timestamp to filename if configured
    const timestamp = this.config.output.includeTimestamp ? `_${new Date().toISOString().replace(/[:.]/g, '-')}` : '';
    
    // Save each GraphQL type to a separate file
    const savedFiles: string[] = [];
    
    for (const [typeName, records] of Object.entries(graphqlData)) {
      const filename = `graphql_${typeName.toLowerCase()}_${normalizedCountry}${timestamp}.ndjson`;
      const filePath = path.join(outputDir, filename);
      
      this.saveToNDJSON(filePath, records);
      savedFiles.push(filename);
    }
    
    // Create a summary file with metadata
    const summaryFile = path.join(outputDir, `graphql_summary_${normalizedCountry}${timestamp}.json`);
    const summary = {
      generatedAt: new Date().toISOString(),
      country: country,
      totalTypes: Object.keys(graphqlData).length,
      totalRecords: Object.values(graphqlData).reduce((sum, records) => sum + records.length, 0),
      files: savedFiles,
      types: Object.keys(graphqlData).map(typeName => ({
        name: typeName,
        recordCount: graphqlData[typeName]?.length || 0
      }))
    };
    
    this.writeFile(summaryFile, JSON.stringify(summary, null, 2));
    
    // Display GraphQL file paths if summary is enabled
    if (this.config.logging.showSummary) {
      this.loggingService.info(`📁 GraphQL data saved:`);
      this.loggingService.info(`   📊 ${Object.keys(graphqlData).length} type files created`);
      this.loggingService.info(`   📋 Summary: ${summaryFile}`);
    }
  }

  /**
   * Creates the output directory if it doesn't exist
   * 
   * @returns string - Path to the created output directory
   */
  private createOutputDirectory(): string {
    const outputDir = path.join(process.cwd(), this.config.output.directory);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    return outputDir;
  }

  /**
   * Normalizes country name for use in file names
   * 
   * @param country - Country name to normalize
   * @returns string - Normalized country name
   */
  private normalizeCountryName(country: string): string {
    return country.toLowerCase().replace(/\s+/g, '_');
  }

  /**
   * Saves data to a newline-delimited JSON file
   * 
   * @param filePath - Path where to save the file
   * @param data - Array of objects to save
   */
  private saveToNDJSON(filePath: string, data: any[]): void {
    const content = data.map(item => JSON.stringify(item)).join('\n');
    fs.writeFileSync(filePath, content);
  }

  /**
   * Checks if a file exists
   * 
   * @param filePath - Path to check
   * @returns boolean - True if file exists
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Reads a file and returns its contents
   * 
   * @param filePath - Path to the file to read
   * @returns string - File contents
   */
  readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8');
  }

  /**
   * Writes content to a file
   * 
   * @param filePath - Path where to write the file
   * @param content - Content to write
   */
  writeFile(filePath: string, content: string): void {
    fs.writeFileSync(filePath, content);
  }

  /**
   * Gets the size of a file in bytes
   * 
   * @param filePath - Path to the file
   * @returns number - File size in bytes
   */
  getFileSize(filePath: string): number {
    const stats = fs.statSync(filePath);
    return stats.size;
  }

  /**
   * Gets the number of lines in a file
   * 
   * @param filePath - Path to the file
   * @returns number - Number of lines
   */
  getLineCount(filePath: string): number {
    const content = this.readFile(filePath);
    return content.split('\n').filter(line => line.trim() !== '').length;
  }
} 