import { Home } from 'lucide-react';

export default function DashboardPage() {
  return (
    <section className='dashboard'>
      <h2 className='layout__title-with-icon'>
        <Home size={22} /> Tableau de bord
      </h2>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h3>Total Dépenses</h3>
          <p>3 200 €</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h3>Total Recettes</h3>
          <p>5 800 €</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h3>Factures en attente</h3>
          <p>2</p>
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <h3>Activité récente</h3>
        <ul>
          <li>Facture #1234 payée</li>
          <li>Dépense "Achat matériel" ajoutée</li>
          <li>Recette "Vente produit" enregistrée</li>
        </ul>
      </div>
    </section>
  );
}
