"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  fixed?: boolean;
}

export function AnimatedBackground({ fixed = false }: AnimatedBackgroundProps) {
  return (
    <div className={cn(
      "top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none",
      fixed ? "fixed" : "absolute"
    )}>
       <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-background via-background/80 to-transparent"></div>
       <div className="absolute top-0 left-0 w-full h-full purple-fog"></div>
    </div>
  );
}
