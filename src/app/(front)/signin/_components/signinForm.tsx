'use client';

import { Input } from 'antd';
import { LoaderCircle, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@/hooks/useTranslation';

import { Button } from '@/app/_components/ui/button';
import { signIn } from '@/utils/lib/better-auth/auth-client';

export default function SignIn() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const router = useRouter();

  // Map error messages for the toaster
  const errorMessagesMap: Record<string, string> = {
    'Invalid email or password': t('auth.invalidCredentials'),
    'User not found': t('auth.userNotFound'),
    'Email already in use': t('auth.emailAlreadyInUse'),
    'Password too short': t('auth.passwordTooShort'),
    'Network error': t('auth.networkError'),
    'User already exists': t('auth.userAlreadyExists'),
  };

  return (
    <>
      <div className='grid gap-1'>
        <label className='text-base font-medium' htmlFor='email'>
          {t('auth.email')}
        </label>
        <Input
          id='email'
          type='email'
          placeholder={t('auth.emailPlaceholder')}
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          size='large'
          prefix={<Mail className='mt-0.5 me-1.5' color='gray' size={16} />}
        />
      </div>

      <div className='grid gap-1'>
        <label className='text-base font-medium' htmlFor='password'>
          {t('auth.password')}
        </label>

        <Input.Password
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
          id='password'
          type='password'
          placeholder={t('auth.passwordPlaceholder')}
          autoComplete='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size='large'
          prefix={<Lock className='mt-0.5 me-1.5' color='gray' size={16} />}
        />
      </div>

      <Button
        type='submit'
        className='mt-1'
        disabled={loading}
        onClick={async () => {
          await signIn.email(
            {
              email,
              password,
            },
            {
              onRequest: () => {
                setLoading(true);
              },
              onSuccess: () => {
                router.replace('/');
              },
              onError: (error) => {
                setLoading(false);
                const errorMessage =
                  errorMessagesMap[error.error.message] ||
                  t('auth.genericError');
                toast.error(errorMessage);
              },
            },
          );
        }}
      >
        {loading ? (
          <>
            <LoaderCircle className='animate-spin' /> {t('auth.loading')}
          </>
        ) : (
          <>{t('auth.loginButton')}</>
        )}
      </Button>

      <p>
        {t('auth.noAccountYet')}{' '}
        <Link replace={true} className='text-base font-medium' href='/signup'>
          {t('auth.contactAdmin')}
        </Link>
      </p>
    </>
  );
}
