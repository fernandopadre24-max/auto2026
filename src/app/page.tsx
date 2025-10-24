'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { DollarSign, Users, Package, ShoppingCart, ChevronDown, ChevronRight } from 'lucide-react';
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
import { useMemo, useState } from 'react';
import type { Sale } from '@/lib/types';
import { Button } from '@/components/ui/button';
import React from 'react';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatPaymentMethod = (sale: Sale) => {
    if (sale.installments > 1) {
        return `${sale.paymentMethod} (${sale.installments}x)`;
    }
    return sale.paymentMethod;
}

export default function Home() {
  const { sales, parts, customers, employees } = useData();
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());

  const toggleEmployeeExpansion = (employeeId: string) => {
    setExpandedEmployees(prev => {
        const newSet = new Set(prev);
        if (newSet.has(employeeId)) {
            newSet.delete(employeeId);
        } else {
            newSet.add(employeeId);
        }
        return newSet;
    });
  }

  const recentSales = useMemo(() => sales.slice(0, 10), [sales]);
  
  const groupedSales = useMemo(() => {
    return recentSales.reduce((acc, sale) => {
        if (!acc[sale.employeeId]) {
            acc[sale.employeeId] = [];
        }
        acc[sale.employeeId].push(sale);
        return acc;
    }, {} as Record<string, Sale[]>);
  }, [recentSales]);

  const totalRevenue = useMemo(() => sales.reduce((acc, sale) => acc + sale.total, 0), [sales]);
  const totalParts = useMemo(() => parts.reduce((acc, part) => acc + part.stock, 0), [parts]);

  let lastEmployeeId: string | null = null;

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
                <TableHead className="w-12"></TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedSales).map(([employeeId, employeeSales]) => {
                const employee = employees.find(e => e.id === employeeId);
                const isExpanded = expandedEmployees.has(employeeId);
                const employeeSubtotal = employeeSales.reduce((acc, sale) => acc + sale.total, 0);

                return (
                  <React.Fragment key={employeeId}>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 cursor-pointer" onClick={() => toggleEmployeeExpansion(employeeId)}>
                        <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                        </TableCell>
                        <TableCell colSpan={4} className="font-bold text-primary">
                            {employee ? `(${employee.employeeCode}) ${employee.firstName} ${employee.lastName}` : 'Funcionário Desconhecido'}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">{formatCurrency(employeeSubtotal)}</TableCell>
                    </TableRow>
                    {isExpanded && employeeSales.map((sale) => {
                        const customer = customers.find(c => c.id === sale.customerId);
                        return (
                            <TableRow key={sale.id}>
                            <TableCell></TableCell>
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
                            <TableCell>
                              <Badge variant="secondary">{formatPaymentMethod(sale)}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            </TableRow>
                        )
                    })}
                  </React.Fragment>
                )
              })}
              {recentSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Nenhuma venda recente.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
