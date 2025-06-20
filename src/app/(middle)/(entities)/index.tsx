import { Building2 } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';

export default function EntitiesPage() {
  const { t } = useTranslation();
  return (
    <section className='entities'>
      <h2 className='layout__title-with-icon'>
        <Building2 size={22} /> {t('navigation.entities')}
      </h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date de création</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Entreprise Alpha</td>
            <td>SARL</td>
            <td>Active</td>
            <td>2022-01-15</td>
          </tr>
          <tr>
            <td>Client Bêta</td>
            <td>Auto-entrepreneur</td>
            <td>Inactive</td>
            <td>2023-03-10</td>
          </tr>
          <tr>
            <td>Société Gamma</td>
            <td>SAS</td>
            <td>Active</td>
            <td>2021-07-22</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
