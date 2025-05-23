import { Button, Modal, Select } from 'antd';
import React from 'react';

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
  const [language, setLanguage] = React.useState('fr');
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
          <strong>Prénom :</strong> John
        </li>
        <li>
          <strong>Nom :</strong> Doe
        </li>
        <li>
          <strong>Email :</strong> john.doe@example.com
        </li>
        <li>
          <strong>Mot de passe :</strong> ***********
        </li>
      </ul>
      <ButtonPrimary>Valider</ButtonPrimary>
    </Modal>
  );
}
