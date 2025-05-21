'use client';

import type { Metadata } from 'next';

import '@/client/styles/pages/error.scss';

export const metadata: Metadata = {
  title: 'Erreur',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error() {
  return (
    <section className='error'>
      <h1>Oups ! Une erreur est survenue...</h1>
    </section>
  );
}
