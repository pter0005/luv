
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { PagePreview } from "@/components/app/PagePreview";
import {
  ArrowLeft,
  CalendarIcon,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Editor } from "@/components/ui/editor";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  message: z.string().optional(),
  startDate: z.date().optional(),
  dateDisplayType: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatorStudioPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [fieldHistory, setFieldHistory] = React.useState<Partial<FormData>>({});
  const totalSteps = 3;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
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
  ];

  const handleNextStep = async () => {
    const currentFieldName = steps[currentStep - 1].name;
    const isValid = await form.trigger(currentFieldName);

    if (isValid) {
      // Save the current field's value to history before clearing it
      setFieldHistory(prev => ({...prev, [currentFieldName]: form.getValues(currentFieldName)}));
      
      // Clear the field value for the next step's input
      if (currentStep < steps.length) {
          const nextFieldName = steps[currentStep].name;
          form.setValue(nextFieldName, fieldHistory[nextFieldName] || form.getValues(nextFieldName));
          form.resetField(currentFieldName, { defaultValue: '' });
      }

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prevFieldName = steps[currentStep - 2].name;
      const currentFieldName = steps[currentStep - 1].name;

      // Restore the previous field's value from history
      form.setValue(prevFieldName, fieldHistory[prevFieldName] || form.getValues(prevFieldName));
       
      // Clear the current field's value
      form.resetField(currentFieldName);
      
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
            <h2 className="text-3xl font-bold">{steps[currentStep - 1].title}</h2>
            <p className="text-muted-foreground mt-2">{steps[currentStep - 1].description}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
              <div className="space-y-4">
                {currentStep === 1 && (
                  <FormField
                    control={form.control}
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
                )}
                {currentStep === 2 && (
                  <FormField
                    control={form.control}
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
                )}
                {currentStep === 3 && (
                  <div className="space-y-6">
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
                    <FormField
                      control={form.control}
                      name="dateDisplayType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Modo de Exibição</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex items-center gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="padrão" id="padrão" />
                                </FormControl>
                                <FormLabel htmlFor="padrão" className="font-normal">
                                  Padrão
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="classico" id="classico"/>
                                </FormControl>
                                <FormLabel htmlFor="classico" className="font-normal">
                                  Clássico
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="simples" id="simples"/>
                                </FormControl>
                                <FormLabel htmlFor="simples" className="font-normal">
                                  Simples
                                </FormLabel>
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
                <Button type="button" variant="secondary" onClick={handlePrevStep} disabled={currentStep === 1} className="w-full bg-zinc-800 hover:bg-zinc-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNextStep} className="w-full bg-red-600 hover:bg-red-700">
                    Próxima Etapa
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
          <PagePreview data={{...watchedData, ...fieldHistory}} />
        </div>
      </main>
    </div>
  );
}
