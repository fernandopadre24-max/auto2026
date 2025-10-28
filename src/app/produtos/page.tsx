'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Archive, Package, DollarSign, AlertTriangle, TrendingUp, List, LayoutGrid } from 'lucide-react';
import { ProdutosTable } from './components/produtos-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useData } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMemo, useState } from 'react';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function ProdutosPage() {
  const { products, isLoading } = useData();
  const [viewMode, setViewMode] = useState<'retro' | 'modern'>('retro');

  const inventorySummary = useMemo(() => {
    if (!products) {
      return {
        totalSKUs: 0,
        totalItemsInStock: 0,
        inventoryValueCost: 0,
        inventoryValueSale: 0,
        lowStockItems: 0,
      };
    }
    const totalItemsInStock = products.reduce((acc, product) => acc + product.stock, 0);
    const inventoryValueCost = products.reduce((acc, product) => acc + product.stock * product.purchasePrice, 0);
    const inventoryValueSale = products.reduce((acc, product) => acc + product.stock * product.salePrice, 0);
    const lowStockItems = products.filter(p => p.stock < 10).length;

    return {
      totalSKUs: products.length,
      totalItemsInStock,
      inventoryValueCost,
      inventoryValueSale,
      lowStockItems,
    };
  }, [products]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'retro' ? 'modern' : 'retro');
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Catálogo de Produtos">
        <Button variant="ghost" size="icon" onClick={toggleViewMode}>
          {viewMode === 'retro' ? <LayoutGrid /> : <List />}
          <span className="sr-only">Alterar Visualização</span>
        </Button>
        <Button asChild>
          <Link href="/produtos/add">
            <PlusCircle />
            <span>Adicionar Produto</span>
          </Link>
        </Button>
      </PageHeader>
      
      <div className="sticky top-0 z-10 bg-background py-4 -mt-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card className="bg-blue-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Produtos (SKUs)</CardTitle>
                      <Archive className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{inventorySummary.totalSKUs}</div>
                      <p className="text-xs text-blue-100">Tipos de produtos únicos</p>
                  </CardContent>
              </Card>
              <Card className="bg-purple-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Itens Totais em Estoque</CardTitle>
                      <Package className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{inventorySummary.totalItemsInStock}</div>
                       <p className="text-xs text-purple-100">Unidades totais</p>
                  </CardContent>
              </Card>
               <Card className="bg-amber-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Valor do Estoque (Custo)</CardTitle>
                      <DollarSign className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(inventorySummary.inventoryValueCost)}</div>
                       <p className="text-xs text-amber-100">Custo total dos produtos</p>
                  </CardContent>
              </Card>
              <Card className="bg-emerald-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Potencial de Venda</CardTitle>
                      <TrendingUp className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(inventorySummary.inventoryValueSale)}</div>
                       <p className="text-xs text-emerald-100">Receita se tudo for vendido</p>
                  </CardContent>
              </Card>
              <Card className="bg-red-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Produtos com Estoque Baixo</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{inventorySummary.lowStockItems}</div>
                      <p className="text-xs text-red-100">Itens com menos de 10 unidades</p>
                  </CardContent>
              </Card>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-40 w-full" />
          <div className="flex justify-end space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ) : (
        <ProdutosTable data={products || []} viewMode={viewMode} />
      )}
    </div>
  );
}
