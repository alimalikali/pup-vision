/**
 * State management types for Zustand stores
 */

import { Profile, Match, Subscription, Transaction } from './database';
import { AuthUser, AuthStatus } from './auth';
import { MatchProfile, AdvancedFilters, AdmireData } from './matches';
import { Notification } from './ui';

/**
 * Base state interface for all stores
 */
export interface BaseState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Profile state interface
 */
export interface ProfileState extends BaseState {
  profile: Profile | null;
}

/**
 * Matches state interface
 */
export interface MatchesState extends BaseState {
  matches: Match[];
}

/**
 * Billing state interface
 */
export interface BillingState extends BaseState {
  subscription: Subscription | null;
  paymentHistory: Transaction[];
}

/**
 * Settings state interface
 */
export interface SettingsState extends BaseState {
  settings: SettingsState;
}

/**
 * Auth store state
 */
export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
}

/**
 * Auth store actions
 */
export interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  setAuthenticated: (user: AuthUser) => void;
  initialize: () => Promise<void>;
}

/**
 * Matches store state
 */
export interface MatchesStoreState {
  // Matches data
  profiles: MatchProfile[];
  currentProfile: MatchProfile | null;

  // Admire data
  admireData: AdmireData | null;

  // Pagination
  cursor: string | null;
  hasMore: boolean;

  // Filters
  filters: {
    ageMin?: number;
    ageMax?: number;
    gender?: string;
    city?: string;
    state?: string;
    education?: string;
    profession?: string;
    purposeDomain?: string;
    interests?: string[];
  };
  advancedFilters: AdvancedFilters;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isLoadingProfile: boolean;
  isLoadingAdmire: boolean;

  // Error handling
  error: string | null;
}

/**
 * Matches store actions
 */
export interface MatchesStoreActions {
  // Profile actions
  fetchProfiles: (reset?: boolean) => Promise<void>;
  loadMoreProfiles: () => Promise<void>;
  fetchProfile: (profileId: string) => Promise<void>;
  clearCurrentProfile: () => void;

  // Admire actions
  admireUser: (targetUserId: string) => Promise<boolean>;
  passUser: (targetUserId: string) => Promise<boolean>;
  fetchAdmireData: () => Promise<void>;

  // Filter actions
  updateFilters: (filters: Partial<MatchesStoreState['filters']>) => void;
  updateAdvancedFilters: (filters: Partial<AdvancedFilters>) => void;
  clearFilters: () => void;
  clearAdvancedFilters: () => void;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

/**
 * Profile store actions
 */
export interface ProfileStoreActions {
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<boolean>;
  uploadPhoto: (photoData: string) => Promise<string | null>;
  removePhoto: (photoIndex: number) => Promise<boolean>;
  setMainPhoto: (photoIndex: number) => Promise<boolean>;
  clearError: () => void;
}

/**
 * UI store actions
 */
export interface UIStoreActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

/**
 * Filter state hook options
 */
export interface UseFilterStateOptions {
  initialFilters?: AdvancedFilters;
  onFiltersChange?: (filters: AdvancedFilters) => void;
  debounceMs?: number;
}
