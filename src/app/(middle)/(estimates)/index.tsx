import { Ellipsis, FileText, Upload } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';

import { FetchEstimates } from '@/app/_components/fetch/estimates';
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
import { Entity, Estimate } from '@/app/generated/prisma';
import { formatDateToFrenchShort } from '@/utils/helpers/date';
import { formatNumberToFrench } from '@/utils/helpers/number';
import useMenuStore from '@/utils/stores/menuStore';

interface EstimateWithRelations extends Estimate {
  entity: Entity | null;
}

export default function EstimatesPage() {
  const { t } = useTranslation();
  const menuStore = useMenuStore();
  const { estimates, loading } = FetchEstimates();

  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
        <FileText size={22} /> {t('navigation.estimates')}
      </h2>
      <div className='flex gap-2'>
        <Button>
          <Upload size={16} /> Importer
        </Button>
        <Button onClick={() => menuStore.setCurrentKey('new-estimate')}>
          <FileText size={16} /> {t('navigation.newEstimate')}
        </Button>
      </div>
      <Table>
        <TableCaption>La liste de vos derniers devis</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Date</TableHead>
            <TableHead>Entitée</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className='text-right'>Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(estimates as EstimateWithRelations[]).map((estimate) => (
            <TableRow key={estimate.id}>
              <TableCell className='font-medium'>
                {formatDateToFrenchShort(estimate.createdAt.toString())}
              </TableCell>
              <TableCell>{estimate.entity?.name || 'Aucune entitée'}</TableCell>
              <TableCell>
                {t(`status.${estimate.status.toLowerCase()}`)}
              </TableCell>
              <TableCell className='text-right'>
                {formatNumberToFrench(estimate.totalAmount)} €
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
              ) : estimates.length > 0 ? (
                <p>
                  {formatNumberToFrench(
                    estimates.reduce(
                      (acc, estimate) => acc + estimate.totalAmount,
                      0,
                    ),
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
