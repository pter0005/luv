
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Star {
  id: number;
  style: React.CSSProperties;
}

interface Meteor {
  id: number;
  style: React.CSSProperties;
}

export function StarsBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = Array.from({ length: 150 }).map((_, i) => {
        const size = Math.random() * 2 + 1; // 1px to 3px
        return {
          id: i,
          style: {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${Math.random() * 3 + 2}s`, // 2s to 5s
            animationDelay: `${Math.random() * 3}s`,
          },
        };
      });
      setStars(newStars);
    };

    const generateMeteors = () => {
        const newMeteors: Meteor[] = Array.from({ length: 7 }).map((_, i) => ({
            id: i,
            style: {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`, // 5s to 10s
                animationDelay: `${Math.random() * 10 + 2}s`, // 2s to 12s
            }
        }));
        setMeteors(newMeteors);
    }

    generateStars();
    generateMeteors();
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
         {meteors.map(meteor => (
          <div
            key={meteor.id}
            className="meteor"
            style={meteor.style}
          />
        ))}
      </div>
    </div>
  );
}
