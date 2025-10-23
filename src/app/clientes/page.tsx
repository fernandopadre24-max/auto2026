import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { ClientesTable } from './components/clientes-table';
import { customers } from '@/lib/data';

export default function ClientesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Clientes">
        <Button asChild>
          <Link href="/clientes/add">
            <PlusCircle />
            <span>Adicionar Cliente</span>
          </Link>
        </Button>
      </PageHeader>
      <ClientesTable data={customers} />
    </div>
  );
}
