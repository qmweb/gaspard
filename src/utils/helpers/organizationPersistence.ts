// Utility functions for organization persistence
// You can choose between localStorage or cookies

export const SELECTED_ORGANIZATION_KEY = 'selectedOrganizationId';

// localStorage functions (client-side only)
export const saveSelectedOrganizationToLocalStorage = (
  organizationId: string,
) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SELECTED_ORGANIZATION_KEY, organizationId);
  }
};

export const getSelectedOrganizationFromLocalStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SELECTED_ORGANIZATION_KEY);
  }
  return null;
};

export const removeSelectedOrganizationFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SELECTED_ORGANIZATION_KEY);
  }
};

// Cookie functions (works on both client and server)
export const saveSelectedOrganizationToCookie = (organizationId: string) => {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year
    document.cookie = `${SELECTED_ORGANIZATION_KEY}=${organizationId}; expires=${expires.toUTCString()}; path=/`;
  }
};

export const getSelectedOrganizationFromCookie = (): string | null => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const organizationCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${SELECTED_ORGANIZATION_KEY}=`),
    );
    return organizationCookie ? organizationCookie.split('=')[1] : null;
  }
  return null;
};

export const removeSelectedOrganizationFromCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = `${SELECTED_ORGANIZATION_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
};
