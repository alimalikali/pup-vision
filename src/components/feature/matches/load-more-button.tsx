'use client';

import { Button } from '@/components/ui/button';
import { LoaderWait } from '@/components/common/layout/loader-wait';

interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function LoadMoreButton({ hasMore, isLoading, onLoadMore }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="mt-8 text-center">
      <Button onClick={onLoadMore} disabled={isLoading} variant="outline">
        {isLoading ? (
          <>
            <LoaderWait variant="spinner" size="sm" color="white" centered={false} />
            Loading...
          </>
        ) : (
          'Load More Profiles'
        )}
      </Button>
    </div>
  );
}
