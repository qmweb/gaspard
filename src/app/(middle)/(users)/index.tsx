import { Plus, Users } from 'lucide-react';

import '@/styles/pages/middle/users/index.scss';
import '@/styles/ui/table/table.scss';

import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';

export default function UsersPage() {
  return (
    <section className='users'>
      <h2 className='layout__title-with-icon'>
        <Users size={22} /> Liste des utilisateurs
      </h2>
      <div>
        <ButtonPrimary>
          <Plus size={16} /> Créer
        </ButtonPrimary>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john.doe@example.com</td>
            <td>Admin</td>
            <td>Actif</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>jane.smith@example.com</td>
            <td>Utilisateur</td>
            <td>Inactif</td>
          </tr>
          <tr>
            <td>Bob Martin</td>
            <td>bob.martin@example.com</td>
            <td>Manager</td>
            <td>Actif</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
