import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ToolPage from "../components/ToolPage";
import { CONCEPT_MAPS, type ConceptMapTopic } from "../data/conceptMaps";

type TopicFilter = "All topics" | ConceptMapTopic;

const topicFilters: TopicFilter[] = [
  "All topics",
  "Electrochemistry",
  "Acids, bases & salts",
];

export default function ConceptMapsPage() {
  const [topic, setTopic] = useState<TopicFilter>("All topics");
  const [search, setSearch] = useState("");

  const maps = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CONCEPT_MAPS.filter((map) => {
      const matchesTopic = topic === "All topics" || map.topic === topic;
      const searchable = [
        map.title,
        map.description,
        map.topic,
        ...map.sections.flatMap((section) => [section.heading, ...section.points]),
      ].join(" ").toLowerCase();
      return matchesTopic && (!query || searchable.includes(query));
    });
  }, [search, topic]);

  return (
    <ToolPage
      eyebrow="Visual study guide"
      title="Chemistry Concept Maps"
      description="Explore every map from your document, with the ideas unpacked into clear, searchable study notes."
    >
      <label htmlFor="concept-map-search" className="mb-2 block text-sm font-semibold text-slate-700">
        Search concepts
      </label>
      <input
        id="concept-map-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Try “salt bridge”, “indicator”, or “electrolysis”"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter concept maps">
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
        {maps.length} {maps.length === 1 ? "concept map" : "concept maps"}
      </p>

      <div className="mt-3 space-y-5">
        {maps.map((map) => (
          <article key={map.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{map.topic}</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{map.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{map.description}</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {map.sections.map((section) => (
                <section key={section.heading} className="rounded-xl bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-900">{section.heading}</h3>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {section.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </section>
              ))}
            </div>

            <details className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <summary className="cursor-pointer bg-slate-50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
                Open the original visual map
              </summary>
              <a href={map.image} target="_blank" rel="noreferrer" className="block bg-white p-2">
                <img
                  src={map.image}
                  alt={map.imageAlt}
                  loading="lazy"
                  className="mx-auto h-auto max-h-[34rem] w-full object-contain"
                />
              </a>
            </details>

            <div className="mt-4 flex flex-wrap gap-2">
              {map.relatedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
      {maps.length === 0 && (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          No concepts match that search. Try another word or choose a different topic.
        </p>
      )}
      <p className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        Chemistry patterns help you remember the rules, but real reactions can depend on conditions. Check the notes, balance equations, and use safe laboratory practice.
      </p>
    </ToolPage>
  );
}
