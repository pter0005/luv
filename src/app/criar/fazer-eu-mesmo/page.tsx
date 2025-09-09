
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  ArrowLeft,
  ChevronRight,
  Upload,
  X as XIcon,
  Search,
  Check,
  Loader,
  Sparkles,
  Mic,
  MicOff,
  Play,
  Pause,
  Eye,
  Puzzle,
  FileText,
  Gem,
  LogIn
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Editor } from "@/components/ui/editor";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { findYoutubeVideo } from "@/ai/flows/find-youtube-video";
import { useDebounce } from "@/hooks/use-debounce";
import { HeartsBackground } from "@/components/app/HeartsBackground";
import { StarsBackground } from "@/components/app/StarsBackground";
import { ColoredStarsBackground } from "@/components/app/ColoredStarsBackground";
import { VortexBackground } from "@/components/app/VortexBackground";
import { savePageData } from "@/actions/page";
import { useRouter } from "next/navigation";
import { PagePreview } from "@/components/app/PagePreview";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JigsawPuzzle } from "@/components/app/JigsawPuzzle";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  titleColor: z.string().optional(),
  message: z.string().optional(),
  messageFontSize: z.string().optional(),
  startDate: z.date().optional(),
  dateDisplayType: z.string().optional(),
  photos: z.array(z.string()).optional(),
  photoDisplayType: z.string().optional(),
  musicChoice: z.string().optional(),
  musicUrl: z.string().url("URL inválida.").optional().or(z.literal('')),
  customAudio: z.string().optional().or(z.literal('')),
  backgroundAnimation: z.string().optional(),
  heartColor: z.string().optional(),
  loveLightColor: z.string().optional(),
  unlockType: z.string().optional(),
  puzzleImage: z.string().optional().or(z.literal('')),
  puzzleTitle: z.string().optional(),
  puzzleDescription: z.string().optional(),
  contactName: z.string().min(1, "O nome é obrigatório.").refine(s => s.trim().split(' ').length >= 2, {
    message: "Por favor, insira nome e sobrenome."
  }),
  contactEmail: z.string().email("Email inválido.").min(1, "O e-mail é obrigatório."),
  contactDoc: z.string().min(11, "O CPF/CNPJ é obrigatório."),
  plan: z.string().min(1, "Você deve escolher uma opção."),
});

export type FormData = z.infer<typeof formSchema>;

const PreviewContent = ({ data }: { data: Partial<FormData> }) => (
  <div className="relative w-full h-full group/preview">
    <div className="relative z-10 w-full h-full bg-zinc-950 rounded-2xl flex flex-col shadow-2xl">
      <div className="bg-zinc-800 rounded-t-lg p-2 flex items-center gap-1.5 border-b border-zinc-700">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-grow bg-zinc-700 rounded-sm px-2 py-1 text-xs text-zinc-400 text-center truncate">
            https://luv.com/p/{data.title?.toLowerCase().replace(/\s/g, '-') || 'pagina'}
        </div>
      </div>
      <div className="flex-grow bg-black rounded-b-lg overflow-hidden relative">
        <PagePreview data={data} />
      </div>
    </div>
  </div>
);

// Helper function to compress and resize images
const processImage = (file: File, maxSize = 1280): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let { width, height } = img;

                if (width > height) {
                    if (width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/webp', 0.8)); // Compress to WebP with 80% quality
            };
            img.onerror = (error) => {
                reject(error);
            };
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};


function CreatorStudioPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 8;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const puzzleFileInputRef = React.useRef<HTMLInputElement>(null);

  const [musicSearchQuery, setMusicSearchQuery] = React.useState("");
  const debouncedMusicSearchQuery = useDebounce(musicSearchQuery, 500);
  const [musicSearchResult, setMusicSearchResult] = React.useState<{ title: string; videoId: string } | null>(null);
  const [isSearchingMusic, setIsSearchingMusic] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      photos: [],
      photoDisplayType: "Cards",
      titleColor: "#FFFFFF",
      messageFontSize: "text-base",
      dateDisplayType: "padrão",
      musicChoice: "none",
      musicUrl: "",
      customAudio: "",
      backgroundAnimation: "none",
      heartColor: "purple",
      loveLightColor: "purple",
      unlockType: "instant",
      puzzleImage: "",
      puzzleTitle: "Um Quebra-Cabeça Especial",
      puzzleDescription: "Resolva o enigma para revelar a surpresa!",
      contactName: "",
      contactEmail: "",
      contactDoc: "",
      plan: "essencial",
    },
  });

  const watchedData = form.watch();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          form.setValue('customAudio', base64Audio);
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({ title: "Gravação iniciada!" });
    } catch (err) {
      toast({ variant: 'destructive', title: "Erro ao gravar", description: "Não foi possível acessar o microfone." });
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: "Gravação finalizada!", description: "Sua mensagem foi salva."});
    }
  };


  React.useEffect(() => {
    const handleMusicSearch = async () => {
        if (!debouncedMusicSearchQuery) {
            setMusicSearchResult(null);
            return;
        };
        setIsSearchingMusic(true);
        setMusicSearchResult(null);
        try {
            const result = await findYoutubeVideo({ songDescription: debouncedMusicSearchQuery });
            if (result && result.videoId) {
                setMusicSearchResult(result);
            } else {
                toast({
                    variant: "destructive",
                    title: "Música não encontrada",
                    description: "Não foi possível encontrar um vídeo para a sua busca. Tente com outros termos."
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro na busca",
                description: "Ocorreu um erro ao buscar a música. Tente novamente."
            })
        } finally {
            setIsSearchingMusic(false);
        }
    };

    if (watchedData.musicChoice === 'youtube') {
      handleMusicSearch();
    }
  }, [debouncedMusicSearchQuery, toast, watchedData.musicChoice]);


  const selectMusic = () => {
    if (musicSearchResult) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${musicSearchResult.videoId}`;
      form.setValue("musicUrl", youtubeUrl);
      toast({
        title: "Música selecionada!",
        description: musicSearchResult.title,
      })
    }
  };


  async function onSubmit(data: FormData) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Usuário não autenticado",
            description: "Por favor, faça login para criar uma página.",
        });
        return;
    }
    setIsSubmitting(true);
    try {
        const pageId = await savePageData(data as any, user.uid);
        
        if (data.plan === 'essencial') {
            toast({
              title: "Página salva com sucesso!",
              description: "Você será redirecionado para a tela de pagamento.",
            });
            router.push(`/criar/sucesso/${pageId}?doc=${encodeURIComponent(data.contactDoc)}`);
        } else {
             toast({
              title: "Solicitação enviada!",
              description: "Seu pedido de orçamento foi enviado com sucesso.",
            });
            router.push(`/criar/sucesso-orcamento`);
        }
    } catch (error) {
      console.error("Failed to process page:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar página",
        description: "Não foi possível salvar sua página. Tente novamente.",
      });
      setIsSubmitting(false);
    }
  }

  const steps = [
    {
      name: "title" as const,
      title: "Título da página",
      description: "Escreva o título dedicatório. Ex: João & Maria, Feliz Aniversário, etc.",
    },
    {
      name: "message" as const,
      title: "Mensagem",
      description: "Escreva uma mensagem especial. Seja criativo e demonstre seu carinho.",
    },
    {
      name: "startDate" as const,
      title: "Data Especial",
      description: "Informe a data que simboliza o início de uma união ou um momento marcante.",
    },
    {
      name: "photos" as const,
      title: "Fotos",
      description: "Anexe até 8 fotos e escolha o modo de exibição para personalizar a galeria.",
    },
    {
      name: "musicChoice" as const,
      title: "Música Dedicada",
      description: "Escolha uma trilha sonora para sua página ou grave uma mensagem de voz.",
    },
    {
      name: "backgroundAnimation" as const,
      title: "Animação de Fundo",
      description: "Escolha uma animação para o fundo da página para um toque especial.",
    },
    {
      name: "unlockType" as const,
      title: "Modo de Revelação",
      description: "Escolha como a pessoa irá descobrir o conteúdo da página.",
    },
    {
      name: "contactName" as const,
      title: "Finalização",
      description: "Preencha seus dados para finalizar e escolher o tipo de criação.",
    },
  ];

  const handleNextStep = async () => {
    const currentField = steps[currentStep - 1].name;
    let fieldsToValidate: (keyof FormData)[] = [currentField];
    
    if (currentField === 'contactName') {
        fieldsToValidate = ['contactName', 'contactEmail', 'contactDoc', 'plan'];
    }

    if (currentField === 'musicChoice') {
      const choice = form.getValues('musicChoice');
      if (choice === 'none') {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
        return;
      }
      if (choice === 'youtube') {
         fieldsToValidate.push('musicUrl');
      }
       if (choice === 'custom') {
         fieldsToValidate.push('customAudio');
      }
    }
    
    if (currentField === 'unlockType') {
      const choice = form.getValues('unlockType');
      if (choice === 'puzzle') {
        fieldsToValidate.push('puzzleImage');
        fieldsToValidate.push('puzzleTitle');
        fieldsToValidate.push('puzzleDescription');
      }
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const currentPhotos = form.getValues("photos") || [];
      if (currentPhotos.length + files.length > 8) {
        toast({
            variant: "destructive",
            title: "Limite de fotos excedido!",
            description: "Você pode adicionar no máximo 8 fotos."
        })
        return;
      }

      toast({ title: 'Processando imagens...', description: 'Aguarde um momento.'});
      const newPhotosPromises = Array.from(files).map(file => processImage(file));
      try {
        const newPhotos = await Promise.all(newPhotosPromises);
        form.setValue("photos", [...currentPhotos, ...newPhotos]);
        toast({ title: 'Imagens adicionadas com sucesso!' });
      } catch (error) {
        console.error("Error processing images:", error);
        toast({ variant: "destructive", title: "Erro ao processar imagem", description: "Houve um problema ao otimizar uma das imagens." });
      }
    }
  };
  
  const handlePuzzleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: 'Processando imagem...', description: 'Aguarde um momento.'});
      try {
        const processedImage = await processImage(file);
        form.setValue("puzzleImage", processedImage);
        toast({ title: 'Imagem do quebra-cabeça adicionada!' });
      } catch (error) {
         console.error("Error processing puzzle image:", error);
         toast({ variant: "destructive", title: "Erro ao processar imagem", description: "Houve um problema ao otimizar a imagem." });
      }
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = form.getValues("photos") || [];
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    form.setValue("photos", updatedPhotos);
  };
  
 const animationOptions = [
    { value: 'none', label: 'Nenhuma'},
    { value: 'hearts', label: 'Chuva de Corações'},
    { value: 'stars', label: 'Céu Estrelado'},
    { value: 'colored-stars', label: 'Pontos Coloridos'},
    { value: 'mystic-fog', label: 'Névoa Mística'},
    { value: 'vortex', label: 'Vórtice Púrpura'},
  ];

  if (authLoading) {
    return <div className="w-full h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-bold mb-4 font-display">Acesso Restrito</h2>
        <p className="text-muted-foreground mb-8 max-w-md">Você precisa estar logado para criar uma página. Faça login ou crie uma conta para continuar.</p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg">
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          </Link>
           <Link href="/cadastro">
            <Button size="lg" variant="outline">
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse md:grid md:grid-cols-2 w-full min-h-screen">
      {/* Form Section */}
      <div className="w-full flex flex-col items-center p-4 md:p-8 bg-card md:bg-transparent rounded-t-3xl md:rounded-none order-2 md:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <p className="mt-2 text-right text-sm text-muted-foreground">{currentStep}/{totalSteps}</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">{steps[currentStep - 1].title}</h2>
            <p className="mt-2 text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
          
           <div className="flex items-center gap-4 my-8">
              <Button type="button" variant="secondary" onClick={handlePrevStep} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNextStep} className="w-full">
                  Próxima Etapa
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" size="lg" className="w-full" form="main-form" disabled={isSubmitting}>
                  {isSubmitting ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin"/>
                  ) : (
                      watchedData.plan === 'orcamento' ? 'Solicitar Orçamento' : 'Finalizar e Pagar'
                  )}
                </Button>
              )}
            </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="main-form" className="mt-8 space-y-8">
              <div className="min-h-[350px]">
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: João & Maria ou Feliz Aniversário" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="titleColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor do título</FormLabel>
                           <FormControl>
                              <div className="relative flex items-center gap-4">
                                   <input
                                      type="color"
                                      value={field.value}
                                      onChange={e => field.onChange(e.target.value)}
                                      className="h-10 w-14 cursor-pointer appearance-none border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0"
                                  />
                                  <span>Clique no quadrado para escolher uma cor</span>
                              </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-4">
                      <FormField
                          control={form.control}
                          name="messageFontSize"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Tamanho do Texto</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Selecione um tamanho" />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  <SelectItem value="text-sm">Pequeno</SelectItem>
                                  <SelectItem value="text-base">Padrão</SelectItem>
                                  <SelectItem value="text-lg">Médio</SelectItem>
                                  <SelectItem value="text-xl">Grande</SelectItem>
                                  <SelectItem value="text-2xl">Extra Grande</SelectItem>
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Sua Mensagem</FormLabel>
                              <FormControl>
                                  <Editor
                                      value={field.value || ""}
                                      onChange={field.onChange}
                                      placeholder="Escreva sua mensagem aqui..."
                                  />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="grid grid-cols-1 gap-8 items-start">
                      <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                              <FormItem className="flex flex-col items-center">
                              <FormControl>
                                  <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                      }
                                      initialFocus
                                      fromYear={1960}
                                      toYear={new Date().getFullYear()}
                                      captionLayout="dropdown-buttons"
                                  />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="dateDisplayType"
                          render={({ field }) => (
                              <FormItem className="space-y-3">
                              <FormLabel className="font-semibold">Modo de Exibição do Contador</FormLabel>
                              <FormControl>
                                  <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="grid grid-cols-2 gap-4"
                                  >
                                      <RadioGroupItem value="padrão" id="date-padrão">Padrão</RadioGroupItem>
                                      <RadioGroupItem value="classico" id="date-classico">Clássico</RadioGroupItem>
                                      <RadioGroupItem value="simples" id="date-simples">Simples</RadioGroupItem>
                                  </RadioGroup>
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="space-y-8">
                      <FormField
                          control={form.control}
                          name="photos"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Suas Fotos</FormLabel>
                                  <FormControl>
                                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                      onClick={() => fileInputRef.current?.click()}>
                                      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                                      <p className="font-semibold">Clique para adicionar fotos</p>
                                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (máx. 8 fotos)</p>
                                      <input
                                          type="file"
                                          ref={fileInputRef}
                                          multiple
                                          accept="image/*"
                                          onChange={handleFileChange}
                                          className="hidden"
                                      />
                                      </div>
                                  </FormControl>

                                  {field.value && field.value.length > 0 && (
                                      <div className="grid grid-cols-4 gap-4 mt-4">
                                      {(field.value || []).map((photo, index) => (
                                          <div key={index} className="relative group">
                                          <Image
                                              src={photo}
                                              alt={`Preview ${index}`}
                                              width={100}
                                              height={100}
                                              className="rounded-md object-cover w-full h-24"
                                          />
                                          <Button
                                              type="button"
                                              variant="destructive"
                                              size="icon"
                                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                              onClick={() => removePhoto(index)}
                                          >
                                              <XIcon className="h-4 w-4" />
                                          </Button>
                                          </div>
                                      ))}
                                      </div>
                                  )}
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="photoDisplayType"
                          render={({ field }) => (
                              <FormItem className="space-y-3">
                              <FormLabel className="font-semibold">Modo de Exibição da Galeria</FormLabel>
                              <FormControl>
                                  <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-2 gap-4"
                                  >
                                      <RadioGroupItem value="Coverflow" id="gallery-coverflow">Coverflow</RadioGroupItem>
                                      <RadioGroupItem value="Cards" id="gallery-cards">Cards</RadioGroupItem>
                                      <RadioGroupItem value="Flip" id="gallery-flip">Flip</RadioGroupItem>
                                      <RadioGroupItem value="Cube" id="gallery-cube">Cube</RadioGroupItem>
                                  </RadioGroup>
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                )}
                {currentStep === 5 && (
                   <FormField
                      control={form.control}
                      name="musicChoice"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel>Escolha a trilha sonora</FormLabel>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue('musicUrl', '');
                              form.setValue('customAudio', '');
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4"
                          >
                            <RadioGroupItem value="none" id="music-none">Nenhum Som</RadioGroupItem>
                            <RadioGroupItem value="custom" id="music-custom">Gravar Mensagem de Voz</RadioGroupItem>
                            <RadioGroupItem value="youtube" id="music-youtube">Usar Música do YouTube</RadioGroupItem>
                          </RadioGroup>
                          <FormMessage />

                           {watchedData.musicChoice === 'custom' && (
                            <div className="p-4 border rounded-md space-y-4">
                               <p className="text-sm text-muted-foreground">Grave uma mensagem de até 1 minuto.</p>
                                <div className="flex items-center justify-center gap-4">
                                    <Button type="button" onClick={startRecording} disabled={isRecording} size="lg">
                                        <Mic className="mr-2 h-5 w-5"/>
                                        Gravar
                                    </Button>
                                    <Button type="button" onClick={stopRecording} disabled={!isRecording} size="lg" variant="destructive">
                                        <MicOff className="mr-2 h-5 w-5"/>
                                        Parar
                                    </Button>
                                </div>
                                {isRecording && <p className="text-center text-primary animate-pulse">Gravando...</p>}
                                {watchedData.customAudio && !isRecording && (
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-sm text-green-400">Áudio gravado!</p>
                                        <audio src={watchedData.customAudio} controls className="w-full h-10"/>
                                    </div>
                                )}
                            </div>
                           )}

                          {watchedData.musicChoice === 'youtube' && (
                            <div className="p-4 border rounded-md space-y-4">
                              <FormLabel>Busque pela música</FormLabel>
                              <div className="relative">
                                <Input
                                  placeholder="Ex: Coldplay - A Sky Full of Stars"
                                  value={musicSearchQuery}
                                  onChange={(e) => setMusicSearchQuery(e.target.value)}
                                />
                                {isSearchingMusic && <Loader className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />}
                              </div>

                              {musicSearchResult && (
                                <div className="p-4 border rounded-md bg-secondary/50">
                                  <p className="font-semibold truncate">{musicSearchResult.title}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Button type="button" size="sm" onClick={selectMusic} className="w-full">
                                      <Check className="mr-2 h-4 w-4"/>
                                      Selecionar esta
                                    </Button>
                                    <Button type="button" size="sm" variant="outline" className="w-full" onClick={() => setMusicSearchResult(null)}>
                                      <XIcon className="mr-2 h-4 w-4"/>
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {watchedData.musicUrl && (
                                  <p className="text-sm text-green-400 p-2 bg-green-950/50 rounded-md">Música selecionada! Prossiga.</p>
                              )}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                )}
                {currentStep === 6 && (
                   <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="backgroundAnimation"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-semibold">Escolha a Animação</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                              {animationOptions.map(opt => (
                                <RadioGroupItem key={opt.value} value={opt.value} id={`bg-${opt.value}`} className="h-24 p-0 rounded-xl relative overflow-hidden group/item">
                                  <div className="absolute inset-0 w-full h-full">
                                        {opt.value === 'stars' && <div className="w-full h-full bg-black relative overflow-hidden"><StarsBackground/></div>}
                                        {opt.value === 'hearts' && <div className="w-full h-full bg-black relative overflow-hidden"><HeartsBackground color={watchedData.heartColor as 'purple' | 'red'} /></div>}
                                        {opt.value === 'colored-stars' && <div className="w-full h-full bg-black relative overflow-hidden"><ColoredStarsBackground /></div>}
                                        {opt.value === 'mystic-fog' && <div className="w-full h-full bg-black relative overflow-hidden">
                                            <div className="mystic-fog-1"></div>
                                            <div className="mystic-fog-2"></div>
                                        </div>}
                                        {opt.value === 'vortex' && <div className="w-full h-full bg-black relative overflow-hidden"><VortexBackground /></div>}
                                        {opt.value === 'none' && <div className="w-full h-full bg-card"></div>}
                                  </div>
                                  <div className="absolute inset-0 bg-black/40 group-hover/item:bg-black/20 transition-colors"></div>
                                  <div className="relative z-10 p-2 text-left w-full">
                                      <h2 className="font-semibold text-white drop-shadow-md">{opt.label}</h2>
                                  </div>
                                </RadioGroupItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchedData.backgroundAnimation === 'hearts' && (
                       <FormField
                          control={form.control}
                          name="heartColor"
                          render={({ field }) => (
                              <FormItem className="space-y-3">
                              <FormLabel className="font-semibold">Cor dos Corações</FormLabel>
                              <FormControl>
                                  <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="grid grid-cols-2 gap-4"
                                  >
                                      <RadioGroupItem value="purple" id="heart-purple">Roxo</RadioGroupItem>
                                      <RadioGroupItem value="red" id="heart-red">Vermelho</RadioGroupItem>
                                  </RadioGroup>
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                    )}
                  </div>
                )}
                {currentStep === 7 && (
                  <FormField
                      control={form.control}
                      name="unlockType"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel>Escolha o modo de revelação</FormLabel>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value === 'instant') {
                                form.setValue('puzzleImage', '');
                              }
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4"
                          >
                             <RadioGroupItem value="instant" id="unlock-instant">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-semibold">Revelação Instantânea</h3>
                                    <p className="text-xs text-muted-foreground">O conteúdo aparece assim que a pessoa abre a página.</p>
                                </div>
                            </RadioGroupItem>
                            <RadioGroupItem value="puzzle" id="unlock-puzzle">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-semibold">Quebra-Cabeça Interativo</h3>
                                    <p className="text-xs text-muted-foreground">A pessoa resolve um quebra-cabeça para revelar o conteúdo.</p>
                                </div>
                            </RadioGroupItem>
                          </RadioGroup>
                          <FormMessage />

                          {watchedData.unlockType === 'puzzle' && (
                             <div className="p-4 border rounded-md space-y-4">
                                <FormField
                                    control={form.control}
                                    name="puzzleTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Título do Quebra-Cabeça</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="puzzleDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição do Quebra-Cabeça</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="puzzleImage"
                                    render={({ field: imageField }) => (
                                        <FormItem>
                                            <FormLabel>Imagem do Quebra-Cabeça</FormLabel>
                                            <FormControl>
                                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                                onClick={() => puzzleFileInputRef.current?.click()}>
                                                <Puzzle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                                                <p className="font-semibold">Clique para escolher a imagem</p>
                                                <p className="text-xs text-muted-foreground">PNG ou JPG</p>
                                                <input
                                                    type="file"
                                                    ref={puzzleFileInputRef}
                                                    accept="image/png, image/jpeg"
                                                    onChange={handlePuzzleFileChange}
                                                    className="hidden"
                                                />
                                                </div>
                                            </FormControl>
                                            {imageField.value && (
                                                <div className="relative w-48 h-48 mx-auto">
                                                    <Image src={imageField.value} alt="Prévia do quebra-cabeça" layout="fill" objectFit="contain" className="rounded-md" />
                                                </div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full" disabled={!watchedData.puzzleImage}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver Prévia do Quebra-Cabeça
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl h-[80vh] p-0">
                                        {watchedData.puzzleImage && (
                                            <JigsawPuzzle 
                                                imageSrc={watchedData.puzzleImage} 
                                                onSolved={() => {}}
                                                title={watchedData.puzzleTitle}
                                                description={watchedData.puzzleDescription}
                                                isPreview
                                            />
                                        )}
                                    </DialogContent>
                                </Dialog>
                             </div>
                          )}
                        </FormItem>
                      )}
                    />
                )}
                {currentStep === 8 && (
                   <div className="space-y-4">
                      <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Seu Nome e Sobrenome</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Seu nome completo" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Seu E-mail de Contato</FormLabel>
                                  <FormControl>
                                      <Input placeholder="seu.email@exemplo.com" {...field} />
                                  </FormControl>
                                  <FormDescription>Essencial para o envio do link da sua página.</FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="contactDoc"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Seu CPF ou CNPJ</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Apenas números" {...field} />
                                  </FormControl>
                                   <FormDescription>Obrigatório para gerar o PIX.</FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="plan"
                          render={({ field }) => (
                              <FormItem className="space-y-3">
                              <FormLabel className="font-semibold">Qual o próximo passo?</FormLabel>
                              <FormControl>
                                  <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="grid grid-cols-1 gap-4"
                                  >
                                      <RadioGroupItem value="essencial" id="plan-essencial">
                                        <div className="flex items-start gap-4">
                                            <Gem className="w-6 h-6 text-primary mt-1" />
                                            <div>
                                                <h3 className="font-bold">Plano Essencial - R$14,99</h3>
                                                <p className="text-sm text-muted-foreground">Finalize com os recursos que você escolheu e pague para ativar a página.</p>
                                            </div>
                                        </div>
                                      </RadioGroupItem>
                                      <RadioGroupItem value="orcamento" id="plan-orcamento">
                                          <div className="flex items-start gap-4">
                                            <FileText className="w-6 h-6 text-primary mt-1" />
                                            <div>
                                                <h3 className="font-bold">Projeto Sob Medida</h3>
                                                <p className="text-sm text-muted-foreground">Envie sua criação para nós. Entraremos em contato para um orçamento personalizado.</p>
                                            </div>
                                        </div>
                                      </RadioGroupItem>
                                  </RadioGroup>
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>

       {/* Preview Section */}
       <div className="w-full h-auto md:h-screen p-4 md:p-8 bg-background md:sticky md:top-0 order-1 md:order-2 flex items-center justify-center">
          <div className="w-full h-full max-w-full md:max-w-xl aspect-auto md:aspect-[9/16] mx-auto">
              <PreviewContent data={watchedData} />
          </div>
      </div>
    </div>
  );
}

export default CreatorStudioPage;

    