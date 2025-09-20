'use client';

import { Button, Modal } from 'antd';

import { LanguageSwitcher } from '@/app/_components/layout/middle/LanguageSwitcher';
import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';
import { useTranslation } from '@/utils/hooks/useTranslation';
import { useSession } from '@/utils/lib/better-auth/auth-client';
import { useTheme } from '@/utils/providers/ThemeProvider';

interface UserMenuDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UserMenuDialog({ open, onClose }: UserMenuDialogProps) {
  const { t } = useTranslation();
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
      title={t('userMenu.myAccount')}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        <div>
          <div style={{ marginBottom: 4 }}>{t('userMenu.language')}</div>
          <LanguageSwitcher />
        </div>
        <div>
          <div style={{ marginBottom: 4 }}>{t('userMenu.theme')}</div>
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? t('userMenu.dark') : t('userMenu.light')}
          </Button>
        </div>
      </div>
      <ul>
        <li>
          <strong>{t('userMenu.firstName')}</strong> {firstName}
        </li>
        <li>
          <strong>{t('userMenu.lastName')}</strong> {lastName}
        </li>
        <li>
          <strong>{t('userMenu.email')}</strong> {user?.email}
        </li>
        <li>
          <strong>{t('userMenu.password')}</strong> ***********
        </li>
      </ul>
      <ButtonPrimary onClick={onClose}>{t('userMenu.validate')}</ButtonPrimary>
    </Modal>
  );
}
