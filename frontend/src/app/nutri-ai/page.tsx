import NutriHeroActions from '@/components/nutri-ai/NutriHeroActions';

const steps = [
  { title: 'Set your baseline', desc: 'Capture your age, goal, activity level, and diet so the scoring model has useful context.' },
  { title: 'Scan the label', desc: 'Upload any nutrition panel and let OCR extract the nutrient values in seconds.' },
  { title: 'Review the fit', desc: 'Get a goal-aware score, readable nutrient breakdown, and AI-generated guidance.' },
];

export default function NutriAIPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="fitlife-accent-glow absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-24 text-center sm:px-6 sm:pb-20 sm:pt-28">
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent-glow px-3 py-1 text-xs font-semibold text-accent">
            FUEL SCAN
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Turn any food label into
            <br />
            <span className="text-accent">a smarter daily choice.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            Fuel Scan reads packaged nutrition labels, calculates a fit score, and explains the tradeoffs based on your training goal and profile.
          </p>
          <NutriHeroActions />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-xl border border-border bg-bg-secondary p-8 text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                {index + 1}
              </div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm text-text-secondary">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
