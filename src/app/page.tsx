import '@/client/styles/pages/home.scss';

import MiddleLayout from '@/app/(middle)/layout';

export default async function Home() {
  return (
    <MiddleLayout>
      <section className='home__hero'></section>
    </MiddleLayout>
  );
}
