import { FileText, Home, Receipt } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';

import { FetchExpensesDashboard } from '@/app/_components/fetch/expenses';
import { FetchIncomesDashboard } from '@/app/_components/fetch/incomes';
import { formatNumberToFrench } from '@/utils/helpers/number';
import { useSession } from '@/utils/lib/better-auth/auth-client';
import useMenuStore from '@/utils/stores/menuStore';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { expenses, loading: loadingExpenses } = FetchExpensesDashboard(0);
  const { incomes, loading: loadingIncomes } = FetchIncomesDashboard(0);
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || '';
  const menuStore = useMenuStore();
  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
        <Home size={22} /> {t('common.dashboard')}
      </h2>
      <h1 className='text-2xl font-bold text-neutral-800 dark:text-neutral-50'>
        {t('common.welcome')}, {userName} 👋
      </h1>
      <div className='flex gap-4'>
        <div className='bg-neutral-800 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-800 p-4 rounded-lg flex flex-col justify-center items-start'>
          <h3 className='font-bold'>{t('dashboard.balance')}</h3>
          <p>3 200 €</p>
        </div>
        <div className='bg-neutral-800 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-800 p-4 rounded-lg flex flex-col justify-center items-start'>
          <h3 className='font-bold'>{t('dashboard.totalExpenses')}</h3>
          {loadingExpenses ? (
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
        <div className='bg-neutral-800 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-800 p-4 rounded-lg flex flex-col justify-center items-start'>
          <h3 className='font-bold'>{t('dashboard.totalRecettes')}</h3>
          {loadingIncomes ? (
            <p>Chargement...</p>
          ) : incomes.length > 0 ? (
            <p>
              {formatNumberToFrench(
                incomes.reduce((acc, income) => acc + income.amount, 0),
              )}{' '}
              €
            </p>
          ) : (
            <p>Aucun revenu</p>
          )}
        </div>
        <div className='bg-neutral-800 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-800 p-4 rounded-lg flex flex-col justify-center items-start'>
          <h3 className='font-bold'>{t('dashboard.pendingInvoices')}</h3>
          <p>4</p>
        </div>
        <div className='bg-neutral-800 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-800 p-4 rounded-lg flex flex-col justify-center items-start'>
          <h3 className='font-bold'>{t('dashboard.pendingBills')}</h3>
          <p>2</p>
        </div>
      </div>
      <div className='flex gap-4'>
        <button onClick={() => menuStore.setCurrentKey('estimates')}>
          <div className='bg-violet-300 hover:bg-violet-400 transition-all dark:bg-violet-800 text-neutral-50 dark:text-neutral-800 p-4 rounded-lg flex flex-col justify-center items-start cursor-pointer'>
            <FileText />
            <h3 className='font-bold'>Créer un nouveau devis</h3>
          </div>
        </button>
        <button onClick={() => menuStore.setCurrentKey('invoices')}>
          <div className='bg-orange-300 hover:bg-orange-400 transition-all dark:bg-orange-800 text-neutral-50 dark:text-neutral-800 p-4 rounded-lg flex flex-col justify-center items-start cursor-pointer'>
            <Receipt />
            <h3 className='font-bold'>Créer une nouvelle facture</h3>
          </div>
        </button>
      </div>
    </section>
  );
}
