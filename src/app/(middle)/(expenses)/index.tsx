'use client';
import { Dropdown } from 'antd';
import { ListPlus, Plus, Upload, Wallet } from 'lucide-react';
import { useState } from 'react';

import '@/styles/pages/middle/expenses/index.scss';
import '@/styles/ui/table/table.scss';

import { Expense, ExpenseCategory } from '@/app/generated/prisma';
import { formatDateToFrenchShort } from '@/utils/helpers/date';
import { formatNumberToFrench } from '@/utils/helpers/number';

interface ExpenseWithRelations extends Expense {
  category: ExpenseCategory | null;
}

import { useTranslation } from '@/hooks/useTranslation';

import ExpenseCategoryDialog from '@/app/_components/expenses/ExpenseCategoryDialog';
import UniqueExpenseDialog from '@/app/_components/expenses/UniqueExpenseDialog';
import { FetchExpenses } from '@/app/_components/fetch/expenses';
import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';
import Loader from '@/app/_components/ui/Loader/Loader';
export default function ExpensesPage() {
  const { t } = useTranslation();
  const [newExpenseDialogOpen, setNewExpenseDialogOpen] = useState(false);
  const [newExpenseCategoryDialogOpen, setNewExpenseCategoryDialogOpen] =
    useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { expenses, loading } = FetchExpenses(refreshTrigger);

  const handleDialogClose = () => {
    setNewExpenseDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1); // Trigger a refresh when dialog closes
  };

  const handleExpenseCategoryDialogClose = () => {
    setNewExpenseCategoryDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1); // Trigger a refresh when dialog closes
  };

  return (
    <section className='expenses'>
      <h2 className='layout__title-with-icon'>
        <Wallet size={22} /> {t('navigation.expenses')}
      </h2>
      <div className='flex gap-2'>
        <ButtonPrimary>
          <Upload size={16} /> Importer
        </ButtonPrimary>
        <Dropdown
          menu={{
            items: [
              {
                key: 'normal',
                label: 'Dépense unique',
                onClick: () => {
                  setNewExpenseDialogOpen(true);
                },
              },
              { key: 'recurrent', label: 'Dépense récurrente' },
            ],
          }}
          trigger={['click']}
        >
          <ButtonPrimary>
            <Plus size={16} /> Créer
          </ButtonPrimary>
        </Dropdown>
        <ButtonPrimary onClick={() => setNewExpenseCategoryDialogOpen(true)}>
          <ListPlus size={16} /> Créer une catégorie
        </ButtonPrimary>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Montant</th>
            <th>Catégorie</th>
          </tr>
        </thead>
        <tbody>
          {(expenses as ExpenseWithRelations[]).map((expense) => (
            <tr key={expense.id}>
              <td>{formatDateToFrenchShort(expense.createdAt.toString())}</td>
              <td>{expense.description}</td>
              <td>{formatNumberToFrench(expense.amount)} €</td>
              <td>{expense.category?.name}</td>
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan={4}>
                <Loader />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ExpenseCategoryDialog
        open={newExpenseCategoryDialogOpen}
        onClose={handleExpenseCategoryDialogClose}
      />
      <UniqueExpenseDialog
        open={newExpenseDialogOpen}
        onClose={handleDialogClose}
      />
    </section>
  );
}
