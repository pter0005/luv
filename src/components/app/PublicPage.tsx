
"use client";

import * as React from "react";
import SwiperCore from 'swiper';
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
import { FormData } from "@/app/criar/fazer-eu-mesmo/page";
import { JigsawPuzzle } from "./JigsawPuzzle";
import { AnimatePresence, motion } from "framer-motion";
import { PageContent } from "./PageContent";

SwiperCore.use([Autoplay, EffectCoverflow, EffectCube, EffectFlip, EffectCards, Pagination, Navigation]);

interface PublicPageProps {
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

    const [isInteracted, setIsInteracted] = React.useState(false);

    React.useEffect(() => {
        const handleInteraction = () => {
            setIsInteracted(true);
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        }
        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        }
    }, [])

    if (data.musicChoice === 'youtube' && videoId) {
        const muteParam = isInteracted ? '0' : '1';
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&mute=${muteParam}&enablejsapi=1`;
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
                        title={data.puzzleTitle}
                        description={data.puzzleDescription}
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
