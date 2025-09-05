"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 border-t border-t-border bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          <p className="font-bold text-lg">Luv</p>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Link href="/termos" className="hover:text-foreground transition-colors">Termos de uso</Link>
          <Link href="/privacidade" className="hover:text-foreground transition-colors">Política de privacidade</Link>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Copyright © {new Date().getFullYear()} - Luv.com</p>
        </div>
      </div>
    </footer>
  );
}