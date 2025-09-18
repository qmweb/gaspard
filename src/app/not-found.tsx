import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Erreur 404',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className='not-found'>
      <h1>Oups ! Cette page n'existe pas...</h1>
    </section>
  );
}
