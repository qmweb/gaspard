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
  const [mounted, setMounted] = useState(false);

  // Enhanced setCurrentOrganization to save to localStorage
  const handleSetCurrentOrganization = (org: Organization) => {
    setCurrentOrganization(org);
    if (mounted) {
      localStorage.setItem('selectedOrganizationId', org.id);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchMemberships() {
      try {
        const response = await fetch('/api/memberships');
        if (response.ok) {
          const data = await response.json();
          setMemberships(data);

          // Try to restore previously selected organization
          if (mounted && data.length > 0) {
            const savedOrganizationId = localStorage.getItem(
              'selectedOrganizationId',
            );
            let organizationToSet = null;

            if (savedOrganizationId) {
              // Find the saved organization in the memberships
              const savedOrganization = data.find(
                (membership: Membership & { organization: Organization }) =>
                  membership.organization.id === savedOrganizationId,
              );
              organizationToSet = savedOrganization?.organization;
            }

            // If no saved organization found or doesn't exist in memberships, use the first one
            if (!organizationToSet) {
              organizationToSet = data[0].organization;
            }

            setCurrentOrganization(organizationToSet);
          }
        }
      } catch (error) {
        console.error('Failed to fetch memberships:', error);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      fetchMemberships();
    }
  }, [mounted]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        setCurrentOrganization: handleSetCurrentOrganization,
        memberships,
        loading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
