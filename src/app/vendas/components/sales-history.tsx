'use client';

import * as React from 'react';
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
import type { Sale, Employee, Product, Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type SalesHistoryProps = {
  sales: Sale[];
  employees: Employee[];
  products: Product[];
  customers: Customer[];
  onConfirmPayment: (saleId: string) => void;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatPaymentMethod = (sale: Sale) => {
    if (sale.paymentMethod === 'Prazo') {
      return `${sale.termPaymentMethod} (Vence: ${formatDate(sale.dueDate)})`;
    }
     if (sale.paymentMethod === 'Parcelado' && sale.installments > 1) {
        return `Cartão em ${sale.installments}x`;
    }
     if (sale.paymentMethod === 'Cartão' && sale.installments > 1) {
        return `Cartão em ${sale.installments}x`;
    }
    return sale.paymentMethod;
}

export function SalesHistory({
  sales,
  employees,
  products,
  customers,
  onConfirmPayment,
}: SalesHistoryProps) {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [expandedSales, setExpandedSales] = React.useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const handleConfirmPayment = (saleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onConfirmPayment(saleId);
    toast({
        title: 'Pagamento Confirmado!',
        description: 'O status da venda foi atualizado para "Pago".',
    });
  };

  const toggleSaleExpansion = (saleId: string) => {
    setExpandedSales(prev => {
        const newSet = new Set(prev);
        if (newSet.has(saleId)) {
            newSet.delete(saleId);
        } else {
            newSet.add(saleId);
        }
        return newSet;
    });
  }
  
  const filteredSales = React.useMemo(() => {
    let filtered = sales;

    if (dateRange?.from) {
        filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.date);
            const from = dateRange.from!;
            from.setHours(0, 0, 0, 0);
            if (dateRange.to) {
                const to = dateRange.to;
                to.setHours(23, 59, 59, 999);
                return saleDate >= from && saleDate <= to;
            }
            return saleDate >= from;
        });
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((sale) => sale.status === selectedStatus);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, selectedStatus, dateRange]);


  const totalFilteredRevenue = filteredSales.reduce((acc, sale) => acc + sale.total, 0);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}`: 'N/A';
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}`: 'Consumidor Final';
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Filtrar Vendas</CardTitle>
              <CardDescription>
                Exibindo {filteredSales.length} vendas com um total de {formatCurrency(totalFilteredRevenue)}.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                 <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                 <div className="w-64">
                    <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                    >
                        <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="Pago">Pago</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => {
                    const isExpanded = expandedSales.has(sale.id);
                    return (
                        <React.Fragment key={sale.id}>
                             <TableRow className="cursor-pointer" onClick={() => toggleSaleExpansion(sale.id)}>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                </TableCell>
                                <TableCell>{formatDate(sale.date)}</TableCell>
                                <TableCell>{getCustomerName(sale.customerId || '')}</TableCell>
                                <TableCell>{getEmployeeName(sale.employeeId)}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{formatPaymentMethod(sale)}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn({
                                            'bg-green-100 text-green-800': sale.status === 'Pago',
                                            'bg-yellow-100 text-yellow-800': sale.status === 'Pendente',
                                            'bg-red-100 text-red-800': sale.status === 'Cancelado',
                                        })}>{sale.status}</Badge>
                                        {sale.status === 'Pendente' && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600 hover:bg-green-100" onClick={(e) => handleConfirmPayment(sale.id, e)}>
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                    <p>Confirmar Pagamento</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(sale.total)}</TableCell>
                            </TableRow>
                            {isExpanded && (
                                <TableRow>
                                    <TableCell colSpan={7} className="p-0">
                                        <div className="p-4 bg-muted/50">
                                            <h4 className="font-bold mb-2">Itens da Venda:</h4>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Produto</TableHead>
                                                        <TableHead>Qtd.</TableHead>
                                                        <TableHead>Preço Unit.</TableHead>
                                                        <TableHead className="text-right">Subtotal</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sale.items.map((item, index) => {
                                                        const product = products.find(p => p.id === item.productId);
                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell>{product?.name || 'Produto não encontrado'}</TableCell>
                                                                <TableCell>{item.quantity}</TableCell>
                                                                <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                                                                <TableCell className="text-right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhuma venda encontrada para o período ou status selecionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
             {filteredSales.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} className="text-right font-bold">Total do Período</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totalFilteredRevenue)}</TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
