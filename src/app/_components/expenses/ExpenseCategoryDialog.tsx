'use client';


import { ListPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/ui/dialog';

import { Input } from '@/app/_components/ui/input';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

interface ExpenseCategoryDialogProps {
  onSuccess?: () => void;
}

export default function ExpenseCategoryDialog({
  onSuccess,
}: ExpenseCategoryDialogProps) {
  const [name, setName] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<boolean>(false);

  const { currentOrganization } = useOrganization();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          organizationId: currentOrganization.id,
        }),
      });

      if (response.ok) {
        // Reset form and close dialog
        setExpenseCategory(false);
        toast.success('Catégorie créée avec succès');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  useEffect(() => {
    if (expenseCategory) {
      setName('');
    }
  }, [expenseCategory]);

  return (
    <>
      <Button onClick={() => setExpenseCategory(true)}>
        <ListPlus size={16} /> Créer une catégorie
      </Button>

      <Dialog open={expenseCategory} onOpenChange={setExpenseCategory}>
        <DialogContent>
          <DialogHeader className='flex flex-col gap-4'>
            <DialogTitle>Créer une catégorie</DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-2'>
                <Input
                  placeholder='Entrez le nom de la catégorie'
                  type='text'
                  name='Name'
                  id='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button type='submit'>Valider</Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
