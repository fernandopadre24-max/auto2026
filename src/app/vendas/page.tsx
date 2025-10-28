'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useData } from '@/lib/data';
import { SalesHistory } from './components/sales-history';

export default function VendasPage() {
  const { sales, employees, products, customers, isLoading, confirmPayment } = useData();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Histórico de Vendas" />
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
