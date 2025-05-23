'use client';

import type { Metadata } from 'next';

import '@/styles/pages/front/error.scss';

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
