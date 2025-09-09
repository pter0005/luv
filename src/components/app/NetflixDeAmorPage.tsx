
"use client";

import Image from "next/image";
import * as React from "react";
import { Play, Info } from "lucide-react";
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
        if (!data.heroVideoUrl) return null;
        try {
            const url = new URL(data.heroVideoUrl);
            if (url.hostname === 'youtu.be') return url.pathname.slice(1);
            if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
                return url.searchParams.get('v');
            }
            return null;
        } catch (error) { return null; }
    }, [data.heroVideoUrl]);

    const handlePlay = () => {
        if(data.heroType === 'video' && videoId) {
            setShowVideo(true);
        }
    }


    return (
        <div className="bg-[#141414] text-white min-h-screen">
            {showVideo && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                     <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80" onClick={() => setShowVideo(false)}>X</Button>
                </div>
            )}
            
            <main className={isPreview ? 'scrollbar-hide' : ''}>
                {/* Hero Section */}
                <div className="relative h-[60vh] md:h-[80vh] w-full">
                    <div className="absolute inset-0">
                        {data.heroType === 'image' && data.heroImage ? (
                            <Image src={data.heroImage} alt="Hero image" layout="fill" objectFit="cover" className="opacity-60" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                {data.heroType === 'video' && (
                                    <Play className="w-24 h-24 text-zinc-600"/>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20"></div>
                    <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-10 text-left">
                        <div className="flex items-center gap-2">
                             <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-8 md:w-6 md:h-10">
                                <path d="M14.2422 39.8438H23.5V0.46875H14.2422V13.8984L9.38281 4.71094V17.7656L0.59375 0.46875V39.8438H9.38281L18.4219 22.0312V39.8438H14.2422Z" fill="#E50914"/>
                            </svg>
                            <span className="text-lg tracking-[0.2em] text-zinc-300 font-semibold">FILME</span>
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
                <div className="py-8 -mt-20 relative z-20">
                    {data.categories?.map((category: any, index: number) => (
                        <CategoryRow key={index} category={category} />
                    ))}
                </div>
            </main>
        </div>
    );
}
