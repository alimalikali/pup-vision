'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WelcomeSectionProps {
  userName?: string;
}

export function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {userName || 'User'}</h1>
          <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening with your matches today</p>
        </div>
        <Button asChild>
          <Link href="/matches">
            View All Matches
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
