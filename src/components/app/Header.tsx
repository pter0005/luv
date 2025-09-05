"use client";

import { Heart, User, Menu, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="absolute top-0 left-0 w-full bg-black/50 border-b border-neutral-800/60 z-50">
      <div className="py-2 px-4 text-left md:text-center font-medium font-sans tracking-tight text-xs md:text-sm bg-gradient-to-r text-white from-red-500 via-rose-800 to-pink-500">
        <p className="text-center text-white">
          <b>✨ Apenas hoje 05/09/2025</b> - Todos os planos com{" "}
          <b className="text-sm md:text-base">50%</b> de desconto, aproveite!
        </p>
      </div>
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
           <Image src="https://storage.googleapis.com/app-prototyping-public-artifacts/logo-name.webp" alt="Heartzzu logo" width={140} height={40}/>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="font-medium hover:text-neutral-300 transition-colors"
          >
            Início
          </Link>
          <Link
            href="/#how-work"
            className="font-medium hover:text-neutral-300 transition-colors"
          >
            Como funciona?
          </Link>
          <Link
            href="/#themes"
            className="font-medium hover:text-neutral-300 transition-colors"
          >
            Temas
          </Link>
          <Link
            href="/#plans"
            className="font-medium hover:text-neutral-300 transition-colors"
          >
            Planos
          </Link>
          <Link
            href="/#faq"
            className="font-medium hover:text-neutral-300 transition-colors"
          >
            F.A.Q
          </Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Selecionar Idioma</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Português</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="hidden lg:inline">Minha conta</span>
          </Button>
        </div>
        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Minha conta</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col space-y-4 mt-8">
              <Link
                  href="/"
                  className="font-medium hover:text-neutral-300 transition-colors"
                >
                  Início
                </Link>
                <Link
                  href="/#how-work"
                  className="font-medium hover:text-neutral-300 transition-colors"
                >
                  Como funciona?
                </Link>
                <Link
                  href="/#themes"
                  className="font-medium hover:text-neutral-300 transition-colors"
                >
                  Temas
                </Link>
                <Link
                  href="/#plans"
                  className="font-medium hover:text-neutral-300 transition-colors"
                >
                  Planos
                </Link>
                <Link
                  href="/#faq"
                  className="font-medium hover:text-neutral-300 transition-colors"
                >
                  F.A.Q
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
