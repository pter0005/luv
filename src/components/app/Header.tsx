"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="py-4 px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Heart className="w-7 h-7 text-primary transition-all group-hover:fill-primary" />
          <h1 className="text-2xl font-bold text-primary font-headline">
            Forever Yours
          </h1>
        </Link>
      </div>
    </header>
  );
}
