'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signUp } from '../../../lib/auth-client';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className='z-50 rounded-md rounded-t-none max-w-md'>
      <div>
        <h2 className='text-lg md:text-xl'>Sign Up</h2>
        <p className='text-xs md:text-sm'>
          Enter your information to create an account
        </p>
      </div>
      <div>
        <div className='grid gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <label htmlFor='first-name'>First name</label>
              <input
                id='first-name'
                placeholder='Max'
                required
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                value={firstName}
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='last-name'>Last name</label>
              <input
                id='last-name'
                placeholder='Robinson'
                required
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                value={lastName}
              />
            </div>
          </div>
          <div className='grid gap-2'>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              type='email'
              placeholder='m@example.com'
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className='grid gap-2'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='new-password'
              placeholder='Password'
            />
          </div>
          <div className='grid gap-2'>
            <label htmlFor='password'>Confirm Password</label>
            <input
              id='password_confirmation'
              type='password'
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete='new-password'
              placeholder='Confirm Password'
            />
          </div>

          <button
            type='submit'
            className='w-full'
            disabled={loading}
            onClick={async () => {
              await signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`,
                callbackURL: '/',
                fetchOptions: {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                    setError(null);
                  },
                  onError: () => {
                    setError('Une erreur est survenue.');
                  },
                  onSuccess: async () => {
                    setError(null);
                    router.push('/');
                  },
                },
              });
            }}
          >
            {loading ? <p>Loading...</p> : 'Create an account'}
          </button>
          {error && (
            <p className='text-red-500 text-xs text-center mt-2'>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
