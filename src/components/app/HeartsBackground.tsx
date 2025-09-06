
"use client";

import React, { useState, useEffect } from 'react';

export function HeartsBackground() {
  const [hearts, setHearts] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const createHeart = () => {
      const heart = (
        <div
          key={Math.random()}
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
      );
      setHearts((prevHearts) => [...prevHearts, heart]);

      // Remove heart after animation finishes to prevent DOM buildup
      setTimeout(() => {
        setHearts((prevHearts) => prevHearts.slice(1));
      }, 10000); // Should match longest animation duration
    };

    const interval = setInterval(createHeart, 500); // Create a new heart every 500ms

    return () => clearInterval(interval);
  }, []);

  return <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">{hearts}</div>;
}
