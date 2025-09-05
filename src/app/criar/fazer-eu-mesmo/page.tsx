
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Calendar } from "@/components/ui/calendar";
import { PagePreview } from "@/components/app/PagePreview";
import {
  ArrowLeft,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Image as ImageIcon,
  Loader2,
  Paintbrush,
  Sparkles,
  Youtube,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suggestSentimentEnhancements } from "@/ai/flows/suggest-sentiment-enhancements";
import { generateUniqueBackground } from "@/ai/flows/generate-unique-background";

const formSchema = z.object({
  name1: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  name2: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  startDate: z.date({
    required_error: "A data de início é obrigatória.",
  }),
  message: z
    .string()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
    .max(1000, "A mensagem não pode ter mais de 1000 caracteres."),
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
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [isBgLoading, setIsBgLoading] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: "",
      name2: "",
      startDate: undefined,
      message: "",
      images: [],
      musicUrl: "",
      background: "linear-gradient(to right, #1e1b4b, #1e1b4b)",
      backgroundPrompt: "",
    },
  });

  const watchedData = form.watch();

  async function handleEnhanceMessage() {
    const currentMessage = form.getValues("message");
    if (!currentMessage || currentMessage.length < 10) {
      toast({
        variant: "destructive",
        title: "Mensagem muito curta",
        description: "Escreva uma mensagem com pelo menos 10 caracteres para a IA poder melhorar.",
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await suggestSentimentEnhancements({ text: currentMessage });
      form.setValue("message", result.enhancedText, { shouldValidate: true });
      toast({
        title: "Mensagem Melhorada!",
        description: "Sua mensagem foi aprimorada pela IA.",
      });
    } catch (error) {
      console.error("Error enhancing message:", error);
      toast({
        variant: "destructive",
        title: "Erro na IA",
        description: "Não foi possível melhorar a mensagem. Tente novamente.",
      });
    } finally {
      setIsAiLoading(false);
    }
  }

  async function handleGenerateBackground() {
    const backgroundPrompt = form.getValues("backgroundPrompt");
    if (!backgroundPrompt || backgroundPrompt.length < 5) {
        toast({
            variant: "destructive",
            title: "Descrição curta demais",
            description: "Descreva o fundo com pelo menos 5 caracteres."
        });
        return;
    }

    setIsBgLoading(true);
    try {
        const result = await generateUniqueBackground({ backgroundDescription: backgroundPrompt });
        form.setValue("background", result.backgroundImageDataUri, { shouldValidate: true });
        toast({
            title: "Fundo gerado!",
            description: "Um novo fundo exclusivo foi criado pela IA."
        });
    } catch(error) {
        console.error("Error generating background:", error);
        toast({
            variant: "destructive",
            title: "Erro ao gerar fundo",
            description: "Não foi possível gerar o fundo. Tente novamente."
        });
    } finally {
        setIsBgLoading(false);
    }
  }


  function onSubmit(data: FormData) {
    console.log(data);
    toast({
      title: "Página Salva!",
      description: "Sua página foi salva com sucesso. (Simulação)",
    });
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-secondary/30">
      {/* Form Section */}
      <aside className="w-full lg:w-1/3 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto h-screen">
        <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon">
                <ArrowLeft />
             </Button>
            <div>
                <h1 className="text-2xl font-bold">Estúdio de Criação</h1>
                <p className="text-muted-foreground">Preencha os campos e veja a mágica acontecer.</p>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Names */}
            <Card>
              <CardHeader>
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Nomes</FormLabel>
                  <FormDescription>
                    Quem são as estrelas desta história?
                  </FormDescription>
                </FormItem>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Maria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Pessoa Amada</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Start Date */}
            <Card>
              <CardHeader>
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Data Especial</FormLabel>
                  <FormDescription>
                    Quando tudo começou?
                  </FormDescription>
                </FormItem>
              </CardHeader>
              <CardContent>
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
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                new Date(field.value).toLocaleDateString('pt-BR')
                              ) : (
                                <span>Escolha a data</span>
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
              </CardContent>
            </Card>
            
            {/* Message */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                             <FormLabel className="text-lg font-semibold">Sua Mensagem</FormLabel>
                            <FormDescription>
                                Escreva com o coração (ou peça ajuda para a IA).
                            </FormDescription>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={handleEnhanceMessage} disabled={isAiLoading}>
                                        {isAiLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Melhorar com IA</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent>
                     <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Escreva sua mensagem aqui..."
                              className="resize-none"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
            </Card>

            {/* Images */}
            <Card>
                <CardHeader>
                    <FormLabel className="text-lg font-semibold">Memórias</FormLabel>
                    <FormDescription>
                        Adicione até 8 fotos que contam a sua história.
                    </FormDescription>
                </CardHeader>
                <CardContent>
                     <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                 <FormControl>
                                    <Input 
                                        type="file" 
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            const imageUrls = files.map(file => URL.createObjectURL(file));
                                            field.onChange(imageUrls);
                                        }}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                </FormControl>
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">Clique para adicionar imagens</p>
                                    </div>
                                </label>
                                {watchedData.images && watchedData.images.length > 0 && (
                                    <div className="mt-4 grid grid-cols-4 gap-2">
                                        {watchedData.images.map((img, i) => (
                                            <img key={i} src={img} className="rounded-md aspect-square object-cover" />
                                        ))}
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Music */}
             <Card>
                <CardHeader>
                    <FormLabel className="text-lg font-semibold">Trilha Sonora</FormLabel>
                    <FormDescription>Cole uma URL do YouTube para adicionar música.</FormDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                      control={form.control}
                      name="musicUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                             <div className="relative">
                                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
            </Card>

             {/* Background */}
            <Card>
                 <CardHeader>
                    <FormLabel className="text-lg font-semibold">Fundo da Página</FormLabel>
                    <FormDescription>Use a IA para gerar um fundo único.</FormDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                      control={form.control}
                      name="backgroundPrompt"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descreva o fundo dos seus sonhos</FormLabel>
                          <FormControl>
                             <div className="relative">
                                <Paintbrush className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input placeholder="Ex: Uma galáxia com tons de rosa e roxo" {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button onClick={handleGenerateBackground} disabled={isBgLoading} className="w-full">
                        {isBgLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Gerar Fundo com IA
                    </Button>
                </CardContent>
            </Card>


            <Button type="submit" className="w-full" size="lg">Salvar Página</Button>
          </form>
        </Form>
      </aside>

      {/* Preview Section */}
      <main className="w-full lg:w-2/3 p-4 sticky top-0 h-screen hidden lg:block">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-foreground/10">
            <PagePreview data={watchedData} />
        </div>
      </main>
    </div>
  );
}
