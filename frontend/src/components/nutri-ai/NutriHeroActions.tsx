'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { hasSavedNutritionProfile } from '@/lib/nutri-profile';

export default function NutriHeroActions() {
  const { user, loading } = useAuth();
  const profileReady = hasSavedNutritionProfile(user);
  const startHref = loading ? '/nutri-ai' : profileReady ? '/nutri-ai/upload' : '/nutri-ai/profile';
  const secondaryLabel = loading ? 'Loading Profile...' : profileReady ? 'Review Baseline' : 'Set Baseline';
  const secondaryHref = loading ? '/nutri-ai' : profileReady ? '/dashboard/settings' : '/nutri-ai/profile';
  const disabledClass = loading ? 'pointer-events-none opacity-70' : '';

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link
        href={startHref}
        aria-disabled={loading}
        className={`w-full rounded-lg bg-accent px-7 py-3 text-center text-sm font-medium text-white shadow-lg shadow-accent/20 hover:bg-accent-hover sm:w-auto ${disabledClass}`}
      >
        {loading ? 'Checking your profile...' : 'Start a Scan'}
      </Link>
      <Link
        href={secondaryHref}
        aria-disabled={loading}
        className={`w-full rounded-lg border border-border px-7 py-3 text-center text-sm text-text-secondary hover:border-border-hover hover:text-text-primary sm:w-auto ${disabledClass}`}
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}
