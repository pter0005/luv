
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoveLightsBackgroundProps {
  color?: 'purple' | 'white';
}

interface Light {
  id: number;
  style: React.CSSProperties;
}

export function LoveLightsBackground({ color = 'purple' }: LoveLightsBackgroundProps) {
    const [lights, setLights] = useState<Light[]>([]);

    useEffect(() => {
        const generatedLights: Light[] = Array.from({ length: 8 }).map((_, i) => {
            const lightColor = color === 'purple' ? 'hsl(257 80% 60% / 0.5)' : 'hsl(0 0% 100% / 0.5)';
            return {
                id: i,
                style: {
                    '--light-left': `${Math.random() * 100}%`,
                    '--light-width': `${Math.random() * 200 + 100}px`,
                    '--light-delay': `${Math.random() * 10}s`,
                    '--light-opacity': Math.random() * 0.3 + 0.1,
                    '--light-color': lightColor,
                } as React.CSSProperties,
            };
        });
        setLights(generatedLights);
    }, [color]);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <div className="relative w-full h-full">
                {lights.map(light => (
                    <div
                        key={light.id}
                        className="love-light"
                        style={light.style}
                    />
                ))}
            </div>
        </div>
    );
}
