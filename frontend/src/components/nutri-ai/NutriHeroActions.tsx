'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { hasSavedNutritionProfile } from '@/lib/nutri-profile';

export default function NutriHeroActions() {
  const { user, loading } = useAuth();
  const startHref = !loading && hasSavedNutritionProfile(user) ? '/nutri-ai/upload' : '/nutri-ai/profile';
  const secondaryLabel = !loading && hasSavedNutritionProfile(user) ? 'Review Baseline' : 'Jump to Upload';
  const secondaryHref = !loading && hasSavedNutritionProfile(user) ? '/dashboard/settings' : '/nutri-ai/upload';

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link
        href={startHref}
        className="w-full rounded-lg bg-accent px-7 py-3 text-center text-sm font-medium text-white shadow-lg shadow-accent/20 hover:bg-accent-hover sm:w-auto"
      >
        Start a Scan
      </Link>
      <Link
        href={secondaryHref}
        className="w-full rounded-lg border border-border px-7 py-3 text-center text-sm text-text-secondary hover:border-border-hover hover:text-text-primary sm:w-auto"
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}
