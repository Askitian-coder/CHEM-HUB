import { useMemo, useState } from "react";
import ToolPage from "../components/ToolPage";
import { FORMULA_SHEETS } from "../data/formulaSheets";

export default function FormulaSheetsPage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All topics");
  const topics = ["All topics", ...new Set(FORMULA_SHEETS.map((sheet) => sheet.topic))];

  const matches = useMemo(() => {
    const query = search.trim().toLowerCase();
    return FORMULA_SHEETS.filter((sheet) => {
      const matchesTopic = topic === "All topics" || sheet.topic === topic;
      const searchable = `${sheet.title} ${sheet.topic} ${sheet.equation} ${sheet.variables} ${sheet.use}`.toLowerCase();
      return matchesTopic && (!query || searchable.includes(query));
    });
  }, [search, topic]);

  return (
    <ToolPage
      eyebrow="Study reference"
      title="Chemistry Formula Sheets"
      description="Search key high-school chemistry equations, when to use them, and quick worked examples."
    >
      <label htmlFor="formula-search" className="mb-2 block text-sm font-semibold text-slate-700">
        Search formulas
      </label>
      <div className="flex gap-2">
        <input
          id="formula-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Try “molarity”, “gas”, or “yield”"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter formulas by topic">
        {topics.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={topic === item}
            onClick={() => setTopic(item)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              topic === item
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-slate-500" aria-live="polite">
        {matches.length} {matches.length === 1 ? "formula" : "formulas"}
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {matches.map((sheet) => (
          <article key={sheet.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{sheet.topic}</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{sheet.title}</h2>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 font-mono text-lg font-bold text-indigo-800">
              {sheet.equation}
            </p>
            <p className="mt-3 text-sm leading-5 text-slate-600">{sheet.variables}</p>
            <p className="mt-3 text-sm leading-5 text-slate-600">{sheet.use}</p>
            <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-5 text-slate-700">
              <span className="font-semibold">Example:</span> {sheet.example}
            </p>
          </article>
        ))}
      </div>
      {matches.length === 0 && (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          No formulas match that search. Try another keyword or clear the topic filter.
        </p>
      )}
      <p className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        Always check that units are consistent before substituting numbers. In gas laws, temperature must be in kelvin; in molarity, volume must be in litres.
      </p>
    </ToolPage>
  );
}
