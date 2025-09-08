
"use client";

import * as React from "react";
import { format, intervalToDuration } from "date-fns";
import { ptBR } from 'date-fns/locale';
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

import { HeartsBackground } from "./HeartsBackground";
import { StarsBackground } from "./StarsBackground";
import { ColoredStarsBackground } from "./ColoredStarsBackground";
import { Button } from "../ui/button";
import { Music, Pause, Play } from "lucide-react";
import { VortexBackground } from "./VortexBackground";
import { FormData } from "@/app/criar/fazer-eu-mesmo/page";
import { PageContent } from "./PageContent";

// Register Swiper modules
SwiperCore.use([Autoplay, EffectCoverflow, EffectCube, EffectFlip, EffectCards, Pagination, Navigation]);

interface PagePreviewProps {
  data: Partial<FormData>;
}

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


export function PagePreview({ data }: PagePreviewProps) {
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-black">
        <MusicPlayer data={data} />
        <DynamicBackground 
            key={`${data.backgroundAnimation}-${data.heartColor}`} 
            data={data}
        />
        
        <PageContent data={data} isPreview={true} />
    </div>
  );
}
