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
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  lastName: z.string().min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Insira um email válido.' }),
  role: z.string().min(2, { message: 'O cargo é obrigatório.' }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Salvar Funcionário'}
    </Button>
  );
}

export function AddFuncionarioForm() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const employeeCollection = collection(firestore, 'employees');
        await addDocumentNonBlocking(employeeCollection, {
            ...values,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        toast({
            title: 'Sucesso!',
            description: 'Novo funcionário adicionado.',
        });
        router.push('/funcionarios');
    } catch(error) {
         toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível adicionar o funcionário.',
        });
        console.error("Error adding employee:", error);
    }
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
                  <Input placeholder="Ex: Carlos" {...field} />
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
                  <Input placeholder="Ex: Silva" {...field} />
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
                  <Input type="email" placeholder="Ex: carlos.silva@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Vendedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}
