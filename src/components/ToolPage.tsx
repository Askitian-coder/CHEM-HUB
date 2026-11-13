import type { ReactNode } from "react";

export default function ToolPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">{eyebrow}</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">{children}</div>
    </section>
  );
}
