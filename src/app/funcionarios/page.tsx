import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { FuncionariosTable } from './components/funcionarios-table';
import { employees } from '@/lib/data';

export default function FuncionariosPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Funcionários">
        <Button asChild>
          <Link href="/funcionarios/add">
            <PlusCircle />
            <span>Adicionar Funcionário</span>
          </Link>
        </Button>
      </PageHeader>
      <FuncionariosTable data={employees} />
    </div>
  );
}
