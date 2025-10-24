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
import type { Customer, Sale, TermPaymentMethod } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type FinalizeSaleDetails = {
    customer: Customer;
    installments: number;
    paymentMethod: Sale['paymentMethod'];
    dueDate?: string;
    termPaymentMethod?: TermPaymentMethod;
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
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [termPaymentMethod, setTermPaymentMethod] = useState<TermPaymentMethod>('Boleto');
  
  useEffect(() => {
    if (isOpen) {
        setSelectedCustomerId(null);
        if (saleType === 'prazo') {
            setInstallments(1);
            setPaymentMethod('Prazo')
            setDueDate(new Date(new Date().setDate(new Date().getDate() + 30))); // Default 30 days
            setTermPaymentMethod('Boleto');
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
    
    if (saleType === 'prazo' && !dueDate) {
        toast({
            variant: 'destructive',
            title: 'Data de Vencimento',
            description: 'Por favor, selecione uma data de vencimento.'
        });
        return;
    }

    const finalPaymentMethod = saleType === 'parcelado' ? 'Parcelado' : 'Prazo';
    onConfirm({ 
        customer, 
        installments, 
        paymentMethod: finalPaymentMethod,
        dueDate: saleType === 'prazo' ? dueDate?.toISOString() : undefined,
        termPaymentMethod: saleType === 'prazo' ? termPaymentMethod : undefined,
     });
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
             {saleType === 'prazo' && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="dueDate">Data de Vencimento</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                    locale={ptBR}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="termPaymentMethod">Forma de Pagamento</Label>
                        <Select onValueChange={(value) => setTermPaymentMethod(value as TermPaymentMethod)} value={termPaymentMethod}>
                            <SelectTrigger id="termPaymentMethod">
                                <SelectValue placeholder="Selecione a forma de pagamento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Boleto">Boleto Bancário</SelectItem>
                                <SelectItem value="Transferencia">Transferência Bancária</SelectItem>
                                <SelectItem value="Cheque">Cheque</SelectItem>
                                <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
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
