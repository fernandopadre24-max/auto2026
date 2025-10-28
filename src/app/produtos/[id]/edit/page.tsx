import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { EditProdutoForm } from './components/edit-produto-form';

export default function EditProdutoPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Editar Produto" />
      <Card>
        <CardContent className="pt-6">
          <EditProdutoForm productId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
