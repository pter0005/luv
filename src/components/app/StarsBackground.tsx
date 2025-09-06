
"use client";

import React from 'react';

export function StarsBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      <div className="stars"></div>
      <div className="twinkling"></div>
    </div>
  );
}
