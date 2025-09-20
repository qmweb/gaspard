'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Loader2Icon, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import FetchCategories from '@/app/_components/fetch/categories';
import { Button } from '@/app/_components/ui/button';
import { Calendar } from '@/app/_components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Input } from '@/app/_components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/_components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import { Textarea } from '@/app/_components/ui/textarea';
import { cn } from '@/utils/helpers/shadcn-ui';
import { useTranslation } from '@/utils/hooks/useTranslation';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

interface UniqueExpenseDialogProps {
  onSuccess?: () => void;
  refreshTrigger?: number;
}

export default function UniqueExpenseDialog({
  onSuccess,
  refreshTrigger,
}: UniqueExpenseDialogProps) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { currentOrganization } = useOrganization();
  const { categories } = FetchCategories(refreshTrigger);
  const [singleExpense, setSingleExpense] = useState(false);
  const [recursiveExpense, setrecursiveExpense] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Set initial category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Replace comma with dot for internal value storage
    const value = e.target.value.replace(',', '.');
    if (!isNaN(parseFloat(value)) || value === '' || value === '.') {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    try {
      setLoading(true);
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: category,
          amount: parseFloat(amount.replace(',', '.')),
          description,
          date: date ? date.toISOString() : null,
          organizationId: currentOrganization.id,
        }),
      });

      if (response.ok) {
        setLoading(false);
        // Reset form and close dialog
        setSingleExpense(false);
        toast.success(t('expenses.expenseCreatedSuccessfully'));
        if (onSuccess) onSuccess(); // 🔥 Refresh trigger !
      }
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  useEffect(() => {
    if (singleExpense) {
      setCategory(categories[0]?.id || '');
      setAmount('');
      setDescription('');
      setDate(new Date());
    }
  }, [singleExpense, categories]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus size={16} /> {t('expenses.create')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t('expenses.newExpense')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSingleExpense(true)}>
            {t('expenses.uniqueExpense')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setrecursiveExpense(true)}>
            {t('expenses.recurringExpense')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={singleExpense} onOpenChange={setSingleExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('expenses.createUniqueExpense')}</DialogTitle>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium'>
                  {t('expenses.category')}
                </label>
                <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger className='w-full'>
                    {categories.length === 0 ? (
                      <SelectValue
                        placeholder={t('expenses.noCategoriesAvailable')}
                      />
                    ) : (
                      <SelectValue placeholder={t('expenses.selectCategory')} />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('expenses.categories')}</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor='Amount' className='text-sm font-medium'>
                  {t('expenses.amount')}
                </label>
                <div className='relative'>
                  <Input
                    type='number'
                    name='Amount'
                    id='Amount'
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder='0,00'
                    required
                  />
                  <span className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                    €
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='Description' className='text-sm font-medium'>
                  {t('expenses.description')}
                </label>
                <Textarea
                  name='Description'
                  id='Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='Date' className='text-sm font-medium'>
                  {t('expenses.date')}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !date && 'text-muted-foreground',
                      )}
                      data-empty={!date}
                    >
                      {date ? (
                        format(date, 'PPP', { locale: fr })
                      ) : (
                        <span>{t('expenses.pickDate')}</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      disabled={(date) =>
                        date > new Date() || date < new Date('01-01-1900')
                      }
                      captionLayout='dropdown'
                      selected={date}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate); // ✅ pas de format ici
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {loading ? (
                <Button size='sm' disabled={true}>
                  <Loader2Icon className='animate-spin' />
                  {t('expenses.creationInProgress')}
                </Button>
              ) : (
                <Button type='submit'>{t('common.validate')}</Button>
              )}
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={recursiveExpense} onOpenChange={setrecursiveExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('expenses.recurring')}</DialogTitle>
            <DialogDescription>{t('expenses.inDevelopment')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setrecursiveExpense(false)}>
              {t('expenses.okayLater')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
