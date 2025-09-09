'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Eye, GraduationCap, Heart, MapPin, MessageCircle, Target, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface MatchProfile {
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
  interests?: string[];
  compatibilityScore?: number;
}

interface InterestCardProps {
  profile: MatchProfile;
  type: 'admirer' | 'admired' | 'match';
  matchScore?: number;
  onLikeBack: () => void;
  onPass: () => void;
}

export function InterestCard({ profile, type, matchScore, onLikeBack, onPass }: InterestCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAction = (action: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      action();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isAnimating ? 'scale-95 opacity-50' : ''}`}>
      <div className="relative">
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src={profile.avatar || '/placeholder.svg'} alt={profile.name} fill className="object-cover" />

          {/* Interest Type Badge */}
          <div className="absolute top-4 right-4">
            {type === 'match' ? (
              <Badge className="bg-green-500 text-white font-semibold">
                <Heart className="mr-1 h-3 w-3" />
                It&apos;s a Match!
              </Badge>
            ) : type === 'admirer' ? (
              <Badge className="bg-red-500 text-white font-semibold">
                <Heart className="mr-1 h-3 w-3" />
                Likes You
              </Badge>
            ) : (
              <Badge className="bg-blue-500 text-white font-semibold">
                <Eye className="mr-1 h-3 w-3" />
                You Like
              </Badge>
            )}
          </div>

          {/* Match Score Badge */}
          {type === 'match' && matchScore && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground font-semibold">{matchScore}% Match</Badge>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Basic info overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-1">
              {profile.name}, {profile.age || 'N/A'}
            </h3>
            <div className="flex items-center text-sm opacity-90 mb-2">
              <MapPin className="mr-1 h-3 w-3" />
              {profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Location not specified'}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Professional Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              <span className="truncate">{profile.profession}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <GraduationCap className="mr-2 h-4 w-4" />
              <span className="truncate">{profile.education}</span>
            </div>
          </div>

          {/* Purpose Alignment (for matches) */}
          {type === 'match' && matchScore && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm font-medium">
                  <Target className="mr-1 h-4 w-4 text-primary" />
                  Purpose Alignment
                </div>
                <span className="text-sm font-semibold">{matchScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${matchScore}%` }} />
              </div>
            </div>
          )}

          {/* Purpose Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            <Badge variant="outline" className="text-xs">
              {profile.purposeDomain}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {profile.purposeArchetype}
            </Badge>
          </div>

          {/* Interests */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {profile.interests?.slice(0, 3).map(interest => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {profile.interests && profile.interests.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{profile.interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {type === 'admirer' && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAction(onPass)} className="flex-1">
                  <X className="mr-1 h-4 w-4" />
                  Pass
                </Button>
                <Button size="sm" onClick={() => handleAction(onLikeBack)} className="flex-1">
                  <Heart className="mr-1 h-4 w-4" />
                  Like Back
                </Button>
              </div>
            )}

            {type === 'admired' && (
              <Button variant="outline" size="sm" onClick={() => handleAction(onPass)} className="w-full">
                <X className="mr-1 h-4 w-4" />
                Remove
              </Button>
            )}

            {type === 'match' && (
              <Button size="sm" className="w-full" asChild>
                <Link href={`/matches/${profile.userId}`}>
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Start Chat
                </Link>
              </Button>
            )}

            {/* View Profile Link */}
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href={`/matches/${profile.userId}`}>
                <Eye className="mr-1 h-4 w-4" />
                View Full Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
