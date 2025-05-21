import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';

import { Gotham } from '@/client/fonts';
import { ReactQueryProvider } from '@/client/providers/ReactQueryProvider';
import { APP_URL } from '@/utils/constants/config';

export const revalidate = 300; // 5 minutes

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: 'Gaspard',
      template: `%s | Gaspard`,
    },
    robots: {
      index: true,
      follow: true,
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
    <html lang='fr'>
      <body className={`${Gotham.variable}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
