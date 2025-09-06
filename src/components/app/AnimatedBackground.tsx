
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  fixed?: boolean;
}

export function AnimatedBackground({ fixed = false }: AnimatedBackgroundProps) {
  return (
    <div className={cn(
      "top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none purple-fog",
      fixed ? "fixed" : "absolute"
    )}>
    </div>
  );
}
