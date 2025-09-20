'use client';

import { Loader2Icon, Plus } from 'lucide-react';
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

interface ExpenseCategoryDialogProps {
  onSuccess?: () => void;
}

export default function NewOrganizationDialog({
  onSuccess,
}: ExpenseCategoryDialogProps) {
  const [name, setName] = useState<string>('');
  const [newOrganization, setNewOrganization] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (response.ok) {
        setNewOrganization(false);
        toast.success('Organisation créée avec succès');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newOrganization) {
      setName('');
    }
  }, [newOrganization]);

  return (
    <>
      <Button
        variant='ghost'
        className='w-full'
        onClick={() => setNewOrganization(true)}
      >
        <Plus size={16} /> {t('organizations.add')}
      </Button>

      <Dialog open={newOrganization} onOpenChange={setNewOrganization}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('organizations.create')}</DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-4'>
                <label htmlFor='Name' className='text-sm font-medium'>
                  {t('common.name')}
                </label>
                <Input
                  placeholder={t('organizations.enterName')}
                  type='text'
                  name='Name'
                  id='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {loading ? (
                  <Button type='submit' disabled>
                    <Loader2Icon className='animate-spin' />
                    {t('common.creating')}
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
