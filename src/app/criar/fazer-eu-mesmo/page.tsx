
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
import { PagePreview } from "@/components/app/PagePreview";
import {
  ArrowLeft,
  ChevronRight,
  Upload,
  X as XIcon,
  Search,
  Check,
  Loader,
  Sparkles,
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

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  titleColor: z.string().optional(),
  message: z.string().optional(),
  messageFontSize: z.string().optional(),
  startDate: z.date().optional(),
  dateDisplayType: z.string().optional(),
  photos: z.array(z.string()).optional(),
  photoDisplayType: z.string().optional(),
  musicUrl: z.string().url("URL inválida.").optional().or(z.literal('')),
  backgroundAnimation: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email inválido.").optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  plan: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatorStudioPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 8;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [musicSearchQuery, setMusicSearchQuery] = React.useState("");
  const debouncedMusicSearchQuery = useDebounce(musicSearchQuery, 500);
  const [musicSearchResult, setMusicSearchResult] = React.useState<{ title: string; videoId: string } | null>(null);
  const [isSearchingMusic, setIsSearchingMusic] = React.useState(false);


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
      musicUrl: "",
      backgroundAnimation: "none",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      plan: "forever",
    },
  });

  const watchedData = form.watch();

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

    handleMusicSearch();
  }, [debouncedMusicSearchQuery, toast]);


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


  function onSubmit(data: FormData) {
    console.log(data);
    toast({
      title: "Página Salva! (Simulação)",
      description: "Seus dados foram enviados com sucesso.",
    });
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
      name: "musicUrl" as const,
      title: "Música Dedicada",
      description: "Dedique uma música especial. Digite o nome da música e do artista.",
    },
    {
      name: "backgroundAnimation" as const,
      title: "Animação de Fundo",
      description: "Escolha uma animação para o fundo da página para um toque especial.",
    },
    {
      name: "contactName" as const, // Combined contact fields into one step
      title: "Informações de Contato",
      description: "Preencha para receber o link e QR code da sua página personalizada.",
    },
    {
      name: "plan" as const,
      title: "Escolha seu Plano",
      description: "Selecione o plano ideal para sua página e finalize a criação.",
    },
  ];

  const handleNextStep = async () => {
    const currentField = steps[currentStep - 1].name;
    let fieldsToValidate: (keyof FormData)[] = [currentField];
    
    if (currentField === 'contactName') {
        fieldsToValidate = ['contactName', 'contactEmail', 'contactPhone'];
    }

    if (currentField === 'musicUrl') {
        const musicUrl = form.getValues('musicUrl');
        if (musicUrl === '') {
             if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
             return;
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      const newPhotos: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            newPhotos.push(e.target.result);
            if (newPhotos.length === files.length) {
              form.setValue("photos", [...currentPhotos, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = form.getValues("photos") || [];
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    form.setValue("photos", updatedPhotos);
  };
  
  const animationOptions = [
    { value: 'none', label: 'Nenhuma', video: null, pro: false },
    { value: 'hearts', label: 'Chuva de corações', video: 'https://i.imgur.com/3Yw1h2Z.mp4', pro: false },
  ];


  return (
    <div className="grid w-full min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form Section */}
      <div className="flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <p className="mt-2 text-right text-sm text-muted-foreground">{currentStep}/{totalSteps}</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">{steps[currentStep - 1].title}</h2>
            <p className="mt-2 text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
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
                  <div className="space-y-4">
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
                    
                     <FormField
                      control={form.control}
                      name="musicUrl"
                      render={({ field }) => (
                          <FormItem>
                          {field.value && (
                              <p className="text-sm text-green-400 p-2 bg-green-950/50 rounded-md">Música selecionada! Prossiga para a próxima etapa.</p>
                          )}
                           <FormMessage />
                          </FormItem>
                      )}
                      />
                  </div>
                )}
                {currentStep === 6 && (
                   <FormField
                    control={form.control}
                    name="backgroundAnimation"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 lg:grid-cols-3 gap-4"
                          >
                            {animationOptions.map(opt => (
                              <RadioGroupItem key={opt.value} value={opt.value} id={`bg-${opt.value}`} className="h-24 p-0 rounded-xl relative overflow-hidden group/item">
                                <div className="absolute inset-0 w-full h-full">
                                    {opt.video ? (
                                        opt.video.endsWith('.mp4') ? (
                                        <video
                                            src={opt.video}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                        ) : (
                                        <Image src={opt.video} alt={opt.label} fill className="object-cover" />
                                        )
                                    ) : (
                                        <div className="w-full h-full bg-card"></div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 group-hover/item:bg-black/20 transition-colors"></div>
                                <div className="relative z-10 p-2 text-left w-full">
                                    <h2 className="font-semibold text-white drop-shadow-md">{opt.label}</h2>
                                    {opt.pro && (
                                        <div className="absolute top-1 right-1 bg-primary/80 text-primary-foreground text-xs font-semibold flex items-center rounded-full px-1.5 py-0.5">
                                            <Sparkles className="w-3 h-3 mr-1"/>
                                            PRO
                                        </div>
                                    )}
                                </div>
                              </RadioGroupItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {currentStep === 7 && (
                  <div className="space-y-4">
                      <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Seu Nome</FormLabel>
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
                                  <FormLabel>Seu E-mail</FormLabel>
                                  <FormControl>
                                      <Input placeholder="seu.email@exemplo.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="contactPhone"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Seu Telefone</FormLabel>
                                  <FormControl>
                                      <Input placeholder="(99) 99999-9999" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                )}
                {currentStep === 8 && (
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                          <FormLabel className="font-semibold">Selecione seu Plano</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-4"
                          >
                              <RadioGroupItem value="monthly" id="plan-monthly">
                                  <div className="font-bold">Mensal - R$20,00/mês</div>
                                  <div className="text-sm text-muted-foreground">Ideal para uma surpresa pontual.</div>
                              </RadioGroupItem>
                              <RadioGroupItem value="forever" id="plan-forever">
                                  <div className="font-bold">Para Sempre - R$34,99</div>
                                  <div className="text-sm text-muted-foreground">Acesso vitalício à sua obra de arte digital.</div>
                              </RadioGroupItem>
                              <RadioGroupItem value="custom" id="plan-custom">
                                  <div className="font-bold">Sob Medida - Consulte</div>
                                  <div className="text-sm text-muted-foreground">Para ideias que transcendem. Crie algo único.</div>
                              </RadioGroupItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              </div>
              <div className="flex items-center gap-4 mt-8">
                <Button type="button" variant="secondary" onClick={handlePrevStep} disabled={currentStep === 1} className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNextStep} className="w-full">
                    Próxima Etapa
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" size="lg" className="w-full">Salvar e Obter Link</Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Preview Section */}
      <div className="hidden lg:flex sticky top-0 items-center justify-center w-full h-screen p-8">
          <div className="w-full max-w-lg h-full bg-zinc-950 rounded-2xl flex flex-col shadow-2xl">
              <div className="bg-zinc-800 rounded-t-lg p-2 flex items-center gap-1.5 border-b border-zinc-700">
                  <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-grow bg-zinc-700 rounded-sm px-2 py-1 text-xs text-zinc-400 text-center truncate">
                      https://luv.com/p/{watchedData.title?.toLowerCase().replace(/\s/g, '-') || 'pagina'}
                  </div>
              </div>
              <div className="flex-grow bg-black rounded-b-lg overflow-hidden">
                  <PagePreview data={watchedData} />
              </div>
          </div>
      </div>
    </div>
  );
}

    