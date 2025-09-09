'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, Heart } from 'lucide-react';
import { MatchCard } from './match-card';

interface Profile {
  id: string;
  userId: string;
  name: string;
  age?: number | null;
  avatar?: string | null;
  city?: string | null;
  state?: string | null;
  profession?: string;
  education?: string;
  purposeDomain?: string;
  purposeArchetype?: string;
  purposeModality?: string;
  purposeNarrative?: string | null;
  interests?: string[];
  maritalStatus?: string;
  height?: number | null;
  religion?: string;
  language?: string;
  smoke?: string;
  alcohol?: string;
  compatibilityScore?: number;
  createdAt: string | Date;
}

interface ProfilesGridProps {
  profiles: Profile[];
  showFilters: boolean;
  onLike: (profileId: string) => void;
  onPass: (profileId: string) => void;
  onToggleFilters: () => void;
}

export function ProfilesGrid({ profiles, showFilters, onLike, onPass, onToggleFilters }: ProfilesGridProps) {
  if (profiles.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or check back later for new profiles.</p>
          <Button onClick={onToggleFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Adjust Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${showFilters ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
      {profiles.map(profile => (
        <MatchCard
          key={profile.id}
          match={{
            id: profile.id,
            compatibilityScore: profile.compatibilityScore || 0,
            purposeAlignment: profile.compatibilityScore || 0,
            matchedAt: profile.createdAt,
            status: 'pending',
            narrative: `Great compatibility based on shared interests and values.`,
            profile: {
              id: profile.id,
              name: profile.name,
              age: profile.age || 25,
              avatar: profile.avatar,
              city: profile.city || 'Unknown',
              state: profile.state || 'Unknown',
              profession: profile.profession,
              education: profile.education,
              purpose: {
                domain: profile.purposeDomain,
                archetype: profile.purposeArchetype,
                modality: profile.purposeModality,
                narrative: profile.purposeNarrative || 'No narrative provided',
              },
              interests: profile.interests,
              maritalStatus: profile.maritalStatus,
              height: profile.height || 170,
              religion: profile.religion,
              language: profile.language,
              smoke: profile.smoke,
              alcohol: profile.alcohol,
            },
          }}
          onLike={() => onLike(profile.userId)}
          onPass={() => onPass(profile.userId)}
        />
      ))}
    </div>
  );
}
