import { Home } from 'lucide-react';

import '@/styles/pages/middle/dashboard/index.scss';

import { useTranslation } from '@/hooks/useTranslation';
import { FetchExpensesDashboard } from '@/app/_components/fetch/expenses';
import { formatNumberToFrench } from '@/utils/helpers/number';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { expenses, loading } = FetchExpensesDashboard(0);
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
          {loading ? (
            <p>Chargement...</p>
          ) : expenses.length > 0 ? (
            <p>
              {formatNumberToFrench(
                expenses.reduce((acc, expense) => acc + expense.amount, 0),
              )}{' '}
              €
            </p>
          ) : (
            <p>Aucune dépense réalisée</p>
          )}
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
