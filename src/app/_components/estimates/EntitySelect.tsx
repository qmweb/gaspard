'use client';

import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';

import FetchEntity from '../fetch/entity';

interface EntitySelectProps {
  onSuccess?: (selectedEntity: { id: string; name: string }) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentEntity?: string;
}

export default function EntitySelect({
  onSuccess,
  open = false,
  onOpenChange,
  currentEntity,
}: EntitySelectProps) {
  const [entities, setEntities] = useState<string>('');
  const { entity } = FetchEntity();

  // Use external state if provided, otherwise use internal state
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isOpen = onOpenChange ? open : internalOpen;
  const setIsOpen = onOpenChange ? onOpenChange : setInternalOpen;

  useEffect(() => {
    if (entity.length > 0) {
      setEntities(entity.find((e) => e.id === currentEntity)?.id || '');
    }
  }, [entity, currentEntity]);

  const handleEntitySelect = (entityId: string) => {
    setEntities(entityId);

    // Find the selected entity object
    const selectedEntity = entity.find((e) => e.id === entityId);

    if (selectedEntity && onSuccess) {
      // Pass the selected entity data to the parent
      onSuccess({
        id: selectedEntity.id,
        name: selectedEntity.name,
      });
    }

    // Close the dialog
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Séléctionner une entité</DialogTitle>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Entitée</label>
            <Select onValueChange={handleEntitySelect} value={entities}>
              <SelectTrigger className='w-full'>
                {entities.length === 0 ? (
                  <SelectValue placeholder='Aucune entité disponible' />
                ) : (
                  <SelectValue placeholder='Sélectionnez une entité' />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Entités</SelectLabel>
                  {entity.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
