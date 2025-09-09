
"use client";

import Image from "next/image";
import { Play } from "lucide-react";
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

    return (
        <div className="bg-[#141414] text-white min-h-screen">
            <header className="absolute top-0 left-0 w-full p-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
                <div className="container mx-auto flex justify-between items-center">
                    <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20" />
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">{data.profileName}</span>
                         <Image src={`https://avatar.vercel.sh/${data.profileName || 'default'}.png`} alt="Profile" width={40} height={40} className="rounded-md w-8 h-8 md:w-10 md:h-10" />
                    </div>
                </div>
            </header>

            <main className={isPreview ? 'scrollbar-hide' : ''}>
                {/* Hero Section */}
                <div className="relative h-[60vh] md:h-[80vh] w-full">
                    <div className="absolute inset-0">
                        {data.heroImage ? (
                            <Image src={data.heroImage} alt="Hero image" layout="fill" objectFit="cover" className="opacity-60" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900"></div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20"></div>
                    <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-10 text-left">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter max-w-2xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>{data.heroTitle}</h1>
                        <p className="mt-4 max-w-xl text-base md:text-lg">{data.heroDescription}</p>
                        <Button size="lg" className="mt-6 bg-white text-black hover:bg-white/80 w-auto">
                            <Play className="w-6 h-6 mr-2 fill-black" />
                            Assistir
                        </Button>
                    </div>
                </div>

                {/* Categories */}
                <div className="py-8">
                    {data.categories?.map((category: any, index: number) => (
                        <CategoryRow key={index} category={category} />
                    ))}
                </div>
            </main>
        </div>
    );
}
