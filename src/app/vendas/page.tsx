'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Part, Customer, Employee, Sale } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CustomerSearchDialog } from './components/customer-search-dialog';
import {
  FinalizeSaleDialog,
  type FinalizeSaleDetails,
} from './components/finalize-sale-dialog';
import { EmployeeLoginDialog } from './components/employee-login-dialog';
import { useData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

type CartItem = {
  part: Part;
  quantity: number;
  unit: string;
  discount: number;
};

const formatCurrency = (value: number | undefined | null) => {
  if (value === undefined || value === null) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function VendasPage() {
  const { toast } = useToast();
  const router = useRouter();

  const { parts: allPartsData, customers: allCustomersData, employees: allEmployeesData, isLoading: isDataLoading, config, addSale } = useData();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastSaleItems, setLastSaleItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Part | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<string>('UN');
  const [lastAction, setLastAction] = useState('Caixa Livre');
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isFinalizeSaleDialogOpen, setIsFinalizeSaleDialogOpen] =
    useState(false);
  const [saleType, setSaleType] = useState<'prazo' | 'parcelado'>('prazo');
  const [authenticatedEmployee, setAuthenticatedEmployee] =
    useState<Employee | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const filteredParts = useMemo(() => {
    if (searchTerm && allPartsData) {
      return allPartsData.filter(
        (part) =>
          part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (part.sku && part.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return [];
  }, [searchTerm, allPartsData]);

  const handleAddItemToCart = (part: Part) => {
    if (!part) return;

    const existingItem = cartItems.find((item) => item.part.id === part.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { part, quantity, unit, discount: 0 }]);
    }
    setLastAction(`Adicionado: ${quantity}x ${part.name}`);
    setSearchTerm('');
    setSelectedItem(null);
    setQuantity(1);
    setUnit('UN');
  };

  const handleSelectSearchedItem = (part: Part) => {
    setSelectedItem(part);
    setSearchTerm(part.name);
    if (part.unit) {
      setUnit(part.unit);
    }
    document.getElementById('item-search')?.focus();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authenticatedEmployee');
    setAuthenticatedEmployee(null);
    router.push('/');
  };

  const restoreLastSale = useCallback(() => {
    if (lastSaleItems.length === 0) {
      toast({
        title: 'Nenhuma Venda Recente',
        description: 'Não há uma última venda para restaurar.',
      });
      return;
    }
    setCartItems([...lastSaleItems]);
    setLastAction('Última venda restaurada.');
    toast({
      title: 'Última Venda Restaurada',
      description: 'Os itens da última venda foram adicionados ao carrinho.',
    });
  }, [lastSaleItems, toast]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && selectedItem) {
      handleAddItemToCart(selectedItem);
    }
    if (e.key === 'Escape') {
      handleLogout();
    }
  };

  const handleOpenFinalizeDialog = (type: 'prazo' | 'parcelado') => {
    if (cartItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Carrinho Vazio',
        description: 'Adicione itens antes de finalizar a venda.',
      });
      return;
    }
    setSaleType(type);
    setIsFinalizeSaleDialogOpen(true);
  };
  
  const handleSimplePayment = (paymentMethod: 'PIX' | 'Dinheiro') => {
      if (cartItems.length === 0) {
          toast({ variant: 'destructive', title: 'Carrinho Vazio', description: 'Adicione itens antes de finalizar a venda.' });
          return;
      }
  
      // For simple payments, we can use a default customer or create one on the fly
      const defaultCustomer = allCustomersData.find(c => c.email === 'consumidor@final.com') || 
                              { id: 'default', firstName: 'Consumidor', lastName: 'Final', email: 'consumidor@final.com', phoneNumber: '', address: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()};
  
      finishSale({
          customer: defaultCustomer,
          installments: 1,
          paymentMethod: paymentMethod,
      });
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!authenticatedEmployee) return;

      const key = e.key.toLowerCase();

      if (key === 'f9') {
        e.preventDefault();
        setIsCustomerDialogOpen(true);
      }
      if (key === 'f11') {
        e.preventDefault();
        restoreLastSale();
      }
      if (key === 'f1') {
        e.preventDefault();
        handleSimplePayment('Dinheiro');
      }
      if (key === 'f2') {
        e.preventDefault();
        cancelSale();
      }
      if (key === 'f3') {
          e.preventDefault();
          handleSimplePayment('PIX');
      }
      if (key === 'f4') {
        e.preventDefault();
        handleOpenFinalizeDialog('prazo');
      }
      if (key === 'f5') {
        e.preventDefault();
        handleOpenFinalizeDialog('parcelado');
      }
      if (e.key === 'Escape') {
        handleLogout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Check for logged-in employee in session storage
    if (!authenticatedEmployee) {
      const storedEmployee = sessionStorage.getItem('authenticatedEmployee');
      if (storedEmployee) {
        const employee: Employee = JSON.parse(storedEmployee);
        setAuthenticatedEmployee(employee);
        setLastAction(`Operador: ${employee.firstName}. Caixa livre.`);
      }
    }
    setIsAuthenticating(false);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [authenticatedEmployee, restoreLastSale]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) =>
        acc + (item.part.salePrice * item.quantity - item.discount),
      0
    );
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const finishSale = (
    details: FinalizeSaleDetails
  ) => {
    if (cartItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Carrinho Vazio',
        description: 'Adicione itens antes de finalizar a venda.',
      });
      return;
    }

    setLastSaleItems([...cartItems]);

    const saleData: Omit<Sale, 'id'> = {
      employeeId: authenticatedEmployee!.id,
      customerId: details.customer.id,
      items: cartItems.map((item) => ({
        partId: item.part.id,
        quantity: item.quantity,
        unitPrice: item.part.salePrice,
        discount: item.discount,
      })),
      total: subtotal,
      paymentMethod: details.paymentMethod,
      installments: details.installments,
      date: new Date().toISOString(),
    };

    addSale(saleData);

    let description = `Total de ${formatCurrency(
        subtotal
    )} em ${totalItems} itens.`;

    description += ` Cliente: ${details.customer.firstName} ${details.customer.lastName}.`;
    description += ` Pagamento: ${details.paymentMethod}${details.installments > 1 ? ` em ${details.installments}x` : ''}.`;
    
    toast({
        title: 'Venda Finalizada!',
        description: description,
    });

    resetSaleState();
    setLastAction('Venda finalizada. Caixa livre.');
  };

  const resetSaleState = () => {
    setCartItems([]);
    setSelectedCustomer(null);
  };

  const cancelSale = () => {
    if (cartItems.length === 0) {
      setLastAction('Nenhuma venda para cancelar. Caixa livre.');
      return;
    }
    resetSaleState();
    setLastAction('Venda cancelada. Caixa livre.');
    toast({
      variant: 'destructive',
      title: 'Venda Cancelada',
    });
  };

  const showInfoToast = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
    });
  };

  const handleLogin = (employee: Employee) => {
    setAuthenticatedEmployee(employee);
    sessionStorage.setItem('authenticatedEmployee', JSON.stringify(employee));
    setLastAction(`Operador: ${employee.firstName}. Caixa livre.`);
    toast({
      title: `Bem-vindo, ${employee.firstName}!`,
      description: 'Login efetuado com sucesso.',
    });
  };

  if (isAuthenticating || isDataLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <p>Carregando dados do PDV...</p>
                <Skeleton className="h-4 w-64" />
             </div>
        </div>
    );
  }

  if (!authenticatedEmployee) {
    return (
      <EmployeeLoginDialog
        isOpen={true}
        employees={allEmployeesData || []}
        onLogin={handleLogin}
        onCancel={() => router.push('/')}
      />
    );
  }

  return (
    <>
      <CustomerSearchDialog
        isOpen={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
        onSelectCustomer={(customer) => {
          setSelectedCustomer(customer);
          toast({
            title: 'Cliente Selecionado',
            description: `${customer.firstName} ${customer.lastName} foi associado à venda.`,
          });
          setIsCustomerDialogOpen(false);
        }}
        customers={allCustomersData || []}
      />
      <FinalizeSaleDialog
        isOpen={isFinalizeSaleDialogOpen}
        onOpenChange={setIsFinalizeSaleDialogOpen}
        subtotal={subtotal}
        customers={allCustomersData || []}
        saleType={saleType}
        onConfirm={(details) => {
          finishSale(details);
          setIsFinalizeSaleDialogOpen(false);
        }}
      />
      <div className="flex h-[calc(100vh-100px)] w-full flex-col bg-slate-100 p-2 font-mono text-sm">
        {/* Top Bar */}
        <div className="relative flex items-center justify-between gap-4 rounded-t-lg bg-blue-800 p-2 text-white">
          <div className="flex flex-1 items-center gap-2">
            <Label htmlFor="item-search">
              F6 - DESCRIÇÃO/CÓDIGO ITEM OU CÓDIGO DE BARRAS
            </Label>
            <Input
              id="item-search"
              className="flex-1 bg-white text-black"
              placeholder="Digite para buscar uma peça..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedItem(null);
              }}
              onKeyDown={handleSearchKeyDown}
              autoComplete="off"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="quantity">QUANTIDADE</Label>
            <Input
              id="quantity"
              type="number"
              className="w-20 bg-white text-black"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              min="1"
            />
            <Select
              onValueChange={(value) =>
                setUnit(value)
              }
              value={unit}
            >
              <SelectTrigger className="w-24 bg-white text-black">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UN">UN</SelectItem>
                <SelectItem value="CX">CX</SelectItem>
                <SelectItem value="PC">PC</SelectItem>
                <SelectItem value="JG">JG</SelectItem>
                <SelectItem value="KT">KT</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="KG">KG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredParts.length > 0 && (
            <div className="absolute top-full left-0 z-10 w-1/2 bg-white border rounded-md shadow-lg mt-1">
              {filteredParts.map((part) => (
                <div
                  key={part.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-black"
                  onClick={() => handleSelectSearchedItem(part)}
                >
                  ({part.sku}) {part.name} - {formatCurrency(part.salePrice)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-1 gap-2 overflow-hidden">
          {/* Left Panel - Receipt */}
          <div className="flex w-1/2 flex-col">
            <div className="flex-1 bg-yellow-100 p-2 font-mono text-black">
              <div className="text-center font-bold">
                  <p>{config.storeName}</p>
              </div>
              <p>Endereço: {config.address}</p>
              <p>CNPJ: {config.cnpj}</p>
              <p>
                {currentDateTime
                  ? currentDateTime.toLocaleString('pt-BR')
                  : '...'}
              </p>
              <div className="py-1 text-center font-bold border-t border-b border-dashed border-gray-400 my-1">
                <p>---- CUPOM NÃO FISCAL ----</p>
              </div>
              {selectedCustomer && <p className="text-center font-bold">CLIENTE: {selectedCustomer.firstName} {selectedCustomer.lastName}</p>}
              <div className="grid grid-cols-[auto_auto_1fr_auto_auto] gap-x-2 border-b border-dashed border-gray-400 pb-1">
                  <span>ITEM</span>
                  <span>CÓDIGO</span>
                  <span>DESCRICAO</span>
                  <span className="text-center">QTD</span>
                  <span className="text-right">VL ITEM</span>
                </div>
              <ScrollArea className="h-[250px]">
                {cartItems.map((item, index) => (
                  <div key={item.part.id} className="py-1 border-b border-dashed border-gray-200">
                    <div className="grid grid-cols-[auto_auto_1fr_auto] gap-x-2">
                        <span>{(index + 1).toString().padStart(3, '0')}</span>
                        <span>{item.part.sku}</span>
                        <span className="truncate">{item.part.name}</span>
                        <span className="text-right">{formatCurrency(item.part.salePrice * item.quantity - item.discount)}</span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-x-2">
                      <span className="pl-16">{item.quantity}{item.unit} X {formatCurrency(item.part.salePrice)}</span>
                      <span className="text-right font-bold">SUBTOTAL R$ {formatCurrency(item.part.salePrice * item.quantity - item.discount)}</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="bg-blue-800 p-2 text-center font-bold text-white">
              <p>{lastAction}</p>
            </div>
            <div className="flex justify-between bg-blue-700 p-2 text-white">
              <span>
                Nº. DE ITENS: {cartItems.length} | QUANTIDADES: {totalQuantity}
              </span>
              <div className="flex gap-4">
                <Button
                  size="sm"
                  className="bg-blue-500 text-white"
                  onClick={() => setIsCustomerDialogOpen(true)}
                >
                  CLIENTES - F9
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-500 text-white"
                  onClick={restoreLastSale}
                >
                  ULT. VENDA - F11
                </Button>
              </div>
            </div>
            <div className="flex justify-between bg-blue-700 p-2 text-white">
              <Button
                size="sm"
                className="bg-blue-500 text-white"
                onClick={() =>
                  showInfoToast('Mais Funções', 'Função não implementada.')
                }
              >
                MAIS FUNÇÕES
              </Button>
              <Button
                size="sm"
                className="bg-blue-500 text-white"
                onClick={() =>
                  showInfoToast('Instruções', 'Função não implementada.')
                }
              >
                INSTRUÇÕES
              </Button>
              <Button
                size="sm"
                className="bg-blue-500 text-white"
                onClick={() =>
                  showInfoToast(
                    'Calculadora (F12)',
                    'Função não implementada.'
                  )
                }
              >
                CALCULADORA - F12
              </Button>
            </div>
          </div>

          {/* Middle Panel - Totals */}
          <div className="flex w-1/4 flex-col justify-between bg-blue-700 p-4 text-white">
            <div className="space-y-4">
              <InfoBox
                label="VALOR UNITÁRIO:"
                value={formatCurrency(selectedItem?.salePrice)}
              />
              <InfoBox label="QUANTIDADE:" value={`${quantity} ${unit}`} />
              <InfoBox
                label="SUBTOTAL:"
                value={formatCurrency(
                  selectedItem ? selectedItem.salePrice * quantity : 0
                )}
              />
              <InfoBox
                label="CÓDIGO DE BARRAS:"
                value={selectedItem?.sku || 'N/A'}
                smallText
              />
              <InfoBox
                label="CÓDIGO DE CADASTRO:"
                value={selectedItem?.id || 'N/A'}
                smallText
              />
            </div>
            <div className="mt-4">
              <Card className="bg-blue-800 text-white">
                <CardHeader className="p-2 text-center">
                  <CardTitle className="text-lg">VALOR TOTAL DA VENDA</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-5xl font-bold">
                    {formatCurrency(subtotal)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className="flex w-1/4 flex-col justify-between bg-slate-200 p-4">
            <div>
              <div className="mb-2 rounded-md border border-blue-800 bg-white p-2">
                <p className="font-bold text-blue-800">
                  PDV AUTO PARTS MANAGER
                </p>
                <Input
                  className="mt-1"
                  placeholder="Vendedor(a)"
                  value={`${authenticatedEmployee.firstName} ${authenticatedEmployee.lastName}`}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <ActionButton onClick={() => handleSimplePayment('Dinheiro')}>
                  PAGAR COM DINHEIRO - F1
                </ActionButton>
                <ActionButton onClick={cancelSale}>
                  CANCELAR VENDA - F2
                </ActionButton>
                 <ActionButton onClick={() => handleSimplePayment('PIX')}>
                  PAGAR COM PIX - F3
                </ActionButton>
                <ActionButton onClick={() => handleOpenFinalizeDialog('prazo')}>
                  VENDER A PRAZO - F4
                </ActionButton>
                <ActionButton
                  onClick={() => handleOpenFinalizeDialog('parcelado')}
                >
                  VENDER PARCELADO - F5
                </ActionButton>
                <ActionButton onClick={handleLogout}>
                  SAIR DO P.D.V - ESC
                </ActionButton>
              </div>
            </div>
            <div className="space-y-2">
              <InfoBox
                label="OPERADOR"
                value={`${authenticatedEmployee.firstName} ${authenticatedEmployee.lastName}`.toUpperCase()}
                smallText
                center
              />
              <InfoBox
                label="DATA DA VENDA"
                value={
                  currentDateTime
                    ? currentDateTime.toLocaleDateString('pt-BR')
                    : '...'
                }
                smallText
                center
              />
              <InfoBox
                label="HORA ATUAL"
                value={
                  currentDateTime
                    ? currentDateTime.toLocaleTimeString('pt-BR')
                    : '...'
                }
                smallText
                center
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoBox({
  label,
  value,
  smallText = false,
  center = false,
}: {
  label: string;
  value: string;
  smallText?: boolean;
  center?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border-2 border-black bg-white p-2 text-black ${
        center ? 'text-center' : ''
      }`}
    >
      <p className="text-xs">{label}</p>
      <p className={`${smallText ? 'text-lg' : 'text-3xl'} font-bold`}>
        {value}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      className="w-full justify-center bg-blue-600 py-3 text-base text-white hover:bg-blue-700"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
