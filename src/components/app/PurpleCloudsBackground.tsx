
"use client";

import React, { useEffect, useState } from 'react';

interface Cloud {
  id: number;
  style: React.CSSProperties;
}

export function PurpleCloudsBackground() {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    const generateClouds = () => {
      const newClouds: Cloud[] = Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 150 + 100; // 100px to 250px
        const top = Math.random() * 100; // 0% to 100%
        const left = Math.random() * 100; // 0% to 100%
        return {
          id: i,
          style: {
            '--cloud-size': `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
          } as React.CSSProperties,
        };
      });
      setClouds(newClouds);
    };

    generateClouds();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="relative w-full h-full"
        style={{
            animation: `move-clouds-rtl 80s linear infinite`,
        }}
      >
        {clouds.map(cloud => (
          <div key={cloud.id} className="purple-cloud" style={cloud.style}></div>
        ))}
      </div>
    </div>
  );
}
