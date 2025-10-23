'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export function MainLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      open={isMobile ? false : undefined}
    >
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset className="p-4 md:p-6 lg:p-8">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
