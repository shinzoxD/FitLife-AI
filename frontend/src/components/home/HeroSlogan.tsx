'use client';

import { useEffect, useState } from 'react';

const slogans = [
  'One FitLife workflow.',
  'One system for food and form.',
  'One coach for meals and recovery.',
  'One dashboard for better choices.',
];

export default function HeroSlogan() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % slogans.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      key={slogans[index]}
      className="fitlife-slogan-slide inline-block text-accent"
    >
      {slogans[index]}
    </span>
  );
}
