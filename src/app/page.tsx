
"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ChevronRight, Star, Calendar, ImageIcon, Music, Globe, QrCode, PlayCircle, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { TypingAnimation } from "@/components/app/TypingAnimation";
import { HeartsBackground } from "@/components/app/HeartsBackground";
import { AnimatedBackground } from "@/components/app/AnimatedBackground";

export default function CreatorPage() {
  const testimonials = [
    { name: "Mariana & João", date: "15 de Maio, 2024", message: "Adorei a experiência! Pude criar uma página especial para o João com nossas fotos favoritas, uma playlist personalizada e um texto que representa nossa história. Ele ficou super emocionado quando viu!", image: "https://picsum.photos/100/100?random=1" },
    { name: "Ana & Pedro", date: "2 de Junho, 2024", message: "Com a Luv, pude expressar meu amor de um jeito totalmente diferente. Adorei criar uma página só para nós dois.", image: "https://picsum.photos/100/100?random=2" },
    { name: "Lucas & Carol", date: "20 de Março, 2024", message: "Montei uma página surpresa para a Carol, com nossas fotos de viagem e uma mensagem sincera. Ela adorou! Com certeza vou usar de novo.", image: "https://picsum.photos/100/100?random=3" },
  ];

  const features = [
    {
      icon: Puzzle,
      title: "Quebra-Cabeça Interativo",
      description: "Uma revelação emocionante através de um quebra-cabeça com uma foto especial.",
      image: "https://picsum.photos/800/600?random=20",
      imageHint: "jigsaw puzzle"
    },
    {
      icon: Calendar,
      title: "Contador de tempo",
      description: "Mostre há quanto tempo vocês estão juntos com um contador em tempo real.",
      image: "https://picsum.photos/800/600?random=21",
      imageHint: "time counter"
    },
    {
      icon: ImageIcon,
      title: "Galerias de Fotos",
      description: "Conte sua história com galerias de fotos animadas e personalizadas.",
      image: "https://picsum.photos/800/600?random=22",
      imageHint: "photo gallery"
    },
    {
      icon: Music,
      title: "Música dedicada",
      description: "Adicione a trilha sonora do seu amor com uma música do YouTube.",
      image: "https://picsum.photos/800/600?random=23",
      imageHint: "music player"
    },
    {
      icon: Globe,
      title: "Acesso Global",
      description: "Sua página acessível de qualquer lugar do mundo, com um link exclusivo.",
      image: "https://picsum.photos/800/600?random=24",
      imageHint: "world map"
    },
    {
      icon: QrCode,
      title: "QR Code Exclusivo",
      description: "Receba um QR Code para imprimir e surpreender de forma criativa.",
      image: "https://picsum.photos/800/600?random=25",
      imageHint: "qr code"
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative section-padding flex items-center min-h-[calc(100vh-80px)] overflow-hidden">
        <AnimatedBackground />
        <HeartsBackground color="purple" />
        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-display leading-tight">
              Declare seu amor <br />
              <TypingAnimation />
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 my-8">
              Transforme seus sentimentos em uma obra de arte digital. Uma experiência exclusiva, criada para celebrar momentos que merecem ser eternos.
            </p>
            <Link href="/criar">
                <Button size="lg" className="h-12 text-base md:h-14 group relative w-full sm:w-auto">
                Criar minha página
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          </div>
          <div className="relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
             <div className="aspect-square relative">
                <Image
                  src="https://picsum.photos/800/800"
                  alt="Casal feliz"
                  fill
                  className="rounded-3xl shadow-2xl shadow-primary/20 object-cover"
                  data-ai-hint="happy couple"
                />
             </div>
          </div>
        </div>
      </section>

       {/* Features Section */}
      <section id="recursos" className="section-padding bg-background/80 backdrop-blur-sm">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Uma Experiência <span className="gradient-text">Incomparável</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 md:mb-16">Cada detalhe foi pensado para proporcionar uma declaração de amor que transcende o comum. Oferecemos mais que uma página, uma memória viva.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
               <Card key={i} className="bg-card/80 border-border text-left overflow-hidden group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                     <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={feature.imageHint}
                      />
                  </div>
                 <CardHeader>
                    <feature.icon className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                 </CardHeader>
               </Card>
            ))}
          </div>
           <Card className="mt-12 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 p-6 md:p-8 text-center relative overflow-hidden">
             <AnimatedBackground />
            <div className="relative z-10">
              <CardHeader className="p-0 mb-4 items-center">
                  <div className="p-3 bg-background rounded-full mb-3">
                      <PlayCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">Veja a Revelação em Ação</CardTitle>
                  <CardDescription className="text-base md:text-lg text-foreground/80 mt-2">Descubra como funciona a experiência interativa que torna sua declaração inesquecível.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                  <Link href="/como-funciona">
                      <Button size="lg" variant="outline" className="bg-background/80 hover:bg-background">Como funciona?</Button>
                  </Link>
              </CardContent>
            </div>
           </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="avaliacoes" className="section-padding bg-background/80 backdrop-blur-sm">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Histórias que <span className="gradient-text">Inspiram</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 md:mb-16">Relatos de quem escolheu a Luv para eternizar seus momentos e vivenciou uma experiência única e emocionante.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    className="bg-card/80 border-border p-6 text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="rounded-full" data-ai-hint="person"/>
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground italic mb-4">"{testimonial.message}"</p>
                    </div>
                    <div className="flex pt-4 border-t border-border">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                    </div>
                  </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-card/50 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
            Comece a sua <span className="gradient-text">obra de arte</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Não espere uma data especial para criar um momento especial. Surpreenda hoje com uma declaração que será lembrada para sempre.
          </p>
          <Link href="/criar">
            <Button size="lg" className="h-12 md:h-14 group relative">
                Comece agora, é grátis
                <Heart className="w-5 h-5 ml-2 group-hover:fill-red-400 transition-colors" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

    