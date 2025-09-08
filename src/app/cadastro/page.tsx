
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader } from "lucide-react";
import { AnimatedBackground } from "@/components/app/AnimatedBackground";

const formSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default function CadastroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Conta criada com sucesso!", description: "Você foi redirecionado para o login." });
      router.push("/login");
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
            variant: "destructive",
            title: "Erro no Cadastro",
            description: "Este e-mail já está em uso. Tente fazer login.",
        });
      } else {
        toast({
            variant: "destructive",
            title: "Erro no Cadastro",
            description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
        });
      }
      console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen">
        <AnimatedBackground />
        <div className="relative z-10 container section-padding flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full max-w-md bg-card/80">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold font-display">Crie sua Conta</CardTitle>
                    <CardDescription>É rápido e fácil. Comece a criar suas páginas agora.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Crie uma senha segura" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                Criar conta
                            </Button>
                        </form>
                    </Form>
                     <p className="mt-6 text-center text-sm text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Faça login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
