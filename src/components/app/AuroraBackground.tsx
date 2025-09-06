
"use client";
import React, { useEffect, useState } from 'react';

const AuroraBackground = () => {
  const [items, setItems] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const newItems: React.CSSProperties[] = [];
    for (let i = 0; i < 40; i++) {
      newItems.push({
        transform: `rotate(${Math.random() * 360}deg) translate(0, -${Math.random() * 100}vh)`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 3}s`,
      });
    }
    setItems(newItems);
  }, []);

  return (
    <div className="aurora">
      {items.map((style, i) => (
        <div key={i} className="aurora__item" style={style} />
      ))}
    </div>
  );
};

export { AuroraBackground };
