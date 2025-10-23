'use client';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { FuncionariosTable } from './components/funcionarios-table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function FuncionariosPage() {
  const firestore = useFirestore();
  const employeesCollection = useMemoFirebase(
    () => collection(firestore, 'employees'),
    [firestore]
  );
  const { data: employees, isLoading } = useCollection(employeesCollection);

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
        <FuncionariosTable data={employees || []} />
      )}
    </div>
  );
}
