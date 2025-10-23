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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
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

type PartsTableProps = {
  data: Part[];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const columns: ColumnDef<Part>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
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
    accessorKey: 'purchasePrice',
    header: () => <div className="text-right">Preço de Compra</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('purchasePrice'));
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'salePrice',
    header: () => <div className="text-right">Preço de Venda</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('salePrice'));
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    cell: ({ row }) => <Badge variant="secondary">{row.getValue('category')}</Badge>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const part = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(part.id)}
            >
              Copiar ID da peça
            </DropdownMenuItem>
            <DropdownMenuItem>Editar Peça</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600">
              Excluir Peça
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PartsTable({ data }: PartsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
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
  );
}
