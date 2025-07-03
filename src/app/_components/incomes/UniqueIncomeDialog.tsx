'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
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
  const [entities, setEntities] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { currentOrganization } = useOrganization();
  const [singleIncome, setSingleIncome] = useState(false);
  const [recursiveIncome, setrecursiveIncome] = useState(false);
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
        // Reset form and close dialog
        setSingleIncome(false);
        toast.success('Revenu créé avec succès');
        if (onSuccess) onSuccess(); // 🔥 Refresh trigger !
      }
    } catch (error) {
      console.error('Failed to create income:', error);
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
            <Plus size={16} /> Créer
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Nouveau revenu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSingleIncome(true)}>
            Revenu unique
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setrecursiveIncome(true)}>
            Revenu récurrent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={singleIncome} onOpenChange={setSingleIncome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un revenu unique</DialogTitle>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium'>Catégorie</label>
                <Select onValueChange={setEntities} value={entities}>
                  <SelectTrigger className='w-full'>
                    {entity.length === 0 ? (
                      <SelectValue placeholder='Aucune entitée disponible' />
                    ) : (
                      <SelectValue placeholder='Sélectionnez une entitée' />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Catégories</SelectLabel>
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

      <Dialog open={recursiveIncome} onOpenChange={setrecursiveIncome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reccursive</DialogTitle>
            <DialogDescription>En cours de développement...</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setrecursiveIncome(false)}>
              D'accord, à plus tard !
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
