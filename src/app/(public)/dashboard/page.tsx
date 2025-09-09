'use client';

import { LoaderWait } from '@/components/common/layout/loader-wait';
import { Navbar } from '@/components/common/layout/navbar';
import { WelcomeSection } from '@/components/feature/dashboard/welcome-section';
import { StatsCards } from '@/components/feature/dashboard/stats-cards';
import { ProfileCompletionCard } from '@/components/feature/dashboard/profile-completion-card';
import { MatchesSection } from '@/components/feature/dashboard/matches-section';
import { AdmirersSection } from '@/components/feature/dashboard/admirers-section';
import { ProfileSummaryCard } from '@/components/feature/dashboard/profile-summary-card';
import { QuickActionsCard } from '@/components/feature/dashboard/quick-actions-card';
import { getProfileCompletionFromAPI } from '@/lib/utils';
import { useAuthStore, useMatchesStore } from '@/store';
import { AuthProfile } from '@types';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function DashboardPage() {
  const { user, status } = useAuthStore();
  const { admireData, fetchAdmireData } = useMatchesStore();
  const router = useRouter();

  // State for API-based profile completion
  const [profileCompletion, setProfileCompletion] = useState<{
    completion: number;
    missingFields: string[];
    profile: AuthProfile | null;
  }>({ completion: 0, missingFields: [], profile: null });
  const [isLoadingCompletion, setIsLoadingCompletion] = useState(false);

  // Function to fetch fresh profile completion data
  const fetchProfileCompletion = useCallback(async () => {
    if (status !== 'authenticated' || !user) return;

    setIsLoadingCompletion(true);
    try {
      const completionData = await getProfileCompletionFromAPI();
      setProfileCompletion(completionData);
    } catch (error) {
      console.error('Failed to fetch profile completion:', error);
    } finally {
      setIsLoadingCompletion(false);
    }
  }, [status, user]);

  // Expose refresh function for external use (e.g., after profile updates)
  useEffect(() => {
    // Listen for profile updates from other components
    const handleProfileUpdate = () => {
      fetchProfileCompletion();
    };

    // Add event listener for profile updates
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [fetchProfileCompletion]);

  useEffect(() => {
    // Check if user is new and redirect to onboarding
    if (user?.isNew) {
      console.log('User is new, redirecting to onboarding');
      router.push('/onboarding');
      return;
    }

    // Fetch admire data and profile completion when user is authenticated
    if (status === 'authenticated' && user) {
      fetchAdmireData();
      fetchProfileCompletion();
    }
  }, [user, router, status, fetchAdmireData, fetchProfileCompletion]);

  // Show loading while checking if user should be redirected
  if (user?.isNew) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting to onboarding...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalMatches: admireData?.matches?.length || 0,
    newMatches: admireData?.admirers?.length || 0,
    profileViews: 0, // This would need to be tracked separately
    interests: admireData?.admired?.length || 0,
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoaderWait variant="spinner" size="lg" color="primary" text="Loading profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <WelcomeSection userName={user?.profile?.name} />

        {/* Stats Cards */}
        <StatsCards totalMatches={stats.totalMatches} newMatches={stats.newMatches} profileViews={stats.profileViews} interests={stats.interests} profileCompletion={profileCompletion.completion} isLoadingCompletion={isLoadingCompletion} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion */}
            <ProfileCompletionCard completion={profileCompletion.completion} missingFields={profileCompletion.missingFields} />

            {/* Recent Matches */}
            <MatchesSection matches={admireData?.matches || []} />

            {/* Who Admires You */}
            <AdmirersSection admirers={admireData?.admirers || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <ProfileSummaryCard profile={user?.profile || {}} profileCompletion={profileCompletion.completion} isLoadingCompletion={isLoadingCompletion} />

            {/* Quick Actions */}
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* Purpose Insights */
}
{
  /* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    Your Purpose Insights
                  </CardTitle>
                  <CardDescription>How your purpose aligns with potential matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Technology & Innovation</span>
                          <span className="text-sm text-muted-foreground">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Collaborative Approach</span>
                          <span className="text-sm text-muted-foreground">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                    <div className="p-4 bg-accent/50 rounded-lg">
                      <p className="text-sm text-foreground">
                        <strong>Insight:</strong> You have strong alignment with professionals in tech and healthcare
                        who value collaborative innovation. Consider expanding your search to include related fields.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card> */
}
