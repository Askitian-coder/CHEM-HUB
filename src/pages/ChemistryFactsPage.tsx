import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ToolPage from "../components/ToolPage";
import { CHEMISTRY_FACTS } from "../data/chemistryFacts";

type TopicFilter = "All topics" | string;

const topicFilters: TopicFilter[] = [
  "All topics",
  ...new Set(CHEMISTRY_FACTS.map((item) => item.topic)),
];

export default function ChemistryFactsPage() {
  const [topic, setTopic] = useState<TopicFilter>("All topics");
  const [search, setSearch] = useState("");

  const facts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CHEMISTRY_FACTS.filter((item) => {
      const matchesTopic = topic === "All topics" || item.topic === topic;
      const searchable = [
        item.title,
        item.topic,
        item.fact,
        item.whyItMatters,
        item.misconception?.claim ?? "",
        item.misconception?.correction ?? "",
      ].join(" ").toLowerCase();
      return matchesTopic && (!query || searchable.includes(query));
    });
  }, [search, topic]);

  return (
    <ToolPage
      eyebrow="Chemistry field notes"
      title="Chemistry Facts & Insights"
      description="Memorable chemistry facts, the science behind them, and quick myth-busters to help ideas stick."
    >
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:p-5">
        <p className="text-sm font-bold text-indigo-800">How to use this guide</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          Start with a surprising fact, then connect it to the chemistry rule. Open a common mix-up to test whether you can explain the idea in your own words.
        </p>
      </div>

      <label htmlFor="fact-search" className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
        Search facts
      </label>
      <input
        id="fact-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Try “water”, “catalyst”, “pH”, or “electrons”"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter facts by topic">
        {topicFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={topic === filter}
            onClick={() => setTopic(filter)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              topic === filter
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-slate-500" aria-live="polite">
        {facts.length} {facts.length === 1 ? "fact" : "facts"}
      </p>

      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {facts.map((item) => (
          <article key={item.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{item.topic}</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h2>
            <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-3 text-sm font-medium leading-6 text-indigo-900">
              {item.fact}
            </p>
            <div className="mt-3 flex-1">
              <p className="text-sm font-semibold text-slate-800">Why it matters</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.whyItMatters}</p>
            </div>

            {item.misconception && (
              <details className="mt-4 rounded-lg border border-slate-200">
                <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
                  Check a common mix-up
                </summary>
                <div className="space-y-2 px-3 pb-3 text-sm leading-5">
                  <p className="text-slate-600"><strong>Easy mistake:</strong> {item.misconception.claim}</p>
                  <p className="text-slate-800"><strong>Remember:</strong> {item.misconception.correction}</p>
                </div>
              </details>
            )}

            {item.relatedTool && (
              <Link
                to={item.relatedTool.path}
                className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-indigo-700 hover:text-indigo-900"
              >
                {item.relatedTool.label} <span aria-hidden="true">→</span>
              </Link>
            )}
          </article>
        ))}
      </div>
      {facts.length === 0 && (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          No facts match that search. Try another word or choose a different topic.
        </p>
      )}
      <p className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        Facts are starting points for understanding, not substitutes for checking reaction conditions, units, and lab instructions.
      </p>
    </ToolPage>
  );
}
