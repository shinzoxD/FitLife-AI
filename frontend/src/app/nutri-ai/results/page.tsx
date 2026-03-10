'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ResultsCard from '@/components/nutri-ai/ResultsCard';

export default function NutriResultsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('nutri_result');
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        // Ignore invalid cached data.
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="text-text-secondary">No Fuel Scan result found yet. Upload a label to continue.</p>
        <Link href="/nutri-ai/upload" className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
          Upload a Label
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 font-display text-2xl font-bold">Fuel Scan Results</h1>
      <ResultsCard data={data} />
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link href="/nutri-ai/upload" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
          Scan Another Label
        </Link>
        <Link href="/dashboard" className="rounded-lg border border-border px-6 py-2.5 text-sm text-text-secondary hover:border-border-hover hover:text-text-primary">
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}
