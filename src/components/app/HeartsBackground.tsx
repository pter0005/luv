
"use client";

import React from 'react';

export function HeartsBackground() {
  const heartCount = 40;

  // Use um array simples e Math.random() diretamente no JSX.
  // Isso é mais simples e menos propenso a erros de ciclo de vida do React.
  const hearts = Array.from({ length: heartCount }).map((_, i) => {
    const size = Math.random() * 2 + 1; // 1rem to 3rem
    const rotation = Math.random() * 50 - 25; // -25deg to 25deg
    return {
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 5 + 5}s`, // 5s to 10s
        animationDelay: `${Math.random() * 5}s`,
        width: `${size}rem`,
        height: `${size}rem`,
        transform: `rotate(${rotation}deg)`,
      },
    };
  });

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="relative w-full h-full">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="heart"
            style={heart.style}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 .81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
