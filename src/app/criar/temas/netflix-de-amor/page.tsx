
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
import { ArrowLeft, ChevronRight, Loader, PlusCircle, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { savePageData } from "@/actions/page";
import { useRouter } from "next/navigation";
import { useAuth, withAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { NetflixDeAmorPage } from "@/components/app/NetflixDeAmorPage";

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
  heroImage: z.string().min(1, "A imagem de destaque é obrigatória."),
  heroTitle: z.string().min(1, "O título de destaque é obrigatório."),
  heroDescription: z.string().min(1, "A sinopse é obrigatória."),
  categories: z.array(categorySchema).min(1, "Adicione pelo menos uma categoria."),
  contactName: z.string().min(1, "O nome é obrigatório."),
  contactEmail: z.string().email("Email inválido.").min(1, "O e-mail é obrigatório."),
  contactPhone: z.string().min(1, "O telefone é obrigatório."),
  plan: z.string().min(1, "Você deve escolher uma opção.").default("essencial"),
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
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

function ItemsFieldArray({ categoryIndex, control }: { categoryIndex: number, control: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `categories.${categoryIndex}.items`,
  });
  const fileInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();
  const { setValue } = useForm<NetflixFormData>();


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
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const heroFileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<NetflixFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      template: "netflix-de-amor",
      heroImage: "",
      heroTitle: "Nossa História de Cinema",
      heroDescription: "Das pequenas risadas aos grandes momentos, nossa história é a minha favorita. Prepare a pipoca para a maratona do nosso amor.",
      categories: [
        { title: "Séries do Momento", items: [] },
        { title: "Filmes em Alta", items: [] },
      ],
      contactName: "",
      contactEmail: user?.email || "",
      contactPhone: "",
      plan: "essencial",
    },
  });
  
  const { fields: categories, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const watchedData = form.watch();

  React.useEffect(() => {
    if (user) {
        form.setValue('contactEmail', user.email || '');
        form.setValue('contactName', user.displayName || '');
    }
  }, [user, form]);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: 'Processando imagem...', description: 'Aguarde um momento.'});
      try {
        const processedImage = await processImage(file);
        onChange(processedImage);
        toast({ title: 'Imagem adicionada!' });
      } catch (error) {
         toast({ variant: "destructive", title: "Erro ao processar imagem." });
      }
    }
  };


  async function onSubmit(data: NetflixFormData) {
    if (!user) {
         toast({ variant: "destructive", title: "Usuário não autenticado."});
         return;
    }
    setIsSubmitting(true);
    try {
        const pageDataForDb = { ...data, plan: 'essencial', title: data.heroTitle };
        const pageId = await savePageData(pageDataForDb as any, user.uid);
        
        toast({
          title: "Sua Netflix de Amor foi salva!",
          description: "Você será redirecionado para a tela de pagamento.",
        });
        router.push(`/criar/sucesso/${pageId}`);
    } catch (error) {
      console.error("Failed to process page:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar página",
        description: "Não foi possível salvar sua página. Tente novamente.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-[#141414] text-white min-h-screen">
        <div className="grid md:grid-cols-2">
            {/* Form Section */}
            <div className="section-padding overflow-y-auto h-screen">
                <div className="max-w-xl mx-auto">
                    <header className="text-center mb-12">
                        <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={100} height={100} className="mx-auto w-24 h-24" />
                        <h1 className="text-4xl font-bold tracking-tighter mt-4">Netflix de Amor</h1>
                        <p className="text-muted-foreground mt-2">Preencha os campos para criar sua experiência de streaming romântica.</p>
                    </header>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-lg">
                                <h2 className="text-2xl font-bold border-b border-red-600 pb-2">Filme em Destaque</h2>
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
                                                    <input type="file" ref={heroFileInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, field.onChange)} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                        <ItemsFieldArray categoryIndex={categoryIndex} control={form.control} />
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
                                    name="contactName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seu Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Seu nome completo" {...field} className="bg-zinc-800 border-zinc-700" />
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
                                                <Input placeholder="seu.email@exemplo.com" {...field} disabled className="bg-zinc-800 border-zinc-700"/>
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
                                                <Input placeholder="(99) 99999-9999" {...field} className="bg-zinc-800 border-zinc-700"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end pt-8">
                                <Button type="submit" size="lg" className="bg-red-600 hover:bg-red-700 text-white" disabled={isSubmitting}>
                                    {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                                    Criar e ir para o Pagamento
                                    <ChevronRight className="ml-2 h-4 w-4"/>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            
            {/* Preview Section */}
            <div className="hidden md:block sticky top-0 h-screen p-8">
                <div className="w-full h-full bg-zinc-950 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
                    <div className="bg-zinc-800 rounded-t-lg p-2 flex items-center gap-1.5 border-b border-zinc-700">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-grow bg-zinc-700 rounded-sm px-2 py-1 text-xs text-zinc-400 text-center truncate">
                            https://luv.com/p/preview
                        </div>
                    </div>
                    <div className="flex-grow rounded-b-lg overflow-y-auto">
                        <NetflixDeAmorPage data={watchedData} isPreview={true} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default withAuth(NetflixCreatorPage);
