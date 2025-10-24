import { PageHeader } from '@/components/page-header';
import { AddPartForm } from './components/add-part-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
          <AddPartForm />
        </CardContent>
      </Card>
    </div>
  );
}
