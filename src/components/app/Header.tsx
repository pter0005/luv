
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

  return (
    <header className={cn(
      "sticky top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
    )}>
      <div className="container flex items-center justify-center h-24">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={112} height={112} className="w-24 h-24 md:w-28 md:h-28" />
        </Link>
      </div>
    </header>
  );
}
