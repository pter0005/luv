
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, ChevronRight, Loader, LogIn, PlusCircle, Trash2, Upload, Video, Image as ImageIcon, FileVideo, Gem, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { savePageData, uploadVideo } from "@/actions/page";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { NetflixDeAmorPage } from "@/components/app/NetflixDeAmorPage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";


const categorySchema = z.object({
  title: z.string().min(1, "O título da categoria é obrigatório."),
  items: z.array(z.object({
    image: z.string().min(1, "A imagem é obrigatória."),
    title: z.string().optional(),
    description: z.string().optional(),
  })).min(1, "Adicione pelo menos uma imagem."),
});

const formSchema = z.object({
  template: z.literal("netflix-de-amor"),
  heroType: z.string().default("image"),
  heroImage: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  heroTitle: z.string().min(1, "O título de destaque é obrigatório."),
  heroDescription: z.string().min(1, "A sinopse é obrigatória."),
  categories: z.array(categorySchema).min(1, "Adicione pelo menos uma categoria."),
  plan: z.string().min(1, "Você deve escolher uma opção.").default("essencial"),
}).refine(data => {
    if (data.heroType === 'image') return !!data.heroImage;
    if (data.heroType === 'video') return !!data.heroVideoUrl;
    if (data.heroType === 'upload') return !!data.heroVideoUrl; // We use heroVideoUrl to store the uploaded URL too
    return false;
}, {
    message: "Você precisa fornecer uma imagem, um vídeo do YouTube ou anexar um vídeo.",
    path: ["heroType"],
});


export type NetflixFormData = z.infer<typeof formSchema>;

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
                    if (width > maxSize) { height = Math.round((height * maxSize) / width); width = maxSize; }
                } else {
                    if (height > maxSize) { width = Math.round((width * maxSize) / height); height = maxSize; }
                }
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/webp', 0.8));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

