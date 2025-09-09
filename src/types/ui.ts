/**
 * UI component types and interfaces
 */

import { AdvancedFilters } from './matches';

/**
 * Notification types
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

/**
 * UI state management
 */
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Notification[];
}

/**
 * Loader component props
 */
export interface LoaderWaitProps {
  /**
   * The variant of the loader to display
   */
  variant?: 'spinner' | 'dots' | 'pulse' | 'heart' | 'star' | 'target' | 'sparkles';
  /**
   * The size of the loader
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * The color theme of the loader
   */
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'white';
  /**
   * Custom text to display below the loader
   */
  text?: string;
  /**
   * Whether to show the loader in a centered container
   */
  centered?: boolean;
  /**
   * Whether to show the loader in a full screen overlay
   */
  fullScreen?: boolean;
  /**
   * Custom className for additional styling
   */
  className?: string;
  /**
   * Whether to show a backdrop blur effect
   */
  backdrop?: boolean;
}

/**
 * Lazy image component props
 */
export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  loadingClassName?: string;
  loadedClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Advanced match filters component props
 */
export interface AdvancedMatchFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  className?: string;
}

/**
 * Match card component props
 */
export interface MatchCardProps {
  match: {
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
  };
  onLike: (matchId: string) => void;
  onPass: (matchId: string) => void;
}

/**
 * Interest card component props
 */
export interface InterestCardProps {
  profile: {
    id: string;
    userId: string;
    name: string;
    avatar?: string | null;
    age?: number | null;
    city?: string | null;
    state?: string | null;
    profession: string;
    education: string;
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
    compatibilityScore?: number;
  };
  type: 'admirer' | 'admired' | 'match';
  matchScore?: number;
  onLikeBack: () => void;
  onPass: () => void;
}

/**
 * Photo gallery component props
 */
export interface PhotoGalleryProps {
  avatar?: string | null;
  onAvatarChange?: (avatarUrl: string) => void;
}

/**
 * Profile edit form props
 */
export interface ProfileEditFormProps {
  profile: Record<string, unknown>; // Will be replaced with proper Profile type
  onSave: (profileData: Record<string, unknown>) => Promise<boolean>;
  onCancel?: () => void;
}

/**
 * Purpose section component props
 */
export interface PurposeSectionProps {
  purpose: {
    domain: string;
    archetype: string;
    modality: string;
    narrative: string;
  };
}

/**
 * Dynamic form field types
 */
export interface BaseField {
  type: string;
  label: string;
  required: boolean;
}

export interface TextField extends BaseField {
  type: 'text' | 'number' | 'date';
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    minAge?: number;
    maxAge?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface SelectField extends BaseField {
  type: 'select';
  options: { value: string; label: string }[];
}

export interface TextareaField extends BaseField {
  type: 'textarea';
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
}

export interface CheckboxGroupField extends BaseField {
  type: 'checkbox-group';
  options: { value: string; label: string }[];
}

export interface RadioGroupField extends BaseField {
  type: 'radio-group';
  options: { value: string; label: string }[];
}

export type SchemaField = TextField | SelectField | TextareaField | CheckboxGroupField | RadioGroupField;

/**
 * Dynamic form component props
 */
export interface DynamicFormProps {
  fields: string[];
  title: string;
  description: string;
  onNext: (data: Record<string, unknown>) => void;
  initialData?: Record<string, unknown>;
}

/**
 * Photo upload component props
 */
export interface PhotoUploadProps {
  onNext: (data: { photos: string[] }) => void;
  initialData?: { photos?: string[] };
}

/**
 * Step form component props
 */
export interface StepFormProps {
  formData: Record<string, unknown>;
  errors: Record<string, string>;
  onInputChange: (fieldName: string, value: string | number | string[]) => void;
}
