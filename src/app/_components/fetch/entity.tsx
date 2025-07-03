import { useEffect, useState } from 'react';

import { Entity } from '@/app/generated/prisma';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

export default function FetchEntity(refreshTrigger = 0) {
  const [entity, setEntity] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    async function fetchEntities() {
      if (!currentOrganization) return;

      setLoading(true);
      const res = await fetch(
        `/api/entity?organizationId=${currentOrganization.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setEntity(data);
      }
      setLoading(false);
    }
    fetchEntities();
  }, [currentOrganization, refreshTrigger]);

  return { entity, loading };
}
