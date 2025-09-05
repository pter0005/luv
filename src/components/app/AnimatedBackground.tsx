"use client";

import React from 'react';

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export function AnimatedBackground() {
  // Create an array of 20 elements to map over
  const hearts = Array.from({ length: 20 });

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none purple-fog">
      <div className="relative w-full h-full">
        {hearts.map((_, i) => {
          const size = Math.random() * 2.5 + 0.5; // size between 0.5rem and 3rem
          const left = Math.random() * 100;
          const animationDuration = Math.random() * 10 + 10; // duration between 10s and 20s
          const animationDelay = Math.random() * 15; // delay up to 15s

          return (
            <div
              key={i}
              className="absolute bottom-[-10rem] text-primary/50"
              style={{
                left: `${left}vw`,
                width: `${size}rem`,
                height: `${size}rem`,
                animation: `rise ${animationDuration}s linear ${animationDelay}s infinite`,
              }}
            >
              <HeartIcon />
            </div>
          );
        })}
      </div>
    </div>
  );
}

    