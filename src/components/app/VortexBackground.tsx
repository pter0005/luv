
"use client";
import React, { useEffect, useState } from 'react';

const VortexBackground = () => {
  const [items, setItems] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const newItems: React.CSSProperties[] = [];
    const center = { x: '50vw', y: '50vh' };
    for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 500;
        newItems.push({
            '--tx': `${Math.cos(angle) * radius}px`,
            '--ty': `${Math.sin(angle) * radius}px`,
            top: center.y,
            left: center.x,
            animationDelay: `${Math.random() * 10}s`,
        } as React.CSSProperties);
    }
    setItems(newItems);
  }, []);

  return (
    <div className="vortex">
      {items.map((style, i) => (
        <div key={i} className="vortex-item" style={style} />
      ))}
    </div>
  );
};

export { VortexBackground };

    