
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  style: React.CSSProperties;
}

export function VortexBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = Array.from({ length: 200 }).map((_, i) => {
        const angle = Math.random() * 360;
        const radius = Math.random() * 40 + 10; // 10vw to 50vw
        return {
          id: i,
          style: {
            '--angle': `${angle}deg`,
            '--radius': `${radius}vw`,
            '--delay': `${Math.random() * -20}s`,
            '--duration': `${Math.random() * 10 + 10}s`,
          } as React.CSSProperties,
        };
      });
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className={cn("absolute inset-0 w-full h-full overflow-hidden bg-black")}>
      <div className="vortex-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="vortex-particle"
            style={particle.style}
          />
        ))}
      </div>
    </div>
  );
}

