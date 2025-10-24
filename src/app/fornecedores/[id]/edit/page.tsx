import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { EditFornecedorForm } from './components/edit-fornecedor-form';

export default function EditFornecedorPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Editar Fornecedor" />
      <Card>
        <CardContent className="pt-6">
          <EditFornecedorForm supplierId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
