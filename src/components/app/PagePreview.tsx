
"use client";

import * as React from "react";
import { format, intervalToDuration } from "date-fns";
import { ptBR } from 'date-fns/locale';
import * as z from "zod";
import { cn } from "@/lib/utils";
import Image from "next/image";
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, EffectCube, EffectFlip, EffectCards, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

// Instala os módulos do Swiper para que os efeitos funcionem
SwiperCore.use([EffectCoverflow, EffectCube, EffectFlip, EffectCards, Pagination]);

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

  const timeUnits = [
    { label: 'anos', value: duration.years },
    { label: 'meses', value: duration.months },
    { label: 'dias', value: duration.days },
    { label: 'horas', value: duration.hours },
    { label: 'minutos', value: duration.minutes },
    { label: 'segundos', value: duration.seconds },
  ];

  if (displayType === "classico") {
    return (
       <div className="text-center text-zinc-300 text-sm">
        <p>Compartilhando momentos há {duration.years || 0} anos {String(duration.months || 0).padStart(2, '0')} meses {String(duration.days || 0).padStart(2, '0')} dias {String(duration.hours || 0).padStart(2, '0')} horas</p>
        <p>{String(duration.minutes || 0).padStart(2, '0')} minutos {String(duration.seconds || 0).padStart(2, '0')} segundos ❤️‍🔥</p>
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
            {timeUnits.slice(0, 3).map(unit => ( // Show only years, months, days
                <div key={unit.label} className="bg-zinc-800/50 p-2 rounded-lg">
                    <div className="text-2xl font-bold">{String(unit.value || 0).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">{unit.label}</div>
                </div>
            ))}
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

  const getSwiperEffectProps = () => {
    switch (displayType) {
      case 'Coverflow':
        return {
          effect: 'slide' as const,
          slidesPerView: 3,
        };
      case 'Cube':
        return {
          effect: 'cube' as const,
          slidesPerView: 1,
          cubeEffect: {
            shadow: true,
            slideShadows: false,
            shadowOffset: 20,
            shadowScale: 0.94,
          },
        };
      case 'Flip':
        return {
          effect: 'flip' as const,
          slidesPerView: 1,
          flipEffect: {
            slideShadows: false,
          },
        };
      case 'Cards':
      default:
        return {
          effect: 'cards' as const,
          slidesPerView: 1,
          cardsEffect: {
            slideShadows: false,
          },
        };
    }
  };
  
  const isCube = displayType === 'Cube';
  const isCards = displayType === 'Cards';
  const isCoverflow = displayType === 'Coverflow';
  const isFlip = displayType === 'Flip';

  return (
    <div className="w-full mb-6 relative h-[300px] flex items-center justify-center">
      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: hsl(var(--primary)) !important;
        }
        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right,
        .swiper-slide-shadow-top,
        .swiper-slide-shadow-bottom,
        .swiper-slide-shadow,
        .swiper-cube-shadow {
          display: none !important;
        }
        .swiper-slide-coverflow {
          width: 200px !important;
          height: 200px !important;
        }
        .swiper-slide-cards {
          width: 250px !important;
          height: 250px !important;
        }
        .swiper-cube-container {
          width: 200px !important;
          height: 200px !important;
        }
        .swiper-slide-flip {
           width: 250px !important;
           height: 250px !important;
        }
      `}</style>
      <Swiper
        grabCursor={true}
        centeredSlides={true}
        pagination={{ clickable: true }}
        className={cn(
          "mySwiper w-full h-full",
          isCube && "swiper-cube-container"
        )}
        loop
        {...getSwiperEffectProps()}
      >
        {photos.map((photo, index) => (
          <SwiperSlide
            key={index}
            className={cn({
              'swiper-slide-cards': isCards,
              'swiper-slide-coverflow': isCoverflow,
              'swiper-slide-flip': isFlip,
            })}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={photo}
                alt={`User photo ${index + 1}`}
                fill
                className="rounded-lg object-contain"
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

    