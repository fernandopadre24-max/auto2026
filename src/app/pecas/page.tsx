import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { PartsTable } from './components/parts-table';
import { parts } from '@/lib/data';

export default function PartsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Catálogo de Peças">
        <Button asChild>
          <Link href="/pecas/add">
            <PlusCircle />
            <span>Adicionar Peça</span>
          </Link>
        </Button>
      </PageHeader>
      <PartsTable data={parts} />
    </div>
  );
}
