'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Loader2Icon, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

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

import FetchEntity from '../fetch/entity';

interface UniqueIncomeDialogProps {
  onSuccess?: () => void;
  refreshTrigger?: number;
}

export default function UniqueIncomeDialog({
  onSuccess,
  refreshTrigger,
}: UniqueIncomeDialogProps) {
  const { t } = useTranslation();
  const [entities, setEntities] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { currentOrganization } = useOrganization();
  const [singleIncome, setSingleIncome] = useState(false);
  const [recursiveIncome, setrecursiveIncome] = useState(false);
  const [loading, setLoading] = useState(false);

  const { entity } = FetchEntity(refreshTrigger);

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
      const response = await fetch('/api/incomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount.replace(',', '.')),
          description,
          date: date ? date.toISOString() : null,
          organizationId: currentOrganization.id,
          entityId: entities,
        }),
      });

      if (response.ok) {
        setLoading(false);
        // Reset form and close dialog
        setSingleIncome(false);
        toast.success(t('incomes.incomeCreatedSuccessfully'));
        if (onSuccess) onSuccess(); // 🔥 Refresh trigger !
      }
    } catch (error) {
      console.error('Failed to create income:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleIncome) {
      setAmount('');
      setDescription('');
      setDate(new Date());
    }
  }, [singleIncome]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus size={16} /> {t('incomes.create')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t('incomes.newIncome')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSingleIncome(true)}>
            {t('incomes.uniqueIncome')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setrecursiveIncome(true)}>
            {t('incomes.recurringIncome')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={singleIncome} onOpenChange={setSingleIncome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('incomes.createUniqueIncome')}</DialogTitle>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium'>
                  {t('incomes.entity')}
                </label>
                <Select onValueChange={setEntities} value={entities}>
                  <SelectTrigger className='w-full'>
                    {entity.length === 0 ? (
                      <SelectValue
                        placeholder={t('incomes.noEntitiesAvailable')}
                      />
                    ) : (
                      <SelectValue placeholder={t('incomes.selectEntity')} />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('incomes.entities')}</SelectLabel>
                      {entity.map((entitie) => (
                        <SelectItem key={entitie.id} value={entitie.id}>
                          {entitie.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor='Amount' className='text-sm font-medium'>
                  {t('incomes.amount')}
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
                  {t('incomes.description')}
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
                  {t('incomes.date')}
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
                        <span>{t('incomes.pickDate')}</span>
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
                <Button size='sm' disabled>
                  <Loader2Icon className='animate-spin' />
                  {t('incomes.creationInProgress')}
                </Button>
              ) : (
                <Button type='submit'>{t('common.validate')}</Button>
              )}
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={recursiveIncome} onOpenChange={setrecursiveIncome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('incomes.recurring')}</DialogTitle>
            <DialogDescription>{t('incomes.inDevelopment')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setrecursiveIncome(false)}>
              {t('incomes.okayLater')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
