import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { DollarSign, Users, Package, ShoppingCart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { sales, parts } from '@/lib/data';

const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('pt-BR');
};

const getStatusInfo = (sale: (typeof sales)[0]) => {
    switch (sale.paymentMethod) {
        case 'Cartão':
        case 'PIX':
        case 'Dinheiro':
        case 'À Vista':
            return { text: 'Pago', variant: 'default', className: 'bg-green-600' };
        case 'Parcelado':
        case 'Prazo':
            return { text: 'Pendente', variant: 'secondary', className: '' };
        default:
            return { text: 'Pendente', variant: 'secondary', className: '' };
    }
}


export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Painel" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$45.231,89</div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">+19% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peças em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">2 abaixo do mínimo</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.slice(0, 5).map((sale) => {
                const statusInfo = getStatusInfo(sale);
                return (
                    <TableRow key={sale.id}>
                    <TableCell>
                        <div className="font-medium">{sale.customer?.name || 'N/A'}</div>
                        {sale.customer?.email && <div className="text-sm text-muted-foreground">{sale.customer.email}</div>}
                    </TableCell>
                    <TableCell>
                        <ul className="list-disc list-inside text-xs">
                        {sale.items.map((item, index) => {
                            const part = parts.find(p => p.id === item.partId);
                            return <li key={index}>{item.quantity}x {part?.name || 'Peça desconhecida'}</li>
                        })}
                        </ul>
                    </TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                    <TableCell>{sale.employee.name}</TableCell>
                    <TableCell className="text-right">{sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={statusInfo.variant as any} className={statusInfo.className}>{statusInfo.text}</Badge>
                    </TableCell>
                    </TableRow>
                )
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
