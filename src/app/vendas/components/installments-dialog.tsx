'use client';

import { useState } from 'react';
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

type InstallmentsDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (installments: number) => void;
  subtotal: number;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function InstallmentsDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  subtotal,
}: InstallmentsDialogProps) {
  const [count, setCount] = useState(1);

  const installmentValue = subtotal > 0 && count > 0 ? subtotal / count : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Definir Parcelas</DialogTitle>
          <DialogDescription>
            Informe o número de parcelas para esta venda.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="installments" className="text-right col-span-2">
              Nº de Parcelas
            </Label>
            <Input
              id="installments"
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="col-span-2"
              min="1"
            />
          </div>
          {count > 1 && (
            <div className="text-center text-muted-foreground mt-2">
              <p>{count}x de {formatCurrency(installmentValue)}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(count)}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
