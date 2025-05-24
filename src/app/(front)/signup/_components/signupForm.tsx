'use client';

import { Input } from 'antd';
import { LoaderCircle, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';
import { signUp } from '@/utils/lib/better-auth/auth-client';

import Logo from '~/images/logo_dark.svg';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const router = useRouter();

  // Mapper les messages d'erreur pour le toaster
  const errorMessagesMap: Record<string, string> = {
    'Invalid credentials': 'Identifiants invalides.',
    'User not found': 'Utilisateur non trouvé.',
    'Email already in use': "L'adresse e-mail est déjà utilisée.",
    'Password too short': 'Le mot de passe est trop court.',
    'Network error': 'Erreur réseau, veuillez réessayer.',
    'User already exists': 'Un compte existe déjà avec cette adresse e-mail.',
    // Ajoute ici d'autres messages retournés par better-auth
  };

  return (
    <div className='signup'>
      <div className='signup__container'>
        <div className='signup__logo-container'>
          <Logo className='signup__logo' />
        </div>
        <div>
          <h2 className='text-lg md:text-xl'>Créer mon compte</h2>
          <p className='text-xs md:text-sm'>
            Entrez vos informations pour la création de votre compte, d'autres
            pourront êtres ajoutés dans votre panneau d'administration.
          </p>
        </div>
        <div>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <label htmlFor='email'>Nom & prénom</label>
              <div className='signup__name-container'>
                <Input
                  id='name'
                  type='text'
                  placeholder='Christophe'
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                  size='large'
                  prefix={<User />}
                />{' '}
                <Input
                  id='lastname'
                  type='text'
                  placeholder='Courtin'
                  required
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  value={lastName}
                  size='large'
                  prefix={<User />}
                />
              </div>
            </div>

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

            <div className='grid gap-2'>
              <div className='flex items-center'>
                <label htmlFor='password'>Confirmez votre mot de passe</label>
              </div>

              <Input.Password
                visibilityToggle={{
                  visible: confirmPasswordVisible,
                  onVisibleChange: setConfirmPasswordVisible,
                }}
                id='password'
                type='password'
                placeholder='Mot de passe'
                autoComplete='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size='large'
                prefix={<Lock />}
              />
            </div>
            <ButtonPrimary
              type='submit'
              className='button-primary__login'
              disabled={loading}
              onClick={async () => {
                await signUp.email(
                  {
                    email,
                    name: firstName + ' ' + lastName,
                    password: password == confirmPassword ? password : '',
                  },
                  {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                    onError: (error) => {
                      const originalMessage = error?.error?.message;
                      const translatedMessage =
                        errorMessagesMap[originalMessage] ||
                        'Une erreur est survenue, réessayez.';

                      toast.error(translatedMessage);
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
                <p className='button-primary_static--text'>
                  {' '}
                  Créer mon compte{' '}
                </p>
              )}
            </ButtonPrimary>
            <div className='signup__contact-admin'>
              <p>
                Déjà un compte ?{' '}
                <Link replace={true} href='/signin'>
                  connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
