'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Target } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateCardProps {
  type: 'admirers' | 'admired' | 'matches';
}

export function EmptyStateCard({ type }: EmptyStateCardProps) {
  const getContent = () => {
    switch (type) {
      case 'admirers':
        return {
          icon: Heart,
          title: 'No one has admired you yet',
          description: 'Keep improving your profile and browsing matches to get more visibility.',
        };
      case 'admired':
        return {
          icon: Star,
          title: "You haven't admired anyone yet",
          description: "Start browsing matches to find people you're interested in.",
        };
      case 'matches':
        return {
          icon: Target,
          title: 'No matches yet',
          description: "When someone you admire also admires you back, you'll have a match!",
        };
    }
  };

  const { icon: Icon, title, description } = getContent();

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button asChild>
          <Link href="/matches">Browse Matches</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
