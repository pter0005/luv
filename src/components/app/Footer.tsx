
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-8 border-t border-t-border bg-background/80 backdrop-blur-sm">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
         <Link href="/" className="flex items-center gap-2">
          <Image src="https://imgur.com/rmStAv2.png" alt="Luv Logo" width={120} height={120} className="w-24 h-24" />
        </Link>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Luv. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
                <Link href="/termos" className="hover:text-primary transition-colors">Termos de uso</Link>
                <Link href="/privacidade" className="hover:text-primary transition-colors">Política de privacidade</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
