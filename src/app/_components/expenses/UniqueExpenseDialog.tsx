'use client';

import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import FetchCategories from '@/app/_components/fetch/categories';
import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

interface UniqueExpenseDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UniqueExpenseDialog({
  open,
  onClose,
}: UniqueExpenseDialogProps) {
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const { currentOrganization } = useOrganization();
  const { categories, loading } = FetchCategories(0);

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
          date: new Date(date),
          organizationId: currentOrganization.id,
        }),
      });

      if (response.ok) {
        // Reset form and close dialog
        onClose();
        setCategory(categories[0]?.id || '');
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        toast.success('Dépense créée avec succès');
      }
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title='Nouvelle dépense unique'
    >
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <label htmlFor='Category' className='text-sm font-medium'>
            Catégorie
          </label>
          <select
            name='Category'
            id='Category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading || categories.length === 0}
          >
            {categories.length === 0 ? (
              <option value=''>Aucune catégorie disponible</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label htmlFor='Amount' className='text-sm font-medium'>
            Montant
          </label>
          <div className='relative'>
            <input
              type='text'
              inputMode='decimal'
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
        <div>
          <label htmlFor='Description' className='text-sm font-medium'>
            Description
          </label>
          <textarea
            name='Description'
            id='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='Date' className='text-sm font-medium'>
            Date
          </label>
          <input
            type='date'
            name='Date'
            id='Date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <ButtonPrimary type='submit'>Valider</ButtonPrimary>
      </form>
    </Modal>
  );
}
