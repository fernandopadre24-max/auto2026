'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useData } from '@/lib/data';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useFormStatus } from 'react-dom';
import { formatPhoneNumber } from '@/lib/utils';

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  lastName: z
    .string()
    .min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Insira um email válido.' }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

type EditClienteFormProps = {
  customerId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Salvar Alterações'}
    </Button>
  );
}

export function EditClienteForm({ customerId }: EditClienteFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { customers, isLoading, updateCustomer } = useData();

  const customer = customers.find((c) => c.id === customerId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        ...customer,
        phoneNumber: customer.phoneNumber ? formatPhoneNumber(customer.phoneNumber) : '',
      });
    }
  }, [customer, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!customer) return;
    try {
      updateCustomer({
        ...customer,
        ...values,
        phoneNumber: values.phoneNumber?.replace(/\D/g, '') || '',
        address: values.address || '',
      });
      toast({
        title: 'Sucesso!',
        description: 'Dados do cliente atualizados.',
      });
      router.push('/clientes');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar os dados do cliente.',
      });
      console.error('Error updating customer:', error);
    }
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!customer) {
    return <p>Cliente não encontrado.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Ana" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Lima" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ex: ana.lima@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(00) 00000-0000" 
                    {...field}
                    onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                    value={field.value || ''}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rua, Número, Bairro, Cidade - Estado"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/clientes')}
          >
            Cancelar
          </Button>
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}
