'use client';

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
import { useData } from '@/lib/data';
import { useMemo } from 'react';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function Home() {
  const { sales, parts, customers, employees } = useData();

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

    const totalRevenue = useMemo(() => sales.reduce((acc, sale) => acc + sale.total, 0), [sales]);
    const totalParts = useMemo(() => parts.reduce((acc, part) => acc + part.stock, 0), [parts]);

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
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{customers.length}</div>
            <p className="text-xs text-muted-foreground">+180.1% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length}</div>
            <p className="text-xs text-muted-foreground">+19% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peças em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParts}</div>
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
                const customer = customers.find(c => c.id === sale.customerId);
                const employee = employees.find(e => e.id === sale.employeeId);
                return (
                    <TableRow key={sale.id}>
                    <TableCell>
                        <div className="font-medium">{customer ? `${customer.firstName} ${customer.lastName}`: 'N/A'}</div>
                        {customer?.email && <div className="text-sm text-muted-foreground">{customer.email}</div>}
                    </TableCell>
                    <TableCell>
                        <ul className="list-disc list-inside text-xs">
                        {sale.items.map((item, index) => {
                            const part = parts.find(p => p.id === item.partId);
                            return <li key={index}>{item.quantity}x {part?.name || 'Peça desconhecida'} ({formatCurrency(item.unitPrice)})</li>
                        })}
                        </ul>
                    </TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                    <TableCell>{employee ? `${employee.firstName} ${employee.lastName}` : 'N/A'}</TableCell>
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
