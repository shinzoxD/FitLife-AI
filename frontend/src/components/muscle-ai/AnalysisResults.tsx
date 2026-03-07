'use client';

import type { MuscleAnalysisResult } from '@/lib/types';

interface Props {
  data: MuscleAnalysisResult | Record<string, unknown>;
}

export default function AnalysisResults({ data }: Props) {
  if (!data) return null;
  const nestedResult =
    'result' in data && typeof data.result === 'object' && data.result !== null
      ? data.result
      : data;
  const result = nestedResult as MuscleAnalysisResult & Record<string, unknown>;
  const formScore = Number(result.form_score ?? result.score ?? 0);
  const repsValue = result.reps ?? result.rep_count;
  const reps = typeof repsValue === 'number' || typeof repsValue === 'string' ? repsValue : '-';
  const feedbackSource = result.feedback ?? result['tips'] ?? result.recommendations ?? [];
  const feedback = Array.isArray(feedbackSource) ? feedbackSource.filter((tip): tip is string => typeof tip === 'string') : [];
  const scoreColor = formScore >= 70 ? 'text-accent' : formScore >= 40 ? 'text-warning' : 'text-error';
  const scoreBg = formScore >= 70 ? 'bg-accent-glow' : formScore >= 40 ? 'bg-warning/10' : 'bg-error/10';
  const duration = typeof result.duration_seconds === 'number' ? `${result.duration_seconds.toFixed(1)}s` : '-';
  const frames = typeof result.frames_analyzed === 'number' ? result.frames_analyzed : '-';
  const label = typeof result.exercise_label === 'string' ? result.exercise_label : 'Movement';
  const movement = result.movement_assessment ?? {};
  const detailCards = [
    { label: 'Form quality', value: movement.form_quality },
    { label: 'Depth quality', value: movement.depth_quality },
    { label: 'Form consistency', value: movement.form_consistency },
    { label: 'Depth consistency', value: movement.depth_consistency },
  ].filter((item) => typeof item.value === 'number');

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center rounded-xl border border-border bg-bg-secondary p-8 text-center">
        <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full ${scoreBg}`}>
          <span className={`text-3xl font-bold ${scoreColor}`}>{formScore}</span>
        </div>
        <h3 className="text-xl font-bold">{label} Score</h3>
        <p className="mt-1 text-text-secondary">Estimated reps: {reps}</p>
        <p className="mt-1 text-xs text-text-tertiary">Duration: {duration} • Frames analyzed: {frames}</p>
      </div>

      {result.video_url && (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-secondary p-4">
          <video src={result.video_url} controls className="w-full rounded-lg" preload="metadata" />
        </div>
      )}

      {detailCards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {detailCards.map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-bg-secondary p-4">
              <p className="text-xs uppercase tracking-wide text-text-tertiary">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}/10</p>
            </div>
          ))}
        </div>
      )}

      {feedback.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 className="mb-4 font-semibold">Coaching Notes</h3>
          <ul className="space-y-2">
            {feedback.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-0.5 text-accent">&#8226;</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
