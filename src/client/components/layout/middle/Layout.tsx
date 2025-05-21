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
import { lazy, ReactNode, Suspense, useState } from 'react';

import '@/client/styles/components/layout/layout.scss';

import Loader from '@/client/components/ui/Loader/Loader';

import Logo from '~/images/logo_dark.svg';

const { Content, Sider } = AntLayout;

export default function Layout({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const items = [
    {
      key: 'dashboard',
      icon: <Home size={18} />,
      label: 'Tableau de bord',
      onClick: () => setCurrentPage('dashboard'),
    },
    { type: 'divider' as const, key: 'divider-1' },
    {
      type: 'group' as const,
      label: 'Finances',
      key: 'group-finances',
      children: [
        {
          key: 'expenses',
          icon: <Wallet size={18} />,
          label: 'Dépenses',
          onClick: () => setCurrentPage('expenses'),
        },
        {
          key: 'incomes',
          icon: <TrendingUp size={18} />,
          label: 'Recettes',
          onClick: () => setCurrentPage('incomes'),
        },
        {
          key: 'estimates',
          icon: <FileText size={18} />,
          label: 'Devis',
          onClick: () => setCurrentPage('estimates'),
        },
        {
          key: 'invoices',
          icon: <Receipt size={18} />,
          label: 'Factures',
          onClick: () => setCurrentPage('invoices'),
        },
      ],
    },
    {
      type: 'group' as const,
      label: 'Paramètres',
      key: 'group-settings',
      children: [
        {
          key: 'profile',
          icon: <User size={18} />,
          label: 'Profil',
          onClick: () => setCurrentPage('profile'),
        },
        {
          key: 'users',
          icon: <Users size={18} />,
          label: 'Utilisateurs',
          onClick: () => setCurrentPage('users'),
        },
        {
          key: 'entities',
          icon: <Building2 size={18} />,
          label: 'Entités',
          onClick: () => setCurrentPage('entities'),
        },
      ],
    },
    { type: 'divider' as const, key: 'divider-2' },
    { key: 'logout', icon: <LogOut size={18} />, label: 'Déconnexion' },
  ];

  // Dynamic import for each page
  const pageComponents: Record<
    string,
    React.LazyExoticComponent<() => JSX.Element>
  > = {
    dashboard: lazy(() => import('@/app/(middle)/(pages)/dashboard')),
    expenses: lazy(() => import('@/app/(middle)/(pages)/expenses')),
    incomes: lazy(() => import('@/app/(middle)/(pages)/incomes')),
    estimates: lazy(() => import('@/app/(middle)/(pages)/estimates')),
    invoices: lazy(() => import('@/app/(middle)/(pages)/invoices')),
    entities: lazy(() => import('@/app/(middle)/(pages)/entities')),
    profile: lazy(() => import('@/app/(middle)/(pages)/profile')),
    users: lazy(() => import('@/app/(middle)/(pages)/users')),
  };
  const PageComponent = pageComponents[currentPage];

  return (
    <>
      <AntLayout className='layout' hasSider>
        <Sider className='layout__sidebar'>
          <Logo className='layout__sidebar__logo' />
          <Menu
            selectedKeys={[currentPage]}
            items={items}
            onClick={({ key }) => setCurrentPage(key as string)}
          />
        </Sider>
        <AntLayout className='layout__content'>
          <Content>
            <Suspense fallback={<Loader />}>
              {PageComponent ? <PageComponent /> : children}
            </Suspense>
          </Content>
        </AntLayout>
      </AntLayout>
    </>
  );
}
