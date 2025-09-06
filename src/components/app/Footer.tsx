
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-8 border-t border-t-border bg-background/80 backdrop-blur-sm">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
         <Link href="/" className="flex items-center gap-2">
          <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={80} height={80} className="w-16 h-16" />
        </Link>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Link href="/termos" className="hover:text-foreground transition-colors text-sm">Termos de uso</Link>
          <Link href="/privacidade" className="hover:text-foreground transition-colors text-sm">Política de privacidade</Link>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Copyright © {new Date().getFullYear()} - Luv.com</p>
        </div>
      </div>
    </footer>
  );
}
