'use client';

import type { Metadata } from 'next';

import { useTranslation } from '@/utils/hooks/useTranslation';

export const metadata: Metadata = {
  title: 'Erreur',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error() {
  const { t } = useTranslation();

  return (
    <section className='w-full h-screen flex justify-center items-center'>
      <h1>{t('common.error')}</h1>
    </section>
  );
}
