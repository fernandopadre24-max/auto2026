'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parts as allPartsData } from '@/lib/data';
import type { Part } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
  part: Part;
  quantity: number;
  discount: number;
};

const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

export default function VendasPage() {
    const { toast } = useToast();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Part[]>([]);
    const [selectedItem, setSelectedItem] = useState<Part | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [lastAction, setLastAction] = useState('Caixa Livre');

    useEffect(() => {
        if (searchTerm) {
            const results = allPartsData.filter(part => 
                part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                part.sku.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleAddItemToCart = (part: Part) => {
        if (!part) return;

        const existingItem = cartItems.find(item => item.part.id === part.id);

        if (existingItem) {
            setCartItems(cartItems.map(item => 
                item.part.id === part.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            ));
        } else {
            setCartItems([...cartItems, { part, quantity, discount: 0 }]);
        }
        setLastAction(`Adicionado: ${quantity}x ${part.name}`);
        setSearchTerm('');
        setSelectedItem(null);
        setSearchResults([]);
        setQuantity(1);
    }
    
    const handleSelectSearchedItem = (part: Part) => {
        setSelectedItem(part);
        setSearchTerm(part.name);
        setSearchResults([]);
        document.getElementById('item-search')?.focus();
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && selectedItem) {
            handleAddItemToCart(selectedItem);
        }
    }

    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.part.salePrice * item.quantity - item.discount), 0);
    }, [cartItems]);

    const totalItems = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }, [cartItems]);

    const totalQuantity = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }, [cartItems]);

    const finishSale = () => {
        if (cartItems.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Carrinho Vazio',
                description: 'Adicione itens antes de finalizar a venda.'
            });
            return;
        }
        toast({
            title: 'Venda Finalizada!',
            description: `Total de ${formatCurrency(subtotal)} em ${totalItems} itens.`
        });
        setCartItems([]);
        setLastAction('Venda finalizada. Caixa livre.');
    }

    const cancelSale = () => {
        setCartItems([]);
        setLastAction('Venda cancelada. Caixa livre.');
        toast({
            variant: 'destructive',
            title: 'Venda Cancelada',
        });
    }


  return (
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
          <Input id="quantity" type="number" className="w-24 bg-white text-black" value={quantity} onChange={e => setQuantity(Number(e.target.value) || 1)} min="1" />
        </div>
        {searchResults.length > 0 && (
            <div className="absolute top-full left-0 z-10 w-1/2 bg-white border rounded-md shadow-lg mt-1">
                {searchResults.map(part => (
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
            <p>CNPJ: 11.222.333/0001-44</p>
            <p>IE: 11.777.888</p>
            <p className="border-b border-dashed border-gray-400 pb-1">
              {new Date().toLocaleString('pt-BR')}
            </p>
            <p className="py-1 text-center">---- CUPOM NÃO FISCAL ----</p>
            <div className="border-b border-dashed border-gray-400 pb-1">
              <div className="grid grid-cols-6">
                <span className="col-span-1">ITEM</span>
                <span className="col-span-1">CÓDIGO</span>
                <span className="col-span-2">DESCRICAO</span>
                <span className="col-span-1">QTD</span>
                <span className="text-right col-span-1">VL ITEM</span>
              </div>
            </div>
            <ScrollArea className="h-[250px]">
              {cartItems.map((item, index) => (
                <div key={item.part.id} className="py-1">
                    <div className="grid grid-cols-6">
                        <span className="col-span-1">{(index + 1).toString().padStart(3, '0')}</span>
                        <span className="col-span-1">{item.part.sku}</span>
                        <span className="col-span-4">{item.part.name}</span>
                    </div>
                    <div className="grid grid-cols-6">
                        <span className="col-start-4 col-span-1">
                          {item.quantity}UN X {formatCurrency(item.part.salePrice)}
                          {item.discount > 0 && ` DESC ${formatCurrency(item.discount)}`}
                        </span>
                        <span className="col-span-2 text-right">
                          SUBTOTAL {formatCurrency(item.part.salePrice * item.quantity - item.discount)}
                        </span>
                    </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="bg-blue-800 p-2 text-center font-bold text-white">
            <p>{lastAction}</p>
          </div>
          <div className="flex justify-between bg-blue-700 p-2 text-white">
            <span>Nº. DE ITENS: {cartItems.length} | QUANTIDADES: {totalQuantity}</span>
            <div className="flex gap-4">
                <Button size="sm" className="bg-blue-500 text-white">CLIENTES - F9</Button>
                <Button size="sm" className="bg-blue-500 text-white">PARCELAS - F10</Button>
                <Button size="sm" className="bg-blue-500 text-white">ULT. VENDA - F11</Button>
            </div>
          </div>
           <div className="flex justify-between bg-blue-700 p-2 text-white">
                <Button size="sm" className="bg-blue-500 text-white">MAIS FUNÇÕES</Button>
                <Button size="sm" className="bg-blue-500 text-white">INSTRUÇÕES</Button>
                <Button size="sm" className="bg-blue-500 text-white">CALCULADORA - F12</Button>
            </div>
        </div>

        {/* Middle Panel - Totals */}
        <div className="flex w-1/4 flex-col justify-between bg-blue-700 p-4 text-white">
          <div className="space-y-4">
            <InfoBox label="VALOR UNITÁRIO:" value={formatCurrency(selectedItem?.salePrice)} />
            <InfoBox label="QUANTIDADE:" value={`${quantity} UN`} />
            <InfoBox label="SUBTOTAL:" value={formatCurrency(selectedItem ? selectedItem.salePrice * quantity : 0)} />
            <InfoBox label="CÓDIGO DE BARRAS:" value={selectedItem?.sku || 'N/A'} smallText />
            <InfoBox label="CÓDIGO DE CADASTRO:" value={selectedItem?.id || 'N/A'} smallText />
          </div>
          <div className="mt-4">
            <Card className="bg-blue-800 text-white">
              <CardHeader className="p-2">
                <CardTitle className="text-lg">VALOR TOTAL DA VENDA</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-5xl font-bold">{formatCurrency(subtotal)}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel - Actions */}
        <div className="flex w-1/4 flex-col justify-between bg-slate-200 p-4">
           <div>
            <div className="mb-2 rounded-md border border-blue-800 bg-white p-2">
                <p className="font-bold text-blue-800">PDV AUTO PARTS MANAGER</p>
                <Input className="mt-1" placeholder="Vendedor(a)"/>
            </div>
             <div className="space-y-2">
                <ActionButton onClick={finishSale}>FINALIZAR VENDA - F1</ActionButton>
                <ActionButton onClick={cancelSale}>CANCELAR VENDA - F2</ActionButton>
                <ActionButton onClick={finishSale}>VENDER A VISTA - F3</ActionButton>
                <ActionButton onClick={finishSale}>VENDER A PRAZO - F4</ActionButton>
                <ActionButton onClick={finishSale}>VENDER PARCELADO - F5</ActionButton>
                <ActionButton>SAIR DO P.D.V - ESC</ActionButton>
            </div>
           </div>
           <div className="space-y-2">
            <InfoBox label="OPERADOR" value="LUIZ" smallText center />
            <InfoBox label="DATA DA VENDA" value={new Date().toLocaleDateString('pt-BR')} smallText center />
            <InfoBox label="HORA ATUAL" value={new Date().toLocaleTimeString('pt-BR')} smallText center />
           </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, smallText = false, center = false }: { label: string, value: string, smallText?: boolean, center?: boolean}) {
  return (
    <div className={`rounded-lg border-2 border-black bg-white p-2 text-black ${center ? 'text-center' : ''}`}>
      <p className="text-xs">{label}</p>
      <p className={`${smallText ? 'text-lg' : 'text-3xl'} font-bold`}>{value}</p>
    </div>
  );
}

function ActionButton({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
    return (
        <Button className="w-full justify-center bg-blue-600 py-3 text-base text-white hover:bg-blue-700" onClick={onClick}>
            {children}
        </Button>
    )
}

    