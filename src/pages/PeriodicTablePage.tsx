import PeriodicTable from "../components/PeriodicTable";

export default function PeriodicTablePage() {
  return (
    <section>
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">Explore the elements</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Periodic Table</h1>
        <p className="mt-3 text-slate-600">An interactive periodic table of all 118 elements. Atomic weights are rounded for study use; see the <a className="font-semibold text-indigo-700 underline" href="https://ciaaw.org/atomic-weights.htm" target="_blank" rel="noreferrer">CIAAW standard atomic weights</a> for current values and isotope-dependent ranges.</p>
      </div>
      <PeriodicTable />
    </section>
  );
}
