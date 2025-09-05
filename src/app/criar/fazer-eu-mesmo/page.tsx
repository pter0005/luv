
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import { Editor } from "@/components/ui/editor";

const formSchema = z.object({
  title: z.string(),
  message: z.string().optional(),
  startDate: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatorStudioPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
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
      name: "title" as const,
      title: "Título da página",
      description: "Escreva o título dedicatório para a página. Ex: João & Maria ou Feliz Aniversário ou etc!",
    },
    {
      name: "message" as const,
      title: "Mensagem",
      description: "Escreva uma mensagem especial. Seja criativo e demonstre todo seu carinho.",
    },
    {
      name: "startDate" as const,
      title: "Data de início",
      description: "Informe a data de início que simbolize o início de uma união, relacionamento, amizade, etc.",
    },
  ];

  const handleNextStep = async () => {
    const currentFieldName = stepsContent[currentStep - 1].name;
    const isValid = await form.trigger(currentFieldName);

    if (isValid && currentStep < totalSteps) {
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
            
             <h1 className="text-2xl font-bold text-red-500 mb-8">TITULO DA PAGINA</h1>
            
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
                <div className="space-y-4 mt-6">
                {currentStep === 1 && (
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
                )}
                {currentStep === 2 && (
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Editor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Escreva sua mensagem aqui..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
                {currentStep === 3 && (
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-zinc-800 border-none hover:bg-zinc-700 h-12",
                                    !field.value && "text-zinc-500"
                                  )}
                                >
                                  {field.value instanceof Date && !isNaN(field.value.getTime()) ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
                </div>
                
                    <div className="flex items-center gap-4 mt-8">
                        <Button type="button" variant="secondary" onClick={handlePrevStep} disabled={currentStep === 1} className="w-full bg-zinc-800 hover:bg-zinc-700">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar etapa
                        </Button>
                        {currentStep < totalSteps ? (
                            <Button type="button" onClick={handleNextStep} className="w-full bg-red-600 hover:bg-red-700">
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
