'use client';

import { Breadcrumb, Layout as AntLayout, Menu } from 'antd';
import React, { lazy, ReactNode, Suspense } from 'react';
// Toaster
import { Toaster } from 'sonner';

import '@/client/styles/components/layout/layout.scss';

import Loader from '@/client/components/ui/Loader/Loader';
import useMenuStore from '@/client/stores/menuStore';
import { MENU_ITEMS, MenuItemType } from '@/utils/constants/menu';
import { signOut } from '@/utils/lib/auth-client';

import Logo from '~/images/logo_dark.svg';

const { Content, Sider } = AntLayout;

export default function Layout({ children }: { children: ReactNode }) {
  const currentPage = useMenuStore((state) => state.currentKey);
  const setCurrentPage = useMenuStore((state) => state.setCurrentKey);

  // Add onClick to each menu item recursively
  function addOnClick(items: MenuItemType[]): MenuItemType[] {
    return items.map((item) => {
      if (item.type === 'group' && item.children) {
        return { ...item, children: addOnClick(item.children) };
      }
      if (!item.type) {
        return { ...item, onClick: () => setCurrentPage(item.key) };
      }
      return item;
    });
  }
  const items = addOnClick(MENU_ITEMS);

  // Centralized breadcrumb meta from menu
  const pageMeta = MENU_ITEMS.reduce<
    Record<string, { label: string; icon: React.ReactNode }>
  >((acc, item) => {
    if (item.type === 'group' && item.children) {
      item.children.forEach((child) => {
        if (child && !child.type && child.label && child.icon) {
          acc[String(child.key)] = {
            label: typeof child.label === 'string' ? child.label : '',
            icon: React.cloneElement(child.icon as React.ReactElement, {
              size: 16,
            }),
          };
        }
      });
    } else if (!item.type && item.label && item.icon) {
      acc[String(item.key)] = {
        label: typeof item.label === 'string' ? item.label : '',
        icon: React.cloneElement(item.icon as React.ReactElement, { size: 16 }),
      };
    }
    return acc;
  }, {});

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
            items={MENU_ITEMS as MenuItemType[]}
            onClick={async ({ key }) => {
              if (key === 'logout') {
                await signOut();
              } else {
                setCurrentPage(key as string);
              }
            }}
          />
        </Sider>
        <AntLayout className='layout__main-content'>
          <header className='layout__main-content__breadcrumb'>
            <Breadcrumb
              items={[
                pageMeta[currentPage] && {
                  title: (
                    <>
                      {pageMeta[currentPage].icon} {pageMeta[currentPage].label}
                    </>
                  ),
                },
              ].filter(Boolean)}
            />
          </header>
          <Content className='layout__main-content__content'>
            <Suspense fallback={<Loader />}>
              <Toaster richColors position='bottom-right' />
              {PageComponent ? <PageComponent /> : children}
            </Suspense>
          </Content>
        </AntLayout>
      </AntLayout>
    </>
  );
}
