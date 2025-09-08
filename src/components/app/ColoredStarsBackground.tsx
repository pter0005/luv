
"use client";

import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  style: React.CSSProperties;
}

const colors = ['#FFC0CB', '#FFFF00', '#FF0000', '#DA70D6', '#800080'];

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
