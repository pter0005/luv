"use client";

import { Heart, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="py-2 px-4 md:px-6 bg-transparent absolute top-0 left-0 right-0 z-50">
       <div className="w-full text-center py-2 bg-primary/80 backdrop-blur-sm mb-2 rounded-lg">
          <p className="text-sm font-medium text-primary-foreground">
            ✨ Special Offer! 50% off on all plans, enjoy!
          </p>
        </div>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Heart className="w-8 h-8 text-primary transition-all group-hover:fill-primary" />
          <h1 className="text-3xl font-bold text-white font-headline">
            Heartzzu
          </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="#" className="hover:text-white transition-colors">How it works?</Link>
            <Link href="#" className="hover:text-white transition-colors">Themes</Link>
            <Link href="#" className="hover:text-white transition-colors">Plans</Link>
            <Link href="#" className="hover:text-white transition-colors">F.A.Q</Link>
        </nav>
        <div>
          <Button variant="ghost">
            <User className="mr-2 h-5 w-5" />
            My Account
          </Button>
        </div>
      </div>
    </header>
  );
}
