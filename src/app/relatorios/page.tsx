'use client';

import { PageHeader } from '@/components/page-header';
import { SalesReport } from './components/sales-report';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Part, Employee, Sale } from '@/lib/types';

export default function RelatoriosPage() {
  const firestore = useFirestore();

  const salesCollection = useMemoFirebase(() => collection(firestore, 'sales'), [firestore]);
  const { data: sales, isLoading: isLoadingSales } = useCollection<Sale>(salesCollection);

  const employeesCollection = useMemoFirebase(() => collection(firestore, 'employees'), [firestore]);
  const { data: employees, isLoading: isLoadingEmployees } = useCollection<Employee>(employeesCollection);

  const partsCollection = useMemoFirebase(() => collection(firestore, 'parts'), [firestore]);
  const { data: parts, isLoading: isLoadingParts } = useCollection<Part>(partsCollection);

  const isLoading = isLoadingSales || isLoadingEmployees || isLoadingParts;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Relatórios de Vendas" />
       {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <SalesReport sales={sales || []} employees={employees || []} parts={parts || []} />
      )}
    </div>
  );
}
