'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Membership, Organization } from '@/app/generated/prisma';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization) => void;
  memberships: (Membership & { organization: Organization })[];
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider',
    );
  }
  return context;
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);
  const [memberships, setMemberships] = useState<
    (Membership & { organization: Organization })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemberships() {
      try {
        const response = await fetch('/api/memberships');
        if (response.ok) {
          const data = await response.json();
          setMemberships(data);
          // Set the first organization as current if none is selected
          if (!currentOrganization && data.length > 0) {
            setCurrentOrganization(data[0].organization);
          }
        }
      } catch (error) {
        console.error('Failed to fetch memberships:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMemberships();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        setCurrentOrganization,
        memberships,
        loading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
