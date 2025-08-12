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
import { useTheme } from '@/utils/providers/ThemeProvider';

import Logo from '~/images/logo_dark.svg';
import LogoLight from '~/images/logo_light.svg';

export default function SignIn() {
  const { theme } = useTheme();
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
    <div className='signin'>
      <div className='signin__container'>
        <div className='signin__logo-container'>
          {theme === 'dark' ? (
            <LogoLight className='signin__logo' />
          ) : (
            <Logo className='signin__logo' />
          )}
        </div>
        <div>
          <h2 className='text-lg md:text-xl'>{t('auth.signInTitle')}</h2>
          <p className='text-xs md:text-sm'>{t('auth.signInSubtitle')}</p>
        </div>
        <div>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <label htmlFor='email'>{t('auth.email')}</label>
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
                prefix={<Mail />}
              />
            </div>

            <div className='grid gap-2'>
              <div className='flex items-center'>
                <label htmlFor='password'>{t('auth.password')}</label>
              </div>

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
                prefix={<Lock />}
              />
            </div>
            <Button
              type='submit'
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
                    onResponse: () => {
                      setLoading(false);
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
            <div className='signin__contact-admin'>
              <p>
                {t('auth.noAccountYet')}{' '}
                <Link replace={true} href='/signup'>
                  {t('auth.contactAdmin')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
