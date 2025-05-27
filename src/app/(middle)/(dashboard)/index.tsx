import { Home } from 'lucide-react';

import '@/styles/pages/middle/dashboard/index.scss';

import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <section className='dashboard'>
      <h2 className='layout__title-with-icon text-3xl font-bold underline'>
        <Home size={22} /> {t('common.dashboard')}
      </h2>
      <div style={{ display: 'flex', gap: 24 }}>
        <div
          style={{
            background: 'var(--border-color)',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h3>{t('dashboard.balance')}</h3>
          <p>3 200 €</p>
        </div>
        <div
          style={{
            background: 'var(--border-color)',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h3>{t('dashboard.totalExpenses')}</h3>
          <p>3 200 €</p>
        </div>
        <div
          style={{
            background: 'var(--border-color)',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h3>{t('dashboard.totalRecettes')}</h3>
          <p>5 800 €</p>
        </div>
        <div
          style={{
            background: 'var(--border-color)',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h3>{t('dashboard.pendingInvoices')}</h3>
          <p>4</p>
        </div>
        <div
          style={{
            background: 'var(--border-color)',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h3>{t('dashboard.pendingBills')}</h3>
          <p>2</p>
        </div>
      </div>
    </section>
  );
}
