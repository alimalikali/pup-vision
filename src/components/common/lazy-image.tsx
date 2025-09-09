'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: React.ReactNode;
  loadingClassName?: string;
  loadedClassName?: string;
}

export function LazyImage({ src, alt, className, fallback, loadingClassName, loadedClassName, ...props }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setError(false);
  }, [src]);

  useEffect(() => {
    if (!containerRef.current) return;

    // If IntersectionObserver is not available, load immediately
    if (!window.IntersectionObserver) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)} style={{ ...props.style }}>
      {isIntersecting ? (
        <>
          {isLoading && <div className={cn('absolute inset-0 bg-muted/30 animate-pulse flex items-center justify-center z-10', loadingClassName)}>{fallback || null}</div>}
          <Image src={src || '/placeholder.svg'} alt={alt} className={cn('transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100', loadedClassName)} onLoad={handleLoad} onError={handleError} {...props} />
          {error && fallback && <div className="absolute inset-0 flex items-center justify-center z-20">{fallback}</div>}
        </>
      ) : (
        <div className={cn('w-full h-full bg-muted/30 animate-pulse flex items-center justify-center', loadingClassName)}>{fallback || null}</div>
      )}
    </div>
  );
}
