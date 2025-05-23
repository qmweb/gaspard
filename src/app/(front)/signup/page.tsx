import { Toaster } from 'sonner';

import '@/styles/pages/front/signup/index.scss';

import SignUp from './_components/signupForm';

export default function page() {
  return (
    <>
      <Toaster richColors position='bottom-right' />
      <SignUp />
    </>
  );
}
