'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import Loader from '@/app/_components/ui/Loader/Loader';
import { MENU } from '@/utils/constants/menu';
import useMenuStore from '@/utils/stores/menuStore';

const Dashboard = dynamic(() => import('@/app/(middle)/(dashboard)/index'));
const Expenses = dynamic(() => import('@/app/(middle)/(expenses)/index'));
const Incomes = dynamic(() => import('@/app/(middle)/(incomes)/index'));
const Estimates = dynamic(() => import('@/app/(middle)/(estimates)/index'));
const Invoices = dynamic(() => import('@/app/(middle)/(invoices)/index'));
const Entities = dynamic(() => import('@/app/(middle)/(entities)/index'));
const Reports = dynamic(() => import('@/app/(middle)/(reports)/index'));
const Users = dynamic(() => import('@/app/(middle)/(users)/index'));

const MainContent = () => {
  const { currentKey } = useMenuStore();

  const renderContent = () => {
    switch (currentKey) {
      case MENU.DASHBOARD.key:
        return <Dashboard />;
      case MENU.EXPENSES.key:
        return <Expenses />;
      case MENU.INCOMES.key:
        return <Incomes />;
      case MENU.ESTIMATES.key:
        return <Estimates />;
      case MENU.INVOICES.key:
        return <Invoices />;
      case MENU.ENTITIES.key:
        return <Entities />;
      case MENU.REPORTS.key:
        return <Reports />;
      case MENU.USERS.key:
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return <Suspense fallback={<Loader />}>{renderContent()}</Suspense>;
};

export default MainContent;
