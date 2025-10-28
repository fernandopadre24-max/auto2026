'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  Users,
  BookUser,
  BarChart2,
  Settings,
  Calculator,
  Calendar,
  Truck,
  Shirt,
  Store,
  Receipt,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { useData } from '@/lib/data';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

const menuItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/pdv', label: 'PDV', icon: Store },
  { href: '/vendas', label: 'Vendas', icon: Receipt },
  { href: '/produtos', label: 'Produtos', icon: Shirt },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/funcionarios', label: 'Funcionários', icon: BookUser },
  { href: '/fornecedores', label: 'Fornecedores', icon: Truck },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart2 },
  { href: '/calendario', label: 'Calendário', icon: Calendar },
  { href: '/calculadora', label: 'Calculadora', icon: Calculator },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { config } = useData();

  const isPdvPage = pathname === '/pdv';

  if (isPdvPage) {
    return null;
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shirt className="h-5 w-5" />
          </div>
          {state === 'expanded' && (
            <h1 className="text-xl font-semibold font-headline truncate">
              {config.storeName || 'Fashion Store'}
            </h1>
          )}
          <div className="flex-1" />
          <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(href) && (href !== '/' || pathname === '/')}
                tooltip={{ children: label }}
              >
                <Link href={href}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter>
        <ThemeToggleButton />
      </SidebarFooter>
    </>
  );
}
