import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { ConfigForm } from './components/config-form';

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Configurações da Loja" />
      <Card>
        <CardContent className="pt-6">
          <ConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}
