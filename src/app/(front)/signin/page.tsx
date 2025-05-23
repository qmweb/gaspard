import { Toaster } from 'sonner';

import '@/styles/pages/front/signin/index.scss';

import SignIn from './_components/signinForm';

export default function page() {
  return (
    <>
      <Toaster richColors position='bottom-right' />
      <SignIn />
    </>
  );
}
