
"use client";

import * as React from "react";
import { format, intervalToDuration } from "date-fns";
import { ptBR } from 'date-fns/locale';
import * as z from "zod";

const formSchema = z.object({
  title: z.string(),
  message: z.string().optional(),
  startDate: z.date().optional(),
  dateDisplayType: z.string().optional(),
});

type PageData = z.infer<typeof formSchema>;

interface PagePreviewProps {
  data: PageData;
}

const Countdown = ({ startDate }: { startDate: Date }) => {
  const [duration, setDuration] = React.useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newDuration = intervalToDuration({ start: startDate, end: new Date() });
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

  return (
    <div className="text-center">
        <h2 className="font-display text-2xl mb-6">Compartilhando momentos há</h2>
        <div className="grid grid-cols-3 gap-4">
            {timeUnits.map(unit => (
                <div key={unit.label} className="bg-zinc-800/50 p-4 rounded-lg">
                    <div className="text-4xl font-bold">{String(unit.value).padStart(2, '0')}</div>
                    <div className="text-sm text-muted-foreground">{unit.label}</div>
                </div>
            ))}
        </div>
         <p className="mt-8 text-zinc-400 text-sm">
            Desde {format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
         </p>
    </div>
  )
}

export function PagePreview({ data }: PagePreviewProps) {
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
            className="flex-grow p-8 flex flex-col items-center justify-start text-center relative overflow-auto bg-black"
        >
            <div className="relative z-10 w-full">
                <h1 className="text-4xl font-handwriting text-red-600">{data.title || ""}</h1>
                
                {data.message && (
                    <div 
                        className="mt-12 text-zinc-300 whitespace-pre-wrap break-words prose dark:prose-invert" 
                        dangerouslySetInnerHTML={{ __html: data.message }} 
                    />
                )}

                {data.startDate && (
                     <div className="mt-8">
                        {data.dateDisplayType === "padrão" && <Countdown startDate={data.startDate} />}
                        {data.dateDisplayType === "classico" && <p>Estilo Clássico</p>}
                        {data.dateDisplayType === "simples" && (
                            <p className="text-zinc-300 text-lg">
                                Desde {format(data.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                        )}
                     </div>
                )}
            </div>
        </div>
    </div>
  );
}
