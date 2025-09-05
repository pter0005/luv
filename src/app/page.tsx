"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ChevronRight, Star, ListOrdered, DollarSign, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label";

export default function CreatorPage() {
  return (
    <>
      <div className="h-full overflow-x-hidden" id="start">
        <div className="h-full bg-black bg-grid-neutral-800/20 relative flex items-center justify-center pb-20">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]"></div>
          <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/3 via-transparent to-red-500/3"></div>
            <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] bg-gradient-conic from-red-500/5 via-transparent to-red-500/5"></div>
          </div>
          <div className="container">
            <section className="mt-[14rem] lg:mt-[10rem] xl:mt-[12rem] flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-36 relative z-10">
              <div className="w-full lg:w-1/2">
                <div className="w-auto z-10 rounded-full bg-red-900/20 text-white text-xs font-semibold inline-flex items-center px-4 py-2 space-x-2 mb-6">
                  <span>Vamos começar?</span>
                </div>
                <h1 className="text-white text-5xl lg:text-6xl font-sans pt-3 relative z-20 font-bold tracking-tight mb-1">
                  Declare seu amor
                </h1>
                <div className="font-headline text-5xl md:text-6xl text-red-500 font-bold mb-6 -mt-1.5 leading-tight">
                  <span>para alguém especial</span>
                  <span className="animate-pulse">|</span>
                </div>
                <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
                  Crie uma página personalizada para quem você ama e surpreenda a
                  pessoa com uma declaração especial que ficará para sempre.
                </p>
                <Button
                  size="lg"
                  className="h-14 max-w-md relative group inline-flex items-center justify-center overflow-hidden rounded-lg animate-pulse bg-gradient-to-br from-red-500 to-pink-600 p-0.5 font-medium text-white hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300/50 w-full"
                >
                  <span className="w-full relative rounded-md bg-black/20 backdrop-blur-sm px-8 py-6 md:px-12 md:py-8 transition-all duration-200 ease-in group-hover:bg-black/0 flex items-center h-14 justify-center">
                    <span className="flex items-center justify-center gap-3">
                      <Heart className="w-6 h-6 text-white" />
                      <span className="tracking-wider font-bold text-lg">
                        Criar minha página
                      </span>
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </span>
                  </span>
                </Button>
                <div className="flex items-center justify-center lg:justify-start gap-4 mt-6">
                  <div className="flex -space-x-2">
                    <Image
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-black"
                      src="https://picsum.photos/32/32?random=1"
                      alt="User 1"
                      width={32}
                      height={32}
                      data-ai-hint="person"
                    />
                    <Image
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-black"
                      src="https://picsum.photos/32/32?random=2"
                      alt="User 2"
                      width={32}
                      height={32}
                      data-ai-hint="person"
                    />
                    <Image
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-black"
                      src="https://picsum.photos/32/32?random=3"
                      alt="User 3"
                      width={32}
                      height={32}
                      data-ai-hint="person"
                    />
                    <Image
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-black"
                      src="https://picsum.photos/32/32?random=4"
                      alt="User 4"
                      width={32}
                      height={32}
                      data-ai-hint="person"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-xs text-white">
                      Mais de 40.325 usuários satisfeitos
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative w-full lg:w-1/2 flex items-center justify-center py-10">
                <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 blur-[80px] -z-10"></div>
                <div className="relative w-full max-w-[300px] aspect-[9/16] animate-float group">
                  <div
                    className="relative w-full h-full rounded-[40px] overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ transform: "rotate(-1deg)" }}
                  >
                    <div className="absolute inset-0 z-10 w-[91%] h-[97%] mx-auto mt-[2%] rounded-3xl overflow-hidden shadow-inner">
                      <Image
                        src="https://picsum.photos/400/800"
                        alt="App Preview"
                        fill
                        objectFit="cover"
                        className="w-full h-full"
                        data-ai-hint="love couple"
                      />
                       <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.4)] pointer-events-none"></div>
                    </div>
                    <Image
                      alt="Mockup"
                      className="absolute top-0 left-0 z-20 w-full h-full pointer-events-none"
                      src="https://storage.googleapis.com/app-prototyping-public-artifacts/mockup.webp"
                      width={300}
                      height={600}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <section id="how-work" className="py-12 bg-gradient-to-b from-black via-black to-red-950/20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="w-auto z-10 rounded-full bg-red-900/10 text-white text-xs font-semibold inline-flex items-center px-3 py-1.5 space-x-1 mb-5">
              <span>Como funciona?</span>
            </div>
            <h2 className="bg-clip-text text-center text-transparent bg-gradient-to-b from-neutral-200 to-white text-3xl lg:text-5xl font-sans py-2 relative z-20 font-bold tracking-tight mb-2">Crie sua página em poucos passos</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-16">Personalize uma página especial para surpreender alguém querido. O processo é simples e rápido.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="relative">
              <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800/40 h-full">
                <div className="mb-4 h-12 flex items-center justify-center text-red-400">
                  <ListOrdered className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white text-center">Personalize</h3>
                <p className="text-white/70 leading-relaxed text-center">Personalize sua página com fotos, mensagens, efeitos especiais e muito mais.</p>
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl font-bold text-white">1</div>
            </div>
            <div className="relative">
              <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800/40 h-full">
                <div className="mb-4 h-12 flex items-center justify-center text-red-400">
                  <DollarSign className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white text-center">Faça o pagamento</h3>
                <p className="text-white/70 leading-relaxed text-center">Escolha seu plano preferido e faça o pagamento de forma rápida e segura.</p>
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl font-bold text-white">2</div>
            </div>
            <div className="relative">
              <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800/40 h-full">
                <div className="mb-4 h-12 flex items-center justify-center text-red-400">
                  <QrCode className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white text-center">Receba seu acesso</h3>
                <p className="text-white/70 leading-relaxed text-center">Você receberá por email um QR code e link para acessar sua página.</p>
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl font-bold text-white">3</div>
            </div>
            <div className="relative">
              <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800/40 h-full">
                <div className="mb-4 h-12 flex items-center justify-center text-red-400">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white text-center">Compartilhe o amor</h3>
                <p className="text-white/70 leading-relaxed text-center">Compartilhe a página com a pessoa amada e surpreenda-a de forma especial.</p>
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl font-bold text-white">4</div>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" className="py-12 lg:py-32 container md:flex justify-between w-full gap-12">
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
           <div className="w-auto z-10 rounded-full bg-red-900/10 text-white text-xs font-semibold inline-flex items-center px-3 py-1.5 space-x-1 mb-5">
              <span>F.A.Q</span>
            </div>
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-white text-3xl lg:text-5xl font-sans py-2 relative z-20 font-bold tracking-tight">Perguntas Frequentes</h2>
          <p className="max-w-xl text-left text-base md:text-lg text-neutral-300 mt-2 mb-8">Aqui estão algumas perguntas frequentes para ajudar você a entender melhor a Heartzzu. Caso tenha alguma dúvida, entre em contato conosco.</p>
          <a className="text-left text-sm md:text-lg text-neutral-500 mt-8 underline" href="#">Dúvidas? Entre em contato por aqui</a>
        </div>
        <div className="w-full md:w-1/2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>O que é a Heartzzu?</AccordionTrigger>
              <AccordionContent>
                Heartzzu é uma plataforma que permite criar páginas personalizadas para pessoas especiais. Você pode adicionar fotos, uma mensagem e também o tempo da união.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Como posso criar uma página personalizada na Heartzzu?</AccordionTrigger>
              <AccordionContent>
                Para criar sua página personalizada, siga as etapas preenchendo o formulário com as informações solicitadas. Após o preenchimento, você será direcionado para o pagamento.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>O que está incluído na minha página personalizada?</AccordionTrigger>
              <AccordionContent>
                Sua página personalizada contará com tudo o que preencher no formulário, dependendo do plano escolhido.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Como recebo minha página personalizada após o pagamento?</AccordionTrigger>
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
        </div>
      </section>
    </>
  );
}

    