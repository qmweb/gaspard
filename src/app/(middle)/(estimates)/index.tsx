import { pdf } from '@react-pdf/renderer';
import {
  BadgeCheck,
  CircleX,
  Download,
  Ellipsis,
  FileText,
  SendHorizonal,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

import { useTranslation } from '@/hooks/useTranslation';

import { FetchEstimates } from '@/app/_components/fetch/estimates';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/_components/ui/alert-dialog';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Skeleton } from '@/app/_components/ui/skeleton';
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
import {
  Entity,
  Estimate,
  EstimateItem,
  EstimateStatus,
  Organization,
} from '@/app/generated/prisma';
import { formatDateToFrenchShort } from '@/utils/helpers/date';
import { formatNumberToFrench } from '@/utils/helpers/number';
import { useOrganization } from '@/utils/providers/OrganizationProvider';
import useMenuStore from '@/utils/stores/menuStore';

import MyDocument from './pdf';

interface EstimateWithRelations extends Estimate {
  entity: Entity | null;
  organization?: Organization | null;
  items: EstimateItem[];
}

function EditMenu({
  estimate,
  onEstimateDeleted,
  onDownloadPDF,
}: {
  estimate: EstimateWithRelations;
  onEstimateDeleted: () => void;
  onDownloadPDF: (estimate: EstimateWithRelations) => void;
}) {
  const { t } = useTranslation();
  const menuStore = useMenuStore();
  const { currentOrganization } = useOrganization();

  const handleDeleteEstimate = async (id: string) => {
    if (!currentOrganization) return;
    const response = await fetch(
      `/api/estimates/${id}?organizationId=${currentOrganization.id}`,
      {
        method: 'DELETE',
      },
    );

    if (response.ok) {
      onEstimateDeleted();
    } else {
      alert('Échec de la suppression du devis');
    }
  };

  const handleUpdateStatus = async (id: string, status: EstimateStatus) => {
    if (!currentOrganization) return;
    const response = await fetch(`/api/estimates/status/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        organizationId: currentOrganization.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      onEstimateDeleted();
    } else {
      alert('Échec de la mise à jour du statut du devis');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Ellipsis size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(estimate.id, 'DRAFT')}
              >
                <FileText className='size-4' /> {t('status.draft')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(estimate.id, 'SENT')}
              >
                <SendHorizonal className='size-4' /> {t('status.sent')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(estimate.id, 'ACCEPTED')}
              >
                <BadgeCheck className='size-4' /> {t('status.accepted')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(estimate.id, 'REJECTED')}
              >
                <CircleX className='size-4' /> {t('status.rejected')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(estimate.id, 'EXPIRED')}
              >
                <Upload className='size-4' /> {t('status.expired')}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() => menuStore.setCurrentKey('edit-estimate', estimate.id)}
        >
          {t('navigation.editEstimate')}
        </DropdownMenuItem>
        <DropdownMenuItem>{t('estimates.toInvoice')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownloadPDF(estimate)}>
          <Download className='mr-2' /> {t('common.downloadPDF')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className='text-red-500 hover:bg-red-100 dark:hover:bg-red-800'
            >
              {t('navigation.deleteEstimate')}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera
                définitivement ce devis.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteEstimate(estimate.id)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function EstimatesPage() {
  const { t } = useTranslation();
  const menuStore = useMenuStore();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { estimates, loading } = FetchEstimates(refreshTrigger);

  const handleEstimateDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDownloadPDF = async (estimate: EstimateWithRelations) => {
    try {
      // Generate PDF blob
      const blob = await pdf(<MyDocument estimate={estimate} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${estimate.number || estimate.id}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

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
                {estimate.status === 'DRAFT' ? (
                  <Badge variant='outline'>
                    <FileText className='mr-1 size-4' />
                    {t(`status.${estimate.status.toLowerCase()}`)}
                  </Badge>
                ) : estimate.status === 'SENT' ? (
                  <Badge variant='outline' className='bg-orange-400 text-white'>
                    <SendHorizonal className='mr-1 size-4' />
                    {t(`status.${estimate.status.toLowerCase()}`)}
                  </Badge>
                ) : estimate.status === 'ACCEPTED' ? (
                  <Badge variant='outline' className='bg-green-400 text-white'>
                    <BadgeCheck className='mr-1 size-4' />
                    {t(`status.${estimate.status.toLowerCase()}`)}
                  </Badge>
                ) : estimate.status === 'REJECTED' ? (
                  <Badge variant='outline' className='bg-red-400 text-white'>
                    <CircleX className='mr-1 size-4' />
                    {t(`status.${estimate.status.toLowerCase()}`)}
                  </Badge>
                ) : estimate.status === 'EXPIRED' ? (
                  <Badge variant='outline' className='bg-yellow-400 text-white'>
                    <Upload className='mr-1 size-4' />
                    {t(`status.${estimate.status.toLowerCase()}`)}
                  </Badge>
                ) : (
                  <Badge variant='destructive'>
                    <FileText className='mr-1 size-4' />
                    Error
                  </Badge>
                )}
              </TableCell>
              <TableCell className='text-right'>
                {formatNumberToFrench(estimate.totalAmount)} €
              </TableCell>
              <TableCell className='text-right w-[25px]'>
                <EditMenu
                  estimate={estimate}
                  onEstimateDeleted={handleEstimateDeleted}
                  onDownloadPDF={handleDownloadPDF}
                />
              </TableCell>
            </TableRow>
          ))}
          {loading && (
            <TableRow>
              <TableCell>
                <Skeleton className='w-full h-8' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-8 w-full' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-8 w-full' />
              </TableCell>
              <TableCell className='text-right'>
                <Skeleton className='h-8 w-full' />
              </TableCell>
              <TableCell className='text-right w-[25px]'>
                <Skeleton className='h-8 w-full' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className='text-right'>
              {' '}
              {estimates.length > 0 ? (
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
                <p>Aucun Devis réalisé</p>
              )}
            </TableCell>
            <TableCell className='text-right w-[25px]'></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
}
