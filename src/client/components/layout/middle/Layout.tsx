'use client';

import { Layout as AntLayout, Menu } from 'antd';
import {
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

import '@/client/styles/components/layout/layout.scss';

import Logo from '~/images/logo_dark.svg';

const { Content, Sider } = AntLayout;

export default function Layout({ children }: { children: ReactNode }) {
  const items = [
    {
      key: 'dashboard',
      icon: <Home size={18} />,
      label: 'Tableau de bord',
    },
    { type: 'divider' as const, key: 'divider-1' },
    {
      type: 'group' as const,
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
      type: 'group' as const,
      label: 'Paramètres',
      key: 'group-settings',
      children: [
        { key: 'profile', icon: <User size={18} />, label: 'Profil' },
        { key: 'users', icon: <Users size={18} />, label: 'Utilisateurs' },
        { key: 'entities', icon: <Building2 size={18} />, label: 'Entités' },
      ],
    },
    { type: 'divider' as const, key: 'divider-2' },
    { key: 'logout', icon: <LogOut size={18} />, label: 'Déconnexion' },
  ];

  return (
    <>
      <AntLayout className='layout' hasSider>
        <Sider className='layout__sidebar'>
          <Logo className='layout__sidebar__logo' />
          <Menu defaultSelectedKeys={['1']} items={items} />
        </Sider>
        <AntLayout className='layout__content'>
          <Content>{children}</Content>
        </AntLayout>
      </AntLayout>
    </>
  );
}
