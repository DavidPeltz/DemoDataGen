/**
 * Logging Service
 * 
 * This service is responsible for centralized logging throughout the application.
 * It provides structured logging, log levels, filtering, and performance monitoring
 * capabilities. This service replaces scattered console.log statements with a
 * consistent and configurable logging system.
 * 
 * Features:
 * - Structured logging with timestamps and log levels
 * - Performance monitoring and timing
 * - Log filtering and formatting
 * - Environment-specific logging behavior
 */

/**
 * Log levels supported by the logging service
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  duration?: number;
}

/**
 * Logging Service
 * 
 * Provides centralized logging functionality with structured output,
 * performance monitoring, and configurable log levels.
 */
export class LoggingService {
  private logLevel: LogLevel;
  private showProgress: boolean;
  private showSummary: boolean;
  private logs: LogEntry[] = [];
  private startTimes: Map<string, number> = new Map();

  constructor(logLevel: LogLevel = 'info', showProgress: boolean = true, showSummary: boolean = true) {
    this.logLevel = logLevel;
    this.showProgress = showProgress;
    this.showSummary = showSummary;
  }

  /**
   * Logs a debug message
   * 
   * @param message - The message to log
   * @param context - Optional context data
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  /**
   * Logs an info message
   * 
   * @param message - The message to log
   * @param context - Optional context data
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  /**
   * Logs a warning message
   * 
   * @param message - The message to log
   * @param context - Optional context data
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  /**
   * Logs an error message
   * 
   * @param message - The message to log
   * @param context - Optional context data
   */
  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }

  /**
   * Logs a progress message (only if showProgress is enabled)
   * 
   * @param message - The progress message
   * @param context - Optional context data
   */
  progress(message: string, context?: Record<string, any>): void {
    if (this.showProgress) {
      this.log('info', message, context);
    }
  }

  /**
   * Logs a summary message (only if showSummary is enabled)
   * 
   * @param message - The summary message
   * @param context - Optional context data
   */
  summary(message: string, context?: Record<string, any>): void {
    if (this.showSummary) {
      this.log('info', message, context);
    }
  }

  /**
   * Starts a performance timer
   * 
   * @param name - Name of the timer
   */
  startTimer(name: string): void {
    this.startTimes.set(name, Date.now());
  }

  /**
   * Ends a performance timer and logs the duration
   * 
   * @param name - Name of the timer
   * @param message - Optional message to log with the duration
   * @returns number - The duration in milliseconds
   */
  endTimer(name: string, message?: string): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) {
      this.warn(`Timer '${name}' was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.startTimes.delete(name);

    const logMessage = message || `Operation '${name}' completed`;
    this.info(`${logMessage} in ${duration}ms`, { duration, operation: name });

    return duration;
  }

  /**
   * Times an operation and logs the result
   * 
   * @param name - Name of the operation
   * @param operation - The operation to time
   * @returns T - The result of the operation
   */
  async timeOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
    this.startTimer(name);
    try {
      const result = await operation();
      this.endTimer(name, `Operation '${name}' completed successfully`);
      return result;
    } catch (error) {
      this.endTimer(name, `Operation '${name}' failed`);
      throw error;
    }
  }

  /**
   * Times a synchronous operation and logs the result
   * 
   * @param name - Name of the operation
   * @param operation - The operation to time
   * @returns T - The result of the operation
   */
  timeSyncOperation<T>(name: string, operation: () => T): T {
    this.startTimer(name);
    try {
      const result = operation();
      this.endTimer(name, `Operation '${name}' completed successfully`);
      return result;
    } catch (error) {
      this.endTimer(name, `Operation '${name}' failed`);
      throw error;
    }
  }

  /**
   * Internal logging method
   * 
   * @param level - The log level
   * @param message - The message to log
   * @param context - Optional context data
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      ...(context && { context })
    };

    this.logs.push(entry);
    this.outputLog(entry);
  }

  /**
   * Determines if a log level should be output
   * 
   * @param level - The log level to check
   * @returns boolean - True if the level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Outputs a log entry to the console
   * 
   * @param entry - The log entry to output
   */
  private outputLog(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    
    const logMessage = `[${timestamp}] ${level} ${entry.message}${contextStr}`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(logMessage);
        break;
      case 'info':
        console.info(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
    }
  }

  /**
   * Gets all logged entries
   * 
   * @returns LogEntry[] - Array of all log entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Gets logs filtered by level
   * 
   * @param level - The log level to filter by
   * @returns LogEntry[] - Array of filtered log entries
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(entry => entry.level === level);
  }

  /**
   * Gets logs filtered by time range
   * 
   * @param startTime - Start time for filtering
   * @param endTime - End time for filtering
   * @returns LogEntry[] - Array of filtered log entries
   */
  getLogsByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.logs.filter(entry => 
      entry.timestamp >= startTime && entry.timestamp <= endTime
    );
  }

  /**
   * Clears all logged entries
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Gets logging statistics
   * 
   * @returns object - Logging statistics
   */
  getLogStats(): {
    totalLogs: number;
    logsByLevel: Record<LogLevel, number>;
    averageLogsPerMinute: number;
  } {
    const logsByLevel: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0
    };

    this.logs.forEach(entry => {
      logsByLevel[entry.level]++;
    });

    const totalLogs = this.logs.length;
    const timeSpan = this.logs.length > 0 
      ? ((this.logs[this.logs.length - 1]?.timestamp.getTime() || 0) - (this.logs[0]?.timestamp.getTime() || 0)) / 1000 / 60
      : 0;
    
    const averageLogsPerMinute = timeSpan > 0 ? totalLogs / timeSpan : 0;

    return {
      totalLogs,
      logsByLevel,
      averageLogsPerMinute
    };
  }

  /**
   * Updates logging configuration
   * 
   * @param logLevel - New log level
   * @param showProgress - Whether to show progress messages
   * @param showSummary - Whether to show summary messages
   */
  updateConfig(logLevel: LogLevel, showProgress: boolean, showSummary: boolean): void {
    this.logLevel = logLevel;
    this.showProgress = showProgress;
    this.showSummary = showSummary;
    
    this.info('Logging configuration updated', { logLevel, showProgress, showSummary });
  }

  /**
   * Exports logs to JSON format
   * 
   * @returns string - JSON string of all logs
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Formats logs for human-readable output
   * 
   * @returns string - Formatted log output
   */
  formatLogs(): string {
    return this.logs.map(entry => {
      const timestamp = entry.timestamp.toISOString();
      const level = entry.level.toUpperCase().padEnd(5);
      const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
      return `[${timestamp}] ${level} ${entry.message}${contextStr}`;
    }).join('\n');
  }
} 