'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, UserRoundPen } from 'lucide-react';
import Link from 'next/link';

interface ProfileCompletionCardProps {
  completion: number;
  missingFields: string[];
}

export function ProfileCompletionCard({ completion, missingFields }: ProfileCompletionCardProps) {
  if (completion >= 100) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2 h-5 w-5 text-primary" />
          Complete Your Profile
        </CardTitle>
        <CardDescription>A complete profile gets 3x more matches.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-muted-foreground">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />

          {missingFields.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Missing fields:</p>
              <div className="flex flex-wrap gap-1">
                {missingFields.map((field, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                    {field}
                  </span>
                ))}
                {missingFields.length >= 5 && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">+{missingFields.length - 5} more</span>}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Complete your profile to get more matches</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">
                <UserRoundPen className="mr-2 h-4 w-4" />
                Complete Profile
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
