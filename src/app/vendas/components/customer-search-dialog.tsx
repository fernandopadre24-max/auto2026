'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/lib/types';

type CustomerSearchDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectCustomer: (customer: Customer) => void;
  customers: Customer[];
};

export function CustomerSearchDialog({
  isOpen,
  onOpenChange,
  onSelectCustomer,
  customers,
}: CustomerSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  useEffect(() => {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results = customers.filter(
        (customer) =>
          (customer.firstName.toLowerCase() + ' ' + customer.lastName.toLowerCase()).includes(lowerCaseSearchTerm) ||
          customer.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredCustomers(results);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
          <DialogDescription>
            Pesquise por nome ou e-mail para associar um cliente à venda.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Digite o nome ou e-mail do cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                >
                  <div>
                    <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectCustomer(customer)}
                  >
                    Selecionar
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground p-4">
                Nenhum cliente encontrado.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
