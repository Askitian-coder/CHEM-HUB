import { useState } from "react";
import { determineOxidationNumbers } from "../lib/chemistryTools";
import type { OxidationNumber } from "../lib/chemistryTools";
import ToolPage from "../components/ToolPage";

export default function OxidationNumbersPage() {
  const [formula, setFormula] = useState("");
  const [results, setResults] = useState<OxidationNumber[] | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    try {
      setResults(determineOxidationNumbers(formula));
      setError("");
    } catch (issue) {
      setResults(null);
      setError(issue instanceof Error ? issue.message : "Could not calculate oxidation numbers.");
    }
  };

  return (
    <ToolPage
      eyebrow="Number explorer"
      title="Oxidation Number Calculator"
      description="Apply common oxidation-number rules and solve the remaining value from the formula's total charge."
    >
      <label htmlFor="oxidation-formula" className="mb-2 block text-sm font-semibold text-slate-700">Formula or ion</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="oxidation-formula"
          value={formula}
          onChange={(event) => setFormula(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") calculate();
          }}
          placeholder="e.g. H2SO4, KMnO4, SO4^2-"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
        <button type="button" onClick={calculate} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
          Calculate numbers
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">For ions, write the charge after a caret, such as SO4^2- or NH4^+.</p>
      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
      {results && (
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <div className="grid grid-cols-[1fr_1fr_2fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Element</span><span>Oxidation number</span><span>Rule / note</span>
          </div>
          {results.map((result) => (
            <div key={result.symbol} className="grid grid-cols-[1fr_1fr_2fr] items-start gap-2 border-t border-slate-100 px-4 py-3 text-sm">
              <span className="font-semibold text-slate-900">{result.name} ({result.symbol})</span>
              <span className={`font-bold ${result.value === null ? "text-amber-700" : "text-indigo-700"}`}>{result.value ?? "Variable"}</span>
              <span className="text-xs leading-5 text-slate-500">{result.note ?? "Calculated so all oxidation numbers add to the overall charge."}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        The calculator uses common rules: an uncombined element is 0, fluorine is usually −1, oxygen −2, hydrogen +1, and the sum equals the compound or ion's charge. Mixed-valence formulas can have more than one valid oxidation number and are marked as variable.
      </div>
    </ToolPage>
  );
}
