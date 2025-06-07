'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useTranslation } from '@/hooks/useTranslation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/_components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/app/_components/ui/sidebar';
import { signOut } from '@/utils/lib/better-auth/auth-client';
import useMenuStore from '@/utils/stores/menuStore';

export function NavMain({
  menuTitle,
  items,
}: {
  menuTitle?: string;
  items: {
    title: string;
    key: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      key: string;
    }[];
  }[];
}) {
  const router = useRouter();
  const setCurrentKey = useMenuStore((state) => state.setCurrentKey);
  const { t } = useTranslation();

  const handleClick = async (title: string, key: string) => {
    if (title === 'Sign Out') {
      await signOut();
      router.replace('/signin');
    } else {
      setCurrentKey(key);
    }
  };

  return (
    <SidebarGroup>
      {menuTitle && <SidebarGroupLabel>{menuTitle}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={t(item.title)}
            asChild
            defaultOpen={item.isActive}
            className='group/collapsible'
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={t(item.title)}
                  onClick={() => handleClick(t(item.title), item.key)}
                  className='cursor-pointer'
                >
                  {item.icon && <item.icon />}
                  <span>{t(item.title)}</span>
                  {item.items && (
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.key}>
                        <SidebarMenuSubButton
                          asChild
                          onClick={() =>
                            handleClick(t(subItem.title), subItem.key)
                          }
                          className='cursor-pointer'
                        >
                          <a href={subItem.key} className='cursor-pointer'>
                            <span>{t(subItem.title)}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
