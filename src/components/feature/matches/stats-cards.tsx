'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Users } from 'lucide-react';

interface StatsCardsProps {
  profilesCount: number;
  averageCompatibility: number;
  hasMore: boolean;
}

export function StatsCards({ profilesCount, averageCompatibility, hasMore }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Profiles</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profilesCount}</div>
          <p className="text-xs text-muted-foreground">Ready to explore</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Compatibility</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageCompatibility}%</div>
          <p className="text-xs text-muted-foreground">Purpose alignment</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">More Available</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hasMore ? 'Yes' : 'No'}</div>
          <p className="text-xs text-muted-foreground">Load more profiles</p>
        </CardContent>
      </Card>
    </div>
  );
}
