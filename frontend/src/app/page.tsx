import Link from 'next/link';
import { products, stackHighlights } from '@/lib/site';

const productIcons = [
  (
    <svg key="fuel" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" />
    </svg>
  ),
  (
    <svg key="form" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  (
    <svg key="coach" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z" />
      <path d="M17 4a2 2 0 0 0 2 2c-1.5 0-2 1-2 2 0-1-.5-2-2-2a2 2 0 0 0 2-2" />
    </svg>
  ),
];

const featureProof = [
  ['3 AI-powered product flows', 'Nutrition scan, form analysis, and chat coaching built behind one UX.'],
  ['JWT auth + dashboard states', 'Profile-aware recommendations, history tables, and session handling.'],
  ['Production-style stack', 'Next.js 15 frontend, Flask gateway, OCR, YOLOv8, and retrieval chat.'],
];

const differentiators = [
  ['Original product framing', 'Fuel Scan, Form Coach, and FitLife Coach create a distinct brand identity.'],
  ['Portfolio-friendly narrative', 'Architecture, roadmap, and feature pages explain why the stack matters.'],
  ['Demo-first UX', 'Flows are designed to be explored quickly during a resume or interview walkthrough.'],
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(23,127,132,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-accent/30 bg-accent-glow px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Resume-ready full-stack build
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Labels, lifts, and meals.
              <br />
              <span className="text-accent">One FitLife workflow.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
              FitLife packages OCR nutrition scanning, video-based form analysis, and an AI meal coach into one product experience built with Next.js, Flask, computer vision, and RAG.
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-accent px-7 py-3 text-sm font-medium text-white shadow-lg shadow-accent/15 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/20"
            >
              Explore the App
            </Link>
            <Link
              href="/developers"
              className="rounded-lg border border-border px-7 py-3 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              View Architecture
            </Link>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {featureProof.map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-border bg-bg-secondary/80 p-6 text-left shadow-sm shadow-black/5">
                <p className="font-display text-lg font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold">Three focused tools, one fitness system</h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
            Each surface solves a clear user problem, but the real value comes from combining them into one daily routine.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <Link
              key={product.href}
              href={product.href}
              className="group relative rounded-2xl border border-border bg-bg-secondary p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
            >
              <span className="absolute right-6 top-6 rounded-full border border-accent/30 bg-accent-glow px-2.5 py-0.5 text-xs font-semibold text-accent">
                {product.badge}
              </span>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                {productIcons[index]}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{product.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{product.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="rounded-full border border-accent/30 bg-accent-glow px-3 py-1 text-xs font-semibold text-accent">
                Built Like a Product
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold">Strong resume signal without feeling like a toy</h2>
              <p className="mt-4 leading-relaxed text-text-secondary">
                FitLife demonstrates frontend craft, system design, AI integration, and product thinking in one repo. The flows are opinionated, measurable, and easy to demo.
              </p>
              <ul className="mt-6 space-y-3">
                {stackHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-bg-primary p-6 font-mono text-sm shadow-sm shadow-black/5">
              <div className="mb-1 text-text-tertiary"># Upload a food label to Fuel Scan</div>
              <div>
                <span className="text-accent">curl</span> -X POST /api/v1/nutri-ai/upload \
              </div>
              <div className="pl-4">-H &quot;Authorization: Bearer $TOKEN&quot; \</div>
              <div className="pl-4">-F &quot;image=@label.jpg&quot;</div>
              <div className="mt-6 mb-1 text-text-tertiary"># Poll a workout analysis job</div>
              <div>
                <span className="text-accent">curl</span> /api/v1/muscle-ai/task/TASK_ID
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[2rem] border border-border bg-[linear-gradient(135deg,rgba(255,249,240,0.94),rgba(239,227,209,0.88))] p-10 shadow-sm shadow-black/5 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr]">
            <div>
              <h2 className="font-display text-3xl font-bold">Why this works well as a portfolio build</h2>
              <p className="mt-4 max-w-2xl text-text-secondary">
                FitLife combines product branding, user flows, and technical depth into a single project that is easy to demo and easy to explain.
              </p>
            </div>

            <div className="grid gap-4">
              {differentiators.map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-border bg-bg-elevated/80 p-5">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-secondary">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl font-bold">Take FitLife from polished demo to interview talking point.</h2>
          <p className="mt-4 text-text-secondary">
            Walk through the product flows, explain the architecture, and ship it as a resume project with real technical depth.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-accent px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover"
          >
            Launch the Demo
          </Link>
        </div>
      </section>
    </>
  );
}
