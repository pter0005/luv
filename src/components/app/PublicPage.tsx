
"use client";

import * as React from "react";
import { format, intervalToDuration } from "date-fns";
import { ptBR } from 'date-fns/locale';
import * as z from "zod";
import { cn } from "@/lib/utils";
import Image from "next/image";

import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, EffectFlip, EffectCards, EffectCube, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { HeartsBackground } from "./HeartsBackground";
import { StarsBackground } from "./StarsBackground";
import { ColoredStarsBackground } from "./ColoredStarsBackground";
import { VortexBackground } from "./VortexBackground";
import { Button } from "../ui/button";
import { Music, Pause, Play, Puzzle } from "lucide-react";
import { FormData } from "@/app/criar/fazer-eu-mesmo/page";
import { JigsawPuzzle } from "./JigsawPuzzle";
import { AnimatePresence, motion } from "framer-motion";

SwiperCore.use([Autoplay, EffectCoverflow, EffectCube, EffectFlip, EffectCards, Pagination, Navigation]);

interface PublicPageProps {
  data: Partial<FormData>;
}

const Countdown = ({ startDate, displayType }: { startDate?: Date; displayType?: string }) => {
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

  if (!startDate) return null;
  
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
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: false,
    pagination: { clickable: true }
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
            modifier: 1,
            slideShadows: false,
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
        .swiper-container-coverflow .swiper-slide {
          width: 80%;
          max-width: 250px;
        }
        .swiper-container-cube {
          width: 200px;
          height: 200px;
        }
        .swiper-container-cards {
          height: 320px;
          width: 240px;
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
      <Swiper {...getSwiperEffectProps()} key={displayType} className={cn("mySwiper", `swiper-container-${displayType?.toLowerCase()}`)}>
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
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


const MusicPlayer = ({ data }: { data: Partial<FormData> }) => {
    const videoId = React.useMemo(() => {
        if (!data.musicUrl) return null;
        try {
            const url = new URL(data.musicUrl);
            if (url.hostname === 'youtu.be') return url.pathname.slice(1);
            if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
                return url.searchParams.get('v');
            }
            return null;
        } catch (error) { return null; }
    }, [data.musicUrl]);

    if (data.musicChoice === 'youtube' && videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&mute=1`;
        return (
            <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden">
                <iframe
                    width="1"
                    height="1"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }
    
    return null;
}

const DynamicBackground = ({ data }: { data: Partial<FormData> }) => {
    switch (data.backgroundAnimation) {
        case 'hearts':
            return <HeartsBackground color={data.heartColor as 'purple' | 'red'} />;
        case 'stars':
            return <StarsBackground />;
        case 'colored-stars':
            return <ColoredStarsBackground />;
        case 'mystic-fog':
             return (
                <>
                    <div className="mystic-fog-1"></div>
                    <div className="mystic-fog-2"></div>
                </>
             );
        case 'vortex':
            return <VortexBackground />;
        default:
            return null;
    }
}

const CustomAudioPlayer = ({ onTogglePlay, isPlaying, audioSrc }: { onTogglePlay: () => void, isPlaying: boolean, audioSrc: string }) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);

    React.useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

     React.useEffect(() => {
      if (audioRef.current) {
          audioRef.current.src = audioSrc;
          audioRef.current.load();
      }
    }, [audioSrc]);

    return (
        <>
            <audio ref={audioRef} src={audioSrc} />
            <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-lg p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Music className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Uma mensagem para você</p>
                    </div>
                    <Button onClick={onTogglePlay} size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-background/50 hover:bg-background/80">
                        {isPlaying ? <Pause className="h-5 w-5"/> : <Play className="h-5 w-5"/>}
                    </Button>
                </div>
            </div>
        </>
    );
}

const PageContent = ({ data }: { data: Partial<FormData> }) => {
  const [isPlayingCustomAudio, setIsPlayingCustomAudio] = React.useState(false);
  
  const hasCustomAudio = data.musicChoice === 'custom' && data.customAudio;

  const toggleCustomAudio = () => {
    setIsPlayingCustomAudio(prev => !prev);
  }

  React.useEffect(() => {
    setIsPlayingCustomAudio(false);
  }, [data.customAudio]);
  
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
        {hasCustomAudio && (
            <CustomAudioPlayer 
                onTogglePlay={toggleCustomAudio} 
                isPlaying={isPlayingCustomAudio} 
                audioSrc={data.customAudio!} 
            />
        )}
        <div
            className="flex-grow p-4 flex flex-col items-center justify-center text-center relative overflow-y-auto"
        >
            <div className="relative z-10 w-full max-w-4xl mx-auto">
                
                <PhotoGallery photos={data.photos} displayType={data.photoDisplayType} />

                <h1 
                    className="text-5xl md:text-6xl font-handwriting"
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
  )
}

export function PublicPage({ data }: PublicPageProps) {
  const [isUnlocked, setIsUnlocked] = React.useState(data.unlockType !== 'puzzle');
  
  const handlePuzzleSolved = () => {
    setIsUnlocked(true);
  };

  return (
    <div className="w-full h-screen flex flex-col relative overflow-hidden bg-black">
        <MusicPlayer data={data} />
        <DynamicBackground 
            key={`${data.backgroundAnimation}-${data.heartColor}`} 
            data={data}
        />
        
        <AnimatePresence>
            {!isUnlocked && data.puzzleImage && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-20 w-full h-full"
                >
                    <JigsawPuzzle 
                        imageSrc={data.puzzleImage} 
                        onSolved={handlePuzzleSolved} 
                    />
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {isUnlocked && (
                 <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full h-full"
                >
                    <PageContent data={data} />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}

    