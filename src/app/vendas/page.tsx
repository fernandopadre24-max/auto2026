import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const products = [
  { code: '0000000297073', description: 'TESTE' },
];

const payments = [
    { card: 'HIPERCARD (Hipercard)', nsu: '1111', authorization: '2222', value: 'R$ 5,00' },
    { card: 'CAPITAL (Sorocred)', nsu: '3333', authorization: '4444', value: 'R$ 5,00' },
];

export default function VendasPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Finalizar Venda" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Items */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descricao</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.code} className="bg-blue-200">
                        <TableCell>{product.code}</TableCell>
                        <TableCell>{product.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Nome do Cliente</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>CONSUMIDOR</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
              </Card>
              <div className="flex gap-2">
                <Button>Iniciar (F5)</Button>
                <Button variant="outline">Devolução (F4)</Button>
                <Button variant="outline">Import</Button>
              </div>
            </div>

            {/* Payment Details */}
            <div className="md:col-span-2">
              <Card className="bg-gray-100">
                <CardContent className="p-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        F4 - FORMA DE PAGAMENTO
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup defaultValue="credito">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="caixa" id="caixa" />
                          <Label htmlFor="caixa">CAIXA</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credito" id="credito" />
                          <Label htmlFor="credito">CREDIÁRIO</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="entrada" id="entrada" />
                          <Label htmlFor="entrada">ENTRADA / CREDIÁRIO</Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="p-2 bg-blue-800 text-white rounded-t-md">
                        <CardTitle className="text-sm">SUB TOTAL (R$)</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">10,00</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-2 bg-blue-800 text-white rounded-t-md">
                        <CardTitle className="text-sm">TOTAL DA VENDA (R$)</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">10,00</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <Input value="0,00 %" />
                    <Input value="0,00" />
                    <Input value="0,00 %" />
                    <Input value="0,00" />
                  </div>
                   <div className="grid grid-cols-3 gap-4">
                     <Card className="bg-red-600 text-white">
                        <CardHeader className="p-2"><CardTitle className="text-sm">SALDO (R$)</CardTitle></CardHeader>
                        <CardContent className="p-4 text-center"><p className="text-2xl font-bold">0,00</p></CardContent>
                     </Card>
                     <Card className="bg-red-600 text-white">
                        <CardHeader className="p-2"><CardTitle className="text-sm">VALOR RECEBIDO (R$)</CardTitle></CardHeader>
                        <CardContent className="p-4 text-center"><p className="text-2xl font-bold">10,00</p></CardContent>
                     </Card>
                     <Card className="bg-red-600 text-white">
                        <CardHeader className="p-2"><CardTitle className="text-sm">TROCO (R$)</CardTitle></CardHeader>
                        <CardContent className="p-4 text-center"><p className="text-2xl font-bold">0,00</p></CardContent>
                     </Card>
                   </div>
                   <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">DADOS DO CARTÃO DE DÉBITO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Valor" />
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Bandeira" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hipercard">HIPERCARD (Hipercard)</SelectItem>
                                    <SelectItem value="sorocred">CAPITAL (Sorocred)</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input placeholder="NSU" />
                            <Input placeholder="Autorização" />
                        </div>
                        <Button className="w-full" variant="secondary">GRAVAR</Button>
                    </CardContent>
                   </Card>
                   <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cartão</TableHead>
                                    <TableHead>NSU</TableHead>
                                    <TableHead>Autorização</TableHead>
                                    <TableHead>Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((p, i) => (
                                    <TableRow key={i} className={i === 0 ? "bg-blue-300" : ""}>
                                        <TableCell>{p.card}</TableCell>
                                        <TableCell>{p.nsu}</TableCell>
                                        <TableCell>{p.authorization}</TableCell>
                                        <TableCell>{p.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                   </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-1 flex flex-col gap-2">
            <Card className="bg-gray-100">
                <CardContent className="p-2 space-y-2">
                    <Label className="flex justify-between items-center bg-gray-300 p-2 rounded-md">
                        <span>DINHEIRO</span>
                        <Input className="w-24 text-right" defaultValue="0,00" />
                    </Label>
                    <Label className="flex justify-between items-center bg-gray-300 p-2 rounded-md">
                        <span>TOTAL DO(S) CHEQUE(S)</span>
                        <Input className="w-24 text-right" defaultValue="0,00" />
                    </Label>
                    <Label className="flex justify-between items-center bg-gray-300 p-2 rounded-md">
                        <span>CARTÃO DE CRÉDITO</span>
                        <Input className="w-24 text-right" defaultValue="0,00" />
                    </Label>
                    <Label className="flex justify-between items-center bg-red-600 text-white p-2 rounded-md">
                        <span>CARTÃO DE DÉBITO</span>
                        <Input className="w-24 text-right bg-white text-black" defaultValue="10,00" />
                    </Label>
                    <Label className="flex justify-between items-center bg-red-600 text-white p-2 rounded-md">
                        <span>CRÉDITO UTILIZADO</span>
                        <Input className="w-24 text-right bg-white text-black" defaultValue="0,00" />
                    </Label>
                     <div className="bg-red-600 text-white p-2 rounded-md text-right">
                        Crédito Disponível: R$ 0,00
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}