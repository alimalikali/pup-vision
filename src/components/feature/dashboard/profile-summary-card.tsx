'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatEnumLabel } from '@/lib/utils';
import { Calendar, GraduationCap, MapPin, Target } from 'lucide-react';
import Link from 'next/link';

interface ProfileSummaryCardProps {
  profile: {
    name?: string;
    avatar?: string | null;
    profession?: string;
    city?: string | null;
    state?: string | null;
    education?: string;
    createdAt?: string | Date;
  };
  profileCompletion: number;
  isLoadingCompletion: boolean;
}

export function ProfileSummaryCard({ profile, profileCompletion, isLoadingCompletion }: ProfileSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar || '/placeholder.svg'} />
            <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{profile.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground">{formatEnumLabel(profile.profession || '')}</p>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              {profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Location not specified'}
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatEnumLabel(profile.education || '')}</span>
          </div>
          <div className="flex items-center">
            <Target className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Profile: {isLoadingCompletion ? '...' : profileCompletion}% complete</span>
          </div>
        </div>
        <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
          <Link href="/profile">Edit Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
