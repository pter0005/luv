
"use client";

import { Heart, Menu, User, LogOut, LayoutDashboard } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const navLinks = [
    { href: "/#recursos", label: "Recursos" },
    { href: "/#avaliacoes", label: "Avaliações" },
    { href: "/como-funciona", label: "Como Funciona" },
  ];

  const renderAuthSection = () => {
    if (loading) {
      return null;
    }
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`} alt="Avatar" />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem onClick={() => router.push('/dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Minhas Páginas</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Link href="/login">
        <Button>
          Login
          <User className="ml-2 w-4 h-4"/>
        </Button>
      </Link>
    );
  };

  return (
    <header className={cn(
      "sticky top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
    )}>
      <div className="container flex items-center justify-between h-24">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://imgur.com/rmStAv2.png" alt="Luv Logo" width={140} height={140} className="w-28 h-28 md:w-32 md:h-32" />
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
            {renderAuthSection()}
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
                                <Image src="https://imgur.com/rmStAv2.png" alt="Luv Logo" width={140} height={140} className="w-32 h-32" />
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
                           {user ? (
                               <div className="space-y-2">
                                    <SheetClose asChild>
                                        <Link href="/dashboard" className="w-full">
                                            <Button size="lg" variant="outline" className="w-full">Minhas Páginas</Button>
                                        </Link>
                                    </SheetClose>
                                     <SheetClose asChild>
                                        <Button size="lg" className="w-full" onClick={handleLogout}>Sair</Button>
                                    </SheetClose>
                               </div>
                           ) : (
                               <SheetClose asChild>
                                    <Link href="/login" className="w-full">
                                        <Button size="lg" className="w-full">
                                            Login
                                            <Heart className="ml-2 w-4 h-4"/>
                                        </Button>
                                    </Link>
                                </SheetClose>
                           )}
                        </div>
                     </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
