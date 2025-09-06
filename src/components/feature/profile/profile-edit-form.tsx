'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Save, X, Upload } from 'lucide-react';
import { formatEnumLabel } from '@/lib/utils';
import {
  Education,
  Profession,
  Gender,
  Religion,
  Interest,
  Personality,
  MaritalStatus,
  LookingFor,
  Language,
  Smoke,
  Alcohol,
  Drugs,
  Politics,
  PurposeDomain,
  PurposeArchetype,
  PurposeModality,
} from '@types';
import { Profile } from '@types';
import Image from 'next/image';

interface ProfileEditFormProps {
  profile: Profile;
  onSave: (profileData: Partial<Profile>) => Promise<boolean>;
  onCancel?: () => void;
}

export function ProfileEditForm({
  profile,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: profile.name || '',
    avatar: profile.avatar || '',
    dob: profile.dob || null,
    profession: profile.profession || Profession.OTHER,
    education: profile.education || Education.OTHER,
    gender: profile.gender || Gender.OTHER,
    religion: profile.religion || Religion.OTHER,
    income: profile.income || null,
    height: profile.height || null,
    weight: profile.weight || null,
    personality: profile.personality || Personality.AMBIVERT,
    maritalStatus: profile.maritalStatus || MaritalStatus.SINGLE,
    lookingFor: profile.lookingFor || LookingFor.SINGLE,
    language: profile.language || Language.ENGLISH,
    purposeDomain: profile.purposeDomain || PurposeDomain.PERSONAL,
    purposeArchetype: profile.purposeArchetype || PurposeArchetype.EXPLORER,
    purposeModality: profile.purposeModality || PurposeModality.INDIVIDUAL,
    purposeNarrative: profile.purposeNarrative || '',
    interests: profile.interests || [],
    smoke: profile.smoke || Smoke.NO,
    alcohol: profile.alcohol || Alcohol.NO,
    drugs: profile.drugs || Drugs.NO,
    politics: profile.politics || [],
    city: profile.city || '',
    state: profile.state || '',
    country: profile.country || '',
  });

  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(
    profile.interests || []
  );
  const [selectedPolitics, setSelectedPolitics] = useState<Politics[]>(
    profile.politics || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when profile changes
  useEffect(() => {
    setFormData({
      name: profile.name || '',
      avatar: profile.avatar || '',
      dob: profile.dob || null,
      profession: profile.profession || Profession.OTHER,
      education: profile.education || Education.OTHER,
      gender: profile.gender || Gender.OTHER,
      religion: profile.religion || Religion.OTHER,
      income: profile.income || null,
      height: profile.height || null,
      weight: profile.weight || null,
      personality: profile.personality || Personality.AMBIVERT,
      maritalStatus: profile.maritalStatus || MaritalStatus.SINGLE,
      lookingFor: profile.lookingFor || LookingFor.SINGLE,
      language: profile.language || Language.ENGLISH,
      purposeDomain: profile.purposeDomain || PurposeDomain.PERSONAL,
      purposeArchetype: profile.purposeArchetype || PurposeArchetype.EXPLORER,
      purposeModality: profile.purposeModality || PurposeModality.INDIVIDUAL,
      purposeNarrative: profile.purposeNarrative || '',
      interests: profile.interests || [],
      smoke: profile.smoke || Smoke.NO,
      alcohol: profile.alcohol || Alcohol.NO,
      drugs: profile.drugs || Drugs.NO,
      politics: profile.politics || [],
      city: profile.city || '',
      state: profile.state || '',
      country: profile.country || '',
    });
    setSelectedInterests(profile.interests || []);
    setSelectedPolitics(profile.politics || []);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedData = {
        ...formData,
        interests: selectedInterests,
        politics: selectedPolitics,
      };

      const success = await onSave(updatedData);
      if (success) {
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof Profile,
    value: string | number | Date | null
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setFormData({ ...formData, avatar: avatarUrl });
  };

  const handleInterestToggle = (interest: Interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handlePoliticsToggle = (politics: Politics) => {
    setSelectedPolitics(prev =>
      prev.includes(politics)
        ? prev.filter(p => p !== politics)
        : [...prev, politics]
    );
  };

  const getEnumValues = (
    enumObj:
      | typeof Gender
      | typeof Religion
      | typeof Profession
      | typeof Education
      | typeof Interest
      | typeof Politics
      | typeof PurposeDomain
      | typeof PurposeArchetype
      | typeof PurposeModality
      | typeof Personality
      | typeof MaritalStatus
      | typeof LookingFor
      | typeof Language
      | typeof Smoke
      | typeof Alcohol
      | typeof Drugs
  ) => {
    return Object.values(enumObj) as string[];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Image
                  src={formData.avatar || profile.avatar || '/placeholder.svg'}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                  width={96}
                  height={96}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = e => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = e => {
                          const result = e.target?.result as string;
                          if (result) {
                            handleAvatarChange(result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the button to change your photo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={
                  formData.dob
                    ? new Date(formData.dob).toISOString().split('T')[0]
                    : ''
                }
                onChange={e =>
                  handleInputChange(
                    'dob',
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={value => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(Gender).map(gender => (
                    <SelectItem key={gender} value={gender}>
                      {formatEnumLabel(gender)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Select
                value={formData.religion}
                onValueChange={value => handleInputChange('religion', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(Religion).map(religion => (
                    <SelectItem key={religion} value={religion}>
                      {formatEnumLabel(religion)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Select
                value={formData.profession}
                onValueChange={value => handleInputChange('profession', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(Profession).map(profession => (
                    <SelectItem key={profession} value={profession}>
                      {formatEnumLabel(profession)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Select
                value={formData.education}
                onValueChange={value => handleInputChange('education', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(Education).map(education => (
                    <SelectItem key={education} value={education}>
                      {formatEnumLabel(education)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Income (per month)</Label>
              <Input
                id="income"
                type="number"
                value={formData.income || ''}
                onChange={e =>
                  handleInputChange(
                    'income',
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="Annual income"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={e =>
                  handleInputChange(
                    'height',
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                placeholder="Height in cm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={e =>
                  handleInputChange(
                    'weight',
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                placeholder="Weight in kg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purposeNarrative">About Me</Label>
            <Textarea
              id="purposeNarrative"
              value={formData.purposeNarrative || ''}
              onChange={e =>
                handleInputChange('purposeNarrative', e.target.value)
              }
              rows={4}
              placeholder="Tell us about yourself, your goals, and what you're looking for..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={e => handleInputChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state || ''}
                onChange={e => handleInputChange('state', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={e => handleInputChange('country', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purpose */}
      <Card>
        <CardHeader>
          <CardTitle>Purpose & Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Purpose Domain</Label>
              <Select
                value={formData.purposeDomain}
                onValueChange={value =>
                  handleInputChange('purposeDomain', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(PurposeDomain).map(domain => (
                    <SelectItem key={domain} value={domain}>
                      {formatEnumLabel(domain)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Purpose Archetype</Label>
              <Select
                value={formData.purposeArchetype}
                onValueChange={value =>
                  handleInputChange('purposeArchetype', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(PurposeArchetype).map(archetype => (
                    <SelectItem key={archetype} value={archetype}>
                      {formatEnumLabel(archetype)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Purpose Modality</Label>
              <Select
                value={formData.purposeModality}
                onValueChange={value =>
                  handleInputChange('purposeModality', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(PurposeModality).map(modality => (
                    <SelectItem key={modality} value={modality}>
                      {formatEnumLabel(modality)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {getEnumValues(Interest).map(interest => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={selectedInterests.includes(interest as Interest)}
                    onCheckedChange={() =>
                      handleInterestToggle(interest as Interest)
                    }
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {formatEnumLabel(interest)}
                  </Label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Label className="text-sm font-medium">Selected Interests:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedInterests.map(interest => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {formatEnumLabel(interest)}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personality & Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Personality & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Personality</Label>
              <Select
                value={formData.personality}
                onValueChange={value => handleInputChange('personality', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(Personality).map(personality => (
                    <SelectItem key={personality} value={personality}>
                      {formatEnumLabel(personality)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={value =>
                  handleInputChange('maritalStatus', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(MaritalStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {formatEnumLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Looking For</Label>
              <Select
                value={formData.lookingFor}
                onValueChange={value => handleInputChange('lookingFor', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(LookingFor).map(lookingFor => (
                    <SelectItem key={lookingFor} value={lookingFor}>
                      {formatEnumLabel(lookingFor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={formData.language}
              onValueChange={value => handleInputChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getEnumValues(Language).map(language => (
                  <SelectItem key={language} value={language}>
                    {formatEnumLabel(language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Smoking</Label>
              <Select
                value={formData.smoke}
                onValueChange={value => handleInputChange('smoke', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(Smoke).map(smoke => (
                    <SelectItem key={smoke} value={smoke}>
                      {formatEnumLabel(smoke)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Drinking</Label>
              <Select
                value={formData.alcohol}
                onValueChange={value => handleInputChange('alcohol', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(Alcohol).map(alcohol => (
                    <SelectItem key={alcohol} value={alcohol}>
                      {formatEnumLabel(alcohol)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Drugs</Label>
              <Select
                value={formData.drugs}
                onValueChange={value => handleInputChange('drugs', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getEnumValues(Drugs).map(drugs => (
                    <SelectItem key={drugs} value={drugs}>
                      {formatEnumLabel(drugs)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Politics */}
      <Card>
        <CardHeader>
          <CardTitle>Political Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {getEnumValues(Politics).map(politics => (
                <div key={politics} className="flex items-center space-x-2">
                  <Checkbox
                    id={politics}
                    checked={selectedPolitics.includes(politics as Politics)}
                    onCheckedChange={() =>
                      handlePoliticsToggle(politics as Politics)
                    }
                  />
                  <Label htmlFor={politics} className="text-sm">
                    {formatEnumLabel(politics)}
                  </Label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Label className="text-sm font-medium">
                Selected Political Views:
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedPolitics.map(politics => (
                  <Badge
                    key={politics}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handlePoliticsToggle(politics)}
                  >
                    {formatEnumLabel(politics)}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
