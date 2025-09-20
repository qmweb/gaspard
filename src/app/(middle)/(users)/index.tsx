import { Plus, Users } from 'lucide-react';

import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';
import { useTranslation } from '@/utils/hooks/useTranslation';

export default function UsersPage() {
  const { t } = useTranslation();

  return (
    <section className='users'>
      <h2 className='layout__title-with-icon'>
        <Users size={22} /> {t('users.userList')}
      </h2>
      <div>
        <ButtonPrimary>
          <Plus size={16} /> {t('users.create')}
        </ButtonPrimary>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>{t('users.name')}</th>
            <th>{t('users.email')}</th>
            <th>{t('users.role')}</th>
            <th>{t('users.status')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john.doe@example.com</td>
            <td>{t('users.admin')}</td>
            <td>{t('users.active')}</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>jane.smith@example.com</td>
            <td>{t('users.user')}</td>
            <td>{t('users.inactive')}</td>
          </tr>
          <tr>
            <td>Bob Martin</td>
            <td>bob.martin@example.com</td>
            <td>{t('users.manager')}</td>
            <td>{t('users.active')}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
