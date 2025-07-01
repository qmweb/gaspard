'use client';

import { Plus } from 'lucide-react';
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

export default function NewEntityDialog({
  onSuccess,
}: ExpenseCategoryDialogProps) {
  const [name, setName] = useState<string>('');
  const [newEntity, setNewEntity] = useState<boolean>(false);
  const { currentOrganization } = useOrganization();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    try {
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
        // Reset form and close dialog
        setNewEntity(false);
        toast.success('Entité créée avec succès');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Failed to create entity:', error);
    }
  };

  useEffect(() => {
    if (newEntity) {
      setName('');
    }
  }, [newEntity]);

  return (
    <>
      <Button
        variant='ghost'
        className='w-full'
        onClick={() => setNewEntity(true)}
      >
        <Plus size={16} /> Ajouter une entité
      </Button>

      <Dialog open={newEntity} onOpenChange={setNewEntity}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une entité</DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-4'>
                <label htmlFor='Name' className='text-sm font-medium'>
                  Nom
                </label>
                <Input
                  placeholder="Entrez le nom de l'entité"
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
