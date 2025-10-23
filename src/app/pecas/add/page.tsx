import { PageHeader } from '@/components/page-header';
import { AddPartForm } from './components/add-part-form';
import { Card, CardContent } from '@/components/ui/card';

export default function AddPartPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Adicionar Nova Peça" />
      <Card>
        <CardContent className="pt-6">
          <AddPartForm />
        </CardContent>
      </Card>
    </div>
  );
}
