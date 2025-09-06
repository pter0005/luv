
"use client";

import React, { useState, useEffect } from 'react';

interface Heart {
  id: number;
  style: React.CSSProperties;
}

export function HeartsBackground() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // This code now runs only on the client, after the component has mounted.
    const generatedHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 5 + 5}s`, // 5 to 10 seconds
        animationDelay: `${Math.random() * 5}s`,
        fontSize: `${Math.random() * 1.5 + 0.5}rem`, // 0.5rem to 2rem
      },
    }));
    setHearts(generatedHearts);
  }, []); // The empty dependency array ensures this effect runs only once.

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart"
          style={heart.style}
        >
          ❤
        </div>
      ))}
    </div>
  );
}
