"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ChevronRight, Star, Calendar, ImageIcon, Music, Globe, QrCode, Link as LinkIcon, Users, Check, X, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AnimatedBackground } from "@/components/app/AnimatedBackground";


export default function CreatorPage() {
  const testimonials = [
    { name: "Mariana e João", time: "1 mês atrás", message: "Adorei a experiência! Pude criar uma página especial para o João com nossas fotos favoritas, uma playlist personalizada e um texto que representa nossa história. Ele ficou super emocionado quando viu!", image: "https://picsum.photos/100/100?random=1" },
    { name: "Ana e Pedro", time: "2 dias atrás", message: "Com a Luv, pude expressar meu amor de um jeito totalmente diferente. Adorei criar uma página só para nós dois.", image: "https://picsum.photos/100/100?random=2" },
    { name: "Lucas e Carol", time: "3 meses atrás", message: "Montei uma página surpresa para a Carol, com nossas fotos de viagem e uma mensagem sincera. Ela adorou! Com certeza vou usar de novo.", image: "https://picsum.photos/100/100?random=3" },
    { name: "Camila e Felipe", time: "4 meses atrás", message: "A interface é simples e criar uma página com nossas fotos e músicas favoritas foi super especial!", image: "https://picsum.photos/100/100?random=4" },
    { name: "Bia e Henrique", time: "1 ano atrás", message: "A página ficou incrível e personalizada! Ele não esperava por algo tão emocionante.", image: "https://picsum.photos/100/100?random=5" },
    { name: "Clara e Rafael", time: "2 meses atrás", message: "Usar a Luv foi incrível! A plataforma é muito intuitiva e fácil de usar. Conseguimos montar um presente digital perfeito com músicas que marcaram nossa relação.", image: "https://picsum.photos/100/100?random=6" },
  ];

  return (
    <>
      <AnimatedBackground />
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4 text-foreground font-display">
            Declare seu <span className="gradient-text">amor</span> de forma única
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Crie uma página personalizada para quem você ama e surpreenda com uma declaração que ficará para sempre.
          </p>
          <Button size="lg" className="h-14 group relative">
            Criar minha página
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <div className="relative w-full max-w-4xl mx-auto mt-20">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-float"></div>
            <Image
              src="https://picsum.photos/1200/600"
              alt="Preview da página de amor"
              width={1200}
              height={600}
              className="rounded-xl shadow-2xl shadow-primary/20 relative animate-float"
              data-ai-hint="love couple webpage"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="section-padding bg-background/50 backdrop-blur-md relative z-10">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Recursos <span className="gradient-text">Exclusivos</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">Nossa plataforma oferece recursos incríveis para você criar a página personalizada perfeita.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: "Contador de tempo", description: "Mostre há quanto tempo vocês estão juntos com um contador em tempo real." },
              { icon: ImageIcon, title: "Animações de fundo", description: "Escolha entre várias animações de fundo para personalizar a página." },
              { icon: Music, title: "Música dedicada", description: "Dedique uma música especial. A música será reproduzida automaticamente." },
              { icon: Globe, title: "Em todo lugar", description: "Crie e compartilhe de qualquer lugar do mundo. Aceitamos pagamentos internacionais." },
              { icon: QrCode, title: "QR Code exclusivo", description: "Crie um QR Code exclusivo para sua página, gerado automaticamente." },
              { icon: LinkIcon, title: "URL personalizada", description: "Crie uma URL personalizada para sua página, gerada automaticamente." },
            ].map((feature, i) => (
              <Card key={i} className="bg-card/80 border-border hover:border-primary/50 hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-primary/10 fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="temas" className="section-padding bg-secondary/30 backdrop-blur-md relative z-10">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Temas <span className="gradient-text">Luv</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">Escolha o tema ideal para a página personalizada. Você pode escolher entre os temas abaixo.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-card/80 border-border overflow-hidden group">
              <CardHeader>
                <CardTitle>Padrão</CardTitle>
                <CardDescription>Tema padrão com contador de tempo e animações de fundo.</CardDescription>
              </CardHeader>
              <CardContent>
                <Image src="https://picsum.photos/600/400?random=10" alt="Tema Padrão" width={600} height={400} className="rounded-lg mb-4 group-hover:scale-105 transition-transform duration-500" data-ai-hint="love letter" />
                <div className="flex justify-between items-center">
                  <Button variant="ghost">Experimentar agora</Button>
                  <Button>Criar página</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border overflow-hidden group">
              <CardHeader>
                <CardTitle>Netflix</CardTitle>
                <CardDescription>Tema inspirado na Netflix com data e episódios (fotos) favoritos.</CardDescription>
              </CardHeader>
              <CardContent>
                <Image src="https://picsum.photos/600/400?random=11" alt="Tema Netflix" width={600} height={400} className="rounded-lg mb-4 group-hover:scale-105 transition-transform duration-500" data-ai-hint="movie streaming" />
                <div className="flex justify-between items-center">
                  <Button variant="ghost">Experimentar agora</Button>
                  <Button>Criar página</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="avaliacoes" className="section-padding bg-background/50 backdrop-blur-md relative z-10">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">O que nossos <span className="gradient-text">clientes</span> dizem</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">Avaliações de clientes que já utilizaram nossos serviços e tiveram uma experiência incrível.</p>
          <Carousel opts={{ loop: true }} className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="bg-card/80 border-border h-full flex flex-col justify-between">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="rounded-full" data-ai-hint="person"/>
                          <div>
                            <p className="font-semibold text-foreground">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.time}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic">"{testimonial.message}"</p>
                      </CardContent>
                      <div className="flex p-6 pt-0">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-[-50px]" />
            <CarouselNext className="right-[-50px]" />
          </Carousel>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="section-padding bg-secondary/30 backdrop-blur-md relative z-10">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Nossos <span className="gradient-text">Planos</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">Escolha o plano ideal para sua página personalizada.</p>
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card/80 border-border flex flex-col">
              <CardHeader className="items-center pb-4">
                <CardTitle className="text-2xl">Mensal</CardTitle>
                <CardDescription>Esse plano possui um período de 1 mês.</CardDescription>
                <p className="text-4xl font-bold pt-4">R$20,00 <span className="text-lg font-normal text-muted-foreground">/mês</span></p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Texto dedicado</span></li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Contador em tempo real</span></li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Data de início</span></li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>QR Code exclusivo</span></li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Máximo de 4 imagens</span></li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>URL personalizada</span></li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Suporte 24 horas</span></li>
                  <li className="flex items-center gap-3"><X className="w-5 h-5 text-red-500" /><span>Sem música</span></li>
                  <li className="flex items-center gap-3"><X className="w-5 h-5 text-red-500" /><span>Sem fundo dinâmico</span></li>
                  <li className="flex items-center gap-3"><X className="w-5 h-5 text-red-500" /><span>Sem animações exclusivas</span></li>
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <Button className="w-full">Criar minha página</Button>
              </div>
            </Card>
             <Card className="bg-card/80 border-primary/50 relative flex flex-col shadow-2xl shadow-primary/20">
              <div className="absolute top-0 right-4 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">Recomendado</div>
              <CardHeader className="items-center pb-4">
                <CardTitle className="text-2xl">Para sempre</CardTitle>
                <CardDescription>Esse plano é vitalício, não precisa renovar.</CardDescription>
                <p className="text-4xl font-bold pt-4">R$33,00 <span className="text-lg font-normal text-muted-foreground">/uma vez</span></p>
                <p className="line-through text-muted-foreground">R$70,00</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Texto dedicado</span></li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Contador em tempo real</span></li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Data de início</span></li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>QR Code exclusivo</span></li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Imagens ilimitadas</span></li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>URL personalizada</span></li>
                    <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /><span>Suporte 24 horas</span></li>
                    <li className="flex items-center gap-3 text-foreground font-semibold"><Check className="w-5 h-5 text-primary" /><span>Com música</span></li>
                    <li className="flex items-center gap-3 text-foreground font-semibold"><Check className="w-5 h-5 text-primary" /><span>Fundo dinâmico</span></li>
                    <li className="flex items-center gap-3 text-foreground font-semibold"><Check className="w-5 h-5 text-primary" /><span>Com animações exclusivas</span></li>
                    <li className="flex items-center gap-3 text-foreground font-semibold"><Gamepad2 className="w-5 h-5 text-primary" /><span>Jogo 2D com enigma para uma revelação inesquecível</span></li>
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <Button className="w-full">Criar minha página</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-background/50 backdrop-blur-md relative z-10">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Perguntas <span className="gradient-text">Frequentes</span></h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">Aqui estão algumas perguntas frequentes para ajudar você a entender melhor a Luv.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
             <AccordionItem value="item-1">
              <AccordionTrigger>O que é a Luv?</AccordionTrigger>
              <AccordionContent>
                Luv é uma plataforma que permite criar páginas personalizadas para pessoas especiais. Você pode adicionar fotos, uma mensagem e também o tempo da união.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Como posso criar uma página personalizada?</AccordionTrigger>
              <AccordionContent>
                Para criar sua página personalizada, siga as etapas preenchendo o formulário com as informações solicitadas. Após o preenchimento, você será direcionado para o pagamento.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>O que está incluído na minha página?</AccordionTrigger>
              <AccordionContent>
                Sua página personalizada contará com tudo o que preencher no formulário, dependendo do plano escolhido.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Como recebo minha página após o pagamento?</AccordionTrigger>
              <AccordionContent>
                Após a confirmação do pagamento, você receberá um QR code e um link via email para compartilhar e acessar a página.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>A página personalizada tem validade?</AccordionTrigger>
              <AccordionContent>
                Sim, no plano básico, a página estará disponível por 1 ano. No plano avançado, a página será vitalícia.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
           <div className="text-center mt-12">
            <p className="text-muted-foreground">Ainda tem dúvidas?</p>
            <Button variant="link" className="text-base text-primary">Entre em contato por aqui</Button>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="section-padding bg-secondary/30 backdrop-blur-md relative z-10">
         <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
            Declare seu <span className="gradient-text">amor</span> de forma única
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Crie uma página personalizada para quem você ama e surpreenda com uma declaração que ficará para sempre.
          </p>
          <Button size="lg" className="h-14 group relative">
            Comece agora, é grátis
            <Heart className="w-5 h-5 ml-2 group-hover:fill-red-400 transition-colors" />
          </Button>
        </div>
      </section>

    </>
  );
}
