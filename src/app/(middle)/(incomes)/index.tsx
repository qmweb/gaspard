import { Ellipsis, TrendingUp, Upload } from 'lucide-react';
import { useState } from 'react';

import { useTranslation } from '@/hooks/useTranslation';

import { FetchIncomes } from '@/app/_components/fetch/incomes';
import UniqueIncomeDialog from '@/app/_components/incomes/UniqueIncomeDialog';
import { Button } from '@/app/_components/ui/button';
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
import { Income } from '@/app/generated/prisma';
import { Entity } from '@/app/generated/prisma';
import { formatDateToFrenchShort } from '@/utils/helpers/date';
import { formatNumberToFrench } from '@/utils/helpers/number';

interface IncomeWithRelations extends Income {
  entity: Entity | null;
}

export default function IncomesPage() {
  const { t } = useTranslation();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshCategoriesTrigger, setRefreshCategoriesTrigger] = useState(0);
  const { incomes, loading } = FetchIncomes(refreshTrigger);
  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
        <TrendingUp size={22} /> {t('navigation.incomes')}
      </h2>
      <div className='flex gap-2'>
        <Button>
          <Upload size={16} /> Importer
        </Button>
        <UniqueIncomeDialog
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
          refreshTrigger={refreshCategoriesTrigger}
        />
      </div>
      <Table>
        <TableCaption>La liste de vos derniers revenus</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Date</TableHead>
            <TableHead>Entitée</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className='text-right'>Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(incomes as IncomeWithRelations[]).map((income) => (
            <TableRow key={income.id}>
              <TableCell className='font-medium'>
                {formatDateToFrenchShort(income.date.toString())}
              </TableCell>
              <TableCell>{income.entity?.name || 'Aucune entitée'}</TableCell>
              <TableCell>{income.description}</TableCell>
              <TableCell className='text-right'>
                {formatNumberToFrench(income.amount)} €
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
              ) : incomes.length > 0 ? (
                <p>
                  {formatNumberToFrench(
                    incomes.reduce((acc, expense) => acc + expense.amount, 0),
                  )}{' '}
                  €
                </p>
              ) : (
                <p>Aucune entrée réalisée</p>
              )}
            </TableCell>
            <TableCell className='text-right w-[25px]'></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
}
