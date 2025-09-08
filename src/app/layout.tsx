
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Header } from '@/components/app/Header';
import { Footer } from '@/components/app/Footer';
import { AnimatedBackground } from '@/components/app/AnimatedBackground';
import { HeartsBackground } from '@/components/app/HeartsBackground';

export const metadata: Metadata = {
  title: 'Luv ©',
  description: 'Declare seu amor de forma única',
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
      </head>
      <body
        className={cn(
          'antialiased overflow-x-hidden bg-background min-h-screen'
        )}
      >
        <div className="relative w-full h-full">
          <AnimatedBackground fixed />
          <HeartsBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
