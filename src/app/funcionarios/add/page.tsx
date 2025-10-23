import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { AddFuncionarioForm } from './components/add-funcionario-form';

export default function AddFuncionarioPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Adicionar Novo Funcionário" />
      <Card>
        <CardContent className="pt-6">
          <AddFuncionarioForm />
        </CardContent>
      </Card>
    </div>
  );
}
