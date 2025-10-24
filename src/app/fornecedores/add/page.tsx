import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { AddFornecedorForm } from './components/add-fornecedor-form';

export default function AddFornecedorPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Adicionar Novo Fornecedor" />
      <Card>
        <CardContent className="pt-6">
          <AddFornecedorForm />
        </CardContent>
      </Card>
    </div>
  );
}
