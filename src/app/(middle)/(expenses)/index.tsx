'use client';
import { Ellipsis, Upload, Wallet } from 'lucide-react';
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

import ExpenseCategoryDialog from '@/app/_components/expenses/ExpenseCategoryDialog';
import UniqueExpenseDialog from '@/app/_components/expenses/UniqueExpenseDialog';
import { FetchExpenses } from '@/app/_components/fetch/expenses';
import { Button } from '@/app/_components/ui/button';
import { useTranslation } from '@/utils/hooks/useTranslation';
export default function ExpensesPage() {
  const { t } = useTranslation();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshCategoriesTrigger, setRefreshCategoriesTrigger] = useState(0);
  const { expenses, loading } = FetchExpenses(refreshTrigger);

  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
        <Wallet size={22} /> {t('navigation.expenses')}
      </h2>
      <div className='flex gap-2'>
        <Button>
          <Upload size={16} /> Importer
        </Button>
        <UniqueExpenseDialog
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
          refreshTrigger={refreshCategoriesTrigger}
        />
        <ExpenseCategoryDialog
          onSuccess={() => setRefreshCategoriesTrigger((prev) => prev + 1)}
        />
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
              <TableCell className='text-right w-[25px]'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    // Handle edit action here
                  }}
                >
                  <Ellipsis size={16} />
                </Button>
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
            <TableCell className='text-right w-[25px]'></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
}
