'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';

const slogans = [
  'One FitLife workflow.',
  'One system for food and form.',
  'One coach for meals and recovery.',
  'One dashboard for better choices.',
];

const HOLD_MS = 2200;
const EXIT_WINDOW_MS = 520;

export default function HeroSlogan() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  const words = useMemo(() => slogans[index].split(' '), [index]);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setPhase('exit');
    }, HOLD_MS);

    const swapTimer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slogans.length);
      setPhase('enter');
    }, HOLD_MS + EXIT_WINDOW_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(swapTimer);
    };
  }, [index]);

  return (
    <span className="fitlife-slogan-shell inline-flex justify-center text-accent" aria-live="polite">
      <span key={`${phase}-${index}`} className={`fitlife-slogan-line fitlife-slogan-line--${phase}`}>
        {words.map((word, wordIndex) => (
          <span
            key={`${index}-${word}-${wordIndex}`}
            className="fitlife-slogan-word"
            style={{ ['--word-index' as string]: wordIndex } as CSSProperties}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
