
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const phrases = [
  "de forma única!",
  "para alguem especial!",
  "pra quem merece!",
];

export function TypingAnimation() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (isDeleting) {
      if (subIndex === 0) {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      } else {
        const timeout = setTimeout(() => {
          setSubIndex((prevSubIndex) => prevSubIndex - 1);
          setText(phrases[index].substring(0, subIndex - 1));
        }, 80);
        return () => clearTimeout(timeout);
      }
    } else {
      if (subIndex === phrases[index].length) {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setSubIndex((prevSubIndex) => prevSubIndex + 1);
          setText(phrases[index].substring(0, subIndex + 1));
        }, 120);
        return () => clearTimeout(timeout);
      }
    }
  }, [subIndex, index, isDeleting]);

  return (
    <span
      className={cn(
        "block font-handwriting text-primary text-5xl md:text-6xl lg:text-7xl mt-1 h-20",
      )}
    >
      {text}
      <span className="animate-blink">|</span>
    </span>
  );
}

    
    