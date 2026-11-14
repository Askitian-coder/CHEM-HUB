import { Link } from "react-router-dom";
import { getDailyChemistryFact } from "../data/chemistryFacts";

const tools = [
  { title: "Periodic Table", description: "Explore all 118 elements and their properties.", path: "/periodic-table", icon: "⚛️", color: "bg-sky-50 text-sky-700 ring-sky-100", iconColor: "bg-sky-100" },
  { title: "Electron Configuration", description: "Find electron configurations and noble-gas shorthand for elements 1–36.", path: "/electron-configuration", icon: "e⁻", color: "bg-sky-50 text-sky-700 ring-sky-100", iconColor: "bg-sky-100" },
  { title: "Unit Converter", description: "Switch between the units used in chemistry.", path: "/converter", icon: "⇄", color: "bg-violet-50 text-violet-700 ring-violet-100", iconColor: "bg-violet-100" },
  { title: "Formula Sheets", description: "Find the equations you need for each topic.", path: "/formulas", icon: "∑", color: "bg-emerald-50 text-emerald-700 ring-emerald-100", iconColor: "bg-emerald-100" },
  { title: "Concept Maps", description: "Review visual guides to electrochemistry, acids, bases, and salts.", path: "/concept-maps", icon: "⌘", color: "bg-blue-50 text-blue-700 ring-blue-100", iconColor: "bg-blue-100" },
  { title: "Chemistry Facts", description: "Discover surprising facts and clear up common chemistry myths.", path: "/chemistry-facts", icon: "✦", color: "bg-lime-50 text-lime-800 ring-lime-100", iconColor: "bg-lime-100" },
  { title: "Study Progress", description: "Track chemistry topics, study days, and your learning streak.", path: "/study-progress", icon: "✓", color: "bg-indigo-50 text-indigo-700 ring-indigo-100", iconColor: "bg-indigo-100" },
  { title: "Practice Quizzes", description: "Practise original chemistry questions with explanations and textbook-topic references.", path: `${import.meta.env.BASE_URL}tools/practice-quiz-v2.html`, external: true, icon: "?", color: "bg-violet-50 text-violet-700 ring-violet-100", iconColor: "bg-violet-100" },
  { title: "Molar Mass", description: "Calculate formula mass with clear working.", path: "/calculators/molar-mass", icon: "⚖️", color: "bg-amber-50 text-amber-800 ring-amber-100", iconColor: "bg-amber-100" },
  { title: "Mole Converter", description: "Convert between grams, moles, and particles with clear working.", path: "/calculators/mole-converter", icon: "mol", color: "bg-amber-50 text-amber-800 ring-amber-100", iconColor: "bg-amber-100" },
  { title: "Stoichiometry", description: "Work through mole ratios and reaction yields.", path: "/calculators/stoichiometry", icon: "🧪", color: "bg-rose-50 text-rose-700 ring-rose-100", iconColor: "bg-rose-100" },
  { title: "Concentration", description: "Solve molarity, mass concentration, and dilution.", path: "/calculators/concentration", icon: "◉", color: "bg-indigo-50 text-indigo-700 ring-indigo-100", iconColor: "bg-indigo-100" },
  { title: "Equation Balancer", description: "Balance chemical equations and check each element's atom count.", path: "/calculators/equation-balancer", icon: "⇌", color: "bg-cyan-50 text-cyan-800 ring-cyan-100", iconColor: "bg-cyan-100" },
  { title: "Redox Balancer", description: "Balance atoms and charge in redox equations.", path: "/redox", icon: "⇌", color: "bg-cyan-50 text-cyan-800 ring-cyan-100", iconColor: "bg-cyan-100" },
  { title: "Acids, Bases & Salts", description: "Identify common compound types from their formulas.", path: "/acid-base-salts", icon: "pH", color: "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-100", iconColor: "bg-fuchsia-100" },
  { title: "Oxidation Numbers", description: "Work out oxidation numbers with familiar chemistry rules.", path: "/oxidation-numbers", icon: "±", color: "bg-teal-50 text-teal-800 ring-teal-100", iconColor: "bg-teal-100" },
];

export default function HomePage() {
  const dailyFact = getDailyChemistryFact();

  return (
    <div className="py-4 sm:py-8">
      <section className="mb-10 rounded-3xl bg-gradient-to-br from-indigo-700 to-indigo-500 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-100">Learn it. Calculate it. Understand it.</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">ChemHub by Askitian</h1>
        <p className="mt-4 max-w-2xl text-lg text-indigo-100">Welcome to ChemHub — your chemistry study companion.</p>
      </section>
      <section className="mb-10 grid gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6" aria-labelledby="daily-chemistry-fact">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-2xl text-indigo-700" aria-hidden="true">⚗</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Today's chemistry spark · {dailyFact.topic}
          </p>
          <h2 id="daily-chemistry-fact" className="mt-1 text-xl font-bold text-slate-900">{dailyFact.title}</h2>
          {dailyFact.scientist && (
            <p className="mt-1 text-sm font-semibold text-amber-800">
              People in this story: {dailyFact.scientist.names}
            </p>
          )}
          <p className="mt-2 text-sm leading-6 text-slate-700">{dailyFact.fact}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{dailyFact.whyItMatters}</p>
        </div>
        <Link
          to="/chemistry-facts"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 sm:whitespace-nowrap"
        >
          Explore facts & discoveries <span aria-hidden="true">→</span>
        </Link>
      </section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">Your chemistry toolkit</h2>
        <p className="mt-1 text-slate-600">Pick a tool and make your next study session easier.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const contents = (
            <>
              <span className={`grid h-12 w-12 place-items-center rounded-xl text-2xl ${tool.iconColor}`} aria-hidden="true">{tool.icon}</span>
              <h3 className="mt-4 text-lg font-bold">{tool.title}<span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></h3>
              <p className="mt-2 text-sm leading-6 opacity-80">{tool.description}</p>
            </>
          );
          const className = `group rounded-2xl p-5 shadow-sm ring-1 transition duration-200 hover:-translate-y-1 hover:shadow-md ${tool.color}`;
          return tool.external ? (
            <a key={tool.path} href={tool.path} className={className}>{contents}</a>
          ) : (
            <Link key={tool.path} to={tool.path} className={className}>{contents}</Link>
          );
        })}
      </div>
    </div>
  );
}
