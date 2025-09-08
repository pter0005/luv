
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-8 border-t border-t-border bg-background/80 backdrop-blur-sm">
      <div className="container flex flex-col md:flex-row items-center justify-center gap-6">
         <Link href="/" className="flex items-center gap-2">
          <Image src="https://i.imgur.com/EMwsRdt.png" alt="Luv Logo" width={100} height={100} className="w-20 h-20" />
        </Link>
      </div>
    </footer>
  );
}
