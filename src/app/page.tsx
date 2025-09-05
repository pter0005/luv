
"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ChevronRight, Star, Calendar, ImageIcon, Music, Globe, QrCode, Gamepad2, PlayCircle, Eye, Check, X } from "lucide-react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AnimatedBackground } from "@/components/app/AnimatedBackground";
import Link from "next/link";
import { cn } from "@/lib/utils";

function TypingAnimation() {
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [reverse, setReverse] = React.useState(false);
  const phrases = ["Para alguém especial.", "De forma única.", "Para seu amor."];

  React.useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === phrases[index].length ? 2000 : 150, 75));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases]);

  return (
    <h2 className="font-display text-4xl lg:text-5xl text-primary mb-8 h-20">
      {`${phrases[index].substring(0, subIndex)}`}
      <span className="animate-blink">|</span>
    </h2>
  );
}


export default function CreatorPage() {
  const testimonials = [
    { name: "Mariana e João", time: "1 mês atrás", message: "Adorei a experiência! Pude criar uma página especial para o João com nossas fotos favoritas, uma playlist personalizada e um texto que representa nossa história. Ele ficou super emocionado quando viu!", image: "https://picsum.photos/100/100?random=1" },
    { name: "Ana e Pedro", time: "2 dias atrás", message: "Com a Luv, pude expressar meu amor de um jeito totalmente diferente. Adorei criar uma página só para nós dois.", image: "https://picsum.photos/100/100?random=2" },
    { name: "Lucas e Carol", time: "3 meses atrás", message: "Montei uma página surpresa para a Carol, com nossas fotos de viagem e uma mensagem sincera. Ela adorou! Com certeza vou usar de novo.", image: "https://picsum.photos/100/100?random=3" },
    { name: "Camila e Felipe", time: "4 meses atrás", message: "A interface é simples e criar uma página com nossas fotos e músicas favoritas foi super especial!", image: "https://picsum.photos/100/100?random=4" },
    { name: "Bia e Henrique", time: "1 ano atrás", message: "A página ficou incrível e personalizada! Ele não esperava por algo tão emocionante.", image: "https://picsum.photos/100/100?random=5" },
    { name: "Clara e Rafael", time: "2 meses atrás", message: "Usar a Luv foi incrível! A plataforma é muito intuitiva e fácil de usar. Conseguimos montar um presente digital perfeito com músicas que marcaram nossa relação.", image: "https://picsum.photos/100/100?random=6" },
  ];

  const features = [
    { 
      icon: Gamepad2, 
      title: "Jogo Enigmático 2D", 
      description: "Uma revelação inesquecível através de um enigma personalizado.",
      example: {
        title: "Exemplo: Jogo Enigmático 2D",
        description: "Surpreenda com um mini-jogo 2D. Ao resolver um enigma, a pessoa amada descobre a página que você criou. É uma experiência interativa e emocionante que transforma a revelação em um momento único.",
        image: "https://picsum.photos/800/600?random=20",
        imageHint: "pixel art game"
      }
    },
    { 
      icon: Calendar, 
      title: "Contador de tempo", 
      description: "Mostre há quanto tempo vocês estão juntos com um contador em tempo real.",
      example: {
        title: "Exemplo: Contador de Tempo",
        description: "Visualize o tempo do seu relacionamento em anos, meses, dias, horas e até segundos. Um lembrete constante do tempo precioso que vocês compartilham, atualizado em tempo real.",
        image: "https://picsum.photos/800/600?random=21",
        imageHint: "time counter"
      }
    },
    { 
      icon: ImageIcon, 
      title: "Animações de fundo", 
      description: "Escolha entre várias animações de fundo para personalizar a página.",
      example: {
        title: "Exemplo: Animações de Fundo",
        description: "Dê vida à sua página com fundos animados. Escolha entre corações flutuantes, uma névoa suave ou outras animações para criar a atmosfera perfeita para a sua declaração de amor.",
        image: "https://picsum.photos/800/600?random=22",
        imageHint: "animated background"
      }
    },
    { 
      icon: Music, 
      title: "Música dedicada", 
      description: "Dedique uma música especial. A música será reproduzida automaticamente.",
      example: {
        title: "Exemplo: Música Dedicada",
        description: "Adicione a trilha sonora do seu amor. A música que você escolher tocará automaticamente, criando uma imersão completa e tornando a experiência ainda mais emocionante e pessoal.",
        image: "https://picsum.photos/800/600?random=23",
        imageHint: "music player"
      }
    },
    { 
      icon: Globe, 
      title: "Em todo lugar", 
      description: "Crie e compartilhe de qualquer lugar do mundo. Aceitamos pagamentos internacionais.",
      example: {
        title: "Exemplo: Acesso Global",
        description: "Não importa onde você ou seu amor estejam, a Luv conecta vocês. Crie sua página de qualquer lugar e compartilhe com o mundo. O amor não tem fronteiras, e sua declaração também não deveria ter.",
        image: "https://picsum.photos/800/600?random=24",
        imageHint: "world map"
      }
    },
    { 
      icon: QrCode, 
      title: "QR Code exclusivo", 
      description: "Crie um QR Code exclusivo para sua página, gerado automaticamente.",
      example: {
        title: "Exemplo: QR Code Exclusivo",
        description: "Receba um QR Code único para sua página. Perfeito para imprimir em um cartão, presentear ou usar em uma caça ao tesouro romântica. Aponte a câmera e a mágica acontece.",
        image: "https://picsum.photos/800/600?random=25",
        imageHint: "qr code"
      }
    },
  ];

  return (
    <>
      <AnimatedBackground />
      {/* Hero Section */}
       <section className="relative overflow-hidden section-padding">
        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4 text-foreground font-display">
              Declare seu <span className="gradient-text">amor</span>.
            </h1>
            <TypingAnimation />
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Transforme seus sentimentos em uma obra de arte digital. Uma experiência exclusiva, criada para celebrar momentos que merecem ser eternos.
            </p>
            <Button size="lg" className="h-14 group relative">
              Criar minha página
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
             <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-float"></div>
             <Image
              src="https://picsum.photos/600/600"
              alt="Casal feliz"
              width={600}
              height={600}
              className="rounded-full shadow-2xl shadow-primary/20 relative animate-float aspect-square object-cover"
              data-ai-hint="happy couple"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="section-padding bg-background/50 backdrop-blur-md relative z-10">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Uma Experiência <span className="gradient-text">Incomparável</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">Cada detalhe foi pensado para proporcionar uma declaração de amor que transcende o comum. Oferecemos mais que uma página, uma memória viva.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Dialog key={i}>
                <div className="group relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                  <Image 
                      src={feature.example.image}
                      alt={feature.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      data-ai-hint={feature.example.imageHint}
                    />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <feature.icon className="w-10 h-10 mb-4 text-primary drop-shadow-lg" />
                    <h3 className="text-2xl font-bold font-display">{feature.title}</h3>
                    <p className="text-white/80 mb-4">{feature.description}</p>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white w-full mt-auto">
                        Ver exemplo
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
                <DialogContent className="bg-card/95 backdrop-blur-lg text-foreground max-w-4xl p-0 border-0">
                  <DialogHeader className="p-6">
                    <DialogTitle className="text-3xl font-display text-primary flex items-center gap-3"><feature.icon className="w-8 h-8" /> {feature.example.title}</DialogTitle>
                    <DialogDescription className="text-base pt-2 text-muted-foreground">
                      {feature.example.description}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-6 pb-6">
                     <Image 
                        src={feature.example.image}
                        alt={feature.example.title}
                        width={800}
                        height={600}
                        className="rounded-lg object-cover w-full h-auto"
                        data-ai-hint={feature.example.imageHint}
                      />
                  </div>
                </DialogContent>
               </Dialog>
            ))}
          </div>
           <Card className="mt-12 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 p-8 text-center">
            <CardHeader className="p-0 mb-4 items-center">
                <div className="p-3 bg-background rounded-full mb-3">
                    <PlayCircle className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Veja o Jogo em Ação</CardTitle>
                <CardDescription className="text-lg text-foreground/80 mt-2">Descubra como funciona a experiência interativa que torna sua declaração inesquecível.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Link href="/como-funciona">
                    <Button size="lg" variant="outline" className="bg-background/80 hover:bg-background">Como funciona?</Button>
                </Link>
            </CardContent>
        </Card>
        </div>
      </section>

      {/* Themes Section */}
      <section id="temas" className="section-padding bg-secondary/30 backdrop-blur-md relative z-10">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Temas <span className="gradient-text">Exclusivos Luv</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">Selecione o cenário perfeito para sua história. Cada tema é uma tela em branco para suas emoções, desenhado para encantar e surpreender.</p>
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Histórias que <span className="gradient-text">Inspiram</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">Relatos de quem escolheu a Luv para eternizar seus momentos e vivenciou uma experiência única e emocionante.</p>
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Nossos <span className="gradient-text">Passaportes</span></h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">Escolha o acesso ideal para sua jornada de amor. Cada plano é um convite para uma experiência memorável e duradoura.</p>
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
                <CardDescription>Acesso vitalício à sua obra de arte digital.</CardDescription>
                <p className="text-4xl font-bold pt-4">R$34,99 <span className="text-lg font-normal text-muted-foreground">/uma vez</span></p>
                <p className="line-through text-muted-foreground">R$79,90</p>
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
                    <li className="flex items-center gap-3 text-foreground font-semibold"><Check className="w-5 h-5 text-primary" /><span>Trilha Sonora Personalizada</span></li>
                    <li className="flex items-center gap-3 text-foreground font-semibold"><Check className="w-5 h-5 text-primary" /><span>Fundo Dinâmico e Interativo</span></li>
                    <li className="flex items-center gap-3 text-foreground font-semibold"><Check className="w-5 h-5 text-primary" /><span>Animações Exclusivas</span></li>
                    <li className="flex items-center gap-3 text-foreground font-semibold"><Gamepad2 className="w-5 h-5 text-primary" /><span>Jogo 2D com enigma para uma revelação inesquecível</span></li>
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <Button className="w-full">Adquirir Passaporte Eterno</Button>
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
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">Respostas para as dúvidas mais comuns sobre a experiência Luv.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
             <AccordionItem value="item-1">
              <AccordionTrigger>O que é a Luv?</AccordionTrigger>
              <AccordionContent>
                Luv é uma plataforma exclusiva para a criação de páginas personalizadas e imersivas, transformando declarações de amor em experiências digitais inesquecíveis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Como posso criar uma página personalizada?</AccordionTrigger>
              <AccordionContent>
                Nosso processo guiado é simples e intuitivo. Basta preencher o formulário com suas memórias e sentimentos e, após o pagamento, nossa mágica acontece.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>O que está incluído na minha página?</AccordionTrigger>
              <AccordionContent>
                Sua página é um reflexo da sua história, com todos os elementos que você escolheu no formulário, de acordo com o passaporte selecionado.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Como recebo minha página após o pagamento?</AccordionTrigger>
              <AccordionContent>
                Após a confirmação, você receberá um QR code e um link exclusivo por email, prontos para compartilhar e encantar.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>A página personalizada tem validade?</AccordionTrigger>
              <AccordionContent>
                Sim. O plano mensal garante acesso por 1 mês, enquanto o passaporte "Para Sempre" torna sua declaração vitalícia, um legado digital do seu amor.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
           <div className="text-center mt-12">
            <p className="text-muted-foreground">Ainda tem dúvidas?</p>
            <Button variant="link" className="text-base text-primary">Fale com um de nossos especialistas</Button>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="section-padding bg-secondary/30 backdrop-blur-md relative z-10">
         <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
            Comece a sua <span className="gradient-text">obra de arte</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Não espere uma data especial para criar um momento especial. Surpreenda hoje com uma declaração que será lembrada para sempre.
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
