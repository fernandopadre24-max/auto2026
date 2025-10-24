'use client';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { FornecedoresTable } from './components/fornecedores-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useData } from '@/lib/data';

export default function FornecedoresPage() {
  const { suppliers, isLoading } = useData();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Fornecedores">
        <Button asChild>
          <Link href="/fornecedores/add">
            <PlusCircle />
            <span>Adicionar Fornecedor</span>
          </Link>
        </Button>
      </PageHeader>
      {isLoading ? (
         <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-40 w-full" />
          <div className="flex justify-end space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ) : (
        <FornecedoresTable data={suppliers || []} />
      )}
    </div>
  );
}
