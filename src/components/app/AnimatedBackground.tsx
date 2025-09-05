
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

interface AnimatedBackgroundProps {
  fixed?: boolean;
}

interface HeartStyle {
    left: string;
    width: string;
    height: string;
    animation: string;
    opacity: number;
}

export function AnimatedBackground({ fixed = false }: AnimatedBackgroundProps) {
  const [hearts, setHearts] = useState<HeartStyle[]>([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: 60 }).map(() => {
        const size = Math.random() * 3.5 + 1.5; // size between 1.5rem and 5rem
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10; // duration between 10s and 20s
        const animationDelay = Math.random() * 15; // delay up to 15s
        const opacity = Math.random() * 0.5 + 0.3; // opacity between 0.3 and 0.8
        
        return {
            left: `${left}vw`,
            width: `${size}rem`,
            height: `${size}rem`,
            animation: `rise ${animationDuration}s linear ${animationDelay}s infinite`,
            opacity: opacity,
        };
    });
    setHearts(generatedHearts);
  }, []);

  return (
    <div className={cn(
      "top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none purple-fog",
      fixed ? "fixed" : "absolute"
    )}>
      <div className="relative w-full h-full">
        {hearts.map((style, i) => (
            <div
              key={i}
              className="absolute bottom-[-10rem] text-primary"
              style={style}
            >
              <HeartIcon />
            </div>
        ))}
      </div>
    </div>
  );
}
