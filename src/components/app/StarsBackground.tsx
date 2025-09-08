
"use client";
import React, { useEffect, useState } from 'react';

export function StarsBackground() {
  const [meteors, setMeteors] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const newMeteors: React.CSSProperties[] = [];
    for (let i = 0; i < 10; i++) {
      newMeteors.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${Math.random() * 5 + 5}s`,
      });
    }
    setMeteors(newMeteors);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 stars-bg">
      <div className="stars1"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      {meteors.map((style, i) => (
        <div key={i} className="meteor" style={style}></div>
      ))}
    </div>
  );
}
