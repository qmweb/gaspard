'use client';

import { Building2 } from 'lucide-react';
import * as React from 'react';

import { useTranslation } from '@/hooks/useTranslation';

import { NavMain } from '@/app/_components/shared/nav-main';
import { NavUser } from '@/app/_components/shared/nav-user';
import { TeamSwitcher } from '@/app/_components/shared/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/app/_components/ui/sidebar';
import { MENU } from '@/utils/constants/menu';
import { useSession } from '@/utils/lib/better-auth/auth-client';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || '';
  const { memberships, currentOrganization } = useOrganization();

  const navDashboard = [MENU.DASHBOARD];

  const navMain = [MENU.EXPENSES, MENU.INCOMES, MENU.ESTIMATES, MENU.INVOICES];

  const navSettings = [MENU.ENTITIES, MENU.REPORTS, MENU.USERS];

  const teams =
    memberships?.map((membership) => ({
      name: membership.organization.name,
      logo: Building2,
      plan: 'Enterprise',
    })) || [];

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navDashboard} />
        <NavMain menuTitle={t('navigationGroups.finance')} items={navMain} />
        <NavMain
          menuTitle={t('navigationGroups.settings')}
          items={navSettings}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email: user?.email || '',
            avatar: user?.image || '',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
