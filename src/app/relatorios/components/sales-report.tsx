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
  TableFooter,
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
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    if (sale.paymentMethod === 'Parcelado' && sale.installments > 1) {
        return `Cartão em ${sale.installments}x`;
    }
     if (sale.paymentMethod === 'Cartão' && sale.installments > 1) {
        return `Cartão em ${sale.installments}x`;
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
  const [expandedEmployees, setExpandedEmployees] = React.useState<Set<string>>(new Set());

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
  
    const filteredSales = React.useMemo(() => {
    let filtered = sales;
    if (selectedEmployeeId !== 'all') {
      filtered = sales.filter((sale) => sale.employeeId === selectedEmployeeId);
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, selectedEmployeeId]);

  const groupedSales = React.useMemo(() => {
    return filteredSales.reduce((acc, sale) => {
      const employee = employees.find(e => e.id === sale.employeeId);
      if (employee) {
        if (!acc[employee.id]) {
          acc[employee.id] = {
            employee: employee,
            sales: [],
            total: 0
          };
        }
        acc[employee.id].sales.push(sale);
        acc[employee.id].total += sale.total;
      }
      return acc;
    }, {} as Record<string, { employee: Employee; sales: Sale[]; total: number }>);
  }, [filteredSales, employees]);

  const employeeGroupOrder = React.useMemo(() => {
    return Object.values(groupedSales)
      .sort((a,b) => a.employee.firstName.localeCompare(b.employee.firstName))
      .map(group => group.employee.id);
  }, [groupedSales]);


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
    return employee ? `(${employee.employeeCode}) ${employee.firstName} ${employee.lastName}`: 'N/A';
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}`: 'N/A';
  }

  const getHeaderColSpan = () => selectedEmployeeId === 'all' ? 5 : 6;


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
                {selectedEmployeeId === 'all' && <TableHead className="w-12"></TableHead>}
                <TableHead>ID da Venda</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalSales > 0 ? (
                selectedEmployeeId !== 'all' ? (
                    filteredSales.map((sale) => (
                        <TableRow key={sale.id}>
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
                    ))
                ) : (
                    employeeGroupOrder.map(employeeId => {
                        const group = groupedSales[employeeId];
                        const isExpanded = expandedEmployees.has(employeeId);
                        return (
                            <React.Fragment key={employeeId}>
                                <TableRow className="bg-muted/50 hover:bg-muted/50 cursor-pointer" onClick={() => toggleEmployeeExpansion(employeeId)}>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                    <TableCell colSpan={getHeaderColSpan() - 1} className="font-bold text-primary">
                                        {getEmployeeName(employeeId)}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-primary">
                                        {formatCurrency(group.total)}
                                    </TableCell>
                                </TableRow>
                                {isExpanded && group.sales.map(sale => (
                                     <TableRow key={sale.id}>
                                        <TableCell />
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
                                ))}
                            </React.Fragment>
                        )
                    })
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
             {totalSales > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={selectedEmployeeId === 'all' ? 6 : 6} className="text-right font-bold">Total Geral</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totalRevenue)}</TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
