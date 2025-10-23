import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FuncionariosPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Funcionários" />
       <Card className="flex flex-col items-center justify-center min-h-[400px]">
        <CardHeader className="text-center">
            <CardTitle>Em Construção</CardTitle>
            <CardDescription>A gestão de funcionários estará disponível em breve.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Estamos trabalhando para trazer a você uma ferramenta completa para gerenciar sua equipe.</p>
        </CardContent>
      </Card>
    </div>
  );
}
