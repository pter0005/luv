
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Gift, Puzzle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JigsawPuzzle } from "@/components/app/JigsawPuzzle";

export default function ComoFuncionaPage() {
  return (
    <div className="relative">
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
                <Puzzle className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-4 text-foreground font-display">
              Uma Revelação <span className="gradient-text">Inesquecível</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 md:mb-16">
              O Quebra-Cabeça Interativo é a forma mais criativa e emocionante de revelar sua página personalizada. Em vez de apenas enviar um link, você entrega uma experiência única e divertida.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mb-12 md:mb-16">
                <Card className="bg-card/80 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <ImageIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Um Enigma Personalizado</h3>
                            <p className="text-muted-foreground">Você escolhe uma foto especial. O sistema a transforma em um quebra-cabeça que a pessoa amada precisará montar para desvendar a surpresa.</p>
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
                            <p className="text-muted-foreground">Ao montar a imagem, a recompensa é revelada: a página de amor que você criou surge na tela, tornando a descoberta uma surpresa emocionante.</p>
                        </div>
                    </div>
                </Card>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-8 font-display">Veja em Ação</h2>
            
            <Card className="max-w-4xl mx-auto bg-transparent border-none shadow-none overflow-hidden h-[600px]">
                <CardContent className="p-0 h-full">
                   <div className="w-full h-full rounded-lg flex items-center justify-center relative">
                        <JigsawPuzzle
                          imageSrc="https://i.imgur.com/BzGXfqj.png"
                          onSolved={() => {}}
                          title="Experimente montar!"
                          description="Arraste as peças para revelar a imagem."
                          isPreview={true}
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
