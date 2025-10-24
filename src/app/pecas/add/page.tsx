import { PageHeader } from '@/components/page-header';
import { AddPartForm } from './components/add-part-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AddPartPage() {
  return (
    <div className="flex flex-col gap-8">
       <PageHeader title="Adicionar Nova Peça">
        <Button asChild variant="outline">
          <Link href="/pecas">
            Voltar para a Lista
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <AddPartForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
