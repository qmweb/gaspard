import { Wallet } from 'lucide-react';

export default function ExpensesPage() {
  return (
    <section className='expenses'>
      <h2 className='layout__title-with-icon'>
        <Wallet size={22} /> Dépenses
      </h2>
      <table>
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
