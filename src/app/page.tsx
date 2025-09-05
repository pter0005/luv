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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (imagePreviews.length + files.length > 8) {
        toast({
          variant: "destructive",
          title: "Too many images",
          description: "You can only upload a maximum of 8 images.",
        });
        return;
      }
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      form.setValue("images", [...(form.getValues("images") || []), ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    const removedUrl = newPreviews.splice(index, 1)[0];
    URL.revokeObjectURL(removedUrl); // Clean up memory
    setImagePreviews(newPreviews);
    form.setValue("images", newPreviews);
  };
  
  const handleEnhanceMessage = async () => {
    setIsSentimentLoading(true);
    setIsSentimentDialogOpen(true);
    try {
      const result = await suggestSentimentEnhancements({ text: form.getValues("message") });
      setSentimentSuggestion(result.enhancedText);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not enhance message. Please try again.",
      });
    } finally {
      setIsSentimentLoading(false);
    }
  };

  const handleGenerateBackground = async () => {
    const prompt = form.getValues("backgroundPrompt");
    if (!prompt) {
      toast({
        variant: "destructive",
        title: "Missing Prompt",
        description: "Please enter a description for the background.",
      });
      return;
    }
    setIsBgLoading(true);
    try {
      const result = await generateUniqueBackground({ backgroundDescription: prompt });
      form.setValue("background", result.backgroundImageDataUri);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate background. Please try again.",
      });
    } finally {
      setIsBgLoading(false);
    }
  };

  function onSubmit(values: FormData) {
    console.log(values);
    setIsPreviewOpen(true);
  }

  const backgroundValue = form.watch("background");
  const currentMessage = form.watch("message");

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          Declare your love in a unique way
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Create a personalized page for someone you love and surprise them with a special declaration that will last forever.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Names & Special Date</CardTitle>
              <CardDescription>
                Tell us who this is for and when your journey began.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FormField
                  control={form.control}
                  name="name1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Alex" {...field} />
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
                      <FormLabel>Second Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Taylor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Relationship Start Date</FormLabel>
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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

          <Card>
            <CardHeader>
              <CardTitle>Your Special Message</CardTitle>
              <CardDescription>
                Write something from the heart. You can use our AI to make it even more special.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Share a memory, a feeling, a dream..."
                        className="resize-y min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="button" variant="outline" onClick={handleEnhanceMessage} disabled={!currentMessage || isSentimentLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isSentimentLoading ? 'Enhancing...' : 'Enhance with AI'}
               </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customize Your Page</CardTitle>
              <CardDescription>
                Add images, music, and a background to make your page unique.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormItem>
                  <FormLabel>Your Song</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Music className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Paste a song URL (e.g., from YouTube)" {...form.register("musicUrl")} className="pl-10" />
                    </div>
                  </FormControl>
                </FormItem>

                <Tabs defaultValue="presets">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="presets">Preset Backgrounds</TabsTrigger>
                    <TabsTrigger value="ai">AI Generator</TabsTrigger>
                  </TabsList>
                  <TabsContent value="presets" className="pt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)',
                        'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                        'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
                        'linear-gradient(to right, #89f7fe 0%, #66a6ff 100%)',
                        'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
                        'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
                      ].map((bg) => (
                        <Button
                          key={bg}
                          type="button"
                          className={cn(
                            "h-20 w-full p-0 border-2",
                             backgroundValue === bg ? 'border-primary' : 'border-transparent'
                          )}
                          style={{ background: bg }}
                          onClick={() => form.setValue("background", bg)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="ai" className="pt-4 space-y-4">
                     <FormField
                        control={form.control}
                        name="backgroundPrompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Background Prompt</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., a starry night sky with two moons" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    <Button type="button" onClick={handleGenerateBackground} disabled={isBgLoading}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isBgLoading ? 'Generating...' : 'Generate Background'}
                    </Button>
                    <div className="rounded-lg border bg-muted w-full h-32" style={{ background: backgroundValue.startsWith('data:image') || backgroundValue.startsWith('linear-gradient') ? backgroundValue : `url(${backgroundValue})`, backgroundSize: 'cover' }}></div>
                  </TabsContent>
                </Tabs>
                
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <FormLabel>Your Photos (up to 8)</FormLabel>
                      <FormControl>
                        <div className="relative border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Drag & drop or click to upload
                          </p>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                          />
                        </div>
                      </FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {imagePreviews.map((src, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={src}
                              alt={`Preview ${index + 1}`}
                              width={150}
                              height={150}
                              className="rounded-lg object-cover aspect-square"
                              data-ai-hint="couple photo"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

            </CardContent>
          </Card>
          
          <Button type="submit" className="w-full text-lg py-6">
            <Heart className="mr-2 h-5 w-5" /> Create Your Page
          </Button>
        </form>
      </Form>

      <Dialog open={isSentimentDialogOpen} onOpenChange={setIsSentimentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Message Enhancer</DialogTitle>
            <DialogDescription>
              Here is a suggestion to make your message more heartfelt.
            </DialogDescription>
          </DialogHeader>
          {isSentimentLoading ? (
            <div className="flex justify-center items-center h-24">
              <Sparkles className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-semibold">Original</Label>
                <p className="p-2 text-sm rounded-md bg-muted">{form.getValues("message")}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-primary">Suggestion</Label>
                <p className="p-2 text-sm rounded-md border border-primary bg-primary/10">{sentimentSuggestion}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSentimentDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              form.setValue("message", sentimentSuggestion);
              setIsSentimentDialogOpen(false);
              toast({ title: "Message updated!" });
            }} disabled={isSentimentLoading}>
              Use Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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

    
