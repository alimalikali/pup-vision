'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Star, Users } from 'lucide-react';
import Link from 'next/link';

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full" asChild>
          <Link href="/matches">
            <Users className="mr-2 h-4 w-4" />
            Browse Matches
          </Link>
        </Button>
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/interested">
            <Star className="mr-2 h-4 w-4" />
            See Who Likes You
          </Link>
        </Button>
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/profile">
            <Camera className="mr-2 h-4 w-4" />
            Update Photos
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
