'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Admirer {
  id: string;
  name: string;
  age?: number | null;
  avatar?: string | null;
  city?: string | null;
  state?: string | null;
  profession?: string;
}

interface AdmirersSectionProps {
  admirers: Admirer[];
}

export function AdmirersSection({ admirers }: AdmirersSectionProps) {
  if (admirers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Admirers</CardTitle>
          <CardDescription>You have no admirers yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Who Admires You</CardTitle>
            <CardDescription>People who have admired your profile</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/matches">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {admirers.slice(0, 3).map(admirer => (
            <div key={admirer.id} className="flex items-center space-x-4 p-4 rounded-lg border">
              <Avatar className="h-12 w-12">
                <AvatarImage src={admirer.avatar || '/placeholder.svg'} />
                <AvatarFallback>{admirer.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{admirer.name}</p>
                  <Badge className="ml-2">{admirer.age} years old</Badge>
                </div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  {admirer.city}, {admirer.state}
                  <span className="mx-2">•</span>
                  <Briefcase className="mr-1 h-3 w-3" />
                  {admirer.profession}
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href={`/matches/${admirer.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
