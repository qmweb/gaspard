import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';

import '@/styles/base/tailwind.css';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { APP_URL } from '@/utils/constants/config';
import { Inter } from '@/utils/fonts';
import { ReactQueryProvider } from '@/utils/providers/ReactQueryProvider';
import { ThemeProvider } from '@/utils/providers/ThemeProvider';

import { OrganizationProvider } from '../utils/providers/OrganizationProvider';

export const revalidate = 300; // 5 minutes

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: 'Gaspard',
      template: `%s | Gaspard`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: '',
      description: '',
      url: APP_URL || '',
      type: 'website',
      siteName: '',
      images: [
        {
          url: '',
          width: 1200,
          height: 630,
          alt: '',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: '',
      description: '',
      images: {
        url: '',
        alt: '',
      },
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='fr' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const actualTheme = theme === 'system' ? systemTheme : theme;
                  document.documentElement.classList.add(actualTheme);
                  document.documentElement.setAttribute('data-theme', actualTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${Inter.variable}`} suppressHydrationWarning>
        <OrganizationProvider>
          <LanguageProvider>
            <ReactQueryProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </ReactQueryProvider>
          </LanguageProvider>
        </OrganizationProvider>
      </body>
    </html>
  );
}
