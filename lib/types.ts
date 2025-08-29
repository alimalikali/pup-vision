export type Profile = {
  id: string
  userId: string
  name: string
  avatar: string | null
  dob: string
  gender: string
  streamUserId: string
  income: number
  age: number
  city: string
  state: string
  country: string
  religion: string
  education: string
  profession: string
  purpose: {
    domain: string
    archetype: string
    modality: string
    narrative: string
  }
  isNew: boolean
  createdAt: string
  interests: string[]
  personality: string
  maritalStatus: string
  lookingFor: string
  language: string
  height: number
  weight: number
  smoke: string
  alcohol: string
  drugs: string
  politics: string[]
  isVerified: boolean
  isDeleted: boolean
  isActive: boolean
}

export type Match = {
  id: string
  profile: Profile
  compatibilityScore: number
  purposeAlignment: number
  narrative: string
  matchedAt: string
  status: "pending" | "liked" | "passed" | "mutual"
}

export type User = {
  id: string
  email: string
  name: string
  avatar?: string
  subscription: {
    plan: "free" | "premium" | "elite"
    status: "active" | "inactive" | "cancelled"
    expiresAt: string
  }
  createdAt: string
  profile?: Profile
}

export type Interest = {
  id: string
  fromUserId: string
  toUserId: string
  type: "like" | "super_like"
  createdAt: string
  profile: Profile
}

export type Billing = {
  id: string
  userId: string
  plan: "free" | "premium" | "elite"
  amount: number
  currency: string
  status: "active" | "cancelled" | "past_due"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}
