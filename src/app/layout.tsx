
import type { Metadata } from 'next';
import { Poppins, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Header } from '@/components/app/Header';
import { Footer } from '@/components/app/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

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
      <head/>
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

    