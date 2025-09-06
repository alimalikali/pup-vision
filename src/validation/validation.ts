import {
  Gender,
  Religion,
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
  Education,
} from '@types';
import { z } from 'zod';

// Validation schemas that match our Prisma database schema exactly
export const profileSchema = z.object({
  // Basic Information
  name: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  avatar: z.string().optional().or(z.null()),
  dob: z
    .string()
    .or(z.date())
    .transform(val => {
      if (typeof val === 'string') {
        return new Date(val);
      }
      return val;
    }),
  gender: z.enum(Object.values(Gender) as [string, ...string[]]),
  income: z
    .union([
      z.number().min(0).max(10000000).optional(),
      z
        .string()
        .transform(val => {
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        })
        .refine(
          val => val === undefined || val >= 0,
          'Income must be between 0'
        ),
    ])
    .optional(),
  religion: z.enum(Object.values(Religion) as [string, ...string[]]),
  education: z.enum(Object.values(Education) as [string, ...string[]]),
  profession: z.enum(Object.values(Profession) as [string, ...string[]]),

  // Location
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  country: z.string().min(2).max(50),

  // Purpose
  purposeDomain: z.enum(Object.values(PurposeDomain) as [string, ...string[]]),
  purposeArchetype: z.enum(
    Object.values(PurposeArchetype) as [string, ...string[]]
  ),
  purposeModality: z.enum(
    Object.values(PurposeModality) as [string, ...string[]]
  ),
  purposeNarrative: z
    .string()
    .refine(val => {
      if (!val || val === '') return true; // Allow empty/undefined
      return val.length >= 50 && val.length <= 500;
    }, 'Narrative must be between 50 and 500 characters if provided')
    .optional(),

  // Interests & Lifestyle
  interests: z.array(z.enum(Object.values(Interest) as [string, ...string[]])),
  personality: z.enum(Object.values(Personality) as [string, ...string[]]),
  maritalStatus: z.enum(Object.values(MaritalStatus) as [string, ...string[]]),
  lookingFor: z.enum(Object.values(LookingFor) as [string, ...string[]]),
  language: z.enum(Object.values(Language) as [string, ...string[]]),
  height: z
    .number()
    .min(100)
    .max(250)
    .optional()
    .or(
      z
        .string()
        .transform(val => {
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        })
        .refine(
          val => !val || (val >= 100 && val <= 250),
          'Height must be between 100 and 250 cm'
        )
    ),
  weight: z
    .number()
    .min(30)
    .max(300)
    .optional()
    .or(
      z
        .string()
        .transform(val => {
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        })
        .refine(
          val => !val || (val >= 30 && val <= 300),
          'Weight must be between 30 and 300 kg'
        )
    ),
  smoke: z.enum(Object.values(Smoke) as [string, ...string[]]),
  alcohol: z.enum(Object.values(Alcohol) as [string, ...string[]]),
  drugs: z.enum(Object.values(Drugs) as [string, ...string[]]),
  politics: z.array(z.enum(Object.values(Politics) as [string, ...string[]])),

  // System fields
  isNew: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
// Partial schema for updates - this is what we should use for onboarding
export const profileUpdateSchema = profileSchema.partial().refine(
  data => {
    // If only updating avatar, allow it
    if (Object.keys(data).length === 1 && data.avatar !== undefined) {
      return true;
    }

    // Ensure at least the essential fields are present for other updates
    const essentialFields = [
      'name',
      'dob',
      'gender',
      'religion',
      'education',
      'profession',
      'city',
      'state',
      'country',
    ];
    const missingFields = essentialFields.filter(
      field => !data[field as keyof typeof data]
    );

    if (missingFields.length > 0) {
      return false;
    }
    return true;
  },
  {
    message:
      'Missing required fields: name, dob, gender, religion, education, profession, city, state, country',
    path: ['missing_fields'],
  }
);
// Validation function
export function validateProfile(data: ProfileData, isUpdate: boolean = false) {
  try {
    console.log('[v0] Validating profile data:', JSON.stringify(data, null, 2));

    const schema = isUpdate ? profileUpdateSchema : profileSchema;
    const result = schema.parse(data);
    console.log('[v0] Validation successful:', result);

    return {
      success: true,
      data: result,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('[v0] Validation failed with ZodError:', error.errors);
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    console.log('[v0] Validation failed with unknown error:', error);
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    };
  }
}

// Type exports
export type ProfileData = z.infer<typeof profileSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
