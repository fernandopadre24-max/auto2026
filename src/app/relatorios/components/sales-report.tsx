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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Sale, Employee, Part, Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

type SalesReportProps = {
  sales: Sale[];
  employees: Employee[];
  parts: Part[];
  customers: Customer[];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString); // Use new Date() for ISO strings
  return date.toLocaleDateString('pt-BR');
};

const formatPaymentMethod = (sale: Sale) => {
    if (sale.installments > 1) {
        return `${sale.paymentMethod} (${sale.installments}x)`;
    }
    return sale.paymentMethod;
}

export function SalesReport({
  sales,
  employees,
  parts,
  customers
}: SalesReportProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState('all');
  
    const filteredSales = React.useMemo(() => {
    let filtered = sales;
    if (selectedEmployeeId !== 'all') {
      filtered = sales.filter((sale) => sale.employeeId === selectedEmployeeId);
    }
    
    // Sort by employee name then by date (newest first)
    return filtered.sort((a, b) => {
      const employeeA = employees.find(e => e.id === a.employeeId);
      const employeeB = employees.find(e => e.id === b.employeeId);
      const nameA = employeeA ? `${employeeA.firstName} ${employeeA.lastName}` : '';
      const nameB = employeeB ? `${employeeB.firstName} ${employeeB.lastName}` : '';

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      // If names are equal, sort by date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [sales, selectedEmployeeId, employees]);


  const salesByEmployeeChartData = React.useMemo(() => {
    const salesMap = new Map<
      string,
      { name: string; total: number; sales: number }
    >();
    employees.forEach((emp) => {
      salesMap.set(emp.id, { name: `${emp.firstName} ${emp.lastName}`, total: 0, sales: 0 });
    });

    sales.forEach((sale) => {
      const empData = salesMap.get(sale.employeeId);
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

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}`: 'N/A';
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}`: 'N/A';
  }

  let lastEmployeeId: string | null = null;
  const colSpan = selectedEmployeeId === 'all' ? 6 : 5;

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Funcionário</CardTitle>
          <CardDescription>
            Receita total e número de vendas por funcionário.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesByEmployeeChartData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#8884d8"
                label={{
                  value: 'Receita (R$)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#82ca9d"
                label={{
                  value: 'Nº de Vendas',
                  angle: -90,
                  position: 'insideRight',
                }}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === 'total' ? formatCurrency(value as number) : value
                }
              />
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
                Exibindo {totalSales} vendas com uma receita total de{' '}
                {formatCurrency(totalRevenue)}.
              </CardDescription>
            </div>
            <div className="w-64">
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Funcionários</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
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
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => {
                  const showEmployeeHeader = selectedEmployeeId === 'all' && sale.employeeId !== lastEmployeeId;
                  if (showEmployeeHeader) {
                    lastEmployeeId = sale.employeeId;
                  }
                  return (
                    <React.Fragment key={sale.id}>
                      {showEmployeeHeader && (
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableCell colSpan={colSpan} className="font-bold text-primary">
                            {getEmployeeName(sale.employeeId)}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{getCustomerName(sale.customerId || '')}</TableCell>
                        <TableCell>
                          <ul>
                            {sale.items.map((item, index) => {
                              const part = parts.find((p) => p.id === item.partId);
                              return (
                                <li
                                  key={index}
                                  className="text-xs text-muted-foreground"
                                >
                                  {item.quantity}x {part?.name || 'Peça não encontrada'}
                                </li>
                              );
                            })}
                          </ul>
                        </TableCell>
                        <TableCell>{formatDate(sale.date)}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{formatPaymentMethod(sale)}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(sale.total)}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={colSpan} className="h-24 text-center">
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
