'use client';

import { useEffect, useState } from 'react';

interface RainDrop {
  left: string;
  duration: string;
  delay: string;
}

export function WeatherEffects() {
  const [isDark, setIsDark] = useState(true);
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);

  useEffect(() => {
    // Generate rain drops
    const drops = Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      duration: `${0.5 + Math.random() * 0.5}s`,
      delay: `${Math.random() * 2}s`,
    }));
    setRainDrops(drops);
  }, []);

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains('dark'));

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (!isDark) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="rain-container">
        {rainDrops.map((drop, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: drop.left,
              animationDuration: drop.duration,
              animationDelay: drop.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
} 