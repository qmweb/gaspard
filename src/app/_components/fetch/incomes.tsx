import { useEffect, useState } from 'react';

import { Income } from '@/app/generated/prisma';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

export function FetchIncomes(refreshTrigger = 0) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    async function fetchIncomes() {
      if (!currentOrganization) return;

      setLoading(true);
      const res = await fetch(
        `/api/incomes?organizationId=${currentOrganization.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setIncomes(data);
      }
      setLoading(false);
    }
    fetchIncomes();
  }, [currentOrganization, refreshTrigger]);

  return { incomes, loading };
}

export function FetchIncomesDashboard(refreshTrigger = 0) {
  const [incomes, setincomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    async function fetchIncomes() {
      if (!currentOrganization) return;

      setLoading(true);
      const res = await fetch(
        `/api/incomes/dashboard?organizationId=${currentOrganization.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setincomes(data);
      }
      setLoading(false);
    }
    fetchIncomes();
  }, [currentOrganization, refreshTrigger]);

  return { incomes, loading };
}
