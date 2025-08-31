import {
  Alcohol, Drugs,
  Education,
  Gender,
  Interest as InterestEnum,
  Language,
  LookingFor,
  MaritalStatus,
  MatchStatus,
  PaymentMethod,
  Personality,
  Plan,
  Politics,
  Profession,
  PurposeArchetype,
  PurposeDomain,
  PurposeModality,
  Religion,
  Role,
  Smoke,
  SubscriptionStatus,
  TransactionStatus
} from './enums';

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
  // System flags
  createdAt: Date;

  profile?: Profile;
  matchesA: Match[];
  matchesB: Match[];
  matchesInit: Match[];
  subscriptions: Subscription[];
}

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
  interests: InterestEnum[];
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
  user: User;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  compatibilityScore: number;
  status: MatchStatus;
  initiatedById: string;
  createdAt: Date;
  updatedAt: Date;

  userA: User;
  userB: User;
  initiatedBy: User;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  user: User;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  transactionId: string;
  createdAt: Date;

  subscription: Subscription;
}

// Frontend-specific types
export interface Interest {
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
    interests: InterestEnum[];
    maritalStatus: MaritalStatus;
    isNew: boolean;
  };
  likedAt: string;
  status: "pending";
}

export interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private" | "friends";
    showOnlineStatus: boolean;
    showLastSeen: boolean;
  };
  matching: {
    ageRange: { min: number; max: number };
    maxDistance: number;
    showVerifiedOnly: boolean;
  };
}
