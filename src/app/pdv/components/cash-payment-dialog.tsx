'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type CashPaymentDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  total: number;
  onConfirm: (amountPaid: number) => void;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function CashPaymentDialog({
  isOpen,
  onOpenChange,
  total,
  onConfirm,
}: CashPaymentDialogProps) {
  const { toast } = useToast();
  const [amountPaid, setAmountPaid] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmountPaid('');
    }
  }, [isOpen]);
  
  const amountPaidNumber = useMemo(() => parseFloat(amountPaid.replace(',', '.')) || 0, [amountPaid]);
  const change = useMemo(() => amountPaidNumber - total, [amountPaidNumber, total]);

  const handleConfirm = () => {
    if (amountPaidNumber < total) {
      toast({
        variant: 'destructive',
        title: 'Valor Insuficiente',
        description: `O valor pago (${formatCurrency(amountPaidNumber)}) é menor que o total da venda (${formatCurrency(total)}).`,
      });
      return;
    }
    onConfirm(amountPaidNumber);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Pagamento em Dinheiro</DialogTitle>
          <DialogDescription>
            Insira o valor recebido do cliente para calcular o troco.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <Label>Total da Venda:</Label>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount-paid" className="text-base">Valor Pago:</Label>
            <Input
              id="amount-paid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="Ex: 50,00"
              className="text-center text-xl h-12"
              autoFocus
            />
          </div>
          <div className={`flex items-center justify-between text-lg font-bold ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
            <Label>Troco:</Label>
            <span>{formatCurrency(change)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!amountPaid}>Confirmar Pagamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
