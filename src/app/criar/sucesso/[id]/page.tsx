
"use client";

import { useEffect, useState } from 'react';
import { getPageData } from '@/actions/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle, Clock, Copy, Download, Mail, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useQRCode } from 'next-qrcode';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

export default function SucessoPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { Canvas } = useQRCode();
  const [isPaid, setIsPaid] = useState(false);

  // This is a simplified check. In a real-world scenario,
  // you'd rely on the webhook to update the status.
  // This client-side check provides a better UX if the user returns to this page.
  useEffect(() => {
    const checkPaymentStatus = async () => {
        try {
            const data = await getPageData(params.id);
            if (data) {
                setPageData(data);
                if (data.status === 'paid') {
                    setIsPaid(true);
                }
            } else {
                console.error("Page not found");
            }
        } catch (error) {
            console.error("Failed to fetch page data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    checkPaymentStatus();
  }, [params.id]);


  const pageUrl = `${window.location.origin}/p/${params.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast({ title: "Link copiado para a área de transferência!" });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pageData?.title || 'Uma surpresa para você!',
        text: `Veja a página especial que eu criei:`,
        url: pageUrl,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        handleCopyLink();
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode-pagina-especial.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full max-w-lg">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-6" />
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-md mx-auto mb-10" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      )
    }

    if (isPaid) {
       return (
          <>
            <div className="p-4 bg-green-500/10 rounded-full mb-6 ring-4 ring-green-500/20">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
              Sua página está <span className="gradient-text">Pronta!</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Sua obra de arte digital foi criada com sucesso. Agora é só compartilhar com aquela pessoa especial.
            </p>

            <Card className="w-full max-w-lg bg-card/80">
                <CardHeader>
                    <CardTitle>Compartilhe sua Criação</CardTitle>
                    <CardDescription>Use o link ou o QR Code abaixo para revelar sua surpresa.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-secondary p-4 rounded-lg flex items-center justify-between gap-4">
                        <p className="truncate text-sm font-mono text-muted-foreground">{pageUrl}</p>
                        <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-4 rounded-lg">
                             <Canvas
                                text={pageUrl}
                                options={{
                                    errorCorrectionLevel: 'M',
                                    margin: 3,
                                    scale: 4,
                                    width: 200,
                                    color: {
                                    dark: '#020617',
                                    light: '#FFFFFF',
                                    },
                                }}
                            />
                        </div>
                         <Button onClick={downloadQRCode}>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar QR Code
                        </Button>
                    </div>
                     <Button size="lg" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2 h-5 w-5" />
                        Compartilhar Agora
                    </Button>
                </CardContent>
            </Card>
        </>
       )
    }

    return (
        <>
            <div className="p-4 bg-primary/10 rounded-full mb-6 ring-4 ring-primary/20">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
             Quase lá!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Recebemos seu pedido e estamos aguardando a confirmação do pagamento. Assim que for aprovado, enviaremos o link e o QR Code da sua página para o seu e-mail.
            </p>
            <Card className="w-full max-w-lg bg-card/80">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-3 justify-center"><Mail className="w-6 h-6"/> Verifique seu E-mail</CardTitle>
                    <CardDescription>
                        Fique de olho na sua caixa de entrada (e na de spam!). A entrega do link é feita por lá.
                    </CardDescription>
                </CardHeader>
            </Card>
        </>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container section-padding flex flex-col items-center justify-center min-h-screen text-center">
        {renderContent()}
        <Link href="/" className="mt-12">
            <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o início
            </Button>
        </Link>
      </div>
    </div>
  );
}

    