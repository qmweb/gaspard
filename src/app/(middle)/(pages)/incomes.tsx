import { TrendingUp } from 'lucide-react';

export default function IncomesPage() {
  return (
    <section className='incomes'>
      <h2 className='layout__title-with-icon'>
        <TrendingUp size={22} /> Recettes
      </h2>
      <table>
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
