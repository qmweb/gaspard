'use client';

import { useSession } from '@lib/auth-client';
import { Button, Modal, Select } from 'antd';
import React, { useState } from 'react';

import ButtonPrimary from '@/client/components/ui/Button/ButtonPrimary';
import { useTheme } from '@/client/providers/ThemeProvider';

interface UserMenuDialogProps {
  open: boolean;
  onClose: () => void;
}

const languages = [
  { label: 'Français', value: 'fr' },
  { label: 'English', value: 'en' },
];

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
  const [language, setLanguage] = React.useState('fr');
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);

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
          <Select
            value={language}
            onChange={setLanguage}
            options={languages}
            style={{ width: 120 }}
          />
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
      <ButtonPrimary>Valider</ButtonPrimary>
    </Modal>
  );
}
