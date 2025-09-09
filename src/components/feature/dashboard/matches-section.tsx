'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Match {
  id: string;
  compatibilityScore: number;
  otherUser: {
    id: string;
    name: string;
    avatar?: string | null;
    city?: string | null;
    state?: string | null;
    profession?: string;
  };
}

interface MatchesSectionProps {
  matches: Match[];
}

export function MatchesSection({ matches }: MatchesSectionProps) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Matches</CardTitle>
          <CardDescription>You have no matches yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Matches</CardTitle>
            <CardDescription>People who admire you back</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/matches">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.slice(0, 3).map(match => (
            <div key={match.id} className="flex items-center space-x-4 p-4 rounded-lg border">
              <Avatar className="h-12 w-12">
                <AvatarImage src={match.otherUser?.avatar || '/placeholder.svg'} />
                <AvatarFallback>{match.otherUser?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{match.otherUser?.name}</p>
                  <Badge className="ml-2">{match.compatibilityScore}% Match</Badge>
                </div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  {match.otherUser?.city}, {match.otherUser?.state}
                  <span className="mx-2">•</span>
                  <Briefcase className="mr-1 h-3 w-3" />
                  {match.otherUser?.profession}
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Great compatibility based on shared interests and values.</p>
              </div>
              <Button size="sm" asChild>
                <Link href={`/matches/${match.otherUser?.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
