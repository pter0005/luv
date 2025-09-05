
"use client";

import * as React from "react";
import Image from "next/image";
import { intervalToDuration, formatDuration, format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import * as z from "zod";
import { Heart, Music } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(2, "Please enter a title."),
  startDate: z.date({ required_error: "A date is required." }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must be 1000 characters or less."),
  images: z
    .array(z.string())
    .max(8, "You can upload up to 8 images.")
    .optional(),
  musicUrl: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  background: z
    .string()
    .default("linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)"),
  backgroundPrompt: z.string().optional(),
});

type PageData = z.infer<typeof formSchema>;

interface PagePreviewProps {
  data: PageData;
}

export function PagePreview({ data }: PagePreviewProps) {
  const [duration, setDuration] = React.useState<string>("");

  React.useEffect(() => {
    if (!data.startDate) {
        setDuration('');
        return;
    };

    const calculateDuration = () => {
      try {
        const d = intervalToDuration({
          start: new Date(data.startDate),
          end: new Date(),
        });
        
        let formattedDuration = formatDuration(d, {
          format: ["years", "months", "days", "hours", "minutes", "seconds"],
          delimiter: ', ',
          locale: ptBR,
        });

        // Replace last comma with 'e'
        const lastCommaIndex = formattedDuration.lastIndexOf(',');
        if (lastCommaIndex !== -1) {
            formattedDuration = formattedDuration.substring(0, lastCommaIndex) + ' e' + formattedDuration.substring(lastCommaIndex + 1);
        }

        setDuration(formattedDuration);

      } catch (error) {
        setDuration('');
      }
    };

    calculateDuration();
    const timer = setInterval(calculateDuration, 1000);
    return () => clearInterval(timer);
  }, [data.startDate]);

  const backgroundStyle = {
    background: data.background.startsWith('data:image') ? `url(${data.background})` : data.background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col">
        {/* Browser Header */}
        <div className="flex-shrink-0 bg-zinc-800 p-3 flex items-center gap-2 border-b border-zinc-700">
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-grow bg-zinc-900 rounded-md px-3 py-1 text-sm text-zinc-400 text-center">
                https://luv.com/p/{data.title || 'pagina'}
            </div>
        </div>

        {/* Page Content */}
        <div
            className="flex-grow text-white p-8 flex flex-col items-center justify-center text-center relative overflow-auto"
            style={backgroundStyle}
        >
            <div className="absolute inset-0 bg-black/50 z-0" />
            <div className="relative z-10 w-full">

                {data.musicUrl && (
                <audio src={data.musicUrl} autoPlay loop>
                    Your browser does not support the audio element.
                </audio>
                )}

                <div className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-display font-bold">
                  <h1 className="text-4xl font-bold text-red-600">{data.title || "Titulo da pagina"}</h1>
                </div>

                {data.startDate && (
                  <p className="font-semibold text-lg mt-4 text-zinc-300">
                    Juntos desde {format(new Date(data.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                )}

                {duration && (
                <div className="mt-4 text-zinc-200">
                    <p className="text-sm tracking-wider">{duration}</p>
                </div>
                )}

                <p className="mt-8 text-lg italic max-w-2xl mx-auto text-zinc-100">
                {data.message || "Sua mensagem especial aparecerá aqui."}
                </p>

                {data.images && data.images.length > 0 && (
                <Carousel className="w-full max-w-xs md:max-w-sm lg:max-w-md mx-auto mt-8">
                    <CarouselContent>
                    {data.images.map((src, index) => (
                        <CarouselItem key={index}>
                        <Card className="bg-transparent border-0 shadow-none">
                            <CardContent className="flex aspect-square items-center justify-center p-0">
                            <Image
                                src={src}
                                alt={`Memory ${index + 1}`}
                                width={400}
                                height={400}
                                className="rounded-lg object-cover w-full h-full"
                                data-ai-hint="couple photo"
                            />
                            </CardContent>
                        </Card>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-white bg-black/30 hover:bg-black/50 border-white/20" />
                    <CarouselNext className="text-white bg-black/30 hover:bg-black/50 border-white/20" />
                </Carousel>
                )}
            </div>
        </div>
    </div>
  );
}

    