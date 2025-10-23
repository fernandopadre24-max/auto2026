import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { AddClienteForm } from './components/add-cliente-form';

export default function AddClientePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Adicionar Novo Cliente" />
      <Card>
        <CardContent className="pt-6">
          <AddClienteForm />
        </CardContent>
      </Card>
    </div>
  );
}
