
"use client";

import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  style: React.CSSProperties;
}

const colors = [
    'hsl(350, 100%, 92%)', // Light Pink
    'hsl(60, 100%, 90%)',  // Light Yellow
    'hsl(0, 100%, 90%)',   // Light Red
    'hsl(308, 100%, 92%)', // Light Orchid
    'hsl(300, 100%, 90%)'  // Light Purple
];


export function ColoredStarsBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = Array.from({ length: 250 }).map((_, i) => {
        const size = Math.random() * 1 + 0.5; // 0.5px to 1.5px
        const color = colors[Math.floor(Math.random() * colors.length)];
        return {
          id: i,
          style: {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            boxShadow: `0 0 4px 1px ${color}`,
            animationDuration: `${Math.random() * 3 + 2}s`, // 2s to 5s
            animationDelay: `${Math.random() * 3}s`,
          },
        };
      });
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="relative w-full h-full">
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={star.style}
          />
        ))}
      </div>
    </div>
  );
}
