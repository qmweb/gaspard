'use client';

import { Building2, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import NewEntityDialog from '@/app/_components/account/NewEntityDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/_components/ui/sidebar';
import { useTranslation } from '@/utils/hooks/useTranslation';
import { useOrganization } from '@/utils/providers/OrganizationProvider';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    id: string;
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { currentOrganization, setCurrentOrganization } = useOrganization();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  if (!teams.length) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Building2 className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {currentOrganization?.name || t('organizations.select')}
                </span>
                <span className='truncate text-xs'>Enterprise</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>{t('organizations.my')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() =>
                  setCurrentOrganization({
                    id: team.id,
                    name: team.name,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })
                }
              >
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <team.logo className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{team.name}</span>
                  <span className='truncate text-xs'>{team.plan}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NewEntityDialog />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
