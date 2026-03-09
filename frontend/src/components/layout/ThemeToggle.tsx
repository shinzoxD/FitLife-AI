'use client';

import { useTheme } from '@/lib/theme';

interface ThemeToggleProps {
  compact?: boolean;
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z" />
    </svg>
  );
}

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = mounted ? theme === 'dark' : false;
  const label = isDark ? 'Light mode' : 'Dark mode';

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-secondary text-text-secondary transition-colors hover:border-border-hover hover:bg-bg-tertiary hover:text-text-primary"
        aria-label={label}
        title={label}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary transition-colors hover:border-border-hover hover:bg-bg-tertiary hover:text-text-primary"
      aria-label={label}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span>{label}</span>
    </button>
  );
}
