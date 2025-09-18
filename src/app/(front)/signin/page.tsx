'use client';

import { Toaster } from 'sonner';

import { useTheme } from '@/utils/providers/ThemeProvider';

import SignIn from './_components/signinForm';

import Logo from '~/images/logo_dark.svg';
import LogoLight from '~/images/logo_light.svg';

export default function Page() {
  const { theme } = useTheme();

  return (
    <>
      <Toaster richColors position='bottom-right' />
      <main className='w-full h-screen flex justify-center items-center'>
        <section>
          <div className='flex justify-center items-center'>
            {theme === 'dark' ? (
              <LogoLight className='w-3xs' />
            ) : (
              <Logo className='w-3xs' />
            )}
          </div>
          <div className='grid gap-3 mt-6'>
            <SignIn />
          </div>
        </section>
      </main>
    </>
  );
}
