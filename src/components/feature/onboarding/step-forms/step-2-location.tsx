'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Profile } from '@types';
import { AlertCircle } from 'lucide-react';
import React from 'react';

interface Step2LocationProps {
  formData: Partial<Profile>;
  errors: Record<string, string>;
  onInputChange: (fieldName: string, value: string | number | string[]) => void;
}

export function Step2Location({
  formData,
  errors,
  onInputChange,
}: Step2LocationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          type="text"
          placeholder="Enter your city"
          value={formData.city || ''}
          onChange={e => onInputChange('city', e.target.value)}
          className={errors.city ? 'border-red-500' : ''}
        />
        {errors.city && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.city}</span>
          </div>
        )}
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label htmlFor="state">State/Province</Label>
        <Input
          id="state"
          type="text"
          placeholder="Enter your state or province"
          value={formData.state || ''}
          onChange={e => onInputChange('state', e.target.value)}
          className={errors.state ? 'border-red-500' : ''}
        />
        {errors.state && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.state}</span>
          </div>
        )}
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          type="text"
          placeholder="Enter your country"
          value={formData.country || ''}
          onChange={e => onInputChange('country', e.target.value)}
          className={errors.country ? 'border-red-500' : ''}
        />
        {errors.country && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.country}</span>
          </div>
        )}
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language">Primary Language</Label>
        <Select
          value={formData.language || ''}
          onValueChange={value => onInputChange('language', value)}
        >
          <SelectTrigger className={errors.language ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select primary language" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            <SelectItem value="ENGLISH">English</SelectItem>
            <SelectItem value="URDU">Urdu</SelectItem>
            <SelectItem value="ARABIC">Arabic</SelectItem>
            <SelectItem value="HINDI">Hindi</SelectItem>
            <SelectItem value="FRENCH">French</SelectItem>
            <SelectItem value="GERMAN">German</SelectItem>
            <SelectItem value="PUNJABI">Punjabi</SelectItem>
            <SelectItem value="TURKISH">Turkish</SelectItem>
            <SelectItem value="PERSIAN">Persian</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.language && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.language}</span>
          </div>
        )}
      </div>
    </div>
  );
}
