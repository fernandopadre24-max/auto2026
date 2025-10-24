import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { EditPartForm } from './components/edit-part-form';

export default function EditPartPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Editar Peça" />
      <Card>
        <CardContent className="pt-6">
          <EditPartForm partId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
