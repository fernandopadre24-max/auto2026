'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useData } from '@/lib/data';
import { SalesHistory } from './components/sales-history';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Hourglass, ShoppingCart, TrendingUp } from 'lucide-react';


const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};


export default function VendasPage() {
  const { sales, employees, products, customers, isLoading, confirmPayment } = useData();

  const salesSummary = useMemo(() => {
    if (!sales) {
      return {
        totalRevenue: 0,
        paidRevenue: 0,
        pendingRevenue: 0,
        salesCount: 0,
      };
    }
    const paidRevenue = sales.filter(s => s.status === 'Pago').reduce((acc, sale) => acc + sale.total, 0);
    const pendingRevenue = sales.filter(s => s.status === 'Pendente').reduce((acc, sale) => acc + sale.total, 0);
    
    return {
      totalRevenue: sales.reduce((acc, sale) => acc + sale.total, 0),
      paidRevenue,
      pendingRevenue,
      salesCount: sales.length,
    };
  }, [sales]);


  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Histórico de Vendas" />
       {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-blue-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                      <TrendingUp className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(salesSummary.totalRevenue)}</div>
                      <p className="text-xs text-blue-100">Soma de todas as vendas</p>
                  </CardContent>
              </Card>
              <Card className="bg-emerald-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Receita Paga</CardTitle>
                      <DollarSign className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(salesSummary.paidRevenue)}</div>
                       <p className="text-xs text-emerald-100">Total já recebido</p>
                  </CardContent>
              </Card>
               <Card className="bg-amber-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Receita Pendente</CardTitle>
                      <Hourglass className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(salesSummary.pendingRevenue)}</div>
                       <p className="text-xs text-amber-100">Valores a receber</p>
                  </CardContent>
              </Card>
              <Card className="bg-purple-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{salesSummary.salesCount}</div>
                       <p className="text-xs text-purple-100">Número de transações</p>
                  </CardContent>
              </Card>
          </div>
        )}
      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <SalesHistory
          sales={sales}
          employees={employees}
          products={products}
          customers={customers}
          onConfirmPayment={confirmPayment}
        />
      )}
    </div>
  );
}
