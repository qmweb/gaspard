import React from 'react';
import { Toaster } from 'sonner';

import SignIn from './signin-form';

export default function page() {
  return (
    <>
      <Toaster richColors position='bottom-right' />
      <SignIn />
    </>
  );
}
