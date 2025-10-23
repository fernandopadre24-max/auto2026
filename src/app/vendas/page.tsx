import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const saleItems = [
  {
    item: '001',
    code: '0004',
    description: 'TINTA P/ CARIMBO REDEX AUTOMATIC',
    quantity: '1UN',
    unitPrice: 5.3,
    subtotal: 5.3,
    status: 'active',
  },
  {
    item: '002',
    code: '0004',
    description: 'TINTA P/ CARIMBO REDEX AUTOMATIC',
    quantity: '1UN',
    unitPrice: 5.3,
    discount: 0.79,
    subtotal: 4.51,
    status: 'active',
  },
  {
    item: '003',
    code: '0005',
    description: 'PENDRIVE SCANDISK 04 GB',
    quantity: '3UN',
    unitPrice: 20.21,
    subtotal: 60.63,
    status: 'active',
  },
  {
    item: 'ITEM 2 CANCELADO',
    code: '00007897254102542',
    description: 'TINTA P/ CARIMBO REDEX AUTOMATIC',
    subtotal: -4.51,
    status: 'canceled',
  },
];

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function VendasPage() {
  return (
    <div className="flex h-[calc(100vh-100px)] w-full flex-col bg-slate-100 p-2 font-mono text-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 rounded-t-lg bg-blue-800 p-2 text-white">
        <div className="flex flex-1 items-center gap-2">
          <Label htmlFor="item-search">
            F6 - DESCRIÇÃO/CÓDIGO ITEM OU CÓDIGO DE BARRAS
          </Label>
          <Input
            id="item-search"
            className="flex-1 bg-white text-black"
            placeholder="F7 - FORA DO ESTOQUE"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="quantity">QUANTIDADE</Label>
          <Input id="quantity" className="w-24 bg-white text-black" defaultValue="1" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Left Panel - Receipt */}
        <div className="flex w-1/2 flex-col">
          <div className="flex-1 bg-yellow-100 p-2 font-mono text-black">
            <p>CNPJ: 11.222.333/0001-44</p>
            <p>IE: 11.777.888</p>
            <p className="border-b border-dashed border-gray-400 pb-1">
              15/12/2014 22:46:47
            </p>
            <p className="py-1 text-center">---- CUPOM NÃO FISCAL ----</p>
            <div className="border-b border-dashed border-gray-400 pb-1">
              <div className="grid grid-cols-6">
                <span>ITEM</span>
                <span>CÓDIGO</span>
                <span className="col-span-2">DESCRICAO</span>
                <span>QTD</span>
                <span className="text-right">VL ITEM</span>
              </div>
            </div>
            <ScrollArea className="h-[250px]">
              {saleItems.map((item, index) => (
                <div
                  key={index}
                  className={`py-1 ${
                    item.status === 'canceled' ? 'bg-blue-400 text-white' : ''
                  }`}
                >
                  {item.status === 'active' ? (
                    <>
                      <div className="grid grid-cols-6">
                        <span>{item.item}</span>
                        <span>{item.code}</span>
                        <span className="col-span-4">{item.description}</span>
                      </div>
                      <div className="grid grid-cols-6">
                        <span className="col-start-4">
                          {item.quantity} X R$ {item.unitPrice?.toFixed(2)}
                          {item.discount && ` DESC R$ ${item.discount.toFixed(2)}`}
                        </span>
                        <span className="col-span-2 text-right">
                          SUBTOTAL R$ {item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p>
                      {item.item} - {item.code} {item.description} -R${' '}
                      {Math.abs(item.subtotal).toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="bg-blue-800 p-2 text-center font-bold text-white">
            <p>CANCEL. DE ITEM TINTA P/ CARIMBO REDEX AUTOMATIC</p>
          </div>
          <div className="flex justify-between bg-blue-700 p-2 text-white">
            <span>Nº. DE ITENS: 02 | QUANTIDADES: 4,00</span>
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
            <InfoBox label="VALOR UNITÁRIO:" value={formatCurrency(5.30)} />
            <InfoBox label="QUANTIDADE:" value="1 UN" />
            <InfoBox label="SUBTOTAL:" value={formatCurrency(4.51)} />
            <InfoBox label="CÓDIGO DE BARRAS:" value="7897254102542" smallText />
            <InfoBox label="CÓDIGO DE CADASTRO:" value="00004" smallText />
          </div>
          <div className="mt-4">
            <Card className="bg-blue-800 text-white">
              <CardHeader className="p-2">
                <CardTitle className="text-lg">VALOR TOTAL DA VENDA</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-5xl font-bold">{formatCurrency(65.93)}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel - Actions */}
        <div className="flex w-1/4 flex-col justify-between bg-slate-200 p-4">
           <div>
            <div className="mb-2 rounded-md border border-blue-800 bg-white p-2">
                <p className="font-bold text-blue-800">PDV RÉPLEIS CONTAS 1.2</p>
                <Input className="mt-1" placeholder="DA"/>
            </div>
             <div className="space-y-2">
                <ActionButton>FINALIZAR VENDA - F1</ActionButton>
                <ActionButton>CANCELAR VENDA - F2</ActionButton>
                <ActionButton>VENDER A VISTA - F3</ActionButton>
                <ActionButton>VENDER A PRAZO - F4</ActionButton>
                <ActionButton>VENDER PARCELADO - F5</ActionButton>
                <ActionButton>SAIR DO P.D.V - ESC</ActionButton>
            </div>
           </div>
           <div className="space-y-2">
            <InfoBox label="OPERADOR" value="LUIZ" smallText center />
            <InfoBox label="DATA DA VENDA" value="15/12/2014" smallText center />
            <InfoBox label="HORA ATUAL" value="22:49:49" smallText center />
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

function ActionButton({ children }: { children: React.ReactNode }) {
    return (
        <Button className="w-full justify-center bg-blue-600 py-3 text-base text-white hover:bg-blue-700">
            {children}
        </Button>
    )
}
