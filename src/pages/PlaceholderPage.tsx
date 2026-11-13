export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-3xl py-10 text-center sm:py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-600">ChemHub study tools</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
      <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-indigo-500" />
    </section>
  );
}
