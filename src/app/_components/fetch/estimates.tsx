import { useEffect, useState } from 'react';

import { Estimate } from '@/app/generated/prisma';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

export function FetchEstimates(refreshTrigger = 0) {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    async function fetchEstimates() {
      if (!currentOrganization) return;

      setLoading(true);
      const res = await fetch(
        `/api/estimates?organizationId=${currentOrganization.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setEstimates(data);
      }
      setLoading(false);
    }
    fetchEstimates();
  }, [currentOrganization, refreshTrigger]);

  return { estimates, loading };
}
