'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { Step1BasicInfo, Step2Location, Step3Purpose, Step4Lifestyle } from './step-forms';
import { Profile } from '@types';

// Schema-based field definitions for validation
interface BaseField {
  type: string;
  label: string;
  required: boolean;
}

interface TextField extends BaseField {
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

interface SelectField extends BaseField {
  type: 'select';
  options: { value: string; label: string }[];
}

interface TextareaField extends BaseField {
  type: 'textarea';
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
}

interface CheckboxGroupField extends BaseField {
  type: 'checkbox-group';
  options: { value: string; label: string }[];
}

interface RadioGroupField extends BaseField {
  type: 'radio-group';
  options: { value: string; label: string }[];
}

type SchemaField = TextField | SelectField | TextareaField | CheckboxGroupField | RadioGroupField;

const SCHEMA_FIELDS: Record<string, SchemaField> = {
  // Basic Information
  name: {
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Name must be 2-50 characters and contain only letters and spaces',
    },
  },
  dob: {
    type: 'date',
    label: 'Date of Birth',
    required: true,
    validation: {
      minAge: 9,
      maxAge: 100,
      message: 'You must be at least 9 years old',
    },
  },
  gender: {
    type: 'select',
    label: 'Gender',
    required: true,
    options: [
      { value: 'MALE', label: 'Male' },
      { value: 'FEMALE', label: 'Female' },
      { value: 'OTHER', label: 'Other' },
    ],
  },
  income: {
    type: 'number',
    label: 'Income (per month)',
    placeholder: 'Enter your income per month',
    required: false,
    validation: {
      min: 0,
      message: 'Income must be greater than 0',
    },
  },
  religion: {
    type: 'select',
    label: 'Religion',
    required: true,
    options: [
      { value: 'ISLAM', label: 'Islam' },
      { value: 'CHRISTIANITY', label: 'Christianity' },
      { value: 'HINDUISM', label: 'Hinduism' },
      { value: 'BUDDHISM', label: 'Buddhism' },
      { value: 'JUDAISM', label: 'Judaism' },
      { value: 'ATHEISM', label: 'Atheism' },
      { value: 'OTHER', label: 'Other' },
    ],
  },
  education: {
    type: 'select',
    label: 'Education Level',
    required: true,
    options: [
      { value: 'NONE', label: 'None' },
      { value: 'PRIMARY', label: 'Primary' },
      { value: 'SECONDARY', label: 'Secondary' },
      { value: 'HIGH_SCHOOL', label: 'High School' },
      { value: 'BACHELORS', label: "Bachelor's Degree" },
      { value: 'MASTERS', label: "Master's Degree" },
      { value: 'PHD', label: 'PhD' },
      { value: 'SELF_TAUGHT', label: 'Self Taught' },
      { value: 'OTHER', label: 'Other' },
    ],
  },
  profession: {
    type: 'select',
    label: 'Profession',
    required: true,
    options: [
      { value: 'STUDENT', label: 'Student' },
      { value: 'ENGINEERING', label: 'Engineering' },
      { value: 'SOFTWARE_DEVELOPMENT', label: 'Software Development' },
      { value: 'DATA_SCIENCE', label: 'Data Science' },
      { value: 'ARTIFICIAL_INTELLIGENCE', label: 'Artificial Intelligence' },
      { value: 'MEDICINE', label: 'Medicine' },
      { value: 'DENTISTRY', label: 'Dentistry' },
      { value: 'NURSING', label: 'Nursing' },
      { value: 'EDUCATION', label: 'Education' },
      { value: 'BUSINESS', label: 'Business' },
      { value: 'ENTREPRENEUR', label: 'Entrepreneur' },
      { value: 'FINANCE', label: 'Finance' },
      { value: 'MARKETING', label: 'Marketing' },
      { value: 'SALES', label: 'Sales' },
      { value: 'LAW', label: 'Law' },
      { value: 'GOVERNMENT', label: 'Government' },
      { value: 'PUBLIC_SERVICE', label: 'Public Service' },
      { value: 'DESIGN', label: 'Design' },
      { value: 'WRITING', label: 'Writing' },
      { value: 'JOURNALISM', label: 'Journalism' },
      { value: 'ARTS', label: 'Arts' },
      { value: 'FILM', label: 'Film' },
      { value: 'MUSIC', label: 'Music' },
      { value: 'SPORTS', label: 'Sports' },
      { value: 'AGRICULTURE', label: 'Agriculture' },
      { value: 'ARCHITECTURE', label: 'Architecture' },
      { value: 'PSYCHOLOGY', label: 'Psychology' },
      { value: 'SOCIAL_WORK', label: 'Social Work' },
      { value: 'FREELANCER', label: 'Freelancer' },
      { value: 'UNEMPLOYED', label: 'Unemployed' },
      { value: 'HOMEMAKER', label: 'Homemaker' },
      { value: 'OTHER', label: 'Other' },
    ],
  },
  // Location
  city: {
    type: 'text',
    label: 'City',
    placeholder: 'Enter your city',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
      message: 'City must be 2-50 characters',
    },
  },
  state: {
    type: 'text',
    label: 'State/Province',
    placeholder: 'Enter your state or province',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
      message: 'State must be 2-50 characters',
    },
  },
  country: {
    type: 'text',
    label: 'Country',
    placeholder: 'Enter your country',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
      message: 'Country must be 2-50 characters',
    },
  },
  // Purpose
  purposeDomain: {
    type: 'select',
    label: 'Purpose Domain',
    required: true,
    options: [
      { value: 'SOCIAL', label: 'Social Impact' },
      { value: 'ENVIRONMENTAL', label: 'Environmental' },
      { value: 'TECHNOLOGICAL', label: 'Technological' },
      { value: 'EDUCATIONAL', label: 'Educational' },
      { value: 'RELIGIOUS', label: 'Religious' },
      { value: 'PERSONAL', label: 'Personal Growth' },
    ],
  },
  purposeArchetype: {
    type: 'select',
    label: 'Purpose Archetype',
    required: true,
    options: [
      { value: 'LEADER', label: 'Leader' },
      { value: 'CREATOR', label: 'Creator' },
      { value: 'HEALER', label: 'Healer' },
      { value: 'EXPLORER', label: 'Explorer' },
      { value: 'ADVOCATE', label: 'Advocate' },
      { value: 'VISIONARY', label: 'Visionary' },
    ],
  },
  purposeModality: {
    type: 'select',
    label: 'Purpose Modality',
    required: true,
    options: [
      { value: 'INDIVIDUAL', label: 'Individual' },
      { value: 'COMMUNITY', label: 'Community' },
      { value: 'GLOBAL', label: 'Global' },
    ],
  },
  purposeNarrative: {
    type: 'textarea',
    label: 'Purpose Narrative',
    placeholder: 'Tell us about your life purpose and what drives you...',
    required: false,
    validation: {
      minLength: 50,
      maxLength: 500,
      message: 'Narrative must be between 50 and 500 characters',
    },
  },
  // Interests
  interests: {
    type: 'checkbox-group',
    label: 'Interests',
    required: false,
    options: [
      { value: 'SPORTS', label: 'Sports' },
      { value: 'MUSIC', label: 'Music' },
      { value: 'TRAVEL', label: 'Travel' },
      { value: 'READING', label: 'Reading' },
      { value: 'COOKING', label: 'Cooking' },
      { value: 'ART', label: 'Art' },
      { value: 'TECHNOLOGY', label: 'Technology' },
      { value: 'OTHER', label: 'Other' },
    ],
  },
  // Personality & Lifestyle
  personality: {
    type: 'radio-group',
    label: 'Personality Type',
    required: true,
    options: [
      { value: 'INTROVERT', label: 'Introvert' },
      { value: 'EXTROVERT', label: 'Extrovert' },
      { value: 'AMBIVERT', label: 'Ambivert' },
    ],
  },
  maritalStatus: {
    type: 'select',
    label: 'Marital Status',
    required: true,
    options: [
      { value: 'SINGLE', label: 'Single' },
      { value: 'MARRIED', label: 'Married' },
      { value: 'DIVORCED', label: 'Divorced' },
      { value: 'WIDOWED', label: 'Widowed' },
    ],
  },
  lookingFor: {
    type: 'select',
    label: 'Looking For',
    required: true,
    options: [
      { value: 'SINGLE', label: 'Single' },
      { value: 'MARRIED', label: 'Married' },
      { value: 'DIVORCED', label: 'Divorced' },
      { value: 'WIDOWED', label: 'Widowed' },
    ],
  },
  language: {
    type: 'select',
    label: 'Primary Language',
    required: true,
    options: [
      { value: 'ENGLISH', label: 'English' },
      { value: 'URDU', label: 'Urdu' },
      { value: 'ARABIC', label: 'Arabic' },
      { value: 'HINDI', label: 'Hindi' },
      { value: 'FRENCH', label: 'French' },
      { value: 'GERMAN', label: 'German' },
      { value: 'PUNJABI', label: 'Punjabi' },
      { value: 'TURKISH', label: 'Turkish' },
      { value: 'PERSIAN', label: 'Persian' },
      { value: 'OTHER', label: 'Other' },
    ],
  },
  height: {
    type: 'number',
    label: 'Height (cm)',
    placeholder: 'Enter your height in centimeters',
    required: false,
    validation: {
      min: 100,
      max: 250,
      message: 'Height must be between 100 and 250 cm',
    },
  },
  weight: {
    type: 'number',
    label: 'Weight (kg)',
    placeholder: 'Enter your weight in kilograms',
    required: false,
    validation: {
      min: 30,
      max: 300,
      message: 'Weight must be between 30 and 300 kg',
    },
  },
  smoke: {
    type: 'select',
    label: 'Smoking',
    required: true,
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
      { value: 'OCCASIONALLY', label: 'Occasionally' },
    ],
  },
  alcohol: {
    type: 'select',
    label: 'Alcohol',
    required: true,
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
      { value: 'OCCASIONALLY', label: 'Occasionally' },
    ],
  },
  drugs: {
    type: 'select',
    label: 'Drugs',
    required: true,
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
      { value: 'OCCASIONALLY', label: 'Occasionally' },
    ],
  },
  politics: {
    type: 'checkbox-group',
    label: 'Political Views',
    required: false,
    options: [
      { value: 'LEFT', label: 'Left' },
      { value: 'RIGHT', label: 'Right' },
      { value: 'CENTER', label: 'Center' },
      { value: 'LIBERTARIAN', label: 'Libertarian' },
      { value: 'FUNDAMENTALIST', label: 'Fundamentalist' },
      { value: 'CONSERVATIVE', label: 'Conservative' },
      { value: 'OTHER', label: 'Other' },
    ],
  },
};

