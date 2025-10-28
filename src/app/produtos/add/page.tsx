import { PageHeader } from '@/components/page-header';
import { AddProdutoForm } from './components/add-produto-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AddProdutoPage() {
  return (
    <div className="flex flex-col gap-8">
       <PageHeader title="Adicionar Novo Produto">
        <Button asChild variant="outline">
          <Link href="/produtos">
            Voltar para a Lista
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <AddProdutoForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
