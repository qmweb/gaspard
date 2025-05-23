import { Dropdown } from 'antd';
import { Plus, TrendingUp, Upload } from 'lucide-react';

import '@/styles/pages/middle/incomes/index.scss';
import '@/styles/ui/table/table.scss';

import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';

export default function IncomesPage() {
  return (
    <section className='incomes'>
      <h2 className='layout__title-with-icon'>
        <TrendingUp size={22} /> Recettes
      </h2>
      <div className='flex gap-2'>
        <ButtonPrimary>
          <Upload size={16} /> Importer
        </ButtonPrimary>
        <Dropdown
          menu={{
            items: [
              { key: 'normal', label: 'Revenu unique' },
              { key: 'recurrent', label: 'Revenu récurrent' },
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
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-06-02</td>
            <td>Vente produit A</td>
            <td>2 000 €</td>
            <td>Ventes</td>
          </tr>
          <tr>
            <td>2024-06-04</td>
            <td>Prestation de service</td>
            <td>1 500 €</td>
            <td>Services</td>
          </tr>
          <tr>
            <td>2024-06-06</td>
            <td>Subvention</td>
            <td>500 €</td>
            <td>Subventions</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