interface DynamicFormProps {
  fields: string[];
  title: string;
  description: string;
  onNext: (data: Partial<Profile>) => void;
  initialData?: Partial<Profile>;
}

export function DynamicForm({ fields, title, description, onNext, initialData = {} }: DynamicFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (fieldName: string, value: string | number | string[] | undefined): string | null => {
    const field = SCHEMA_FIELDS[fieldName as keyof typeof SCHEMA_FIELDS];
    if (!field) return null;

    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`;
    }

    // Only validate if validation rules exist
    if (!('validation' in field) || !field.validation) return null;

    const { validation } = field;

    // Type guard for validation object - only validate string values for length
    if ('minLength' in validation && validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
      return validation.message || `${field.label} must be at least ${validation.minLength} characters`;
    }

    if ('maxLength' in validation && validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
      return validation.message || `${field.label} must be no more than ${validation.maxLength} characters`;
    }

    if ('min' in validation && validation.min && typeof value === 'number' && value < validation.min) {
      return validation.message || `${field.label} must be at least ${validation.min}`;
    }

    if ('max' in validation && validation.max && typeof value === 'number' && value > validation.max) {
      return validation.message || `${field.label} must be no more than ${validation.max}`;
    }

    if ('pattern' in validation && validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      return validation.message || `${field.label} format is invalid`;
    }

    if ('minAge' in validation && validation.minAge && typeof value === 'string') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < validation.minAge) {
        return validation.message || `You must be at least ${validation.minAge} years old`;
      }
    }

    return null;
  };

  const handleInputChange = (fieldName: string, value: string | number | string[]) => {
    setFormData({ ...formData, [fieldName]: value });

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(fieldName => {
      const fieldValue = formData[fieldName as keyof Profile];
      // Convert the value to the expected type for validation
      let validationValue: string | number | string[] | undefined;

      if (fieldValue === null || fieldValue === undefined) {
        validationValue = undefined;
      } else if (typeof fieldValue === 'string' || typeof fieldValue === 'number' || Array.isArray(fieldValue)) {
        validationValue = fieldValue;
      } else {
        // For other types like Date, convert to string
        validationValue = String(fieldValue);
      }

      const error = validateField(fieldName, validationValue);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onNext(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine which step component to render based on the fields
  const renderStepComponent = () => {
    // Check if this is step 1 (Basic Information)
    if (fields.includes('name') && fields.includes('dob') && fields.includes('gender')) {
      return <Step1BasicInfo formData={formData} errors={errors} onInputChange={handleInputChange} />;
    }

    // Check if this is step 2 (Location & Contact)
    if (fields.includes('city') && fields.includes('state') && fields.includes('country')) {
      return <Step2Location formData={formData} errors={errors} onInputChange={handleInputChange} />;
    }

    // Check if this is step 3 (Purpose & Values)
    if (fields.includes('purposeDomain') && fields.includes('purposeArchetype')) {
      return <Step3Purpose formData={formData} errors={errors} onInputChange={handleInputChange} />;
    }

    // Check if this is step 4 (Lifestyle & Preferences)
    if (fields.includes('interests') && fields.includes('personality')) {
      return <Step4Lifestyle formData={formData} errors={errors} onInputChange={handleInputChange} />;
    }

    // Fallback: render individual fields (for backward compatibility)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(fieldName => {
          const field = SCHEMA_FIELDS[fieldName as keyof typeof SCHEMA_FIELDS];
          if (!field) return null;

          const value = formData[fieldName as keyof Profile];
          const error = errors[fieldName];

          // Simple field rendering for backward compatibility
          switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
              return (
                <div key={fieldName} className="space-y-2">
                  <label htmlFor={fieldName} className="text-sm font-medium">
                    {field.label}
                  </label>
                  <input id={fieldName} type={field.type} placeholder={field.placeholder || ''} value={(value as string) || ''} onChange={e => handleInputChange(fieldName, e.target.value)} className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`} />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              );
            default:
              return (
                <div key={fieldName} className="space-y-2">
                  <label className="text-sm font-medium">{field.label}</label>
                  <p className="text-sm text-gray-500">Field type not supported in fallback mode</p>
                </div>
              );
          }
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepComponent()}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
