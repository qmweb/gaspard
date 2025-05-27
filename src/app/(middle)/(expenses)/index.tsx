import { Dropdown } from 'antd';
import { Plus, Upload, Wallet } from 'lucide-react';

import '@/styles/pages/middle/expenses/index.scss';
import '@/styles/ui/table/table.scss';

import { useTranslation } from '@/hooks/useTranslation';

import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';

export default function ExpensesPage() {
  const { t } = useTranslation();
  return (
    <section className='expenses'>
      <h2 className='layout__title-with-icon'>
        <Wallet size={22} /> {t('navigation.expenses')}
      </h2>
      <div className='flex gap-2'>
        <ButtonPrimary>
          <Upload size={16} /> Importer
        </ButtonPrimary>
        <Dropdown
          menu={{
            items: [
              { key: 'normal', label: 'Dépense unique' },
              { key: 'recurrent', label: 'Dépense récurrente' },
            ],
          }}
          trigger={['click']}
        >
          <ButtonPrimary>
            <Plus size={16} /> Créer
          </ButtonPrimary>
        </Dropdown>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Montant</th>
            <th>Catégorie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-06-01</td>
            <td>Achat matériel</td>
            <td>1 200 €</td>
            <td>Matériel</td>
          </tr>
          <tr>
            <td>2024-06-03</td>
            <td>Abonnement logiciel</td>
            <td>99 €</td>
            <td>Logiciel</td>
          </tr>
          <tr>
            <td>2024-06-05</td>
            <td>Frais de déplacement</td>
            <td>150 €</td>
            <td>Déplacement</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
