
import type { Metadata } from 'next';
import { Poppins, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Header } from '@/components/app/Header';
import { Footer } from '@/components/app/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-dancing',
});

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
    <html lang="pt" className={cn("dark scroll-smooth", poppins.variable, playfair.variable, dancing.variable)}>
      <head>
        {/* <!-- Meta Pixel Code --> */}
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
            
            fbq('init', '1528046218358955'); 
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=1528046218358955&ev=PageView&noscript=1"
          />
        </noscript>
        {/* <!-- End Meta Pixel Code --> */}
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
