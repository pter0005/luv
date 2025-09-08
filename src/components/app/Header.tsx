
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
    { href: "/#recursos", label: "Recursos" },
    { href: "/#avaliacoes", label: "Avaliações" },
    { href: "/como-funciona", label: "Como Funciona" },
  ];

  return (
    <header className={cn(
      "sticky top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
    )}>
      <div className="container flex items-center justify-between h-24">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={112} height={112} className="w-24 h-24 md:w-28 md:h-28" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
             <Link key={link.href} href={link.href}>
                <Button variant="link" className="text-foreground/80 hover:text-primary">
                    {link.label}
                </Button>
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
            <Link href="/criar">
                <Button>
                    Criar minha página
                    <Heart className="ml-2 w-4 h-4"/>
                </Button>
            </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm bg-background">
                     <div className="flex flex-col h-full p-4">
                        <div className="mb-8">
                             <Link href="/" className="flex items-center gap-2">
                                <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={112} height={112} className="w-24 h-24" />
                            </Link>
                        </div>
                        <nav className="flex flex-col gap-4">
                           {navLinks.map((link) => (
                             <SheetClose key={link.href} asChild>
                                <Link href={link.href}>
                                    <span className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2 block">{link.label}</span>
                                </Link>
                            </SheetClose>
                          ))}
                        </nav>
                        <div className="mt-auto">
                            <SheetClose asChild>
                                <Link href="/criar" className="w-full">
                                    <Button size="lg" className="w-full">
                                        Criar minha página
                                        <Heart className="ml-2 w-4 h-4"/>
                                    </Button>
                                </Link>
                            </SheetClose>
                        </div>
                     </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
