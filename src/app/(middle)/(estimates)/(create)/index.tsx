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
import { useState } from 'react';
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
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'z-50' : ''}
    >
      <TableCell className='w-8'>
        <Button
          variant='ghost'
          size='icon'
          className='cursor-grab active:cursor-grabbing h-8 w-8 p-0'
          {...attributes}
          {...listeners}
        >
          <GripVertical className='h-4 w-4 text-neutral-400' />
        </Button>
      </TableCell>
      <TableCell className='flex flex-col gap-4'>
        <Input
          placeholder={t('common.enterItemName')}
          value={article.name}
          onChange={(e) => onArticleChange(article.id, 'name', e.target.value)}
        />
        <Textarea
          placeholder={t('estimates.articleDescription')}
          className='w-full'
          rows={2}
          value={article.description}
          onChange={(e) =>
            onArticleChange(article.id, 'description', e.target.value)
          }
        />
      </TableCell>
      <TableCell className='align-top'>
        <Input
          type='number'
          placeholder={t('common.quantity')}
          value={article.quantity}
          onChange={(e) =>
            onArticleChange(article.id, 'quantity', Number(e.target.value))
          }
          min={1}
        />
      </TableCell>
      <TableCell className='align-top'>
        <div className='relative'>
          <Input
            type='number'
            placeholder={t('common.unitPrice')}
            value={article.unitPrice}
            onChange={(e) =>
              onArticleChange(article.id, 'unitPrice', Number(e.target.value))
            }
            min={0}
            step={0.01}
          />
          <span className='absolute right-2 top-1/2 transform -translate-y-1/2'>
            €
          </span>
        </div>
      </TableCell>
      <TableCell className='relative'>
        <p className='absolute right-0 '>
          {(article.quantity * article.unitPrice).toFixed(2).replace('.', ',')}€
        </p>
      </TableCell>
      <TableCell className='text-right w-[25px]'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onRemoveArticle(article.id)}
          className='text-red-500 hover:bg-red-100 dark:hover:bg-red-800'
        >
          <Trash2 size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function EstimatesPage() {
  const { t } = useTranslation();
  const { currentOrganization } = useOrganization();
  const menuStore = useMenuStore();
  const [entityDialogOpen, setEntityDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openExpirationDate, setOpenExpirationDate] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(date);
  const [monthExpiration, setMonthExpiration] = useState<Date | undefined>(
    date,
  );
  const [value, setValue] = useState(formatDate(date));
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return thirtyDaysFromNow;
  });
  const [valueExpiration, setValueExpiration] = useState(
    formatDate(expirationDate),
  );
  const [selectedEntity, setSelectedEntity] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [articles, setArticles] = useState<
    {
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      description: string;
    }[]
  >([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAddArticle = () => {
    const newArticle = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    setArticles((prev) => [...prev, newArticle]);
    console.log(articles);
  };

  const handleArticleChange = (
    id: string,
    field: 'name' | 'quantity' | 'unitPrice' | 'description',
    value: string | number,
  ) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, [field]: value } : article,
      ),
    );
  };

  const handleEntitySelect = (entity: { id: string; name: string }) => {
    setSelectedEntity(entity);
    setEntityDialogOpen(false);
  };

  const handleRemoveArticle = (id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newExpirationDate = new Date(
        date.getTime() + 30 * 24 * 60 * 60 * 1000,
      );
      setExpirationDate(newExpirationDate);
      setValueExpiration(formatDate(newExpirationDate));
      setMonthExpiration(newExpirationDate);
    }
  };

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

  const handleCreateEstimate = async () => {
    // Logic to create the estimate
    const estimateData = {
      organizationId: currentOrganization?.id,
      entityId: selectedEntity?.id,
      date: date ? date.toISOString() : null,
      validFrom: date ? date.toISOString() : null,
      validUntil: expirationDate ? expirationDate.toISOString() : null,
      articles: articles.map((article) => ({
        name: article.name,
        description: article.description,
        quantity: article.quantity,
        unitPrice: article.unitPrice,
      })),
    };
    if (!currentOrganization) return;

    try {
      const response = await fetch('/api/estimates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estimateData),
      });

      if (response.ok) {
        // Reset form and close dialog
        toast.success('Devis créée avec succès');
        menuStore.setCurrentKey('estimates');
      }

      const data = await response.json();
      if (data.error) {
        switch (data.error) {
          case 'Unauthorized':
            toast.error("Vous n'êtes pas autorisé à créer un devis");
            break;
          case 'Organization ID and Entity ID are required':
            toast.error('Veuillez sélectionner un client');
            break;
          default:
            toast.error('Erreur lors de la création du devis');
            break;
        }
      } else {
        // Optionally, handle the created estimate data
        console.log('Estimate created:', data);
      }
    } catch (error) {
      console.error('Failed to create estimate:', error);
    }
  };

  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
        <FileText size={22} /> {t('navigation.newEstimate')}
      </h2>
      <div className='flex gap-8 w-full justify-between'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='client' className='px-1'>
            {t('estimates.client')}
          </Label>
          <button id='client' onClick={() => setEntityDialogOpen(true)}>
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
            open={entityDialogOpen}
            onOpenChange={setEntityDialogOpen}
            onSuccess={handleEntitySelect}
          />
        </div>
        <div>
          <div className='flex gap-2'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='date' className='px-1'>
                {t('estimates.date')}
              </Label>
              <div className='relative flex gap-2'>
                <Input
                  defaultValue={date ? formatDate(date) : ''}
                  id='date'
                  value={value}
                  className='bg-background pr-10'
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setValue(e.target.value);
                    if (isValidDate(date)) {
                      setDate(date);
                      setMonth(date);
                      handleDateChange(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setOpen(true);
                    }
                  }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id='date-picker'
                      variant='ghost'
                      className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                    >
                      <CalendarIcon className='size-3.5' />
                      <span className='sr-only'>Select date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto overflow-hidden p-0'
                    align='end'
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode='single'
                      selected={date}
                      captionLayout='dropdown'
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        setDate(date);
                        setValue(formatDate(date));
                        handleDateChange(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='date' className='px-1'>
                {t('estimates.expirationDate')}
              </Label>
              <div className='relative flex gap-2'>
                <Input
                  defaultValue={
                    expirationDate ? formatDate(expirationDate) : ''
                  }
                  id='date'
                  value={valueExpiration}
                  className='bg-background pr-10'
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setValueExpiration(e.target.value);
                    if (isValidDate(date)) {
                      setExpirationDate(date);
                      setMonthExpiration(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setOpenExpirationDate(true);
                    }
                  }}
                />
                <Popover
                  open={openExpirationDate}
                  onOpenChange={setOpenExpirationDate}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id='date-picker'
                      variant='ghost'
                      className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                    >
                      <CalendarIcon className='size-3.5' />
                      <span className='sr-only'>
                        Séléctionnez une date d'expiration
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto overflow-hidden p-0'
                    align='end'
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode='single'
                      selected={expirationDate}
                      captionLayout='dropdown'
                      month={monthExpiration}
                      onMonthChange={setMonthExpiration}
                      onSelect={(date) => {
                        setExpirationDate(date);
                        setValueExpiration(formatDate(date));
                        setOpenExpirationDate(false);
                      }}
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
                value='DEV-000001'
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Label htmlFor='date' className='px-1'>
            {t('estimates.actions')}
          </Label>
          <div className='relative flex gap-2'>
            <Button variant='secondary' onClick={handleCreateEstimate}>
              <Save /> {t('common.create')}
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
