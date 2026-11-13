import { useState } from "react";
import { classifySubstance } from "../lib/chemistryTools";
import ToolPage from "../components/ToolPage";

const descriptions = {
  Acid: "This formula is commonly classified as an acid. Acids donate hydrogen ions (H⁺) in water.",
  Base: "This formula is commonly classified as a base. Bases accept hydrogen ions or produce hydroxide ions (OH⁻) in water.",
  Salt: "This formula is commonly classified as a salt: an ionic compound made from positive and negative ions.",
  "Neutral / other": "This formula is not identified as a typical acid, base, or salt by the introductory classification rules.",
};

export default function AcidBaseSaltPage() {
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<keyof typeof descriptions | null>(null);
  const [error, setError] = useState("");

  const determine = () => {
    try {
      setResult(classifySubstance(formula));
      setError("");
    } catch (issue) {
      setResult(null);
      setError(issue instanceof Error ? issue.message : "Could not read this formula.");
    }
  };

  return (
    <ToolPage
      eyebrow="Compound identifier"
      title="Acid, Base & Salt Determiner"
      description="Enter a chemical formula to see its common introductory classification."
    >
      <label htmlFor="compound-formula" className="mb-2 block text-sm font-semibold text-slate-700">Chemical formula</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="compound-formula"
          value={formula}
          onChange={(event) => setFormula(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") determine();
          }}
          placeholder="e.g. HCl, NaOH, CaCO3"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
        <button type="button" onClick={determine} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
          Determine type
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["HCl", "H2SO4", "NaOH", "Ca(OH)2", "NaCl", "CaCO3"].map((example) => (
          <button key={example} type="button" onClick={() => { setFormula(example); setResult(null); setError(""); }} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100">
            {example}
          </button>
        ))}
      </div>
      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
      {result && (
        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Likely classification</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{result}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{descriptions[result]}</p>
        </div>
      )}
      <p className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        This is a learning aid based on common formula patterns, not a complete chemical database. Some compounds are amphoteric or have behavior that depends on the solvent and reaction conditions.
      </p>
    </ToolPage>
  );
}
