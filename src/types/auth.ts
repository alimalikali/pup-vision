/**
 * Authentication related types
 */

import { Role } from './enums';

/**
 * JWT payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Authentication status
 */
export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

/**
 * Authenticated user with profile information
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string | undefined;
  role: Role;
  avatar: string | undefined | null;
  isVerified: boolean;
  isActive: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile?: AuthProfile;
}

/**
 * User profile for authentication context
 */
export interface AuthProfile {
  id: string;
  userId: string;
  name: string;
  avatar?: string | null;
  dob?: Date | null;
  gender: string;
  income?: number | null;
  religion: string;
  education: string;
  profession: string;
  lat?: number | null;
  lang?: number | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  purposeDomain: string;
  purposeArchetype: string;
  purposeModality: string;
  purposeNarrative?: string | null;
  interests: string[];
  personality: string;
  maritalStatus: string;
  lookingFor: string;
  language: string;
  height?: number | null;
  weight?: number | null;
  smoke: string;
  alcohol: string;
  drugs: string;
  politics: string[];
  createdAt: Date;
  updatedAt: Date;
  admiredBy: string[];
  admiredUsers: string[];
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Signup request payload
 */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}
