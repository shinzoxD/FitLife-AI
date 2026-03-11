'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { User } from '@/lib/types';
import { site } from '@/lib/site';
import ThemeToggle from './ThemeToggle';

interface Props {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  user: User | null;
  loading?: boolean;
  onLogout: () => void;
}

export default function MobileMenu({ open, onClose, links, user, loading = false, onLogout }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" onClick={onClose} />
      <div
        ref={panelRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-full flex-col border-l border-border bg-bg-secondary/98 shadow-2xl shadow-black/35 backdrop-blur-xl animate-in slide-in-from-right sm:w-[24rem]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <span className="font-display text-lg font-bold">{site.name}</span>
          <button
            onClick={onClose}
            className="rounded-lg border border-border p-2 text-text-secondary transition-colors hover:border-border-hover hover:bg-bg-elevated hover:text-text-primary"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-xl border border-transparent px-4 py-3 text-base text-text-secondary transition-colors hover:border-border hover:bg-bg-tertiary hover:text-text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-border px-5 py-5 sm:px-6">
          <ThemeToggle />
          {loading ? (
            <div className="h-12 animate-pulse rounded-lg border border-border bg-bg-tertiary" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-medium text-white hover:bg-accent-hover"
              >
                Open Dashboard
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="block w-full rounded-lg border border-border px-4 py-3 text-center text-sm text-text-secondary hover:text-text-primary"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full rounded-lg bg-bg-tertiary px-4 py-3 text-center text-sm text-text-primary hover:bg-bg-elevated"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-medium text-white hover:bg-accent-hover"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
