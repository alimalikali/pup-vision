import { ThemeProvider } from '@/components/common/theme/theme-provider';
import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type React from 'react';
import { Suspense } from 'react';
import './globals.css';
import { GoogleAuthProvider } from '@/components/feature/auth/google-auth-provider';
import { AuthProvider } from '@/components/feature/auth/auth-provider';
import * as Sentry from '@sentry/nextjs';

const metadata: Metadata = {
  title: 'Pup - Purpose-Based Marriage',
  description: 'Find your perfect match through purpose-driven connections',
  generator: 'ali.polymath.dev',
};

export function generateMetadata(): Metadata {
  return {
    ...metadata,
    other: {
      ...(Sentry.getTraceData() as Record<string, string>),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var root = document.documentElement;
                  
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {
                  // Fallback to light theme if localStorage fails
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider defaultTheme="system">
            <AuthProvider>
              <GoogleAuthProvider>{children}</GoogleAuthProvider>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
