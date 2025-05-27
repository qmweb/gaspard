import type { MenuProps } from 'antd';
import {
  BarChart,
  Building2,
  FileText,
  Home,
  LogOut,
  Receipt,
  TrendingUp,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import { ReactNode } from 'react';

import { useTranslation } from '@/hooks/useTranslation';

type AntMenuItemType = Required<MenuProps>['items'][number];

export type MenuItemType = AntMenuItemType & {
  key: string;
  icon?: ReactNode;
  label?: string;
  type?: 'divider' | 'group';
  children?: MenuItemType[];
};

export function useMenuItems(
  firstName: string,
  lastName: string,
): MenuItemType[] {
  const { t } = useTranslation();

  return [
    {
      key: 'dashboard',
      icon: <Home size={18} />,
      label: t('navigation.dashboard'),
    },
    {
      type: 'group',
      label: t('navigationGroups.finance'),
      key: 'group-finances',
      children: [
        {
          key: 'expenses',
          icon: <Wallet size={18} />,
          label: t('navigation.expenses'),
        },
        {
          key: 'incomes',
          icon: <TrendingUp size={18} />,
          label: t('navigation.incomes'),
        },
        {
          key: 'estimates',
          icon: <FileText size={18} />,
          label: t('navigation.quotes'),
        },
        {
          key: 'invoices',
          icon: <Receipt size={18} />,
          label: t('navigation.bills'),
        },
      ],
    },
    {
      type: 'group',
      label: t('navigationGroups.settings'),
      key: 'group-settings',
      children: [
        {
          key: 'entities',
          icon: <Building2 size={18} />,
          label: t('navigation.entities'),
        },
        {
          key: 'reports',
          icon: <BarChart size={18} />,
          label: t('navigation.reports'),
        },
      ],
    },
    { type: 'divider', key: 'divider-user' },
    { key: 'users', icon: <Users size={18} />, label: t('navigation.users') },
    {
      key: 'user-info',
      icon: <User size={18} />,
      label: `${firstName} ${lastName}`,
    },
    { key: 'logout', icon: <LogOut size={18} />, label: t('common.signOut') },
  ];
}
