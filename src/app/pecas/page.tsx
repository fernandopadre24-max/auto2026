'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { PartsTable } from './components/parts-table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function PartsPage() {
  const firestore = useFirestore();
  const partsCollection = useMemoFirebase(
    () => collection(firestore, 'parts'),
    [firestore]
  );
  const { data: parts, isLoading } = useCollection(partsCollection);

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
        <PartsTable data={parts || []} />
      )}
    </div>
  );
}
