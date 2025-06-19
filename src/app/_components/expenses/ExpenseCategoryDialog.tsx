'use client';

import { Modal } from 'antd';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

interface ExpenseCategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ExpenseCategoryDialog({
  open,
  onClose,
}: ExpenseCategoryDialogProps) {
  const [name, setName] = useState<string>('');
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
        onClose();
        setName('');
        toast.success('Catégorie créée avec succès');
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title='Nouvelle catégorie'
    >
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4'>
          <label htmlFor='Name' className='text-sm font-medium'>
            Nom
          </label>
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
    </Modal>
  );
}
