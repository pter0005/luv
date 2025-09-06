
"use client";

import * as React from "react";
import { format, intervalToDuration } from "date-fns";
import { ptBR } from 'date-fns/locale';
import * as z from "zod";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Import Swiper React components
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, EffectFlip, EffectCards, EffectCube, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Register Swiper modules
SwiperCore.use([Autoplay, EffectCoverflow, EffectCube, EffectFlip, EffectCards, Pagination, Navigation]);

const formSchema = z.object({
  title: z.string(),
  titleColor: z.string().optional(),
  message: z.string().optional(),
  messageFontSize: z.string().optional(),
  startDate: z.date().optional(),
  dateDisplayType: z.string().optional(),
  photos: z.array(z.string()).optional(),
  photoDisplayType: z.string().optional(),
});

type PageData = z.infer<typeof formSchema>;

interface PagePreviewProps {
  data: PageData;
}

const Countdown = ({ startDate, displayType }: { startDate: Date; displayType?: string }) => {
  const [duration, setDuration] = React.useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    if(!startDate) return;
    const interval = setInterval(() => {
      const now = new Date();
      if (startDate.getTime() > now.getTime()) {
         setDuration({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
         return;
      }
      const newDuration = intervalToDuration({ start: startDate, end: now });
      setDuration(newDuration);
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);
  
  if (displayType === "classico") {
    return (
       <div className="text-center text-zinc-300 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <p className="font-sans text-lg tracking-tight">Estamos compartilhando momentos há</p>
        <div className="grid grid-cols-4 gap-2 font-bold text-lg font-mono text-primary my-2">
            <div className="flex flex-col items-center"><span className="text-2xl">{String(duration.years || 0).padStart(2, '0')}</span><span className="text-xs text-zinc-400">Anos</span></div>
            <div className="flex flex-col items-center"><span className="text-2xl">{String(duration.months || 0).padStart(2, '0')}</span><span className="text-xs text-zinc-400">Meses</span></div>
            <div className="flex flex-col items-center"><span className="text-2xl">{String(duration.days || 0).padStart(2, '0')}</span><span className="text-xs text-zinc-400">Dias</span></div>
            <div className="flex flex-col items-center"><span className="text-2xl">{String(duration.hours || 0).padStart(2, '0')}</span><span className="text-xs text-zinc-400">Horas</span></div>
        </div>
         <div className="grid grid-cols-2 gap-2 font-bold text-lg font-mono text-primary my-2">
            <div className="flex flex-col items-center"><span className="text-2xl">{String(duration.minutes || 0).padStart(2, '0')}</span><span className="text-xs text-zinc-400">Min</span></div>
            <div className="flex flex-col items-center"><span className="text-2xl">{String(duration.seconds || 0).padStart(2, '0')}</span><span className="text-xs text-zinc-400">Seg</span></div>
        </div>
        <p className="text-sm text-zinc-400 mt-2">Juntos desde {format(startDate, "dd/MM/yyyy")}</p>
      </div>
    )
  }


  if (displayType === 'simples') {
    return (
      <p className="text-zinc-300 text-sm">
        Desde {format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </p>
    )
  }

  // Fallback to "padrão"
  return (
    <div className="text-center">
        <h2 className="font-display text-lg mb-4">Compartilhando momentos há</h2>
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-zinc-800/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{String(duration.years || 0).padStart(2, '0')}</div>
              <div className="text-xs text-muted-foreground">anos</div>
          </div>
           <div className="bg-zinc-800/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{String(duration.months || 0).padStart(2, '0')}</div>
              <div className="text-xs text-muted-foreground">meses</div>
          </div>
           <div className="bg-zinc-800/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{String(duration.days || 0).padStart(2, '0')}</div>
              <div className="text-xs text-muted-foreground">dias</div>
          </div>
           <div className="bg-zinc-800/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{String(duration.hours || 0).padStart(2, '0')}</div>
              <div className="text-xs text-muted-foreground">horas</div>
          </div>
           <div className="bg-zinc-800/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{String(duration.minutes || 0).padStart(2, '0')}</div>
              <div className="text-xs text-muted-foreground">minutos</div>
          </div>
           <div className="bg-zinc-800/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{String(duration.seconds || 0).padStart(2, '0')}</div>
              <div className="text-xs text-muted-foreground">segundos</div>
          </div>
        </div>
         <p className="mt-4 text-zinc-400 text-xs">
            Desde {format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
         </p>
    </div>
  )
}

const PhotoGallery = ({ photos, displayType }: { photos?: string[]; displayType?: string }) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  const commonProps = {
    loop: true,
    pagination: { clickable: true },
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: false,
  };

  const getSwiperEffectProps = () => {
    switch (displayType) {
       case 'Coverflow':
        return {
          ...commonProps,
          effect: 'coverflow' as const,
          slidesPerView: 'auto' as const,
          centeredSlides: true,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
          },
        };
      case 'Cube':
        return {
          ...commonProps,
          effect: 'cube' as const,
          cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          },
        };
      case 'Flip':
        return {
          ...commonProps,
          effect: 'flip' as const,
          flipEffect: {
            slideShadows: true,
          },
        };
      case 'Cards':
      default:
        return {
          ...commonProps,
          effect: 'cards' as const,
          cardsEffect: {
            slideShadows: true,
          },
        };
    }
  };

  return (
    <div className={cn(
      "w-full mb-6 relative flex items-center justify-center h-[300px]",
    )}>
      <style jsx global>{`
        .swiper-container-coverflow, .swiper-container-flip {
          height: 250px;
        }
        .swiper-container-coverflow .swiper-slide {
          width: 80%;
          max-width: 250px;
        }
        .swiper-container-cards {
          height: 320px;
          width: 240px;
        }
        .swiper-container-cube {
          width: 200px;
          height: 200px;
        }
        .mySwiper {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .swiper-slide {
          background-position: center;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
        }
        .mySwiper .swiper-slide {
           border-radius: 18px;
           overflow: hidden;
        }
        .swiper-pagination-bullet-active {
          background: hsl(var(--primary)) !important;
        }
        .swiper-wrapper {
          align-items: center; 
        }
        .slide-image-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .slide-image-wrapper img {
            object-fit: cover;
        }
      `}</style>
      <Swiper {...getSwiperEffectProps()} className={cn("mySwiper", `swiper-container-${displayType?.toLowerCase()}`)}>
        {photos.map((photo, index) => (
          <SwiperSlide
            key={index}
          >
            <div className="slide-image-wrapper">
               <Image
                src={photo}
                alt={`User photo ${index + 1}`}
                fill
                sizes="(max-width: 400px) 100vw, 250px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};


export function PagePreview({ data }: PagePreviewProps) {
  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col">
        {/* Browser Header */}
        <div className="flex-shrink-0 bg-zinc-800 p-2 flex items-center gap-1.5 border-b border-zinc-700/50">
            <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-grow bg-zinc-900/80 rounded-md px-2 py-0.5 text-xs text-zinc-400 text-center truncate">
                https://luv.com/p/{data.title?.toLowerCase().replace(/\\s/g, '-') || 'pagina'}
            </div>
        </div>

        {/* Page Content */}
        <div
            className="flex-grow p-4 flex flex-col items-center justify-start text-center relative overflow-y-auto bg-black"
        >
            <div className="relative z-10 w-full">
                
                <PhotoGallery photos={data.photos} displayType={data.photoDisplayType} />

                <h1 
                    className="text-4xl font-handwriting"
                    style={{ color: data.titleColor || '#FFFFFF' }}
                >
                    {data.title || "Seu Título Aqui"}
                </h1>
                
                {data.message && (
                    <div 
                        className={cn(
                          "mt-4 text-zinc-300 whitespace-pre-wrap break-words prose dark:prose-invert max-w-full text-center mx-auto",
                          data.messageFontSize || "text-sm"
                        )}
                        dangerouslySetInnerHTML={{ __html: data.message || "Sua mensagem especial..." }} 
                    />
                )}

                {data.startDate && (
                     <div className="mt-6">
                        <Countdown startDate={data.startDate} displayType={data.dateDisplayType} />
                     </div>
                )}
            </div>
        </div>
    </div>
  );
}


