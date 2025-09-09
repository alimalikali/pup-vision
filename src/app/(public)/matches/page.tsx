'use client';

import { Navbar } from '@/components/common/layout/navbar';
import { PageHeader } from '@/components/feature/matches/page-header';
import { StatsCards } from '@/components/feature/matches/stats-cards';
import { ProfilesGrid } from '@/components/feature/matches/profiles-grid';
import { LoadMoreButton } from '@/components/feature/matches/load-more-button';
import { AdvancedMatchFilters } from '@/components/feature/matches/advanced-match-filters';
import { Button } from '@/components/ui/button';
import { useAuthStore, useMatchesStore } from '@/store';
import { AdvancedFilters } from '@types';
import { useEffect, useState, useCallback } from 'react';
import { LoaderWait } from '@/components/common/layout/loader-wait';

export default function MatchesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('compatibility');

  const { user, status } = useAuthStore();
  const { profiles, isLoading, isLoadingMore, hasMore, error, advancedFilters, fetchProfiles, loadMoreProfiles, admireUser, passUser, updateAdvancedFilters, clearError } = useMatchesStore();

  // Initialize data on component mount
  useEffect(() => {
    if (status === 'authenticated' && user && profiles.length === 0) {
      fetchProfiles(true);
    }
  }, [status, user, fetchProfiles, profiles.length]);

  const handleLike = async (profileId: string) => {
    const success = await admireUser(profileId);
    if (success) {
      console.log('User admired successfully');
    }
  };

  const handlePass = async (profileId: string) => {
    const success = await passUser(profileId);
    if (success) {
      console.log('User passed successfully');
    }
  };

  const handleAdvancedFiltersChange = useCallback(
    (newFilters: AdvancedFilters) => {
      updateAdvancedFilters(newFilters);
      // Fetch profiles when Apply button is clicked
      fetchProfiles(true);
    },
    [updateAdvancedFilters, fetchProfiles]
  );

  const sortedProfiles = [...profiles].sort((a, b) => {
    switch (sortBy) {
      case 'compatibility':
        return (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

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
            <p className="text-muted-foreground">Please log in to view matches.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader title="Your Matches" description="Discover meaningful connections based on shared purpose and values" showFilters={showFilters} onToggleFilters={() => setShowFilters(!showFilters)} sortBy={sortBy} onSortChange={setSortBy} />

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
        <StatsCards profilesCount={profiles.length} averageCompatibility={profiles.length > 0 ? Math.round(profiles.reduce((acc, profile) => acc + (profile.compatibilityScore || 0), 0) / profiles.length) : 0} hasMore={hasMore} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-2">
              <AdvancedMatchFilters filters={advancedFilters} onFiltersChange={handleAdvancedFiltersChange} />
            </div>
          )}

          {/* Matches Grid */}
          <div className={`${showFilters ? 'lg:col-span-2' : 'lg:col-span-4'}`}>
            {isLoading ? (
              <LoaderWait variant="target" size="lg" color="primary" text="Loading profiles..." />
            ) : (
              <>
                <ProfilesGrid profiles={sortedProfiles} showFilters={showFilters} onLike={handleLike} onPass={handlePass} onToggleFilters={() => setShowFilters(true)} />
                <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onLoadMore={loadMoreProfiles} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
