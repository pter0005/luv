
"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(2, "Please enter a title."),
  startDate: z.date({ required_error: "A date is required." }).optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must be 1000 characters or less.").optional(),
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
                 <p className="mt-4 text-zinc-300">{data.message || ""}</p>
            </div>
        </div>
    </div>
  );
}
