/**
 * API response types and request/response interfaces
 */

import { MatchProfile, AdmireData } from './matches';
import { Profile } from './database';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Matches API response
 */
export interface MatchesResponse {
  success: boolean;
  data: MatchProfile[];
  pagination: {
    cursor: string | null;
    hasMore: boolean;
    limit: number;
  };
  message?: string;
}

/**
 * Profile API response
 */
export interface ProfileResponse {
  success: boolean;
  data: MatchProfile;
  message?: string;
}

/**
 * Admire action response
 */
export interface AdmireResponse {
  success: boolean;
  message: string;
  isMutual?: boolean;
}

/**
 * Admire data API response
 */
export interface AdmireDataResponse {
  success: boolean;
  data: AdmireData;
  message?: string;
}

/**
 * Photo upload response
 */
export interface PhotoResponse {
  success: boolean;
  photoUrl?: string;
  message?: string;
}

/**
 * Profile update response
 */
export interface ProfileUpdateResponse {
  success: boolean;
  profile?: Profile;
  message?: string;
}

/**
 * Service response wrapper
 */
export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Request options for services
 */
export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}
