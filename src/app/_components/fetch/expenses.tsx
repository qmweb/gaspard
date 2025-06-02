import { useEffect, useState } from 'react';

import { Expense } from '@/app/generated/prisma';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

export function FetchExpenses(refreshTrigger = 0) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    async function fetchExpenses() {
      if (!currentOrganization) return;

      setLoading(true);
      const res = await fetch(
        `/api/expenses?organizationId=${currentOrganization.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
      setLoading(false);
    }
    fetchExpenses();
  }, [currentOrganization, refreshTrigger]);

  return { expenses, loading };
}

export function FetchExpensesDashboard(refreshTrigger = 0) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    async function fetchExpenses() {
      if (!currentOrganization) return;

      setLoading(true);
      const res = await fetch(
        `/api/expenses/dashboard?organizationId=${currentOrganization.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
      setLoading(false);
    }
    fetchExpenses();
  }, [currentOrganization, refreshTrigger]);

  return { expenses, loading };
}
