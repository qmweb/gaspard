'use client';

import { Input } from 'antd';
import { LoaderCircle, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';
import { signIn } from '@/utils/lib/better-auth/auth-client';
import { useTheme } from '@/utils/providers/ThemeProvider';

import Logo from '~/images/logo_dark.svg';
import LogoLight from '~/images/logo_light.svg';

export default function SignIn() {
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const router = useRouter();

  // Mapper les messages d'erreur pour le toaster
  const errorMessagesMap: Record<string, string> = {
    'Invalid email or password': 'Mot de passe ou e-mail invalide.',
    'User not found': 'Utilisateur non trouvé.',
    'Email already in use': "L'adresse e-mail est déjà utilisée.",
    'Password too short': 'Le mot de passe est trop court.',
    'Network error': 'Erreur réseau, veuillez réessayer.',
    'User already exists': 'Un compte existe déjà avec cette adresse e-mail.',
    // Ajoute ici d'autres messages retournés par better-auth
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
                prefix={<Mail />}
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
                    onError: (error) => {
                      setLoading(false);
                      const errorMessage =
                        errorMessagesMap[error.error.message] ||
                        'Une erreur est survenue. Veuillez réessayer.';
                      toast.error(errorMessage);
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
