'use client';

import { Button, Modal } from 'antd';
import React from 'react';

import { LanguageSwitcher } from '@/app/_components/layout/middle/LanguageSwitcher';
import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';
import { useSession } from '@/utils/lib/better-auth/auth-client';
import { useTheme } from '@/utils/providers/ThemeProvider';

interface UserMenuDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UserMenuDialog({ open, onClose }: UserMenuDialogProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || '';
  let firstName = '';
  let lastName = '';
  if (userName) {
    const parts = userName.split(' ');
    firstName = parts[0];
    lastName = parts.slice(1).join(' ');
  }
  const { theme, setTheme } = useTheme();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title='Mon compte - Administrateur'
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        <div>
          <div style={{ marginBottom: 4 }}>Langue</div>
          <LanguageSwitcher />
        </div>
        <div>
          <div style={{ marginBottom: 4 }}>Thème</div>
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Sombre' : 'Clair'}
          </Button>
        </div>
      </div>
      <ul>
        <li>
          <strong>Prénom :</strong> {firstName}
        </li>
        <li>
          <strong>Nom :</strong> {lastName}
        </li>
        <li>
          <strong>Email :</strong> {user?.email}
        </li>
        <li>
          <strong>Mot de passe :</strong> ***********
        </li>
      </ul>
      <ButtonPrimary onClick={onClose}>Valider</ButtonPrimary>
    </Modal>
  );
}
