
"use client";

import { AnimatedBackground } from "@/components/app/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brush, Files } from "lucide-react";
import Link from "next/link";

export default function CriarPage() {
    return (
        <div className="relative min-h-screen">
            <AnimatedBackground fixed />
            <div className="relative z-10 container section-padding flex flex-col items-center justify-center min-h-screen">
                <div className="w-full max-w-md text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
                        Como você quer <span className="gradient-text">criar</span>?
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        Escolha se prefere começar com um de nossos temas prontos ou se quer montar sua página do zero.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <Link href="/#temas">
                        <Card className="bg-card/80 hover:border-primary/50 hover:bg-card/100 transition-all duration-300 h-full flex flex-col items-center justify-center text-center p-8">
                            <CardHeader>
                                <div className="p-4 bg-primary/10 rounded-full mb-4 self-center">
                                    <Files className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Usar um Modelo</CardTitle>
                                <CardDescription className="text-base">Navegue por nossos temas e escolha o que mais combina com sua história.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/criar/fazer-eu-mesmo">
                         <Card className="bg-card/80 hover:border-primary/50 hover:bg-card/100 transition-all duration-300 h-full flex flex-col items-center justify-center text-center p-8">
                            <CardHeader>
                                <div className="p-4 bg-primary/10 rounded-full mb-4 self-center">
                                    <Brush className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Fazer eu Mesmo</CardTitle>
                                <CardDescription className="text-base">Tenha controle total e personalize cada detalhe da sua página do zero.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                 <Link href="/" className="mt-12">
                    <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o início
                    </Button>
                </Link>
            </div>
        </div>
    )
}
