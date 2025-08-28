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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, Save } from 'lucide-react';
import { CalendarIcon, GripVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@/hooks/useTranslation';

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
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing hover:text-gray-600'
        >
          <GripVertical size={16} />
        </div>
      </TableCell>
      <TableCell>
        <div className='space-y-2'>
          <Input
            placeholder={t('estimates.articleName')}
            value={article.name}
            onChange={(e) =>
              onArticleChange(article.id, 'name', e.target.value)
            }
          />
          <Textarea
            placeholder={t('estimates.articleDescription')}
            value={article.description}
            onChange={(e) =>
              onArticleChange(article.id, 'description', e.target.value)
            }
            rows={2}
          />
        </div>
      </TableCell>
      <TableCell>
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
      <TableCell>
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
    }
  };

  if (loading) {
    return (
      <section className='flex flex-col gap-4 p-4'>
        <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
          <FileText size={22} /> {t('estimates.updateEstimate')}
        </h2>
        <div className='flex items-center justify-center h-64'>
          <p>Chargement...</p>
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
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        <div className='flex flex-col gap-3'>
          <Label htmlFor='entity' className='px-1'>
            {t('estimates.selectEntity')}
          </Label>
          <div className='relative flex gap-2'>
            <Button
              variant='outline'
              className='w-full justify-start'
              onClick={() => setIsEntityDialogOpen(true)}
            >
              {selectedEntity
                ? selectedEntity?.name
                : t('estimates.selectEntity')}
            </Button>
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
        </div>
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
      </div>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        <div className='flex flex-col gap-3'>
          <Label htmlFor='estimate-number' className='px-1'>
            {t('estimates.estimateNumber')}
          </Label>
          <Input
            id='estimate-number'
            placeholder={t('estimates.enterEstimateNumber')}
            value='DEV-000001'
            disabled
          />
        </div>

        <div className='flex flex-col gap-3'>
          <Label htmlFor='date' className='px-1'>
            {t('estimates.actions')}
          </Label>
          <div className='relative flex gap-2'>
            <Button onClick={handleUpdateEstimate}>
              <Save /> {t('common.update')}
            </Button>
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
