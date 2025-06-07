'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { useTranslation } from '@/hooks/useTranslation';

import { AppSidebar } from '@/app/_components/shared/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/app/_components/ui/breadcrumb';
import { Separator } from '@/app/_components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/app/_components/ui/sidebar';
import { MENU } from '@/utils/constants/menu';
import useMenuStore from '@/utils/stores/menuStore';

export default function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const currentPage = useMenuStore((state) => state.currentKey);
  const pageTitle = MENU[currentPage.toUpperCase() as keyof typeof MENU]?.title;

  return (
    <div className='flex min-h-screen'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator
                orientation='vertical'
                className='mr-2 data-[orientation=vertical]:h-4'
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {pageTitle && (
                    <>
                      <BreadcrumbItem className='hidden md:block'>
                        <BreadcrumbLink href='#'>{t(pageTitle)}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <Toaster richColors position='top-right' />
          <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
