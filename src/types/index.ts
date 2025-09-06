/**
 * Centralized types export
 * This is the main entry point for all type definitions
 */

// Enums - Single source of truth from Prisma schema
export * from './enums';

// Core database models
export * from './database';

// Authentication types
export * from './auth';

// Matchmaking and matching types
export * from './matches';

// API response types
export * from './api';

// UI component types
export * from './ui';

// State management types
export * from './store';

// Validation schemas and types
export * from './validation';

// Re-export commonly used types for convenience
export type {
  // Database types
  User,
  Profile,
  Match,
  Subscription,
  Transaction,
} from './database';

export type {
  // Auth types
  AuthUser,
  AuthProfile,
  AuthStatus,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  JWTPayload,
} from './auth';

export type {
  // Match types
  MatchProfile,
  AdvancedFilters,
  MatchesFilters,
  AdmireData,
  InterestRecord,
} from './matches';

export type {
  // API types
  ApiResponse,
  MatchesResponse,
  ProfileResponse,
  AdmireResponse,
  AdmireDataResponse,
  PhotoResponse,
  ProfileUpdateResponse,
  ServiceResponse,
  RequestOptions,
} from './api';

export type {
  // UI types
  Notification,
  UIState,
  LoaderWaitProps,
  LazyImageProps,
  AdvancedMatchFiltersProps,
  MatchCardProps,
  InterestCardProps,
  PhotoGalleryProps,
  ProfileEditFormProps,
  PurposeSectionProps,
  DynamicFormProps,
  PhotoUploadProps,
  StepFormProps,
  BaseField,
  TextField,
  SelectField,
  TextareaField,
  CheckboxGroupField,
  RadioGroupField,
  SchemaField,
} from './ui';

export type {
  // Store types
  BaseState,
  ProfileState,
  MatchesState,
  BillingState,
  SettingsState,
  AuthState,
  AuthActions,
  MatchesStoreState,
  MatchesStoreActions,
  ProfileStoreActions,
  UIStoreActions,
  UseFilterStateOptions,
} from './store';

export type {
  // Validation types
  ProfileData,
  ProfileUpdateData,
  LoginData,
  SignupData,
  PhotoUploadData,
  MatchFiltersData,
  AdvancedFiltersData,
} from './validation';
