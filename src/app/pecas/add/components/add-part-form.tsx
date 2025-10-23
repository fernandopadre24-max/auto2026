'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  generateDescriptionAction,
  suggestPriceAction,
  createPartAction,
} from '@/app/pecas/actions';
import { useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

const formSchema = z.object({
  partName: z.string().min(2, { message: 'O nome da peça deve ter pelo menos 2 caracteres.' }),
  partCategory: z.string().min(1, { message: 'Selecione uma categoria.' }),
  manufacturer: z.string().min(2, { message: 'O fabricante deve ter pelo menos 2 caracteres.' }),
  model: z.string().min(1, { message: 'O modelo do veículo é obrigatório.' }),
  year: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 1900 && parseInt(val, 10) <= new Date().getFullYear() + 1, { message: 'Insira um ano válido.' }),
  technicalSpecifications: z.string().min(10, { message: 'As especificações devem ter pelo menos 10 caracteres.' }),
  condition: z.string().min(1, { message: 'Selecione a condição da peça.' }),
  inventoryLevel: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, { message: 'Estoque deve ser um número não negativo.' }),
  purchasePrice: z.string().refine((val) => !isNaN(parseFloat(val)), { message: 'Preço de compra inválido.' }),
  salePrice: z.string().refine((val) => !isNaN(parseFloat(val)), { message: 'Preço de venda inválido.' }),
  description: z.string().optional(),
});

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {pending ? <Loader2 className="animate-spin" /> : 'Salvar Peça'}
        </Button>
    )
}

export function AddPartForm() {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partName: '',
      partCategory: '',
      manufacturer: '',
      model: '',
      year: '',
      technicalSpecifications: '',
      condition: '',
      inventoryLevel: '0',
      purchasePrice: '0',
      salePrice: '0',
      description: '',
    },
  });

  async function handleGenerateDescription() {
    setIsGeneratingDescription(true);
    try {
      const result = await generateDescriptionAction(form.getValues());
      if (result.description) {
        form.setValue('description', result.description);
        toast({
          title: 'Descrição Gerada!',
          description: 'A descrição da peça foi gerada com sucesso.',
        });
      } else {
        throw new Error('Failed to generate description.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível gerar a descrição.',
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  }

  async function handleSuggestPrice() {
    setIsSuggestingPrice(true);
    try {
      const result = await suggestPriceAction({
        partName: form.getValues('partName'),
        purchasePrice: parseFloat(form.getValues('purchasePrice')),
        // Mock data for AI call
        marketData: "Forte demanda no mercado de usados",
        competitorPricing: "Concorrentes vendem entre R$110 e R$130",
        inventoryLevel: parseInt(form.getValues('inventoryLevel')),
      });
      if (result.suggestedPrice) {
        form.setValue('salePrice', result.suggestedPrice.toString());
        toast({
          title: 'Preço Sugerido!',
          description: (
            <div>
                <p>Preço de venda atualizado para {result.suggestedPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}.</p>
                <p className="text-xs text-muted-foreground mt-2">Justificativa: {result.reasoning}</p>
            </div>
          )
        });
      } else {
        throw new Error('Failed to suggest price.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível sugerir o preço.',
      });
    } finally {
      setIsSuggestingPrice(false);
    }
  }

  return (
    <Form {...form}>
      <form action={async (formData) => {
          const result = await createPartAction(formData);
          if (result.success) {
            toast({ title: "Sucesso!", description: "Nova peça adicionada ao catálogo." });
            form.reset();
          } else {
            toast({ variant: 'destructive', title: "Erro", description: result.message });
          }
      }} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="partName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Peça</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Filtro de Óleo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="partCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Filtros">Filtros</SelectItem>
                    <SelectItem value="Freios">Freios</SelectItem>
                    <SelectItem value="Motor">Motor</SelectItem>
                    <SelectItem value="Suspensão">Suspensão</SelectItem>
                    <SelectItem value="Elétrica">Elétrica</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fabricante</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Bosch" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo do Veículo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: VW Gol G5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano do Veículo</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 2021" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condição</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a condição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">Nova</SelectItem>
                    <SelectItem value="used">Usada</SelectItem>
                    <SelectItem value="refurbished">Remanufaturada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inventoryLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Estoque</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Compra (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="10,00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda (R$)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="20,00" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSuggestPrice}
                    disabled={isSuggestingPrice}
                    className="whitespace-nowrap"
                  >
                    {isSuggestingPrice ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Sparkles className="mr-2" />
                    )}
                    Sugerir
                  </Button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="technicalSpecifications"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Especificações Técnicas</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Ex: Dimensões: 10x5x5cm, Material: Aço, Cor: Preto"
                        className="resize-y min-h-[120px]"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center justify-between">
                    <span>Descrição da Peça</span>
                    <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={handleGenerateDescription}
                        disabled={isGeneratingDescription}
                    >
                        {isGeneratingDescription ? (
                        <Loader2 className="animate-spin mr-2" />
                        ) : (
                        <Wand2 className="mr-2" />
                        )}
                        Gerar com IA
                    </Button>
                    </FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Descrição detalhada do produto para o cliente."
                        className="resize-y min-h-[120px]"
                        {...field}
                    />
                    </FormControl>
                    <FormDescription>
                        Esta descrição será exibida na página do produto.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>Cancelar</Button>
            <SubmitButton />
        </div>
      </form>
    </Form>
  );
}
