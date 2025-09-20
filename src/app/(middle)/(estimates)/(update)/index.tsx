'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CalendarIcon,
  FileText,
  GripVertical,
  Loader2Icon,
  Save,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import EntitySelect from '@/app/_components/estimates/EntitySelect';
import { Button } from '@/app/_components/ui/button';
import { Calendar } from '@/app/_components/ui/calendar';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/_components/ui/popover';
import { Skeleton } from '@/app/_components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table';
import { Textarea } from '@/app/_components/ui/textarea';
import { useTranslation } from '@/utils/hooks/useTranslation';
import { useOrganization } from '@/utils/providers/OrganizationProvider';
import useMenuStore from '@/utils/stores/menuStore';

function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

// Sortable Article Row Component
function SortableArticleRow({
  article,
  onArticleChange,
  onRemoveArticle,
  t,
}: {
  article: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    description: string;
  };
  onArticleChange: (
    id: string,
    field: 'name' | 'quantity' | 'unitPrice' | 'description',
    value: string | number,
  ) => void;
  onRemoveArticle: (id: string) => void;
  t: (key: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className='w-8 pl-2'>
        <Button
          variant='ghost'
          size='icon'
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing h-8 w-8 p-0'
        >
          <GripVertical className='h-4 w-4 text-neutral-400' />
        </Button>
      </TableCell>
      <TableCell className='flex flex-col gap-4'>
        <Input
          placeholder={t('estimates.articleName')}
          value={article.name}
          onChange={(e) => onArticleChange(article.id, 'name', e.target.value)}
        />
        <Textarea
          placeholder={t('estimates.articleDescription')}
          value={article.description}
          onChange={(e) =>
            onArticleChange(article.id, 'description', e.target.value)
          }
          rows={2}
        />
      </TableCell>
      <TableCell className='align-top'>
        <Input
          type='number'
          placeholder={t('common.quantity')}
          value={article.quantity}
          onChange={(e) =>
            onArticleChange(
              article.id,
              'quantity',
              parseFloat(e.target.value) || 0,
            )
          }
          min='0'
          step='1'
        />
      </TableCell>
      <TableCell className='align-top'>
        <Input
          type='number'
          placeholder={t('common.unitPrice')}
          value={article.unitPrice}
          onChange={(e) =>
            onArticleChange(
              article.id,
              'unitPrice',
              parseFloat(e.target.value) || 0,
            )
          }
          min='0'
          step='0.01'
        />
      </TableCell>
      <TableCell className='text-right'>
        {(article.quantity * article.unitPrice).toFixed(2)} €
      </TableCell>
      <TableCell className='w-[25px]'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onRemoveArticle(article.id)}
          className='h-8 w-8 p-0'
        >
          <Trash2 size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function UpdateEstimatePage() {
  const { t } = useTranslation();
  const menuStore = useMenuStore();
  const { currentOrganization } = useOrganization();
  const estimateId = menuStore.estimateId;

  // États pour les données du devis
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isEntityDialogOpen, setIsEntityDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [articles, setArticles] = useState<
    Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      description: string;
    }>
  >([]);
  const [number, setNumber] = useState<string>();

  // Configuration pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Charger les données du devis existant
  useEffect(() => {
    if (!estimateId || !currentOrganization) return;

    const fetchEstimate = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/estimates/${estimateId}?organizationId=${currentOrganization.id}`,
        );

        if (!response.ok) {
          throw new Error('Erreur lors du chargement du devis');
        }

        const estimate = await response.json();

        // Précharger les données
        setSelectedEntity(estimate.entity || null);
        setDate(new Date(estimate.validFrom));
        setExpirationDate(new Date(estimate.validUntil));
        setNumber(estimate.number);
        if (estimate.expirationDate) {
          setExpirationDate(new Date(estimate.expirationDate));
        }

        // Convertir les items du devis en articles
        if (estimate.items && estimate.items.length > 0) {
          const loadedArticles = estimate.items.map(
            (
              item: {
                id?: string;
                name: string;
                description?: string;
                quantity: number;
                unitPrice: number;
              },
              index: number,
            ) => ({
              id: item.id || `article-${index}`,
              name: item.name || '',
              description: item.description || '',
              quantity: item.quantity || 0,
              unitPrice: item.unitPrice || 0,
            }),
          );
          setArticles(loadedArticles);
        } else {
          // Ajouter un article vide si aucun item n'existe
          setArticles([
            {
              id: 'article-1',
              name: '',
              description: '',
              quantity: 1,
              unitPrice: 0,
            },
          ]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement du devis');
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [estimateId, currentOrganization]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setArticles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddArticle = () => {
    const newArticle = {
      id: `article-${Date.now()}`,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    setArticles([...articles, newArticle]);
  };

  const handleRemoveArticle = (id: string) => {
    if (articles.length > 1) {
      setArticles(articles.filter((article) => article.id !== id));
    }
  };

  const handleArticleChange = (
    id: string,
    field: 'name' | 'quantity' | 'unitPrice' | 'description',
    value: string | number,
  ) => {
    setArticles(
      articles.map((article) =>
        article.id === id ? { ...article, [field]: value } : article,
      ),
    );
  };

  const handleUpdateEstimate = async () => {
    if (!currentOrganization || !estimateId) {
      toast.error('Organisation ou ID du devis manquant');
      return;
    }

    if (!selectedEntity) {
      toast.error('Veuillez sélectionner une entité');
      return;
    }

    if (articles.length === 0 || articles.every((a) => !a.name.trim())) {
      toast.error('Veuillez ajouter au moins un article');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/estimates/${estimateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: currentOrganization.id,
          entityId: selectedEntity?.id,
          date: date.toISOString(),
          expirationDate: expirationDate?.toISOString(),
          articles: articles.filter((a) => a.name.trim()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      toast.success('Devis mis à jour avec succès');
      menuStore.setCurrentKey('estimates');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la mise à jour',
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className='flex flex-col gap-4 p-4'>
        <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
          <FileText size={22} /> {t('estimates.updateEstimate')}
        </h2>
        <div className='flex gap-8 w-full justify-between'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='entity' className='px-1'>
              {t('estimates.client')}
            </Label>
            <Skeleton className='h-12 w-80'></Skeleton>
          </div>
          <div className='flex gap-2'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='date' className='px-1'>
                {t('estimates.date')}
              </Label>
              <div className='relative flex gap-2'>
                <Skeleton className='h-10 w-48'></Skeleton>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='expiration-date' className='px-1'>
                {t('estimates.expirationDate')}
              </Label>
              <div className='relative flex gap-2'>
                <Skeleton className='h-10 w-48'></Skeleton>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='estimate-number' className='px-1'>
                {t('estimates.estimateNumber')}
              </Label>
              <Skeleton className='h-10 w-48'></Skeleton>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='date' className='px-1'>
              {t('estimates.actions')}
            </Label>
            <div className='relative flex gap-2'>
              <Skeleton className='h-10 w-12'></Skeleton>
              <Skeleton className='h-10 w-12'></Skeleton>
            </div>
          </div>
        </div>
        <div className='flex gap-8'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-8'></TableHead>
                <TableHead>Article</TableHead>
                <TableHead>{t('common.quantity')}</TableHead>
                <TableHead>{t('common.unitPrice')}</TableHead>
                <TableHead className='text-right'>
                  {t('common.total')}
                </TableHead>
                <TableHead className='w-[25px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton className='h-10 w-full'></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-10 w-full'></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-10 w-full'></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-10 w-full'></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-10 w-full'></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-10 w-full'></Skeleton>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className='text-center'>
                  <Skeleton className='h-10 w-full'></Skeleton>
                </TableCell>
                <TableCell colSpan={2} className='text-right font-medium'>
                  <Skeleton className='h-10 w-full'></Skeleton>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>
    );
  }

  if (!estimateId) {
    return (
      <section className='flex flex-col gap-4 p-4'>
        <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
          <FileText size={22} /> {t('estimates.updateEstimate')}
        </h2>
        <div className='flex items-center justify-center h-64'>
          <p>ID du devis manquant</p>
        </div>
      </section>
    );
  }

  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
        <FileText size={22} /> {t('estimates.updateEstimate')}
      </h2>
      <div className='flex gap-8 w-full justify-between'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='entity' className='px-1'>
            {t('estimates.client')}
          </Label>
          <button id='client' onClick={() => setIsEntityDialogOpen(true)}>
            <div className='cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 p-8 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 transition-colors w-80'>
              {selectedEntity ? (
                <div className='flex flex-col items-center gap-2'>
                  <div className='text-neutral-800 dark:text-neutral-200 font-medium'>
                    {selectedEntity.name}
                  </div>
                  <div className='text-xs text-neutral-500'>
                    {t('common.update')}
                  </div>
                </div>
              ) : (
                t('estimates.selectEntity')
              )}
            </div>
          </button>
          <EntitySelect
            open={isEntityDialogOpen}
            onOpenChange={setIsEntityDialogOpen}
            onSuccess={(entity: { id: string; name: string }) => {
              setSelectedEntity({ id: entity.id, name: entity.name });
              setIsEntityDialogOpen(false);
            }}
            currentEntity={selectedEntity?.id}
          />
        </div>
        <div className='flex gap-2'>
          <div className='flex flex-col gap-3'>
            <Label htmlFor='date' className='px-1'>
              {t('estimates.date')}
            </Label>
            <div className='relative flex gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='date'
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {isValidDate(date)
                      ? formatDate(date)
                      : t('estimates.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                        const newExpirationDate = new Date(selectedDate);
                        newExpirationDate.setMonth(
                          newExpirationDate.getMonth() + 1,
                        );
                        setExpirationDate(newExpirationDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <Label htmlFor='expiration-date' className='px-1'>
              {t('estimates.expirationDate')}
            </Label>
            <div className='relative flex gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='expiration-date'
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {isValidDate(expirationDate)
                      ? formatDate(expirationDate)
                      : t('estimates.selectExpirationDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <Label htmlFor='estimate-number' className='px-1'>
              {t('estimates.estimateNumber')}
            </Label>
            <Input
              id='estimate-number'
              placeholder={t('estimates.enterEstimateNumber')}
              value={number}
              disabled
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='date' className='px-1'>
            {t('estimates.actions')}
          </Label>
          <div className='relative flex gap-2'>
            {updating ? (
              <Button disabled>
                <Loader2Icon className='animate-spin' />
                {t('common.updating')}
              </Button>
            ) : (
              <Button onClick={handleUpdateEstimate}>
                <Save /> {t('common.update')}
              </Button>
            )}
            <Button
              variant='outline'
              onClick={() => menuStore.setCurrentKey('estimates')}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </div>
      <div className='flex gap-8'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-8'></TableHead>
                <TableHead>Article</TableHead>
                <TableHead>{t('common.quantity')}</TableHead>
                <TableHead>{t('common.unitPrice')}</TableHead>
                <TableHead className='text-right'>
                  {t('common.total')}
                </TableHead>
                <TableHead className='w-[25px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center'>
                    {t('common.noItems')}
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={articles.map((article) => article.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {articles.map((article) => (
                    <SortableArticleRow
                      key={article.id}
                      article={article}
                      onArticleChange={handleArticleChange}
                      onRemoveArticle={handleRemoveArticle}
                      t={t}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className='text-center'>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={handleAddArticle}
                  >
                    {t('estimates.addArticle')}
                  </Button>
                </TableCell>
                <TableCell colSpan={2} className='text-right font-medium'>
                  {articles
                    .reduce(
                      (acc, article) =>
                        acc + article.unitPrice * article.quantity,
                      0,
                    )
                    .toLocaleString()}{' '}
                  €
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </DndContext>
      </div>
    </section>
  );
}
