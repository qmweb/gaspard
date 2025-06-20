import {
  Building2,
  FileText,
  Home,
  Receipt,
  Users,
  Wallet,
} from 'lucide-react';

export const MENU = {
  DASHBOARD: {
    title: 'navigation.dashboard',
    key: 'dashboard',
    icon: Home,
  },
  EXPENSES: {
    title: 'navigation.expenses',
    key: 'expenses',
    icon: Receipt,
  },
  INCOMES: {
    title: 'navigation.incomes',
    key: 'incomes',
    icon: Wallet,
  },
  ESTIMATES: {
    title: 'navigation.estimates',
    key: 'estimates',
    icon: FileText,
  },
  INVOICES: {
    title: 'navigation.invoices',
    key: 'invoices',
    icon: Receipt,
  },
  ENTITIES: {
    title: 'navigation.entities',
    key: 'entities',
    icon: Building2,
  },
  REPORTS: {
    title: 'navigation.reports',
    key: 'reports',
    icon: FileText,
  },
  USERS: {
    title: 'navigation.users',
    key: 'users',
    icon: Users,
  },
};
