'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/common/layout/navbar';
import { PageHeader } from '@/components/feature/interested/page-header';
import { StatsCards } from '@/components/feature/interested/stats-cards';
import { InterestCard as InterestCardComponent } from '@/components/feature/interested/interest-card';
import { EmptyStateCard } from '@/components/feature/interested/empty-state-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMatchesStore, useAuthStore } from '@/store';
import { MatchProfile } from '@types';
import { LoaderWait } from '@/components/common/layout/loader-wait';

export default function InterestedPage() {
  const { user, status } = useAuthStore();
  const { admireData, isLoadingAdmire, error, fetchAdmireData, admireUser, passUser, clearError } = useMatchesStore();

  // Initialize data on component mount
  useEffect(() => {
    if (status === 'authenticated' && user && !admireData) {
      fetchAdmireData();
    }
  }, [status, user, fetchAdmireData, admireData]);

  const handleLikeBack = async (userId: string) => {
    const success = await admireUser(userId);
    if (success) {
      // Refresh admire data to show updated state
      await fetchAdmireData();
    }
  };

  const handlePass = async (userId: string) => {
    const success = await passUser(userId);
    if (success) {
      // Refresh admire data to show updated state
      await fetchAdmireData();
    }
  };

  // Show loading state during auth initialization
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoaderWait variant="spinner" size="lg" color="primary" text="Loading..." />
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to view who&apos;s interested.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching admire data
  if (isLoadingAdmire) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoaderWait variant="heart" size="lg" color="primary" text="Loading interest data..." />
      </div>
    );
  }

  const admirers = admireData?.admirers || [];
  const admired = admireData?.admired || [];
  const matches = admireData?.matches || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader title="Who's Interested" description="People who have shown interest in your profile" />

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={clearError} className="mt-2">
              Dismiss
            </Button>
          </div>
        )}

        {/* Stats */}
        <StatsCards admirersCount={admirers.length} admiredCount={admired.length} matchesCount={matches.length} responseRate={admirers.length > 0 ? Math.round((matches.length / admirers.length) * 100) : 0} />

        <Tabs defaultValue="admirers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="admirers">Who Likes You ({admirers.length})</TabsTrigger>
            <TabsTrigger value="admired">You Admire ({admired.length})</TabsTrigger>
            <TabsTrigger value="matches">Matches ({matches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="admirers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admirers.map(profile => (
                <InterestCardComponent key={profile.id} profile={profile} type="admirer" onLikeBack={() => handleLikeBack(profile.userId)} onPass={() => handlePass(profile.userId)} />
              ))}
            </div>
            {admirers.length === 0 && <EmptyStateCard type="admirers" />}
          </TabsContent>

          <TabsContent value="admired">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admired.map(profile => (
                <InterestCardComponent key={profile.id} profile={profile} type="admired" onLikeBack={() => {}} onPass={() => handlePass(profile.userId)} />
              ))}
            </div>
            {admired.length === 0 && <EmptyStateCard type="admired" />}
          </TabsContent>

          <TabsContent value="matches">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(match => (
                <InterestCardComponent key={match.id} profile={match.otherUser} type="match" matchScore={match.compatibilityScore} onLikeBack={() => {}} onPass={() => {}} />
              ))}
            </div>
            {matches.length === 0 && <EmptyStateCard type="matches" />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
