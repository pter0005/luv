
"use client";

import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import React from "react";
import Image from 'next/image';

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#recursos", label: "Recursos" },
    { href: "#temas", label: "Temas" },
    { href: "#avaliacoes", label: "Avaliações" },
    { href: "#planos", label: "Planos" },
    { href: "#faq", label: "F.A.Q" },
  ];

  return (
    <header className={cn(
      "sticky top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
    )}>
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20" />
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Entrar</Button>
          <Link href="/criar">
            <Button>Criar Página</Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-2 mt-8">
                {navLinks.map(link => (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href} className="text-lg font-medium hover:text-primary transition-colors p-2 rounded-md">
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-8 pt-8 border-t border-border space-y-4">
                 <Button variant="ghost" className="w-full">Entrar</Button>
                 <Link href="/criar" className="w-full">
                    <Button className="w-full">Criar Página</Button>
                 </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

    