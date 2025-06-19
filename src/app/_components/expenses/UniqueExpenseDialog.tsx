'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
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
import { useOrganization } from '@/utils/providers/OrganizationProvider';

export default function UniqueExpenseDialog() {
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { currentOrganization } = useOrganization();
  const { categories, loading } = FetchCategories();
  const [singleExpense, setSingleExpense] = useState(false);
  const [recursiveExpense, setrecursiveExpense] = useState(false);

  // Set initial category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].id);
    }
  }, [categories]);

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
        // Reset form and close dialog
        setSingleExpense(false);
        toast.success('Dépense créée avec succès');
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
  }, [singleExpense]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>
            <Plus size={16} /> Créer
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Nouvelle dépense</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSingleExpense(true)}>
            Dépense unique
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setrecursiveExpense(true)}>
            Dépense récurrent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={singleExpense} onOpenChange={setSingleExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une dépense unique</DialogTitle>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium'>Catégorie</label>
                <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger className='w-full'>
                    {categories.length === 0 ? (
                      <SelectValue placeholder='Aucune catégorie disponible' />
                    ) : (
                      <SelectValue placeholder='Sélectionnez une catégorie' />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Catégories</SelectLabel>
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
                  Montant
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
                  Description
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
                  Date
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
                        <span>Pick a date</span>
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
              <Button type='submit'>Valider</Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={recursiveExpense} onOpenChange={setrecursiveExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reccursive</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this file from our servers?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type='submit'>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
