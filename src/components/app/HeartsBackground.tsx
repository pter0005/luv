
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeartsBackgroundProps {
  color?: 'purple' | 'red';
}

export function HeartsBackground({ color = 'purple' }: HeartsBackgroundProps) {
  const [hearts, setHearts] = useState<any[]>([]);

  const heartColorClass = color === 'red' ? 'text-red-500' : 'text-primary';

  useEffect(() => {
    const generatedHearts = Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 4 + 2; // 2rem to 6rem
        const rotation = Math.random() * 90 - 45; // -45deg to 45deg
        return {
        id: i,
        style: {
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 15 + 15}s`, // 15s to 30s
            animationDelay: `${Math.random() * 5}s`,
            width: `${size}rem`,
            height: `${size}rem`,
            transform: `rotate(${rotation}deg)`,
        },
        };
    });
    setHearts(generatedHearts);
  }, []); 

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="relative w-full h-full">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="heart"
            style={heart.style}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("w-full h-full", heartColorClass)}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 .81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

    