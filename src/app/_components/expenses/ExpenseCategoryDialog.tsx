'use client';

import { ListPlus, Loader2Icon } from 'lucide-react';
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
import { useTranslation } from '@/utils/hooks/useTranslation';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

interface ExpenseCategoryDialogProps {
  onSuccess?: () => void;
}

export default function ExpenseCategoryDialog({
  onSuccess,
}: ExpenseCategoryDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { currentOrganization } = useOrganization();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    try {
      setLoading(true);
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
        setLoading(false);
        // Reset form and close dialog
        setExpenseCategory(false);
        toast.success(t('expenses.categoryCreatedSuccessfully'));
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
        <ListPlus size={16} /> {t('expenses.createCategory')}
      </Button>

      <Dialog open={expenseCategory} onOpenChange={setExpenseCategory}>
        <DialogContent>
          <DialogHeader className='flex flex-col gap-4'>
            <DialogTitle>{t('expenses.createCategory')}</DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-2'>
                <Input
                  placeholder={t('expenses.enterCategoryName')}
                  type='text'
                  name='Name'
                  id='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {loading ? (
                  <Button size='sm' disabled={true}>
                    <Loader2Icon className='animate-spin' />
                    {t('expenses.creationInProgress')}
                  </Button>
                ) : (
                  <Button type='submit'>{t('common.validate')}</Button>
                )}
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
