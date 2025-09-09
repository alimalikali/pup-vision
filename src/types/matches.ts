/**
 * Matchmaking and matching related types
 */

import { Profession, PurposeDomain, PurposeArchetype, PurposeModality, MaritalStatus } from './enums';

/**
 * Profile used in matchmaking context
 */
export interface MatchProfile {
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
  user: {
    id: string;
    email: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  age?: number | null;
  compatibilityScore?: number;
}

/**
 * Match with detailed information
 */
export interface Match {
  id: string;
  compatibilityScore: number;
  purposeAlignment: number;
  matchedAt: Date;
  status: 'pending' | 'interested' | 'matched' | 'rejected' | 'blocked';
  narrative: string;
  profile: {
    id: string;
    name: string;
    age: number;
    avatar?: string | null;
    city: string;
    state: string;
    profession: string;
    education: string;
    purpose: {
      domain: string;
      archetype: string;
      modality: string;
      narrative?: string | null;
    };
    interests: string[];
    maritalStatus: string;
    height: number;
    religion: string;
    language: string;
    smoke: string;
    alcohol: string;
  };
}

/**
 * Interest/Admiration record
 */
export interface InterestRecord {
  id: string;
  profile: {
    id: string;
    name: string;
    age: number;
    avatar?: string | null;
    city?: string | null;
    state?: string | null;
    profession: Profession;
    education: string;
    purpose: {
      domain: PurposeDomain;
      archetype: PurposeArchetype;
      modality: PurposeModality;
      narrative?: string | null;
    };
    interests: string[];
    maritalStatus: MaritalStatus;
    isNew: boolean;
  };
  likedAt: string;
  status: 'pending';
}

/**
 * Advanced filters for matchmaking
 */
export interface AdvancedFilters {
  // Basic Info
  gender?: string[];
  ageRange?: { min: number; max: number };
  incomeRange?: { min: number; max: number };
  religion?: string[];
  education?: string[];
  profession?: string[];
  maritalStatus?: string[];
  lookingFor?: string[];

  // Purpose
  purposeDomain?: string[];
  purposeArchetype?: string[];
  purposeModality?: string[];

  // Location
  country?: string[];
  state?: string[];
  city?: string[];

  // Physical
  heightRange?: { min: number; max: number };
  weightRange?: { min: number; max: number };

  // Lifestyle
  smoke?: string[];
  alcohol?: string[];
  drugs?: string[];
  language?: string[];
  politics?: string[];
  personality?: string[];
  interests?: string[];
}

/**
 * Basic match filters
 */
export interface MatchesFilters {
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  city?: string;
  state?: string;
  education?: string;
  profession?: string;
  purposeDomain?: string;
  interests?: string[];
}

/**
 * Admire data structure
 */
export interface AdmireData {
  admired: MatchProfile[];
  admirers: MatchProfile[];
  matches: Array<{
    id: string;
    compatibilityScore: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    otherUser: MatchProfile;
  }>;
}
