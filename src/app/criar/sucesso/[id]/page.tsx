
"use client";

import { useEffect, useState, useCallback, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmPaymentAndSendEmail, getPageData, updatePageStatus } from '@/actions/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle, Clock, Copy, Download, Share2, Wallet, XCircle, AlertTriangle, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useQRCode } from 'next-qrcode';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Script from 'next/script';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const FIXED_PRICE = 14.99;

// Função para disparar eventos de pixel
const trackPixelEvent = (eventName: string, data: any = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data);
  }
};

export default function SucessoPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [checkoutError, setCheckoutError] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{qrCodeBase64: string, qrCode: string} | null>(null);
  const { Canvas } = useQRCode();
  const [hasTrackedCheckout, setHasTrackedCheckout] = useState(false);
  const [hasTrackedPurchase, setHasTrackedPurchase] = useState(false);

  // State for payment form
  const [contactName, setContactName] = useState('');
  const [contactCpf, setContactCpf] = useState('');
  const [formError, setFormError] = useState('');


  // Effect to handle initial page load and payment confirmation from URL params
  const checkPageAndPayment = useCallback(async () => {
    setLoading(true);
    try {
        const data = await getPageData(params.id);
        if (!data) {
            toast({ variant: "destructive", title: "Página não encontrada" });
            setLoading(false);
            return;
        }
        
        setPageData(data);
        setPaymentStatus(data.status);

        // Track "InitiateCheckout" when the page loads, but only once.
        if (data.status === 'pending_payment' && !hasTrackedCheckout) {
          trackPixelEvent('InitiateCheckout', {
            content_name: data.title,
            content_ids: [params.id],
            content_type: 'product',
            value: FIXED_PRICE,
            currency: 'BRL',
          });
          setHasTrackedCheckout(true);
        }
        
        const mpStatus = searchParams.get('status');
        const paymentId = searchParams.get('payment_id');

        // This happens when the user is redirected from Mercado Pago
        if (mpStatus === 'approved' && paymentId && data.status !== 'paid') {
            const result = await confirmPaymentAndSendEmail(params.id);
            if (result.success) {
                const updatedData = await getPageData(params.id);
                setPageData(updatedData);
                setPaymentStatus('paid');
                 if (!hasTrackedPurchase) {
                  trackPixelEvent('Purchase', {
                    value: FIXED_PRICE,
                    currency: 'BRL',
                    content_name: updatedData.title,
                    content_ids: [params.id],
                  });
                  setHasTrackedPurchase(true);
                }
            } else {
                toast({ variant: "destructive", title: "Erro de Confirmação", description: result.message || "Ocorreu um erro ao ativar a página. Tente recarregar ou contate o suporte."});
            }
        } else if (data.status === 'paid' && !hasTrackedPurchase) {
           trackPixelEvent('Purchase', {
              value: FIXED_PRICE,
              currency: 'BRL',
              content_name: data.title || data.heroTitle,
              content_ids: [params.id],
            });
            setHasTrackedPurchase(true);
        }
    } catch (error) {
        console.error("Error fetching page data:", error);
        toast({ variant: "destructive", title: "Erro ao buscar dados da página." });
    } finally {
        setLoading(false);
    }
  }, [params.id, toast, searchParams, hasTrackedCheckout, hasTrackedPurchase]);

  useEffect(() => {
    checkPageAndPayment();
  }, [checkPageAndPayment]);

  // Polling effect
  useEffect(() => {
    // Only start polling if PIX has been generated and payment is not yet approved
    if (pixData && paymentStatus !== 'paid') {
      const interval = setInterval(async () => {
        try {
          const data = await getPageData(params.id);
          if (data && data.status === 'paid') {
            setPageData(data);
            setPaymentStatus('paid');
             if (!hasTrackedPurchase) {
                trackPixelEvent('Purchase', {
                  value: FIXED_PRICE,
                  currency: 'BRL',
                  content_name: data.title || data.heroTitle,
                  content_ids: [params.id],
                });
                setHasTrackedPurchase(true);
              }
            clearInterval(interval); // Stop polling once paid
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 5000); // Poll every 5 seconds

      // Set a timeout to stop polling after 5 minutes
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 300000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [pixData, params.id, paymentStatus, hasTrackedPurchase]);


  const handleGeneratePix = async () => {
    if (!pageData) return;
    
    if (!contactName || contactCpf.length < 14) {
      setFormError('Por favor, preencha seu nome completo e CPF corretamente.');
      return;
    }
    setFormError('');

    setCheckoutStatus('loading');
    setCheckoutError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: params.id,
          title: pageData.title || pageData.heroTitle,
          email: pageData.contactEmail,
          name: contactName,
          cpf: contactCpf,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }
      
      if (responseData.pixData?.qrCodeBase64) {
        setPixData(responseData.pixData);
        setCheckoutStatus('success');
      } else {
        throw new Error('A API do Mercado Pago retornou uma resposta OK, mas não incluiu os dados do QR Code. Verifique o painel do Mercado Pago.');
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      setCheckoutStatus('error');
      setCheckoutError(error);
      toast({
        variant: "destructive",
        title: "Erro no Checkout",
        description: error.error || "Não foi possível preparar o pagamento.",
      });
    }
  };

  const handleCopyPixCode = () => {
    if (pixData?.qrCode) {
        navigator.clipboard.writeText(pixData.qrCode);
        toast({ title: "Código Pix copiado para a área de transferência!" });
    }
  }

  const pageUrl = `${NEXT_PUBLIC_BASE_URL}/p/${params.id}`;

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

    if (paymentStatus === 'paid') {
       return (
          <>
            <div className="p-4 bg-green-500/10 rounded-full mb-6 ring-4 ring-green-500/20">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
              Sua página está <span className="gradient-text">Pronta!</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Sua obra de arte digital foi criada com sucesso. Um e-mail com o link de acesso foi enviado para você. Agora é só compartilhar com aquela pessoa especial.
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
                                logo={{
                                  src: "https://i.imgur.com/EMwsRdt.png",
                                  options: {
                                    width: 50,
                                    x: undefined,
                                    y: undefined
                                  }
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
    
    if (searchParams.get('status') === 'failure') {
        return (
            <>
                <div className="p-4 bg-red-500/10 rounded-full mb-6 ring-4 ring-red-500/20">
                    <XCircle className="w-10 h-10 md:w-12 md:h-12 text-red-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
                Pagamento <span className="text-red-500">Recusado</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Ocorreu um problema ao processar seu pagamento. Por favor, tente novamente ou use outra forma de pagamento. Se o problema persistir, entre em contato conosco em <a href="mailto:criarcomluv@gmail.com" className="underline font-semibold hover:text-primary">criarcomluv@gmail.com</a>.
                </p>
                <Button 
                    size="lg" 
                    onClick={() => { setPixData(null); setCheckoutStatus('idle');}}
                    disabled={checkoutStatus === 'loading' || !pageData}
                >
                    Tentar Novamente
                </Button>
            </>
        )
    }
    
    if (searchParams.get('status') === 'pending') {
         return (
            <>
                <div className="p-4 bg-yellow-500/10 rounded-full mb-6 ring-4 ring-yellow-500/20">
                    <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-yellow-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
                Pagamento <span className="text-yellow-500">Pendente</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                    Seu pagamento está sendo processado. Assim que for aprovado, esta página será atualizada automaticamente e você receberá um e-mail de confirmação.
                </p>
            </>
        )
    }

    return (
        <>
            <div className="p-4 bg-primary/10 rounded-full mb-6 ring-4 ring-primary/20">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground font-display">
             Quase lá! Sua página foi criada.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Sua página foi criada e está salva. Para ativá-la e receber o link compartilhável, basta finalizar o pagamento.
            </p>
            <Card className="w-full max-w-lg bg-card/80">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-3 justify-center text-center">
                        Finalize o Pagamento via Pix
                    </CardTitle>
                    <CardDescription className="text-center">
                        Acesso vitalício por R$ {FIXED_PRICE.toFixed(2).replace('.', ',')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pixData ? (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <p className="text-sm text-center text-muted-foreground">Escaneie o QR Code com o app do seu banco ou use o Copia e Cola:</p>
                            <div className="bg-white p-2 rounded-lg">
                                <Image 
                                    src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
                                    width={256}
                                    height={256}
                                    alt="PIX QR Code"
                                />
                            </div>
                            <Button className="w-full" variant="secondary" onClick={handleCopyPixCode}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copiar Código Pix
                            </Button>
                             <p className="text-xs text-muted-foreground text-center pt-2">Aguardando pagamento... A página irá atualizar sozinha após a confirmação.</p>
                        </div>
                    ) : (
                      <div className='space-y-4'>
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Nome Completo do Titular</Label>
                          <Input 
                            id="contactName" 
                            placeholder="Seu nome completo" 
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactCpf">CPF do Titular</Label>
                          <Input 
                            id="contactCpf"
                            placeholder="000.000.000-00" 
                            value={contactCpf}
                            onChange={(e) => {
                                const { value } = e.target;
                                const formattedValue = value
                                    .replace(/\D/g, '')
                                    .replace(/(\d{3})(\d)/, '$1.$2')
                                    .replace(/(\d{3})(\d)/, '$1.$2')
                                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                setContactCpf(formattedValue);
                            }}
                            maxLength={14}
                          />
                        </div>
                        {formError && <p className="text-sm text-destructive">{formError}</p>}
                         <Button 
                            size="lg" 
                            className="w-full" 
                            onClick={handleGeneratePix}
                            disabled={checkoutStatus === 'loading' || !pageData}
                        >
                            {checkoutStatus === 'loading' ? 'Gerando Pix...' : (
                                <>
                                    <QrCode className="mr-2 h-5 w-5" />
                                    Gerar QR Code Pix
                                </>
                            )}
                        </Button>
                      </div>
                    )}
                   
                     {checkoutStatus === 'error' && checkoutError && (
                        <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground p-4 rounded-lg text-sm mt-4 text-left">
                            <h4 className="font-bold mb-2">Ocorreu um erro:</h4>
                            <p className="font-mono text-xs whitespace-pre-wrap">{checkoutError.error}</p>
                            {checkoutError.details && (
                                <pre className="mt-2 text-xs bg-black/30 p-2 rounded-md overflow-x-auto">
                                    {JSON.stringify(checkoutError.details, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </CardContent>
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
