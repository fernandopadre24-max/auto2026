import { SidebarTrigger } from '@/components/ui/sidebar';

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-2xl font-bold font-headline md:text-3xl tracking-tight">
        {title}
      </h1>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
