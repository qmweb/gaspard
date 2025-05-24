import { FileText } from 'lucide-react';

import '@/client/styles/components/ui/table/table.scss';

export default function ReportsPage() {
  return (
    <section className='reports'>
      <h2 className='layout__title-with-icon'>
        <FileText size={22} /> Rapports
      </h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Nom du rapport</th>
            <th>Période</th>
            <th>Status</th>
            <th>Date de génération</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bilan Annuel</td>
            <td>2023</td>
            <td>Généré</td>
            <td>2024-01-10</td>
          </tr>
          <tr>
            <td>Rapport Mensuel</td>
            <td>Mai 2024</td>
            <td>En attente</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
