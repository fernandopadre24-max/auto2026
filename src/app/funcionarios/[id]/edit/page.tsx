import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { EditFuncionarioForm } from './components/edit-funcionario-form';

export default function EditFuncionarioPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Editar Funcionário" />
      <Card>
        <CardContent className="pt-6">
          <EditFuncionarioForm employeeId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
