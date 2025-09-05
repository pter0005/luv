
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { PagePreview } from "@/components/app/PagePreview";
import {
  ArrowLeft,
  CalendarIcon,
  ChevronRight,
  ImageIcon,
  Loader2,
  Music,
  Paintbrush,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suggestSentimentEnhancements } from "@/ai/flows/suggest-sentiment-enhancements";
import { generateUniqueBackground } from "@/ai/flows/generate-unique-background";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres."),
  startDate: z.date({
    required_error: "A data de início é obrigatória.",
  }).optional(),
  message: z
    .string()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
    .max(1000, "A mensagem não pode ter mais de 1000 caracteres.").optional(),
  images: z
    .array(z.string())
    .max(8, "Você pode enviar no máximo 8 imagens.")
    .optional(),
  musicUrl: z
    .string()
    .url("Por favor, insira uma URL do YouTube válida.")
    .optional()
    .or(z.literal("")),
  background: z
    .string()
    .default("linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)"),
  backgroundPrompt: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatorStudioPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 1;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      images: [],
      musicUrl: "",
      background: "#000",
      backgroundPrompt: "",
    },
  });

  const watchedData = form.watch();

  function onSubmit(data: FormData) {
    console.log(data);
    toast({
      title: "Página Salva!",
      description: "Sua página foi salva com sucesso. (Simulação)",
    });
  }

  const stepsContent = [
    {
        title: "Título da página",
        description: "Escreva o título dedicatório para a página. Ex: João & Maria ou Feliz Aniversário ou etc!",
    }
  ]
  
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
            <div className="space-y-4 mt-6">
               <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Escreva o titulo dedicatório para a página. Ex: João & Maria ou Feliz Aniversário ou etc!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        )
      default:
        return null;
    }
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#111111] text-white">
      {/* Form Section */}
      <aside className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
            
            <div className="mb-8">
                <Progress value={(currentStep / totalSteps) * 100} className="bg-zinc-700 h-2 [&>div]:bg-white" />
                <p className="text-right text-sm text-muted-foreground mt-2">{currentStep}/{totalSteps}</p>
            </div>

            <div>
                <h2 className="text-3xl font-bold">{stepsContent[currentStep-1].title}</h2>
                <p className="text-muted-foreground mt-2">{stepsContent[currentStep-1].description}</p>
            </div>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {renderStep()}
                
                    <div className="flex items-center gap-4 mt-8">
                        <Button variant="secondary" onClick={handlePrevStep} disabled={currentStep === 1} className="w-full bg-zinc-800 hover:bg-zinc-700">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar etapa
                        </Button>
                        {currentStep < totalSteps ? (
                            <Button onClick={handleNextStep} className="w-full bg-red-600 hover:bg-red-700">
                                Próxima etapa
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                             <Button type="submit" size="lg" className="w-full bg-red-600 hover:bg-red-700">Salvar e Obter Link</Button>
                        )}
                    </div>
                
            </form>
            </Form>
        </div>
      </aside>

      {/* Preview Section */}
      <main className="w-full lg:w-1/2 p-4 hidden lg:flex items-center justify-center bg-black">
        <div className="w-full h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-zinc-800">
            <PagePreview data={watchedData} />
        </div>
      </main>
    </div>
  );
}

    
