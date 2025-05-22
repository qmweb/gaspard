'use client';
import { Input } from 'antd';
import { LoaderCircle, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import '@/client/styles/components/ui/form/loginform.scss';

import ButtonPrimary from '@/client/components/ui/Button/ButtonPrimary';
import { signIn } from '@/utils/lib/auth-client';

import Logo from '~/images/logo_dark.svg';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const router = useRouter();

  return (
    <div className='signin'>
      <div className='signin__container'>
        <div className='signin__logo-container'>
          <Logo className='signin__logo' />
        </div>
        <div>
          <h2 className='text-lg md:text-xl'>Se connecter</h2>
          <p className='text-xs md:text-sm'>
            Entrez votre email et mot de passe pour vous connecter
          </p>
        </div>
        <div>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <label htmlFor='email'>Email</label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                size='large'
                prefix={<User />}
              />
            </div>

            <div className='grid gap-2'>
              <div className='flex items-center'>
                <label htmlFor='password'>Mot de passe</label>
              </div>

              <Input.Password
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                id='password'
                type='password'
                placeholder='Mot de passe'
                autoComplete='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size='large'
                prefix={<Lock />}
              />
            </div>
            <ButtonPrimary
              type='submit'
              className='button-primary__login'
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
                  },
                );
              }}
            >
              {loading ? (
                <p className='button-primary_loading--text'>
                  <LoaderCircle className='animate-spin' /> Chargement...
                </p>
              ) : (
                <p className='button-primary_static--text'> Connexion </p>
              )}
            </ButtonPrimary>
            <div className='signin__contact-admin'>
              <p>
                Pas encore de compte ?{' '}
                <Link replace={true} href='/signup'>
                  contactez l'administrateur
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
