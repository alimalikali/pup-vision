// app/not-found.tsx
import Link from 'next/link';
import { Heart } from 'lucide-react';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <Heart className="h-12 w-12 text-primary mb-4 animate-pulse" />
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Oops! Page not found
      </h1>
      <p className="text-muted-foreground mb-6">
        The page you are looking for doesn’t exist.
      </p>
      <Link href="/" className="text-primary underline font-semibold">
        Go back home
      </Link>
    </div>
  );
}
