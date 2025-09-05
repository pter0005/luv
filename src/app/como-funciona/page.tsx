"use client";

import { AnimatedBackground } from "@/components/app/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Gamepad2, Gift, Puzzle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ComoFuncionaPage() {
  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <header className="absolute top-0 left-0 w-full p-4">
            <div className="container">
                <Link href="/">
                    <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o início
                    </Button>
                </Link>
            </div>
        </header>
        <section className="section-padding pt-32">
          <div className="container text-center">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
                <Gamepad2 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4 text-foreground font-display">
              Uma Revelação <span className="gradient-text">Inesquecível</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-16">
              O Jogo Enigmático 2D é a forma mais criativa e emocionante de revelar sua página personalizada. Em vez de apenas enviar um link, você entrega uma experiência única.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mb-16">
                <Card className="bg-card/80 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Puzzle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Um Enigma Personalizado</h3>
                            <p className="text-muted-foreground">A pessoa amada receberá um link para um mini-jogo 2D. Dentro do jogo, ela precisará resolver um enigma simples e significativo, que pode ser baseado na história de vocês.</p>
                        </div>
                    </div>
                </Card>
                 <Card className="bg-card/80 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Gift className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">A Grande Recompensa</h3>
                            <p className="text-muted-foreground">Ao resolver o enigma, a recompensa é revelada: o jogo a redireciona automaticamente para a página de amor que você criou, tornando a descoberta uma surpresa emocionante.</p>
                        </div>
                    </div>
                </Card>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-8 font-display">Veja em Ação</h2>
            
            <Card className="max-w-4xl mx-auto bg-card/50 border-2 border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
                <CardContent className="p-2">
                    <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Vídeo de demonstração em breve.</p>
                        <Image 
                            src="https://picsum.photos/1280/720"
                            alt="Demonstração do jogo"
                            width={1280}
                            height={720}
                            className="w-full h-full object-cover opacity-30"
                            data-ai-hint="pixel art game"
                        />
                    </div>
                </CardContent>
            </Card>

          </div>
        </section>
      </div>
    </div>
  );
}
