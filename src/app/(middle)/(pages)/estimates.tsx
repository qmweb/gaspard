import { FileText } from 'lucide-react';

export default function EstimatesPage() {
  return (
    <section className='estimates'>
      <h2 className='layout__title-with-icon'>
        <FileText size={22} /> Devis
      </h2>
      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DEV-001</td>
            <td>Entreprise Alpha</td>
            <td>2024-06-01</td>
            <td>1 000 €</td>
            <td>Envoyé</td>
          </tr>
          <tr>
            <td>DEV-002</td>
            <td>Client Bêta</td>
            <td>2024-06-03</td>
            <td>2 500 €</td>
            <td>Accepté</td>
          </tr>
          <tr>
            <td>DEV-003</td>
            <td>Société Gamma</td>
            <td>2024-06-05</td>
            <td>800 €</td>
            <td>Refusé</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
