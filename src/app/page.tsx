"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Heart,
  ImageIcon,
  Music,
  Sparkles,
  UploadCloud,
  X,
  QrCode,
  Star,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

import { suggestSentimentEnhancements } from "@/ai/flows/suggest-sentiment-enhancements";
import { generateUniqueBackground } from "@/ai/flows/generate-unique-background";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagePreview } from "@/components/app/PagePreview";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name1: z.string().min(2, "Please enter a name."),
  name2: z.string().min(2, "Please enter a name."),
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

type FormData = z.infer<typeof formSchema>;

export default function CreatorPage() {
  const { toast } = useToast();
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [isSentimentDialogOpen, setIsSentimentDialogOpen] = React.useState(false);
  const [isBgLoading, setIsBgLoading] = React.useState(false);
  const [isSentimentLoading, setIsSentimentLoading] = React.useState(false);
  const [sentimentSuggestion, setSentimentSuggestion] = React.useState("");
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: "",
      name2: "",
      message: "",
      images: [],
      musicUrl: "",
      background: "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
      backgroundPrompt: "",
    },
  });

  function onSubmit(values: FormData) {
    console.log(values);
    setIsPreviewOpen(true);
  }

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
                Shall we start?
              </span>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Declare your love <span className="text-primary">for your love</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Create a personalized page for the one you love and surprise them with a special declaration that will last forever.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" className="text-lg py-7">
                <Heart className="mr-2 h-5 w-5" />
                Create my page
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-x-4">
               <div className="flex -space-x-2 overflow-hidden">
                  <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://picsum.photos/32/32?random=1" alt="User 1" width={32} height={32} data-ai-hint="person"/>
                  <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://picsum.photos/32/32?random=2" alt="User 2" width={32} height={32} data-ai-hint="person"/>
                  <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://picsum.photos/32/32?random=3" alt="User 3" width={32} height={32} data-ai-hint="person"/>
                  <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://picsum.photos/32/32?random=4" alt="User 4" width={32} height={32} data-ai-hint="person"/>
                </div>
              <div className="flex flex-col items-start">
                  <div className="flex gap-0.5">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-400">Over 40,000 satisfied users</p>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="https://picsum.photos/384/512"
                  alt="App screenshot"
                  width={384}
                  height={512}
                  className="w-[24rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                  data-ai-hint="couple smiling"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Your Page is Ready!</DialogTitle>
            <DialogDescription>
              Here is a preview of your beautiful creation. Share it with your special someone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto px-6">
            <PagePreview data={form.getValues()} />
          </div>
          <DialogFooter className="p-6 pt-0 bg-background border-t">
            <div className="w-full grid md:grid-cols-2 gap-4 items-center">
              <div>
                <Label>Shareable Link</Label>
                <Input value="https://foreveryours.app/..." readOnly />
              </div>
              <div className="flex flex-col items-center justify-center">
                <Label>QR Code</Label>
                <div className="p-2 border rounded-lg bg-white mt-1">
                  <QrCode className="w-24 h-24 text-black" />
                </div>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}