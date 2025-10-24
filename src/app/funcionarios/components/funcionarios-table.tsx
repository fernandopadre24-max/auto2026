
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
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '@/lib/types';
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
  ExpandedState,
  getExpandedRowModel,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { formatPhoneNumber } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

type FuncionariosTableProps = {
  data: Employee[];
};

export function FuncionariosTable({ data }: FuncionariosTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const { deleteEmployee } = useData();
  const { toast } = useToast();
  const [employeeToDelete, setEmployeeToDelete] =
    React.useState<Employee | null>(null);

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete.id);
      toast({
        title: 'Funcionário Demitido',
        description: `O funcionário "${employeeToDelete.firstName} ${employeeToDelete.lastName}" foi removido do sistema.`,
      });
      setEmployeeToDelete(null);
    }
  };

  const columns: ColumnDef<Employee>[] = [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={row.getToggleExpandedHandler()}
            className="h-8 w-8"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: 'employeeCode',
      header: 'Código',
    },
    {
      accessorKey: 'firstName',
      header: 'Nome',
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Contato',
      cell: ({ row }) =>
        row.original.phoneNumber
          ? formatPhoneNumber(row.original.phoneNumber)
          : '',
    },
    {
      accessorKey: 'role',
      header: 'Cargo',
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Ações</div>,
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/funcionarios/${employee.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => handleDelete(employee)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Demitir</span>
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
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting,
      columnFilters,
      expanded,
    },
  });

  return (
    <>
      <DeleteConfirmationDialog
        isOpen={!!employeeToDelete}
        onOpenChange={() => setEmployeeToDelete(null)}
        onConfirm={confirmDelete}
        itemName={`${employeeToDelete?.firstName} ${employeeToDelete?.lastName}`}
        itemType="funcionário"
        actionName="Demitir"
      />
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <Input
            placeholder="Filtrar por nome..."
            value={
              (table.getColumn('firstName')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('firstName')?.setFilterValue(event.target.value)
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
                  <React.Fragment key={row.id}>
                    <TableRow
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
                    {row.getIsExpanded() && (
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={columns.length}>
                          <Card>
                            <CardContent className="pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Endereço
                                  </h4>
                                  <p>
                                    {row.original.address || 'Não informado'}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">CPF</h4>
                                  <p>{row.original.cpf || 'Não informado'}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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
    </>
  );
}
