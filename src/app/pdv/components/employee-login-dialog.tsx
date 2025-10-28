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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type EmployeeLoginDialogProps = {
  isOpen: boolean;
  employees: Employee[];
  onLogin: (employee: Employee) => void;
  onCancel: () => void;
};

const ALLOWED_POSITIONS = ['Vendedor', 'Caixa', 'Gerente', 'Administrador'];

export function EmployeeLoginDialog({
  isOpen,
  employees,
  onLogin,
  onCancel,
}: EmployeeLoginDialogProps) {
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const handleLogin = () => {
    if (!selectedEmployeeId) {
      toast({
        variant: 'destructive',
        title: 'Seleção Necessária',
        description: 'Por favor, selecione um funcionário para continuar.',
      });
      return;
    }

    const employee = employees.find((e) => e.id === selectedEmployeeId);

    if (!employee) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Funcionário não encontrado.',
      });
      return;
    }

    if (ALLOWED_POSITIONS.includes(employee.role)) {
      onLogin(employee);
    } else {
      toast({
        variant: 'destructive',
        title: 'Acesso Negado',
        description: `O cargo "${employee.role}" não tem permissão para acessar o PDV.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Login do Operador</DialogTitle>
          <DialogDescription>
            Selecione seu nome para iniciar o Ponto de Venda (PDV). Apenas
            cargos autorizados podem continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select onValueChange={setSelectedEmployeeId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um funcionário..." />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} - ({employee.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleLogin}>Entrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
