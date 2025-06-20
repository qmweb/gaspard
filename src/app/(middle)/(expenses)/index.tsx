'use client';
import { ListPlus, Upload, Wallet } from 'lucide-react';
import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table';
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
import { Button } from '@/app/_components/ui/button';
export default function ExpensesPage() {
  const { t } = useTranslation();
  const [newExpenseCategoryDialogOpen, setNewExpenseCategoryDialogOpen] =
    useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { expenses, loading } = FetchExpenses(refreshTrigger);

  const handleExpenseCategoryDialogClose = () => {
    setNewExpenseCategoryDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1); // Trigger a refresh when dialog closes
  };

  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
        <Wallet size={22} /> {t('navigation.expenses')}
      </h2>
      <div className='flex gap-2'>
        <Button>
          <Upload size={16} /> Importer
        </Button>
        <UniqueExpenseDialog />
        <Button onClick={() => setNewExpenseCategoryDialogOpen(true)}>
          <ListPlus size={16} /> Créer une catégorie
        </Button>
      </div>
      <Table>
        <TableCaption>La liste de vos dernières dépenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className='text-right'>Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(expenses as ExpenseWithRelations[]).map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className='font-medium'>
                {formatDateToFrenchShort(expense.date.toString())}
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category?.name}</TableCell>
              <TableCell className='text-right'>
                {formatNumberToFrench(expense.amount)} €
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className='text-right'>
              {' '}
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
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <ExpenseCategoryDialog
        open={newExpenseCategoryDialogOpen}
        onClose={handleExpenseCategoryDialogClose}
      />
    </section>
  );
}
