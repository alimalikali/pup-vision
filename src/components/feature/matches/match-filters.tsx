'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface MatchFiltersProps {
  filters: {
    ageRange: { min: number; max: number };
    location: string;
    education: string;
    profession: string;
    purpose: string;
    interests: string[];
  };
  onFiltersChange: (filters: {
    ageRange: [number, number];
    location: string;
    education: string;
    profession: string;
    purpose: string;
    interests: string[];
  }) => void;
}

export function MatchFilters({ filters, onFiltersChange }: MatchFiltersProps) {
  const interests = [
    'Technology',
    'Travel',
    'Cooking',
    'Reading',
    'Music',
    'Art',
    'Sports',
    'Fitness',
    'Photography',
    'Dancing',
    'Movies',
    'Gaming',
    'Hiking',
    'Yoga',
    'Meditation',
    'Volunteering',
  ];

  const purposeDomains = [
    'Technology & Innovation',
    'Healthcare & Wellness',
    'Education & Learning',
    'Arts & Creativity',
    'Business & Entrepreneurship',
    'Social Impact & Advocacy',
    'Science & Research',
    'Finance & Investment',
    'Environment & Sustainability',
    'Sports & Fitness',
  ];

  const handleAgeRangeChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      ageRange: { min: values[0], max: values[1] },
    });
  };

  const handleInterestToggle = (interest: string) => {
    const updatedInterests = filters.interests.includes(interest)
      ? filters.interests.filter(i => i !== interest)
      : [...filters.interests, interest];

    onFiltersChange({
      ...filters,
      interests: updatedInterests,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      ageRange: { min: 25, max: 40 },
      location: '',
      education: '',
      profession: '',
      purpose: '',
      interests: [],
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Range */}
        <div className="space-y-3">
          <Label>Age Range</Label>
          <div className="px-2">
            <Slider
              value={[filters.ageRange.min, filters.ageRange.max]}
              onValueChange={handleAgeRangeChange}
              min={18}
              max={60}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>{filters.ageRange.min}</span>
              <span>{filters.ageRange.max}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Select
            value={filters.location}
            onValueChange={value =>
              onFiltersChange({ ...filters, location: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any-location">Any location</SelectItem>
              <SelectItem value="within-10">Within 10 miles</SelectItem>
              <SelectItem value="within-25">Within 25 miles</SelectItem>
              <SelectItem value="within-50">Within 50 miles</SelectItem>
              <SelectItem value="within-100">Within 100 miles</SelectItem>
              <SelectItem value="anywhere">Anywhere</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label>Education</Label>
          <Select
            value={filters.education}
            onValueChange={value =>
              onFiltersChange({ ...filters, education: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any-education">Any education</SelectItem>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="bachelors">Bachelor&apos;s Degree</SelectItem>
              <SelectItem value="masters">Master&apos;s Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Purpose Domain */}
        <div className="space-y-2">
          <Label>Purpose Domain</Label>
          <Select
            value={filters.purpose}
            onValueChange={value =>
              onFiltersChange({ ...filters, purpose: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any-purpose">Any purpose</SelectItem>
              {purposeDomains.map(domain => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <Label>Interests</Label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {interests.map(interest => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={filters.interests.includes(interest)}
                  onCheckedChange={() => handleInterestToggle(interest)}
                />
                <Label htmlFor={interest} className="text-sm">
                  {interest}
                </Label>
              </div>
            ))}
          </div>

          {/* Selected Interests */}
          {filters.interests.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs">Selected:</Label>
              <div className="flex flex-wrap gap-1">
                {filters.interests.map(interest => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="text-xs cursor-pointer"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
