/**
 * Event Types and Interfaces
 * 
 * This file contains all event-related type definitions and interfaces
 * for the Demo Data Generator. It centralizes event types, user profiles,
 * and event data structures.
 */

import { User, EventType } from './index';

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
export interface UserProfile extends User {
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
export interface UserEvent {
  id: string;
  userId?: string | undefined; // For known users
  cookieId?: string | undefined; // For anonymous web users
  maidId?: string | undefined; // For anonymous mobile app users
  eventType: EventType;
  eventData: Record<string, unknown>;
  timestamp: Date;
  country: string;
}

/**
 * Event Generation Context
 * 
 * Contains the state and context needed for generating realistic event sequences
 */
export interface EventGenerationContext {
  hasAddedToCart: boolean;
  hasViewedCart: boolean;
  hasCheckedOut: boolean;
  cartItems: number;
  sessionId: string;
  baseTimestamp: Date;
}

/**
 * Event Data Templates
 * 
 * Predefined event data structures for different event types
 */
export interface EventDataTemplates {
  pageView: Record<string, unknown>;
  search: Record<string, unknown>;
  addToCart: Record<string, unknown>;
  removeFromCart: Record<string, unknown>;
  viewCart: Record<string, unknown>;
  checkout: Record<string, unknown>;
  transactionComplete: Record<string, unknown>;
  emailOpen: Record<string, unknown>;
  emailClick: Record<string, unknown>;
  richpushOpen: Record<string, unknown>;
  richpushClick: Record<string, unknown>;
} 