import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function ToolPage({
  eyebrow,
  title,
  description,
  children,
  showBackLink = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  showBackLink?: boolean;
}) {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-7">
        {showBackLink && (
          <Link to="/" className="mb-4 inline-block min-h-11 rounded-lg py-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            ← Back to home
          </Link>
        )}
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">{eyebrow}</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">{children}</div>
    </section>
  );
}
