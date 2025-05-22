import React from 'react';
import { Toaster } from 'sonner';

import SignUp from './signup-form';

export default function page() {
  return (
    <>
      <Toaster richColors position='bottom-right' />
      <SignUp />
    </>
  );
}
