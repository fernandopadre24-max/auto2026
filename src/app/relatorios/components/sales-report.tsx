'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Sale, Employee, Part } from '@/lib/types';

type SalesReportProps = {
  sales: Sale[];
  employees: Employee[];
  parts: Part[];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('pt-BR');
};

export function SalesReport({ sales, employees, parts }: SalesReportProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState('all');

  const filteredSales = React.useMemo(() => {
    if (selectedEmployeeId === 'all') {
      return sales;
    }
    return sales.filter((sale) => sale.employee.id === selectedEmployeeId);
  }, [sales, selectedEmployeeId]);

  const salesByEmployeeChartData = React.useMemo(() => {
    const salesMap = new Map<string, { name: string; total: number; sales: number }>();
    employees.forEach(emp => {
        salesMap.set(emp.id, { name: emp.name, total: 0, sales: 0 });
    });

    sales.forEach(sale => {
        const empData = salesMap.get(sale.employee.id);
        if (empData) {
            empData.total += sale.total;
            empData.sales += 1;
        }
    });

    return Array.from(salesMap.values());
  }, [sales, employees]);


  const totalRevenue = React.useMemo(() => {
    return filteredSales.reduce((acc, sale) => acc + sale.total, 0);
  }, [filteredSales]);

  const totalSales = filteredSales.length;

  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
            <CardTitle>Desempenho por Funcionário</CardTitle>
            <CardDescription>Receita total e número de vendas por funcionário.</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByEmployeeChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Receita (R$)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Nº de Vendas', angle: -90, position: 'insideRight' }} />
                    <Tooltip formatter={(value, name) => name === 'total' ? formatCurrency(value as number) : value} />
                    <Bar yAxisId="left" dataKey="total" fill="#8884d8" name="Receita" />
                    <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" name="Vendas" />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
       </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Vendas Detalhadas</CardTitle>
                <CardDescription>
                    Exibindo {totalSales} vendas com uma receita total de {formatCurrency(totalRevenue)}.
                </CardDescription>
            </div>
            <div className="w-64">
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Funcionários</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID da Venda</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.employee.name}</TableCell>
                    <TableCell>{sale.customer?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <ul>
                        {sale.items.map((item, index) => {
                            const part = parts.find(p => p.id === item.partId);
                            return (
                                <li key={index} className="text-xs text-muted-foreground">
                                    {item.quantity}x {part?.name || 'Peça não encontrada'}
                                </li>
                            )
                        })}
                      </ul>
                    </TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(sale.total)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
