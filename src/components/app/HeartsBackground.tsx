
"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface HeartStyle {
  id: number;
  style: React.CSSProperties;
}

export function HeartsBackground() {
  const [hearts, setHearts] = useState<HeartStyle[]>([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: 40 }).map((_, i) => {
        const size = Math.random() * 4 + 1; // Aumentado de 0.5rem-3rem para 1rem-5rem
        return {
          id: i,
          style: {
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 10 + 10}s`, // 10s to 20s
            animationDelay: `${Math.random() * 15}s`,
            width: `${size}rem`,
            height: `${size}rem`,
          },
        }
    });
    setHearts(generatedHearts);
  }, []);

  if (hearts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none overflow-hidden">
        <div className="relative w-full h-full">
            {hearts.map(heart => (
            <div
                key={heart.id}
                className="heart"
                style={heart.style}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </div>
            ))}
      </div>
    </div>
  );
}
