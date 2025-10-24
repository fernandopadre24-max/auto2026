'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import type { Part } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

type PartsTableProps = {
  data: Part[];
  viewMode: 'retro' | 'modern';
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export function PartsTable({ data, viewMode }: PartsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const router = useRouter();
  const { deletePart } = useData();
  const { toast } = useToast();
  const [partToDelete, setPartToDelete] = React.useState<Part | null>(null);

  const uniqueUnits = React.useMemo(() => {
    const units = new Set(data.map(part => part.unit));
    return Array.from(units);
  }, [data]);

  const handleDuplicate = (partId: string) => {
    router.push(`/pecas/add?duplicateId=${partId}`);
  };

  const handleDelete = (part: Part) => {
    setPartToDelete(part);
  };

  const confirmDelete = () => {
    if (partToDelete) {
      deletePart(partToDelete.id);
      toast({
        title: 'Peça Excluída',
        description: `A peça "${partToDelete.name}" foi excluída com sucesso.`,
      });
      setPartToDelete(null);
    }
  };

  const columns: ColumnDef<Part>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
    },
    {
      accessorKey: 'unit',
      header: 'Unidade',
    },
    {
      accessorKey: 'manufacturer',
      header: 'Fabricante',
    },
    {
      accessorKey: 'vehicleModel',
      header: 'Modelo Veículo',
    },
    {
      accessorKey: 'stock',
      header: () => <div className="text-right">Estoque</div>,
      cell: ({ row }) => {
        const stock = parseFloat(row.getValue('stock'));
        return <div className="text-right font-medium">{stock}</div>;
      },
    },
    {
      accessorKey: 'salePrice',
      header: () => <div className="text-right">Preço de Venda</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('salePrice'));
        const formattedAmount = formatCurrency(amount);
        return <div className="text-right font-medium">{formattedAmount}</div>;
      },
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('category')}</Badge>,
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Ações</div>,
      cell: ({ row }) => {
        const part = row.original;
        const isRetro = viewMode === 'retro';
        return (
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" className={`h-8 w-8 ${isRetro ? 'hover:bg-yellow-200' : ''}`} onClick={() => handleDuplicate(part.id)}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Duplicar</span>
            </Button>
            <Button variant="ghost" size="icon" className={`h-8 w-8 ${isRetro ? 'hover:bg-yellow-200' : ''}`} asChild>
              <Link href={`/pecas/${part.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className={`h-8 w-8 text-red-500 hover:text-red-600 ${isRetro ? 'hover:bg-yellow-200' : ''}`} onClick={() => handleDelete(part)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const filterBackgroundColor = viewMode === 'retro' ? 'bg-blue-800 text-white' : 'bg-card';
  const filterInputColor = viewMode === 'retro' ? 'bg-white text-black' : '';


  const renderTable = () => {
    if (viewMode === 'retro') {
      return (
        <Card className="font-mono text-black bg-yellow-100 border-yellow-200 shadow-lg">
          <CardContent className="p-0">
              <Table>
              <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b-gray-400 border-dashed hover:bg-yellow-100/50">
                      {headerGroup.headers.map((header) => {
                      return (
                          <TableHead key={header.id} className="text-black">
                          {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                              )}
                          </TableHead>
                      );
                      })}
                  </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                  {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="text-xs border-b border-dashed border-gray-400/50 hover:bg-yellow-100/50"
                      >
                      {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                          {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                          )}
                          </TableCell>
                      ))}
                      </TableRow>
                  ))
                  ) : (
                  <TableRow>
                      <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                      >
                      Nenhum resultado.
                      </TableCell>
                  </TableRow>
                  )}
              </TableBody>
              </Table>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <>
    <DeleteConfirmationDialog
        isOpen={!!partToDelete}
        onOpenChange={() => setPartToDelete(null)}
        onConfirm={confirmDelete}
        itemName={partToDelete?.name || ''}
        itemType="peça"
      />
    <div className="flex flex-col gap-4">
      <Card className={`${filterBackgroundColor} p-4`}>
        <CardContent className="p-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
            placeholder="Filtrar por nome..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className={filterInputColor}
            />
            <Input
            placeholder="Filtrar por fabricante..."
            value={(table.getColumn('manufacturer')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
                table.getColumn('manufacturer')?.setFilterValue(event.target.value)
            }
             className={filterInputColor}
            />
            <Input
            placeholder="Filtrar por categoria..."
            value={(table.getColumn('category')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
                table.getColumn('category')?.setFilterValue(event.target.value)
            }
             className={filterInputColor}
            />
            <Select
                value={(table.getColumn('unit')?.getFilterValue() as string) ?? ''}
                onValueChange={(value) => table.getColumn('unit')?.setFilterValue(value === 'all' ? '' : value)}
            >
                <SelectTrigger className={filterInputColor}>
                    <SelectValue placeholder="Filtrar por Unidade" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as Unidades</SelectItem>
                    {uniqueUnits.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        </CardContent>
      </Card>
      
      {renderTable()}

       <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
    </>
  );
}
