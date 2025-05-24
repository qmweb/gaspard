'use client';

import { DownOutlined } from '@ant-design/icons';
import { Breadcrumb, Dropdown, Layout as AntLayout, Menu, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { lazy, ReactNode, Suspense, useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import '@/styles/layout/layout.scss';

import useMenuItems from '@/app/_components/layout/middle/useMenuItems';
import UserMenuDialog from '@/app/_components/layout/middle/UserMenuDialog';
import ButtonPrimary from '@/app/_components/ui/Button/ButtonPrimary';
import Dialog from '@/app/_components/ui/Dialog/Dialog';
import Loader from '@/app/_components/ui/Loader/Loader';
import { Membership } from '@/app/generated/prisma';
import { MENU_ITEMS } from '@/utils/constants/menu';
import { signOut, useSession } from '@/utils/lib/better-auth/auth-client';
import useMenuStore from '@/utils/stores/menuStore';

import Logo from '~/images/logo_dark.svg';

const { Content, Sider } = AntLayout;

export default function Layout({ children }: { children: ReactNode }) {
  const currentPage = useMenuStore((state) => state.currentKey);
  const setCurrentPage = useMenuStore((state) => state.setCurrentKey);
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || '';
  let firstName = '';
  let lastName = '';
  if (userName) {
    const parts = userName.split(' ');
    firstName = parts[0];
    lastName = parts.slice(1).join(' ');
  }

  const [userDialogOpen, setUserDialogOpen] = React.useState(false);
  const items = useMenuItems({
    firstName,
    lastName,
    setCurrentPage,
    onUserInfoClick: () => setUserDialogOpen(true),
  });

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
    dashboard: lazy(() => import('@/app/(middle)/(dashboard)')),
    expenses: lazy(() => import('@/app/(middle)/(expenses)')),
    incomes: lazy(() => import('@/app/(middle)/(incomes)')),
    estimates: lazy(() => import('@/app/(middle)/(estimates)')),
    invoices: lazy(() => import('@/app/(middle)/(invoices)')),
    entities: lazy(() => import('@/app/(middle)/(entities)')),
    users: lazy(() => import('@/app/(middle)/(users)')),
    reports: lazy(() => import('@/app/(middle)/(reports)')),
  };
  const PageComponent = pageComponents[currentPage];
  const router = useRouter();

  const [memberships, setMemberships] = useState<
    (Membership & { organization: { id: string; name: string } })[]
  >([]);
  const [orgDialogOpen, setOrgDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMemberships() {
      const res = await fetch('/api/memberships');
      if (res.ok) {
        const data = await res.json();
        setMemberships(data);
      }
    }
    fetchMemberships();
  }, []);

  // Handler for creating organization
  async function handleCreateOrg() {
    if (!orgName.trim()) return;
    setLoading(true);
    const res = await fetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: orgName }),
    });
    setLoading(false);
    if (res.ok) {
      setOrgDialogOpen(false);
      setOrgName('');
      // Refresh memberships
      const membershipsRes = await fetch('/api/memberships');
      if (membershipsRes.ok) {
        const data = await membershipsRes.json();
        setMemberships(data);
      }
    }
  }

  return (
    <>
      <AntLayout className='layout' hasSider>
        <Sider className='layout__sidebar'>
          <Logo className='layout__sidebar__logo' />
          <div
            className='ant-menu-item'
            style={{ padding: 0, marginBottom: 0 }}
          >
            <Dropdown
              menu={{
                items: memberships
                  ?.map((membership) => ({
                    label: <span>{membership.organization.name}</span>,
                    key: membership.organization.id,
                  }))
                  .concat([
                    {
                      label: (
                        <span onClick={() => setOrgDialogOpen(true)}>
                          Ajouter
                        </span>
                      ),
                      key: 'add-org',
                    },
                  ]),
              }}
              trigger={['click']}
            >
              <Space>
                {memberships?.[0]?.organization?.name ||
                  'Sélectionner une organisation'}
                <DownOutlined />
              </Space>
            </Dropdown>
            <Dialog
              trigger={<></>}
              open={orgDialogOpen}
              onCancel={() => setOrgDialogOpen(false)}
              footer={
                <ButtonPrimary
                  onClick={handleCreateOrg}
                  disabled={loading || !orgName.trim()}
                >
                  {loading ? 'Création...' : 'Créer'}
                </ButtonPrimary>
              }
              title='Créer une organisation'
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <label htmlFor='org-name'>Nom de l'organisation</label>
                <input
                  id='org-name'
                  type='text'
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Nom de l'organisation"
                  autoFocus
                />
              </div>
            </Dialog>
          </div>
          <Menu
            selectedKeys={[currentPage]}
            items={items}
            onClick={async ({ key }) => {
              if (key === 'logout') {
                await signOut();
                router.replace('/signin');
              } else if (key === 'user-info') {
                setUserDialogOpen(true);
              } else {
                setCurrentPage(key as string);
              }
            }}
          />
          <UserMenuDialog
            open={userDialogOpen}
            onClose={() => setUserDialogOpen(false)}
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
