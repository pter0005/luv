
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
import { AnimatedBackground } from "@/components/app/AnimatedBackground";

const formSchema = z.object({
  photos: z.array(z.string()).optional(),
  photoDisplayType: z.string().optional(),
  title: z.string().min(1, "O título é obrigatório."),
  titleColor: z.string().optional(),
  message: z.string().optional(),
  messageFontSize: z.string().optional(),
  startDate: z.date().optional(),
  dateDisplayType: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatorStudioPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [fieldHistory, setFieldHistory] = React.useState<Partial<FormData>>({});
  const totalSteps = 4;
  const colorPickerRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photos: [],
      photoDisplayType: "Cards",
      title: "",
      titleColor: "#FFFFFF",
      message: "",
      messageFontSize: "text-base",
      dateDisplayType: "padrão",
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

  const steps = [
    {
      name: "title" as const,
      title: "Título da página",
      description: "Escreva o título dedicatório para a página.",
    },
    {
      name: "message" as const,
      title: "Mensagem",
      description: "Escreva uma mensagem especial. Seja criativo e demonstre todo seu carinho.",
    },
    {
      name: "startDate" as const,
      title: "Data de início",
      description: "Informe a data que simboliza o início de uma união.",
    },
    {
      name: "photos" as const,
      title: "Fotos",
      description: "Anexe fotos e escolha o modo de exibição para personalizar a página. Você pode adicionar até 8 fotos.",
    },
  ];

  const handleNextStep = async () => {
    const currentFieldName = steps[currentStep - 1].name;
    const isValid = await form.trigger(currentFieldName);
  
    if (isValid) {
      setFieldHistory((prev) => ({ ...prev, ...form.getValues() }));
      
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


  const currentFieldName = steps[currentStep - 1].name;

  return (
    <div className="relative flex w-full min-h-screen items-center justify-center p-4">
      <AnimatedBackground fixed />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 max-w-7xl w-full items-center">
        {/* Form Section */}
        <aside className="w-full flex flex-col justify-center">
         <div className="w-full max-w-lg mx-auto">
          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} className="bg-zinc-700 h-2 [&>div]:bg-white" />
            <p className="text-right text-sm text-muted-foreground mt-2">{currentStep}/{totalSteps}</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">{steps[currentStep - 1].title}</h2>
            <p className="text-muted-foreground mt-2">{steps[currentStep - 1].description}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
              <div className="min-h-[350px]">
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <FormField
                      control={form.control}
                      key="title"
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Escreva o título aqui..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      key="titleColor"
                      name="titleColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor do Título</FormLabel>
                          <FormControl>
                             <div className="flex items-center gap-4 pt-2">
                                <div 
                                    className="w-24 h-24 rounded-lg border-2 border-zinc-700 cursor-pointer"
                                    style={{ backgroundColor: field.value }}
                                    onClick={() => colorPickerRef.current?.click()}
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Clique no quadrado para escolher uma cor</span>
                                    <span className="font-mono text-lg">{field.value}</span>
                                </div>
                                <input
                                    ref={colorPickerRef}
                                    type="color"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="sr-only"
                                />
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
                      key="message"
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Editor
                                value={field.value || ''}
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
                   <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                    <FormField
                      control={form.control}
                      key="startDate"
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
                      key="dateDisplayType"
                      name="dateDisplayType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-semibold">Modo de Exibição</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col gap-3"
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="padrão" id="padrão">
                                    Padrão
                                  </RadioGroupItem>
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="classico" id="classico">
                                    Clássico
                                  </RadioGroupItem>
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="simples" id="simples">
                                     Simples
                                  </RadioGroupItem>
                                </FormControl>
                              </FormItem>
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
                          <FormControl>
                            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors"
                              onClick={() => fileInputRef.current?.click()}>
                              <Upload className="mx-auto h-10 w-10 text-zinc-500 mb-2" />
                              <p className="font-semibold">Clique para adicionar fotos</p>
                              <p className="text-xs text-zinc-500">PNG, JPG, JPEG, GIF (máx. 8 fotos)</p>
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
                          <FormLabel className="font-semibold">Modo de mostrar</FormLabel>
                           <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 gap-4"
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="Coverflow" id="coverflow">Coverflow</RadioGroupItem>
                                </FormControl>
                              </FormItem>
                               <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="Cube" id="cube">Cubo 3D</RadioGroupItem>
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="Cards" id="cards">Cards</RadioGroupItem>
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="Flip" id="flip">Flip</RadioGroupItem>
                                </FormControl>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
        </aside>

        {/* Preview Section */}
        <main className="w-full p-4 hidden lg:flex flex-col items-center justify-center bg-transparent">
            <div className="w-full max-w-[400px] aspect-[9/19.5] mx-auto bg-zinc-900 rounded-[60px] shadow-2xl shadow-primary/20 p-4 border-8 border-zinc-800 overflow-hidden">
                <PagePreview data={{...fieldHistory, ...form.getValues()}} />
            </div>
        </main>
      </div>
    </div>
  );
}

    