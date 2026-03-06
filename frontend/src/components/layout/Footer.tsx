import Link from 'next/link';
import { navLinks, site } from '@/lib/site';

const columns = [
  {
    title: 'Product',
    links: navLinks,
  },
  {
    title: 'Studio',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/enterprise', label: 'Teams' },
      { href: '/roadmap', label: 'Roadmap' },
    ],
  },
  {
    title: 'Build',
    links: [{ href: '/developers', label: 'Architecture' }],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <span className="font-display text-lg font-bold text-text-primary">{site.name}</span>
            <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
              A full-stack fitness and nutrition app that turns food labels, workout videos, and meal questions into one measurable routine.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-semibold text-text-primary">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-text-tertiary transition-colors hover:text-text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} {site.name}. Built as a portfolio-grade product demo.
        </div>
      </div>
    </footer>
  );
}
