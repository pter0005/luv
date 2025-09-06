
"use client";

import React from 'react';

export function HeartsBackground() {
  const hearts = Array.from({ length: 15 }); // Create 15 hearts

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      {hearts.map((_, i) => (
        <div
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 5 + 5}s`, // 5 to 10 seconds
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 1.5 + 0.5}rem`, // 0.5rem to 2rem
          }}
        >
          ❤
        </div>
      ))}
    </div>
  );
}
