
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SucessoOrcamentoPage() {

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container section-padding flex flex-col items-center justify-center min-h-screen text-center">
        <div className="p-4 bg-green-500/10 rounded-full mb-6 ring-4 ring-green-500/20">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
            Solicitação <span className="gradient-text">Recebida!</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Obrigado! Recebemos sua criação. Em breve, nossa equipe entrará em contato com você pelo e-mail ou telefone fornecido para discutir os próximos passos e o orçamento.
        </p>

        <Card className="w-full max-w-lg bg-card/80">
            <CardHeader>
                <CardTitle>O que acontece agora?</CardTitle>
                <CardDescription>Fique de olho no seu e-mail!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
               <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Análise Criativa:</strong> Nossa equipe irá analisar todos os detalhes que você montou com tanto carinho.</p>
               </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Contato:</strong> Entraremos em contato para alinhar as ideias, sugerir melhorias e apresentar um orçamento personalizado.</p>
               </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Magia em Ação:</strong> Após a aprovação, daremos vida ao seu projeto, transformando-o em uma experiência inesquecível!</p>
               </div>
            </CardContent>
        </Card>
        
        <Link href="/" className="mt-12">
            <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o início
            </Button>
        </Link>
      </div>
    </div>
  );
}
