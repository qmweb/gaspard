'use client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Erreur',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error() {
  return (
    <section className='w-full h-screen flex justify-center items-center'>
      <h1>Oups ! Une erreur est survenue...</h1>
    </section>
  );
}
