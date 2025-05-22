import { Home } from 'lucide-react';

export default function DashboardPage() {
  return (
    <section className='dashboard'>
      <h2 className='layout__title-with-icon'>
        <Home size={22} /> Tableau de bord
      </h2>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h3>Solde actuel</h3>
          <p>3 200 €</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h3>Total Dépenses</h3>
          <p>3 200 €</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h3>Total Recettes</h3>
          <p>5 800 €</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h3>Devis en attente</h3>
          <p>4</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h3>Factures en attente</h3>
          <p>2</p>
        </div>
      </div>
    </section>
  );
}
