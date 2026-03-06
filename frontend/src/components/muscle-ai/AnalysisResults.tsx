'use client';

interface Props {
  data: Record<string, unknown>;
}

export default function AnalysisResults({ data }: Props) {
  if (!data) return null;
  const result = (
    typeof data.result === 'object' && data.result !== null ? data.result : data
  ) as Record<string, unknown>;
  const formScore = Number(result.form_score ?? result.score ?? 0);
  const repsValue = result.reps ?? result.rep_count;
  const reps = typeof repsValue === 'number' || typeof repsValue === 'string' ? repsValue : '-';
  const feedbackSource = result.feedback ?? result.tips ?? result.recommendations ?? [];
  const feedback = Array.isArray(feedbackSource) ? feedbackSource.filter((tip): tip is string => typeof tip === 'string') : [];
  const scoreColor = formScore >= 70 ? 'text-accent' : formScore >= 40 ? 'text-warning' : 'text-error';
  const scoreBg = formScore >= 70 ? 'bg-accent-glow' : formScore >= 40 ? 'bg-warning/10' : 'bg-error/10';

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center rounded-xl border border-border bg-bg-secondary p-8 text-center">
        <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full ${scoreBg}`}>
          <span className={`text-3xl font-bold ${scoreColor}`}>{formScore}</span>
        </div>
        <h3 className="text-xl font-bold">Movement Score</h3>
        <p className="mt-1 text-text-secondary">Estimated reps: {reps}</p>
      </div>

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
