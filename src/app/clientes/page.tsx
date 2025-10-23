'use client';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { ClientesTable } from './components/clientes-table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientesPage() {
  const firestore = useFirestore();
  const customersCollection = useMemoFirebase(
    () => collection(firestore, 'customers'),
    [firestore]
  );
  const { data: customers, isLoading } = useCollection(customersCollection);

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
        <ClientesTable data={customers || []} />
      )}
    </div>
  );
}
