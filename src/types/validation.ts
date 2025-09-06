/**
 * Validation schemas and types
 */

import { z } from 'zod';
import {
  Gender,
  Religion,
  Education,
  Profession,
  PurposeDomain,
  PurposeArchetype,
  PurposeModality,
  Interest,
  Personality,
  MaritalStatus,
  LookingFor,
  Language,
  Smoke,
  Alcohol,
  Drugs,
  Politics,
} from './enums';

/**
 * Profile validation schema
 */
export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  dob: z.date().optional(),
  gender: z.nativeEnum(Gender),
  income: z.number().min(0).optional(),
  religion: z.nativeEnum(Religion),
  education: z.nativeEnum(Education),
  profession: z.nativeEnum(Profession),

  // Location
  lat: z.number().optional(),
  lang: z.number().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),

  // Purpose
  purposeDomain: z.nativeEnum(PurposeDomain),
  purposeArchetype: z.nativeEnum(PurposeArchetype),
  purposeModality: z.nativeEnum(PurposeModality),
  purposeNarrative: z.string().max(1000).optional(),

  // Other details
  interests: z
    .array(z.nativeEnum(Interest))
    .min(1, 'At least one interest is required'),
  personality: z.nativeEnum(Personality),
  maritalStatus: z.nativeEnum(MaritalStatus),
  lookingFor: z.nativeEnum(LookingFor),
  language: z.nativeEnum(Language),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  smoke: z.nativeEnum(Smoke),
  alcohol: z.nativeEnum(Alcohol),
  drugs: z.nativeEnum(Drugs),
  politics: z
    .array(z.nativeEnum(Politics))
    .min(1, 'At least one political view is required'),
});

/**
 * Profile update validation schema (all fields optional)
 */
export const profileUpdateSchema = profileSchema.partial();

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Signup validation schema
 */
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Photo upload validation schema
 */
export const photoUploadSchema = z.object({
  photoUrl: z.string().url('Invalid photo URL'),
});

/**
 * Match filters validation schema
 */
export const matchFiltersSchema = z.object({
  ageMin: z.number().min(18).max(100).optional(),
  ageMax: z.number().min(18).max(100).optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  purposeDomain: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

/**
 * Advanced filters validation schema
 */
export const advancedFiltersSchema = z.object({
  gender: z.array(z.string()).optional(),
  ageRange: z
    .object({
      min: z.number().min(18),
      max: z.number().max(100),
    })
    .optional(),
  incomeRange: z
    .object({
      min: z.number().min(0),
      max: z.number().max(1000000),
    })
    .optional(),
  religion: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  profession: z.array(z.string()).optional(),
  maritalStatus: z.array(z.string()).optional(),
  lookingFor: z.array(z.string()).optional(),
  purposeDomain: z.array(z.string()).optional(),
  purposeArchetype: z.array(z.string()).optional(),
  purposeModality: z.array(z.string()).optional(),
  country: z.array(z.string()).optional(),
  state: z.array(z.string()).optional(),
  city: z.array(z.string()).optional(),
  heightRange: z
    .object({
      min: z.number().min(100),
      max: z.number().max(250),
    })
    .optional(),
  weightRange: z
    .object({
      min: z.number().min(30),
      max: z.number().max(300),
    })
    .optional(),
  smoke: z.array(z.string()).optional(),
  alcohol: z.array(z.string()).optional(),
  drugs: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  politics: z.array(z.string()).optional(),
  personality: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

/**
 * Type inference from schemas
 */
export type ProfileData = z.infer<typeof profileSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type PhotoUploadData = z.infer<typeof photoUploadSchema>;
export type MatchFiltersData = z.infer<typeof matchFiltersSchema>;
export type AdvancedFiltersData = z.infer<typeof advancedFiltersSchema>;

/**
 * Validation function for profile data
 */
export function validateProfile(data: ProfileData, isUpdate: boolean = false) {
  const schema = isUpdate ? profileUpdateSchema : profileSchema;
  return schema.safeParse(data);
}

/**
 * Validation function for login data
 */
export function validateLogin(data: LoginData) {
  return loginSchema.safeParse(data);
}

/**
 * Validation function for signup data
 */
export function validateSignup(data: SignupData) {
  return signupSchema.safeParse(data);
}

/**
 * Validation function for photo upload data
 */
export function validatePhotoUpload(data: PhotoUploadData) {
  return photoUploadSchema.safeParse(data);
}

/**
 * Validation function for match filters
 */
export function validateMatchFilters(data: MatchFiltersData) {
  return matchFiltersSchema.safeParse(data);
}

/**
 * Validation function for advanced filters
 */
export function validateAdvancedFilters(data: AdvancedFiltersData) {
  return advancedFiltersSchema.safeParse(data);
}
