import { Receipt } from 'lucide-react';

export default function InvoicesPage() {
  return (
    <section className='invoices'>
      <h2 className='layout__title-with-icon'>
        <Receipt size={22} /> Factures
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
            <td>FAC-1001</td>
            <td>Entreprise Alpha</td>
            <td>2024-06-02</td>
            <td>1 200 €</td>
            <td>Payée</td>
          </tr>
          <tr>
            <td>FAC-1002</td>
            <td>Client Bêta</td>
            <td>2024-06-04</td>
            <td>2 000 €</td>
            <td>En attente</td>
          </tr>
          <tr>
            <td>FAC-1003</td>
            <td>Société Gamma</td>
            <td>2024-06-06</td>
            <td>800 €</td>
            <td>Retard</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