function ItemsFieldArray({ categoryIndex, control, setValue }: { categoryIndex: number, control: any, setValue: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `categories.${categoryIndex}.items`,
  });
  const fileInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: 'Processando imagem...', description: 'Aguarde um momento.'});
      try {
        const processedImage = await processImage(file);
        setValue(`categories.${categoryIndex}.items.${itemIndex}.image`, processedImage, { shouldValidate: true });
        toast({ title: 'Imagem adicionada!' });
      } catch (error) {
         toast({ variant: "destructive", title: "Erro ao processar imagem." });
      }
    }
  };


  return (
    <div className="space-y-4">
      <FormLabel>Imagens da Categoria</FormLabel>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {fields.map((item, itemIndex) => (
          <div key={item.id} className="space-y-2 relative group">
             <FormField
              control={control}
              name={`categories.${categoryIndex}.items.${itemIndex}.image`}
              render={({ field }) => (
                <FormItem>
                   <FormControl>
                        <div 
                            className="aspect-[2/3] bg-zinc-800 rounded-md flex items-center justify-center border-2 border-dashed border-zinc-700 cursor-pointer hover:border-red-600" 
                            onClick={() => fileInputRefs.current[itemIndex]?.click()}
                        >
                            {field.value ? (
                                <Image src={field.value} alt={`Item ${itemIndex}`} width={200} height={300} className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <div className="text-center p-2">
                                    <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                                    <p className="text-xs">Enviar Imagem</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={el => fileInputRefs.current[itemIndex] = el} 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleFileChange(e, itemIndex)} 
                            />
                        </div>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="button" variant="destructive" size="icon" onClick={() => remove(itemIndex)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100">
                <Trash2 className="w-3 h-3"/>
             </Button>
          </div>
        ))}
         <button
            type="button"
            onClick={() => append({ image: '', title: '', description: '' })}
            className="aspect-[2/3] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-md flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 cursor-pointer hover:border-red-600 transition-colors"
        >
            <PlusCircle className="w-8 h-8" />
            <span className="text-xs mt-2">Adicionar</span>
        </button>
      </div>
    </div>
  );
}


function NetflixCreatorPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const heroFileInputRef = React.useRef<HTMLInputElement>(null);
  const heroVideoInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadProgress] = React.useState<number | null>(null);


  const form = useForm<NetflixFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      template: "netflix-de-amor",
      heroType: "image",
      heroImage: "",
      heroVideoUrl: "",
      heroTitle: "Nossa História de Cinema",
      heroDescription: "Das pequenas risadas aos grandes momentos, nossa história é a minha favorita. Prepare a pipoca para a maratona do nosso amor.",
      categories: [
        { title: "Séries do Momento", items: [] },
        { title: "Filmes em Alta", items: [] },
      ],
      plan: "essencial",
    },
  });

  const { fields: categories, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const watchedData = form.watch();

  const handleHeroImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: 'Processando imagem...', description: 'Aguarde um momento.'});
      try {
        const processedImage = await processImage(file);
        form.setValue('heroImage', processedImage);
        toast({ title: 'Imagem adicionada!' });
      } catch (error) {
         toast({ variant: "destructive", title: "Erro ao processar imagem." });
      }
    }
  };
  
  const handleHeroVideoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      //setUploadProgress(0);
      toast({ title: 'Enviando vídeo...', description: 'Isso pode levar alguns minutos dependendo do tamanho do arquivo.'});
      try {
        // Here you would typically use a progress callback from your upload function
        // For now, we'll just simulate it.
        // In a real scenario, `uploadVideo` would need to support progress reporting.
        const videoUrl = await uploadVideo(file);
        form.setValue('heroVideoUrl', videoUrl);
        //setUploadProgress(100);
        toast({ title: 'Vídeo enviado com sucesso!' });
      } catch (error) {
         toast({ variant: "destructive", title: "Erro ao enviar vídeo.", description: "Tente novamente ou verifique sua conexão." });
         //setUploadProgress(null);
      }
    }
  };


  async function onSubmit(data: NetflixFormData) {
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
        const pageDataForDb = { 
            ...data, 
            title: data.heroTitle, // Use heroTitle as main title for dashboard etc.
            contactEmail: user.email,
        };
        const pageId = await savePageData(pageDataForDb as any, user.uid);
        
        if (data.plan === 'essencial') {
            toast({
              title: "Sua Netflix de Amor foi salva!",
              description: "Você será redirecionado para a tela de pagamento.",
            });
            router.push(`/criar/sucesso/${pageId}`);
        } else {
            toast({
              title: "Solicitação de orçamento enviada!",
              description: "Em breve nossa equipe entrará em contato.",
            });
            router.push('/criar/sucesso-orcamento');
        }
    } catch (error: any) {
      console.error("Failed to process page:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar página",
        description: error.message || "Não foi possível salvar sua página. Tente novamente.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }
  
    if (authLoading) {
      return <div className="w-full h-screen flex items-center justify-center bg-[#141414] text-white"><Loader className="animate-spin" /></div>
    }

    if (!user) {
        return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4 bg-[#141414] text-white">
            <h2 className="text-3xl font-bold mb-4 font-display">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-8 max-w-md">Você precisa estar logado para criar com este tema. Faça login ou crie uma conta para continuar.</p>
            <div className="flex gap-4">
            <Link href="/login">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
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
    <div className="bg-[#141414] text-white min-h-screen">
        <div className="flex flex-col-reverse md:grid md:grid-cols-2">
            {/* Form Section */}
            <div className="p-4 md:p-8 overflow-y-auto md:h-screen md:scrollbar-hide order-2 md:order-1">
                <div className="max-w-xl mx-auto">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tighter mt-4">Netflix de Amor</h1>
                        <p className="text-muted-foreground mt-2">Preencha os campos para criar sua experiência de streaming romântica.</p>
                    </header>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-lg">
                                <h2 className="text-2xl font-bold border-b border-red-600 pb-2">Filme em Destaque</h2>
                                <FormField
                                    control={form.control}
                                    name="heroType"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                        <FormLabel>Tipo de Mídia de Destaque</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    form.setValue('heroImage', '');
                                                    form.setValue('heroVideoUrl', '');
                                                }}
                                                defaultValue={field.value}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                            >
                                                <RadioGroupItem value="image" id="type-image"><ImageIcon className="mr-2"/> Imagem</RadioGroupItem>
                                                <RadioGroupItem value="video" id="type-video"><Video className="mr-2"/> YouTube</RadioGroupItem>
                                                <RadioGroupItem value="upload" id="type-upload"><FileVideo className="mr-2"/> Anexar Vídeo</RadioGroupItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {watchedData.heroType === "image" && (
                                    <FormField
                                        control={form.control}
                                        name="heroImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Imagem de Capa Principal (16:9)</FormLabel>
                                                <FormControl>
                                                    <div className="w-full aspect-video bg-zinc-800 rounded-md flex items-center justify-center border-2 border-dashed border-zinc-700 cursor-pointer hover:border-red-600" onClick={() => heroFileInputRef.current?.click()}>
                                                        {field.value ? (
                                                            <Image src={field.value} alt="Imagem de destaque" width={1920} height={1080} className="w-full h-full object-cover rounded-md"/>
                                                        ) : (
                                                            <div className="text-center">
                                                                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                                                                <p>Clique para enviar a imagem de destaque</p>
                                                            </div>
                                                        )}
                                                        <input type="file" ref={heroFileInputRef} accept="image/*" className="hidden" onChange={handleHeroImageChange} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                 {watchedData.heroType === "video" && (
                                    <FormField
                                        control={form.control}
                                        name="heroVideoUrl"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL do Vídeo do YouTube</FormLabel>
                                            <FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} className="bg-zinc-800 border-zinc-700" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                )}
                                {watchedData.heroType === "upload" && (
                                     <FormField
                                        control={form.control}
                                        name="heroVideoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Anexar Arquivo de Vídeo</FormLabel>
                                                <FormControl>
                                                    <div className="w-full p-8 bg-zinc-800 rounded-md flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 cursor-pointer hover:border-red-600" onClick={() => heroVideoInputRef.current?.click()}>
                                                        <FileVideo className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                                                        <p className="font-semibold">Clique para anexar um vídeo</p>
                                                        <p className="text-xs text-muted-foreground">MP4, MOV, AVI (máx. 100MB)</p>
                                                        <input type="file" ref={heroVideoInputRef} accept="video/*" className="hidden" onChange={handleHeroVideoChange} />
                                                    </div>
                                                </FormControl>
                                                {uploadProgress !== null && uploadProgress < 100 && (
                                                  <div className="space-y-2 mt-2">
                                                    {/* <Progress value={uploadProgress} className="h-2" /> */}
                                                    <p className="text-xs text-muted-foreground text-center">Enviando... {uploadProgress}%</p>
                                                  </div>
                                                )}
                                                {field.value && (
                                                  <p className="text-sm text-green-400 p-2 bg-green-950/50 rounded-md mt-2">✔️ Vídeo anexado com sucesso!</p>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="heroTitle"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título do Destaque</FormLabel>
                                        <FormControl><Input placeholder="Ex: Nossa História de Cinema" {...field} className="bg-zinc-800 border-zinc-700" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="heroDescription"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sinopse do Destaque</FormLabel>
                                        <FormControl><Textarea placeholder="Descreva a história de amor de vocês..." {...field} className="bg-zinc-800 border-zinc-700" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold border-b border-red-600 pb-2">Suas Categorias</h2>
                                {categories.map((category, categoryIndex) => (
                                    <div key={category.id} className="space-y-4 bg-zinc-900/50 p-6 rounded-lg relative">
                                        <FormField
                                            control={form.control}
                                            name={`categories.${categoryIndex}.title`}
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome da Categoria</FormLabel>
                                                <FormControl><Input placeholder="Ex: Momentos Inesquecíveis" {...field} className="bg-zinc-800 border-zinc-700"/></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <ItemsFieldArray categoryIndex={categoryIndex} control={form.control} setValue={form.setValue} />
                                        <Button type="button" variant="destructive" size="sm" onClick={() => remove(categoryIndex)} className="absolute -top-3 -right-3">
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => append({ title: 'Nova Categoria', items: [] })}>
                                    <PlusCircle className="mr-2 h-4 w-4"/> Adicionar Categoria
                                </Button>
                            </div>
                            
                            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-lg">
                                <h2 className="text-2xl font-bold border-b border-red-600 pb-2">Finalização</h2>
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
                                                        <Gem className="w-6 h-6 text-red-500 mt-1" />
                                                        <div>
                                                            <h3 className="font-bold">Plano Essencial - R$14,99</h3>
                                                            <p className="text-sm text-muted-foreground">Finalize com os recursos deste tema e pague para ativar a página.</p>
                                                        </div>
                                                    </div>
                                                </RadioGroupItem>
                                                <RadioGroupItem value="orcamento" id="plan-orcamento">
                                                    <div className="flex items-start gap-4">
                                                        <FileText className="w-6 h-6 text-red-500 mt-1" />
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

                            <div className="flex justify-end pt-8">
                                <Button type="submit" size="lg" className="bg-red-600 hover:bg-red-700 text-white" disabled={isSubmitting}>
                                    {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                                    {watchedData.plan === 'orcamento' ? 'Solicitar Orçamento' : 'Criar e ir para o Pagamento'}
                                    <ChevronRight className="ml-2 h-4 w-4"/>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            
            {/* Preview Section */}
             <div className="w-full h-auto md:h-screen p-4 md:p-8 bg-black md:sticky md:top-0 order-1 md:order-2 flex items-center justify-center">
                <div className="w-full h-full max-w-full md:max-w-xl aspect-auto md:aspect-[9/16] mx-auto">
                    <div className="relative w-full h-full group/preview">
                        <div className="relative z-10 w-full h-full bg-zinc-950 rounded-2xl flex flex-col shadow-2xl">
                        <div className="bg-zinc-800 rounded-t-lg p-2 flex items-center gap-1.5 border-b border-zinc-700">
                            <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex-grow bg-zinc-700 rounded-sm px-2 py-1 text-xs text-zinc-400 text-center truncate">
                                https://luv.com/p/{watchedData.heroTitle?.toLowerCase().replace(/\s/g, '-') || 'pagina'}
                            </div>
                        </div>
                        <div className="flex-grow bg-black rounded-b-lg overflow-hidden relative">
                            <NetflixDeAmorPage data={watchedData} isPreview={true} />
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NetflixCreatorPage;

    
