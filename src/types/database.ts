/**
 * Core database models - derived from Prisma schema
 * These represent the actual database entities
 */

import { Role, Gender, Religion, Education, Profession, PurposeDomain, PurposeArchetype, PurposeModality, Interest, Personality, MaritalStatus, LookingFor, Language, Smoke, Alcohol, Drugs, Politics, MatchStatus, Plan, SubscriptionStatus, PaymentMethod, TransactionStatus } from './enums';

/**
 * Core User entity from database
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  isNew: boolean;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;

  // Relations
  profile?: Profile;
  matchesA: Match[];
  matchesB: Match[];
  matchesInit: Match[];
  subscriptions: Subscription[];
}

/**
 * User profile entity from database
 */
export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatar?: string | null;
  dob?: Date | null;
  gender: Gender;
  income?: number | null;
  religion: Religion;
  education: Education;
  profession: Profession;

  // Location
  lat?: number | null;
  lang?: number | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;

  // Purpose
  purposeDomain: PurposeDomain;
  purposeArchetype: PurposeArchetype;
  purposeModality: PurposeModality;
  purposeNarrative?: string | null;

  // Other details
  interests: Interest[];
  personality: Personality;
  maritalStatus: MaritalStatus;
  lookingFor: LookingFor;
  language: Language;
  height?: number | null;
  weight?: number | null;
  smoke: Smoke;
  alcohol: Alcohol;
  drugs: Drugs;
  politics: Politics[];
  createdAt: Date;
  updatedAt: Date;
  admiredBy: string[];
  admiredUsers: string[];

  // Relations
  user: User;
}

/**
 * Match entity from database
 */
export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  compatibilityScore: number;
  status: MatchStatus;
  initiatedById: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  userA: User;
  userB: User;
  initiatedBy: User;
}

/**
 * Subscription entity from database
 */
export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user: User;
  transactions: Transaction[];
}

/**
 * Transaction entity from database
 */
export interface Transaction {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  transactionId: string;
  createdAt: Date;

  // Relations
  subscription: Subscription;
}
