
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Header } from '@/components/app/Header';
import { Footer } from '@/components/app/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Luv ©',
  description: 'Declare seu amor de forma única',
  icons: {
    icon: 'https://i.imgur.com/EMwsRdt.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@400;600;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
        
        {/* <!-- SEU PIXEL AQUI (Exemplo: Meta Pixel - Carregamento Base) --> */}
        <Script id="meta-pixel-base" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            // Substitua 'SEU_PIXEL_ID' pelo ID do seu pixel
            fbq('init', 'SEU_PIXEL_ID'); 
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* Imagem de fallback para o Meta Pixel */}
          {/* <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=SEU_PIXEL_ID&ev=PageView&noscript=1"
          /> */}
        </noscript>
        {/* <!-- FIM DO PIXEL --> */}

      </head>
      <body
        className={cn(
          'antialiased overflow-x-hidden bg-background min-h-screen'
        )}
      >
        <AuthProvider>
          <div className="relative w-full h-full">
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
