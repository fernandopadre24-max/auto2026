import { PageHeader } from '@/components/page-header';
import { SalesReport } from './components/sales-report';
import { sales, employees, parts } from '@/lib/data';

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Relatórios de Vendas" />
      <SalesReport sales={sales} employees={employees} parts={parts} />
    </div>
  );
}
