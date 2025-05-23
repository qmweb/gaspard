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

type AntMenuItemType = Required<MenuProps>['items'][number];

export type MenuItemType = AntMenuItemType & {
  key: string;
  icon?: ReactNode;
  label?: string;
  type?: 'divider' | 'group';
  children?: MenuItemType[];
};

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'dashboard',
    icon: <Home size={18} />,
    label: 'Tableau de bord',
  },
  {
    type: 'group',
    label: 'Finances',
    key: 'group-finances',
    children: [
      { key: 'expenses', icon: <Wallet size={18} />, label: 'Dépenses' },
      { key: 'incomes', icon: <TrendingUp size={18} />, label: 'Recettes' },
      { key: 'estimates', icon: <FileText size={18} />, label: 'Devis' },
      { key: 'invoices', icon: <Receipt size={18} />, label: 'Factures' },
    ],
  },
  {
    type: 'group',
    label: 'Paramètres',
    key: 'group-settings',
    children: [
      { key: 'entities', icon: <Building2 size={18} />, label: 'Entités' },
      { key: 'reports', icon: <BarChart size={18} />, label: 'Rapports' },
    ],
  },

  { type: 'divider', key: 'divider-user' },
  { key: 'users', icon: <Users size={18} />, label: 'Utilisateurs' },
  { key: 'user-info', icon: <User size={18} />, label: '' },
  { key: 'logout', icon: <LogOut size={18} />, label: 'Déconnexion' },
];
