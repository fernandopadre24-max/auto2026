'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Customer, Sale } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export type FinalizeSaleDetails = {
    customer: Customer;
    installments: number;
    paymentMethod: Sale['paymentMethod'];
}

type FinalizeSaleDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subtotal: number;
  customers: Customer[];
  saleType: 'prazo' | 'parcelado';
  onConfirm: (details: FinalizeSaleDetails) => void;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function FinalizeSaleDialog({
  isOpen,
  onOpenChange,
  subtotal,
  customers,
  saleType,
  onConfirm,
}: FinalizeSaleDialogProps) {
  const { toast } = useToast();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [installments, setInstallments] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('Prazo');
  
  useEffect(() => {
    if (isOpen) {
        if (saleType === 'prazo') {
            setInstallments(1);
            setPaymentMethod('Prazo')
        } else {
            setInstallments(1);
            setPaymentMethod('Parcelado')
        }
    }
  }, [saleType, isOpen]);

  const installmentValue = subtotal > 0 && installments > 0 ? subtotal / installments : 0;

  const handleConfirm = () => {
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) {
        toast({
            variant: 'destructive',
            title: 'Cliente não selecionado',
            description: 'Por favor, selecione um cliente para continuar.'
        });
        return;
    }
    const finalPaymentMethod = saleType === 'parcelado' ? 'Parcelado' : 'Prazo';
    onConfirm({ customer, installments, paymentMethod: finalPaymentMethod });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Venda {saleType === 'prazo' ? 'a Prazo' : 'Parcelada'}</DialogTitle>
          <DialogDescription>
            Selecione o cliente e as condições de pagamento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="grid gap-2">
                <Label htmlFor="customer">Cliente</Label>
                 <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId || ''}>
                    <SelectTrigger id="customer">
                        <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          
            {saleType === 'parcelado' && (
                <div className="grid gap-2">
                    <Label htmlFor="installments">Nº de Parcelas</Label>
                    <Input
                    id="installments"
                    type="number"
                    value={installments}
                    onChange={(e) => setInstallments(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    min="1"
                    />
                    {installments > 1 && (
                        <p className="text-sm text-center text-muted-foreground mt-2">
                            {installments}x de {formatCurrency(installmentValue)}
                        </p>
                    )}
                </div>
            )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar Venda</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
