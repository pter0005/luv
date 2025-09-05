"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreatorPage() {
  return (
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
                      layout="fill"
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
  );
}
