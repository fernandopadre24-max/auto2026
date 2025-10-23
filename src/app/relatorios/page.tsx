import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Relatórios" />
       <Card className="flex flex-col items-center justify-center min-h-[400px]">
        <CardHeader className="text-center">
            <CardTitle>Em Construção</CardTitle>
            <CardDescription>A geração de relatórios estará disponível em breve.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Estamos trabalhando para trazer a você uma ferramenta completa para análise de vendas e performance.</p>
        </CardContent>
      </Card>
    </div>
  );
}
