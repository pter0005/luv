
"use client";

import Image from "next/image";
import * as React from "react";
import { Play, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetflixDeAmorPageProps {
    data: any;
    isPreview?: boolean;
}

const CategoryRow = ({ category }: { category: any }) => (
    <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-10">{category.title}</h2>
        <div className="flex overflow-x-auto space-x-4 px-4 md:px-10 pb-4 scrollbar-hide">
            {category.items.map((item: any, index: number) => (
                <div key={index} className="flex-shrink-0 w-40 md:w-48 group">
                    <div className="aspect-[2/3] bg-zinc-800 rounded-md overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                         {item.image ? 
                            <Image src={item.image} alt={item.title || 'Foto do casal'} width={200} height={300} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-zinc-700"></div>
                         }
                    </div>
                </div>
            ))}
        </div>
    </div>
);


export function NetflixDeAmorPage({ data, isPreview = false }: NetflixDeAmorPageProps) {
    if (!data) return null;
    const [showVideo, setShowVideo] = React.useState(false);
    
    const videoId = React.useMemo(() => {
        if (data.heroType !== 'video' || !data.heroVideoUrl) return null;
        try {
            const url = new URL(data.heroVideoUrl);
            if (url.hostname === 'youtu.be') return url.pathname.slice(1);
            if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
                return url.searchParams.get('v');
            }
            return null;
        } catch (error) { return null; }
    }, [data.heroType, data.heroVideoUrl]);

    const handlePlay = () => {
        if((data.heroType === 'video' && videoId) || data.heroType === 'upload') {
            setShowVideo(true);
        }
    }


    return (
        <div className="bg-[#141414] text-white min-h-screen">
            {showVideo && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                    {data.heroType === 'video' && videoId && (
                         <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                    {data.heroType === 'upload' && data.heroVideoUrl && (
                        <video
                            src={data.heroVideoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                    )}
                     <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 z-50" onClick={() => setShowVideo(false)}>
                        <X className="w-6 h-6"/>
                    </Button>
                </div>
            )}
            
             <header className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6">
                <div className="flex items-center justify-center">
                   <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={80} height={80} className="w-20 h-20" />
                </div>
            </header>
            
            <main className={isPreview ? 'scrollbar-hide' : ''}>
                {/* Hero Section */}
                <div className="relative h-[60vh] md:h-[80vh] w-full">
                    <div className="absolute inset-0">
                        {data.heroType === 'image' && data.heroImage ? (
                            <Image src={data.heroImage} alt="Hero image" layout="fill" objectFit="cover" className="opacity-60" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                {(data.heroType === 'video' || data.heroType === 'upload') && (
                                    <Play className="w-24 h-24 text-zinc-600"/>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent"></div>
                    <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-10 text-left">
                         <div className="flex items-center gap-2">
                             <Image src="https://i.imgur.com/YWU5u37.png" alt="Netflix N Logo" width={20} height={36} className="w-4 h-7 md:w-5 md:h-9" />
                            <span className="text-base tracking-[0.2em] text-zinc-300 font-semibold">FILME</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter max-w-2xl mt-2" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>{data.heroTitle}</h1>
                        <p className="mt-4 max-w-xl text-base md:text-lg text-zinc-200">{data.heroDescription}</p>
                        <div className="flex items-center gap-4 mt-6">
                            <Button size="lg" className="bg-white text-black hover:bg-white/80" onClick={handlePlay}>
                                <Play className="w-6 h-6 mr-2 fill-black" />
                                Assistir
                            </Button>
                            <Button size="lg" variant="secondary" className="bg-zinc-700/80 text-white hover:bg-zinc-700/60">
                                <Info className="w-6 h-6 mr-2" />
                                Mais Informações
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="py-8 -mt-20 md:-mt-32 relative z-20">
                    {data.categories?.map((category: any, index: number) => (
                        <CategoryRow key={index} category={category} />
                    ))}
                </div>
            </main>
        </div>
    );
}
