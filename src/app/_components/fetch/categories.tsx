import { useEffect, useState } from 'react';

import { ExpenseCategory } from '@/app/generated/prisma';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

export default function FetchCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    async function fetchCategories() {
      if (!currentOrganization) return;

      setLoading(true);
      const res = await fetch(
        `/api/categories?organizationId=${currentOrganization.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
      setLoading(false);
    }
    fetchCategories();
  }, [currentOrganization]);

  return { categories, loading };
}
